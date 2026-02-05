import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropDown from './profileDropDown';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
      'bg-indigo-500', 'bg-indigo-600',
      'bg-violet-500', 'bg-violet-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Hotel Manager</h1>
                <p className="text-sm text-gray-600">Professional Hotel Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-blue-600 font-medium">
              Rooms
            </Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 font-medium">
              My Bookings
            </Link>
            <Link to="/food-menu" className="text-gray-700 hover:text-blue-600 font-medium">
              Food Menu
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:block text-right">
                  <p className="font-medium text-gray-800">
                    Welcome, <span className="text-blue-600">{user.first_name || user.username}</span>
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                </div>
                
                {/* Profile Icon with Dropdown */}
                <ProfileDropDown user={user} />
                
                {/* Profile Icon (Circle) */}
                <div className="relative">
                  <div className={`w-10 h-10 ${getRandomColor()} rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity`}>
                    {getInitials(user.first_name || user.username)}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;