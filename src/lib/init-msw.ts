// src/lib/init-msw.ts
let isInitialized = false;

export const initMSW = async () => {
  if (isInitialized) return;

  // only initialize in development
  if (process.env.NODE_ENV !== 'development') {
    isInitialized = true;
    return;
  }

  const { worker } = await import('./msw-browser');
  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    },
    onUnhandledRequest: 'bypass'
  });

  isInitialized = true;
};
