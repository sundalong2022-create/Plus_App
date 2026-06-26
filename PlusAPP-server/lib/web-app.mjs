export function renderWebAppPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PlusAPP Web</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --surface: #ffffff;
      --text: #132238;
      --muted: #60708a;
      --line: #dfe7f2;
      --primary: #2251cc;
      --primary-soft: #eaf0ff;
      --mint: #dff8ee;
      --sky: #e8f4ff;
      --warm: #fff1e5;
      --coral: #fff0eb;
      --shadow: 0 16px 44px rgba(18, 34, 56, 0.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top left, #eff5ff 0, transparent 34%),
        linear-gradient(180deg, #f8fbff 0%, var(--bg) 44%, #eef3f9 100%);
      color: var(--text);
    }
    button, input {
      font: inherit;
    }
    button {
      cursor: pointer;
    }
    .app-shell {
      max-width: 1180px;
      margin: 0 auto;
      padding: 22px 18px 68px;
    }
    .app-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text);
    }
    .brand-mark {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      color: #fff;
      font-weight: 800;
      background: linear-gradient(135deg, #2351cb 0%, #4d7cff 100%);
      box-shadow: 0 10px 24px rgba(34, 81, 204, 0.26);
    }
    .brand strong {
      display: block;
      font-size: 16px;
    }
    .brand span {
      display: block;
      color: var(--muted);
      font-size: 12px;
      margin-top: 2px;
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .status-pill,
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 7px 11px;
      background: #fff;
      color: #3f5678;
      font-size: 12px;
      white-space: nowrap;
    }
    .app-layout {
      display: grid;
      grid-template-columns: 210px minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }
    .side-nav,
    .main-panel,
    .panel {
      background: rgba(255,255,255,0.86);
      border: 1px solid rgba(223, 231, 242, 0.94);
      border-radius: 22px;
      box-shadow: var(--shadow);
    }
    .side-nav {
      padding: 12px;
      position: sticky;
      top: 18px;
    }
    .nav-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      padding: 12px;
      border-radius: 14px;
      margin: 2px 0;
      text-align: left;
      font-weight: 650;
    }
    .nav-btn.is-active {
      color: var(--text);
      background: var(--primary-soft);
      border-color: #d4def7;
    }
    .main-panel {
      min-height: 640px;
      padding: 22px;
    }
    .view-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 18px;
    }
    .view-head h1 {
      margin: 0 0 8px;
      font-size: 32px;
      line-height: 1.15;
    }
    .view-head p,
    p {
      color: var(--muted);
      line-height: 1.75;
      margin: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .grid.four {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
    }
    .card h2,
    .card h3 {
      margin: 0 0 10px;
    }
    .hero-card {
      background: linear-gradient(135deg, #ffffff 0%, #f6faff 100%);
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 22px;
      margin-bottom: 16px;
    }
    .progress {
      height: 10px;
      border-radius: 999px;
      background: #e9f0fb;
      overflow: hidden;
      margin: 14px 0 0;
    }
    .progress-bar {
      width: 0%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #6ec3ff 0%, #3e78ff 100%);
      transition: width .22s ease;
    }
    .task-list,
    .list-stack {
      display: grid;
      gap: 12px;
    }
    .task-row,
    .list-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px;
      background: #fff;
    }
    .row-title {
      font-weight: 750;
      margin-bottom: 5px;
    }
    .btn {
      border: 1px solid var(--line);
      background: #fff;
      color: var(--text);
      border-radius: 999px;
      padding: 10px 14px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .btn:hover,
    .btn:focus-visible {
      transform: translateY(-1px);
      border-color: #bfd0eb;
      box-shadow: 0 10px 22px rgba(18, 34, 56, 0.08);
    }
    .btn.primary {
      color: #fff;
      background: var(--text);
      border-color: var(--text);
    }
    .btn.full {
      width: 100%;
    }
    .btn.small {
      padding: 8px 11px;
      font-size: 13px;
    }
    .question-card {
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 22px;
      background: #fff;
    }
    .question-formula {
      font-size: 44px;
      line-height: 1;
      font-weight: 850;
      margin: 10px 0 18px;
    }
    .option-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .option-btn {
      min-height: 58px;
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 16px;
      padding: 14px;
      font-size: 19px;
      font-weight: 850;
      color: var(--text);
      text-align: center;
    }
    .option-btn.is-correct {
      border-color: #3abf7a;
      background: #e7fbf1;
    }
    .option-btn.is-wrong {
      border-color: #f38b6a;
      background: #fff3ef;
    }
    .feedback {
      min-height: 56px;
      margin-top: 14px;
      padding: 14px;
      border-radius: 16px;
      border: 1px solid #ffd99f;
      background: #fff7e8;
      color: #8a5800;
      line-height: 1.7;
    }
    .calendar-row {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 8px;
    }
    .calendar-node {
      min-height: 74px;
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: #fff;
      text-align: center;
      font-size: 13px;
      color: var(--muted);
    }
    .calendar-node.done {
      background: var(--mint);
      color: #157048;
      font-weight: 800;
    }
    .formula-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .formula-chip {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 13px;
      color: var(--text);
    }
    .resume-card {
      border: 1px solid #d9e4f3;
      background: linear-gradient(135deg, #f6fbff 0%, #ffffff 100%);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 14px;
    }
    .match-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
    .match-card {
      aspect-ratio: 1 / 1;
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 18px;
      display: grid;
      place-items: center;
      padding: 12px;
      font-size: 24px;
      font-weight: 850;
      color: var(--text);
      transition: transform .16s ease, border-color .16s ease, background .16s ease;
    }
    .match-card.is-open {
      background: var(--sky);
      border-color: #bcd6ff;
    }
    .match-card.is-matched {
      background: var(--mint);
      border-color: #bdebcf;
      color: #157048;
    }
    .match-card.is-closed {
      background: linear-gradient(135deg, #ffffff 0%, #f7faff 100%);
      color: #87a0c0;
    }
    .match-card:hover,
    .match-card:focus-visible {
      transform: translateY(-1px);
      border-color: #bfd0eb;
    }
    .loading,
    .empty {
      padding: 24px;
      border-radius: 18px;
      background: #fff;
      border: 1px dashed #c9d5e8;
      color: var(--muted);
      text-align: center;
    }
    .reward {
      border: 1px solid #ffd99f;
      background: #fff7e8;
      border-radius: 18px;
      padding: 18px;
      margin-top: 16px;
    }
    @media (max-width: 920px) {
      .app-layout {
        grid-template-columns: 1fr;
      }
      .side-nav {
        position: static;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
      }
      .nav-btn {
        justify-content: center;
      }
      .grid,
      .grid.two,
      .grid.four {
        grid-template-columns: 1fr;
      }
      .match-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
    @media (max-width: 640px) {
      .app-shell {
        padding: 14px 12px 46px;
      }
      .app-topbar,
      .view-head,
      .task-row,
      .list-row {
        align-items: stretch;
        flex-direction: column;
      }
      .side-nav {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .main-panel {
        padding: 16px;
      }
      .view-head h1 {
        font-size: 26px;
      }
      .option-grid,
      .calendar-row {
        grid-template-columns: 1fr;
      }
      .match-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  </style>
</head>
<body>
  <main class="app-shell">
    <header class="app-topbar">
      <a class="brand" href="/">
        <span class="brand-mark">9x9</span>
        <span>
          <strong>PlusAPP Web</strong>
          <span>浏览器训练版</span>
        </span>
      </a>
      <div class="top-actions">
        <span class="status-pill" id="authStatus">连接中</span>
        <a class="btn small" href="/">官网首页</a>
      </div>
    </header>

    <section class="app-layout">
      <nav class="side-nav" aria-label="Web app nav">
        <button class="nav-btn is-active" type="button" data-view="home">首页</button>
        <button class="nav-btn" type="button" data-view="learn">学习</button>
        <button class="nav-btn" type="button" data-view="quiz">快答</button>
        <button class="nav-btn" type="button" data-view="match">配对</button>
        <button class="nav-btn" type="button" data-view="level">闯关</button>
        <button class="nav-btn" type="button" data-view="wrongbook">错题</button>
        <button class="nav-btn" type="button" data-view="parent">家长</button>
      </nav>
      <section class="main-panel" id="appRoot">
        <div class="loading">正在连接 PlusAPP 后端...</div>
      </section>
    </section>
  </main>
  <script>
    (function () {
      const STORAGE_KEY = "plusapp_web_runtime_v1";

      const defaultMatchState = () => ({
        cards: [],
        openedCardIds: [],
        matchedCount: 0,
        totalPairs: 0,
        locked: false,
        completedPairIds: [],
        showReward: false
      });

      function readRuntime() {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        } catch {
          return null;
        }
      }

      const runtime = readRuntime();
      const state = {
        token: localStorage.getItem("plusapp_web_token") || "",
        view: runtime?.view || "home",
        currentDay: 1,
        init: null,
        today: null,
        learn: null,
        session: runtime?.session || null,
        gameType: runtime?.gameType || "quiz",
        questionIndex: runtime?.questionIndex || 0,
        answered: runtime?.answered || false,
        lastFeedback: runtime?.lastFeedback || null,
        lastAnswerMeta: runtime?.lastAnswerMeta || null,
        result: runtime?.result || null,
        matchState: runtime?.matchState || defaultMatchState()
      };

      let matchResolveTimer = 0;
      let matchRewardTimer = 0;

      const root = document.getElementById("appRoot");
      const authStatus = document.getElementById("authStatus");
      const navButtons = Array.from(document.querySelectorAll(".nav-btn"));

      function persistRuntime() {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            view: state.view,
            session: state.session,
            gameType: state.gameType,
            questionIndex: state.questionIndex,
            answered: state.answered,
            lastFeedback: state.lastFeedback,
            lastAnswerMeta: state.lastAnswerMeta,
            result: state.result,
            matchState: state.matchState
          })
        );
      }

      function clearTimers() {
        if (matchResolveTimer) {
          clearTimeout(matchResolveTimer);
          matchResolveTimer = 0;
        }
        if (matchRewardTimer) {
          clearTimeout(matchRewardTimer);
          matchRewardTimer = 0;
        }
      }

      function clearActiveSession() {
        clearTimers();
        state.session = null;
        state.gameType = "quiz";
        state.questionIndex = 0;
        state.answered = false;
        state.lastFeedback = null;
        state.lastAnswerMeta = null;
        state.matchState = defaultMatchState();
        persistRuntime();
      }

      function escapeHtml(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function setActive(view) {
        navButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.view === view));
      }

      function setView(view) {
        state.view = view;
        persistRuntime();
      }

      function syncViewFromGame() {
        if (state.gameType === "match") {
          setView("match");
        } else if (state.gameType === "level") {
          setView("level");
        } else if (state.gameType === "rescue") {
          setView("wrongbook");
        } else {
          setView("quiz");
        }
      }

      function normalizeMatchState(cards) {
        const nextCards = (cards || []).map((card) => ({
          ...card,
          status: card.status === "matched" ? "matched" : "closed"
        }));
        const completedPairIds = Array.from(
          new Set(nextCards.filter((card) => card.status === "matched").map((card) => card.pairId))
        );
        const openedCardIds = nextCards.filter((card) => card.status === "opened").map((card) => card.id);
        const totalPairs = nextCards.length ? nextCards.length / 2 : 0;

        return {
          cards: nextCards,
          openedCardIds,
          matchedCount: completedPairIds.length,
          totalPairs,
          locked: false,
          completedPairIds,
          showReward: false
        };
      }

      function getResumeMeta() {
        if (!state.session) return null;
        const labels = {
          quiz: "快问快答",
          match: "翻卡片配对",
          level: "走格子闯关",
          rescue: "错题救援"
        };
        const label = labels[state.gameType] || "训练";
        if (state.gameType === "match") {
          return {
            label,
            detail: "已配对 " + state.matchState.matchedCount + " / " + state.matchState.totalPairs + " 组"
          };
        }
        const total = state.session.questions?.length || 0;
        return {
          label,
          detail: "进行到第 " + Math.min(state.questionIndex + 1, total || 1) + " / " + total + " 题"
        };
      }

      async function api(path, options) {
        const headers = { "Content-Type": "application/json" };
        if (state.token) headers.Authorization = "Bearer " + state.token;
        const response = await fetch(path, {
          method: options?.method || "GET",
          headers,
          body: options?.body ? JSON.stringify(options.body) : undefined
        });
        const payload = await response.json();
        if (!response.ok || !payload.ok) {
          throw new Error(payload?.error?.message || "request failed");
        }
        return payload.data;
      }

      async function ensureLogin() {
        if (state.token) {
          try {
            await api("/api/me");
            authStatus.textContent = "已连接";
            return;
          } catch {
            state.token = "";
            localStorage.removeItem("plusapp_web_token");
          }
        }
        const login = await api("/api/wx/login", {
          method: "POST",
          body: { code: "web-demo-" + Date.now() }
        });
        state.token = login.token;
        localStorage.setItem("plusapp_web_token", state.token);
        authStatus.textContent = login.mode === "mock" ? "调试登录" : "正式登录";
      }

      async function loadBase() {
        const [init, today] = await Promise.all([
          api("/api/app/init"),
          api("/api/home/today")
        ]);
        state.init = init;
        state.today = today;
        state.currentDay = today.currentDay;
      }

      function renderShell(title, subtitle, body, actionHtml) {
        root.innerHTML =
          '<div class="view-head">' +
            '<div><h1>' + title + '</h1><p>' + subtitle + '</p></div>' +
            (actionHtml ? '<div class="top-actions">' + actionHtml + '</div>' : "") +
          "</div>" +
          body;
      }

      function renderHome() {
        setView("home");
        setActive("home");
        const progress = state.today?.todayProgress || 0;
        const stars = state.init?.progress?.stars || [];
        const tasks = state.today?.todayTasks || [];
        const resumeMeta = getResumeMeta();
        const resumeHtml = resumeMeta
          ? '<div class="resume-card"><div class="row-title">继续上次训练</div><p>' +
            escapeHtml(resumeMeta.label + " · " + resumeMeta.detail) +
            '</p><div style="margin-top:14px"><button class="btn primary" type="button" data-resume-session>继续训练</button></div></div>'
          : "";
        const taskHtml = tasks.map((task) =>
          '<div class="task-row">' +
            '<div><div class="row-title">' + escapeHtml(task.title) + '</div>' +
            '<p>' + task.minutes + " 分钟 · " + task.status + "</p></div>" +
            '<button class="btn small" type="button" data-task="' + task.type + '">' + (task.status === "done" ? "查看" : "开始") + "</button>" +
          "</div>"
        ).join("");
        const calendar = stars.map((done, index) =>
          '<div class="calendar-node ' + (done ? "done" : "") + '"><div>第' + (index + 1) + "天</div><strong>" + (done ? "已点亮" : "待完成") + "</strong></div>"
        ).join("");
        renderShell(
          "口诀小勇士",
          state.today?.dayTitle || "今日训练",
          resumeHtml +
          '<div class="hero-card">' +
            '<div class="pill">今天完成度 ' + progress + "%</div>" +
            '<div class="progress"><div class="progress-bar" style="width:' + progress + '%"></div></div>' +
          "</div>" +
          '<div class="grid two">' +
            '<div class="card"><h2>今日任务</h2><div class="task-list">' + taskHtml + "</div></div>" +
            '<div class="card"><h2>7 天完成日历</h2><div class="calendar-row">' + calendar + "</div></div>" +
          "</div>",
          '<button class="btn primary" type="button" data-start="learn">开始今天练习</button>'
        );
      }

      async function renderLearn() {
        setView("learn");
        setActive("learn");
        state.learn = await api("/api/learn/content?day=" + state.currentDay);
        persistRuntime();
        const rhymes = state.learn.rhymes.slice(0, 12).map((item) =>
          '<span class="formula-chip">' + escapeHtml(item.rhymeText) + "</span>"
        ).join("");
        const tips = state.learn.tips.map((tip) => "<li>" + escapeHtml(tip) + "</li>").join("");
        renderShell(
          "口诀学习",
          state.learn.dayTitle,
          '<div class="grid two">' +
            '<div class="card"><h2>图示理解</h2><p>' + escapeHtml(state.learn.visualExample.formula) + " 可以看成：" + escapeHtml(state.learn.visualExample.expressionText) + '</p><div class="formula-strip">' + rhymes + "</div></div>" +
            '<div class="card"><h2>记忆提醒</h2><ul>' + tips + '</ul><div style="margin-top:16px"><button class="btn primary" type="button" data-start="quiz">开始快问快答</button><button class="btn" style="margin-left:8px" type="button" data-start="match">翻卡片配对</button></div></div>' +
          "</div>",
          '<button class="btn" type="button" data-start="level">去闯关</button>'
        );
      }

      async function startSession(gameType) {
        clearTimers();
        state.gameType = gameType;
        state.questionIndex = 0;
        state.answered = false;
        state.lastFeedback = null;
        state.lastAnswerMeta = null;
        state.result = null;
        state.matchState = defaultMatchState();
        syncViewFromGame();
        setActive(gameType === "match" ? "match" : state.view);
        persistRuntime();
        state.session = await api("/api/session/start", {
          method: "POST",
          body: { gameType, day: state.currentDay, source: "daily" }
        });
        if (gameType === "match") {
          state.matchState = normalizeMatchState(state.session.cards || []);
          persistRuntime();
          renderMatch();
          return;
        }
        persistRuntime();
        renderQuestion();
      }

      function getQuestionViewMeta() {
        if (state.gameType === "level") {
          return { title: "走格子闯关", view: "level" };
        }
        if (state.gameType === "rescue") {
          return { title: "错题救援", view: "wrongbook" };
        }
        return { title: "快问快答", view: "quiz" };
      }

      function renderQuestion() {
        const questions = state.session?.questions || [];
        const question = questions[state.questionIndex];
        if (!question) {
          finishSession();
          return;
        }
        const meta = getQuestionViewMeta();
        syncViewFromGame();
        setActive(meta.view);
        persistRuntime();
        const options = question.options.map((option) =>
          '<button class="option-btn" type="button" data-answer="' + option + '">' + option + "</button>"
        ).join("");
        const feedback = state.lastFeedback
          ? '<div class="feedback">' + escapeHtml(state.lastFeedback) + "</div>"
          : '<div class="feedback">选一个答案，答完会看到口诀提示。</div>';
        const actionHtml = state.answered
          ? '<button class="btn" type="button" data-next-question>下一题</button>'
          : '<button class="btn" type="button" data-view-target="home">稍后继续</button>';
        renderShell(
          meta.title,
          "第 " + (state.questionIndex + 1) + " / " + questions.length + " 题",
          '<div class="question-card">' +
            '<div class="pill">' + escapeHtml(question.sourceTag) + "</div>" +
            '<div class="question-formula">' + escapeHtml(question.formula) + " = ?</div>" +
            '<div class="option-grid">' + options + "</div>" +
            feedback +
          "</div>",
          actionHtml
        );
        if (!state.lastAnswerMeta) return;
        const buttons = Array.from(root.querySelectorAll(".option-btn"));
        buttons.forEach((btn) => {
          const value = Number(btn.dataset.answer);
          if (value === state.lastAnswerMeta.correctAnswer) btn.classList.add("is-correct");
          if (value === state.lastAnswerMeta.selectedAnswer && !state.lastAnswerMeta.correct) btn.classList.add("is-wrong");
        });
      }

      async function answerQuestion(answer) {
        if (state.answered || !state.session) return;
        const question = state.session.questions[state.questionIndex];
        state.answered = true;
        persistRuntime();
        const feedback = await api("/api/session/answer", {
          method: "POST",
          body: {
            sessionId: state.session.sessionId,
            questionId: question.id,
            selectedAnswer: Number(answer),
            costMs: 3200
          }
        });
        state.lastAnswerMeta = {
          selectedAnswer: Number(answer),
          correctAnswer: feedback.correctAnswer,
          correct: feedback.correct
        };
        state.lastFeedback = feedback.correct
          ? "答对了！" + feedback.rhymeText + "。连对 " + feedback.comboCount + " 题。"
          : "再记一遍：" + feedback.rhymeText + "。正确答案是 " + feedback.correctAnswer + "。";
        persistRuntime();
        renderQuestion();
      }

      async function finishSession() {
        if (!state.session) return;
        clearTimers();
        state.result = await api("/api/session/finish", {
          method: "POST",
          body: { sessionId: state.session.sessionId }
        });
        clearActiveSession();
        await loadBase();
        persistRuntime();
        renderResult();
      }

      function nextQuestion() {
        if (!state.session) return;
        state.questionIndex += 1;
        state.answered = false;
        state.lastFeedback = null;
        state.lastAnswerMeta = null;
        persistRuntime();
        renderQuestion();
      }

      function renderResult() {
        setView("result");
        setActive("home");
        const result = state.result;
        if (!result) {
          renderHome();
          return;
        }
        const weak = result.weakItems.length ? result.weakItems.join("、") : "没有新增薄弱项";
        const mastered = result.newMasteredItems?.length ? result.newMasteredItems.join("、") : "这轮先把节奏稳住了";
        renderShell(
          "训练完成",
          "正确 " + result.correctCount + " / " + result.totalQuestions + "，正确率 " + Math.round(result.accuracy * 100) + "%",
          '<div class="grid two">' +
            '<div class="reward"><h2>' + escapeHtml(result.reward.title) + '</h2><p>奖励数量：' + result.reward.count + "</p><p>本轮掌握：" + escapeHtml(mastered) + "</p></div>" +
            '<div class="card"><h2>需要关注</h2><p>' + escapeHtml(weak) + "</p></div>" +
          "</div>",
          '<button class="btn primary" type="button" data-view-target="home">回首页</button><button class="btn" type="button" data-view-target="wrongbook">看错题</button>'
        );
      }

      function renderMatch() {
        if (!state.session) {
          route("home");
          return;
        }
        syncViewFromGame();
        setActive("match");
        persistRuntime();
        const progress = state.matchState.totalPairs
          ? Math.round((state.matchState.matchedCount / state.matchState.totalPairs) * 100)
          : 0;
        const cardsHtml = state.matchState.cards.map((card) => {
          const isOpen = card.status === "opened";
          const isMatched = card.status === "matched";
          const content = card.status === "closed" ? "?" : escapeHtml(card.content);
          const className = [
            "match-card",
            isMatched ? "is-matched" : "",
            isOpen ? "is-open" : "",
            card.status === "closed" ? "is-closed" : ""
          ].filter(Boolean).join(" ");
          return '<button class="' + className + '" type="button" data-card-id="' + card.id + '"' + (state.matchState.locked ? " disabled" : "") + ">" + content + "</button>";
        }).join("");
        const reward = state.matchState.showReward
          ? '<div class="reward"><h2>配对完成</h2><p>这一轮卡片都找到了，奖励马上到账。</p></div>'
          : "";
        renderShell(
          "翻卡片配对",
          "已配对 " + state.matchState.matchedCount + " / " + state.matchState.totalPairs + " 组",
          '<div class="hero-card"><div class="pill">配对进度 ' + progress + '%</div><div class="progress"><div class="progress-bar" style="width:' + progress + '%"></div></div></div>' +
          '<div class="match-grid">' + cardsHtml + "</div>" +
          reward,
          '<button class="btn" type="button" data-view-target="home">稍后继续</button>'
        );
      }

      async function submitMatchedPair(pairId) {
        const question = state.session?.questions?.find((item) => item.id === pairId);
        if (!question) return;
        if (state.matchState.completedPairIds.includes(pairId)) return;
        await api("/api/session/answer", {
          method: "POST",
          body: {
            sessionId: state.session.sessionId,
            questionId: question.id,
            selectedAnswer: question.answer,
            costMs: 2200
          }
        });
        state.matchState.completedPairIds = [...state.matchState.completedPairIds, pairId];
        persistRuntime();
      }

      async function completeMatchIfDone() {
        if (state.matchState.matchedCount !== state.matchState.totalPairs || !state.session) {
          return;
        }
        state.matchState.showReward = true;
        persistRuntime();
        renderMatch();
        matchRewardTimer = setTimeout(() => {
          finishSession();
        }, 900);
      }

      function updateMatchCards(nextCards) {
        state.matchState.cards = nextCards;
        state.matchState.openedCardIds = nextCards.filter((card) => card.status === "opened").map((card) => card.id);
        state.matchState.matchedCount = new Set(
          nextCards.filter((card) => card.status === "matched").map((card) => card.pairId)
        ).size;
      }

      async function handleMatchCardTap(cardId) {
        if (!state.session || state.matchState.locked) return;
        const cards = state.matchState.cards.map((card) => ({ ...card }));
        const target = cards.find((card) => card.id === cardId);
        if (!target || target.status !== "closed") return;
        target.status = "opened";
        updateMatchCards(cards);
        persistRuntime();
        renderMatch();

        if (state.matchState.openedCardIds.length < 2) {
          return;
        }

        const [firstCardId, secondCardId] = state.matchState.openedCardIds;
        const firstCard = cards.find((card) => card.id === firstCardId);
        const secondCard = cards.find((card) => card.id === secondCardId);
        if (!firstCard || !secondCard) return;

        state.matchState.locked = true;
        persistRuntime();
        renderMatch();

        const matched = firstCard.pairId === secondCard.pairId;
        matchResolveTimer = setTimeout(async () => {
          const nextCards = state.matchState.cards.map((card) => ({ ...card }));
          const left = nextCards.find((card) => card.id === firstCardId);
          const right = nextCards.find((card) => card.id === secondCardId);
          if (left && right) {
            left.status = matched ? "matched" : "closed";
            right.status = matched ? "matched" : "closed";
          }
          updateMatchCards(nextCards);
          state.matchState.locked = false;
          if (matched) {
            await submitMatchedPair(firstCard.pairId);
          }
          persistRuntime();
          renderMatch();
          await completeMatchIfDone();
        }, 450);
      }

      async function renderWrongbook() {
        setView("wrongbook");
        setActive("wrongbook");
        const wrongbook = await api("/api/wrongbook");
        const groups = wrongbook.wrongGroups.length ? wrongbook.wrongGroups.map((group) =>
          '<div class="card"><h2>' + escapeHtml(group.groupTitle) + '</h2><div class="list-stack">' +
          group.items.map((item) => '<div class="list-row"><div><div class="row-title">' + escapeHtml(item.formula) + " = " + item.answer + "</div><p>错 " + item.wrongCount + " 次 · 连错 " + item.continuousWrongCount + " 次</p></div></div>").join("") +
          "</div></div>"
        ).join("") : '<div class="empty">暂时没有错题。</div>';
        persistRuntime();
        renderShell(
          "错题本",
          "优先处理最近连续出错的题。",
          '<div class="grid two">' + groups + "</div>",
          '<button class="btn primary" type="button" data-start-rescue>开始错题救援</button>'
        );
      }

      async function startRescue() {
        clearTimers();
        const rescue = await api("/api/wrongbook/review-start", {
          method: "POST",
          body: { mode: "priority", limit: 3 }
        });
        state.gameType = "rescue";
        state.result = null;
        state.session = {
          sessionId: rescue.sessionId,
          gameType: "rescue",
          questions: rescue.wrongItems
        };
        state.questionIndex = 0;
        state.answered = false;
        state.lastFeedback = null;
        state.lastAnswerMeta = null;
        syncViewFromGame();
        persistRuntime();
        renderQuestion();
      }

      async function renderParent() {
        setView("parent");
        setActive("parent");
        const dashboard = await api("/api/parent/dashboard");
        persistRuntime();
        const wrong = dashboard.topWrongItems.length
          ? dashboard.topWrongItems.map((item) => '<div class="list-row"><div class="row-title">' + escapeHtml(item.formula) + '</div><span class="pill">错 ' + item.wrongCount + " 次</span></div>").join("")
          : '<div class="empty">暂时没有明显高频错题。</div>';
        renderShell(
          "家长看板",
          "只看时长、掌握层次和高频错题。",
          '<div class="grid four">' +
            '<div class="card"><h3>今日分钟</h3><h2>' + dashboard.todayMinutes + "</h2></div>" +
            '<div class="card"><h3>累计分钟</h3><h2>' + dashboard.totalMinutes + "</h2></div>" +
            '<div class="card"><h3>连续天数</h3><h2>' + dashboard.continuousDays + "</h2></div>" +
            '<div class="card"><h3>薄弱组</h3><h2>' + dashboard.weakTables.length + "</h2></div>" +
          "</div>" +
          '<div class="grid two" style="margin-top:14px">' +
            '<div class="card"><h2>掌握情况</h2><p>已掌握：' + dashboard.masteredTables.join("、") + "</p><p>学习中：" + dashboard.learningTables.join("、") + "</p><p>薄弱项：" + dashboard.weakTables.join("、") + "</p></div>" +
            '<div class="card"><h2>高频错题</h2><div class="list-stack">' + wrong + "</div></div>" +
          '</div><div class="card" style="margin-top:14px"><h2>明日建议</h2><p>' + escapeHtml(dashboard.tomorrowSuggestion) + "</p></div>"
        );
      }

      async function restoreRuntimeView() {
        if (state.view === "result" && state.result) {
          renderResult();
          return;
        }
        if (state.view === "learn") {
          await renderLearn();
          return;
        }
        if (state.view === "parent") {
          await renderParent();
          return;
        }
        if (state.view === "wrongbook") {
          if (state.session && state.gameType === "rescue") {
            renderQuestion();
            return;
          }
          await renderWrongbook();
          return;
        }
        if (state.view === "match") {
          if (state.session && state.gameType === "match") {
            state.matchState = normalizeMatchState(state.matchState.cards?.length ? state.matchState.cards : state.session.cards || []);
            persistRuntime();
            renderMatch();
            return;
          }
          renderHome();
          return;
        }
        if (state.view === "quiz" || state.view === "level") {
          if (state.session) {
            renderQuestion();
            return;
          }
          renderHome();
          return;
        }
        if (!state.session || state.view === "home") {
          renderHome();
          return;
        }
        renderHome();
      }

      async function route(view) {
        try {
          if (view === "home") {
            await loadBase();
            renderHome();
          } else if (view === "learn") {
            await renderLearn();
          } else if (view === "quiz") {
            await startSession("quiz");
          } else if (view === "match") {
            await startSession("match");
          } else if (view === "level") {
            await startSession("level");
          } else if (view === "wrongbook") {
            await renderWrongbook();
          } else if (view === "parent") {
            await renderParent();
          } else if (view === "result") {
            renderResult();
          }
        } catch (error) {
          root.innerHTML = '<div class="empty">加载失败：' + escapeHtml(error.message) + "</div>";
        }
      }

      function routeTask(task) {
        if (task === "learn" || task === "review") {
          route("learn");
          return;
        }
        if (task === "match") {
          startSession("match");
          return;
        }
        if (task === "level") {
          startSession("level");
          return;
        }
        if (task === "wrongReview") {
          renderWrongbook();
          return;
        }
        startSession("quiz");
      }

      function resumeSession() {
        if (!state.session) {
          route("home");
          return;
        }
        if (state.gameType === "match") {
          renderMatch();
          return;
        }
        renderQuestion();
      }

      document.addEventListener("click", (event) => {
        const target = event.target.closest("button");
        if (!target) return;
        if (target.dataset.view) route(target.dataset.view);
        if (target.dataset.viewTarget) route(target.dataset.viewTarget);
        if (target.dataset.start) {
          const type = target.dataset.start;
          if (type === "learn") route("learn");
          else if (type === "quiz") startSession("quiz");
          else if (type === "match") startSession("match");
          else if (type === "level") startSession("level");
        }
        if (target.dataset.task) routeTask(target.dataset.task);
        if (target.dataset.answer) answerQuestion(target.dataset.answer);
        if (target.dataset.cardId) handleMatchCardTap(target.dataset.cardId);
        if (target.hasAttribute("data-next-question")) nextQuestion();
        if (target.hasAttribute("data-start-rescue")) startRescue();
        if (target.hasAttribute("data-resume-session")) resumeSession();
      });

      async function boot() {
        try {
          await ensureLogin();
          await loadBase();
          await restoreRuntimeView();
        } catch (error) {
          root.innerHTML = '<div class="empty">应用启动失败：' + escapeHtml(error.message) + "</div>";
        }
      }

      boot();
    })();
  </script>
</body>
</html>`;
}
