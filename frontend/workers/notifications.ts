/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
  self.registration.showNotification('Тестовое уведомление', {
    icon: '/favicon.ico',
  });
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  //можно регулировать ссылку вручную или положится на ответ сервера
  const url = e.notification.data?.url || '/';

  e.waitUntil(self.clients.openWindow(url));
});
