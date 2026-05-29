"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plan_1 = require("../../mock/plan");
const audio_1 = require("../../utils/audio");
const request_1 = require("../../utils/request");
const initialContent = {
    day: 1,
    dayTitle: "",
    targetTables: [],
    rhymes: [],
    visualExample: {
        formula: "",
        displayType: "dots",
        expressionText: ""
    },
    tips: []
};
const buildVisualGroups = (formula) => {
    const [tableText, multiplierText] = formula.split("×");
    const table = Number(tableText || 0);
    const multiplier = Number(multiplierText || 0);
    return Array.from({ length: multiplier }, (_, index) => ({
        id: index + 1,
        dots: Array.from({ length: table }, (__, dotIndex) => dotIndex + 1)
    }));
};
Page({
    data: {
        loading: true,
        content: initialContent,
        primaryGameType: "quiz",
        primaryButtonText: "开始快问快答",
        visualGroups: []
    },
    onLoad(query) {
        const day = Number(query.day || 1);
        void this.loadContent(day);
    },
    onUnload() {
        audio_1.audioService.stop();
    },
    onHide() {
        audio_1.audioService.stop();
    },
    async loadContent(day) {
        const content = await request_1.api.learn.content(day);
        const primaryGameType = (0, plan_1.getDayPlan)(day).tasks.some((task) => task.type === "level") ? "level" : "quiz";
        this.setData({
            loading: false,
            content,
            primaryGameType,
            primaryButtonText: primaryGameType === "level" ? "开始走格子闯关" : "开始快问快答",
            visualGroups: buildVisualGroups(content.visualExample.formula)
        });
    },
    handleStartGame() {
        const page = this.data.primaryGameType;
        wx.navigateTo({
            url: `/pages/${page}/index?day=${this.data.content.day}`
        });
    },
    handleTryMatch() {
        wx.navigateTo({
            url: `/pages/match/index?day=${this.data.content.day}`
        });
    },
    handleTryLevel() {
        wx.navigateTo({
            url: `/pages/level/index?day=${this.data.content.day}`
        });
    },
    handleListen() {
        audio_1.audioService.playDayNarration(this.data.content.day);
    }
});
