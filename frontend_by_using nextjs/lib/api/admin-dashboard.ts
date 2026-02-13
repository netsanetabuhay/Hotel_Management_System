import api from '../axios'

export interface DashboardStats {
  totalUsers: number
  availableRooms: number
  foodItems: number
  pendingOrders: number
  totalRevenue: number
  todayReservations: number
  occupancyRate: number
  recentActivities: Activity[]
  totalRooms: number
  occupiedRooms: number
}

export interface Activity {
  id: string
  type: 'reservation' | 'order' | 'user' | 'payment'
  description: string
  timestamp: string
  status: string
}

export interface RoomStatus {
  total: number
  available: number
  occupied: number
  maintenance: number
  cleaning: number
}

// ✅ Add FoodItem interface
export interface FoodItem {
  food_id: string
  name: string
  category: string
  price: number
  description: string | null
  image_url: string | null
}

export const adminApi = {
  // ============= USER MANAGEMENT =============
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data?.data || [];
  },

  createUser: async (userData: any) => {
    const response = await api.post('/users/register', userData);
    return response.data?.data || null;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data?.data || null;
  },


//  FOOD ORDERS MANAGEMENT (ADMIN ONLY) 

// ✅ Get all food orders with filters
getFoodOrders: async (filters?: any) => {
  try {
    const response = await api.get('/food-orders', { params: filters });
    // Your backend returns { success: true, message: "...", data: [...] }
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching food orders:', error);
    return [];
  }
},

// ✅ Get food order statistics
getFoodOrderStats: async () => {
  try {
    const response = await api.get('/food-orders/stats/overview');
    // Your backend returns { success: true, message: "...", data: {...} }
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching food order stats:', error);
    return null;
  }
},

// ✅ Update food order status (admin only)
updateFoodOrderStatus: async (orderId: string, status: string) => {
  try {
    const response = await api.patch(`/food-orders/${orderId}`, { 
      order_status: status 
    });
    return response.data?.data || null;
  } catch (error) {
    console.error('Error updating food order:', error);
    throw error;
  }
},

// ✅ Update food order payment status (admin only)
updateFoodOrderPayment: async (orderId: string, paymentStatus: string) => {
  try {
    const response = await api.patch(`/food-orders/${orderId}`, { 
      payment_status: paymentStatus 
    });
    return response.data?.data || null;
  } catch (error) {
    console.error('Error updating food order payment:', error);
    throw error;
  }
},

// ✅ Delete food order (admin only)
deleteFoodOrder: async (orderId: string) => {
  try {
    const response = await api.delete(`/food-orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting food order:', error);
    throw error;
  }
},

  //  ROOM MANAGEMENT 
  getAvailableRooms: async () => {
    const response = await api.get('/rooms/available');
    let rooms = response.data?.data || [];
    
    rooms = rooms.map((room: any) => ({
      room_id: room.room_id,
      room_number: room.room_number,
      room_type: room.room_type,
      price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
      image_url: room.image_url || null,
      status: room.status || 'available',
      current_status: room.current_status || room.status || 'available'
    }));
    
    return rooms;
  },

  getAllRooms: async () => {
    const response = await api.get('/rooms/available');
    let rooms = response.data?.data || [];
    
    rooms = rooms.map((room: any) => ({
      room_id: room.room_id,
      room_number: room.room_number,
      room_type: room.room_type,
      price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
      image_url: room.image_url || null,
      status: room.status || 'available',
      current_status: room.current_status || room.status || 'available'
    }));
    
    return rooms;
  },

  getRooms: async () => {
    return adminApi.getAllRooms();
  },

  createRoom: async (roomData: any) => {
    const response = await api.post('/rooms', roomData);
    
    let createdRoom = response.data?.data || null;
    
    if (createdRoom) {
      createdRoom = {
        room_id: createdRoom.room_id,
        room_number: createdRoom.room_number,
        room_type: createdRoom.room_type,
        price: typeof createdRoom.price === 'string' ? parseFloat(createdRoom.price) : createdRoom.price,
        image_url: createdRoom.image_url || null,
        status: createdRoom.status || 'available',
        current_status: createdRoom.current_status || createdRoom.status || 'available'
      };
    }
    
    return createdRoom;
  },

  updateRoom: async (roomId: string, roomData: any) => {
    const response = await api.patch(`/rooms/${roomId}`, roomData);
    
    let updatedRoom = response.data?.data || null;
    
    if (updatedRoom) {
      updatedRoom = {
        room_id: updatedRoom.room_id,
        room_number: updatedRoom.room_number,
        room_type: updatedRoom.room_type,
        price: typeof updatedRoom.price === 'string' ? parseFloat(updatedRoom.price) : updatedRoom.price,
        image_url: updatedRoom.image_url || null,
        status: updatedRoom.status || 'available',
        current_status: updatedRoom.current_status || updatedRoom.status || 'available'
      };
    }
    
    return updatedRoom;
  },

  deleteRoom: async (roomId: string) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },

  searchRooms: async (param: string) => {
    const response = await api.get(`/rooms/search/${param}`);
    let rooms = response.data?.data || [];
    
    rooms = rooms.map((room: any) => ({
      room_id: room.room_id,
      room_number: room.room_number,
      room_type: room.room_type,
      price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
      image_url: room.image_url || null,
      status: room.status || 'available',
      current_status: room.current_status || room.status || 'available'
    }));
    
    return rooms;
  },

  getRoomStats: async () => {
    const response = await api.get('/rooms/stats/overview');
    return response.data?.data || null;
  },

  // ============= RESERVATION MANAGEMENT =============
  getReservations: async (filters?: any) => {
    const response = await api.get('/room-orders', { params: filters });
    return response.data?.data || [];
  },

  createReservation: async (reservationData: any) => {
    const response = await api.post('/room-orders', reservationData);
    return response.data?.data || null;
  },

  updateReservation: async (reservationId: string, data: any) => {
    const response = await api.patch(`/room-orders/${reservationId}`, data);
    return response.data?.data || null;
  },

  deleteReservation: async (reservationId: string) => {
    const response = await api.delete(`/room-orders/${reservationId}`);
    return response.data;
  },

  getReservationStats: async () => {
    const response = await api.get('/room-orders/stats/overview');
    return response.data?.data || null;
  },

  // ============= FOOD MANAGEMENT =============
  // ✅ FIXED: Get all food items - matches your backend
  // ============= FOOD MANAGEMENT =============
getFoodItems: async (): Promise<FoodItem[]> => {
  try {
    const response = await api.get('/food-items');
    let items = response.data?.data || [];
    
    // ✅ Convert price from string to number
    items = items.map((item: any) => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
    }));
    
    return items;
  } catch (error) {
    console.error('Error fetching food items:', error);
    return [];
  }
},


// //get food orders
// getFoodOrders: async (filters?: any) => {
//   try {
//     const response = await api.get('/food-orders', { params: filters });
//     return response.data?.data || [];
//   } catch (error) {
//     console.error('Error fetching food orders:', error);
//     return [];
//   }
// },
// //
// getFoodOrderStats: async () => {
//   try {
//     const response = await api.get('/food-orders/stats/overview');
//     return response.data?.data || null;
//   } catch (error) {
//     console.error('Error fetching food order stats:', error);
//     return null;
//   }
// },

// updateFoodOrderStatus: async (orderId: string, status: string) => {
//   try {
//     const response = await api.patch(`/food-orders/${orderId}`, { order_status: status });
//     return response.data?.data || null;
//   } catch (error) {
//     console.error('Error updating food order:', error);
//     throw error;
//   }
// },

  // ✅ FIXED: Get food categories - matches your backend
 getFoodCategories: async (): Promise<string[]> => {
  try {
    const response = await api.get('/food-items/categories');
    // Your backend returns { success: true, message: "...", data: [...] }
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching food categories:', error);
    return [];
  }
},

  // ✅ FIXED: Create food item (admin only)
  createFoodItem: async (foodData: any): Promise<FoodItem | null> => {
    try {
      const response = await api.post('/food-items', foodData);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error creating food item:', error);
      throw error;
    }
  },

  // ✅ FIXED: Update food item (admin only)
  updateFoodItem: async (foodId: string, foodData: any): Promise<FoodItem | null> => {
    try {
      const response = await api.patch(`/food-items/${foodId}`, foodData);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  },

  // ✅ FIXED: Delete food item (admin only)
  deleteFoodItem: async (foodId: string) => {
    try {
      const response = await api.delete(`/food-items/${foodId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  },

  // ✅ FIXED: Upload image
  uploadImage: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ============= DASHBOARD STATISTICS =============
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [
        roomsRes,
        reservationsRes,
        roomStatsRes,
        foodItemsRes
      ] = await Promise.allSettled([
        adminApi.getAllRooms(),
        api.get('/room-orders', {
          params: { 
            check_in_from: new Date().toISOString().split('T')[0],
            check_in_to: new Date().toISOString().split('T')[0]
          }
        }),
        api.get('/rooms/stats/overview'),
        adminApi.getFoodItems() // ✅ Add food items count to dashboard
      ])

      let availableRooms = 0
      let totalRooms = 0
      let occupiedRooms = 0
      let foodItemsCount = 0
      
      if (roomsRes.status === 'fulfilled') {
        const rooms = roomsRes.value || []
        totalRooms = rooms.length
        
        availableRooms = rooms.filter((room: any) => 
          room.status === 'available' && room.current_status === 'available'
        ).length
        
        occupiedRooms = rooms.filter((room: any) => 
          room.status === 'booked' || 
          room.current_status === 'booked' ||
          room.status === 'occupied' || 
          room.current_status === 'occupied'
        ).length
      }

      if (foodItemsRes.status === 'fulfilled') {
        foodItemsCount = foodItemsRes.value?.length || 0;
      }

      let todayReservations = 0
      if (reservationsRes.status === 'fulfilled' && reservationsRes.value.data?.success) {
        const reservations = reservationsRes.value.data.data || []
        todayReservations = reservations.length
      }

      const occupancyRate = totalRooms > 0 
        ? Math.round((occupiedRooms / totalRooms) * 100) 
        : 0

      return {
        totalUsers: 0,
        availableRooms: availableRooms,
        foodItems: foodItemsCount, // ✅ Now shows real food items count
        pendingOrders: 0,
        totalRevenue: 0,
        todayReservations: todayReservations,
        occupancyRate: occupancyRate,
        recentActivities: [],
        totalRooms: totalRooms,
        occupiedRooms: occupiedRooms
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  getRoomStatus: async (): Promise<RoomStatus> => {
    try {
      const rooms = await adminApi.getAllRooms()
      
      return {
        total: rooms.length,
        available: rooms.filter((r: any) => 
          r.status === 'available' && r.current_status === 'available'
        ).length,
        occupied: rooms.filter((r: any) => 
          r.status === 'booked' || 
          r.current_status === 'booked' ||
          r.status === 'occupied' || 
          r.current_status === 'occupied'
        ).length,
        maintenance: rooms.filter((r: any) => 
          r.status === 'maintenance' || r.current_status === 'maintenance'
        ).length,
        cleaning: rooms.filter((r: any) => 
          r.status === 'cleaning' || r.current_status === 'cleaning'
        ).length
      }
    } catch (error) {
      console.error('Error fetching room status:', error)
      throw error
    }
  },

  // ============= PENDING ORDERS =============
  getPendingOrders: async () => {
    return []
  },

  // ============= REVENUE & ANALYTICS =============
  getRevenueData: async (period: 'week' | 'month' | 'year' = 'week') => {
    return []
  }
}