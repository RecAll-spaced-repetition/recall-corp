import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { App } from '@/App';
import '@/i18n';

import 'highlight.js/styles/intellij-light.min.css';
import 'katex/dist/katex.min.css';
import '@/index.css';
import { setupClient } from './setupBackend';

export const mountApp = (container: Element) => {
  setupClient();

  const queryClient = new QueryClient();
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );

  return { root, queryClient };
};

const container = document.getElementById(`root`);

if (container) {
  mountApp(container);
}

if ('serviceWorker' in navigator) {
  (async () => {
    const registration = await navigator.serviceWorker.register(
      '/notifications.js',
      {
        scope: '/',
      }
    );
    console.log('Service Worker Registered');
    const permissions = await registration.pushManager.permissionState({
      userVisibleOnly: true,
    });
    console.log(permissions);
  })();
}
