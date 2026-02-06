import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from '../api/Axios';

function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await Axios.get('/rooms');
      if (response.data.success) {
        setRooms(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomId) => {
    toast.info(`Booking room ${roomId} - Feature coming soon!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Rooms</h1>
            <p className="text-gray-600 mt-2">Browse and book available rooms</p>
          </div>
          <button
            onClick={() => toast.info('Add room feature coming soon!')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="relative h-48">
                  <img 
                    src={room.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {room.status || 'Available'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <span className="text-lg font-bold text-blue-600">${room.price}/night</span>
                  </div>
                  <p className="text-gray-600 mb-4">{room.description || 'Luxurious room with premium amenities'}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">👤</span>
                      <span className="text-sm">Max {room.capacity || 2} guests</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">🛏️</span>
                      <span className="text-sm">{room.beds || '1 Queen bed'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookRoom(room.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No rooms available</h3>
              <p className="text-gray-500">Check back later or contact reception</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rooms;