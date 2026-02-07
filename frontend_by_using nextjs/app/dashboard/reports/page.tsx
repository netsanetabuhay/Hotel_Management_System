"use client"

import React from "react"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BedDouble,
  Users,
  UtensilsCrossed,
  Calendar,
  Download,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { mockReservations, mockFoodOrders, mockRooms, dashboardStats } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

// Mock chart data
const revenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 15800 },
  { month: "Mar", revenue: 18200 },
  { month: "Apr", revenue: 14500 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 23500 },
]

const occupancyData = [
  { month: "Jan", rate: 65 },
  { month: "Feb", rate: 72 },
  { month: "Mar", rate: 78 },
  { month: "Apr", rate: 68 },
  { month: "May", rate: 82 },
  { month: "Jun", rate: 88 },
]

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {changeType === "positive" ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : changeType === "negative" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={`text-sm font-medium ${
                  changeType === "positive"
                    ? "text-emerald-500"
                    : changeType === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }`}
              >
                {change}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SimpleBarChart({ data, valueKey, labelKey }: { data: Record<string, unknown>[]; valueKey: string; labelKey: string }) {
  const maxValue = Math.max(...data.map((d) => Number(d[valueKey])))

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-8">{String(item[labelKey])}</span>
          <div className="flex-1 bg-accent rounded-full h-8 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full flex items-center justify-end pr-3"
              style={{ width: `${(Number(item[valueKey]) / maxValue) * 100}%` }}
            >
              <span className="text-xs font-medium text-primary-foreground">
                {valueKey === "revenue" ? `$${Number(item[valueKey]).toLocaleString()}` : `${item[valueKey]}%`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RecentActivityTable() {
  const recentActivity = [
    ...mockReservations.map((r) => ({
      type: "Reservation",
      description: `${r.guestName} - Room ${r.roomNumber}`,
      amount: r.totalAmount,
      date: r.createdAt,
      status: r.status,
    })),
    ...mockFoodOrders.map((o) => ({
      type: "Food Order",
      description: `Room ${o.roomNumber} - ${o.items.length} items`,
      amount: o.totalAmount,
      date: o.orderTime.split("T")[0],
      status: o.status,
    })),
  ].slice(0, 10)

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    "checked-in": "bg-emerald-100 text-emerald-700",
    "checked-out": "bg-gray-100 text-gray-700",
    preparing: "bg-blue-100 text-blue-700",
    ready: "bg-emerald-100 text-emerald-700",
    delivered: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
          </tr>
        </thead>
        <tbody>
          {recentActivity.map((activity, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="py-3 px-4">
                <span className="text-sm font-medium text-foreground">{activity.type}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-muted-foreground">{activity.description}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-medium text-foreground">${activity.amount.toFixed(2)}</span>
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[activity.status] || "bg-gray-100 text-gray-700"}`}>
                  {activity.status.replace("-", " ")}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-muted-foreground">{activity.date}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ReportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState("month")

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "receptionist") {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleExport = () => {
    toast({
      title: "Report exported",
      description: "Your report has been downloaded as a CSV file.",
    })
  }

  // Calculate stats
  const totalRevenue = mockReservations.reduce((sum, r) => sum + r.totalAmount, 0) +
    mockFoodOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const occupancyRate = Math.round(
    (mockRooms.filter((r) => r.status === "occupied").length / mockRooms.length) * 100
  )
  const totalGuests = dashboardStats.totalGuests
  const avgOrderValue = mockFoodOrders.length > 0
    ? mockFoodOrders.reduce((sum, o) => sum + o.totalAmount, 0) / mockFoodOrders.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+15.2% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          change="+5% from last month"
          changeType="positive"
          icon={BedDouble}
        />
        <StatCard
          title="Total Guests"
          value={totalGuests.toString()}
          change="+12 new this month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          change="-2.1% from last month"
          changeType="negative"
          icon={UtensilsCrossed}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={revenueData} valueKey="revenue" labelKey="month" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Monthly occupancy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={occupancyData} valueKey="rate" labelKey="month" />
          </CardContent>
        </Card>
      </div>

      {/* Room Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Room Distribution</CardTitle>
          <CardDescription>Breakdown by room type and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {["single", "double", "suite", "deluxe", "penthouse"].map((type) => {
              const count = mockRooms.filter((r) => r.type === type).length
              const occupied = mockRooms.filter((r) => r.type === type && r.status === "occupied").length
              return (
                <div key={type} className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{type}</p>
                  <p className="text-xs text-muted-foreground mt-1">{occupied} occupied</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest reservations and orders</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityTable />
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed Reservations</p>
                <p className="text-xl font-bold text-foreground">
                  {mockReservations.filter((r) => r.status === "confirmed" || r.status === "checked-in").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 text-amber-600">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Food Orders Today</p>
                <p className="text-xl font-bold text-foreground">{mockFoodOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                <BedDouble className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Rooms</p>
                <p className="text-xl font-bold text-foreground">
                  {mockRooms.filter((r) => r.status === "available").length} / {mockRooms.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
