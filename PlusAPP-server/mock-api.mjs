import { randomUUID } from "node:crypto";

const MOCK_DELAY = 120;

const user = {
  userId: "u_001",
  nickname: "小朋友"
};

const dayPlans = [
  {
    day: 1,
    title: "第1天：学习1和2",
    targetTables: [1, 2],
    tasks: [
      { id: "task-review", type: "review", title: "复习旧口诀", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习1和2", minutes: 5 },
      { id: "task-quiz", type: "quiz", title: "快问快答", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题回顾", minutes: 2 }
    ]
  },
  {
    day: 2,
    title: "第2天：学习5和10",
    targetTables: [5, 10],
    tasks: [
      { id: "task-review", type: "review", title: "昨天错题热身", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习5和10", minutes: 5 },
      { id: "task-quiz", type: "quiz", title: "摘果子选答案", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题回顾", minutes: 2 }
    ]
  },
  {
    day: 3,
    title: "第3天：学习3的口诀",
    targetTables: [3],
    tasks: [
      { id: "task-review", type: "review", title: "打地鼠热身", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习3的口诀", minutes: 5 },
      { id: "task-level", type: "level", title: "走格子闯关", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题回顾", minutes: 2 }
    ]
  },
  {
    day: 4,
    title: "第4天：学习4的口诀",
    targetTables: [4],
    tasks: [
      { id: "task-review", type: "review", title: "翻卡片热身", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习4的口诀", minutes: 5 },
      { id: "task-level", type: "level", title: "拼桥过河", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题回顾", minutes: 2 }
    ]
  },
  {
    day: 5,
    title: "第5天：学习6的口诀",
    targetTables: [6],
    tasks: [
      { id: "task-review", type: "review", title: "记忆小火车", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习6的口诀", minutes: 5 },
      { id: "task-level", type: "level", title: "闯关答题", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题救援", minutes: 2 }
    ]
  },
  {
    day: 6,
    title: "第6天：学习7和8",
    targetTables: [7, 8],
    tasks: [
      { id: "task-review", type: "review", title: "昨天错题优先", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习7和8", minutes: 5 },
      { id: "task-level", type: "level", title: "BOSS小挑战", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题回顾", minutes: 2 }
    ]
  },
  {
    day: 7,
    title: "第7天：学习9并总复习",
    targetTables: [9],
    tasks: [
      { id: "task-review", type: "review", title: "全口诀快闪", minutes: 3 },
      { id: "task-learn", type: "learn", title: "学习9的口诀", minutes: 5 },
      { id: "task-level", type: "level", title: "总闯关地图", minutes: 4 },
      { id: "task-wrong", type: "wrongReview", title: "错题本清理", minutes: 2 }
    ]
  }
];

const chineseDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const dayByTable = {
  1: 1,
  2: 1,
  5: 2,
  10: 2,
  3: 3,
  4: 4,
  6: 5,
  7: 6,
  8: 6,
  9: 7
};

const initialProgressState = {
  currentDay: 3,
  completedDays: 2,
  continuousDays: 2,
  stars: [1, 1, 0, 0, 0, 0, 0],
  todayMinutes: 0,
  totalMinutes: 23,
  todayTaskStatus: {
    review: "todo",
    learn: "todo",
    quiz: "todo",
    match: "todo",
    level: "todo",
    wrongReview: "todo"
  },
  masteredTables: [1, 2, 5, 10],
  learningTables: [3],
  weakTables: [6, 7, 8, 9]
};

const initialWrongItems = [
  {
    questionId: "q_3x6",
    formula: "3×6",
    answer: 18,
    wrongCount: 2,
    continuousWrongCount: 2,
    lastWrongAt: "2026-05-25T10:20:00+08:00",
    mastered: false
  },
  {
    questionId: "q_4x7",
    formula: "4×7",
    answer: 28,
    wrongCount: 1,
    continuousWrongCount: 1,
    lastWrongAt: "2026-05-24T18:10:00+08:00",
    mastered: false
  },
  {
    questionId: "q_7x8",
    formula: "7×8",
    answer: 56,
    wrongCount: 1,
    continuousWrongCount: 1,
    lastWrongAt: "2026-05-24T18:15:00+08:00",
    mastered: false
  }
];

const buildDefaultTaskStatus = () => ({
  review: "todo",
  learn: "todo",
  quiz: "todo",
  match: "todo",
  level: "todo",
  wrongReview: "todo"
});

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

const toRhymeText = (table, multiplier, answer) => {
  if (table === 10) {
    return `十乘${toChineseNumber(multiplier)}得${toChineseNumber(answer)}`;
  }

  return `${toChineseNumber(table)}${toChineseNumber(multiplier)}得${toChineseNumber(answer)}`;
};

const buildOptions = (answer) => {
  const candidates = new Set([answer]);
  const offsets = [-10, -5, -2, 2, 5, 10];

  offsets.forEach((offset) => {
    const next = answer + offset;
    if (next > 0 && candidates.size < 4) {
      candidates.add(next);
    }
  });

  let fallback = answer + 1;
  while (candidates.size < 4) {
    candidates.add(fallback);
    fallback += 1;
  }

  return Array.from(candidates).slice(0, 4).sort((a, b) => a - b);
};

const questionBank = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9].flatMap((table) =>
  Array.from({ length: 9 }, (_, index) => {
    const multiplier = index + 1;
    const answer = table * multiplier;
    const day = dayByTable[table];
    const difficulty = multiplier <= 3 ? 1 : multiplier <= 6 ? 2 : 3;

    return {
      id: `q_${table}x${multiplier}`,
      table,
      multiplier,
      formula: `${table}×${multiplier}`,
      answer,
      options: buildOptions(answer),
      rhymeText: toRhymeText(table, multiplier, answer),
      difficulty,
      sourceTag: "new",
      tags: [`day${day}`, `table${table}`]
    };
  })
);

const tipsByTable = {
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

let progressState = deepClone(initialProgressState);
let wrongItemsState = deepClone(initialWrongItems);
let sessionsState = [];
let latestResultState = null;

function deepClone(value) {
  if (value === undefined || value === null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
}

const wait = (value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(deepClone(value)), MOCK_DELAY);
  });

export const getDayPlan = (day) => {
  return dayPlans.find((item) => item.day === day) || dayPlans[0];
};

export const getQuestionById = (questionId) => {
  return questionBank.find((item) => item.id === questionId);
};

export const getQuestionsByTables = (targetTables) => {
  return questionBank.filter((item) => targetTables.includes(item.table));
};

const buildTodayTaskStatus = () => {
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

const buildTodayTasks = () => {
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

const uniqueByQuestionId = (questions) => {
  const seen = new Set();

  return questions.filter((question) => {
    if (seen.has(question.id)) {
      return false;
    }

    seen.add(question.id);
    return true;
  });
};

const buildVisualExample = (question) => {
  const expressionText = Array.from({ length: question.multiplier }, () => String(question.table)).join("+");

  return {
    formula: question.formula,
    displayType: "dots",
    expressionText: `${expressionText}=${question.answer}`
  };
};

const getLearnContent = (day) => {
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

const getReviewQuestions = (day) => {
  const reviewTables = dayPlans
    .filter((item) => item.day < day)
    .flatMap((item) => item.targetTables);

  return questionBank.filter((item) => reviewTables.includes(item.table) && item.multiplier <= 5);
};

const getWrongQuestions = () => {
  return wrongItemsState
    .filter((item) => !item.mastered)
    .sort((a, b) => b.continuousWrongCount - a.continuousWrongCount)
    .map((item) => getQuestionById(item.questionId))
    .filter(Boolean);
};

const selectSessionQuestions = (gameType, day) => {
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

const buildMatchCards = (questions) => {
  const cards = questions.flatMap((question) => [
    {
      id: `${question.id}_formula`,
      pairId: question.id,
      cardType: "formula",
      content: question.formula,
      status: "closed"
    },
    {
      id: `${question.id}_answer`,
      pairId: question.id,
      cardType: "answer",
      content: String(question.answer),
      status: "closed"
    }
  ]);

  return cards.sort((left, right) => left.id.localeCompare(right.id)).reverse();
};

const getSessionById = (sessionId) => {
  return sessionsState.find((item) => item.sessionId === sessionId);
};

const markTaskStatus = (taskType, status) => {
  progressState.todayTaskStatus[taskType] = status;
};

const upsertWrongItem = (question, correct, gameType) => {
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

const getComboCount = (session) => {
  let comboCount = 0;

  for (let index = session.answers.length - 1; index >= 0; index -= 1) {
    if (!session.answers[index].correct) {
      break;
    }
    comboCount += 1;
  }

  return comboCount;
};

const updateProgressAfterFinish = (session, result) => {
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

  if (session.gameType !== "rescue" && !wasStarLit && result.accuracy >= 0.8 && session.day === previousDay) {
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
        .filter((item) => item !== null)
    )
  );

  progressState.weakTables = weakTables.length > 0 ? weakTables : [6, 7, 8, 9];
};

export const mockApi = {
  app: {
    init: async () =>
      wait({
        user,
        progress: progressState,
        entry: {
          hasWrongReview: wrongItemsState.some((item) => !item.mastered),
          todayTaskStatus: buildTodayTaskStatus()
        }
      })
  },

  home: {
    today: async () => wait(buildTodayTasks())
  },

  learn: {
    content: async (day) => {
      markTaskStatus("learn", "doing");
      return wait(getLearnContent(day));
    }
  },

  progress: {
    markTask: async (taskType, status) => {
      markTaskStatus(taskType, status);
      return wait(undefined);
    }
  },

  session: {
    start: async (payload) => {
      const questions = selectSessionQuestions(payload.gameType, payload.day);
      const sessionId = `s_${randomUUID()}`;
      const session = {
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

      return wait({
        sessionId,
        gameType: payload.gameType,
        questions,
        cards: payload.gameType === "match" ? buildMatchCards(questions) : undefined
      });
    },

    answer: async (payload) => {
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

      return wait({
        correct,
        correctAnswer: question.answer,
        rhymeText: question.rhymeText,
        comboCount: getComboCount(session),
        needExplain: !correct && wrongItem.continuousWrongCount >= 3
      });
    },

    finish: async (sessionId) => {
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
          ? { type: "star", count: 1, title: "点亮一颗星" }
          : { type: "badge", count: 1, title: "继续加油徽章" };

      session.finishedAt = new Date().toISOString();
      session.elapsedSeconds = elapsedSeconds;

      const result = {
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

      return wait(result);
    },

    latestResult: async () => wait(latestResultState)
  },

  wrongbook: {
    list: async () => {
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
            items: [...activeItems].sort((a, b) => b.lastWrongAt.localeCompare(a.lastWrongAt))
          }
        ].filter((group) => group.items.length > 0)
      });
    },

    reviewStart: async (mode, limit) => {
      const sourceItems =
        mode === "priority"
          ? wrongItemsState.filter((item) => !item.mastered && item.continuousWrongCount >= 2)
          : wrongItemsState.filter((item) => !item.mastered);
      const questions = sourceItems
        .slice(0, limit)
        .map((item) => getQuestionById(item.questionId))
        .filter(Boolean);
      const sessionId = `s_wrong_${randomUUID()}`;

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

      return wait({
        sessionId,
        gameType: "rescue",
        wrongItems: questions
      });
    }
  },

  parent: {
    dashboard: async () => {
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
