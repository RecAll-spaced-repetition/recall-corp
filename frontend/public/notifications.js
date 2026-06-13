"use strict";
(() => {
  // workers/notifications.ts
  self.addEventListener("install", () => {
    self.skipWaiting();
  });
  self.addEventListener("activate", (e) => {
    e.waitUntil(self.clients.claim());
  });
  self.addEventListener("push", (event) => {
    if (!event.data) return;
    const pushData = event.data.json();
    const notificationOptions = {
      body: pushData.body || "\u041D\u043E\u0432\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",
      icon: pushData.icon || "/favicon.ico",
      badge: pushData.badge,
      // image: pushData.image,
      tag: pushData.tag || "default",
      data: pushData.data,
      requireInteraction: pushData.requireInteraction || false,
      silent: pushData.silent || false
      // vibrate: pushData.vibrate || [200, 100, 200],
      // timestamp: Date.now(),
      // actions: pushData.actions || [],
    };
    event.waitUntil(
      self.registration.showNotification(pushData.title, notificationOptions)
    );
  });
  self.addEventListener("notificationclick", (e) => {
    e.notification.close();
    const url = e.notification.data?.url || "/";
    e.waitUntil(self.clients.openWindow(url));
  });
})();
