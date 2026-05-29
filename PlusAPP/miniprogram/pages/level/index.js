"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audio_1 = require("../../utils/audio");
const request_1 = require("../../utils/request");
const emptyQuestion = {
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
const buildTrackCells = (trackLength, currentStep) => Array.from({ length: trackLength }, (_, index) => ({
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
        questions: [],
        currentIndex: 0,
        currentQuestion: emptyQuestion,
        feedbackText: "",
        progressPercent: 0,
        showAnswerBadge: false,
        answerBadgeText: "",
        answerBadgeType: "correct",
        locked: false
    },
    onLoad(query) {
        const day = Number(query.day || 1);
        void this.loadLevel(day);
    },
    onUnload() {
        audio_1.audioService.stop();
    },
    onHide() {
        audio_1.audioService.stop();
    },
    async loadLevel(day) {
        await request_1.api.progress.markTask("level", "doing");
        const session = await request_1.api.session.start({
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
    syncLevelState(index, currentStep) {
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
    async handleSelect(event) {
        if (this.data.locked) {
            return;
        }
        this.setData({ locked: true });
        const selectedAnswer = Number(event.currentTarget.dataset.value);
        const currentQuestion = this.data.currentQuestion;
        const feedback = await request_1.api.session.answer({
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
                await request_1.api.session.finish(this.data.sessionId);
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
        audio_1.audioService.playQuestionPrompt(this.data.currentQuestion.id);
    }
});
