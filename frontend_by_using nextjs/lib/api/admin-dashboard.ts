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
  // ✅ Get all users - NO TOKEN PARAMETER
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data?.data || [];
  },

  // ✅ Create user - NO TOKEN PARAMETER
  createUser: async (userData: any) => {
    const response = await api.post('/users/register', userData);
    return response.data?.data || null;
  },

  // ✅ Delete user - NO TOKEN PARAMETER
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // ✅ Update user - NO TOKEN PARAMETER
  updateUser: async (userId: string, userData: any) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data?.data || null;
  },

  // ✅ Get dashboard stats - NO TOKEN PARAMETER, NO MANUAL HEADERS
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch all data in parallel - NO headers, NO token!
      const [
        roomsRes,
        reservationsRes,
        roomStatsRes,
        reservationStatsRes
      ] = await Promise.allSettled([
        api.get('/rooms'), 
        api.get('/room-orders', {
          params: { 
            check_in_from: new Date().toISOString().split('T')[0],
            check_in_to: new Date().toISOString().split('T')[0]
          }
        }),
        api.get('/rooms/stats/overview'),
        api.get('/room-orders/stats/overview')
      ])

      // Parse ALL rooms response
      let availableRooms = 0
      let totalRooms = 0
      let occupiedRooms = 0
      
      if (roomsRes.status === 'fulfilled' && roomsRes.value.data?.success) {
        const rooms = roomsRes.value.data.data || []
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
        
        console.log('✅ /api/rooms - Total rooms:', totalRooms)
        console.log('✅ /api/rooms - Available rooms:', availableRooms)
        console.log('✅ /api/rooms - Occupied rooms:', occupiedRooms)
      }

      // Parse today's reservations
      let todayReservations = 0
      if (reservationsRes.status === 'fulfilled' && reservationsRes.value.data?.success) {
        const reservations = reservationsRes.value.data.data || []
        todayReservations = reservations.length
      }

      // Parse room stats
      let roomStats = {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        cleaning: 0
      }
      
      if (roomStatsRes.status === 'fulfilled' && roomStatsRes.value.data?.success) {
        const statsData = roomStatsRes.value.data.data
        if (statsData?.roomStats) {
          roomStats = statsData.roomStats
        }
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
        recentActivities: []
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // ✅ Get room status - NO TOKEN PARAMETER, NO MANUAL HEADERS
  getRoomStatus: async (): Promise<RoomStatus> => {
    try {
      const response = await api.get('/rooms')
      
      if (response.data?.success) {
        const rooms = response.data.data || []
        
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
      }
      
      return {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        cleaning: 0
      }
    } catch (error) {
      console.error('Error fetching room status:', error)
      throw error
    }
  },

  // ✅ Get all rooms - NO TOKEN PARAMETER
  getRooms: async () => {
    const response = await api.get('/rooms')
    return response.data?.data || []
  },

  // ✅ Create room - NO TOKEN PARAMETER
  createRoom: async (roomData: any) => {
    const response = await api.post('/rooms', roomData)
    return response.data?.data || null
  },

  // ✅ Update room - NO TOKEN PARAMETER
  updateRoom: async (roomId: string, roomData: any) => {
    const response = await api.patch(`/rooms/${roomId}`, roomData)
    return response.data?.data || null
  },

  // ✅ Delete room - NO TOKEN PARAMETER
  deleteRoom: async (roomId: string) => {
    const response = await api.delete(`/rooms/${roomId}`)
    return response.data
  },

  // ✅ Search rooms - NO TOKEN PARAMETER
  searchRooms: async (param: string) => {
    const response = await api.get(`/rooms/search/${param}`)
    return response.data?.data || []
  },

  // ✅ Get all reservations - NO TOKEN PARAMETER
  getReservations: async (filters?: any) => {
    const response = await api.get('/room-orders', { params: filters })
    return response.data?.data || []
  },

  // ✅ Get reservation statistics - NO TOKEN PARAMETER
  getReservationStats: async () => {
    const response = await api.get('/room-orders/stats/overview')
    return response.data?.data || null
  },

  // ✅ Update reservation - NO TOKEN PARAMETER
  updateReservation: async (reservationId: string, data: any) => {
    const response = await api.patch(`/room-orders/${reservationId}`, data)
    return response.data?.data || null
  },

  // ✅ Delete reservation - NO TOKEN PARAMETER
  deleteReservation: async (reservationId: string) => {
    const response = await api.delete(`/room-orders/${reservationId}`)
    return response.data
  },

  // ✅ Create reservation - NO TOKEN PARAMETER
  createReservation: async (reservationData: any) => {
    const response = await api.post('/room-orders', reservationData)
    return response.data?.data || null
  },

  // ✅ Get available rooms - NO TOKEN PARAMETER
  getAvailableRooms: async () => {
    const response = await api.get('/rooms/available')
    return response.data?.data || []
  },

  // ⚠️ NEED BACKEND IMPLEMENTATION
  getRevenueData: async (period: 'week' | 'month' | 'year' = 'week') => {
    return []
  },

  getFoodItems: async () => {
    return []
  },

  getPendingOrders: async () => {
    return []
  }
}