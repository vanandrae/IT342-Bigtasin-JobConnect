import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Icon from '../common/Icon';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      const allJobs = response.data || [];
      setJobs(allJobs);
      setStats({
        totalJobs: allJobs.length,
        activeJobs: allJobs.filter(job => job.status === 'OPEN').length,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 bg-blue-50 text-blue-600 border-l-4 border-blue-600">
            <Icon name="dashboard" className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button onClick={() => navigate('/post-job')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100">
            <Icon name="plus" className="w-5 h-5" />
            <span className="font-medium">Post a Job</span>
          </button>
          <button onClick={() => navigate('/manage-jobs')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100">
            <Icon name="list" className="w-5 h-5" />
            <span className="font-medium">Manage Listings</span>
          </button>
        </nav>
        <div className="absolute bottom-0 w-72 p-4 border-t bg-white">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
            <Icon name="logout" className="w-5 h-5" />
            <span className="font-medium">Log-out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Hello, {user.fullName || user.username}</h1>
          <p className="text-gray-500">Here is your daily activities and applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <Icon name="briefcase" className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.activeJobs}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <Icon name="checked" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Job Postings</h2>
            <button onClick={() => navigate('/post-job')} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
              <Icon name="plus" className="w-4 h-4" />
              Post New Job
            </button>
          </div>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">No jobs posted yet.</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs text-gray-500">
                <div className="col-span-4">Job Title</div>
                <div className="col-span-2">Employer</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Actions</div>
              </div>
              {jobs.map(job => (
                <div key={job.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b hover:bg-gray-50">
                  <div className="col-span-4">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.employmentType}</div>
                  </div>
                  <div className="col-span-2 text-gray-600">{job.employerName || 'Company'}</div>
                  <div className="col-span-2 text-gray-600">{job.location}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Icon name={job.status === 'OPEN' ? 'checked' : 'close'} className="w-3 h-3" />
                      {job.status === 'OPEN' ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <button onClick={() => navigate(`/applicants/${job.id}`)} className="text-blue-600 text-sm flex items-center gap-1">
                      <Icon name="view" className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <footer className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          © 2024 JobConnect - Job Portal. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default EmployerDashboard;