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

export const adminApi = {
  // Dashboard Stats
//   getDashboardStats: async (token: string): Promise<DashboardStats> => {
//     try {
//       // Fetch multiple endpoints to get stats
//       const [roomsRes, foodRes, reservationsRes, ordersRes] = await Promise.all([
//         fetch(`${API_URL}/rooms/stats/rooms`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/food-items`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/room-orders`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/food-orders`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       const roomsData = await roomsRes.json();
//       const foodData = await foodRes.json();
//       const reservationsData = await reservationsRes.json();
//       const ordersData = await ordersRes.json();

//       const today = new Date().toISOString().split('T')[0];
//       const todayReservations = reservationsData.data?.filter((res: any) => 
//         res.check_in === today
//       ).length || 0;

//       return {
//         totalUsers: 0, // Need a users endpoint
//         availableRooms: roomsData.data?.available || 0,
//         foodItems: foodData.data?.length || 0,
//         pendingOrders: ordersData.data?.filter((order: any) => 
//           order.order_status === 'pending'
//         ).length || 0,
//         totalRevenue: 0, // Need revenue endpoint
//         todayReservations
//       };
//     } catch (error) {
//       console.error('Error fetching dashboard stats:', error);
//       throw error;
//     }
//   },
getDashboardStats: async (token: string): Promise<DashboardStats> => {
    try {
      // Fetch available rooms directly
      const roomsRes = await fetch(`${API_URL}/rooms/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch other data
      const [foodRes, reservationsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/food-items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/room-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/food-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const roomsData = await roomsRes.json();
      const foodData = await foodRes.json();
      const reservationsData = await reservationsRes.json();
      const ordersData = await ordersRes.json();

      const today = new Date().toISOString().split('T')[0];
      const todayReservations = reservationsData.data?.filter((res: any) => 
        res.check_in === today
      ).length || 0;

      return {
        totalUsers: 0, // Need a users endpoint
        availableRooms: Array.isArray(roomsData.data) ? roomsData.data.length : 0,
        foodItems: Array.isArray(foodData.data) ? foodData.data.length : 0,
        pendingOrders: Array.isArray(ordersData.data) ? ordersData.data.filter((order: any) => 
          order.order_status === 'pending'
        ).length : 0,
        totalRevenue: 0, // Need revenue endpoint
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