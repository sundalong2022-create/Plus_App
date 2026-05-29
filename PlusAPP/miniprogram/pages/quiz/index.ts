import type { Question } from "../../types/api";
import { audioService } from "../../utils/audio";
import { api } from "../../utils/request";

const sourceMetaMap: Record<string, { text: string; tone: string }> = {
  new: { text: "今日新题", tone: "warm" },
  review: { text: "复习题", tone: "sky" },
  wrong: { text: "错题回顾", tone: "coral" }
};

const initialQuestion: Question = {
  id: "",
  table: 0,
  multiplier: 0,
  formula: "",
  answer: 0,
  options: [],
  rhymeText: "",
  difficulty: 1,
  sourceTag: "new",
  tags: []
};

Page({
  data: {
    loading: true,
    day: 1,
    sessionId: "",
    questions: [] as Question[],
    currentIndex: 0,
    currentQuestion: initialQuestion,
    correctCount: 0,
    comboCount: 0,
    selectedAnswer: null as number | null,
    feedbackText: "",
    feedbackType: "",
    feedbackTone: "neutral",
    progressPercent: 0,
    sourceText: "",
    sourceTone: "warm",
    showAnswerBadge: false,
    answerBadgeText: "",
    answerBadgeType: "correct",
    locked: false
  },

  onLoad(query: { day?: string }) {
    const day = Number(query.day || 1);
    void this.loadSession(day);
  },

  onUnload() {
    audioService.stop();
  },

  onHide() {
    audioService.stop();
  },

  async loadSession(day: number) {
    await api.progress.markTask("quiz", "doing");
    const session = await api.session.start({
      gameType: "quiz",
      day,
      source: "daily"
    });

    this.setData({
      loading: false,
      day,
      sessionId: session.sessionId,
      questions: session.questions
    });
    this.syncQuestion(0);
  },

  syncQuestion(index: number) {
    const currentQuestion = this.data.questions[index] || initialQuestion;
    const sourceMeta = sourceMetaMap[currentQuestion.sourceTag] || sourceMetaMap.new;
    const total = this.data.questions.length || 1;

    this.setData({
      currentIndex: index,
      currentQuestion,
      progressPercent: Math.round(((index + 1) / total) * 100),
      sourceText: sourceMeta.text,
      sourceTone: sourceMeta.tone
    });
  },

  async handleSelect(event: { currentTarget: { dataset: { value: string } } }) {
    if (this.data.locked) {
      return;
    }

    const selectedAnswer = Number(event.currentTarget.dataset.value);
    const currentQuestion = this.data.currentQuestion;

    this.setData({
      locked: true,
      selectedAnswer
    });

    const feedback = await api.session.answer({
      sessionId: this.data.sessionId,
      questionId: currentQuestion.id,
      selectedAnswer,
      costMs: 1600
    });

    const nextCorrectCount = this.data.correctCount + (feedback.correct ? 1 : 0);

    this.setData({
      correctCount: nextCorrectCount,
      comboCount: feedback.comboCount,
      showAnswerBadge: true,
      answerBadgeText: feedback.correct ? "答对啦" : "再想想",
      answerBadgeType: feedback.correct ? "correct" : "wrong",
      feedbackText: feedback.correct
        ? `答对了，${feedback.rhymeText}`
        : `正确答案是 ${feedback.correctAnswer}，${feedback.rhymeText}`,
      feedbackType: feedback.correct ? "correct" : "wrong",
      feedbackTone: feedback.correct ? "mint" : "coral"
    });
    wx.vibrateShort({ type: feedback.correct ? "light" : "medium" });

    setTimeout(async () => {
      const nextIndex = this.data.currentIndex + 1;

      if (nextIndex >= this.data.questions.length) {
        await api.session.finish(this.data.sessionId);
        wx.navigateTo({ url: "/pages/result/index" });
        return;
      }

      this.setData({
        selectedAnswer: null,
        showAnswerBadge: false,
        answerBadgeText: "",
        feedbackText: "",
        feedbackType: "",
        feedbackTone: "neutral",
        locked: false
      });
      this.syncQuestion(nextIndex);
    }, 500);
  },

  handleListen() {
    audioService.playQuestionPrompt(this.data.currentQuestion.id);
  }
});
