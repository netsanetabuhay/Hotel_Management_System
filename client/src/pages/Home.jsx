import { Link } from 'react-router-dom';

function Home() {
  // 10 Room images with working Unsplash links
  const roomImages = [
    { id: 1, name: "Deluxe Suite", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop", price: "$199/night" },
    { id: 2, name: "Executive Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop", price: "$159/night" },
    { id: 3, name: "Family Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", price: "$229/night" },
    { id: 4, name: "Standard Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop", price: "$129/night" },
    { id: 5, name: "Presidential Suite", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop", price: "$399/night" },
    { id: 6, name: "Ocean View Room", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", price: "$249/night" },
    { id: 7, name: "Garden View Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&auto=format", price: "$179/night" },
    { id: 8, name: "Business Suite", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop&auto=format", price: "$279/night" },
    { id: 9, name: "Honeymoon Suite", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&auto=format", price: "$349/night" },
    { id: 10, name: "Accessible Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format", price: "$149/night" },
  ];

  // 10 Food images with working Unsplash links
  const foodImages = [
    { id: 1, name: "Pasta Carbonara", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop", price: "$16.99" },
    { id: 2, name: "Grilled Salmon", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", price: "$24.99" },
    { id: 3, name: "Caesar Salad", image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=400&h=300&fit=crop", price: "$12.99" },
    { id: 4, name: "Chocolate Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", price: "$8.99" },
    { id: 5, name: "Beef Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", price: "$14.99" },
    { id: 6, name: "Fruit Platter", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", price: "$10.99" },
    { id: 7, name: "Pizza Margherita", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", price: "$18.99" },
    { id: 8, name: "Chicken Curry", image: "https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400&h=300&fit=crop", price: "$19.99" },
    { id: 9, name: "Vegetable Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop", price: "$9.99" },
    { id: 10, name: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop", price: "$6.99" },
  ];

  const handleBookClick = (roomName) => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      // Redirect to login
      window.location.href = '/login';
    } else {
      // Show booking modal or redirect to booking page
      alert(`Booking ${roomName} - Please login to continue`);
    }
  };

  const handleOrderClick = (foodName) => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      // Redirect to login
      window.location.href = '/login';
    } else {
      // Show order modal or redirect to order page
      alert(`Ordering ${foodName} - Please login to continue`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Welcome to Gondar Hotel
              </h1>
              <p className="text-lg mb-6 text-blue-100">
                Experience luxury and comfort at Ethiopia's premier hotel destination. 
                Your perfect stay awaits with world-class amenities and service.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/rooms"
                  className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition duration-300"
                >
                  View Rooms
                </Link>
                <Link
                  to="/food-menu"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-300"
                >
                  View Menu
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop"
                alt="Luxury Hotel"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Available Rooms Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Available Rooms</h2>
              <p className="text-gray-600 mt-2">Choose from our premium selection of rooms and suites</p>
            </div>
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login to Book →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {roomImages.map((room) => (
              <div 
                key={room.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    AVAILABLE
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{room.name}</h3>
                    <span className="text-blue-600 font-bold">{room.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Luxurious room with premium amenities</p>
                  <button
                    onClick={() => handleBookClick(room.name)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Food Menu Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Food Menu</h2>
              <p className="text-gray-600 mt-2">Delicious dishes prepared by our expert chefs</p>
            </div>
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login to Order →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {foodImages.map((food) => (
              <div 
                key={food.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                    AVAILABLE
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{food.name}</h3>
                    <span className="text-green-600 font-bold">{food.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Delicious meal prepared fresh daily</p>
                  <button
                    onClick={() => handleOrderClick(food.name)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
            <p className="text-blue-100 mb-6">
              Join thousands of satisfied guests who have experienced the Gondar Hotel difference. 
              Book your stay or order from our restaurant today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition duration-300"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-300"
              >
                Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white text-xl mb-4">Gondar Hotel</h3>
              <p className="text-gray-300 text-sm mb-4">
                Experience luxury and comfort at Gondar Hotel. Your perfect stay destination in Ethiopia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/rooms" className="hover:text-white">Rooms</Link></li>
                <li><Link to="/food-menu" className="hover:text-white">Food Menu</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
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
                  className="flex-1 px-3 py-2 rounded-l-lg text-gray-800 text-sm focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-sm font-medium transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Gondar Hotel. All rights reserved. | 
              <Link to="/privacy" className="ml-2 hover:text-white">Privacy Policy</Link> | 
              <Link to="/terms" className="ml-2 hover:text-white">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;