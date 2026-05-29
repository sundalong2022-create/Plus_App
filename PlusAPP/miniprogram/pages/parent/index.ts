import type { ParentDashboardResponse } from "../../types/api";
import { api } from "../../utils/request";

const initialDashboard: ParentDashboardResponse = {
  continuousDays: 0,
  todayMinutes: 0,
  totalMinutes: 0,
  masteredTables: [],
  learningTables: [],
  weakTables: [],
  topWrongItems: [],
  tomorrowSuggestion: ""
};

Page({
  data: {
    loading: true,
    dashboard: initialDashboard,
    masteredCount: 0,
    learningCount: 0,
    weakCount: 0
  },

  onShow() {
    void this.loadDashboard();
  },

  async loadDashboard() {
    const dashboard = await api.parent.dashboard();
    this.setData({
      loading: false,
      dashboard,
      masteredCount: dashboard.masteredTables.length,
      learningCount: dashboard.learningTables.length,
      weakCount: dashboard.weakTables.length
    });
  }
});
