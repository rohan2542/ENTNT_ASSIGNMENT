let isInitialized = false;

export const initMSW = async () => {
  if (isInitialized) return;
  
  const { worker } = await import('./msw-browser');
  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    },
    onUnhandledRequest: 'bypass',
  });
  
  isInitialized = true;
};