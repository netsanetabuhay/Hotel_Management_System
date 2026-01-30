import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: "Guest" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Map backend field names to frontend
        setUser({
          ...userData,
          name: userData.first_name + ' ' + (userData.last_name || '')
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser({ first_name: "Guest", name: "Guest" });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const displayName = user.name || user.first_name || "Guest";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-xl">HotelPro</div>
          <div className="space-x-4 flex items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            {displayName === "Guest" ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
              </>
            ) : (
              <>
                <span className="text-green-600">Welcome, {user.first_name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {displayName}!</h1>
        <p className="text-gray-600 mb-8">Hotel Management System</p>
        
        {displayName === "Guest" ? (
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started - Register
            </Link>
            <Link 
              to="/login" 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Login to Account
            </Link>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-600">You're logged in!</h2>
            <div className="text-left mb-4">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
              <Link 
                to="/dashboard" 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;