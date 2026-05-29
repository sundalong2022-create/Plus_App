type AudioMap = {
  dayNarration: string;
  questionPrompt: string;
  rewardComplete: string;
  rewardMatch: string;
};

type AudioPlaybackKind = "narration" | "question" | "reward";

const AUDIO_PATHS: AudioMap = {
  dayNarration: "/assets/audio/learn",
  questionPrompt: "/assets/audio/questions",
  rewardComplete: "/assets/audio/system/reward_complete.m4a",
  rewardMatch: "/assets/audio/system/reward_match.m4a"
};

const AUDIO_PLAYBACK_RATE: Record<AudioPlaybackKind, number> = {
  narration: 0.9,
  question: 0.92,
  reward: 0.96
};

let innerAudioContext: InnerAudioContext | null = null;

const createAudioContext = (): InnerAudioContext => {
  if (innerAudioContext) {
    innerAudioContext.stop();
    innerAudioContext.destroy();
  }

  innerAudioContext = wx.createInnerAudioContext();
  innerAudioContext.obeyMuteSwitch = false;
  return innerAudioContext;
};

const playAudioSource = (src: string, fallbackTitle: string, playbackKind: AudioPlaybackKind): void => {
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
  } catch (error) {
    console.warn("audio play failed", error);
    wx.showToast({
      title: fallbackTitle,
      icon: "none"
    });
  }
};

export const audioService = {
  playDayNarration(day: number): void {
    playAudioSource(`${AUDIO_PATHS.dayNarration}/day_${day}.m4a`, "语音暂时不可用", "narration");
  },

  playQuestionPrompt(questionId: string): void {
    if (!questionId) {
      return;
    }

    playAudioSource(
      `${AUDIO_PATHS.questionPrompt}/${questionId}_prompt.m4a`,
      "题目语音暂时不可用",
      "question"
    );
  },

  playRewardComplete(): void {
    playAudioSource(AUDIO_PATHS.rewardComplete, "完成啦", "reward");
  },

  playRewardMatch(): void {
    playAudioSource(AUDIO_PATHS.rewardMatch, "配对完成", "reward");
  },

  stop(): void {
    if (innerAudioContext) {
      innerAudioContext.stop();
      innerAudioContext.destroy();
      innerAudioContext = null;
    }
  }
};
