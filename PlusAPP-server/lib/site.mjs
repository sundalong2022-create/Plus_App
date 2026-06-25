import { handleRequest } from "./app.mjs";

function sendHtml(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(body);
}

function renderLayout({ title, content, bodyClass = "" }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --surface: #ffffff;
      --surface-soft: #f8fbff;
      --text: #132238;
      --muted: #5f6f85;
      --line: #dfe7f2;
      --primary: #2251cc;
      --primary-soft: #eaf0ff;
      --accent: #ff9f5a;
      --mint: #dff8ee;
      --sky: #e8f4ff;
      --shadow: 0 16px 44px rgba(18, 34, 56, 0.08);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top left, #eff5ff 0, transparent 32%),
        linear-gradient(180deg, #f7faff 0%, var(--bg) 42%, #eef3f9 100%);
      color: var(--text);
    }
    .wrap {
      max-width: 1120px;
      margin: 0 auto;
      padding: 28px 20px 72px;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      text-decoration: none;
      color: var(--text);
    }
    .brand-mark {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #2351cb 0%, #4d7cff 100%);
      color: #fff;
      box-shadow: 0 10px 24px rgba(34, 81, 204, 0.26);
      font-size: 18px;
    }
    .brand-copy strong {
      display: block;
      font-size: 16px;
    }
    .brand-copy span {
      color: var(--muted);
      font-size: 12px;
    }
    .nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .nav-links a {
      text-decoration: none;
      color: var(--muted);
      font-size: 14px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.76);
      border: 1px solid rgba(223, 231, 242, 0.92);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .nav-links a:hover,
    .nav-links a:focus-visible,
    .btn:hover,
    .btn:focus-visible,
    .card-link:hover,
    .card-link:focus-visible,
    .route:hover,
    .route:focus-visible {
      transform: translateY(-1px);
      border-color: #bfd0eb;
      box-shadow: 0 10px 22px rgba(18, 34, 56, 0.08);
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(320px, 420px);
      gap: 22px;
      align-items: stretch;
      margin-bottom: 22px;
    }
    .hero-main {
      background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.96) 100%);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 34px;
      box-shadow: var(--shadow);
    }
    .hero-side {
      background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 22px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: var(--primary-soft);
      color: var(--primary);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-bottom: 14px;
    }
    h1 {
      font-size: 42px;
      line-height: 1.1;
      margin: 0 0 14px;
    }
    h2, h3 { color: var(--text); }
    p, li {
      margin: 0 0 16px;
      line-height: 1.8;
      color: var(--muted);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 22px;
      margin-bottom: 22px;
    }
    .btn {
      display: inline-block;
      padding: 12px 18px;
      border-radius: 999px;
      border: 1px solid var(--line);
      text-decoration: none;
      color: var(--text);
      background: #fff;
      font-weight: 600;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .btn.primary {
      background: var(--text);
      color: #fff;
      border-color: var(--text);
    }
    .btn.ghost {
      background: rgba(255,255,255,0.72);
    }
    .hero-points {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .point {
      padding: 14px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 16px;
    }
    .point strong {
      display: block;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .point span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }
    .phone {
      border-radius: 28px;
      border: 1px solid #cfd8e8;
      background: linear-gradient(180deg, #0f2038 0%, #213a65 100%);
      padding: 12px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.14);
    }
    .screen {
      border-radius: 22px;
      background: linear-gradient(180deg, #eff8ff 0%, #f8fbff 100%);
      padding: 18px 16px;
    }
    .screen-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      font-size: 12px;
      color: #6a7a92;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: #fff;
      border: 1px solid #d9e4f3;
      font-size: 12px;
      color: #3f5678;
    }
    .hero-card {
      background: #fff;
      border-radius: 18px;
      border: 1px solid #dfe7f2;
      padding: 16px;
      margin-bottom: 12px;
    }
    .hero-card h2 {
      margin: 0 0 8px;
      font-size: 20px;
    }
    .progress {
      margin-top: 14px;
      height: 10px;
      border-radius: 999px;
      background: #e9f0fb;
      overflow: hidden;
    }
    .progress > span {
      display: block;
      width: 72%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #6ec3ff 0%, #3e78ff 100%);
    }
    .calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      margin-top: 14px;
    }
    .calendar span {
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      border-radius: 12px;
      background: #eef4fd;
      color: #597090;
      font-size: 12px;
    }
    .calendar span.done {
      background: #dff8ee;
      color: #157048;
      font-weight: 700;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .stat {
      padding: 14px;
      border-radius: 16px;
      border: 1px solid var(--line);
      background: #fff;
    }
    .stat strong {
      display: block;
      font-size: 24px;
      margin-bottom: 4px;
    }
    .section {
      margin-top: 18px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(223, 231, 242, 0.92);
      border-radius: 24px;
      padding: 26px;
    }
    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }
    .section-head h2 {
      margin: 0 0 6px;
      font-size: 28px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
    }
    .card h3 {
      font-size: 18px;
      margin: 0 0 10px;
    }
    .card-link {
      display: block;
      text-decoration: none;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .card-link .card {
      height: 100%;
    }
    .label {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .label.sky { background: var(--sky); color: #2251cc; }
    .label.mint { background: var(--mint); color: #157048; }
    .label.warm { background: #fff1e5; color: #b85c0d; }
    .route-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
    .route {
      display: block;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      text-decoration: none;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .route code {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--text);
    }
    .checklist {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .check-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
    }
    .code-block {
      padding: 14px 16px;
      border-radius: 14px;
      background: #0f2038;
      color: #e6edf8;
      overflow: auto;
      margin: 12px 0 0;
    }
    .footer {
      margin-top: 24px;
      color: var(--muted);
      font-size: 13px;
      text-align: center;
    }
    code, pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 13px;
    }
    .muted { color: var(--muted); }
    ul {
      margin: 0;
      padding-left: 18px;
    }
    @media (max-width: 980px) {
      .hero,
      .grid,
      .route-grid,
      .checklist {
        grid-template-columns: 1fr;
      }
      .hero-points,
      .stats {
        grid-template-columns: 1fr 1fr;
      }
      h1 {
        font-size: 34px;
      }
    }
    @media (max-width: 640px) {
      .wrap {
        padding: 18px 14px 44px;
      }
      .topbar,
      .section-head {
        display: block;
      }
      .nav-links {
        margin-top: 12px;
      }
      .hero-main,
      .hero-side,
      .section {
        padding: 20px;
      }
      .hero-points,
      .stats {
        grid-template-columns: 1fr;
      }
      h1 {
        font-size: 30px;
      }
    }
  </style>
</head>
<body class="${bodyClass}">
  <main class="wrap">
    <header class="topbar">
      <a class="brand" href="/">
        <div class="brand-mark">9x9</div>
        <div class="brand-copy">
          <strong>PlusAPP</strong>
          <span>一年级乘法口诀训练小程序</span>
        </div>
      </a>
      <nav class="nav-links" aria-label="quick links">
        <a href="/#features">产品亮点</a>
        <a href="/#parents">家长视角</a>
        <a href="/guide">体验指引</a>
        <a href="/docs">接口文档</a>
      </nav>
    </header>
    ${content}
  </main>
</body>
</html>`;
}

function renderHomePage() {
  return renderLayout({
    title: "PlusAPP - 口诀小勇士",
    content: `
    <section class="hero">
      <div class="hero-main">
        <div class="eyebrow">口诀小勇士 · PlusAPP</div>
        <h1>把乘法口诀练成每天愿意打开的 10 分钟小习惯。</h1>
        <p>面向一年级小朋友的乘法口诀训练产品，把新口诀学习、闯关答题、错题救援、奖励反馈和家长看板连成一条轻量主线。孩子不会被内容淹没，家长也不用盯很多复杂数据。</p>
        <div class="actions">
          <a class="btn primary" href="/guide">体验指引</a>
          <a class="btn" href="/docs">查看接口文档</a>
          <a class="btn ghost" href="/health">服务状态</a>
        </div>
        <div class="hero-points">
          <div class="point">
            <strong>7 天主线</strong>
            <span>每天只做少量任务，完成日历一点点点亮。</span>
          </div>
          <div class="point">
            <strong>游戏化练习</strong>
            <span>走格子闯关、快问快答、错题救援，练习不单调。</span>
          </div>
          <div class="point">
            <strong>家长更省力</strong>
            <span>只盯时长、掌握层次和高频错题，不必看大表格。</span>
          </div>
        </div>
      </div>

      <aside class="hero-side" aria-label="product preview">
        <div class="phone">
          <div class="screen">
            <div class="screen-top">
              <span>PlusAPP</span>
              <span class="pill">今日已练 8 分钟</span>
            </div>
            <div class="hero-card">
              <span class="pill">第 3 天 · 学习 3 的口诀</span>
              <h2>口诀小勇士</h2>
              <p class="muted">先看图示、找规律，再把新口诀读顺。</p>
              <div class="progress"><span></span></div>
            </div>
            <div class="stats">
              <div class="stat">
                <strong>3/4</strong>
                <span class="muted">今日任务</span>
              </div>
              <div class="stat">
                <strong>92%</strong>
                <span class="muted">本周保持率</span>
              </div>
            </div>
            <div class="calendar">
              <span class="done">1</span>
              <span class="done">2</span>
              <span class="done">3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
            </div>
          </div>
        </div>
        <a class="card-link" href="/guide#parents">
          <div class="card">
          <span class="label mint">家长看板</span>
          <h3>这里不需要看太多数据</h3>
          <p>时长、掌握层次、高频错题和明日建议，已经足够帮助家长判断今天练得怎么样。</p>
          </div>
        </a>
      </aside>
    </section>

    <section class="section" id="features">
      <div class="section-head">
        <div>
          <h2>围绕记忆目标设计，而不是只堆题库</h2>
          <p>首页、学习、闯关、错题本、家长看板是同一条训练链路，不是分散的几个孤立页面。</p>
        </div>
      </div>
      <div class="grid">
        <a class="card-link" href="/guide#learn">
          <article class="card">
          <span class="label sky">口诀学习</span>
          <h3>先看懂，再跟读，再进入练习</h3>
          <p>把乘法先讲成重复加法，再用口诀卡片和慢速语音帮助孩子形成初记忆。</p>
          </article>
        </a>
        <a class="card-link" href="/guide#games">
          <article class="card">
          <span class="label mint">闯关练习</span>
          <h3>用小游戏把重复记忆变轻</h3>
          <p>走格子闯关、快问快答和配对式复习，适合刚学完口诀后的即时巩固。</p>
          </article>
        </a>
        <a class="card-link" href="/guide#wrongbook">
          <article class="card">
          <span class="label warm">错题救援</span>
          <h3>把有限注意力花在高频错题上</h3>
          <p>错题不会一次压给孩子，而是按最近反复出错的题目优先回流复习。</p>
          </article>
        </a>
      </div>
    </section>

    <section class="section" id="parents">
      <div class="section-head">
        <div>
          <h2>给家长看的，不是复杂后台，而是陪练依据</h2>
          <p>当家长只有几分钟能陪孩子时，最重要的是知道今天该盯什么，不是翻几十行数据。</p>
        </div>
      </div>
      <div class="grid">
        <a class="card-link" href="/guide#calendar">
          <article class="card">
          <h3>完成日历</h3>
          <p>每天点亮一格，比单纯打卡更有推进感，也方便判断最近有没有断练。</p>
          </article>
        </a>
        <a class="card-link" href="/guide#parents">
          <article class="card">
          <h3>口诀掌握分层</h3>
          <p>把掌握情况分成稳定、半熟和待加强三层，比看总分更能指导复习顺序。</p>
          </article>
        </a>
        <a class="card-link" href="/guide#parents">
          <article class="card">
          <h3>明日建议</h3>
          <p>自动给出下一次先复习哪几题、再进入哪段新内容，让陪练动作更直接。</p>
          </article>
        </a>
      </div>
    </section>

    <section class="section" id="experience">
      <div class="section-head">
        <div>
          <h2>开始体验</h2>
          <p>如果你是家长或产品演示访客，可以先从体验指引看一遍；如果你是开发或联调同学，可以直接看接口文档和服务状态。</p>
        </div>
      </div>
      <div class="checklist">
        <div class="check-card">
          <span class="label sky">家长 / 访客</span>
          <h3>先看体验流程</h3>
          <p>了解 7 天主线、小游戏训练、家长看板和错题救援这条完整学习路径。</p>
          <a class="btn" href="/guide">打开体验指引</a>
        </div>
        <div class="check-card">
          <span class="label mint">开发联调</span>
          <h3>直接看接口入口</h3>
          <p>查看健康检查、登录接口和训练相关接口路径，便于小程序或服务端联调。</p>
          <a class="btn" href="/docs">打开接口文档</a>
        </div>
        <div class="check-card">
          <span class="label warm">线上状态</span>
          <h3>确认服务是否可用</h3>
          <p>站点首页是给人看的，健康检查是给联调和排查看的，两条线分开更清楚。</p>
          <a class="btn" href="/health">查看服务状态</a>
        </div>
      </div>
    </section>

    <section class="section" id="routes">
      <div class="section-head">
        <div>
          <h2>Vercel 路由方案</h2>
          <p>同一个域名同时承接官网首页和小程序 API，外部浏览器看首页，小程序走接口。</p>
        </div>
      </div>
      <div class="route-grid">
        <a class="route" href="/">
          <code>/</code>
          <p class="muted">产品首页</p>
        </a>
        <a class="route" href="/health">
          <code>/health</code>
          <p class="muted">服务状态 JSON</p>
        </a>
        <a class="route" href="/docs#wx-login">
          <code>/api/wx/login</code>
          <p class="muted">登录接口</p>
        </a>
        <a class="route" href="/docs#train-api">
          <code>/api/*</code>
          <p class="muted">训练、错题本、家长看板等接口</p>
        </a>
      </div>
    </section>

    <p class="footer">PlusAPP 站点首页用于产品展示，微信小程序前端仍在微信运行环境中使用。</p>`,
    bodyClass: "home"
  });
}

function renderGuidePage() {
  return renderLayout({
    title: "PlusAPP - 体验指引",
    content: `
    <section class="section">
      <div class="eyebrow">体验指引</div>
      <h1>从首页到家长看板，按这条线看就最顺。</h1>
      <p>这不是浏览器里的完整训练系统，而是一份帮助你理解小程序体验逻辑的产品向导。你可以把它当成演示页，快速看懂每个模块为什么存在、分别解决什么问题。</p>
      <div class="actions">
        <a class="btn primary" href="/">返回首页</a>
        <a class="btn" href="/docs">接口文档</a>
      </div>
    </section>

    <section class="section" id="learn">
      <div class="section-head">
        <div>
          <h2>1. 口诀学习</h2>
          <p>孩子进入新一天训练时，先看图示理解，再开始慢速跟读和口诀卡片记忆。</p>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h3>看图示、找规律</h3>
          <p>把乘法先理解成重复加法，先建立“什么意思”，再开始背诵。</p>
        </div>
        <div class="card">
          <h3>慢速语音跟读</h3>
          <p>语音节奏偏慢，适合一年级孩子跟着读，不会一开口就被速度带跑。</p>
        </div>
        <div class="card">
          <h3>卡片式记忆</h3>
          <p>像翻卡一样看口诀，视觉负担小，孩子更容易一眼记住一小段。</p>
        </div>
      </div>
    </section>

    <section class="section" id="games">
      <div class="section-head">
        <div>
          <h2>2. 小游戏练习</h2>
          <p>练习不只是一页纯题目，而是借小游戏把重复记忆变轻。</p>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h3>走格子闯关</h3>
          <p>边推进地图边答题，适合作为当天主任务，完成感更强。</p>
        </div>
        <div class="card">
          <h3>快问快答</h3>
          <p>节奏短平快，适合做新口诀学完后的第一轮即时巩固。</p>
        </div>
        <div class="card">
          <h3>配对复习</h3>
          <p>先记题目再记答案，尤其适合刚接触新口诀那几天。</p>
        </div>
      </div>
    </section>

    <section class="section" id="wrongbook">
      <div class="section-head">
        <div>
          <h2>3. 错题本与错题救援</h2>
          <p>不是把所有错题都堆给孩子，而是优先回收最近连续出错的题目。</p>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h3>最近错题聚合</h3>
          <p>把高频错题收拢到一个入口，家长能一眼看出今天值不值得复习。</p>
        </div>
        <div class="card">
          <h3>错题救援模式</h3>
          <p>每次只救回几题，避免孩子一看到错题列表就失去继续练的意愿。</p>
        </div>
        <div class="card">
          <h3>明日优先建议</h3>
          <p>告诉家长明天先练哪几题，再进入新口诀，减少陪练犹豫。</p>
        </div>
      </div>
    </section>

    <section class="section" id="calendar">
      <div class="section-head">
        <div>
          <h2>4. 完成日历</h2>
          <p>每天点亮一格，比简单签到更能带出“主线推进感”。</p>
        </div>
      </div>
      <div class="card">
        <p>孩子看到自己不是在做一堆散题，而是在完成 7 天小旅程，这种心理感受对持续练习很重要。</p>
      </div>
    </section>

    <section class="section" id="parents">
      <div class="section-head">
        <div>
          <h2>5. 家长看板</h2>
          <p>它不是教培后台，而是帮助家长在很短时间里判断“今天练得怎么样”。</p>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h3>今日时长</h3>
          <p>先看今天有没有练，再看练了多久，不靠大而杂的报表说话。</p>
        </div>
        <div class="card">
          <h3>掌握分层</h3>
          <p>把口诀分成已掌握、学习中、薄弱项三层，复习顺序马上就清楚。</p>
        </div>
        <div class="card">
          <h3>高频错题</h3>
          <p>家长不需要全查，只要优先盯住那几题反复错的内容。</p>
        </div>
      </div>
    </section>

    <p class="footer">如果要真正体验训练流程，请在微信开发者工具或真机里打开小程序工程。</p>`
  });
}

function renderDocsPage() {
  return renderLayout({
    title: "PlusAPP - 接口文档",
    content: `
    <section class="section">
      <div class="eyebrow">接口文档</div>
      <h1>浏览器看首页，小程序走 API。</h1>
      <p>这页给开发联调和部署排查使用。首页面向产品展示，这里则集中列出当前常用接口入口和请求方式。</p>
      <div class="actions">
        <a class="btn primary" href="/health">健康检查</a>
        <a class="btn" href="/">返回首页</a>
      </div>
    </section>

    <section class="section" id="wx-login">
      <div class="section-head">
        <div>
          <h2>登录接口</h2>
          <p>小程序通过 <code>wx.login()</code> 获取临时 code 后，调用服务端换取业务 token。</p>
        </div>
      </div>
      <div class="card">
        <h3><code>POST /api/wx/login</code></h3>
        <div class="code-block"><pre>{
  "code": "wx-login-code"
}</pre></div>
      </div>
    </section>

    <section class="section" id="train-api">
      <div class="section-head">
        <div>
          <h2>训练相关接口</h2>
          <p>这些接口支撑首页、学习、练习、结果页、错题本和家长看板。</p>
        </div>
      </div>
      <div class="grid">
        <div class="card"><h3><code>GET /api/app/init</code></h3><p>应用初始化数据。</p></div>
        <div class="card"><h3><code>GET /api/home/today</code></h3><p>首页今日任务和完成度。</p></div>
        <div class="card"><h3><code>GET /api/learn/content</code></h3><p>口诀学习页内容。</p></div>
        <div class="card"><h3><code>POST /api/session/start</code></h3><p>开始一局训练。</p></div>
        <div class="card"><h3><code>POST /api/session/answer</code></h3><p>提交单题答案。</p></div>
        <div class="card"><h3><code>POST /api/session/finish</code></h3><p>结束训练并生成结果。</p></div>
        <div class="card"><h3><code>GET /api/wrongbook</code></h3><p>获取错题本数据。</p></div>
        <div class="card"><h3><code>POST /api/wrongbook/review-start</code></h3><p>开启错题救援。</p></div>
        <div class="card"><h3><code>GET /api/parent/dashboard</code></h3><p>家长看板数据。</p></div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2>语音接口</h2>
          <p>用于朗读当天内容、题目提示音和系统奖励语音。</p>
        </div>
      </div>
      <div class="grid">
        <div class="card"><h3><code>GET /api/tts/day?day=1</code></h3><p>当天学习页朗读音频。</p></div>
        <div class="card"><h3><code>GET /api/tts/question?questionId=q_3x6</code></h3><p>题目听题音频。</p></div>
        <div class="card"><h3><code>GET /api/tts/system?key=rewardComplete</code></h3><p>奖励提示音频。</p></div>
      </div>
    </section>

    <p class="footer">当前站点适合做小程序后端和产品展示首页，不是浏览器里的完整训练系统。</p>`
  });
}

export async function handleSiteRequest(req, res) {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  if (pathname === "/" || pathname === "/index.html") {
    sendHtml(res, 200, renderHomePage());
    return;
  }

  if (pathname === "/guide") {
    sendHtml(res, 200, renderGuidePage());
    return;
  }

  if (pathname === "/docs") {
    sendHtml(res, 200, renderDocsPage());
    return;
  }

  if (pathname === "/favicon.ico") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (pathname === "/health" || pathname.startsWith("/api/")) {
    await handleRequest(req, res);
    return;
  }

  sendHtml(res, 404, `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Not Found</title><body><h1>404</h1><p>页面不存在</p></body></html>`);
}
