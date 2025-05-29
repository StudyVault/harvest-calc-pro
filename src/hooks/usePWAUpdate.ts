import { useEffect, useRef } from 'react';

interface PWAUpdateHookReturn {
  updateAvailable: boolean;
  updateApp: () => void;
}

export const usePWAUpdate = (onUpdateAvailable?: () => void): PWAUpdateHookReturn => {
  const updateAvailableRef = useRef(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Check if Safari (has limited PWA support)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    if (isSafari) {
      console.log('PWA: Safari detected - Service Worker registration disabled due to limited support');
      return;
    }

    // Use Vite PWA's built-in registration in development
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('PWA: Development mode - using Vite PWA plugin registration');
      
      // Listen for updates from Vite PWA plugin
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registrationRef.current = registration;
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  updateAvailableRef.current = true;
                  onUpdateAvailable?.();
                }
              });
            }
          });
        });
      }
      return;
    }

    // Production service worker registration
    if ('serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/harvest-calc-pro/sw.js', {
            scope: '/harvest-calc-pro/'
          });
          
          registrationRef.current = registration;
          console.log('PWA: Service worker registered successfully');
          
          // Check for waiting worker
          if (registration.waiting) {
            updateAvailableRef.current = true;
            onUpdateAvailable?.();
          }
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  updateAvailableRef.current = true;
                  onUpdateAvailable?.();
                }
              });
            }
          });
          
          // Check for updates periodically
          const interval = setInterval(() => {
            registration.update().catch(console.error);
          }, 60000);
          
          return () => clearInterval(interval);
        } catch (error) {
          console.error('PWA: Failed to register service worker:', error);
        }
      };

      registerSW();
    }
  }, [onUpdateAvailable, isSafari]);

  const updateApp = () => {
    const registration = registrationRef.current;
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    updateAvailable: updateAvailableRef.current,
    updateApp
  };
};

export default usePWAUpdate;
