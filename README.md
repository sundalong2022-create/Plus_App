# Plus_App

乘法口诀训练项目仓库，包含微信小程序、官网首页、Web 训练版和最小后端示例。

- `PlusAPP`：微信小程序前端
- `PlusAPP-server`：官网首页 + Web 应用 + API 服务

## 目录结构

```text
Plus_App
├── PlusAPP
└── PlusAPP-server
```

## 本地启动

### 1. 微信小程序

```bash
cd PlusAPP
npm install
npm run build:mp
```

开发时建议再开一个终端持续监听：

```bash
npm run dev:mp
```

然后用微信开发者工具打开 `/Users/sdragon/Plus_App/PlusAPP`。

### 2. 官网 / Web 应用 / API 服务

```bash
cd PlusAPP-server
cp .env.example .env
npm install
npm run dev
```

本地服务默认运行在：

- 官网首页: [http://127.0.0.1:8787/](http://127.0.0.1:8787/)
- Web 应用: [http://127.0.0.1:8787/app](http://127.0.0.1:8787/app)
- 健康检查: [http://127.0.0.1:8787/health](http://127.0.0.1:8787/health)

## Web 入口说明

当前浏览器侧有两层入口：

- 官网首页 `/`
- Web 应用页 `/app`

官网首页已经提供“进入 Web 应用”按钮，可以直接跳转到浏览器训练版。

Web 应用页当前包含：

- 首页训练总览
- 学习页
- 快问快答
- 翻卡片配对
- 走格子闯关
- 错题本 / 错题救援
- 家长看板
- “从头开始学习”重置按钮

## Vercel 部署

在 `PlusAPP-server` 目录执行：

```bash
cd PlusAPP-server
vercel build --prod --yes
vercel deploy --prebuilt --prod --yes
```

当前 production 地址：

- 官网首页: [https://plusapp-server.vercel.app/](https://plusapp-server.vercel.app/)
- Web 应用: [https://plusapp-server.vercel.app/app](https://plusapp-server.vercel.app/app)

## 补充说明

- 小程序前端和 Web 应用是两条独立入口，但共用同一套训练产品思路
- `PlusAPP-server` 现在不只是 API，也承接官网首页和 Web 演示
- 更细的接口、环境变量和部署说明见 [PlusAPP-server/README.md](/Users/sdragon/Plus_App/PlusAPP-server/README.md)
