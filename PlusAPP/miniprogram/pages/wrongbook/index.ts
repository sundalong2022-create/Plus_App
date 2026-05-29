import type { WrongbookResponse } from "../../types/api";
import { api } from "../../utils/request";

const initialData: WrongbookResponse = {
  totalWrongCount: 0,
  todayWrongCount: 0,
  priorityWrongCount: 0,
  wrongGroups: []
};

const buildGroupCards = (wrongbook: WrongbookResponse) =>
  wrongbook.wrongGroups.map((group) => ({
    ...group,
    items: group.items.map((wrongItem) => ({
      ...wrongItem,
      severityText: wrongItem.continuousWrongCount >= 2 ? "优先复习" : "继续巩固",
      severityTone: wrongItem.continuousWrongCount >= 2 ? "coral" : "warm",
      metaText: `答错 ${wrongItem.wrongCount} 次 · 连错 ${wrongItem.continuousWrongCount} 次`
    }))
  }));

Page({
  data: {
    loading: true,
    wrongbook: initialData,
    groupCards: []
  },

  onShow() {
    void this.loadWrongbook();
  },

  async loadWrongbook() {
    const wrongbook = await api.wrongbook.list();
    this.setData({
      loading: false,
      wrongbook,
      groupCards: buildGroupCards(wrongbook)
    });
  },

  handleStartReview() {
    wx.navigateTo({
      url: "/pages/rescue/index?mode=priority"
    });
  }
});
