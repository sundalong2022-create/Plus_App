import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const audioRoot = path.join(rootDir, "miniprogram", "assets", "audio");
const tempRoot = path.join(rootDir, "tmp", "audio");
const VOICE_NAME = "Flo (中文（中国大陆）)";
const SPEECH_RATE = {
  narration: 160,
  question: 168,
  reward: 174
};

const dayPlans = [
  { day: 1, title: "第1天：学习1和2", targetTables: [1, 2] },
  { day: 2, title: "第2天：学习5和10", targetTables: [5, 10] },
  { day: 3, title: "第3天：学习3的口诀", targetTables: [3] },
  { day: 4, title: "第4天：学习4的口诀", targetTables: [4] },
  { day: 5, title: "第5天：学习6的口诀", targetTables: [6] },
  { day: 6, title: "第6天：学习7和8", targetTables: [7, 8] },
  { day: 7, title: "第7天：学习9并总复习", targetTables: [9] }
];

const chineseDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

const toChineseNumber = (value) => {
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
};

const buildRhymeText = (table, multiplier, answer) => {
  if (table === 10) {
    return `十乘${toChineseNumber(multiplier)}，得${toChineseNumber(answer)}`;
  }

  return `${toChineseNumber(table)}${toChineseNumber(multiplier)}，得${toChineseNumber(answer)}`;
};

const buildQuestionPrompt = (table, multiplier) => {
  if (table === 10) {
    return `十乘${toChineseNumber(multiplier)}，等于几？`;
  }

  return `${toChineseNumber(table)}乘${toChineseNumber(multiplier)}，等于几？`;
};

const questionBank = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9].flatMap((table) =>
  Array.from({ length: 9 }, (_, index) => {
    const multiplier = index + 1;
    const answer = table * multiplier;

    return {
      id: `q_${table}x${multiplier}`,
      table,
      multiplier,
      rhymeText: buildRhymeText(table, multiplier, answer),
      promptText: buildQuestionPrompt(table, multiplier)
    };
  })
);

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

const ensureCleanDir = (dirPath) => {
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true, force: true });
  }

  mkdirSync(dirPath, { recursive: true });
};

const synthesize = (text, outputPath, options = {}) => {
  const aiffPath = path.join(tempRoot, `${path.basename(outputPath, ".m4a")}.aiff`);
  const voiceName = options.voiceName || VOICE_NAME;
  const speechRate = String(options.speechRate || SPEECH_RATE.question);

  execFileSync("say", ["-v", voiceName, "-r", speechRate, "-o", aiffPath, text], { stdio: "ignore" });
  execFileSync("afconvert", ["-f", "m4af", "-d", "aac", aiffPath, outputPath], { stdio: "ignore" });
};

ensureCleanDir(audioRoot);
ensureCleanDir(tempRoot);
mkdirSync(path.join(audioRoot, "learn"), { recursive: true });
mkdirSync(path.join(audioRoot, "questions"), { recursive: true });
mkdirSync(path.join(audioRoot, "system"), { recursive: true });

dayPlans.forEach((dayPlan) => {
  const rhymes = questionBank.filter((question) => dayPlan.targetTables.includes(question.table));
  const rhymeSpeech = rhymes.map((question) => question.rhymeText).join("。");
  const tipSpeech = dayPlan.targetTables.map((table) => tipsByTable[table]).join("。");
  const spokenTitle = dayPlan.title.replace("：", "，");
  const text = `${spokenTitle}。我们先慢一点，一起读今天的口诀。${rhymeSpeech}。再记一个小提醒。${tipSpeech}。准备好了，就开始吧。`;
  const outputPath = path.join(audioRoot, "learn", `day_${dayPlan.day}.m4a`);
  synthesize(text, outputPath, { speechRate: SPEECH_RATE.narration });
});

questionBank.forEach((question) => {
  const outputPath = path.join(audioRoot, "questions", `${question.id}_prompt.m4a`);
  synthesize(question.promptText, outputPath, { speechRate: SPEECH_RATE.question });
});

synthesize("太棒了，完成啦。今天又进步了一点。", path.join(audioRoot, "system", "reward_complete.m4a"), {
  speechRate: SPEECH_RATE.reward
});
synthesize("配对完成，做得真棒。", path.join(audioRoot, "system", "reward_match.m4a"), {
  speechRate: SPEECH_RATE.reward
});

console.log("Audio assets generated at", audioRoot);
