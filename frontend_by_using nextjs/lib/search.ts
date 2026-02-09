const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SearchResult {
  type: 'room' | 'reservation' | 'food-orders' | 'food-item';
  id: string;
  title: string;
  description: string;
  link: string;
  timestamp?: string;
}

export const searchApi = {
  searchAll: async (query: string, userId: string, token: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    try {
      const [rooms, reservations, foodOrders, foodItems] = await Promise.all([
        searchApi.searchRooms(query, token),
        searchApi.searchReservations(query, userId, token),
        searchApi.searchFoodOrders(query, userId, token),
        searchApi.searchFoodItems(query, token),
      ]);

      return [...rooms, ...reservations, ...foodOrders, ...foodItems].slice(0, 10);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  searchRooms: async (query: string, token: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`${API_URL}/rooms/search/${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) return [];

      return data.data.map((room: any) => ({
        type: 'room' as const,
        id: room.room_id,
        title: `Room ${room.room_number}`,
        description: `${room.room_type} - $${room.price}/night`,
        link: '/dashboard/rooms',
      }));
    } catch {
      return [];
    }
  },

  searchReservations: async (query: string, userId: string, token: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`${API_URL}/room-orders?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) return [];

      const filtered = data.data.filter((res: any) =>
        res.room_number?.toLowerCase().includes(query.toLowerCase()) ||
        res.room_type?.toLowerCase().includes(query.toLowerCase()) ||
        res.status?.toLowerCase().includes(query.toLowerCase()) ||
        res.check_in?.includes(query) ||
        res.check_out?.includes(query)
      );

      return filtered.map((res: any) => ({
        type: 'reservation' as const,
        id: res.room_order_id,
        title: `Reservation: Room ${res.room_number || res.room_id}`,
        description: `${res.check_in} to ${res.check_out} - ${res.status}`,
        link: '/dashboard/reservations',
        timestamp: res.created_at,
      }));
    } catch {
      return [];
    }
  },

  searchFoodOrders: async (query: string, userId: string, token: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`${API_URL}/food-orders?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) return [];

      const filtered = data.data.filter((order: any) =>
        order.order_place?.toLowerCase().includes(query.toLowerCase()) ||
        order.order_status?.toLowerCase().includes(query.toLowerCase()) ||
        order.food_order_id?.toLowerCase().includes(query.toLowerCase())
      );

      return filtered.map((order: any) => ({
        type: 'food_order' as const,
        id: order.food_order_id,
        title: 'Food Order',
        description: `${order.order_place} - ${order.order_status}`,
        link: '/dashboard/food-orders',
        timestamp: order.created_at,
      }));
    } catch {
      return [];
    }
  },

  searchFoodItems: async (query: string, token: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`${API_URL}/food-items?search=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) return [];

      return data.data.map((item: any) => ({
        type: 'food_item' as const,
        id: item.food_id,
        title: item.name,
        description: `${item.category} - $${item.price}`,
        link: '/dashboard/food-menu',
      }));
    } catch {
      return [];
    }
  },
};