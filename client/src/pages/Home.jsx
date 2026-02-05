import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from '../api/Axios';

function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    activeBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // These are example endpoints - adjust based on your actual API
      const [roomsRes, bookingsRes] = await Promise.all([
        Axios.get('/rooms'),
        Axios.get('/room-orders?status=active'),
      ]);
      
      // Calculate stats from responses
      const totalRooms = roomsRes.data?.data?.length || 0;
      const availableRooms = roomsRes.data?.data?.filter(room => room.status === 'available').length || 0;
      const activeBookings = bookingsRes.data?.data?.length || 0;
      
      setStats({
        totalRooms,
        availableRooms,
        activeBookings,
        totalRevenue: activeBookings * 150, // Example calculation
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {getGreeting()}, <span className="text-blue-200">{user?.first_name || user?.username || 'Guest'}</span>!
              </h1>
              <p className="mt-2 text-blue-100">
                Welcome to your Hotel Management Dashboard
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="px-3 py-1 bg-blue-500 rounded-full text-sm">
                  {user?.role === 'admin' ? 'Administrator' : 'Guest User'}
                </div>
                <div className="px-3 py-1 bg-green-500 rounded-full text-sm">
                  Account Active
                </div>
              </div>
            </div>
            
            {/* Profile Summary Card */}
            <div className="mt-6 md:mt-0 bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-white to-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-700 to-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(user?.first_name || user?.username)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.first_name || user?.username}</h3>
                  <p className="text-blue-100">{user?.email}</p>
                  <div className="mt-2">
                    <Link
                      to="/profile"
                      className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Rooms</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRooms}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-2xl">🏨</span>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/rooms" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Rooms →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Now</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.availableRooms}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/rooms" className="text-green-600 hover:text-green-800 text-sm font-medium">
                Book Now →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Bookings</p>
                <h3 className="text-3xl font-bold text-orange-600 mt-2">{stats.activeBookings}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-2xl">📅</span>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/bookings" className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                Manage Bookings →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Revenue</p>
                <h3 className="text-3xl font-bold text-purple-600 mt-2">${stats.totalRevenue}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                View Reports →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/book-room"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">➕</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Book a Room</h3>
                <p className="text-sm text-gray-600">Make a new reservation</p>
              </div>
            </Link>

            <Link
              to="/food-menu"
              className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Order Food</h3>
                <p className="text-sm text-gray-600">Browse menu & order</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Update Profile</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            <Link to="/activity" className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          
          {user?.role === 'admin' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  User
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600">🏨</span>
                  </div>
                  <div>
                    <p className="font-medium">Room booking confirmed</p>
                    <p className="text-sm text-gray-600">5 hours ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  Booking
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No recent activity</h3>
              <p className="text-gray-500 mb-4">Your activity will appear here once you start using the system</p>
              <Link
                to="/book-room"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Book Your First Room
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;