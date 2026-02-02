import { Immutable } from 'immer';

import { Slice } from '../types';

export type TrainState = Immutable<{
  cardsToTrainIds: number[];
  cardsToTrainInitialCount: number;
  trainedCount: number;
  setTrainCards: (cardsIds: number[]) => void;
  executeTrainCard: (cardId: number) => void;
}>;

export const createTrainStateSlice: Slice<TrainState> = (mutate) => ({
  cardsToTrainIds: [],
  cardsToTrainInitialCount: 0,
  trainedCount: 0,
  setTrainCards: (cardsIds) =>
    mutate((state) => {
      state.cardsToTrainIds = cardsIds;
      state.cardsToTrainInitialCount = cardsIds.length;
      state.trainedCount = 0;
    }),
  executeTrainCard: (trainedCardId) => {
    mutate((state) => {
      state.cardsToTrainIds = state.cardsToTrainIds.filter(
        (cardId) => trainedCardId !== cardId
      );
      state.trainedCount++;
    });
  },
});
