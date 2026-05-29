# PlusAPP

一个面向一年级小朋友的乘法口诀训练微信小程序原型。

## 当前内容

- 原生微信小程序工程骨架
- 7 天训练计划对应的 mock 数据
- 页面状态流转说明
- TypeScript 接口字段定义
- 首页、学习页、练习页、错题本、家长看板等页面脚手架

## 目录结构

```text
PlusAPP
├── docs
│   └── frontend-state-and-types.md
├── miniprogram
│   ├── app.json
│   ├── app.ts
│   ├── app.wxss
│   ├── mock
│   ├── pages
│   ├── types
│   └── utils
├── project.config.json
└── tsconfig.json
```

## 打开方式

1. 用微信开发者工具打开 `/Users/sdragon/PlusAPP`
2. 当前 `project.config.json` 已配置真实 `AppID`
3. 先运行 `npm run build:mp` 生成小程序实际执行的 `.js` 文件
4. 开发时建议另开一个终端运行 `npm run dev:mp`，保存 `.ts` 后会自动更新对应 `.js`
5. 入口页面在 `miniprogram/pages/home/index`

## 下一步建议

1. 用 `/Users/sdragon/PlusAPP-server` 先跑通微信登录后端
2. 把 `utils/request.ts` 里的 mock API 分阶段替换为真实后端接口
3. 给 `quiz`、`level`、`rescue` 接上真实登录态后的用户数据
