import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user }) {
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
    alert("Admin profile update functionality will be implemented here");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Room images
  const roomImages = [
    { id: 1, name: "Deluxe Suite", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop", status: "Available", guests: 2 },
    { id: 2, name: "Executive Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop", status: "Occupied", guests: 1 },
    { id: 3, name: "Family Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", status: "Reserved", guests: 4 },
    { id: 4, name: "Standard Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop", status: "Maintenance", guests: 2 },
    { id: 5, name: "Presidential Suite", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop", status: "Available", guests: 4 },
  ];

  // Recent bookings
  const recentBookings = [
    { id: 1, guest: "Michael Guest", room: "Room 102", checkIn: "2024-02-01", checkOut: "2024-02-05", status: "Checked In", amount: "$499" },
    { id: 2, guest: "Jane Doe", room: "Room 202", checkIn: "2024-02-10", checkOut: "2024-02-14", status: "Confirmed", amount: "$599" },
    { id: 3, guest: "Bob Wilson", room: "Room 104", checkIn: "2024-02-02", checkOut: "2024-02-04", status: "Checked In", amount: "$399" },
    { id: 4, guest: "Sarah Johnson", room: "Room 201", checkIn: "2024-02-15", checkOut: "2024-02-20", status: "Pending", amount: "$699" },
  ];

  // Food orders
  const foodOrders = [
    { id: 1, room: "Room 104", items: 3, amount: "$117.96", status: "Preparing" },
    { id: 2, room: "Room 102", items: 2, amount: "$34.98", status: "Delivered" },
    { id: 3, room: "Room 201", items: 1, amount: "$16.99", status: "Pending" },
  ];

  // Recent users
  const recentUsers = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Guest", joined: "2 days ago" },
    { id: 2, name: "Maria Garcia", email: "maria@example.com", role: "Guest", joined: "1 week ago" },
    { id: 3, name: "David Smith", email: "david@example.com", role: "Guest", joined: "3 days ago" },
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
              <p className="text-xs text-gray-500">Admin Management System</p>
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
                { id: "dashboard", label: "Dashboard", icon: "📊" },
                { id: "rooms", label: "Rooms Management", icon: "🏨" },
                { id: "bookings", label: "Bookings", icon: "📅" },
                { id: "food-menu", label: "Food Menu", icon: "🍽️" },
                { id: "orders", label: "Food Orders", icon: "🛒" },
                { id: "users", label: "User Management", icon: "👥" },
                { id: "reports", label: "Reports", icon: "📈" },
                { id: "settings", label: "Settings", icon: "⚙️" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center
                    ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ADMIN PROFILE - Fixed at bottom */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-semibold text-white">
              {(user?.first_name?.[0] || user?.username?.[0] || "A").toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name || user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="space-y-2">
            <button
              onClick={handleProfileUpdate}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 rounded-lg transition text-sm font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, Administrator {user?.first_name || user?.username || ""}! Manage your hotel operations.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Rooms</h3>
                <p className="text-3xl font-bold mt-2">24</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-400/30 flex items-center justify-center">
                <span className="text-2xl">🏨</span>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-2">4 available • 18 occupied</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Active Bookings</h3>
                <p className="text-3xl font-bold mt-2">18</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-400/30 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <p className="text-green-100 text-sm mt-2">3 pending • 15 confirmed</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-3xl font-bold mt-2">$8,450</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-400/30 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-purple-100 text-sm mt-2">+15% from last month</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Guests</h3>
                <p className="text-3xl font-bold mt-2">42</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-400/30 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <p className="text-orange-100 text-sm mt-2">+8 new this week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => alert("Add new room feature")}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl">➕</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Add New Room</h3>
                <p className="text-sm text-gray-600">Add a new room to inventory</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => alert("Create booking feature")}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">📝</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Create Booking</h3>
                <p className="text-sm text-gray-600">Create new reservation</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => alert("Generate report feature")}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Generate Report</h3>
                <p className="text-sm text-gray-600">Generate monthly report</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.guest}</h3>
                      <p className="text-sm text-gray-600">{booking.room} • {booking.checkIn} to {booking.checkOut}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Checked In' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">{booking.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Room Status Overview</h2>
            
            <div className="space-y-6">
              {roomImages.map((room) => (
                <div key={room.id} className="flex items-center">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-4">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        room.status === 'Available' ? 'bg-green-100 text-green-800' :
                        room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                        room.status === 'Reserved' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {room.status}
                      </span>
                      <span className="text-sm text-gray-600">{room.guests} guests</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600">4</span>
                  </div>
                  <p className="text-xs text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600">18</span>
                  </div>
                  <p className="text-xs text-gray-600">Occupied</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-600">1</span>
                  </div>
                  <p className="text-xs text-gray-600">Reserved</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600">1</span>
                  </div>
                  <p className="text-xs text-gray-600">Maintenance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Food Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Pending Food Orders</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {foodOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{order.room}</h3>
                      <p className="text-sm text-gray-600">{order.items} items • {order.amount}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">
                      {user.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Gondar Hotel Admin Panel
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Version 2.0.0 • Last updated: Today
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                Help
              </button>
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                Documentation
              </button>
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                Support
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;