# PlusAPP Server

PlusAPP 的最小后端示例，负责演示微信小程序登录链路，并承接当前训练原型所需的接口。

## 这个示例解决什么

1. 小程序端通过 `wx.login()` 拿到临时 `code`
2. 小程序把 `code` 发给你的服务端
3. 服务端调用微信 `jscode2session`
4. 服务端自己生成业务 `token`
5. 小程序后续只带业务 `token` 请求，不直接保存 `session_key`

## 目录

```text
PlusAPP-server
├── .env.example
├── .gitignore
├── package.json
└── server.mjs
```

## 本地启动

1. 复制环境变量文件

```bash
cd /Users/sdragon/PlusAPP
npm run build:mp

cd /Users/sdragon/PlusAPP-server
cp .env.example .env
```

2. 先用 mock 模式启动

```bash
npm run dev
```

3. 打开健康检查

```bash
curl http://127.0.0.1:8787/health
```

说明：

- 当前后端已经内置一份可独立运行的 mock 训练数据
- 所以无论本地开发还是微信云托管部署，都不再依赖 `PlusAPP` 目录里的编译产物
- 如果要启用更自然的云端语音，再补 `OPENAI_API_KEY` 即可；不配时，小程序会继续回退到本地音频资源

## 两种模式

### mock 模式

- `WECHAT_LOGIN_MODE=mock`
- 不请求微信服务器
- 任何 `code` 都能换出一个假的 `openid`
- 最适合先打通前后端联调

### live 模式

- `WECHAT_LOGIN_MODE=live`
- 需要真实 `WECHAT_APP_ID`
- 需要新的 `WECHAT_APP_SECRET`
- 需要前端真调用 `wx.login()` 拿到真实 `code`

建议先在微信后台重置一份新的 `AppSecret`，再写入 `.env`。

## 云端 TTS（可选）

后端现在额外支持 OpenAI 云端语音，默认策略是：

1. 小程序先请求服务端 TTS 音频
2. 服务端命中本地缓存就直接返回
3. 没命中就调用 OpenAI 生成并缓存
4. 如果服务端不可用、没配 Key、或真机拿不到本地开发地址，小程序自动回退到本地 `.m4a`

在 `.env` 里补这些变量即可：

```text
OPENAI_API_KEY=你的OpenAIKey
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
OPENAI_TTS_FORMAT=mp3
OPENAI_TTS_INSTRUCTIONS=请用自然、温柔、适合一年级小学生的普通话朗读，语速稍慢一点，吐字清楚，语气鼓励但不要太夸张。
```

缓存目录：

```text
/Users/sdragon/PlusAPP-server/cache/tts
```

## 接口

### `GET /health`

返回服务状态和当前模式。

### `POST /api/wx/login`

请求体：

```json
{
  "code": "wx-login-code"
}
```

返回：

```json
{
  "ok": true,
  "data": {
    "token": "app-session-token",
    "user": {
      "openid": "openid"
    },
    "mode": "mock"
  }
}
```

### `GET /api/me`

请求头：

```text
Authorization: Bearer <token>
```

### `GET /api/tts/day?day=1`

返回当天学习页朗读音频。

### `GET /api/tts/question?questionId=q_3x6`

返回题目听题音频。

### `GET /api/tts/system?key=rewardComplete`

返回系统奖励提示音频，当前支持：

- `rewardComplete`
- `rewardMatch`

### `POST /api/logout`

删除当前会话。

### 当前已承接的训练接口

- `GET /api/app/init`
- `GET /api/home/today`
- `GET /api/learn/content`
- `POST /api/progress/mark-task`
- `POST /api/session/start`
- `POST /api/session/answer`
- `POST /api/session/finish`
- `GET /api/session/latest-result`
- `GET /api/wrongbook`
- `POST /api/wrongbook/review-start`
- `GET /api/parent/dashboard`

## 对接你现有小程序

前端示例文件已经补在：

- [/Users/sdragon/PlusAPP/miniprogram/utils/config.ts](/Users/sdragon/PlusAPP/miniprogram/utils/config.ts)
- [/Users/sdragon/PlusAPP/miniprogram/utils/auth.ts](/Users/sdragon/PlusAPP/miniprogram/utils/auth.ts)
- [/Users/sdragon/PlusAPP/miniprogram/pages/dev-config/index.ts](/Users/sdragon/PlusAPP/miniprogram/pages/dev-config/index.ts)

开发者工具模拟器联调时可以先用：

```text
http://127.0.0.1:8787
```

如果要切测试域名或正式域名，现在可以直接在小程序首页进入“接口设置”页面修改。

真机联调或上线时，改成你自己的 HTTPS 域名，并到微信小程序后台配置合法域名。

补一句很关键的：

- 真机要用云端 TTS，接口地址必须是公网 `HTTPS`
- `127.0.0.1` 只适合本机开发者工具

## 微信云托管部署

如果你使用微信云托管部署当前后端，请选择：

- 代码目录：`PlusAPP-server`
- Dockerfile 路径：`PlusAPP-server/Dockerfile`

当前镜像会：

1. 使用 Node 20
2. 执行 `npm install --omit=dev`
3. 运行 `npm start`
4. 监听云托管注入的 `PORT`，默认容器端口为 `8080`

推荐在云托管环境变量里配置：

```text
WECHAT_LOGIN_MODE=live
WECHAT_APP_ID=你的AppID
WECHAT_APP_SECRET=你的新AppSecret
```

## Vercel 部署

当前后端也支持部署到 Vercel。

推荐目录：

- 项目根目录：`PlusAPP-server`

Vercel 入口：

- 根入口：`index.js`
- 共享处理逻辑：`lib/app.mjs`
- 兼容入口：`api/index.mjs`
- 路由转发配置：`vercel.json`

本地运行仍然使用：

```bash
npm run dev
```
