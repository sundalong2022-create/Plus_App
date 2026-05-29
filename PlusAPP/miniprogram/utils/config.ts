import { STORAGE_KEYS, readStorage, writeStorage } from "./storage";

export const DEFAULT_API_BASE_URL = "http://127.0.0.1:8787";

const normalizeApiBaseUrl = (value: string): string => {
  return value.trim().replace(/\/+$/, "");
};

export const getApiBaseUrl = (): string => {
  const overrideValue = readStorage<string>(STORAGE_KEYS.apiBaseUrl, "");
  return normalizeApiBaseUrl(overrideValue || DEFAULT_API_BASE_URL);
};

export const setApiBaseUrl = (value: string): string => {
  const normalizedValue = normalizeApiBaseUrl(value);
  writeStorage(STORAGE_KEYS.apiBaseUrl, normalizedValue);
  return normalizedValue;
};

export const clearApiBaseUrl = (): string => {
  wx.removeStorageSync(STORAGE_KEYS.apiBaseUrl);
  return DEFAULT_API_BASE_URL;
};

export const hasApiBaseUrlOverride = (): boolean => {
  return Boolean(readStorage<string>(STORAGE_KEYS.apiBaseUrl, "").trim());
};
