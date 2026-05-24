import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI, favoriteAPI } from '../../../services/api';
import Icon from '../../shared/components/Icon';
import ProfileContent from './ProfileContent';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobAlerts, setJobAlerts] = useState([]);
  const [matchingAlertJobs, setMatchingAlertJobs] = useState([]);
  const [stats, setStats] = useState({ appliedJobs: 0, favoriteJobs: 0, jobAlerts: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Load saved alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('jobAlerts');
    if (savedAlerts) {
      setJobAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jobAlerts', JSON.stringify(jobAlerts));
    setStats(prev => ({ ...prev, jobAlerts: jobAlerts.length }));
  }, [jobAlerts]);

  // Update matching jobs whenever jobs or alerts change
  useEffect(() => {
    updateMatchingJobs();
  }, [jobs, jobAlerts]);

  // Load favorites from database
  const loadFavorites = async () => {
    try {
      const response = await favoriteAPI.getFavorites();
      const favJobs = response.data || [];
      setFavoriteJobs(favJobs);
      const ids = favJobs.map(job => job.id);
      setFavoriteIds(ids);
      setStats(prev => ({ ...prev, favoriteJobs: favJobs.length }));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const jobsResponse = await jobAPI.getAll();
      setJobs(jobsResponse.data || []);
      
      const applicationsRes = await applicationAPI.getUserApplications();
      const applications = applicationsRes.data || [];
      setAppliedJobs(applications);
      
      setStats(prev => ({
        ...prev,
        appliedJobs: applications.length,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    loadFavorites();
  }, [activeTab]);

  const handleApply = async (jobId) => {
    try {
      await applicationAPI.apply(jobId);
      alert('Application submitted successfully!');
      fetchDashboardData();
    } catch (error) {
      if (error.response?.status === 400) {
        alert('You have already applied for this job');
      } else {
        alert('Failed to apply. Please try again.');
      }
    }
  };

  // Add to favorites
  const handleAddFavorite = async (jobId) => {
    try {
      await favoriteAPI.addFavorite(jobId);
      alert('Added to favorites ⭐');
      loadFavorites();
      fetchDashboardData();
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Job already in favorites');
      } else {
        console.error('Error adding favorite:', error);
        alert('Failed to add to favorites');
      }
    }
  };

  // Remove from favorites
  const handleRemoveFavorite = async (jobId) => {
    try {
      await favoriteAPI.removeFavorite(jobId);
      alert('Removed from favorites ❌');
      loadFavorites();
      fetchDashboardData();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  // Toggle favorite
  const handleFavorite = (jobId) => {
    if (favoriteIds.includes(jobId)) {
      handleRemoveFavorite(jobId);
    } else {
      handleAddFavorite(jobId);
    }
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Create a new job alert
  const createJobAlert = () => {
    const keywordInput = document.getElementById('alertKeyword');
    const keyword = keywordInput.value.trim();
    
    if (!keyword) {
      alert('Please enter a keyword for the job alert');
      return;
    }
    
    if (jobAlerts.some(alert => alert.keyword.toLowerCase() === keyword.toLowerCase())) {
      alert('You already have an alert for this keyword');
      return;
    }
    
    const newAlert = {
      keyword: keyword,
      createdAt: new Date().toISOString()
    };
    
    setJobAlerts([...jobAlerts, newAlert]);
    keywordInput.value = '';
    alert(`Job alert created for "${keyword}"`);
  };

  // Delete a job alert
  const deleteJobAlert = (index) => {
    const deletedAlert = jobAlerts[index];
    const newAlerts = jobAlerts.filter((_, i) => i !== index);
    setJobAlerts(newAlerts);
    alert(`Removed alert for "${deletedAlert.keyword}"`);
  };

  // Update matching jobs based on all alerts
  const updateMatchingJobs = () => {
    if (jobAlerts.length === 0 || jobs.length === 0) {
      setMatchingAlertJobs([]);
      return;
    }
    
    const matching = jobs.filter(job => {
      const jobText = `${job.title} ${job.description || ''} ${job.category || ''} ${job.location || ''}`.toLowerCase();
      return jobAlerts.some(alert => jobText.includes(alert.keyword.toLowerCase()));
    });
    
    setMatchingAlertJobs(matching);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'applied', label: 'Applied Jobs', icon: 'document' },
    { id: 'favorite', label: 'Favorite Jobs', icon: 'star' },
    { id: 'alerts', label: 'Job Alert', icon: 'bell' },
    { id: 'profile', label: 'Profile', icon: 'setting' },
  ];

  const isJobApplied = (jobId) => {
    return appliedJobs.some(app => app.jobId === jobId);
  };

  const isJobFavorited = (jobId) => {
    return favoriteIds.includes(jobId);
  };

  // Loading screen with brand logo
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="briefcase" className="w-12 h-12" />
            <span className="text-3xl font-bold text-red-600">JobConnect</span>
          </div>
          <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading dashboard...</p>
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
          <div className="text-xs text-gray-400 mb-4 px-4">APPLICANT DASHBOARD</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
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
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">Hello, {user.fullName || user.username}</h1>
              <p className="text-gray-500">Find your dream job today!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{stats.appliedJobs}</div>
                  <div className="text-sm text-gray-600">Applied jobs</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Icon name="document" className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{stats.favoriteJobs}</div>
                  <div className="text-sm text-gray-600">Favorite jobs</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Icon name="star" className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{stats.jobAlerts}</div>
                  <div className="text-sm text-gray-600">Job Alerts</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Icon name="bell" className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Icon name="building" className="w-4 h-4" />
                    <span className="text-sm">{job.employerName || 'Company'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Icon name="location" className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Icon name="money" className="w-4 h-4" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleViewJobDetails(job)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                    >
                      <Icon name="view" className="w-4 h-4" />
                      View Details
                    </button>
                    {isJobApplied(job.id) ? (
                      <button className="flex-1 bg-green-100 text-green-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1" disabled>
                        <Icon name="checked" className="w-4 h-4" />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job.id)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                      >
                        <Icon name="paper-plane" className="w-4 h-4" />
                        Apply Now
                      </button>
                    )}
                    <button
                      onClick={() => handleFavorite(job.id)}
                      className={`px-3 py-2 rounded text-sm border flex items-center justify-center ${
                        isJobFavorited(job.id)
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-600'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isJobFavorited(job.id) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {jobs.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">No jobs available at the moment.</div>
            )}
          </div>
        )}

        {activeTab === 'applied' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Applications</h2>
            {appliedJobs.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">You haven't applied to any jobs yet.</div>
            ) : (
              <div className="space-y-4">
                {appliedJobs.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{app.jobTitle}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Icon name="building" className="w-4 h-4" />
                          <span>{app.employerName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Icon name="location" className="w-4 h-4" />
                          <span>{app.jobLocation}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorite' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorite Jobs</h2>
            {favoriteJobs.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">No favorite jobs saved.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Icon name="building" className="w-4 h-4" />
                      <span className="text-sm">{job.employerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Icon name="location" className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleViewJobDetails(job)} className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1">
                        <Icon name="view" className="w-4 h-4" />
                        View Details
                      </button>
                      {isJobApplied(job.id) ? (
                        <button className="flex-1 bg-green-100 text-green-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1" disabled>
                          <Icon name="checked" className="w-4 h-4" />
                          Applied
                        </button>
                      ) : (
                        <button onClick={() => handleApply(job.id)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1">
                          <Icon name="paper-plane" className="w-4 h-4" />
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Alerts</h2>
            
            {/* Create New Alert */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Job Alert</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="alertKeyword"
                  placeholder="Enter job keywords (e.g., Software Engineer, Remote, Manila)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createJobAlert}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Icon name="bell" className="w-4 h-4" />
                  Create Alert
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You'll see jobs that match your keywords in the "Matching Jobs" section below.
              </p>
            </div>

            {/* Existing Alerts */}
            <h3 className="text-lg font-medium mb-3">Your Job Alerts ({jobAlerts.length})</h3>
            {jobAlerts.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                No job alerts created yet. Create one above to see matching jobs.
              </div>
            ) : (
              <div className="space-y-3">
                {jobAlerts.map((alert, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name="bell" className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Keyword: "{alert.keyword}"</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteJobAlert(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Icon name="delete" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Matching Jobs based on alerts */}
            {jobAlerts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">
                  Jobs Matching Your Alerts ({matchingAlertJobs.length})
                </h3>
                {matchingAlertJobs.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                    No jobs match your alerts yet. Check back later!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchingAlertJobs.map((job) => (
                      <div key={job.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                        <h4 className="font-semibold text-gray-800">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.employerName || 'Company'}</p>
                        <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                        <p className="text-sm text-blue-600 mt-1">{job.salaryRange}</p>
                        <button
                          onClick={() => handleViewJobDetails(job)}
                          className="mt-3 text-blue-600 text-sm hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && <ProfileContent />}

        {/* Job Details Modal */}
        {showJobModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h2>
                <button onClick={() => setShowJobModal(false)} className="text-gray-500 hover:text-gray-700">
                  <Icon name="close" className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="building" className="w-5 h-5" />
                  <span><strong>Company:</strong> {selectedJob.employerName || 'Company'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="location" className="w-5 h-5" />
                  <span><strong>Location:</strong> {selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="money" className="w-5 h-5" />
                  <span><strong>Salary Range:</strong> {selectedJob.salaryRange}</span>
                </div>
                <div className="text-gray-700">
                  <strong>Description:</strong>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                {isJobApplied(selectedJob.id) ? (
                  <button className="flex-1 bg-green-100 text-green-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2" disabled>
                    <Icon name="checked" className="w-5 h-5" />
                    Already Applied
                  </button>
                ) : (
                  <button onClick={() => { handleApply(selectedJob.id); setShowJobModal(false); }} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                    <Icon name="paper-plane" className="w-5 h-5" />
                    Apply Now
                  </button>
                )}
                <button onClick={() => setShowJobModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2">
                  <Icon name="close" className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicantDashboard;