import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { App } from '@/App';
import { client } from '@/api';
import '@/i18n';

import 'highlight.js/styles/intellij-light.min.css';
import 'katex/dist/katex.min.css';
import '@/index.css';

export const serverUrl = import.meta.env.VITE_RECALL_API_HOSTNAME;
client.setConfig({
  baseUrl: serverUrl,
  credentials: 'include',
});

const queryClient = new QueryClient();

const container = document.getElementById(`root`);
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
