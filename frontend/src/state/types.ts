import { StoreApi } from 'zustand';
import { Draft } from 'immer';

export type Mutator<T> = (m: (d: Draft<T>) => void) => void;

export type SliceApi<T> = { mutate: Mutator<T> };

export type Slice<T> = (
  mutate: Mutator<T>,
  set: StoreApi<T>['setState'],
  get: StoreApi<T>['getState'],
  api: StoreApi<T>
) => T;
