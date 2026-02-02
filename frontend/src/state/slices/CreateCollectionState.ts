import { Immutable } from 'immer';

import { Slice } from '@/state';

export type CreateCollectionState = Immutable<{
  isCreateCollectionWindowOpened: boolean;
  setIsCreateCollectionWindowOpened: (value: boolean) => void;
}>;

export const createCreateCollectionState: Slice<CreateCollectionState> = (
  mutate
) => ({
  isCreateCollectionWindowOpened: false,
  setIsCreateCollectionWindowOpened: (value) => {
    mutate((state) => {
      state.isCreateCollectionWindowOpened = value;
    });
  },
});
