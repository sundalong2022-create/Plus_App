"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../../utils/request");
const initialDashboard = {
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
        const dashboard = await request_1.api.parent.dashboard();
        this.setData({
            loading: false,
            dashboard,
            masteredCount: dashboard.masteredTables.length,
            learningCount: dashboard.learningTables.length,
            weakCount: dashboard.weakTables.length
        });
    }
});
