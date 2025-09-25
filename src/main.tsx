
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { seedDatabase } from "./lib/seed-data";
import { initMSW } from "./lib/init-msw";

async function init() {
  // Start MSW in both dev & prod
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
    await initMSW();

    // Seed database
    // In dev: use reduced candidates for faster load
    // In prod: seed full dataset
    await seedDatabase({
      reduceCandidates: process.env.NODE_ENV === "development",
    });
  }
  // In prod: no auto-seed, keep data stable
  // (Reseed Database button can still call seedDatabase() if needed)

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();
