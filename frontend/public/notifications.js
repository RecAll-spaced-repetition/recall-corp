"use strict";
(() => {
  // workers/notifications.ts
  self.addEventListener("install", () => {
    self.skipWaiting();
  });
  self.addEventListener("activate", (e) => {
    e.waitUntil(self.clients.claim());
    self.registration.showNotification("\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435", {
      icon: "/favicon.ico"
    });
  });
  self.addEventListener("notificationclick", (e) => {
    e.notification.close();
    const url = e.notification.data?.url || "/";
    e.waitUntil(self.clients.openWindow(url));
  });
})();
