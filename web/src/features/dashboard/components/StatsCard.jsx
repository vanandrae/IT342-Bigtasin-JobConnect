import React from 'react';

const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-primary-600">{value}</p>
    </div>
  );
};

export default StatsCard;