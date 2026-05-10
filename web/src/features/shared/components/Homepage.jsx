import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './common/Icon';

const Homepage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DBB9B9' }}>
      {/* Navigation */}
      <nav className="bg-white bg-opacity-90 shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="briefcase" className="w-8 h-8" />
            <span className="text-2xl font-bold text-red-600">JobConnect</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-800">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="container mx-auto">
          <div className="flex justify-center mb-6">
            <Icon name="briefcase" className="w-20 h-20" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your Dream Job Today</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Icon name="paper-plane" className="w-5 h-5" />
              Get Started
            </Link>
            <Link to="/login" className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2">
              <Icon name="logout" className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white bg-opacity-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose JobConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Icon name="search" className="w-12 h-12 text-blue-600" fallback="🔍" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Job Search</h3>
              <p className="text-gray-600">Find jobs that match your skills and preferences</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Icon name="paper-plane" className="w-12 h-12 text-green-600" fallback="📝" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Application</h3>
              <p className="text-gray-600">Apply to multiple jobs with just one click</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Icon name="document" className="w-12 h-12 text-purple-600" fallback="📊" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your application status in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Job Seekers</h2>
            <p className="text-gray-600 mb-4">
              Create your profile, upload your resume, and start applying to thousands of job opportunities.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Icon name="checked" className="w-5 h-5 text-green-600" fallback="✓" />
                Build a professional profile
              </li>
              <li className="flex items-center gap-2">
                <Icon name="paper-plane" className="w-5 h-5 text-blue-600" fallback="✓" />
                Apply with one click
              </li>
              <li className="flex items-center gap-2">
                <Icon name="bell" className="w-5 h-5 text-yellow-600" fallback="✓" />
                Get real-time notifications
              </li>
            </ul>
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Icon name="plus" className="w-4 h-4" fallback="+" />
              Join as Job Seeker
            </Link>
          </div>
          <div className="flex-1 text-center">
            <Icon name="group" className="w-48 h-48 mx-auto" fallback="👨‍💼" />
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-16 px-6 bg-white bg-opacity-50">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Employers</h2>
            <p className="text-gray-600 mb-4">
              Post jobs, manage applications, and find the perfect candidates for your company.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Icon name="plus" className="w-5 h-5 text-blue-600" fallback="✓" />
                Post unlimited job listings
              </li>
              <li className="flex items-center gap-2">
                <Icon name="list" className="w-5 h-5 text-purple-600" fallback="✓" />
                Manage applicants easily
              </li>
              <li className="flex items-center gap-2">
                <Icon name="group" className="w-5 h-5 text-green-600" fallback="✓" />
                Find qualified candidates
              </li>
            </ul>
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Icon name="building" className="w-4 h-4" fallback="+" />
              Join as Employer
            </Link>
          </div>
          <div className="flex-1 text-center">
            <Icon name="building" className="w-48 h-48 mx-auto" fallback="🏢" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-800 text-white text-center">
        <div className="container mx-auto">
          <div className="flex justify-center mb-4">
            <Icon name="briefcase" className="w-10 h-10" />
          </div>
          <p>&copy; 2024 JobConnect. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/about" className="text-gray-400 hover:text-white flex items-center gap-1">
              <Icon name="right-arrow" className="w-3 h-3" fallback="→" />
              About
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white flex items-center gap-1">
              <Icon name="right-arrow" className="w-3 h-3" fallback="→" />
              Contact
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white flex items-center gap-1">
              <Icon name="right-arrow" className="w-3 h-3" fallback="→" />
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;