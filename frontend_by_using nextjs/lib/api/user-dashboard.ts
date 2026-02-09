const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DashboardData {
  currentStay: any | null;
  activeOrders: number;
  availableRooms: number;
  loyaltyPoints: number;
  recentActivities: any[];
}

export const dashboardApi = {
  getDashboardData: async (userId: string, token: string): Promise<DashboardData> => {
    try {
      // Fetch user's current reservations
      const reservationsRes = await fetch(`${API_URL}/room-orders?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch available rooms
      const roomsRes = await fetch(`${API_URL}/rooms/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch active food orders
      const ordersRes = await fetch(`${API_URL}/food-orders?user_id=${userId}&order_status=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const reservationsData = await reservationsRes.json();
      const roomsData = await roomsRes.json();
      const ordersData = await ordersRes.json();

      // Get current stay (active reservation)
      const currentStay = reservationsData.data?.find((res: any) => 
        res.status === 'active' || (res.status === 'booked' && res.check_in <= new Date().toISOString().split('T')[0])
      ) || null;

      return {
        currentStay,
        activeOrders: ordersData.data?.length || 0,
        availableRooms: roomsData.data?.length || 0,
        loyaltyPoints: 1250, // This would come from a loyalty endpoint
        recentActivities: [] // This would come from activities endpoint
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};