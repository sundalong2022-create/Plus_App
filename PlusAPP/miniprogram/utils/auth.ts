import type { MeResponse, WxLoginResponse } from "../types/api";
import { getApiBaseUrl } from "./config";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

interface ApiEnvelope<T> {
  ok: boolean;
  data: T;
  error?: {
    message: string;
  };
}

const request = <T>(options: {
  url: string;
  method?: "GET" | "POST";
  data?: unknown;
  token?: string;
}): Promise<T> =>
  new Promise((resolve, reject) => {
    wx.request<ApiEnvelope<T>>({
      url: options.url,
      method: options.method || "GET",
      data: options.data,
      header: options.token
        ? {
            Authorization: `Bearer ${options.token}`
          }
        : undefined,
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300 && response.data.ok) {
          resolve(response.data.data);
          return;
        }

        reject(new Error(response.data.error?.message || `request failed: ${response.statusCode}`));
      },
      fail: (error) => {
        reject(error);
      }
    });
  });

const getLoginCode = (): Promise<string> =>
  new Promise((resolve, reject) => {
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

export const getAuthToken = (): string => {
  return readStorage<string>(STORAGE_KEYS.authToken, "");
};

export const loginWithWeChat = async (): Promise<WxLoginResponse> => {
  const code = await getLoginCode();
  const apiBaseUrl = getApiBaseUrl();
  const response = await request<WxLoginResponse>({
    url: `${apiBaseUrl}/api/wx/login`,
    method: "POST",
    data: {
      code
    }
  });

  writeStorage(STORAGE_KEYS.authToken, response.token);
  return response;
};

export const fetchCurrentUser = async (): Promise<MeResponse> => {
  const token = getAuthToken();
  const apiBaseUrl = getApiBaseUrl();

  if (!token) {
    throw new Error("Missing auth token");
  }

  return request<MeResponse>({
    url: `${apiBaseUrl}/api/me`,
    token
  });
};

export const logout = (): void => {
  wx.removeStorageSync(STORAGE_KEYS.authToken);
};
