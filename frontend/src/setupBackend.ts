import { client } from '@/api';

export const serverUrl = import.meta.env.VITE_RECALL_API_HOSTNAME;

export const setupClient = () =>
  client.setConfig({
    baseUrl: serverUrl,
    credentials: 'include',
  });
