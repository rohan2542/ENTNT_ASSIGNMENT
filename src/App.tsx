import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/query-client';
import { Layout } from './components/layout/Layout';
import { JobsList } from './components/jobs/JobsList';
import { CandidatesList } from './components/candidates/CandidatesList';
import { CandidateProfile } from './components/candidates/CandidateProfile';
import { CandidateKanban } from './components/candidates/CandidateKanban';
import { AssessmentBuilder } from './components/assessments/AssessmentBuilder';
import { AssessmentRuntime } from './components/assessments/AssessmentRuntime';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Initialize MSW
import { initMSW } from './lib/init-msw';

function App() {
  useEffect(() => {
    initMSW();
  }, []);

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
              <Route path="kanban" element={<CandidateKanban />} />
              <Route path="jobs/:jobId/assessments/builder" element={<AssessmentBuilder />} />
              <Route path="jobs/:jobId/assessments/preview" element={<AssessmentRuntime />} />
              <Route path="jobs/:jobId/assessments/take" element={<AssessmentRuntime />} />
              <Route path="assessments/:jobId" element={<AssessmentRuntime />} />
              <Route path="settings" element={<div className="text-center py-12"><h1 className="text-2xl">Settings</h1></div>} />
            </Route>
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
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