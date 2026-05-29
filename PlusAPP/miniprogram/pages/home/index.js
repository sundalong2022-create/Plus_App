"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../utils/config");
const request_1 = require("../../utils/request");
const taskSummaryMap = {
    review: "先把昨天容易忘的题目唤醒一遍。",
    learn: "看图示、找规律，再把新口诀读顺。",
    quiz: "用快问快答把今天的内容练熟。",
    level: "边闯关边答题，完成今天的主任务。",
    wrongReview: "专门复习答错过的题，记得会更牢。"
};
const taskMetaMap = {
    review: "热身环节",
    learn: "理解环节",
    quiz: "熟练环节",
    level: "主游戏",
    wrongReview: "巩固环节"
};
const statusMap = {
    todo: { text: "待开始", tone: "warm", actionText: "开始" },
    doing: { text: "进行中", tone: "sky", actionText: "继续" },
    done: { text: "已完成", tone: "mint", actionText: "查看" }
};
const buildTaskCards = (tasks) => tasks.map((task) => (Object.assign(Object.assign({}, task), { statusText: statusMap[task.status].text, statusTone: statusMap[task.status].tone, actionText: statusMap[task.status].actionText, summary: taskSummaryMap[task.type] || "完成这一小步，再进入下一段练习。", meta: taskMetaMap[task.type] || "训练任务" })));
const buildStarItems = (stars, currentDay, highlightDay = 0) => stars.map((active, index) => ({
    label: `D${index + 1}`,
    active: active === 1,
    current: currentDay === index + 1,
    recent: highlightDay === index + 1
}));
const buildCalendarItems = (stars, currentDay, highlightDay = 0) => stars.map((active, index) => ({
    label: `第${index + 1}天`,
    value: active === 1 ? "已点亮" : currentDay === index + 1 ? "进行中" : "待开始",
    note: active === 1 ? "完成" : currentDay === index + 1 ? "今天" : "后续",
    active: active === 1,
    current: currentDay === index + 1,
    recent: highlightDay === index + 1
}));
const getNextTaskText = (taskCards) => {
    const nextTask = taskCards.find((item) => item.status !== "done");
    return nextTask ? `下一步：${nextTask.title}` : "今天这轮训练已经完成。";
};
const getPrimaryActionText = (todayProgress) => {
    if (todayProgress === 0) {
        return "开始今天的练习";
    }
    if (todayProgress >= 100) {
        return "再复习一轮";
    }
    return "继续今天的练习";
};
const buildAuthView = (app) => {
    if (app.globalData.authState === "ready") {
        const isMock = app.globalData.authMode === "mock";
        return {
            authBadgeText: isMock ? "已连调试登录" : "已连正式登录",
            authBadgeTone: isMock ? "sky" : "mint",
            authMessage: isMock
                ? "现在走的是 mock 登录，适合先联调页面和接口流程。"
                : "当前已接入真实微信登录，后续可以继续接用户数据。",
            showRetryLogin: false
        };
    }
    if (app.globalData.authState === "loading") {
        return {
            authBadgeText: "登录连接中",
            authBadgeTone: "warm",
            authMessage: "正在准备登录态，学习内容会照常显示。",
            showRetryLogin: false
        };
    }
    if (app.globalData.authState === "error") {
        return {
            authBadgeText: "登录待连接",
            authBadgeTone: "coral",
            authMessage: app.globalData.authError || "登录服务暂时不可用，当前先按演示数据继续预览。",
            showRetryLogin: true
        };
    }
    return {
        authBadgeText: "登录未开始",
        authBadgeTone: "neutral",
        authMessage: "还没有发起登录请求。",
        showRetryLogin: false
    };
};
const getRoute = (target, currentDay) => {
    switch (target) {
        case "wrongbook":
            return { url: "/pages/wrongbook/index", isTab: true };
        case "parent":
            return { url: "/pages/parent/index", isTab: true };
        case "rescue":
            return { url: "/pages/rescue/index?mode=priority" };
        case "match":
            return { url: `/pages/match/index?day=${currentDay}` };
        case "quiz":
            return { url: `/pages/quiz/index?day=${currentDay}` };
        case "level":
            return { url: `/pages/level/index?day=${currentDay}` };
        case "dev-config":
            return { url: "/pages/dev-config/index" };
        case "learn":
        default:
            return { url: `/pages/learn/index?day=${currentDay}` };
    }
};
Page({
    data: {
        loading: true,
        currentDay: 1,
        dayTitle: "",
        completedDays: 0,
        stars: [0, 0, 0, 0, 0, 0, 0],
        todayTasks: [],
        taskCards: [],
        starItems: [],
        completionCalendar: [],
        todayProgress: 0,
        hasWrongReview: false,
        authBadgeText: "登录准备中",
        authBadgeTone: "warm",
        authMessage: "正在准备登录态，学习内容会照常显示。",
        showRetryLogin: false,
        retryingLogin: false,
        nextTaskText: "",
        primaryActionText: "开始今天的练习",
        recentCompletedDay: 0,
        quickActions: [],
        gameActions: [
            {
                title: "翻卡片配对",
                subtitle: "更适合先建立题目和答案的对应。",
                tone: "sky",
                target: "match"
            },
            {
                title: "快问快答",
                subtitle: "四选一短练，适合拉熟练度。",
                tone: "warm",
                target: "quiz"
            },
            {
                title: "走格子闯关",
                subtitle: "一题一步，做完就能看到终点。",
                tone: "mint",
                target: "level"
            }
        ]
    },
    onShow() {
        void this.loadPage();
    },
    async loadPage(forceAuth = false) {
        const app = getApp();
        const [initData, homeData] = await Promise.all([
            request_1.api.app.init(),
            request_1.api.home.today(),
            app.ensureAuth(forceAuth).catch((error) => {
                console.warn("home auth sync failed", error);
                return null;
            })
        ]);
        const taskCards = buildTaskCards(homeData.todayTasks);
        const recentCompletedDay = initData.progress.completedDays;
        const authView = buildAuthView(app);
        const quickActions = [
            {
                title: "错题本",
                subtitle: "把没记牢的题单独再练。",
                tone: "sky",
                target: "wrongbook"
            },
            {
                title: "家长看板",
                subtitle: "看进度、时长和薄弱项。",
                tone: "mint",
                target: "parent"
            }
        ];
        if (app.globalData.authState !== "ready" || app.globalData.authMode !== "live") {
            quickActions.push({
                title: "接口设置",
                subtitle: `当前地址：${(0, config_1.getApiBaseUrl)()}`,
                tone: "coral",
                target: "dev-config"
            });
        }
        if (initData.entry.hasWrongReview) {
            quickActions.push({
                title: "错题救援",
                subtitle: "优先把最近连错的题补一遍。",
                tone: "coral",
                target: "rescue"
            });
        }
        this.setData({
            loading: false,
            retryingLogin: false,
            currentDay: homeData.currentDay,
            dayTitle: homeData.dayTitle,
            todayTasks: homeData.todayTasks,
            taskCards,
            todayProgress: homeData.todayProgress,
            completedDays: initData.progress.completedDays,
            stars: initData.progress.stars,
            starItems: buildStarItems(initData.progress.stars, homeData.currentDay, recentCompletedDay),
            completionCalendar: buildCalendarItems(initData.progress.stars, homeData.currentDay, recentCompletedDay),
            hasWrongReview: initData.entry.hasWrongReview,
            authBadgeText: authView.authBadgeText,
            authBadgeTone: authView.authBadgeTone,
            authMessage: authView.authMessage,
            showRetryLogin: authView.showRetryLogin,
            nextTaskText: getNextTaskText(taskCards),
            primaryActionText: getPrimaryActionText(homeData.todayProgress),
            recentCompletedDay,
            quickActions
        });
    },
    handleStart() {
        wx.navigateTo({
            url: `/pages/learn/index?day=${this.data.currentDay}`
        });
    },
    handleTaskTap(event) {
        const taskType = event.currentTarget.dataset.type;
        const routeMap = {
            review: "/pages/wrongbook/index",
            learn: `/pages/learn/index?day=${this.data.currentDay}`,
            quiz: `/pages/quiz/index?day=${this.data.currentDay}`,
            level: `/pages/level/index?day=${this.data.currentDay}`,
            wrongReview: "/pages/rescue/index?mode=priority"
        };
        const target = routeMap[taskType] || `/pages/learn/index?day=${this.data.currentDay}`;
        if (target === "/pages/wrongbook/index") {
            wx.switchTab({ url: target });
            return;
        }
        wx.navigateTo({ url: target });
    },
    handleOpenWrongbook() {
        wx.switchTab({ url: "/pages/wrongbook/index" });
    },
    handleOpenParent() {
        wx.switchTab({ url: "/pages/parent/index" });
    },
    handleTileTap(event) {
        const target = event.currentTarget.dataset.target;
        const route = getRoute(target, this.data.currentDay);
        if (route.isTab) {
            wx.switchTab({ url: route.url });
            return;
        }
        wx.navigateTo({ url: route.url });
    },
    async handleRetryLogin() {
        const app = getApp();
        this.setData({
            retryingLogin: true,
            authBadgeText: "重新连接中",
            authBadgeTone: "warm",
            authMessage: "正在重试连接登录服务...",
            showRetryLogin: false
        });
        try {
            await app.ensureAuth(true);
            await this.loadPage();
            wx.showToast({
                title: "登录已连接",
                icon: "none",
                duration: 1400
            });
        }
        catch (error) {
            console.warn("retry login failed", error);
            await this.loadPage();
            wx.showToast({
                title: "登录仍未连接",
                icon: "none",
                duration: 1600
            });
        }
    },
    handlePreviewTap(event) {
        const page = event.currentTarget.dataset.page;
        wx.navigateTo({
            url: `/pages/${page}/index?day=${this.data.currentDay}`
        });
    }
});
