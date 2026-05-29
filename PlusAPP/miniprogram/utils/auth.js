"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.fetchCurrentUser = exports.loginWithWeChat = exports.getAuthToken = void 0;
const config_1 = require("./config");
const storage_1 = require("./storage");
const request = (options) => new Promise((resolve, reject) => {
    wx.request({
        url: options.url,
        method: options.method || "GET",
        data: options.data,
        header: options.token
            ? {
                Authorization: `Bearer ${options.token}`
            }
            : undefined,
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
const getLoginCode = () => new Promise((resolve, reject) => {
    wx.login({
        success: (result) => {
            if (result.code) {
                resolve(result.code);
                return;
            }
            reject(new Error("wx.login returned empty code"));
        },
        fail: (error) => {
            reject(error);
        }
    });
});
const getAuthToken = () => {
    return (0, storage_1.readStorage)(storage_1.STORAGE_KEYS.authToken, "");
};
exports.getAuthToken = getAuthToken;
const loginWithWeChat = async () => {
    const code = await getLoginCode();
    const apiBaseUrl = (0, config_1.getApiBaseUrl)();
    const response = await request({
        url: `${apiBaseUrl}/api/wx/login`,
        method: "POST",
        data: {
            code
        }
    });
    (0, storage_1.writeStorage)(storage_1.STORAGE_KEYS.authToken, response.token);
    return response;
};
exports.loginWithWeChat = loginWithWeChat;
const fetchCurrentUser = async () => {
    const token = (0, exports.getAuthToken)();
    const apiBaseUrl = (0, config_1.getApiBaseUrl)();
    if (!token) {
        throw new Error("Missing auth token");
    }
    return request({
        url: `${apiBaseUrl}/api/me`,
        token
    });
};
exports.fetchCurrentUser = fetchCurrentUser;
const logout = () => {
    wx.removeStorageSync(storage_1.STORAGE_KEYS.authToken);
};
exports.logout = logout;
