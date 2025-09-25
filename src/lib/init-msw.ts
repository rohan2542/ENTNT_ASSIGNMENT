


// src/lib/init-msw.ts
let isInitialized = false;

export const initMSW = async () => {
  if (isInitialized) return;

  // Only run MSW in browser environments (skip SSR or Node)
  if (typeof window === "undefined") {
    return;
  }

  // Load worker dynamically
  const { worker } = await import("./msw-browser");

  // Start worker for both development & production
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
    await worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js", // required for Netlify
      },
      onUnhandledRequest: "bypass",
    });
  }

  isInitialized = true;
};
