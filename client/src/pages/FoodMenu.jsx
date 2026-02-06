import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Axios from '../api/Axios';

function FoodMenu() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await Axios.get('/food-items');
      if (response.data.success) {
        setFoodItems(response.data.data || []);
      }
    } catch (error) {
      // For demo, use sample data
      setFoodItems([
        { id: 1, name: "Pasta Carbonara", category: "main", price: 16.99, description: "Creamy pasta with bacon" },
        { id: 2, name: "Grilled Salmon", category: "main", price: 24.99, description: "Fresh salmon with herbs" },
        { id: 3, name: "Caesar Salad", category: "salad", price: 12.99, description: "Fresh salad with dressing" },
        { id: 4, name: "Chocolate Cake", category: "dessert", price: 8.99, description: "Rich chocolate dessert" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (foodItem) => {
    toast.info(`Ordering ${foodItem.name} - Feature coming soon!`);
  };

  const categories = ['all', 'main', 'appetizer', 'salad', 'dessert', 'drink'];
  
  const filteredItems = selectedCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Food Menu</h1>
          <p className="text-gray-600 mt-2">Delicious dishes prepared by our expert chefs</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All Items' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${item.id + 156337900}?w=400&h=300&fit=crop`}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize mt-1">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button
                    onClick={() => handleOrder(item)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No items in this category</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodMenu;