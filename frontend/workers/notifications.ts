/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const pushData = event.data.json();

  // Пример с расширенными опциями
  const notificationOptions: NotificationOptions = {
    body: pushData.body || 'Новое сообщение',
    icon: pushData.icon || '/favicon.ico',
    badge: pushData.badge,
    // image: pushData.image,
    tag: pushData.tag || 'default',
    data: pushData.data,
    requireInteraction: pushData.requireInteraction || false,
    silent: pushData.silent || false,
    // vibrate: pushData.vibrate || [200, 100, 200],
    // timestamp: Date.now(),
    // actions: pushData.actions || [],
  };
  // Без waitUntil браузер может убить SW до показа уведомления,
  // а Chrome за push без видимого уведомления отзывает подписку
  event.waitUntil(
    self.registration.showNotification(pushData.title, notificationOptions)
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  //можно регулировать ссылку вручную или положится на ответ сервера
  const url = e.notification.data?.url || '/';

  e.waitUntil(self.clients.openWindow(url));
});
