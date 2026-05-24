import React, { useState, useEffect } from 'react';
import Icon from '../../shared/components/Icon';

const ProfileContent = () => {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { fullName: '', email: '', username: '', role: '' };
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    });
    const [activeSection, setActiveSection] = useState('profile');
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fullName: user.fullName || '',
      email: user.email || '',
    }));
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update user in localStorage
      const updatedUser = { ...user, fullName: formData.fullName, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    try {
      // Here you would call API to update password
      alert('Password updated successfully!');
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Failed to update password');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setResumeFile(file);
    setUploadStatus('Uploading...');
    
    // Simulate upload (replace with actual API call)
    setTimeout(() => {
      setUploadStatus('Uploaded successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    }, 1500);
  };

  const sections = [
    { id: 'profile', label: 'Profile Information', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'resume', label: 'Resume', icon: 'document' },
    { id: 'preferences', label: 'Preferences', icon: 'setting' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-red-500 to-red-700"></div>
        
        {/* Avatar Section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-red-600">
                  {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 shadow-lg hover:bg-blue-700">
                <Icon name="edit" className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="md:ml-4 mt-4 md:mt-0 text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName || user.username}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {user.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Member since 2024
                </span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <Icon name="edit" className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 text-sm font-medium transition flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon name={section.icon === 'user' ? 'dashboard' : section.icon === 'lock' ? 'close' : section.icon} className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={user.username || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500 w-32">Full Name</span>
                  <span className="text-gray-800 flex-1">{user.fullName || 'Not set'}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500 w-32">Email Address</span>
                  <span className="text-gray-800 flex-1">{user.email}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500 w-32">Username</span>
                  <span className="text-gray-800 flex-1">{user.username}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between py-3">
                  <span className="text-gray-500 w-32">Account Type</span>
                  <span className="text-gray-800 flex-1 capitalize">{user.role?.toLowerCase() || 'Job Seeker'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="p-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength="6"
                />
                <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </form>

            {/* Session Management */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Active Sessions</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-500">Chrome on Windows • {new Date().toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Section */}
        {activeSection === 'resume' && (
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Icon name="document" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Upload your resume (PDF only, max 5MB)</p>
              <label className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                Choose File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
              {resumeFile && (
                <div className="mt-4 text-sm text-gray-600">
                  Selected: {resumeFile.name}
                </div>
              )}
              {uploadStatus && (
                <div className="mt-2 text-sm text-green-600">{uploadStatus}</div>
              )}
              <p className="text-xs text-gray-400 mt-4">Your resume will be shared with employers when you apply for jobs</p>
            </div>
            
            {/* Tips */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Resume Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Keep your resume to 1-2 pages</li>
                <li>✓ Use a professional file name (e.g., John_Doe_Resume.pdf)</li>
                <li>✓ Update your resume regularly</li>
              </ul>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Job Alert Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    <span className="text-gray-700">Email me about new job matches</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Send weekly job digest</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    <span className="text-gray-700">Notify me about application status updates</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    <span className="text-gray-700">Show my profile to employers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Allow employers to contact me</span>
                  </label>
                </div>
              </div>
              
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;