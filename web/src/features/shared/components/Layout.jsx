import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const role = localStorage.getItem('role');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {role === 'EMPLOYER' && <Sidebar />}
        <main className={`flex-1 p-6 ${role === 'EMPLOYER' ? 'ml-72' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;