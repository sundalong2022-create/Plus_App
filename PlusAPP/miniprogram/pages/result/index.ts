import type { SessionFinishResponse } from "../../types/api";
import { audioService } from "../../utils/audio";
import { api } from "../../utils/request";

const initialResult: SessionFinishResponse = {
  totalQuestions: 0,
  correctCount: 0,
  accuracy: 0,
  elapsedSeconds: 0,
  newMasteredItems: [],
  weakItems: [],
  reward: {
    type: "badge",
    count: 0,
    title: ""
  },
  nextAction: "home"
};

const getPerformanceMeta = (accuracy: number) => {
  if (accuracy >= 0.9) {
    return {
      badge: "这轮很稳",
      tone: "mint",
      summary: "新口诀已经记得很顺，接下来可以多混合几道复习题。"
    };
  }

  if (accuracy >= 0.7) {
    return {
      badge: "再巩固一下",
      tone: "warm",
      summary: "已经有明显印象了，再把待加强题目走一遍就会更稳。"
    };
  }

  return {
    badge: "刚建立印象",
    tone: "coral",
    summary: "这轮主要是在认识题目，先不要急，下一遍会更容易。"
  };
};

const buildCompletionCalendar = (stars: number[], currentDay: number, highlightDay: number) =>
  stars.map((active, index) => ({
    label: `第${index + 1}天`,
    value: active === 1 ? "已点亮" : currentDay === index + 1 ? "进行中" : "待开始",
    note: active === 1 ? "完成" : currentDay === index + 1 ? "今天" : "后续",
    active: active === 1,
    current: currentDay === index + 1,
    recent: highlightDay === index + 1
  }));

let rewardBurstTimer = 0;

Page({
  data: {
    loading: true,
    result: initialResult,
    accuracyPercent: 0,
    performanceBadge: "",
    performanceTone: "warm",
    summaryMessage: "",
    showRewardBurst: false,
    completionCalendar: [],
    completedDays: 0
  },

  onShow() {
    void this.loadResult();
  },

  onHide() {
    audioService.stop();
    if (rewardBurstTimer) {
      clearTimeout(rewardBurstTimer);
      rewardBurstTimer = 0;
    }
  },

  onUnload() {
    audioService.stop();
    if (rewardBurstTimer) {
      clearTimeout(rewardBurstTimer);
      rewardBurstTimer = 0;
    }
  },

  async loadResult() {
    const [result, initData] = await Promise.all([api.session.latestResult(), api.app.init()]);
    const safeResult = result || initialResult;
    const performanceMeta = getPerformanceMeta(safeResult.accuracy);
    const highlightDay =
      safeResult.reward.type === "star"
        ? initData.progress.currentDay > 1
          ? initData.progress.currentDay - 1
          : initData.progress.completedDays
        : 0;
    this.setData({
      loading: false,
      result: safeResult,
      accuracyPercent: Math.round((safeResult.accuracy || 0) * 100),
      performanceBadge: performanceMeta.badge,
      performanceTone: performanceMeta.tone,
      summaryMessage: performanceMeta.summary,
      showRewardBurst: true,
      completionCalendar: buildCompletionCalendar(
        initData.progress.stars,
        initData.progress.currentDay,
        highlightDay
      ),
      completedDays: initData.progress.completedDays
    });

    audioService.playRewardComplete();
    wx.vibrateShort({ type: "light" });

    if (rewardBurstTimer) {
      clearTimeout(rewardBurstTimer);
    }

    rewardBurstTimer = setTimeout(() => {
      this.setData({ showRewardBurst: false });
    }, 1800) as unknown as number;
  },

  handleGoHome() {
    wx.switchTab({ url: "/pages/home/index" });
  },

  handleOpenRescue() {
    wx.navigateTo({ url: "/pages/rescue/index?mode=priority" });
  }
});
