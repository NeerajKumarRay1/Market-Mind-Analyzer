import { useEffect } from 'react';

const Dashboard = () => {
  // Redirect to market overview since analyzer functionality has been removed
  useEffect(() => {
    // This component is now deprecated - analyzer functionality removed
    console.log('Dashboard component deprecated - analyzer functionality removed');
  }, []);

  return (
    <div className="p-8 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Analyzer Removed</h2>
        <p className="text-gray-600 mb-4">
          The analyzer functionality has been removed from this application.
        </p>
        <p className="text-gray-600">
          Please use the Market Overview section for market intelligence features.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;