

// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/query-client";
import { Layout } from "./components/layout/Layout";
import { JobsList } from "./components/jobs/JobsList";
import { CandidatesList } from "./components/candidates/CandidatesList";
import { CandidateProfile } from "./components/candidates/CandidateProfile";
import { CandidateKanban } from "./components/candidates/CandidateKanban";
import { AssessmentBuilder } from "./components/assessments/AssessmentBuilder";
import { AssessmentRuntime } from "./components/assessments/AssessmentRuntime";
import AssessmentSubmit from "./components/assessments/AssessmentSubmit";

import SettingsPage from "./components/layout/Setting";
import ProfilePage from "./components/layout/ProfilePage";
import AssessmentsPage from "./components/layout/AssessmentsPage";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/jobs" replace />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="candidates" element={<CandidatesList />} />
                <Route path="candidates/:id" element={<CandidateProfile />} />
                <Route
                  path="kanban"
                  element={<CandidateKanban sidebarCollapsed={false} />}
                />

                {/* Assessments */}
                <Route path="/assessments" element={<AssessmentsPage />} />
                <Route path="/assessments/new" element={<AssessmentBuilder />} />
                {/* Edit by JOB ID (builder expects jobId param) */}
                <Route path="/assessments/:jobId/edit" element={<AssessmentBuilder />} />
                {/* Runtime by assessment ID */}
                <Route path="/assessments/:id/run" element={<AssessmentRuntime />} />
                <Route path="/assessments/:id/submit" element={<AssessmentSubmit />} />

                {/* Legacy runtime: keep routes that pass jobId */}
                <Route
                  path="jobs/:jobId/assessments/preview"
                  element={<AssessmentRuntime />}
                />
                <Route
                  path="jobs/:jobId/assessments/take"
                  element={<AssessmentRuntime />}
                />

                {/* <Route path="settings" element={<SettingsPage />} /> */}
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>

            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: {
                  zIndex: 9999,
                  background: "#fff",
                  color: "#111",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
