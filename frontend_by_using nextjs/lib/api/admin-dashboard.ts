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
  // ✅ Get available rooms - THIS WORKS WITH YOUR BACKEND
  getAvailableRooms: async () => {
    const response = await api.get('/rooms/available');
    return response.data?.data || [];
  },

  // ✅ Get all rooms - THIS USES THE WORKING ENDPOINT
  // Since your backend doesn't have /rooms, we use /rooms/available for now
  getAllRooms: async () => {
    const response = await api.get('/rooms/available');
    return response.data?.data || [];
  },

  // ✅ Alias for backward compatibility
  getRooms: async () => {
    return adminApi.getAllRooms();
  },

  createRoom: async (roomData: any) => {
    const response = await api.post('/rooms', roomData);
    return response.data?.data || null;
  },

  updateRoom: async (roomId: string, roomData: any) => {
    const response = await api.patch(`/rooms/${roomId}`, roomData);
    return response.data?.data || null;
  },

  deleteRoom: async (roomId: string) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },

  searchRooms: async (param: string) => {
    const response = await api.get(`/rooms/search/${param}`);
    return response.data?.data || [];
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

  // ============= DASHBOARD STATISTICS =============
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [
        roomsRes,
        reservationsRes,
        roomStatsRes,
      ] = await Promise.allSettled([
        adminApi.getAllRooms(),  // ✅ Uses /rooms/available
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
      const rooms = await adminApi.getAllRooms()  // ✅ Uses /rooms/available
      
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