import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PostJob from './components/jobs/PostJob';
import ManageJobs from './components/jobs/ManageJobs';
import ApplicantsList from './components/applications/ApplicantsList';
import Layout from './components/layout/Layout';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
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