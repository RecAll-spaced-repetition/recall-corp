import { serverUrl } from './setupBackend';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const SW_SCOPES = ['/'];
const SW_URL = '/notifications.js';

const initServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register(SW_URL, {
      scope: SW_SCOPES[0], // TODO: Дальше подумать, надо ли регать для всех путей
    });
  } catch (error) {
    throw new Error('Service Worker initialization error', { cause: error });
  }
};

const getPushManager = async () => {
  const swRegistration = await navigator.serviceWorker.ready;
  const pushManager = swRegistration.pushManager;
  if (pushManager) return pushManager;
  console.warn('PushManager is not available');
};

const getPermission = async () =>
  (await getPushManager())?.permissionState({
    userVisibleOnly: true,
  });

const urlBase64ToUint8Array = (base64Url: string) => {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding)
    .replaceAll('-', '+')
    .replaceAll('_', '/');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)); // NOSONAR
};

export const createNewSubscription = async () => {
  if (!VAPID_PUBLIC_KEY) {
    console.error('VAPID key is not configured');
    return;
  }

  try {
    const pushManager = await getPushManager();
    if (!pushManager) {
      console.warn("Push manager isn't active");
      return;
    }

    const subscriptionOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    };

    return await pushManager.subscribe(subscriptionOptions);
  } catch (error) {
    console.error('Push subscription error:', error);
  }
};

const getFreshSubscription = async () => {
  const pushManager = await getPushManager();
  if (!pushManager) return;
  return (
    (await pushManager.getSubscription()) ?? (await createNewSubscription())
  );
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

export const refreshSubscription = async ({
  requestPermissionOnPrompt = false,
}: {
  requestPermissionOnPrompt?: boolean;
} = {}) => {
  try {
    console.log(requestPermissionOnPrompt);
    const permission = await getPermission();
    if (!permission) {
      console.error("There're an error to get permission state");
      return;
    }
    if (permission === 'denied') {
      console.warn('User has denied notifications');
      return;
    }
    if (permission === 'prompt') {
      console.log('Need to prompt permissions');
      if (!requestPermissionOnPrompt) return;
      console.log('Prompting for permission');
      await Notification.requestPermission();
      await refreshSubscription();
      return;
    }
    permission satisfies 'granted';
    const subsciption = await getFreshSubscription();
    if (!subsciption) return;
    await sendSubscriptionToServer(subsciption);
  } catch (err: unknown) {
    console.error('Failed to refresh subscription:', err);
  }
};

export const start = async () => {
  if (!(navigator.serviceWorker && 'PushManager' in globalThis)) {
    console.warn('Push-уведомления не поддерживаются в этом браузере');
    return;
  }
  try {
    await initServiceWorker();
    await refreshSubscription();
  } catch (err: unknown) {
    console.error('Failed to init service worker:', err);
  }
};
