import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';

const JobSeekerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      setJobs(response.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-2">{job.employerName || 'Company'}</p>
            <p className="text-gray-500 text-sm mb-2">{job.location}</p>
            <p className="text-gray-500 text-sm mb-2">{job.employmentType}</p>
            <p className="text-primary-600 font-semibold mb-4">{job.salaryRange}</p>
            <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No jobs available at the moment.
        </div>
      )}
    </div>
  );
};

export default JobSeekerJobs;