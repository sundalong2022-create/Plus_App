import type { Question } from "../../types/api";
import { audioService } from "../../utils/audio";
import { api } from "../../utils/request";

const emptyQuestion: Question = {
  id: "",
  table: 0,
  multiplier: 0,
  formula: "",
  answer: 0,
  options: [],
  rhymeText: "",
  difficulty: 1,
  sourceTag: "wrong",
  tags: []
};

Page({
  data: {
    loading: true,
    sessionId: "",
    wrongItems: [] as Question[],
    currentIndex: 0,
    currentQuestion: emptyQuestion,
    rescuedCount: 0,
    feedbackText: "",
    explainText: "",
    progressPercent: 0,
    showAnswerBadge: false,
    answerBadgeText: "",
    answerBadgeType: "correct",
    locked: false
  },

  onLoad(query: { mode?: "priority" | "all" }) {
    const mode = query.mode || "priority";
    void this.loadWrongReview(mode);
  },

  onUnload() {
    audioService.stop();
  },

  onHide() {
    audioService.stop();
  },

  async loadWrongReview(mode: "priority" | "all") {
    await api.progress.markTask("wrongReview", "doing");
    const session = await api.wrongbook.reviewStart(mode, 3);
    const wrongItems = session.wrongItems;

    this.setData({
      loading: false,
      sessionId: session.sessionId,
      wrongItems,
      currentQuestion: wrongItems[0] || emptyQuestion,
      progressPercent: wrongItems.length ? Math.round((1 / wrongItems.length) * 100) : 0
    });
  },

  async handleSelect(event: { currentTarget: { dataset: { value: string } } }) {
    if (this.data.locked) {
      return;
    }

    this.setData({ locked: true });

    const selectedAnswer = Number(event.currentTarget.dataset.value);
    const feedback = await api.session.answer({
      sessionId: this.data.sessionId,
      questionId: this.data.currentQuestion.id,
      selectedAnswer,
      costMs: 1700
    });

    const rescuedCount = this.data.rescuedCount + (feedback.correct ? 1 : 0);

    this.setData({
      rescuedCount,
      showAnswerBadge: true,
      answerBadgeText: feedback.correct ? "救回一题" : "再看一眼",
      answerBadgeType: feedback.correct ? "correct" : "wrong",
      feedbackText: feedback.correct
        ? `救回一颗星，${feedback.rhymeText}`
        : `再想一想，正确答案是 ${feedback.correctAnswer}`,
      explainText: feedback.needExplain
        ? `${this.data.currentQuestion.formula} 就是重复加法，${feedback.rhymeText}`
        : ""
    });
    wx.vibrateShort({ type: feedback.correct ? "light" : "medium" });

    setTimeout(async () => {
      const nextIndex = this.data.currentIndex + 1;

      if (nextIndex >= this.data.wrongItems.length) {
        await api.session.finish(this.data.sessionId);
        wx.navigateTo({ url: "/pages/result/index" });
        return;
      }

      this.setData({
        currentIndex: nextIndex,
        currentQuestion: this.data.wrongItems[nextIndex],
        showAnswerBadge: false,
        answerBadgeText: "",
        feedbackText: "",
        explainText: "",
        progressPercent: Math.round(((nextIndex + 1) / this.data.wrongItems.length) * 100),
        locked: false
      });
    }, 600);
  },

  handleListen() {
    audioService.playQuestionPrompt(this.data.currentQuestion.id);
  }
});
