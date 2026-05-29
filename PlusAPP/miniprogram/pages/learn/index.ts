import { getDayPlan } from "../../mock/plan";
import type { LearnContentResponse } from "../../types/api";
import { audioService } from "../../utils/audio";
import { api } from "../../utils/request";

const initialContent: LearnContentResponse = {
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

const buildVisualGroups = (formula: string) => {
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

  onLoad(query: { day?: string }) {
    const day = Number(query.day || 1);
    void this.loadContent(day);
  },

  onUnload() {
    audioService.stop();
  },

  onHide() {
    audioService.stop();
  },

  async loadContent(day: number) {
    const content = await api.learn.content(day);
    const primaryGameType = getDayPlan(day).tasks.some((task) => task.type === "level") ? "level" : "quiz";
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
    audioService.playDayNarration(this.data.content.day);
  }
});
