import { create } from 'zustand';
import { produce } from 'immer';
import { devtools, persist } from 'zustand/middleware';

import { Mutator } from './types';
import {
  ActiveCardState,
  AuthWindowState,
  createActiveCardStateSlice,
  createAuthWindowStateSlice,
  CreateCollectionState,
  createCreateCollectionState,
} from './slices';
import { createTrainStateSlice, TrainState } from './slices/TrainState';

type StoreType = AuthWindowState &
  ActiveCardState &
  TrainState &
  CreateCollectionState;

export const useAppStore = create<StoreType>()(
  devtools(
    persist(
      (set, ...rest) => {
        const mutate: Mutator<StoreType> = (mutator) => set(produce(mutator));

        return {
          ...createAuthWindowStateSlice(mutate, set, ...rest),
          ...createActiveCardStateSlice(mutate, set, ...rest),
          ...createTrainStateSlice(mutate, set, ...rest),
          ...createCreateCollectionState(mutate, set, ...rest),
        };
      },
      { name: 'app-store' }
    )
  )
);
