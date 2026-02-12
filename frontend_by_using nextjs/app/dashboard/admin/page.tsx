"use client"

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Hotel, Users, Calendar, DollarSign, Package, ShoppingCart, 
  Loader2, BarChart3 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin-dashboard'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const { user } = useAuth() 
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    availableRooms: 0,
    foodItems: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayReservations: 0,
    totalRooms: 0,
    occupiedRooms: 0
  })
  

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard/user')
    }
    
    
    if (user && user.role === 'admin') {
      fetchDashboardStats()
    }
  }, [user, router])
  

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      
      const dashboardStats = await adminApi.getDashboardStats()
      const roomStatus = await adminApi.getRoomStatus()
      
      setStats({
        ...dashboardStats,
        totalRooms: roomStatus.total || 0,
        occupiedRooms: roomStatus.occupied || 0
      })
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.first_name || user?.username}. Here's what's happening.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Available Rooms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Rooms</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <Hotel className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.availableRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalRooms > 0 
                ? `${Math.round((stats.availableRooms / stats.totalRooms) * 100)}% of total` 
                : 'Ready for booking'}
            </p>
            <div className="mt-2 text-xs text-emerald-600">
              {stats.occupiedRooms} occupied • {stats.totalRooms} total
            </div>
          </CardContent>
        </Card>

        {/* Food Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Food Items</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Package className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.foodItems}</div>
            <p className="text-xs text-muted-foreground mt-1">In menu</p>
            <Button 
              variant="link" 
              className="mt-2 h-auto p-0 text-xs text-orange-600"
              onClick={() => router.push('/dashboard/food-menu')}
            >
              Manage Menu →
            </Button>
          </CardContent>
        </Card>

        {/* Today's Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Reservations</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.todayReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">Check-ins today</p>
            <Button 
              variant="link" 
              className="mt-2 h-auto p-0 text-xs text-blue-600"
              onClick={() => router.push('/dashboard/reservations')}
            >
              View All →
            </Button>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting preparation</p>
            <Button 
              variant="link" 
              className="mt-2 h-auto p-0 text-xs text-purple-600"
              onClick={() => router.push('/dashboard/food-orders')}
            >
              Manage Orders →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used admin actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => router.push('/dashboard/rooms')}
            >
              <Hotel className="mr-2 h-4 w-4" />
              Manage Rooms
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => router.push('/dashboard/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => router.push('/dashboard/food-menu')}
            >
              <Package className="mr-2 h-4 w-4" />
              Manage Food Menu
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Backend API</p>
                  <p className="text-xs text-muted-foreground">Connected and running</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Online</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Database</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Online</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Image Upload Service</p>
                  <p className="text-xs text-muted-foreground">Ready for uploads</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>Detailed system analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push('/dashboard/reports')}
            >
              <DollarSign className="h-8 w-8 text-muted-foreground" />
              <span>Revenue Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push('/dashboard/reports/occupancy')}
            >
              <Hotel className="h-8 w-8 text-muted-foreground" />
              <span>Occupancy Rate</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push('/dashboard/reports/food')}
            >
              <Package className="h-8 w-8 text-muted-foreground" />
              <span>Food Sales</span>
            </Button>
          </div>
        </CardContent>
      </Card> 
    </div>
  )
}