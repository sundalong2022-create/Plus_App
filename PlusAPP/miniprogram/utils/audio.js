"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioService = void 0;
const AUDIO_PATHS = {
    dayNarration: "/assets/audio/learn",
    questionPrompt: "/assets/audio/questions",
    rewardComplete: "/assets/audio/system/reward_complete.m4a",
    rewardMatch: "/assets/audio/system/reward_match.m4a"
};
const AUDIO_PLAYBACK_RATE = {
    narration: 0.9,
    question: 0.92,
    reward: 0.96
};
let innerAudioContext = null;
const createAudioContext = () => {
    if (innerAudioContext) {
        innerAudioContext.stop();
        innerAudioContext.destroy();
    }
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.obeyMuteSwitch = false;
    return innerAudioContext;
};
const playAudioSource = (src, fallbackTitle, playbackKind) => {
    const audioContext = createAudioContext();
    audioContext.onError((error) => {
        console.warn("audio play failed", error);
        wx.showToast({
            title: fallbackTitle,
            icon: "none"
        });
    });
    try {
        audioContext.playbackRate = AUDIO_PLAYBACK_RATE[playbackKind];
        audioContext.src = src;
        audioContext.play();
    }
    catch (error) {
        console.warn("audio play failed", error);
        wx.showToast({
            title: fallbackTitle,
            icon: "none"
        });
    }
};
exports.audioService = {
    playDayNarration(day) {
        playAudioSource(`${AUDIO_PATHS.dayNarration}/day_${day}.m4a`, "语音暂时不可用", "narration");
    },
    playQuestionPrompt(questionId) {
        if (!questionId) {
            return;
        }
        playAudioSource(`${AUDIO_PATHS.questionPrompt}/${questionId}_prompt.m4a`, "题目语音暂时不可用", "question");
    },
    playRewardComplete() {
        playAudioSource(AUDIO_PATHS.rewardComplete, "完成啦", "reward");
    },
    playRewardMatch() {
        playAudioSource(AUDIO_PATHS.rewardMatch, "配对完成", "reward");
    },
    stop() {
        if (innerAudioContext) {
            innerAudioContext.stop();
            innerAudioContext.destroy();
            innerAudioContext = null;
        }
    }
};
