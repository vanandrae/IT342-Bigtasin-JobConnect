import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../../services/api';
import Icon from '../../shared/components/Icon';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    salaryRange: '',
    location: '',
    employmentType: 'FULL_TIME',
    status: 'OPEN',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please login again.');
      setLoading(false);
      return;
    }

    try {
      await jobAPI.create(formData);
      navigate('/manage-jobs');
    } catch (err) {
      console.error('Error posting job:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to post jobs. Only employers can post jobs.');
      } else {
        setError(err.response?.data?.message || 'Failed to post job. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Icon name="briefcase" className="w-10 h-10" />
            <span className="text-2xl font-bold text-red-600">JobConnect</span>
          </div>
        </div>
        <nav className="p-4">
          <div className="text-xs text-gray-400 mb-4 px-4">EMPLOYER DASHBOARD</div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100"
          >
            <Icon name="dashboard" className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button 
            onClick={() => navigate('/post-job')} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 bg-blue-50 text-blue-600 border-l-4 border-blue-600"
          >
            <Icon name="plus" className="w-5 h-5" />
            <span className="font-medium">Post a Job</span>
          </button>
          <button 
            onClick={() => navigate('/manage-jobs')} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100"
          >
            <Icon name="list" className="w-5 h-5" />
            <span className="font-medium">Manage Listings</span>
          </button>
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

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Icon name="plus" className="w-6 h-6" />
            Post a New Job
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
              <Icon name="close" className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Senior Software Engineer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select category</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
              <select name="employmentType" required value={formData.employmentType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <div className="flex items-center gap-2">
                <Icon name="money" className="w-5 h-5 text-gray-400" />
                <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., $80,000 - $120,000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <div className="flex items-center gap-2">
                <Icon name="location" className="w-5 h-5 text-gray-400" />
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Manila, Philippines or Remote" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea name="description" required rows={6} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Describe the role, responsibilities, and requirements..." />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                <Icon name="paper-plane" className="w-4 h-4" />
                {loading ? 'Posting...' : 'Post Job'}
              </button>
              <button type="button" onClick={() => navigate('/manage-jobs')} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
                <Icon name="close" className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
        <footer className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          © 2024 JobConnect - Job Portal. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default PostJob;