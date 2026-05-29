import type { DayPlan } from "../types/api";

export const dayPlans: DayPlan[] = [
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

export const getDayPlan = (day: number): DayPlan => {
  return dayPlans.find((item) => item.day === day) || dayPlans[0];
};
