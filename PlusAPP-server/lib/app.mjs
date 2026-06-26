import { randomUUID, createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getDayPlan, getQuestionById, getQuestionsByTables, mockApi } from "../mock-api.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv(join(__dirname, "..", ".env"));

const LOGIN_MODE = process.env.WECHAT_LOGIN_MODE === "live" ? "live" : "mock";
const APP_ID = process.env.WECHAT_APP_ID || "";
const APP_SECRET = process.env.WECHAT_APP_SECRET || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const OPENAI_TTS_VOICE = process.env.OPENAI_TTS_VOICE || "marin";
const OPENAI_TTS_FORMAT = process.env.OPENAI_TTS_FORMAT || "mp3";
const OPENAI_TTS_INSTRUCTIONS =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  "请用自然、温柔、适合一年级小学生的普通话朗读，语速稍慢一点，吐字清楚，语气鼓励但不要太夸张。";
const OPENAI_TTS_ENDPOINT = "https://api.openai.com/v1/audio/speech";
const TTS_CACHE_DIR = join(process.env.TTS_CACHE_DIR || "/tmp", "plusapp-tts");
const sessions = new Map();

mkdirSync(TTS_CACHE_DIR, { recursive: true });

const tipsByTable = {
  1: "一的口诀最简单，乘几还是几。",
  2: "二的口诀像双倍，结果都是双数。",
  3: "三个一组，连续加三。",
  4: "四可以看成二的双倍。",
  5: "五的口诀，个位常常是零或者五。",
  6: "六的口诀先记前半段，再记后半段。",
  7: "七的口诀容易混，先记最常用几题。",
  8: "八的口诀可以和四的口诀对照着记。",
  9: "九的口诀里，很多答案的数位和等于九。",
  10: "十乘几，结果后面常常直接加零。"
};

const systemSpeechText = {
  rewardComplete: "太棒了，完成啦。今天又进步了一点。",
  rewardMatch: "配对完成，做得真棒。"
};

const chineseDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function loadEnv(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function toChineseNumber(value) {
  if (value < 10) {
    return chineseDigits[value];
  }

  if (value === 10) {
    return "十";
  }

  if (value < 20) {
    return `十${chineseDigits[value - 10]}`;
  }

  const tens = Math.floor(value / 10);
  const units = value % 10;

  return units === 0 ? `${chineseDigits[tens]}十` : `${chineseDigits[tens]}十${chineseDigits[units]}`;
}

function buildQuestionPrompt(question) {
  if (!question) {
    throw new Error("Question not found");
  }

  if (question.table === 10) {
    return `十乘${toChineseNumber(question.multiplier)}，等于几？`;
  }

  return `${toChineseNumber(question.table)}乘${toChineseNumber(question.multiplier)}，等于几？`;
}

function buildDayNarration(day) {
  const dayPlan = getDayPlan(day);

  if (!dayPlan) {
    throw new Error("Day plan not found");
  }

  const rhymes = getQuestionsByTables(dayPlan.targetTables);
  const rhymeSpeech = rhymes.map((question) => question.rhymeText).join("。");
  const tipSpeech = dayPlan.targetTables
    .map((table) => tipsByTable[table])
    .filter(Boolean)
    .join("。");
  const spokenTitle = dayPlan.title.replace("：", "，");

  return `${spokenTitle}。我们先慢一点，一起读今天的口诀。${rhymeSpeech}。再记一个小提醒。${tipSpeech}。准备好了，就开始吧。`;
}

function resolveTtsPayload(pathname, requestUrl) {
  if (pathname === "/api/tts/day") {
    const day = Number(requestUrl.searchParams.get("day") || 1);

    if (!Number.isFinite(day) || day <= 0) {
      throw new Error("Invalid day");
    }

    return {
      cacheKey: `day_${day}`,
      text: buildDayNarration(day)
    };
  }

  if (pathname === "/api/tts/question") {
    const questionId = (requestUrl.searchParams.get("questionId") || "").trim();

    if (!questionId) {
      throw new Error("questionId is required");
    }

    const question = getQuestionById(questionId);

    return {
      cacheKey: `question_${questionId}`,
      text: buildQuestionPrompt(question)
    };
  }

  if (pathname === "/api/tts/system") {
    const key = (requestUrl.searchParams.get("key") || "").trim();

    if (!systemSpeechText[key]) {
      throw new Error("Invalid system speech key");
    }

    return {
      cacheKey: `system_${key}`,
      text: systemSpeechText[key]
    };
  }

  throw new Error("Unsupported TTS route");
}

function resolveAudioContentType(format) {
  const normalizedFormat = format.toLowerCase();

  if (normalizedFormat === "wav") {
    return "audio/wav";
  }

  if (normalizedFormat === "aac") {
    return "audio/aac";
  }

  if (normalizedFormat === "opus") {
    return "audio/ogg";
  }

  if (normalizedFormat === "flac") {
    return "audio/flac";
  }

  return "audio/mpeg";
}

function buildTtsCachePath(cacheKey, text) {
  const signature = createHash("sha1")
    .update(
      JSON.stringify({
        model: OPENAI_TTS_MODEL,
        voice: OPENAI_TTS_VOICE,
        format: OPENAI_TTS_FORMAT,
        instructions: OPENAI_TTS_INSTRUCTIONS,
        text
      })
    )
    .digest("hex")
    .slice(0, 16);

  return join(TTS_CACHE_DIR, `${cacheKey}_${signature}.${OPENAI_TTS_FORMAT}`);
}

async function synthesizeSpeech(text) {
  if (!OPENAI_API_KEY) {
    throw new Error("Cloud TTS unavailable: missing OPENAI_API_KEY");
  }

  const response = await fetch(OPENAI_TTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_TTS_MODEL,
      voice: OPENAI_TTS_VOICE,
      input: text,
      instructions: OPENAI_TTS_INSTRUCTIONS,
      response_format: OPENAI_TTS_FORMAT
    })
  });

  if (!response.ok) {
    let errorCode = "";

    try {
      const errorPayload = await response.json();
      errorCode = errorPayload?.error?.code || "";
    } catch {
      errorCode = "";
    }

    if (errorCode === "invalid_api_key") {
      throw new Error("Cloud TTS unavailable: invalid OPENAI_API_KEY");
    }

    if (errorCode === "insufficient_quota") {
      throw new Error("Cloud TTS unavailable: OpenAI quota exceeded");
    }

    throw new Error(`Cloud TTS unavailable: upstream status ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function getOrCreateTtsBuffer(cacheKey, text) {
  const cachePath = buildTtsCachePath(cacheKey, text);

  if (existsSync(cachePath)) {
    return readFileSync(cachePath);
  }

  const buffer = await synthesizeSpeech(text);
  writeFileSync(cachePath, buffer);
  return buffer;
}

function sendAudio(res, statusCode, buffer) {
  res.writeHead(statusCode, {
    "Content-Type": resolveAudioContentType(OPENAI_TTS_FORMAT),
    "Content-Length": buffer.length,
    "Cache-Control": "public, max-age=2592000, immutable",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  res.end(buffer);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

function getTokenFromRequest(req) {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

function requireSession(req, res) {
  const token = getTokenFromRequest(req);

  if (!token) {
    sendJson(res, 401, { ok: false, error: { message: "Unauthorized" } });
    return null;
  }

  if (!sessions.has(token) && LOGIN_MODE === "mock") {
    const session = {
      token,
      openid: createMockOpenId(token),
      sessionKey: "mock_session_key",
      unionid: "",
      loginAt: new Date().toISOString()
    };

    sessions.set(token, session);
  }

  if (!sessions.has(token)) {
    sendJson(res, 401, { ok: false, error: { message: "Unauthorized" } });
    return null;
  }

  return sessions.get(token);
}

function createMockOpenId(code) {
  return `mock_${createHash("sha1").update(code).digest("hex").slice(0, 16)}`;
}

async function exchangeCodeForSession(code) {
  if (LOGIN_MODE === "mock") {
    return {
      openid: createMockOpenId(code),
      sessionKey: "mock_session_key"
    };
  }

  if (!APP_ID || !APP_SECRET) {
    throw new Error("Missing WECHAT_APP_ID or WECHAT_APP_SECRET");
  }

  const url = new URL("https://api.weixin.qq.com/sns/jscode2session");
  url.searchParams.set("appid", APP_ID);
  url.searchParams.set("secret", APP_SECRET);
  url.searchParams.set("js_code", code);
  url.searchParams.set("grant_type", "authorization_code");

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok || result.errcode) {
    throw new Error(result.errmsg || `WeChat login failed with status ${response.status}`);
  }

  return {
    openid: result.openid,
    sessionKey: result.session_key,
    unionid: result.unionid
  };
}

function createAppSession(loginResult) {
  const token = randomUUID();
  const session = {
    token,
    openid: loginResult.openid,
    sessionKey: loginResult.sessionKey,
    unionid: loginResult.unionid || "",
    loginAt: new Date().toISOString()
  };

  sessions.set(token, session);
  return session;
}

export async function handleRequest(req, res) {
  if (!req.url) {
    sendJson(res, 400, { ok: false, error: { message: "Missing request url" } });
    return;
  }

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  const { pathname } = requestUrl;

  try {
    if (req.method === "GET" && pathname === "/") {
      sendJson(res, 200, {
        ok: true,
        data: {
          service: "plusapp-server",
          status: "running",
          mode: LOGIN_MODE
        }
      });
      return;
    }

    if (req.method === "GET" && pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        data: {
          service: "plusapp-server",
          mode: LOGIN_MODE,
          port: Number(process.env.PORT || 0),
          hasAppId: Boolean(APP_ID),
          hasAppSecret: Boolean(APP_SECRET),
          hasOpenAiKey: Boolean(OPENAI_API_KEY),
          ttsModel: OPENAI_TTS_MODEL,
          ttsVoice: OPENAI_TTS_VOICE,
          ttsFormat: OPENAI_TTS_FORMAT,
          hasMockApi: true,
          mockSource: "embedded"
        }
      });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/tts/")) {
      const { cacheKey, text } = resolveTtsPayload(pathname, requestUrl);
      const buffer = await getOrCreateTtsBuffer(cacheKey, text);
      sendAudio(res, 200, buffer);
      return;
    }

    if (req.method === "POST" && pathname === "/api/wx/login") {
      const body = await readJsonBody(req);
      const code = typeof body.code === "string" ? body.code.trim() : "";

      if (!code) {
        sendJson(res, 400, { ok: false, error: { message: "code is required" } });
        return;
      }

      const loginResult = await exchangeCodeForSession(code);
      const session = createAppSession(loginResult);

      sendJson(res, 200, {
        ok: true,
        data: {
          token: session.token,
          user: {
            openid: session.openid
          },
          mode: LOGIN_MODE
        }
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/me") {
      const session = requireSession(req, res);

      if (!session) {
        return;
      }

      sendJson(res, 200, {
        ok: true,
        data: {
          user: {
            openid: session.openid
          },
          loginAt: session.loginAt,
          mode: LOGIN_MODE
        }
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/logout") {
      const token = getTokenFromRequest(req);

      if (token) {
        sessions.delete(token);
      }

      sendJson(res, 200, {
        ok: true,
        data: {
          success: true
        }
      });
      return;
    }

    const session = requireSession(req, res);

    if (!session) {
      return;
    }

    if (req.method === "GET" && pathname === "/api/app/init") {
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.app.init()
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/home/today") {
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.home.today()
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/learn/content") {
      const day = Number(requestUrl.searchParams.get("day") || 1);
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.learn.content(day)
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/progress/mark-task") {
      const body = await readJsonBody(req);
      await mockApi.progress.markTask(body.taskType, body.status);
      sendJson(res, 200, {
        ok: true,
        data: null
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/progress/reset-all") {
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.progress.resetAll()
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/session/start") {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.session.start(body)
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/session/answer") {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.session.answer(body)
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/session/finish") {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.session.finish(body.sessionId)
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/session/latest-result") {
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.session.latestResult()
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/wrongbook") {
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.wrongbook.list()
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/wrongbook/review-start") {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.wrongbook.reviewStart(body.mode, body.limit)
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/parent/dashboard") {
      sendJson(res, 200, {
        ok: true,
        data: await mockApi.parent.dashboard()
      });
      return;
    }

    sendJson(res, 404, { ok: false, error: { message: "Not Found" } });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown server error"
      }
    });
  }
}
