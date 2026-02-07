// Mock data for Hotel Management System

export interface User {
  id: string
  email: string
  name: string
  // role: "admin" | "receptionist" | "guest"
  phone?: string
  avatar?: string
  createdAt: string
}

export interface Room {
  id: string
  number: string
  type: "single" | "double" | "suite" | "deluxe" | "penthouse"
  price: number
  status: "available" | "occupied" | "maintenance" | "reserved"
  capacity: number
  amenities: string[]
  floor: number
  image?: string
}

export interface Reservation {
  id: string
  guestId: string
  guestName: string
  guestEmail: string
  roomId: string
  roomNumber: string
  roomType: string
  checkIn: string
  checkOut: string
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled"
  totalAmount: number
  paymentStatus: "pending" | "paid" | "refunded"
  specialRequests?: string
  createdAt: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: "breakfast" | "lunch" | "dinner" | "drinks" | "desserts" | "snacks"
  image?: string
  available: boolean
  preparationTime: number
}

export interface FoodOrder {
  id: string
  guestId: string
  guestName: string
  roomNumber: string
  items: { menuItemId: string; name: string; quantity: number; price: number }[]
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  totalAmount: number
  orderTime: string
  deliveryTime?: string
  specialInstructions?: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@grandhotel.com",
    name: "John Admin",
    role: "admin",
    phone: "+1 234 567 8900",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    email: "reception@grandhotel.com",
    name: "Sarah Reception",
    role: "receptionist",
    phone: "+1 234 567 8901",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    email: "guest@example.com",
    name: "Michael Guest",
    role: "guest",
    phone: "+1 234 567 8902",
    createdAt: "2024-06-01",
  },
  {
    id: "4",
    email: "jane.doe@example.com",
    name: "Jane Doe",
    role: "guest",
    phone: "+1 234 567 8903",
    createdAt: "2024-06-15",
  },
  {
    id: "5",
    email: "bob.wilson@example.com",
    name: "Bob Wilson",
    role: "guest",
    phone: "+1 234 567 8904",
    createdAt: "2024-07-01",
  },
]

// Mock Rooms
export const mockRooms: Room[] = [
  {
    id: "r1",
    number: "101",
    type: "single",
    price: 99,
    status: "available",
    capacity: 1,
    amenities: ["WiFi", "TV", "AC", "Mini Bar"],
    floor: 1,
  },
  {
    id: "r2",
    number: "102",
    type: "double",
    price: 149,
    status: "occupied",
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony"],
    floor: 1,
  },
  {
    id: "r3",
    number: "201",
    type: "suite",
    price: 299,
    status: "available",
    capacity: 4,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Kitchen", "Living Room"],
    floor: 2,
  },
  {
    id: "r4",
    number: "202",
    type: "deluxe",
    price: 399,
    status: "reserved",
    capacity: 3,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Jacuzzi", "Ocean View"],
    floor: 2,
  },
  {
    id: "r5",
    number: "301",
    type: "penthouse",
    price: 799,
    status: "maintenance",
    capacity: 6,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Jacuzzi", "Ocean View", "Private Pool", "Butler Service"],
    floor: 3,
  },
  {
    id: "r6",
    number: "103",
    type: "single",
    price: 99,
    status: "available",
    capacity: 1,
    amenities: ["WiFi", "TV", "AC"],
    floor: 1,
  },
  {
    id: "r7",
    number: "104",
    type: "double",
    price: 149,
    status: "occupied",
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Mini Bar"],
    floor: 1,
  },
  {
    id: "r8",
    number: "203",
    type: "suite",
    price: 299,
    status: "available",
    capacity: 4,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Kitchen"],
    floor: 2,
  },
]

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: "res1",
    guestId: "3",
    guestName: "Michael Guest",
    guestEmail: "guest@example.com",
    roomId: "r2",
    roomNumber: "102",
    roomType: "double",
    checkIn: "2024-02-01",
    checkOut: "2024-02-05",
    status: "checked-in",
    totalAmount: 596,
    paymentStatus: "paid",
    specialRequests: "Late checkout requested",
    createdAt: "2024-01-25",
  },
  {
    id: "res2",
    guestId: "4",
    guestName: "Jane Doe",
    guestEmail: "jane.doe@example.com",
    roomId: "r4",
    roomNumber: "202",
    roomType: "deluxe",
    checkIn: "2024-02-10",
    checkOut: "2024-02-14",
    status: "confirmed",
    totalAmount: 1596,
    paymentStatus: "paid",
    createdAt: "2024-01-28",
  },
  {
    id: "res3",
    guestId: "5",
    guestName: "Bob Wilson",
    guestEmail: "bob.wilson@example.com",
    roomId: "r7",
    roomNumber: "104",
    roomType: "double",
    checkIn: "2024-02-02",
    checkOut: "2024-02-04",
    status: "checked-in",
    totalAmount: 298,
    paymentStatus: "paid",
    createdAt: "2024-01-30",
  },
  {
    id: "res4",
    guestId: "3",
    guestName: "Michael Guest",
    guestEmail: "guest@example.com",
    roomId: "r3",
    roomNumber: "201",
    roomType: "suite",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    status: "pending",
    totalAmount: 1495,
    paymentStatus: "pending",
    specialRequests: "Anniversary celebration - please arrange flowers",
    createdAt: "2024-02-01",
  },
]

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Continental Breakfast",
    description: "Fresh pastries, fruits, yogurt, and orange juice",
    price: 24.99,
    category: "breakfast",
    available: true,
    preparationTime: 15,
  },
  {
    id: "m2",
    name: "American Breakfast",
    description: "Eggs, bacon, sausage, hash browns, and toast",
    price: 29.99,
    category: "breakfast",
    available: true,
    preparationTime: 20,
  },
  {
    id: "m3",
    name: "Grilled Salmon",
    description: "Atlantic salmon with seasonal vegetables and lemon butter sauce",
    price: 42.99,
    category: "lunch",
    available: true,
    preparationTime: 25,
  },
  {
    id: "m4",
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons, and Caesar dressing",
    price: 18.99,
    category: "lunch",
    available: true,
    preparationTime: 10,
  },
  {
    id: "m5",
    name: "Filet Mignon",
    description: "8oz prime beef tenderloin with truffle mashed potatoes",
    price: 68.99,
    category: "dinner",
    available: true,
    preparationTime: 35,
  },
  {
    id: "m6",
    name: "Lobster Thermidor",
    description: "Classic French preparation with brandy cream sauce",
    price: 89.99,
    category: "dinner",
    available: true,
    preparationTime: 40,
  },
  {
    id: "m7",
    name: "Signature Cocktail",
    description: "House special with premium spirits and fresh ingredients",
    price: 16.99,
    category: "drinks",
    available: true,
    preparationTime: 5,
  },
  {
    id: "m8",
    name: "Premium Wine Selection",
    description: "Glass of our sommelier's choice",
    price: 22.99,
    category: "drinks",
    available: true,
    preparationTime: 2,
  },
  {
    id: "m9",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with vanilla ice cream",
    price: 14.99,
    category: "desserts",
    available: true,
    preparationTime: 15,
  },
  {
    id: "m10",
    name: "Crème Brûlée",
    description: "Classic French vanilla custard with caramelized sugar",
    price: 12.99,
    category: "desserts",
    available: true,
    preparationTime: 10,
  },
  {
    id: "m11",
    name: "Club Sandwich",
    description: "Triple-decker with turkey, bacon, lettuce, and tomato",
    price: 19.99,
    category: "snacks",
    available: true,
    preparationTime: 15,
  },
  {
    id: "m12",
    name: "Truffle Fries",
    description: "Crispy fries with truffle oil and parmesan",
    price: 14.99,
    category: "snacks",
    available: true,
    preparationTime: 12,
  },
]

// Mock Food Orders
export const mockFoodOrders: FoodOrder[] = [
  {
    id: "fo1",
    guestId: "3",
    guestName: "Michael Guest",
    roomNumber: "102",
    items: [
      { menuItemId: "m2", name: "American Breakfast", quantity: 2, price: 29.99 },
      { menuItemId: "m8", name: "Premium Wine Selection", quantity: 1, price: 22.99 },
    ],
    status: "delivered",
    totalAmount: 82.97,
    orderTime: "2024-02-02T08:30:00",
    deliveryTime: "2024-02-02T09:00:00",
  },
  {
    id: "fo2",
    guestId: "5",
    guestName: "Bob Wilson",
    roomNumber: "104",
    items: [
      { menuItemId: "m5", name: "Filet Mignon", quantity: 1, price: 68.99 },
      { menuItemId: "m7", name: "Signature Cocktail", quantity: 2, price: 16.99 },
      { menuItemId: "m9", name: "Chocolate Lava Cake", quantity: 1, price: 14.99 },
    ],
    status: "preparing",
    totalAmount: 117.96,
    orderTime: "2024-02-02T19:15:00",
    specialInstructions: "Medium-rare steak please",
  },
  {
    id: "fo3",
    guestId: "3",
    guestName: "Michael Guest",
    roomNumber: "102",
    items: [
      { menuItemId: "m11", name: "Club Sandwich", quantity: 1, price: 19.99 },
      { menuItemId: "m12", name: "Truffle Fries", quantity: 1, price: 14.99 },
    ],
    status: "pending",
    totalAmount: 34.98,
    orderTime: "2024-02-02T14:00:00",
  },
]

// Dashboard Stats
export const dashboardStats = {
  totalRooms: mockRooms.length,
  availableRooms: mockRooms.filter((r) => r.status === "available").length,
  occupiedRooms: mockRooms.filter((r) => r.status === "occupied").length,
  totalReservations: mockReservations.length,
  pendingReservations: mockReservations.filter((r) => r.status === "pending").length,
  totalRevenue: mockReservations.reduce((sum, r) => sum + r.totalAmount, 0),
  totalGuests: mockUsers.filter((u) => u.role === "guest").length,
  pendingOrders: mockFoodOrders.filter((o) => o.status === "pending" || o.status === "preparing").length,
}
