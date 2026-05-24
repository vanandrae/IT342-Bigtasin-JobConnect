import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from './Icon';
import ProfileContent from '../../dashboard/components/ProfileContent';

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!token) {
    return (
      <nav className="bg-white shadow-md px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="briefcase" className="w-8 h-8" />
            <span className="text-2xl font-bold text-red-600">JobConnect</span>
          </Link>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="briefcase" className="w-8 h-8" />
            <span className="text-2xl font-bold text-red-600">JobConnect</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden md:block">
              Welcome, {user.fullName || user.username}
            </span>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
            >
              <span className="text-lg font-semibold text-gray-700">
                {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Modal (alternative to separate page) - optional */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <Icon name="close" className="w-6 h-6" />
            </button>
            <ProfileContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;