# 微信小程序登录与服务端配置流程

这版是按当前工程来写的：

- 小程序前端：`/Users/sdragon/PlusAPP`
- 最小后端：`/Users/sdragon/PlusAPP-server`

## 1. 标准登录链路

1. 小程序调用 `wx.login()`
2. 微信返回一次性临时 `code`
3. 小程序把 `code` 发给你的后端 `/api/wx/login`
4. 后端请求微信 `jscode2session`
5. 微信返回 `openid` 和 `session_key`
6. 后端生成自己的业务 `token`
7. 小程序保存业务 `token`，后续请求都带这个 `token`

重点是：`AppSecret` 和 `session_key` 都只留在服务端。

## 2. 你现在已经有的内容

### 前端

- [project.config.json](/Users/sdragon/PlusAPP/project.config.json)
- [app.json](/Users/sdragon/PlusAPP/miniprogram/app.json)
- [utils/request.ts](/Users/sdragon/PlusAPP/miniprogram/utils/request.ts)
- [utils/auth.ts](/Users/sdragon/PlusAPP/miniprogram/utils/auth.ts)
- [utils/config.ts](/Users/sdragon/PlusAPP/miniprogram/utils/config.ts)

### 后端

- [server.mjs](/Users/sdragon/PlusAPP-server/server.mjs)
- [.env.example](/Users/sdragon/PlusAPP-server/.env.example)

## 3. 本地联调顺序

### 第一步：先跑后端 mock 模式

```bash
cd /Users/sdragon/PlusAPP
npm run dev:mp

cd /Users/sdragon/PlusAPP-server
cp .env.example .env
npm run dev
```

默认是 `mock` 模式，先不依赖微信真实登录。

这里建议同时开着 `npm run dev:mp`，因为后端会直接读取编译后的 `miniprogram/**/*.js`。

### 第二步：开发者工具打开前端

```text
/Users/sdragon/PlusAPP
```

如果后面要切换到测试域名或正式域名，可以在首页进入“接口设置”页面直接修改接口地址。

### 第三步：前端调用登录工具

你可以在页面或 `app.ts` 里手动调用：

```ts
import { loginWithWeChat } from "./utils/auth";

await loginWithWeChat();
```

当前工程里我已经把静默登录预埋进了 [app.ts](/Users/sdragon/PlusAPP/miniprogram/app.ts)，首页会读取登录状态并展示当前是已连 `mock`、已连正式登录，还是待连接。

## 4. 切到真实微信登录

把 `/Users/sdragon/PlusAPP-server/.env` 改成：

```text
WECHAT_LOGIN_MODE=live
WECHAT_APP_ID=你的真实AppID
WECHAT_APP_SECRET=你重置后的新AppSecret
```

然后重启后端。

## 5. 真机与上线配置

### 开发者工具模拟器

- 可以先用 `http://127.0.0.1:8787`
- 适合本机联调

### 真机调试 / 提审 / 上线

- 必须换成公网 `HTTPS` 域名
- 到微信小程序后台配置合法域名
- 后端证书要有效
- TLS 版本要符合微信要求

## 6. 现在已经接好的业务接口

前端 [utils/request.ts](/Users/sdragon/PlusAPP/miniprogram/utils/request.ts) 现在是“真实接口优先，失败自动回退 mock”。

后端当前已经能承接：

1. `app.init`
2. `home.today`
3. `learn.content`
4. `progress.markTask`
5. `session.start / answer / finish / latestResult`
6. `wrongbook.list / reviewStart`
7. `parent.dashboard`

所以首页、学习页、结果页、错题本、家长看板，已经都可以先走真实接口。

## 7. 云端 AI 语音配置

如果你要把“听题 / 跟读”升级成更自然的真人感语音，现在后端已经预留好了可选链路。

服务端 `.env` 额外增加：

```text
OPENAI_API_KEY=你的OpenAIKey
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
OPENAI_TTS_FORMAT=mp3
OPENAI_TTS_INSTRUCTIONS=请用自然、温柔、适合一年级小学生的普通话朗读，语速稍慢一点，吐字清楚，语气鼓励但不要太夸张。
```

当前语音接口：

1. `GET /api/tts/day?day=1`
2. `GET /api/tts/question?questionId=q_3x6`
3. `GET /api/tts/system?key=rewardComplete`

前端策略已经是：

1. 先尝试真实云端语音
2. 失败自动退回本地打包音频

注意：

- 开发者工具里可以配 `http://127.0.0.1:8787`
- 真机想用云端语音，必须改成公网 `HTTPS` 域名
