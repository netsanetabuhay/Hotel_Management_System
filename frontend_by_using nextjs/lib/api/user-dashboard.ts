import api from "../axios";

export interface DashboardData {
  currentStay: any | null;
  activeOrders: number;
  availableRooms: number;
  loyaltyPoints: number;
  recentActivities: any[];
}

export const dashboardApi = {
  // ✅ REMOVED token parameter - axios interceptor handles it!
  getDashboardData: async (userId: string): Promise<DashboardData> => {
    try {
      
      // Fetch all data in parallel
      const [reservationsRes, roomsRes, ordersRes] = await Promise.all([
        api.get('/room-orders', {  
          params: { user_id: userId }
        }),
        api.get('/rooms/available'),  // ✅ FIXED: /rooms/available not /rooms/
        api.get('/food-orders', {
          params: { 
            user_id: userId,
            order_status: 'pending'
          }
        })
      ]);

      // ❌ REMOVED - Don't set headers here, interceptor does it!
      // if (token) {
      //   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // }

      console.log('✅ Reservations:', reservationsRes.data);
      console.log('✅ Rooms:', roomsRes.data);
      console.log('✅ Orders:', ordersRes.data);

      // Extract data from your response structure { success: true, data: [...] }
      const reservations = reservationsRes.data?.data || [];
      const availableRooms = roomsRes.data?.data || [];
      const activeOrders = ordersRes.data?.data || [];

      // Find current stay
      const today = new Date().toISOString().split('T')[0];
      const currentStay = reservations.find((res: any) => 
        res.status === 'active' || 
        (res.status === 'booked' && res.check_in <= today && res.check_out >= today)
      ) || null;

      return {
        currentStay,
        activeOrders: activeOrders.length || 0,
        availableRooms: availableRooms.length || 0,
        loyaltyPoints: 1250, 
        recentActivities: [] 
      };
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get user's reservations
  getUserReservations: async (userId: string) => {
    const response = await api.get('/room-orders', {
      params: { user_id: userId }
    });
    return response.data?.data || [];
  },

  // Get available rooms
  getAvailableRooms: async () => {
    const response = await api.get('/rooms/available');
    return response.data?.data || [];
  },

  // Get user's food orders
  getUserFoodOrders: async (userId: string, status?: string) => {
    const params: any = { user_id: userId };
    if (status) params.order_status = status;
    
    const response = await api.get('/food-orders', { params });
    return response.data?.data || [];
  },

  // Create reservation
  createReservation: async (reservationData: any) => {
    const response = await api.post('/room-orders', reservationData);
    return response.data?.data || null;
  },

  // Create food order
  createFoodOrder: async (orderData: any) => {
    const response = await api.post('/food-orders', orderData);
    return response.data?.data || null;
  }
};