"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialProgressState = void 0;
exports.initialProgressState = {
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
