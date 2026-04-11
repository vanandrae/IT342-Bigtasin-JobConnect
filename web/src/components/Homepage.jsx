import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DBB9B9' }}>
      {/* Navigation */}
      <nav className="bg-white bg-opacity-90 shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">JobConnect</div>
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-800">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your Dream Job Today</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with top employers and discover opportunities that match your skills
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</Link>
          <Link to="/login" className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100">Sign In</Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white bg-opacity-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose JobConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Easy Job Search</h3>
              <p className="text-gray-600">Find jobs that match your skills and preferences</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Quick Application</h3>
              <p className="text-gray-600">Apply to multiple jobs with just one click</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your application status in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Job Seekers */}
      <section className="py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Job Seekers</h2>
            <p className="text-gray-600 mb-4">
              Create your profile, upload your resume, and start applying to thousands of job opportunities.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">✓ Build a professional profile</li>
              <li className="flex items-center gap-2">✓ Apply with one click</li>
              <li className="flex items-center gap-2">✓ Get real-time notifications</li>
            </ul>
            <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Join as Job Seeker</Link>
          </div>
          <div className="flex-1 text-center text-8xl">👨‍💼</div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-16 px-6 bg-white bg-opacity-50">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Employers</h2>
            <p className="text-gray-600 mb-4">
              Post jobs, manage applications, and find the perfect candidates for your company.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">✓ Post unlimited job listings</li>
              <li className="flex items-center gap-2">✓ Manage applicants easily</li>
              <li className="flex items-center gap-2">✓ Find qualified candidates</li>
            </ul>
            <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Join as Employer</Link>
          </div>
          <div className="flex-1 text-center text-8xl">🏢</div>
        </div>
      </section>

      {/* Footer - fixed to avoid ESLint warning */}
      <footer className="py-8 px-6 bg-gray-800 text-white text-center">
        <p>&copy; 2024 JobConnect. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link to="/about" className="text-gray-400 hover:text-white">About</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;