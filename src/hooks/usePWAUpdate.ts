import { useEffect, useRef, useState } from 'react';

interface PWAUpdateHookReturn {
  updateAvailable: boolean;
  updateApp: () => void;
}

export const usePWAUpdate = (onUpdateAvailable?: () => void): PWAUpdateHookReturn => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Check if Safari (has limited PWA support)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    if (isSafari) {
      console.log('PWA: Safari detected - Service Worker registration disabled due to limited support');
      return;
    }
    if (!('serviceWorker' in navigator)) return;

    const isDevelopment =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isDevelopment) {
      console.log('PWA: Development mode - using Vite PWA plugin registration');
      return;
    }

    // When the SW updates and claims this client, reload to pick up new assets
    const sw = navigator.serviceWorker;
    const handleControllerChange = () => {
      window.location.reload();
    };
    sw.addEventListener('controllerchange', handleControllerChange);

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/harvest-calc-pro/sw.js', {
          scope: '/harvest-calc-pro/',
        });

        registrationRef.current = registration;
        console.log('PWA: Service worker registered successfully');

        const onNewWorker = (worker: ServiceWorker) => {
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              onUpdateAvailable?.();
            }
          });
        };

        // Worker already waiting (user revisited after deploy)
        if (registration.waiting) {
          setUpdateAvailable(true);
          onUpdateAvailable?.();
        }

        registration.addEventListener('updatefound', () => {
          if (registration.installing) onNewWorker(registration.installing);
        });

        // Poll for updates every minute
        const interval = setInterval(() => registration.update().catch(console.error), 60_000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('PWA: Failed to register service worker:', error);
      }
    };

    registerSW();

    return () => {
      sw.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [onUpdateAvailable, isSafari]);

  const updateApp = () => {
    const registration = registrationRef.current;
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return { updateAvailable, updateApp };
};

export default usePWAUpdate;
