const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types matching your database
interface RoomOrder {
  room_order_id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: 'booked' | 'active' | 'completed';
  payment_status: 'paid' | 'unpaid';
  created_at: string;
  room_number?: string;
  room_type?: string;
}

interface FoodOrder {
  food_order_id: string;
  user_id: string;
  order_status: 'pending' | 'preparing' | 'delivered';
  payment_status: 'paid' | 'unpaid';
  order_place: string;
  created_at: string;
}

interface Room {
  room_id: string;
  room_number: string;
  room_type: string;
  price: number;
  status: 'available' | 'maintenance';
}

interface Activity {
  id: string;
  type: 'reservation' | 'food_order';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardApi = {
  getCurrentStay: async (userId: string, token: string): Promise<RoomOrder | null> => {
    try {
      const response = await fetch(
        `${API_URL}/room-orders?status=active&user_id=${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const data: ApiResponse<RoomOrder[]> = await response.json();
      if (!response.ok || !data.success) {
        console.warn('No active stay or error:', data.message);
        return null;
      }
      
      return data.data[0] || null;
    } catch (error) {
      console.error('Error fetching current stay:', error);
      return null;
    }
  },

  getActiveFoodOrders: async (userId: string, token: string): Promise<FoodOrder[]> => {
    try {
      const response = await fetch(
        `${API_URL}/food-orders?order_status=pending,preparing&user_id=${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const data: ApiResponse<FoodOrder[]> = await response.json();
      if (!response.ok || !data.success) {
        console.warn('Error fetching active orders:', data.message);
        return [];
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching active orders:', error);
      return [];
    }
  },

  getAvailableRooms: async (token: string): Promise<number> => {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data: ApiResponse<Room[]> = await response.json();
      if (!response.ok || !data.success) {
        console.warn('Error fetching rooms:', data.message);
        return 0;
      }
      
      return data.data.filter(room => room.status === 'available').length;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      return 0;
    }
  },

  getRecentActivities: async (userId: string, token: string): Promise<Activity[]> => {
    try {
      const [reservationsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/room-orders?user_id=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/food-orders?user_id=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);
      
      const reservationsData: ApiResponse<RoomOrder[]> = await reservationsRes.json();
      const ordersData: ApiResponse<FoodOrder[]> = await ordersRes.json();
      
      const reservations = reservationsData.success ? reservationsData.data : [];
      const orders = ordersData.success ? ordersData.data : [];

      const activities: Activity[] = [
        ...reservations.map(res => ({
          id: res.room_order_id,
          type: 'reservation' as const,
          title: `Room ${res.room_number || res.room_id} Reservation`,
          description: `Check-in: ${res.check_in}, Check-out: ${res.check_out}`,
          timestamp: res.created_at,
          status: res.status,
        })),
        ...orders.map(order => ({
          id: order.food_order_id,
          type: 'food_order' as const,
          title: 'Food Order',
          description: `Order for: ${order.order_place}`,
          timestamp: order.created_at,
          status: order.order_status,
        })),
      ];

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  getDashboardData: async (userId: string, token: string) => {
    try {
      const [currentStay, activeOrders, availableRooms, recentActivities] = await Promise.all([
        dashboardApi.getCurrentStay(userId, token),
        dashboardApi.getActiveFoodOrders(userId, token),
        dashboardApi.getAvailableRooms(token),
        dashboardApi.getRecentActivities(userId, token),
      ]);

      return {
        currentStay,
        activeOrders: activeOrders.length,
        availableRooms,
        loyaltyPoints: 1250,
        recentActivities,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        currentStay: null,
        activeOrders: 0,
        availableRooms: 0,
        loyaltyPoints: 1250,
        recentActivities: [],
      };
    }
  },
};