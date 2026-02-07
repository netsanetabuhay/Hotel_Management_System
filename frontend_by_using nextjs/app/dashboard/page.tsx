"use client"

import React from "react"

import { BedDouble, CalendarCheck, Users, DollarSign, TrendingUp, Clock, UtensilsCrossed, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { dashboardStats, mockReservations, mockFoodOrders, mockRooms } from "@/lib/mock-data"

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  trend?: { value: number; positive: boolean }
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className={`h-3 w-3 ${trend.positive ? "text-emerald-500" : "text-destructive rotate-180"}`} />
            <span className={`text-xs font-medium ${trend.positive ? "text-emerald-500" : "text-destructive"}`}>
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecentReservations() {
  const recentReservations = mockReservations.slice(0, 5)

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    "checked-in": "bg-emerald-100 text-emerald-700",
    "checked-out": "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Reservations</CardTitle>
        <CardDescription>Latest booking activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{reservation.guestName}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {reservation.roomNumber} - {reservation.checkIn} to {reservation.checkOut}
                  </p>
                </div>
              </div>
              <Badge className={statusColors[reservation.status]} variant="secondary">
                {reservation.status.replace("-", " ")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RoomOverview() {
  const roomsByStatus = {
    available: mockRooms.filter((r) => r.status === "available").length,
    occupied: mockRooms.filter((r) => r.status === "occupied").length,
    reserved: mockRooms.filter((r) => r.status === "reserved").length,
    maintenance: mockRooms.filter((r) => r.status === "maintenance").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Status</CardTitle>
        <CardDescription>Current occupancy overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-foreground">Available</span>
            </div>
            <span className="font-medium text-foreground">{roomsByStatus.available}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-foreground">Occupied</span>
            </div>
            <span className="font-medium text-foreground">{roomsByStatus.occupied}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-foreground">Reserved</span>
            </div>
            <span className="font-medium text-foreground">{roomsByStatus.reserved}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm text-foreground">Maintenance</span>
            </div>
            <span className="font-medium text-foreground">{roomsByStatus.maintenance}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingOrders() {
  const pendingOrders = mockFoodOrders.filter((o) => o.status === "pending" || o.status === "preparing")

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    preparing: "bg-blue-100 text-blue-700",
    ready: "bg-emerald-100 text-emerald-700",
    delivered: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Food Orders</CardTitle>
        <CardDescription>Orders awaiting preparation</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No pending orders</p>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="font-medium text-foreground">Room {order.roomNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} items - ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <Badge className={statusColors[order.status]} variant="secondary">
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "receptionist"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}! {"Here's"} an overview of your hotel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={dashboardStats.totalRooms}
          description={`${dashboardStats.availableRooms} available`}
          icon={BedDouble}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Active Reservations"
          value={dashboardStats.totalReservations}
          description={`${dashboardStats.pendingReservations} pending`}
          icon={CalendarCheck}
          trend={{ value: 8, positive: true }}
        />
        {isAdmin && (
          <>
            <StatCard
              title="Total Revenue"
              value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
              description="This month"
              icon={DollarSign}
              trend={{ value: 15, positive: true }}
            />
            <StatCard
              title="Total Guests"
              value={dashboardStats.totalGuests}
              description="Registered users"
              icon={Users}
              trend={{ value: 5, positive: true }}
            />
          </>
        )}
        {!isAdmin && (
          <>
            <StatCard title="Pending Orders" value={dashboardStats.pendingOrders} description="Food orders" icon={UtensilsCrossed} />
            <StatCard
              title="Check-in Today"
              value="2:00 PM"
              description="Room 102"
              icon={Clock}
            />
          </>
        )}
      </div>

      {/* Quick Actions for Admin */}
      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <BedDouble className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">New Reservation</h3>
                <p className="text-sm text-muted-foreground">Book a room for a guest</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Food Order</h3>
                <p className="text-sm text-muted-foreground">Create room service order</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Report Issue</h3>
                <p className="text-sm text-muted-foreground">Log maintenance request</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentReservations />
        <div className="space-y-6">
          <RoomOverview />
          {isAdmin && <PendingOrders />}
        </div>
      </div>
    </div>
  )
}
