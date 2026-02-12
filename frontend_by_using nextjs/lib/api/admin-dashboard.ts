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

  // ============= ROOM MANAGEMENT =============
  // ✅ FIXED: Get available rooms with ALL required fields
  getAvailableRooms: async () => {
    const response = await api.get('/rooms/available');
    let rooms = response.data?.data || [];
    
    // ✅ Ensure EVERY room has ALL fields needed for the frontend
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

  // ✅ FIXED: Get all rooms with ALL required fields
  getAllRooms: async () => {
    const response = await api.get('/rooms/available');
    let rooms = response.data?.data || [];
    
    // ✅ Ensure EVERY room has ALL fields needed for the frontend
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

  // ✅ Alias for backward compatibility
  getRooms: async () => {
    return adminApi.getAllRooms();
  },

  // ✅ FIXED: Create room with ALL required fields
  createRoom: async (roomData: any) => {
    const response = await api.post('/rooms', roomData);
    
    // Get the created room data
    let createdRoom = response.data?.data || null;
    
    // ✅ CRITICAL FIX: Add ALL missing fields that frontend expects
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
      
      console.log('✅ Room created successfully:', createdRoom.room_number);
    }
    
    return createdRoom;
  },

  // ✅ FIXED: Update room with ALL required fields
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

  // ✅ Delete room
  deleteRoom: async (roomId: string) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },

  // ✅ FIXED: Search rooms with ALL required fields
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

  // ✅ Get room statistics
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

  // ============= DASHBOARD STATISTICS =============
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [
        roomsRes,
        reservationsRes,
        roomStatsRes,
      ] = await Promise.allSettled([
        adminApi.getAllRooms(),
        api.get('/room-orders', {
          params: { 
            check_in_from: new Date().toISOString().split('T')[0],
            check_in_to: new Date().toISOString().split('T')[0]
          }
        }),
        api.get('/rooms/stats/overview'),
      ])

      let availableRooms = 0
      let totalRooms = 0
      let occupiedRooms = 0
      
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
        foodItems: 0,
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

  // ============= FOOD MANAGEMENT =============
  getFoodItems: async () => {
    return []
  },

  getPendingOrders: async () => {
    return []
  },

  // ============= REVENUE & ANALYTICS =============
  getRevenueData: async (period: 'week' | 'month' | 'year' = 'week') => {
    return []
  }
}