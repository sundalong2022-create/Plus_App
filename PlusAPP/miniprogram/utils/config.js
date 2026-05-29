"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasApiBaseUrlOverride = exports.clearApiBaseUrl = exports.setApiBaseUrl = exports.getApiBaseUrl = exports.DEFAULT_API_BASE_URL = void 0;
const storage_1 = require("./storage");
exports.DEFAULT_API_BASE_URL = "http://127.0.0.1:8787";
const normalizeApiBaseUrl = (value) => {
    return value.trim().replace(/\/+$/, "");
};
const getApiBaseUrl = () => {
    const overrideValue = (0, storage_1.readStorage)(storage_1.STORAGE_KEYS.apiBaseUrl, "");
    return normalizeApiBaseUrl(overrideValue || exports.DEFAULT_API_BASE_URL);
};
exports.getApiBaseUrl = getApiBaseUrl;
const setApiBaseUrl = (value) => {
    const normalizedValue = normalizeApiBaseUrl(value);
    (0, storage_1.writeStorage)(storage_1.STORAGE_KEYS.apiBaseUrl, normalizedValue);
    return normalizedValue;
};
exports.setApiBaseUrl = setApiBaseUrl;
const clearApiBaseUrl = () => {
    wx.removeStorageSync(storage_1.STORAGE_KEYS.apiBaseUrl);
    return exports.DEFAULT_API_BASE_URL;
};
exports.clearApiBaseUrl = clearApiBaseUrl;
const hasApiBaseUrlOverride = () => {
    return Boolean((0, storage_1.readStorage)(storage_1.STORAGE_KEYS.apiBaseUrl, "").trim());
};
exports.hasApiBaseUrlOverride = hasApiBaseUrlOverride;
