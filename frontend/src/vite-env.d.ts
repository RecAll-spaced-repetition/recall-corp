/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECALL_API_HOSTNAME: string;
  readonly VITE_VAPID_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
