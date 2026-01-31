import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome{user ? `, ${user.first_name || user.username}` : ''}!
        </h1>
        <p className="text-gray-600 text-lg">
          Hotel Management System - Streamline your hotel operations
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Room Management</h3>
          <p className="text-gray-600 mb-4">Manage room availability, types, and prices</p>
          <Link to="/rooms" className="text-blue-600 hover:underline">View Rooms →</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Guest Management</h3>
          <p className="text-gray-600 mb-4">Manage guest information and check-ins</p>
          <Link to="/guests" className="text-blue-600 hover:underline">View Guests →</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Reservations</h3>
          <p className="text-gray-600 mb-4">Handle bookings and reservations</p>
          <Link to="/reservations" className="text-blue-600 hover:underline">View Reservations →</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Reports</h3>
          <p className="text-gray-600 mb-4">View hotel performance reports</p>
          <Link to="/reports" className="text-blue-600 hover:underline">View Reports →</Link>
        </div>
      </div>

      {/* Welcome message for logged out users */}
      {!user && (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-700 mb-6">
            Login to access the full hotel management system features
          </p>
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Login to Dashboard
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;