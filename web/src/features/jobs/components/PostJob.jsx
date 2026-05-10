import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Icon from '../common/Icon';

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

  return (
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
  );
};

export default PostJob;