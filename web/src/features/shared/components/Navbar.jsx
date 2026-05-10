import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-600">
          JobConnect
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-gray-600">
            Welcome, {user.fullName || user.email}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;