
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { seedDatabase } from "./lib/seed-data";
import { initMSW } from "./lib/init-msw";

async function init() {
  // only run msw & seed in development
  if (process.env.NODE_ENV === "development") {
    await initMSW();
    // reduce candidates for faster dev by default
    await seedDatabase({ reduceCandidates: true });
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();
