import { atom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';

export type StoredAtom<T> = ReturnType<typeof atomWithStorage<T>>;
export type StoredStackAtoms<T> = ReturnType<typeof createStoredStackAtoms<T>>;

export const createStoredStackAtoms = <T>(
  sotoredStackAtom: StoredAtom<T[]>
) => {
  const topValueAtom = atom((get) => {
    const arr = get(sotoredStackAtom);
    if (arr.length === 0) return undefined;
    return arr[arr.length - 1];
  });
  const pushAtom = atom(null, (get, set, value: T) => {
    set(sotoredStackAtom, (draft) => [...draft, value]);
  });
  const canPopAtom = atom((get) => get(sotoredStackAtom).length > 0);
  const popAtom = atom(null, (get, set) => {
    set(sotoredStackAtom, (draft) => {
      draft.pop();
      return [...draft];
    });
  });
  const resetAtom = atom(null, (get, set) => {
    set(sotoredStackAtom, RESET);
  });

  return { topValueAtom, pushAtom, canPopAtom, popAtom, resetAtom };
};
