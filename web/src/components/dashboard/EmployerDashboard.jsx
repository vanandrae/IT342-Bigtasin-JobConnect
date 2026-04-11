import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      // Get ALL jobs from all employers (not just current employer)
      const response = await jobAPI.getAll();
      console.log('All jobs:', response.data);
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading jobs...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900">Hello, {user.fullName || user.username}</h1>
        <p className="text-sm text-gray-500">Here are all the available job postings</p>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 mb-8">
        <div className="w-80 bg-primary-50 rounded-lg p-5 flex justify-between items-center">
          <div>
            <div className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</div>
            <div className="text-sm text-gray-700 opacity-80">Total Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-md">
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="w-80 bg-success-50 rounded-lg p-5 flex justify-between items-center">
          <div>
            <div className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</div>
            <div className="text-sm text-gray-700 opacity-80">Active Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-md">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* All Job Postings Section - Read Only, No Delete/Edit */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium text-gray-900">All Job Postings</h2>
          <Link to="/post-job" className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700">
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No jobs posted yet.</p>
            <Link to="/post-job" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                    <td className="px-6 py-4 text-gray-600">{job.employerName || 'Company'}</td>
                    <td className="px-6 py-4 text-gray-600">{job.location}</td>
                    <td className="px-6 py-4 text-gray-600">{job.employmentType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status === 'OPEN' ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => window.location.href = `/applicants/${job.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;