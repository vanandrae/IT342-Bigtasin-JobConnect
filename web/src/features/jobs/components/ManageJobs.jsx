import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../../services/api';
import Icon from '../../shared/components/Icon';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await jobAPI.getEmployerJobs();
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job posting? This action cannot be undone.')) {
      try {
        await jobAPI.delete(id);
        fetchMyJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="briefcase" className="w-12 h-12" />
            <span className="text-3xl font-bold text-red-600">JobConnect</span>
          </div>
          <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading your job listings...</p>
        </div>
      </div>
    );
  }

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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100"
          >
            <Icon name="plus" className="w-5 h-5" />
            <span className="font-medium">Post a Job</span>
          </button>
          <button 
            onClick={() => navigate('/manage-jobs')} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 bg-blue-50 text-blue-600 border-l-4 border-blue-600"
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Your Job Listings</h1>
          <button onClick={() => navigate('/post-job')} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Icon name="plus" className="w-4 h-4" />
            Post New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
            <button onClick={() => navigate('/post-job')} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto">
              <Icon name="plus" className="w-4 h-4" />
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.employmentType}</div>
                     </td>
                    <td className="px-6 py-4 text-gray-600">{job.location}</td>
                    <td className="px-6 py-4 text-gray-600">{job.employmentType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Icon name={job.status === 'OPEN' ? 'checked' : 'close'} className="w-3 h-3" />
                        {job.status === 'OPEN' ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{job.applicantCount || 0}</td>
                    <td className="px-6 py-4 space-x-3">
                      <button onClick={() => navigate(`/applicants/${job.id}`)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                        <Icon name="group" className="w-4 h-4" />
                        View Applicants
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1">
                        <Icon name="delete" className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <footer className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          © 2024 JobConnect - Job Portal. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default ManageJobs;