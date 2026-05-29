"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeStorage = exports.readStorage = exports.deepClone = exports.STORAGE_KEYS = void 0;
exports.STORAGE_KEYS = {
    authToken: "plusapp_auth_token",
    apiBaseUrl: "plusapp_api_base_url",
    progress: "plusapp_progress",
    wrongbook: "plusapp_wrongbook",
    sessions: "plusapp_sessions",
    latestResult: "plusapp_latest_result"
};
const deepClone = (value) => {
    if (value === undefined || value === null) {
        return value;
    }
    return JSON.parse(JSON.stringify(value));
};
exports.deepClone = deepClone;
const readStorage = (key, fallbackValue) => {
    try {
        const value = wx.getStorageSync(key);
        if (value === undefined || value === null || value === "") {
            return (0, exports.deepClone)(fallbackValue);
        }
        return value;
    }
    catch (error) {
        console.warn(`readStorage failed for ${key}`, error);
        return (0, exports.deepClone)(fallbackValue);
    }
};
exports.readStorage = readStorage;
const writeStorage = (key, value) => {
    try {
        wx.setStorageSync(key, value);
    }
    catch (error) {
        console.warn(`writeStorage failed for ${key}`, error);
    }
};
exports.writeStorage = writeStorage;
