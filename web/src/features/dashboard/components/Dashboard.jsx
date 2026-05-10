import React from 'react';
import EmployerDashboard from './EmployerDashboard';
import ApplicantDashboard from './ApplicantDashboard';

const Dashboard = () => {
  const role = localStorage.getItem('role');
  
  if (role === 'EMPLOYER') {
    return <EmployerDashboard />;
  }
  
  return <ApplicantDashboard />;
};

export default Dashboard;