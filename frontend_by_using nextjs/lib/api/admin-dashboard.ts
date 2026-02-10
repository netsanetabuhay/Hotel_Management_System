const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types based on your backend
export interface FoodItem {
  food_id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  created_at?: string;
}

export interface Room {
  room_id: string;
  room_number: string;
  room_type: string;
  price: number;
  description: string | null;
  image_url: string | null;
  status: string;
  created_at?: string;
}

export interface DashboardStats {
  totalUsers: number;
  availableRooms: number;
  foodItems: number;
  pendingOrders: number;
  totalRevenue: number;
  todayReservations: number;
}

export interface UploadResponse {
  success: boolean;
  data: {
    filename: string;
    originalname: string;
    image_url: string;
    size: number;
    mimetype: string;
  };
}
  // Dashboard Stats

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (token: string): Promise<DashboardStats> => {
    try {
      // Fetch all necessary data from backend
      const [availableRoomsRes, allRoomsRes, foodRes, reservationsRes, ordersRes] = await Promise.all([
        // Available rooms for users (current date)
        fetch(`${API_URL}/rooms/available`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        // All rooms for admin
        fetch(`${API_URL}/rooms`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        // Food items
        fetch(`${API_URL}/food-items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        // Reservations
        fetch(`${API_URL}/room-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        // Food orders
        fetch(`${API_URL}/food-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const availableRoomsData = await availableRoomsRes.json();
      const allRoomsData = await allRoomsRes.json();
      const foodData = await foodRes.json();
      const reservationsData = await reservationsRes.json();
      const ordersData = await ordersRes.json();

      const today = new Date().toISOString().split('T')[0];
      
      // Calculate today's reservations
      let todayReservations = 0;
      if (reservationsData.success && Array.isArray(reservationsData.data)) {
        todayReservations = reservationsData.data.filter((res: any) => {
          const checkInDate = new Date(res.check_in).toISOString().split('T')[0];
          return checkInDate === today;
        }).length;
      }

      // Calculate available rooms
      let availableRooms = 0;
      if (availableRoomsData.success && Array.isArray(availableRoomsData.data)) {
        availableRooms = availableRoomsData.data.length;
      } else if (allRoomsData.success && Array.isArray(allRoomsData.data)) {
        // Fallback: count rooms with status 'available'
        availableRooms = allRoomsData.data.filter((room: any) => 
          room.status === 'available' || room.current_status === 'available'
        ).length;
      }

      return {
        totalUsers: 0, // You'll need to create a users count endpoint
        availableRooms,
        foodItems: foodData.success && Array.isArray(foodData.data) ? foodData.data.length : 0,
        pendingOrders: ordersData.success && Array.isArray(ordersData.data) ? 
          ordersData.data.filter((order: any) => 
            order.order_status === 'pending'
          ).length : 0,
        totalRevenue: 0, // You'll need a revenue calculation endpoint
        todayReservations
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Food Items
  getFoodItems: async (token: string): Promise<FoodItem[]> => {
    try {
      const response = await fetch(`${API_URL}/food-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch food items');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching food items:', error);
      throw error;
    }
  },

  createFoodItem: async (foodItem: Omit<FoodItem, 'food_id' | 'created_at'>, token: string): Promise<FoodItem> => {
    try {
      const response = await fetch(`${API_URL}/food-items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(foodItem)
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create food item');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating food item:', error);
      throw error;
    }
  },

  updateFoodItem: async (id: string, updates: Partial<FoodItem>, token: string): Promise<FoodItem> => {
    try {
      const response = await fetch(`${API_URL}/food-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update food item');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  },

  deleteFoodItem: async (id: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/food-items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete food item');
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  },

  getFoodCategories: async (token: string): Promise<string[]> => {
    try {
      const response = await fetch(`${API_URL}/food-items/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch categories');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Rooms
  getRooms: async (token: string): Promise<Room[]> => {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch rooms');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  createRoom: async (room: Omit<Room, 'room_id' | 'created_at'>, token: string): Promise<Room> => {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create room');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  updateRoom: async (id: string, updates: Partial<Room>, token: string): Promise<Room> => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update room');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  deleteRoom: async (id: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  // Image Upload
  uploadImage: async (file: File, uploadType: 'food' | 'rooms', token: string): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('uploadType', uploadType);

      const response = await fetch(`${API_URL}/uploads/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  deleteImage: async (filename: string, type: 'food' | 'rooms' = 'food', token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/uploads/${filename}?type=${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};