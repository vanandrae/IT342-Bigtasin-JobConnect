import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth feature
import Register from './features/auth/components/Register';
import Login from './features/auth/components/Login';

// Dashboard feature
import Dashboard from './features/dashboard/components/Dashboard';

// Jobs feature
import PostJob from './features/jobs/components/PostJob';
import ManageJobs from './features/jobs/components/ManageJobs';

// Applications feature
import ApplicantsList from './features/applications/components/ApplicantsList';

// Shared components
import Layout from './features/shared/components/Layout';
import Homepage from './features/shared/components/Homepage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/post-job" element={
            <ProtectedRoute>
              <Layout>
                <PostJob />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manage-jobs" element={
            <ProtectedRoute>
              <Layout>
                <ManageJobs />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/applicants/:jobId" element={
            <ProtectedRoute>
              <Layout>
                <ApplicantsList />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
  );
}

export default App;