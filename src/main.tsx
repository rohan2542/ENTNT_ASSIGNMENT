

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { seedDatabase } from "./lib/seed-data";
import { initMSW } from "./lib/init-msw";

async function init() {
  try {
    // Start MSW in both dev & prod
    await initMSW();

    // Seed database
    await seedDatabase();
    
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Initialization error:", error);
    // Continue with app startup even if initialization fails
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();
