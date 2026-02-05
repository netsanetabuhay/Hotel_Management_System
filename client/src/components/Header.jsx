import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Generate avatar URL based on username
  const getAvatarUrl = () => {
    if (user.profileImage) {
      return user.profileImage;
    }
    // Fallback to avatar service
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=10B981&color=fff&size=128&bold=true&font-size=0.5`;
  };

  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold">
              Hotel Management
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="hover:text-green-200">
                Home
              </Link>
              <Link to="/rooms" className="hover:text-green-200">
                Rooms
              </Link>
              <Link to="/orders" className="hover:text-green-200">
                Orders
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && user.username ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img 
                    src={getAvatarUrl()}
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=10B981&color=fff`;
                    }}
                  />
                  <span className="hidden md:inline">{user.username}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 group-hover:delay-100">
                  <div className="flex items-center px-4 py-2 border-b">
                    <img 
                      src={getAvatarUrl()}
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="text-sm text-gray-800 font-semibold">{user.username}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <div className="border-t mt-1">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;