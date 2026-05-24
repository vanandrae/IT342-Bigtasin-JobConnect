import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth feature
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';

// Dashboard feature (these already contain their own layout/sidebar)
import Dashboard from './features/dashboard/components/Dashboard';

// Jobs feature
import PostJob from './features/jobs/components/PostJob';
import ManageJobs from './features/jobs/components/ManageJobs';

// Applications feature
import ApplicantsList from './features/applications/components/ApplicantsList';

// Profile feature
import ProfileContent from './features/dashboard/components/ProfileContent';

// Shared components (only for public pages)
import Homepage from './features/shared/components/Homepage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

const EmployerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role !== 'EMPLOYER') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - NO extra Layout wrapper because dashboards already have their own layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Profile route - accessible by both employers and job seekers */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileContent />
          </ProtectedRoute>
        } />
        
        {/* Employer-only routes */}
        <Route path="/post-job" element={
          <EmployerRoute>
            <PostJob />
          </EmployerRoute>
        } />
        
        <Route path="/manage-jobs" element={
          <EmployerRoute>
            <ManageJobs />
          </EmployerRoute>
        } />
        
        <Route path="/applicants/:jobId" element={
          <EmployerRoute>
            <ApplicantsList />
          </EmployerRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;