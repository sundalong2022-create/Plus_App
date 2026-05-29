type AuthState = "idle" | "loading" | "ready" | "error";
type AuthMode = "" | "mock" | "live";

interface AuthSession {
  token: string;
  openid: string;
  mode: "mock" | "live";
  loginAt: string;
}

declare const wx: {
  navigateTo(options: { url: string }): void;
  switchTab(options: { url: string }): void;
  showToast(options: { title: string; icon?: string; duration?: number }): void;
  login(options: {
    timeout?: number;
    success?: (result: { code: string }) => void;
    fail?: (error: unknown) => void;
  }): void;
  request<T = unknown>(options: {
    url: string;
    method?: "GET" | "POST";
    data?: unknown;
    timeout?: number;
    header?: Record<string, string>;
    success?: (response: { statusCode: number; data: T }) => void;
    fail?: (error: unknown) => void;
  }): void;
  setStorageSync(key: string, value: unknown): void;
  getStorageSync(key: string): unknown;
  removeStorageSync(key: string): void;
  createInnerAudioContext(): InnerAudioContext;
  vibrateShort(options?: { type?: "heavy" | "medium" | "light" }): void;
};

declare function App<T>(options: T & { onLaunch?: () => void }): void;
declare function Page(options: Record<string, unknown>): void;
declare function Component(options: Record<string, unknown>): void;
declare function getApp<T = unknown>(): T;

interface IAppOption {
  globalData: {
    appName: string;
    authState: AuthState;
    authMode: AuthMode;
    authToken: string;
    userOpenId: string;
    loginAt: string;
    authError: string;
  };
  ensureAuth(force?: boolean): Promise<AuthSession>;
}

interface InnerAudioContext {
  src: string;
  autoplay?: boolean;
  obeyMuteSwitch?: boolean;
  playbackRate?: number;
  play(): void;
  stop(): void;
  pause(): void;
  destroy(): void;
  onError(callback: (error: { errCode?: number; errMsg?: string }) => void): void;
}
