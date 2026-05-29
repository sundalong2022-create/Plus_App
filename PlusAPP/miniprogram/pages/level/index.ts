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
  sourceTag: "new",
  tags: []
};

const buildTrackCells = (trackLength: number, currentStep: number) =>
  Array.from({ length: trackLength }, (_, index) => ({
    label: index === trackLength - 1 ? "终点" : `${index + 1}`,
    active: index < currentStep,
    current: index === currentStep && currentStep < trackLength
  }));

Page({
  data: {
    loading: true,
    day: 1,
    sessionId: "",
    trackLength: 5,
    currentStep: 0,
    trackCells: [],
    trackTemplateStyle: "",
    questions: [] as Question[],
    currentIndex: 0,
    currentQuestion: emptyQuestion,
    feedbackText: "",
    progressPercent: 0,
    showAnswerBadge: false,
    answerBadgeText: "",
    answerBadgeType: "correct",
    locked: false
  },

  onLoad(query: { day?: string }) {
    const day = Number(query.day || 1);
    void this.loadLevel(day);
  },

  onUnload() {
    audioService.stop();
  },

  onHide() {
    audioService.stop();
  },

  async loadLevel(day: number) {
    await api.progress.markTask("level", "doing");
    const session = await api.session.start({
      gameType: "level",
      day,
      source: "daily"
    });

    this.setData({
      loading: false,
      day,
      sessionId: session.sessionId,
      questions: session.questions,
      trackLength: session.questions.length
    });
    this.syncLevelState(0, 0);
  },

  syncLevelState(index: number, currentStep: number) {
    const trackLength = this.data.trackLength || 1;

    this.setData({
      currentIndex: index,
      currentStep,
      currentQuestion: this.data.questions[index] || emptyQuestion,
      trackCells: buildTrackCells(trackLength, currentStep),
      trackTemplateStyle: `grid-template-columns: repeat(${trackLength}, minmax(0, 1fr));`,
      progressPercent: Math.round(((index + 1) / trackLength) * 100)
    });
  },

  async handleSelect(event: { currentTarget: { dataset: { value: string } } }) {
    if (this.data.locked) {
      return;
    }

    this.setData({ locked: true });

    const selectedAnswer = Number(event.currentTarget.dataset.value);
    const currentQuestion = this.data.currentQuestion;
    const feedback = await api.session.answer({
      sessionId: this.data.sessionId,
      questionId: currentQuestion.id,
      selectedAnswer,
      costMs: 1800
    });

    const stepOffset = feedback.correct ? 1 : 0;
    const nextStep = Math.min(this.data.trackLength, this.data.currentStep + stepOffset);

    this.setData({
      currentStep: nextStep,
      showAnswerBadge: true,
      answerBadgeText: feedback.correct ? "前进一格" : "先停一下",
      answerBadgeType: feedback.correct ? "correct" : "wrong",
      feedbackText: feedback.correct
        ? `前进一步，${feedback.rhymeText}`
        : `停一下，正确答案是 ${feedback.correctAnswer}`
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
        showAnswerBadge: false,
        answerBadgeText: "",
        feedbackText: "",
        locked: false
      });
      this.syncLevelState(nextIndex, nextStep);
    }, 500);
  },

  handleListen() {
    audioService.playQuestionPrompt(this.data.currentQuestion.id);
  }
});
