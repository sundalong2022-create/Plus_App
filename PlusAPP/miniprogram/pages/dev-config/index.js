"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../utils/config");
Page({
    data: {
        inputValue: "",
        activeBaseUrl: "",
        defaultBaseUrl: config_1.DEFAULT_API_BASE_URL,
        hasOverride: false,
        healthStatusText: "尚未测试连接",
        healthStatusTone: "warm",
        healthDetailText: "保存后可以点一次连接测试，确认接口服务是否可达。",
        testing: false
    },
    onShow() {
        this.syncConfig();
    },
    syncConfig() {
        const activeBaseUrl = (0, config_1.getApiBaseUrl)();
        this.setData({
            inputValue: activeBaseUrl,
            activeBaseUrl,
            defaultBaseUrl: config_1.DEFAULT_API_BASE_URL,
            hasOverride: (0, config_1.hasApiBaseUrlOverride)()
        });
    },
    handleInput(event) {
        this.setData({
            inputValue: event.detail.value
        });
    },
    handleUseLocalhost() {
        this.setData({
            inputValue: config_1.DEFAULT_API_BASE_URL
        });
    },
    handleSave() {
        const nextBaseUrl = this.data.inputValue.trim();
        if (!nextBaseUrl) {
            wx.showToast({
                title: "先输入接口地址",
                icon: "none",
                duration: 1500
            });
            return;
        }
        const savedBaseUrl = (0, config_1.setApiBaseUrl)(nextBaseUrl);
        this.setData({
            activeBaseUrl: savedBaseUrl,
            inputValue: savedBaseUrl,
            hasOverride: (0, config_1.hasApiBaseUrlOverride)(),
            healthStatusText: "地址已保存",
            healthStatusTone: "mint",
            healthDetailText: "现在回首页重试登录，或者先在这里做一次连接测试。"
        });
        wx.showToast({
            title: "接口地址已保存",
            icon: "none",
            duration: 1500
        });
    },
    handleReset() {
        const activeBaseUrl = (0, config_1.clearApiBaseUrl)();
        this.setData({
            activeBaseUrl,
            inputValue: activeBaseUrl,
            hasOverride: false,
            healthStatusText: "已恢复默认地址",
            healthStatusTone: "warm",
            healthDetailText: "当前重新回到本机调试地址。"
        });
        wx.showToast({
            title: "已恢复默认地址",
            icon: "none",
            duration: 1500
        });
    },
    async handleTestConnection() {
        const targetBaseUrl = this.data.inputValue.trim() || this.data.activeBaseUrl;
        if (!targetBaseUrl) {
            wx.showToast({
                title: "没有可测试的地址",
                icon: "none",
                duration: 1500
            });
            return;
        }
        this.setData({
            testing: true,
            healthStatusText: "连接测试中",
            healthStatusTone: "warm",
            healthDetailText: "正在请求 /health ..."
        });
        try {
            const health = await new Promise((resolve, reject) => {
                wx.request({
                    url: `${targetBaseUrl}/health`,
                    method: "GET",
                    timeout: 1800,
                    success: (response) => {
                        var _a;
                        if (response.statusCode >= 200 && response.statusCode < 300 && response.data.ok) {
                            resolve(response.data.data);
                            return;
                        }
                        reject(new Error(((_a = response.data.error) === null || _a === void 0 ? void 0 : _a.message) || `request failed: ${response.statusCode}`));
                    },
                    fail: (error) => {
                        reject(error);
                    }
                });
            });
            this.setData({
                testing: false,
                healthStatusText: "连接成功",
                healthStatusTone: "mint",
                healthDetailText: `${health.service} · ${health.mode} · 端口 ${health.port}`
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "连接失败";
            this.setData({
                testing: false,
                healthStatusText: "连接失败",
                healthStatusTone: "coral",
                healthDetailText: message
            });
        }
    }
});
