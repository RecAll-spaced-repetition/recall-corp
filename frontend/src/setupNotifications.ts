import { serverUrl } from './setupBackend';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const SW_SCOPES = ['/'];
const SW_URL = '/notifications.js';

// VAPID-ключ закодирован в base64url; Uint8Array.fromBase64 не используем —
// его нет в типах TS 5.9 и в браузерах старше Chrome 140 / Safari 18.2
const urlBase64ToUint8Array = (base64Url: string) => {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
};

const isPushManagerActive = (pushManager: PushManager | undefined) => {
  if (!pushManager) {
    console.warn('PushManager is not available');
    return false;
  }
  return true;
};

export const initServiceWorker = async () => {
  try {
    const swRegistration = await navigator.serviceWorker.register(SW_URL, {
      scope: SW_SCOPES[0], // TODO: Дальше подумать, надо ли регать для всех путей
    });

    const pushManager = swRegistration.pushManager;

    if (!isPushManagerActive(pushManager)) {
      return;
    }

    const permissionState = await pushManager.permissionState({
      userVisibleOnly: true,
    });

    switch (permissionState) {
      case 'prompt': // Разрешение на push-уведомления пока не дано
        return 'prompt';
      case 'granted': {
        // Разрешение на push-уведомления дано
        const existingSubscription = await pushManager.getSubscription();
        if (existingSubscription) {
          await sendSubscriptionToServer(existingSubscription);
        } else {
          // Разрешение есть, но подписки нет (истекла/сброшена) — prompt не покажется
          await subscribeToPush();
        }
        return 'granted';
      }
      case 'denied': // Пользователь отказал в разрешении push-уведомлений
        return 'denied';
    }
  } catch (error) {
    console.error('Service Worker initialization error:', error);
    return 'error';
  }
};

export const subscribeToPush = async () => {
  if (!VAPID_PUBLIC_KEY) {
    console.error('VAPID key is not configured');
    return;
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const pushManager = swRegistration.pushManager;

    if (!isPushManagerActive(pushManager)) {
      console.warn("Push manager isn't active");
      return;
    }

    const subscriptionOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    };

    const subscription = await pushManager.subscribe(subscriptionOptions);

    await sendSubscriptionToServer(subscription);
    return true;
  } catch (error) {
    console.error('Push subscription error:', error);
    return false;
  }
};

const sendSubscriptionToServer = async (subscription: PushSubscription) => {
  try {
    const subscriptionJson = subscription.toJSON();

    if (
      !subscriptionJson.keys?.p256dh ||
      !subscriptionJson.keys?.auth ||
      !subscriptionJson.endpoint
    ) {
      throw new Error('Отсутствуют необходимые данные подписки');
    }

    const subscriptionInfo = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
      },
    };

    const response = await fetch(`${serverUrl}/web-push/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionInfo),
    });

    if (!response.ok) {
      throw new Error(`Subscription request failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Server subscription error:', error);
    throw error;
  }
};

export const start = async () => {
  if (!(navigator.serviceWorker && 'PushManager' in globalThis)) {
    console.warn('Push-уведомления не поддерживаются в этом браузере');
    return;
  }
  try {
    const state = await initServiceWorker();
    if (!state || state === 'error') {
      console.error("There're an error to get grants for notifications");
      return; // TODO: Подумать, как реагировать на эту ситуацию
    }
    if (state === 'denied') {
      console.warn('User has denied notifications');
      return;
    }
    if (state === 'granted') {
      console.log('Got permissions for notifications earlier');
      return;
    }
    state satisfies 'prompt';
    // TODO: Показываем UI компонент для запроса разрешения на уведомления который при нажатии будет вызывать нашу функцию `subscribeToPush()`
    console.log('Prompting permissions for notifications');
    const res = await subscribeToPush();
    console.log('Prompt subscribe result');
  } catch (err: unknown) {
    console.error('Failed to init service worker:', err);
  }
};
