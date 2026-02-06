import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileUpdate = () => {
    alert("Profile update functionality will be implemented here");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // 10 Room images with working Unsplash links
  const roomImages = [
    { id: 1, name: "Deluxe Suite", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop" },
    { id: 2, name: "Executive Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop" },
    { id: 3, name: "Family Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
    { id: 4, name: "Standard Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop" },
    { id: 5, name: "Presidential Suite", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop" },
    { id: 6, name: "Ocean View Room", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
    { id: 7, name: "Garden View Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&auto=format" },
    { id: 8, name: "Business Suite", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop&auto=format" },
    { id: 9, name: "Honeymoon Suite", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&auto=format" },
    { id: 10, name: "Accessible Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format" },
  ];

  // 10 Food images with working Unsplash links
  const foodImages = [
    { id: 1, name: "Pasta Carbonara", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop" },
    { id: 2, name: "Grilled Salmon", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop" },
    { id: 3, name: "Caesar Salad", image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=400&h=300&fit=crop" },
    { id: 4, name: "Chocolate Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
    { id: 5, name: "Beef Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
    { id: 6, name: "Fruit Platter", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
    { id: 7, name: "Pizza Margherita", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
    { id: 8, name: "Chicken Curry", image: "https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400&h=300&fit=crop" },
    { id: 9, name: "Vegetable Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop" },
    { id: 10, name: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* LEFT SIDEBAR - Fixed position with toggle functionality */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300
        w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen z-40 lg:relative
      `}>
        <div className="flex-1 overflow-y-auto">
          {/* Hotel Logo with Hamburger Menu */}
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="font-bold text-blue-700 text-lg">Gondar Hotel</h2>
              <p className="text-xs text-gray-500">Welcome to Your Stay Experience</p>
            </div>
            {/* Hamburger Menu Icon inside sidebar for desktop */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:block hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Navigation</h3>
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "rooms", label: "Rooms" },
                { id: "food-menu", label: "Food Menu" },
                { id: "my-orders", label: "My Orders" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium
                    ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* USER PROFILE - Fixed at bottom */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-white">
              N
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Netsanet
              </p>
              <p className="text-xs text-gray-500">Guest</p>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="space-y-2">
            <button
              onClick={handleProfileUpdate}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition text-sm font-medium"
            >
              Update Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT - Scrollable with smaller gap when sidebar hidden */}
      <main className={`flex-1 p-6 md:p-8 overflow-y-auto h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.first_name || user?.username || "Netsanet"}! Manage your bookings and orders here.
          </p>
          
          {/* Removed the Available, Maintenance, Occupied section as requested */}
        </div>

        {/* Stats Section - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Available Rooms */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Rooms</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">4</div>
              <div className="space-y-1">
                <p className="text-gray-600">Ready for booking now</p>
                <p className="text-sm text-gray-500">Click below to view all rooms</p>
              </div>
            </div>
          </div>

          {/* Active Reservations */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">My Reservations</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">2</div>
              <div className="space-y-1">
                <p className="text-gray-600">1 pending confirmation</p>
                <p className="text-sm text-gray-500">Manage your bookings</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Orders</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">2</div>
              <div className="space-y-1">
                <p className="text-gray-600">Food orders</p>
                <p className="text-sm text-gray-500">Track your orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300" />

        {/* Food Menu Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Food Menu</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {foodImages.map((food) => (
              <div 
                key={food.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 group hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">{food.name}</h3>
                  <button className="w-full bg-white border border-blue-600 text-blue-600 py-1.5 rounded text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors duration-300">
                    Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Gallery Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Rooms</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {roomImages.map((room) => (
              <div 
                key={room.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 group hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">{room.name}</h3>
                  <button className="w-full bg-white border border-blue-600 text-blue-600 py-1.5 rounded text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors duration-300">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 bg-gray-800 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Gondar Hotel</h3>
              <p className="text-gray-300 text-sm mb-4">
                Experience luxury and comfort at Gondar Hotel. Your perfect stay destination.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white">Home</button></li>
                <li><button className="hover:text-white">Rooms</button></li>
                <li><button className="hover:text-white">Services</button></li>
                <li><button className="hover:text-white">About Us</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+251 91 234 5678</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>info@gondarhotel.com</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Gondar, Ethiopia</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Newsletter</h3>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to get special offers and updates
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 rounded-l-lg text-gray-800 text-sm"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Gondar Hotel. All rights reserved. | 
              <button className="ml-2 hover:text-white">Privacy Policy</button> | 
              <button className="ml-2 hover:text-white">Terms of Service</button>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default UserDashboard;