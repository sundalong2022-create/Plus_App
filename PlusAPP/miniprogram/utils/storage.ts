export const STORAGE_KEYS = {
  authToken: "plusapp_auth_token",
  apiBaseUrl: "plusapp_api_base_url",
  progress: "plusapp_progress",
  wrongbook: "plusapp_wrongbook",
  sessions: "plusapp_sessions",
  latestResult: "plusapp_latest_result"
} as const;

export const deepClone = <T>(value: T): T => {
  if (value === undefined || value === null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
};

export const readStorage = <T>(key: string, fallbackValue: T): T => {
  try {
    const value = wx.getStorageSync(key);
    if (value === undefined || value === null || value === "") {
      return deepClone(fallbackValue);
    }

    return value as T;
  } catch (error) {
    console.warn(`readStorage failed for ${key}`, error);
    return deepClone(fallbackValue);
  }
};

export const writeStorage = <T>(key: string, value: T): void => {
  try {
    wx.setStorageSync(key, value);
  } catch (error) {
    console.warn(`writeStorage failed for ${key}`, error);
  }
};
