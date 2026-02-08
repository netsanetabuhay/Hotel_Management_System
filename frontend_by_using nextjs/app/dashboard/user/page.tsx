"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ShoppingBag, Bell, Star, MapPin, CreditCard, Loader2, Hotel, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/dashboard/SearchBar"
import { dashboardApi } from "@/lib/api/user-dashboard"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UserDashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    currentStay: null as any,
    activeOrders: 0,
    availableRooms: 0,
    loyaltyPoints: 1250,
    recentActivities: [] as any[],
  })

  useEffect(() => {
    if (user && token) {
      fetchDashboardData()
    }
  }, [user, token])

  const fetchDashboardData = async () => {
    if (!user || !token) return

    setIsLoading(true)
    try {
      const data = await dashboardApi.getDashboardData(user.user_id, token)
      setDashboardData(data)
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.first_name || user?.username}!</h1>
          <p className="text-muted-foreground">Here's your personal dashboard</p>
        </div>
        
        {/* Search Bar */}
        <SearchBar />
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Current Stay */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Stay</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardData.currentStay ? (
              <>
                <div className="text-2xl font-bold text-foreground">
                  Room {dashboardData.currentStay.room_number || dashboardData.currentStay.room_id}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.currentStay.room_type || "Room"} • Check-in: {dashboardData.currentStay.check_in}
                </p>
                <Badge className="mt-2" variant={dashboardData.currentStay.status === 'active' ? "default" : "outline"}>
                  {dashboardData.currentStay.status}
                </Badge>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">No active stay</div>
                <p className="text-xs text-muted-foreground">You're not currently checked in</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push('/dashboard/reservations')}
                >
                  <Hotel className="mr-2 h-3 w-3" />
                  Book a Room
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeOrders === 1 ? '1 order pending' : `${dashboardData.activeOrders} orders pending`}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => router.push('/dashboard/orders')}
            >
              <ShoppingBag className="mr-2 h-3 w-3" />
              View Orders
            </Button>
          </CardContent>
        </Card>

        {/* Available Rooms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Rooms</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.availableRooms}</div>
            <p className="text-xs text-muted-foreground">Rooms ready for booking</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => router.push('/dashboard/rooms')}
            >
              <Users className="mr-2 h-3 w-3" />
              Browse Rooms
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/reservations')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book a Room
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/food-menu')}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Order Food
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/notifications')}
            >
              <Bell className="mr-2 h-4 w-4" />
              View Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Housekeeping at 10 AM</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <Badge variant="outline">New</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Bill ready for review</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
                {dashboardData.recentActivities.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => router.push('/dashboard/activities')}
                  >
                    View all activities
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent activities</p>
                <p className="text-xs text-muted-foreground mt-1">Your activities will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Points */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program</CardTitle>
          <CardDescription>Your rewards and points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dashboardData.loyaltyPoints} points</p>
                <p className="text-sm text-muted-foreground">Gold Member Status</p>
              </div>
            </div>
            <Button onClick={() => router.push('/dashboard/rewards')}>
              <Star className="mr-2 h-4 w-4" />
              View Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}