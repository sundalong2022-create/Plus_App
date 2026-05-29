import type { MatchCard } from "../../types/api";
import { audioService } from "../../utils/audio";
import { api } from "../../utils/request";

let matchRewardTimer = 0;

Page({
  data: {
    loading: true,
    day: 1,
    sessionId: "",
    cards: [] as MatchCard[],
    openedCardIds: [] as string[],
    matchedCount: 0,
    totalPairs: 0,
    progressPercent: 0,
    showRewardBurst: false,
    locked: false
  },

  onLoad(query: { day?: string }) {
    const day = Number(query.day || 1);
    void this.loadRound(day);
  },

  onUnload() {
    audioService.stop();
    if (matchRewardTimer) {
      clearTimeout(matchRewardTimer);
      matchRewardTimer = 0;
    }
  },

  onHide() {
    audioService.stop();
    if (matchRewardTimer) {
      clearTimeout(matchRewardTimer);
      matchRewardTimer = 0;
    }
  },

  async loadRound(day: number) {
    const session = await api.session.start({
      gameType: "match",
      day,
      source: "daily"
    });

    this.setData({
      loading: false,
      day,
      sessionId: session.sessionId,
      cards: session.cards || [],
      totalPairs: (session.cards || []).length / 2,
      progressPercent: 0
    });
  },

  handleCardTap(event: { currentTarget: { dataset: { id: string } } }) {
    if (this.data.locked) {
      return;
    }

    const cardId = event.currentTarget.dataset.id;
    const cards = this.data.cards.map((card) => ({ ...card }));
    const target = cards.find((card) => card.id === cardId);

    if (!target || target.status !== "closed") {
      return;
    }

    target.status = "opened";
    const openedCardIds = [...this.data.openedCardIds, cardId];

    this.setData({
      cards,
      openedCardIds
    });

    if (openedCardIds.length < 2) {
      return;
    }

    const [firstCardId, secondCardId] = openedCardIds;
    const firstCard = cards.find((card) => card.id === firstCardId);
    const secondCard = cards.find((card) => card.id === secondCardId);

    if (!firstCard || !secondCard) {
      return;
    }

    this.setData({ locked: true });

    const matched = firstCard.pairId === secondCard.pairId;

    setTimeout(() => {
      const nextCards = this.data.cards.map((card) => ({ ...card }));
      const left = nextCards.find((card) => card.id === firstCardId);
      const right = nextCards.find((card) => card.id === secondCardId);

      if (left && right) {
        left.status = matched ? "matched" : "closed";
        right.status = matched ? "matched" : "closed";
      }

      const matchedCount = matched ? this.data.matchedCount + 1 : this.data.matchedCount;

      this.setData({
        cards: nextCards,
        openedCardIds: [],
        matchedCount,
        progressPercent: this.data.totalPairs ? Math.round((matchedCount / this.data.totalPairs) * 100) : 0,
        locked: false
      });

      if (matchedCount === this.data.totalPairs) {
        this.setData({ showRewardBurst: true });
        audioService.playRewardMatch();
        wx.vibrateShort({ type: "light" });
        matchRewardTimer = setTimeout(() => {
          this.setData({ showRewardBurst: false });
        }, 1500) as unknown as number;
      }
    }, 500);
  }
});
