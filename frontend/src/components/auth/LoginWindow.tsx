import React from 'react';
import { useTranslation } from 'react-i18next';

import { ControlledModal } from '@/components/library/ControlledModal';
import { Button } from '@/components/library/Button';
import { useAppStore } from '@/state';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import clsx from 'clsx';

export const LoginWindow: React.FC = () => {
  const { t } = useTranslation();
  const authWindowState = useAppStore((state) => state.authWindow);
  const closeAuthWindow = useAppStore((state) => state.closeAuthWindow);
  const toggleActiveAuthWindow = useAppStore(
    (state) => state.toggleActiveAuthWindow
  );

  const isLogin = authWindowState === 'login';
  const isRegister = authWindowState === 'register';

  return (
    <ControlledModal
      isShown={authWindowState !== 'hidden'}
      close={closeAuthWindow}
      contentClassName={clsx(
        'bg-o-white border border-o-black px-4 py-6',
        'w-11/12 md:w-1/2 lg:w-1/3'
      )}
    >
      <h1 className="text-lg md:text-xl text-center text-black font-bold mb-2">
        {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
      </h1>
      <div className="vstack center transition-all duration-300 relative">
        <div
          className={clsx(
            'transition-all duration-300 w-full',
            isLogin ? 'h-fit opacity-100' : 'h-0 opacity-0 -translate-x-12'
          )}
        >
          {isLogin && <LoginForm />}
        </div>
        <div
          className={clsx(
            'transition-all duration-300 w-full',
            isRegister ? 'h-fit opacity-100' : 'h-0 opacity-0 translate-x-12'
          )}
        >
          {isRegister && <RegisterForm />}
        </div>
        <div className="center w-full mt-2">
          <Button
            className="p-2 rounded-lg"
            variant="bordered"
            onClick={toggleActiveAuthWindow}
          >
            {isRegister ? t('auth.goToLogin') : t('auth.goToRegister')}
          </Button>
        </div>
      </div>
    </ControlledModal>
  );
};
