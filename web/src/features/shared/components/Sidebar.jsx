import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from './Icon';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: 'dashboard' },
    { path: '/post-job', label: 'Post a Job', icon: 'plus' },
    { path: '/manage-jobs', label: 'Manage Listings', icon: 'list' },
  ];

  return (
    <aside className="w-72 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Icon name="briefcase" className="w-10 h-10" />
          <span className="text-2xl font-bold text-red-600">JobConnect</span>
        </div>
      </div>
      <nav className="p-4">
        <div className="text-xs text-gray-400 mb-4 px-4">EMPLOYER DASHBOARD</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Icon name={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-72 p-4 border-t bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Icon name="logout" className="w-5 h-5" />
          <span className="font-medium">Log-out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;