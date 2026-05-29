import { getDayPlan, dayPlans } from "../mock/plan";
import { getQuestionById, getQuestionsByTables, questionBank } from "../mock/question-bank";
import { initialProgressState } from "../mock/user-progress";
import { initialWrongItems } from "../mock/wrongbook";
import type {
  AppInitResponse,
  GameType,
  LearnContentResponse,
  MatchCard,
  ParentDashboardResponse,
  ProgressState,
  Question,
  SessionAnswerRequest,
  SessionAnswerResponse,
  SessionFinishResponse,
  SessionRecord,
  SessionStartRequest,
  SessionStartResponse,
  TaskStatus,
  TodayTaskResponse,
  WrongItem,
  WrongReviewStartResponse,
  WrongbookResponse
} from "../types/api";
import { getAuthToken } from "./auth";
import { getApiBaseUrl } from "./config";
import { deepClone, readStorage, STORAGE_KEYS, writeStorage } from "./storage";

const MOCK_DELAY = 120;
const REMOTE_TIMEOUT = 1800;

interface ApiEnvelope<T> {
  ok: boolean;
  data: T;
  error?: {
    message: string;
  };
}

const user = {
  userId: "u_001",
  nickname: "小朋友"
};

let progressState = readStorage<ProgressState>(STORAGE_KEYS.progress, initialProgressState);
let wrongItemsState = readStorage<WrongItem[]>(STORAGE_KEYS.wrongbook, initialWrongItems);
let sessionsState = readStorage<SessionRecord[]>(STORAGE_KEYS.sessions, []);
let latestResultState = readStorage<SessionFinishResponse | null>(STORAGE_KEYS.latestResult, null);

const buildDefaultTaskStatus = (): ProgressState["todayTaskStatus"] => ({
  review: "todo",
  learn: "todo",
  quiz: "todo",
  match: "todo",
  level: "todo",
  wrongReview: "todo"
});

const tipsByTable: Record<number, string[]> = {
  1: ["1的口诀最简单，乘几还是几。"],
  2: ["2的口诀像双倍，结果都是双数。"],
  3: ["3个一组，连续加3。"],
  4: ["4可以看成2的双倍。"],
  5: ["5的口诀，个位常常是0或5。"],
  6: ["6的口诀先记前半段，再记后半段。"],
  7: ["7的口诀容易混，先记最常用几题。"],
  8: ["8的口诀可以和4的口诀对照着记。"],
  9: ["9的口诀里，很多答案的数位和等于9。"],
  10: ["10乘几，结果后面常常直接加0。"]
};

const wait = <T>(value: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(deepClone(value)), MOCK_DELAY);
  });

const persistState = (): void => {
  writeStorage(STORAGE_KEYS.progress, progressState);
  writeStorage(STORAGE_KEYS.wrongbook, wrongItemsState);
  writeStorage(STORAGE_KEYS.sessions, sessionsState);
  writeStorage(STORAGE_KEYS.latestResult, latestResultState);
};

const buildTodayTaskStatus = (): TaskStatus => {
  const statuses = getDayPlan(progressState.currentDay).tasks.map(
    (task) => progressState.todayTaskStatus[task.type] || "todo"
  );
  if (statuses.every((item) => item === "done")) {
    return "done";
  }

  if (statuses.some((item) => item === "doing")) {
    return "doing";
  }

  return "todo";
};

const buildTodayTasks = (): TodayTaskResponse => {
  const dayPlan = getDayPlan(progressState.currentDay);
  const todayTasks = dayPlan.tasks.map((task) => ({
    ...task,
    status: progressState.todayTaskStatus[task.type] || "todo"
  }));
  const doneCount = todayTasks.filter((task) => task.status === "done").length;

  return {
    currentDay: progressState.currentDay,
    dayTitle: dayPlan.title,
    todayProgress: Math.round((doneCount / todayTasks.length) * 100),
    todayTasks
  };
};

const uniqueByQuestionId = (questions: Question[]): Question[] => {
  const seen = new Set<string>();
  return questions.filter((question) => {
    if (seen.has(question.id)) {
      return false;
    }

    seen.add(question.id);
    return true;
  });
};

const buildVisualExample = (question: Question): LearnContentResponse["visualExample"] => {
  const expressionText = Array.from({ length: question.multiplier }, () => String(question.table)).join("+");

  return {
    formula: question.formula,
    displayType: "dots",
    expressionText: `${expressionText}=${question.answer}`
  };
};

const getLearnContent = (day: number): LearnContentResponse => {
  const dayPlan = getDayPlan(day);
  const rhymes = getQuestionsByTables(dayPlan.targetTables);
  const exampleQuestion = rhymes.find((item) => item.multiplier === 4) || rhymes[0];
  const tips = dayPlan.targetTables.flatMap((table) => tipsByTable[table] || []).slice(0, 3);

  return {
    day,
    dayTitle: dayPlan.title,
    targetTables: dayPlan.targetTables,
    rhymes,
    visualExample: buildVisualExample(exampleQuestion),
    tips
  };
};

const getReviewQuestions = (day: number): Question[] => {
  const reviewTables = dayPlans
    .filter((item) => item.day < day)
    .flatMap((item) => item.targetTables);

  return questionBank.filter((item) => reviewTables.includes(item.table) && item.multiplier <= 5);
};

const getWrongQuestions = (): Question[] => {
  return wrongItemsState
    .filter((item) => !item.mastered)
    .sort((a, b) => b.continuousWrongCount - a.continuousWrongCount)
    .map((item) => getQuestionById(item.questionId))
    .filter((item): item is Question => Boolean(item));
};

const selectSessionQuestions = (gameType: GameType, day: number): Question[] => {
  const dayPlan = getDayPlan(day);
  const primaryQuestions = getQuestionsByTables(dayPlan.targetTables);
  const reviewQuestions = getReviewQuestions(day);
  const wrongQuestions = getWrongQuestions();

  if (gameType === "rescue") {
    return wrongQuestions.slice(0, 3);
  }

  if (gameType === "match") {
    return primaryQuestions.slice(0, 4);
  }

  if (gameType === "level") {
    return uniqueByQuestionId([...primaryQuestions.slice(0, 5), ...wrongQuestions.slice(0, 1)]);
  }

  return uniqueByQuestionId([
    ...primaryQuestions.slice(0, 3),
    ...reviewQuestions.slice(0, 1),
    ...wrongQuestions.slice(0, 1)
  ]);
};

const buildMatchCards = (questions: Question[]): MatchCard[] => {
  const cards = questions.flatMap((question) => [
    {
      id: `${question.id}_formula`,
      pairId: question.id,
      cardType: "formula" as const,
      content: question.formula,
      status: "closed" as const
    },
    {
      id: `${question.id}_answer`,
      pairId: question.id,
      cardType: "answer" as const,
      content: String(question.answer),
      status: "closed" as const
    }
  ]);

  return cards.sort((left, right) => left.id.localeCompare(right.id)).reverse();
};

const getSessionById = (sessionId: string): SessionRecord | undefined => {
  return sessionsState.find((item) => item.sessionId === sessionId);
};

const upsertWrongItem = (question: Question, correct: boolean, gameType: GameType): WrongItem => {
  let target = wrongItemsState.find((item) => item.questionId === question.id);

  if (!target) {
    target = {
      questionId: question.id,
      formula: question.formula,
      answer: question.answer,
      wrongCount: 0,
      continuousWrongCount: 0,
      lastWrongAt: new Date().toISOString(),
      mastered: false
    };
    wrongItemsState.unshift(target);
  }

  if (correct) {
    target.continuousWrongCount = 0;
    if (gameType === "rescue") {
      target.mastered = true;
    }
  } else {
    target.wrongCount += 1;
    target.continuousWrongCount += 1;
    target.lastWrongAt = new Date().toISOString();
    target.mastered = false;
  }

  return target;
};

const getComboCount = (session: SessionRecord): number => {
  let comboCount = 0;

  for (let index = session.answers.length - 1; index >= 0; index -= 1) {
    if (!session.answers[index].correct) {
      break;
    }
    comboCount += 1;
  }

  return comboCount;
};

const markTaskStatus = (taskType: keyof ProgressState["todayTaskStatus"], status: TaskStatus): void => {
  progressState.todayTaskStatus[taskType] = status;
  persistState();
};

const updateProgressAfterFinish = (session: SessionRecord, result: SessionFinishResponse): void => {
  const dayPlan = getDayPlan(session.day);
  const wasStarLit = progressState.stars[session.day - 1] === 1;
  const previousDay = progressState.currentDay;

  if (session.gameType === "rescue") {
    progressState.todayTaskStatus.wrongReview = "done";
  } else if (session.gameType === "quiz" || session.gameType === "level" || session.gameType === "match") {
    progressState.todayTaskStatus.review = "done";
    progressState.todayTaskStatus.learn = "done";
    progressState.todayTaskStatus[session.gameType] = "done";
  }

  progressState.todayMinutes += result.elapsedSeconds / 60;
  progressState.totalMinutes += result.elapsedSeconds / 60;

  if (
    session.gameType !== "rescue" &&
    !wasStarLit &&
    result.accuracy >= 0.8 &&
    session.day === previousDay
  ) {
    progressState.stars[session.day - 1] = 1;
    progressState.completedDays = Math.max(progressState.completedDays, session.day);
    progressState.currentDay = Math.min(session.day + 1, 7);
    progressState.masteredTables = Array.from(new Set([...progressState.masteredTables, ...dayPlan.targetTables]));
    progressState.learningTables = getDayPlan(progressState.currentDay).targetTables;
    progressState.todayTaskStatus = buildDefaultTaskStatus();
    progressState.todayMinutes = 0;
  }

  const weakTables = Array.from(
    new Set(
      wrongItemsState
        .filter((item) => !item.mastered)
        .map((item) => {
          const question = getQuestionById(item.questionId);
          return question ? question.table : null;
        })
        .filter((item): item is number => item !== null)
    )
  );

  progressState.weakTables = weakTables.length > 0 ? weakTables : [6, 7, 8, 9];
};

export const mockApi = {
  app: {
    init: async (): Promise<AppInitResponse> => {
      return wait({
        user,
        progress: progressState,
        entry: {
          hasWrongReview: wrongItemsState.some((item) => !item.mastered),
          todayTaskStatus: buildTodayTaskStatus()
        }
      });
    }
  },

  home: {
    today: async (): Promise<TodayTaskResponse> => {
      return wait(buildTodayTasks());
    }
  },

  learn: {
    content: async (day: number): Promise<LearnContentResponse> => {
      markTaskStatus("learn", "doing");
      return wait(getLearnContent(day));
    }
  },

  progress: {
    markTask: async (taskType: keyof ProgressState["todayTaskStatus"], status: TaskStatus): Promise<void> => {
      markTaskStatus(taskType, status);
      return wait(undefined);
    }
  },

  session: {
    start: async (payload: SessionStartRequest): Promise<SessionStartResponse> => {
      const questions = selectSessionQuestions(payload.gameType, payload.day);
      const sessionId = `s_${Date.now()}`;
      const session: SessionRecord = {
        sessionId,
        gameType: payload.gameType,
        day: payload.day,
        startedAt: new Date().toISOString(),
        questions,
        answers: [],
        totalQuestions: questions.length,
        correctCount: 0,
        elapsedSeconds: 0
      };

      sessionsState.unshift(session);
      persistState();

      return wait({
        sessionId,
        gameType: payload.gameType,
        questions,
        cards: payload.gameType === "match" ? buildMatchCards(questions) : undefined
      });
    },

    answer: async (payload: SessionAnswerRequest): Promise<SessionAnswerResponse> => {
      const session = getSessionById(payload.sessionId);

      if (!session) {
        throw new Error("Session not found");
      }

      const question = session.questions.find((item) => item.id === payload.questionId);

      if (!question) {
        throw new Error("Question not found");
      }

      const correct = question.answer === payload.selectedAnswer;
      const answerIndex = session.answers.findIndex((item) => item.questionId === payload.questionId);
      const answerRecord = {
        questionId: payload.questionId,
        selectedAnswer: payload.selectedAnswer,
        correct,
        costMs: payload.costMs
      };

      if (answerIndex >= 0) {
        session.answers[answerIndex] = answerRecord;
      } else {
        session.answers.push(answerRecord);
      }

      const wrongItem = upsertWrongItem(question, correct, session.gameType);
      session.correctCount = session.answers.filter((item) => item.correct).length;
      persistState();

      return wait({
        correct,
        correctAnswer: question.answer,
        rhymeText: question.rhymeText,
        comboCount: getComboCount(session),
        needExplain: !correct && wrongItem.continuousWrongCount >= 3
      });
    },

    finish: async (sessionId: string): Promise<SessionFinishResponse> => {
      const session = getSessionById(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }

      const wrongQuestionIds = session.answers.filter((item) => !item.correct).map((item) => item.questionId);
      const weakItems = session.questions
        .filter((item) => wrongQuestionIds.includes(item.id))
        .map((item) => item.formula);
      const newMasteredItems = session.answers
        .filter((item) => item.correct)
        .map((item) => session.questions.find((question) => question.id === item.questionId)?.formula || "")
        .filter(Boolean)
        .slice(0, 3);
      const elapsedSeconds = Math.max(
        30,
        Math.round(session.answers.reduce((total, item) => total + item.costMs, 0) / 1000)
      );
      const accuracy = session.totalQuestions > 0 ? session.correctCount / session.totalQuestions : 1;
      const reward =
        accuracy >= 0.8
          ? {
              type: "star" as const,
              count: 1,
              title: "点亮一颗星"
            }
          : {
              type: "badge" as const,
              count: 1,
              title: "继续加油徽章"
            };

      session.finishedAt = new Date().toISOString();
      session.elapsedSeconds = elapsedSeconds;

      const result: SessionFinishResponse = {
        totalQuestions: session.totalQuestions,
        correctCount: session.correctCount,
        accuracy,
        elapsedSeconds,
        newMasteredItems,
        weakItems,
        reward,
        nextAction: weakItems.length > 0 ? "wrongReview" : "home"
      };

      latestResultState = result;
      updateProgressAfterFinish(session, result);
      persistState();

      return wait(result);
    },

    latestResult: async (): Promise<SessionFinishResponse | null> => {
      return wait(latestResultState);
    }
  },

  wrongbook: {
    list: async (): Promise<WrongbookResponse> => {
      const today = new Date().toISOString().slice(0, 10);
      const activeItems = wrongItemsState.filter((item) => !item.mastered);

      return wait({
        totalWrongCount: activeItems.length,
        todayWrongCount: activeItems.filter((item) => item.lastWrongAt.startsWith(today)).length,
        priorityWrongCount: activeItems.filter((item) => item.continuousWrongCount >= 2).length,
        wrongGroups: [
          {
            groupKey: "priority",
            groupTitle: "优先复习",
            items: activeItems
              .filter((item) => item.continuousWrongCount >= 2)
              .sort((a, b) => b.continuousWrongCount - a.continuousWrongCount)
          },
          {
            groupKey: "recent",
            groupTitle: "最近错题",
            items: activeItems.sort((a, b) => b.lastWrongAt.localeCompare(a.lastWrongAt))
          }
        ].filter((group) => group.items.length > 0)
      });
    },

    reviewStart: async (mode: "priority" | "all", limit: number): Promise<WrongReviewStartResponse> => {
      const sourceItems =
        mode === "priority"
          ? wrongItemsState.filter((item) => !item.mastered && item.continuousWrongCount >= 2)
          : wrongItemsState.filter((item) => !item.mastered);
      const questions = sourceItems
        .slice(0, limit)
        .map((item) => getQuestionById(item.questionId))
        .filter((item): item is Question => Boolean(item));
      const sessionId = `s_wrong_${Date.now()}`;

      sessionsState.unshift({
        sessionId,
        gameType: "rescue",
        day: progressState.currentDay,
        startedAt: new Date().toISOString(),
        questions,
        answers: [],
        totalQuestions: questions.length,
        correctCount: 0,
        elapsedSeconds: 0
      });
      persistState();

      return wait({
        sessionId,
        gameType: "rescue",
        wrongItems: questions
      });
    }
  },

  parent: {
    dashboard: async (): Promise<ParentDashboardResponse> => {
      const topWrongItems = wrongItemsState
        .filter((item) => !item.mastered)
        .sort((a, b) => b.wrongCount - a.wrongCount)
        .slice(0, 3)
        .map((item) => ({
          formula: item.formula,
          wrongCount: item.wrongCount
        }));

      return wait({
        continuousDays: progressState.continuousDays,
        todayMinutes: Math.round(progressState.todayMinutes),
        totalMinutes: Math.round(progressState.totalMinutes),
        masteredTables: progressState.masteredTables,
        learningTables: progressState.learningTables,
        weakTables: progressState.weakTables,
        topWrongItems,
        tomorrowSuggestion: "明天先复习高频错题，再进入新的口诀内容。"
      });
    }
  }
};

const remoteRequest = <T>(options: {
  path: string;
  method?: "GET" | "POST";
  data?: unknown;
  requireAuth?: boolean;
}): Promise<T> =>
  new Promise((resolve, reject) => {
    const token = getAuthToken();
    const apiBaseUrl = getApiBaseUrl();

    if (options.requireAuth !== false && !token) {
      reject(new Error("Missing auth token"));
      return;
    }

    wx.request<ApiEnvelope<T>>({
      url: `${apiBaseUrl}${options.path}`,
      method: options.method || "GET",
      data: options.data,
      timeout: REMOTE_TIMEOUT,
      header:
        options.requireAuth === false || !token
          ? undefined
          : {
              Authorization: `Bearer ${token}`
            },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300 && response.data.ok) {
          resolve(response.data.data);
          return;
        }

        reject(new Error(response.data.error?.message || `request failed: ${response.statusCode}`));
      },
      fail: (error) => {
        reject(error);
      }
    });
  });

const withRemoteFallback = async <T>(
  label: string,
  remoteAction: () => Promise<T>,
  mockAction: () => Promise<T>
): Promise<T> => {
  try {
    return await remoteAction();
  } catch (error) {
    console.warn(`[request] ${label} fallback to mock`, error);
    return mockAction();
  }
};

export const api = {
  app: {
    init: async (): Promise<AppInitResponse> => {
      return withRemoteFallback("app.init", () => remoteRequest<AppInitResponse>({ path: "/api/app/init" }), () =>
        mockApi.app.init()
      );
    }
  },

  home: {
    today: async (): Promise<TodayTaskResponse> => {
      return withRemoteFallback(
        "home.today",
        () => remoteRequest<TodayTaskResponse>({ path: "/api/home/today" }),
        () => mockApi.home.today()
      );
    }
  },

  learn: {
    content: async (day: number): Promise<LearnContentResponse> => {
      return withRemoteFallback(
        "learn.content",
        () => remoteRequest<LearnContentResponse>({ path: `/api/learn/content?day=${day}` }),
        () => mockApi.learn.content(day)
      );
    }
  },

  progress: {
    markTask: async (taskType: keyof ProgressState["todayTaskStatus"], status: TaskStatus): Promise<void> => {
      return withRemoteFallback(
        "progress.markTask",
        () => remoteRequest<void>({ path: "/api/progress/mark-task", method: "POST", data: { taskType, status } }),
        () => mockApi.progress.markTask(taskType, status)
      );
    }
  },

  session: {
    start: async (payload: SessionStartRequest): Promise<SessionStartResponse> => {
      return withRemoteFallback(
        "session.start",
        () => remoteRequest<SessionStartResponse>({ path: "/api/session/start", method: "POST", data: payload }),
        () => mockApi.session.start(payload)
      );
    },

    answer: async (payload: SessionAnswerRequest): Promise<SessionAnswerResponse> => {
      return withRemoteFallback(
        "session.answer",
        () => remoteRequest<SessionAnswerResponse>({ path: "/api/session/answer", method: "POST", data: payload }),
        () => mockApi.session.answer(payload)
      );
    },

    finish: async (sessionId: string): Promise<SessionFinishResponse> => {
      return withRemoteFallback(
        "session.finish",
        () => remoteRequest<SessionFinishResponse>({ path: "/api/session/finish", method: "POST", data: { sessionId } }),
        () => mockApi.session.finish(sessionId)
      );
    },

    latestResult: async (): Promise<SessionFinishResponse | null> => {
      return withRemoteFallback(
        "session.latestResult",
        () => remoteRequest<SessionFinishResponse | null>({ path: "/api/session/latest-result" }),
        () => mockApi.session.latestResult()
      );
    }
  },

  wrongbook: {
    list: async (): Promise<WrongbookResponse> => {
      return withRemoteFallback(
        "wrongbook.list",
        () => remoteRequest<WrongbookResponse>({ path: "/api/wrongbook" }),
        () => mockApi.wrongbook.list()
      );
    },

    reviewStart: async (mode: "priority" | "all", limit: number): Promise<WrongReviewStartResponse> => {
      return withRemoteFallback(
        "wrongbook.reviewStart",
        () =>
          remoteRequest<WrongReviewStartResponse>({
            path: "/api/wrongbook/review-start",
            method: "POST",
            data: { mode, limit }
          }),
        () => mockApi.wrongbook.reviewStart(mode, limit)
      );
    }
  },

  parent: {
    dashboard: async (): Promise<ParentDashboardResponse> => {
      return withRemoteFallback(
        "parent.dashboard",
        () => remoteRequest<ParentDashboardResponse>({ path: "/api/parent/dashboard" }),
        () => mockApi.parent.dashboard()
      );
    }
  }
};
