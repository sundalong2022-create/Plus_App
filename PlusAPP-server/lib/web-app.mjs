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
      transition: transform .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease;
    }
    .option-btn:hover,
    .option-btn:focus-visible {
      transform: translateY(-1px);
      border-color: #bfd0eb;
      box-shadow: 0 8px 18px rgba(18, 34, 56, 0.08);
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
    .feedback.is-correct {
      border-color: #bdebcf;
      background: #eafbf2;
      color: #157048;
    }
    .feedback.is-wrong {
      border-color: #ffd1c4;
      background: #fff2ed;
      color: #ac4b2f;
    }
    .hero-top {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }
    .hero-title {
      display: block;
      margin: 0 0 6px;
      font-size: 30px;
      line-height: 1.2;
      font-weight: 850;
      color: var(--text);
    }
    .hero-subtitle {
      display: block;
      color: var(--muted);
      margin-bottom: 12px;
    }
    .hero-progress-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .hero-progress-label,
    .hero-note {
      font-size: 14px;
      color: #425975;
      font-weight: 650;
    }
    .track-grid {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }
    .track-cell {
      min-height: 64px;
      border-radius: 16px;
      border: 1px solid var(--line);
      background: #fff;
      display: grid;
      place-items: center;
      text-align: center;
      color: #62748f;
      font-size: 13px;
      font-weight: 700;
    }
    .track-cell.is-active {
      background: var(--mint);
      border-color: #bdebcf;
      color: #157048;
    }
    .track-cell.is-current {
      background: var(--sky);
      border-color: #bfd4ff;
      color: #215ac5;
      box-shadow: 0 10px 20px rgba(34, 81, 204, 0.12);
    }
    .question-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .answer-badge-row {
      min-height: 36px;
      margin-bottom: 6px;
    }
    .answer-badge {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 800;
      animation: badge-pop .26s ease;
    }
    .answer-badge.is-correct {
      background: #eafbf2;
      color: #157048;
      border: 1px solid #bdebcf;
    }
    .answer-badge.is-wrong {
      background: #fff2ed;
      color: #ac4b2f;
      border: 1px solid #ffd1c4;
    }
    .meta-actions {
      display: inline-flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn.ghost {
      background: #fff;
      color: #3f5678;
    }
    .result-burst {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      background: rgba(19, 34, 56, 0.12);
    }
    .result-burst-shell {
      position: relative;
      width: min(360px, calc(100vw - 36px));
      aspect-ratio: 1 / 1;
    }
    .result-burst-orbit {
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      opacity: 0;
      animation: reward-orbit 1.15s ease-out infinite;
    }
    .result-burst-orbit.tone-warm {
      background: linear-gradient(180deg, #ffc669 0%, #ff8a00 100%);
    }
    .result-burst-orbit.tone-mint {
      background: linear-gradient(180deg, #72e3bf 0%, #0d8e69 100%);
    }
    .result-burst-orbit.tone-coral {
      background: linear-gradient(180deg, #ffb29c 0%, #df6b4f 100%);
    }
    .result-burst-orbit.tone-sky {
      background: linear-gradient(180deg, #9fd0ff 0%, #3977d6 100%);
    }
    .result-burst-orbit.o1 { top: 18px; left: calc(50% - 9px); animation-delay: 0ms; }
    .result-burst-orbit.o2 { top: 72px; right: 18px; animation-delay: 120ms; }
    .result-burst-orbit.o3 { right: 34px; bottom: 84px; animation-delay: 240ms; }
    .result-burst-orbit.o4 { bottom: 18px; left: calc(50% - 9px); animation-delay: 360ms; }
    .result-burst-orbit.o5 { bottom: 92px; left: 26px; animation-delay: 480ms; }
    .result-burst-orbit.o6 { top: 80px; left: 20px; animation-delay: 600ms; }
    .result-burst-card {
      position: absolute;
      inset: 66px;
      border-radius: 26px;
      background: rgba(255,255,255,0.96);
      box-shadow: 0 24px 52px rgba(18, 34, 56, 0.18);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 22px 18px;
      animation: reward-card-pop .52s cubic-bezier(.2,.8,.2,1);
    }
    .result-burst-badge {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0 14px;
      border-radius: 999px;
      background: #ffeed3;
      color: #9c5a00;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .result-burst-title {
      font-size: 28px;
      line-height: 1.15;
      font-weight: 850;
      color: var(--text);
    }
    .result-burst-subtitle {
      margin-top: 10px;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
    }
    .sr-only-audio {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }
    @keyframes badge-pop {
      0% {
        opacity: 0;
        transform: scale(.82) translateY(8px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @keyframes reward-card-pop {
      0% {
        opacity: 0;
        transform: scale(.76) translateY(16px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @keyframes reward-orbit {
      0% {
        opacity: 0;
        transform: scale(.65) translateY(14px);
      }
      30% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: scale(1.18) translateY(-22px);
      }
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
      .hero-title {
        font-size: 24px;
      }
      .option-grid,
      .calendar-row {
        grid-template-columns: 1fr;
      }
      .match-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .result-burst-card {
        inset: 58px 42px;
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
        matchState: runtime?.matchState || defaultMatchState(),
        scoreState: runtime?.scoreState || {
          correctCount: 0,
          comboCount: 0,
          rescuedCount: 0,
          levelStep: 0
        },
        rewardBurst: runtime?.rewardBurst || null,
        resultCelebrated: runtime?.resultCelebrated || false
      };

      let matchResolveTimer = 0;
      let rewardBurstTimer = 0;
      let sessionFinishTimer = 0;

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
            matchState: state.matchState,
            scoreState: state.scoreState,
            rewardBurst: state.rewardBurst,
            resultCelebrated: state.resultCelebrated
          })
        );
      }

      function clearRewardBurstTimer() {
        if (rewardBurstTimer) {
          clearTimeout(rewardBurstTimer);
          rewardBurstTimer = 0;
        }
      }

      function clearTimers() {
        if (matchResolveTimer) {
          clearTimeout(matchResolveTimer);
          matchResolveTimer = 0;
        }
        clearRewardBurstTimer();
        if (sessionFinishTimer) {
          clearTimeout(sessionFinishTimer);
          sessionFinishTimer = 0;
        }
      }

      function dismissRewardBurst() {
        clearRewardBurstTimer();
        if (!state.rewardBurst) return;
        state.rewardBurst = null;
        persistRuntime();
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
        state.scoreState = {
          correctCount: 0,
          comboCount: 0,
          rescuedCount: 0,
          levelStep: 0
        };
        state.rewardBurst = null;
        state.resultCelebrated = false;
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
        const total = state.session.questions?.length || 0;
        const currentQuestion = state.session.questions?.[Math.min(state.questionIndex, Math.max(total - 1, 0))];
        const progressHint = state.answered ? "本题已作答，返回后会停在这一题" : "当前题会原样保留";
        if (state.gameType === "match") {
          return {
            label,
            detail: "已配对 " + state.matchState.matchedCount + " / " + state.matchState.totalPairs + " 组",
            hint: progressHint,
            ctaText: "继续配对"
          };
        }
        if (state.gameType === "rescue") {
          return {
            label,
            detail: "已救回 " + state.scoreState.rescuedCount + " / " + total + " 题",
            hint: (currentQuestion?.formula ? "当前题：" + currentQuestion.formula + " · " : "") + progressHint,
            ctaText: state.answered ? "回到当前题" : "继续救援"
          };
        }
        if (state.gameType === "level") {
          return {
            label,
            detail: "进行到第 " + Math.min(state.questionIndex + 1, total || 1) + " 题 · 已前进 " + state.scoreState.levelStep + " 格",
            hint: (currentQuestion?.formula ? "当前题：" + currentQuestion.formula + " · " : "") + progressHint,
            ctaText: state.answered ? "回到当前题" : "继续闯关"
          };
        }
        return {
          label,
          detail: "进行到第 " + Math.min(state.questionIndex + 1, total || 1) + " / " + total + " 题 · 连对 " + state.scoreState.comboCount + " 题",
          hint: (currentQuestion?.formula ? "当前题：" + currentQuestion.formula + " · " : "") + progressHint,
          ctaText: state.answered ? "回到当前题" : "继续答题"
        };
      }

      function getQuestionCount() {
        return state.session?.questions?.length || 0;
      }

      function getQuestionProgressPercent() {
        const total = getQuestionCount() || 1;
        return Math.round(((state.questionIndex + 1) / total) * 100);
      }

      function ensureAudioElement() {
        let audio = document.getElementById("ttsPlayer");
        if (audio) return audio;
        audio = document.createElement("audio");
        audio.id = "ttsPlayer";
        audio.className = "sr-only-audio";
        audio.preload = "auto";
        document.body.appendChild(audio);
        return audio;
      }

      function stopAudio() {
        const audio = document.getElementById("ttsPlayer");
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }

      function getSpeechRate(kind) {
        if (kind === "question") return 0.86;
        if (kind === "reward") return 0.94;
        return 0.92;
      }

      function getSpeechVoice() {
        if (!("speechSynthesis" in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        return (
          voices.find((voice) => voice.lang === "zh-CN") ||
          voices.find((voice) => voice.lang && voice.lang.startsWith("zh")) ||
          null
        );
      }

      function speakText(text, kind) {
        const message = String(text || "").trim();
        if (!message) return;
        if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
          return;
        }
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(message);
          const voice = getSpeechVoice();
          utterance.lang = voice?.lang || "zh-CN";
          if (voice) utterance.voice = voice;
          utterance.rate = getSpeechRate(kind);
          utterance.pitch = kind === "reward" ? 1.04 : 1;
          utterance.volume = 1;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Ignore browser speech failures.
        }
      }

      function buildQuestionPromptText(question) {
        if (!question?.formula) return "";
        return question.formula.replaceAll("×", "乘") + "，等于几？";
      }

      function getRewardSpeechText(kind) {
        return kind === "match"
          ? "配对完成，做得真棒。"
          : "太棒了，完成啦。今天又进步了一点。";
      }

      async function playAudio(path, fallbackText, kind) {
        try {
          const audio = ensureAudioElement();
          let fallbackPlayed = false;
          const playFallback = () => {
            if (fallbackPlayed) return;
            fallbackPlayed = true;
            if (fallbackText) {
              speakText(fallbackText, kind);
            }
          };
          audio.onerror = playFallback;
          if (audio.getAttribute("src") !== path) {
            audio.setAttribute("src", path);
          }
          audio.currentTime = 0;
          await audio.play().catch(playFallback);
        } catch {
          if (fallbackText) {
            speakText(fallbackText, kind);
          }
        }
      }

      async function playQuestionAudio() {
        const question = state.session?.questions?.[state.questionIndex];
        const questionId = question?.id;
        if (!questionId) return;
        await playAudio(
          "/api/tts/question?questionId=" + encodeURIComponent(questionId),
          buildQuestionPromptText(question),
          "question"
        );
      }

      async function playFeedbackAudio() {
        if (!state.lastFeedback) return;
        speakText(state.lastFeedback, "feedback");
      }

      async function playRewardAudio(kind) {
        const key = kind === "match" ? "rewardMatch" : "rewardComplete";
        await playAudio(
          "/api/tts/system?key=" + encodeURIComponent(key),
          getRewardSpeechText(kind),
          "reward"
        );
      }

      function buildRewardBurstHtml() {
        if (!state.rewardBurst) return "";
        const tone = state.rewardBurst.tone || "warm";
        return (
          '<div class="result-burst">' +
            '<div class="result-burst-shell">' +
              '<div class="result-burst-orbit o1 tone-' + tone + '"></div>' +
              '<div class="result-burst-orbit o2 tone-' + tone + '"></div>' +
              '<div class="result-burst-orbit o3 tone-' + tone + '"></div>' +
              '<div class="result-burst-orbit o4 tone-' + tone + '"></div>' +
              '<div class="result-burst-orbit o5 tone-' + tone + '"></div>' +
              '<div class="result-burst-orbit o6 tone-' + tone + '"></div>' +
              '<div class="result-burst-card">' +
                '<div class="result-burst-badge">' + escapeHtml(state.rewardBurst.badge) + '</div>' +
                '<div class="result-burst-title">' + escapeHtml(state.rewardBurst.title) + '</div>' +
                (state.rewardBurst.subtitle ? '<div class="result-burst-subtitle">' + escapeHtml(state.rewardBurst.subtitle) + '</div>' : "") +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }

      function showRewardBurst(payload, options) {
        clearRewardBurstTimer();
        state.rewardBurst = payload;
        persistRuntime();
        if (options?.rerender !== false) {
          options?.render?.();
        }
        rewardBurstTimer = setTimeout(() => {
          state.rewardBurst = null;
          persistRuntime();
          if (options?.render) {
            options.render();
          }
        }, options?.durationMs || 1800);
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
            '</p>' +
            (resumeMeta.hint ? '<p style="margin-top:6px">' + escapeHtml(resumeMeta.hint) + '</p>' : "") +
            '<div style="margin-top:14px"><button class="btn primary" type="button" data-resume-session>' +
            escapeHtml(resumeMeta.ctaText || "继续训练") +
            "</button></div></div>"
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
        state.scoreState = {
          correctCount: 0,
          comboCount: 0,
          rescuedCount: 0,
          levelStep: 0
        };
        state.rewardBurst = null;
        state.resultCelebrated = false;
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
        const progressPercent = getQuestionProgressPercent();
        const heroBadge = state.gameType === "rescue"
          ? '<div class="pill">已救回 ' + state.scoreState.rescuedCount + " / " + questions.length + " 题</div>"
          : state.gameType === "level"
            ? '<div class="pill">已前进 ' + state.scoreState.levelStep + " 格</div>"
            : '<div class="pill">连对 ' + state.scoreState.comboCount + " 题</div>";
        const sourceText = state.gameType === "rescue"
          ? "优先错题"
          : state.gameType === "level"
            ? "当前关卡"
            : escapeHtml(question.sourceTag);
        const options = question.options.map((option) =>
          '<button class="option-btn" type="button" data-answer="' + option + '">' + option + "</button>"
        ).join("");
        const feedback = state.lastFeedback
          ? '<div class="feedback ' + (state.lastAnswerMeta?.correct ? "is-correct" : "is-wrong") + '">' + escapeHtml(state.lastFeedback) + "</div>"
          : '<div class="feedback">选一个答案，答完会看到口诀提示。</div>';
        const answerBadge = state.lastAnswerMeta
          ? '<div class="answer-badge-row"><div class="answer-badge ' + (state.lastAnswerMeta.correct ? "is-correct" : "is-wrong") + '">' +
            (state.gameType === "level"
              ? (state.lastAnswerMeta.correct ? "前进一步" : "先停一下")
              : state.gameType === "rescue"
                ? (state.lastAnswerMeta.correct ? "救回一题" : "再看一眼")
                : (state.lastAnswerMeta.correct ? "答对啦" : "再想想")) +
            "</div></div>"
          : '<div class="answer-badge-row"></div>';
        const trackHtml = state.gameType === "level"
          ? '<div class="card"><h2>关卡路线</h2><p>答对一题就向前走一步。</p><div class="track-grid" style="grid-template-columns: repeat(' + Math.max(questions.length, 1) + ', minmax(0, 1fr));">' +
            questions.map((item, index) => {
              const classes = [
                "track-cell",
                index < state.scoreState.levelStep ? "is-active" : "",
                index === state.scoreState.levelStep && state.scoreState.levelStep < questions.length ? "is-current" : ""
              ].filter(Boolean).join(" ");
              return '<div class="' + classes + '">' + (index === questions.length - 1 ? "终点" : String(index + 1)) + "</div>";
            }).join("") +
            "</div></div>"
          : "";
        const replayFeedbackButton = state.lastAnswerMeta
          ? '<button class="btn small ghost" type="button" data-listen-feedback>听反馈</button>'
          : "";
        const actionHtml = state.answered
          ? '<button class="btn primary" type="button" data-next-question>下一题</button><button class="btn" type="button" data-view-target="home">回首页保存进度</button>'
          : '<button class="btn" type="button" data-view-target="home">稍后继续</button>';
        renderShell(
          meta.title,
          "第 " + (state.questionIndex + 1) + " / " + questions.length + " 题",
          buildRewardBurstHtml() +
          '<div class="hero-card">' +
            '<div class="hero-top"><div class="pill">' + meta.title + "</div>" + heroBadge + "</div>" +
            '<span class="hero-title">' + (state.gameType === "rescue" ? "把最近没记牢的题补回来" : state.gameType === "level" ? "答对前进，到终点就过关" : "每次只做一小题，越往后越顺手") + "</span>" +
            '<span class="hero-subtitle">' + (state.gameType === "rescue" ? "错题不用一次全做完，优先救回最近几题就够了。" : state.gameType === "level" ? "走到最后一格，就表示今天这轮主练习完成了。" : "不会也没关系，先猜一猜，再记口诀。") + "</span>" +
            '<div class="hero-progress-row"><span class="hero-progress-label">本轮进度 ' + progressPercent + '%</span><span class="hero-note">' +
              (state.gameType === "rescue"
                ? "已救回 " + state.scoreState.rescuedCount + " / " + questions.length + " 题"
                : state.gameType === "level"
                  ? "已前进 " + state.scoreState.levelStep + " 步"
                  : "答对 " + state.scoreState.correctCount + " / " + questions.length + " 题") +
              "</span></div>" +
            '<div class="progress"><div class="progress-bar" style="width:' + progressPercent + '%"></div></div>' +
          "</div>" +
          trackHtml +
          '<div class="question-card">' +
            '<div class="question-meta"><div class="pill">' + sourceText + '</div><div class="meta-actions"><button class="btn small ghost" type="button" data-listen-question>听题</button>' + replayFeedbackButton + '</div></div>' +
            answerBadge +
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
        if (state.gameType === "rescue") {
          state.scoreState.rescuedCount += feedback.correct ? 1 : 0;
          state.scoreState.comboCount = feedback.comboCount;
        } else if (state.gameType === "level") {
          state.scoreState.levelStep = Math.min(getQuestionCount(), state.scoreState.levelStep + (feedback.correct ? 1 : 0));
          state.scoreState.correctCount += feedback.correct ? 1 : 0;
          state.scoreState.comboCount = feedback.comboCount;
        } else {
          state.scoreState.correctCount += feedback.correct ? 1 : 0;
          state.scoreState.comboCount = feedback.comboCount;
        }
        state.lastFeedback = feedback.correct
          ? "答对了！" + feedback.rhymeText + "。连对 " + feedback.comboCount + " 题。"
          : "再记一遍：" + feedback.rhymeText + "。正确答案是 " + feedback.correctAnswer + "。";
        persistRuntime();
        renderQuestion();
        void playFeedbackAudio();
      }

      async function finishSession() {
        if (!state.session) return;
        clearTimers();
        stopAudio();
        state.rewardBurst = null;
        state.resultCelebrated = false;
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
        stopAudio();
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
        if (!state.resultCelebrated) {
          state.resultCelebrated = true;
          persistRuntime();
          showRewardBurst(
            {
              badge: result.reward.title,
              title: result.reward.type === "star" ? "这一轮很稳" : "又完成一轮训练",
              subtitle: result.nextAction === "wrongReview" ? "等会儿去把错题也补一下" : "今天又进步了一点",
              tone: result.reward.type === "star" ? "warm" : "mint"
            },
            { durationMs: 1800, render: renderResult, rerender: false }
          );
          void playRewardAudio("complete");
        }
        renderShell(
          "训练完成",
          "正确 " + result.correctCount + " / " + result.totalQuestions + "，正确率 " + Math.round(result.accuracy * 100) + "%",
          buildRewardBurstHtml() +
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
          buildRewardBurstHtml() +
          '<div class="hero-card"><div class="hero-top"><div class="pill">翻卡片配对</div><div class="pill">已配对 ' + state.matchState.matchedCount + " / " + state.matchState.totalPairs + ' 组</div></div><span class="hero-title">把算式和答案找到同一对</span><span class="hero-subtitle">先翻两张，配对成功就能留下来。</span><div class="hero-progress-row"><span class="hero-progress-label">配对进度 ' + progress + '%</span><span class="hero-note">还差 ' + Math.max(state.matchState.totalPairs - state.matchState.matchedCount, 0) + ' 组</span></div><div class="progress"><div class="progress-bar" style="width:' + progress + '%"></div></div></div>' +
          '<div class="match-grid">' + cardsHtml + "</div>" +
          reward,
          '<button class="btn" type="button" data-view-target="home">稍后继续</button><button class="btn ghost" type="button" data-play-match-audio>播放奖励音</button>'
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
        showRewardBurst(
          {
            badge: "配对完成",
            title: "这一轮全都找到了",
            subtitle: "奖励马上到账",
            tone: "sky"
          },
          { durationMs: 1500, render: renderMatch }
        );
        await playRewardAudio("match");
        sessionFinishTimer = setTimeout(() => {
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
        state.scoreState = {
          correctCount: 0,
          comboCount: 0,
          rescuedCount: 0,
          levelStep: 0
        };
        state.rewardBurst = null;
        state.resultCelebrated = false;
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
          if (state.rewardBurst) {
            state.resultCelebrated = true;
            showRewardBurst(state.rewardBurst, { render: renderResult, rerender: false });
          }
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
            if (state.rewardBurst) {
              showRewardBurst(state.rewardBurst, { render: renderMatch });
            }
            renderMatch();
            return;
          }
          renderHome();
          return;
        }
        if (state.view === "quiz" || state.view === "level") {
          if (state.session) {
            if (state.rewardBurst) {
              showRewardBurst(state.rewardBurst, { render: renderQuestion });
            }
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
          stopAudio();
          if (view !== "result" && state.rewardBurst) {
            dismissRewardBurst();
          }
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
        const clickTarget = event.target instanceof Element ? event.target : event.target?.parentElement || null;
        const target = clickTarget ? clickTarget.closest("button") : null;
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
        if (target.hasAttribute("data-listen-question")) playQuestionAudio();
        if (target.hasAttribute("data-listen-feedback")) playFeedbackAudio();
        if (target.hasAttribute("data-play-match-audio")) playRewardAudio("match");
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
