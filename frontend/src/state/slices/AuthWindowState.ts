import { Immutable } from 'immer';

import { Slice } from '@/state';
import { match } from 'ts-pattern';

export type AuthWindowState = Immutable<{
  authWindow: 'hidden' | 'login' | 'register';
  closeAuthWindow: () => void;
  showLoginWindow: () => void;
  showRegisterWindow: () => void;
  toggleActiveAuthWindow: () => void;
}>;

export const createAuthWindowStateSlice: Slice<AuthWindowState> = (mutate) => ({
  authWindow: 'hidden',
  closeAuthWindow: () => {
    mutate((state) => {
      state.authWindow = 'hidden';
    });
  },
  showLoginWindow: () => {
    mutate((state) => {
      state.authWindow = 'login';
    });
  },
  showRegisterWindow: () => {
    mutate((state) => {
      state.authWindow = 'register';
    });
  },
  toggleActiveAuthWindow: () => {
    mutate((state) => {
      state.authWindow = match(state.authWindow)
        .returnType<AuthWindowState['authWindow']>()
        .with('login', () => 'register')
        .with('register', () => 'login')
        .with('hidden', () => 'hidden')
        .exhaustive();
    });
  },
});
