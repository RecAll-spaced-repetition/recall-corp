import React from 'react';
import { AppRoutes } from '@/routes';
import { Header, Footer } from '@/components/mainWrapper';
import { LoginWindow } from '@/components/auth/LoginWindow';
import { CreateCollectionWindow } from '@/components/collection/CreateCollectionWindow';
import { ZoomedCard } from '@/components/card';
import clsx from 'clsx';

export const App: React.FC = () => {
  return (
    <div className={clsx('flex flex-col min-h-screen')}>
      <LoginWindow />
      <CreateCollectionWindow />
      <ZoomedCard />
      <Header />
      <main
        className={clsx(
          'flex-grow',
          'py-2 md:py-10',
          'px-4 sm:px-16 md:px-32 lg:px-48 xl:px-64'
        )}
      >
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};
