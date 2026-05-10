import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../../services/api';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [jobRes, applicantsRes] = await Promise.all([
        jobAPI.getById(jobId),
        applicationAPI.getByJob(jobId),
      ]);
      setJob(jobRes.data);
      setApplicants(applicantsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateStatus(applicationId, newStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading applicants...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Applicants</h1>
        {job && (
          <p className="text-gray-600 mt-1">
            {job.title} • {job.location} • {job.employmentType}
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-4">
            <select className="px-3 py-2 border rounded-md">
              <option>All Status</option>
              <option>Pending</option>
              <option>Shortlisted</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{applicant.seekerName || 'Applicant'}</h3>
                  <p className="text-sm text-gray-500">{applicant.email || 'No email'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied: {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={applicant.status || 'PENDING'}
                    onChange={(e) => handleStatusUpdate(applicant.id, e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">
                    View Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsList;