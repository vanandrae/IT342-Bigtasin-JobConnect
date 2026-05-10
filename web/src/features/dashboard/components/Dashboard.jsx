import React from 'react';
import EmployerDashboard from './EmployerDashboard';
import ApplicantDashboard from './ApplicantDashboard';  // ← Use this

const Dashboard = () => {
  const role = localStorage.getItem('role');

  if (role === 'EMPLOYER') {
    return <EmployerDashboard />;
  }

  return <ApplicantDashboard />;  // ← For job seekers
};

export default Dashboard;