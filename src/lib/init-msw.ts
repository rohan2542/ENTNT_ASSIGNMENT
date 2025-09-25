


// src/lib/init-msw.ts
let isInitialized = false;

export const initMSW = async () => {
  if (isInitialized) return;

  // Only run MSW in browser environments (skip SSR or Node)
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Load worker dynamically
    const { worker } = await import("./msw-browser");

    // Start worker for both development & production
    await worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
      onUnhandledRequest: "bypass",
      quiet: process.env.NODE_ENV === "production", // Reduce console noise in production
    });

    console.log("MSW initialized successfully");
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize MSW:", error);
    // Don't throw - allow app to continue without MSW
  }
};
