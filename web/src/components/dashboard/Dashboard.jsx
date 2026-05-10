import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import RecentJobs from '../jobs/RecentJobs';
import { jobAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    newToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsResponse = await jobAPI.getEmployerJobs();
      const jobs = jobsResponse.data || [];
      
      setStats({
        activeJobs: jobs.filter(j => j.status === 'OPEN').length,
        totalApplicants: jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0),
        newToday: jobs.filter(j => {
          const today = new Date().toDateString();
          return new Date(j.createdAt).toDateString() === today;
        }).length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Active Jobs" value={stats.activeJobs} color="blue" />
        <StatsCard title="Total Applicants" value={stats.totalApplicants} color="green" />
        <StatsCard title="New Today" value={stats.newToday} color="purple" />
      </div>

      <RecentJobs />
    </div>
  );
};

export default Dashboard;