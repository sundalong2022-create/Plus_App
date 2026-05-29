"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionsByTables = exports.getQuestionById = exports.questionBank = void 0;
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
const createQuestion = (table, multiplier) => {
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
};
const tables = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9];
exports.questionBank = tables.flatMap((table) => Array.from({ length: 9 }, (_, index) => createQuestion(table, index + 1)));
const getQuestionById = (questionId) => {
    return exports.questionBank.find((item) => item.id === questionId);
};
exports.getQuestionById = getQuestionById;
const getQuestionsByTables = (targetTables) => {
    return exports.questionBank.filter((item) => targetTables.includes(item.table));
};
exports.getQuestionsByTables = getQuestionsByTables;
