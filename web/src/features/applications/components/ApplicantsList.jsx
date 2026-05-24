import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../../../services/api';
import Icon from '../../shared/components/Icon';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [jobRes, applicantsRes] = await Promise.all([
        jobAPI.getById(jobId),
        applicationAPI.getByJob(jobId),
      ]);
      setJob(jobRes.data);
      setApplicants(applicantsRes.data || []);
      setFilteredApplicants(applicantsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter(
        (applicant) => applicant.status === statusFilter
      );
      setFilteredApplicants(filtered);
    }
  }, [statusFilter, applicants]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      await applicationAPI.updateStatus(applicationId, newStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewResume = (resumeUrl, applicantName) => {
    if (!resumeUrl) {
      alert('No resume uploaded for this applicant');
      return;
    }
    setSelectedResume({ url: resumeUrl, name: applicantName });
    setShowResumeModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Define all possible status options
  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'yellow' },
    { value: 'SHORTLISTED', label: 'Shortlisted', color: 'purple' },
    { value: 'APPROVED', label: 'Approved', color: 'green' },
    { value: 'REJECTED', label: 'Rejected', color: 'red' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="briefcase" className="w-12 h-12" />
            <span className="text-3xl font-bold text-red-600">JobConnect</span>
          </div>
          <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading applicants...</p>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Applicants</h1>
          {job && (
            <p className="text-gray-600 mt-1">
              {job.title} • {job.location} • {job.employmentType}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {/* Filter Section */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <span className="text-sm text-gray-500">
                Showing {filteredApplicants.length} of {applicants.length} applicants
              </span>
            </div>
          </div>

          {/* Applicants List */}
          <div className="divide-y divide-gray-200">
            {filteredApplicants.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {statusFilter === 'ALL' 
                  ? 'No applicants have applied for this job yet.'
                  : `No applicants with status "${statusFilter}".`}
              </div>
            ) : (
              filteredApplicants.map((applicant) => (
                <div key={applicant.id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    {/* Applicant Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{applicant.seekerName || 'Applicant'}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(applicant.status)}`}>
                          {applicant.status || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        📧 {applicant.email || 'No email'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied: {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>

                    {/* Action Buttons - Status Change Options */}
                    <div className="flex flex-wrap gap-2">
                      {applicant.resumeUrl && (
                        <button
                          onClick={() => handleViewResume(applicant.resumeUrl, applicant.seekerName)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center gap-1 hover:bg-gray-200"
                        >
                          📄 View Resume
                        </button>
                      )}
                      
                      {/* Status Dropdown instead of multiple buttons */}
                      <select
                        value={applicant.status || 'PENDING'}
                        onChange={(e) => handleStatusUpdate(applicant.id, e.target.value)}
                        disabled={updatingStatus === applicant.id}
                        className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <footer className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          © 2024 JobConnect - Job Portal. All rights reserved.
        </footer>
      </main>

      {/* Resume Modal */}
      {showResumeModal && selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Resume - {selectedResume.name}
              </h3>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedResume.url && selectedResume.url.endsWith('.pdf') ? (
                <iframe
                  src={selectedResume.url}
                  title="Resume Viewer"
                  className="w-full h-[70vh] border-0"
                />
              ) : (
                <img
                  src={selectedResume.url}
                  alt="Resume"
                  className="w-full"
                />
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <a
                href={selectedResume.url}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;