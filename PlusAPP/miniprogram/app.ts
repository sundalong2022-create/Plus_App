import { fetchCurrentUser, getAuthToken, loginWithWeChat, logout } from "./utils/auth";

let authPromise: Promise<AuthSession> | null = null;

const buildAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "登录服务暂时不可用";
};

App<IAppOption>({
  globalData: {
    appName: "PlusAPP",
    authState: "idle",
    authMode: "",
    authToken: "",
    userOpenId: "",
    loginAt: "",
    authError: ""
  },

  onLaunch() {
    console.log("PlusAPP launched");
    void this.ensureAuth().catch((error) => {
      console.warn("silent login failed", error);
    });
  },

  async ensureAuth(force = false) {
    if (!force && this.globalData.authState === "ready" && this.globalData.authToken && this.globalData.userOpenId) {
      return {
        token: this.globalData.authToken,
        openid: this.globalData.userOpenId,
        mode: this.globalData.authMode || "mock",
        loginAt: this.globalData.loginAt
      };
    }

    if (!force && authPromise) {
      return authPromise;
    }

    this.globalData.authState = "loading";
    this.globalData.authError = "";

    authPromise = (async () => {
      const cachedToken = getAuthToken();

      if (cachedToken) {
        try {
          const me = await fetchCurrentUser();
          this.globalData.authState = "ready";
          this.globalData.authMode = me.mode;
          this.globalData.authToken = cachedToken;
          this.globalData.userOpenId = me.user.openid;
          this.globalData.loginAt = me.loginAt;

          return {
            token: cachedToken,
            openid: me.user.openid,
            mode: me.mode,
            loginAt: me.loginAt
          };
        } catch (error) {
          console.warn("cached auth expired", error);
          logout();
        }
      }

      const loginResult = await loginWithWeChat();
      const me = await fetchCurrentUser();

      this.globalData.authState = "ready";
      this.globalData.authMode = me.mode;
      this.globalData.authToken = loginResult.token;
      this.globalData.userOpenId = me.user.openid;
      this.globalData.loginAt = me.loginAt;

      return {
        token: loginResult.token,
        openid: me.user.openid,
        mode: me.mode,
        loginAt: me.loginAt
      };
    })()
      .catch((error) => {
        logout();
        this.globalData.authState = "error";
        this.globalData.authMode = "";
        this.globalData.authToken = "";
        this.globalData.userOpenId = "";
        this.globalData.loginAt = "";
        this.globalData.authError = buildAuthErrorMessage(error);
        throw error;
      })
      .finally(() => {
        authPromise = null;
      });

    return authPromise;
  }
});
