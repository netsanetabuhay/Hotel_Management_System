// app/dashboard/user/page.tsx - USER DASHBOARD
'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ShoppingBag, Bell, Star, MapPin, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function UserDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.first_name || user?.username}!</h1>
        <p className="text-muted-foreground">Here's your personal dashboard</p>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Stay</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Room 205</div>
            <p className="text-xs text-muted-foreground">Deluxe Suite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">2 pending, 1 preparing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loyalty Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,250</div>
            <p className="text-xs text-muted-foreground">Gold Member</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Users */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Book a Room</CardTitle>
            <CardDescription>Find available rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Browse Rooms
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Food</CardTitle>
            <CardDescription>From restaurant menu</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Menu
            </Button>
          </CardContent>
        </Card>

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
      </div>

      {/* Current Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>Upcoming and past reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Deluxe Suite - Room 205</h4>
                  <p className="text-sm text-muted-foreground">Dec 15 - Dec 20, 2024</p>
                </div>
                <Badge variant={item === 1 ? "default" : "outline"}>
                  {item === 1 ? 'Active' : 'Upcoming'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
