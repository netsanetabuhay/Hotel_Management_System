"use client"

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Package, 
  Download,
  Filter,
  CalendarDays,
  Hotel,
  ShoppingBag,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { adminApi } from '@/lib/api/admin-dashboard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function ReportsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [reportData, setReportData] = useState({
    revenue: 0,
    occupancyRate: 0,
    totalBookings: 0,
    foodSales: 0,
    topRooms: [],
    topFoodItems: []
  })

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    if (user && token && user.role === 'admin') {
      fetchReportData()
    }
  }, [user, token, router, timeRange])

  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      // For now, using mock data. You'll need to create backend endpoints for these
      // Example endpoints: /api/reports/revenue, /api/reports/occupancy, etc.
      
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setReportData({
          revenue: 12540.75,
          occupancyRate: 78.5,
          totalBookings: 45,
          foodSales: 3240.50,
          topRooms: [
            { room_number: '101', bookings: 12, revenue: 4500 },
            { room_number: '201', bookings: 10, revenue: 3800 },
            { room_number: '301', bookings: 8, revenue: 3200 }
          ],
          topFoodItems: [
            { name: 'Pizza Margherita', sales: 45, revenue: 675 },
            { name: 'Caesar Salad', sales: 38, revenue: 456 },
            { name: 'Grilled Salmon', sales: 32, revenue: 960 }
          ]
        })
        setIsLoading(false)
      }, 1000)

    } catch (error) {
      console.error('Error fetching report data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load report data',
        variant: 'destructive'
      })
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${reportData.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+12.5%</span>
              <span>from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{reportData.occupancyRate}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+5.2%</span>
              <span>from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{reportData.totalBookings}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+8.7%</span>
              <span>from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Food Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${reportData.foodSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+15.3%</span>
              <span>from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Rooms */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Rooms</CardTitle>
            <CardDescription>Rooms with highest bookings and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topRooms.map((room, index) => (
                <div key={room.room_number} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-8 w-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">Room {room.room_number}</p>
                      <p className="text-sm text-muted-foreground">{room.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${room.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Hotel className="h-4 w-4 mr-2" />
              View All Rooms Report
            </Button>
          </CardContent>
        </Card>

        {/* Top Selling Food Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Food Items</CardTitle>
            <CardDescription>Most popular menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topFoodItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-8 w-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${item.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Package className="h-4 w-4 mr-2" />
              View Food Sales Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Revenue performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">Connect to analytics service to enable charts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Calendar className="h-10 w-10 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Daily Report</h3>
            <p className="text-sm text-muted-foreground mb-4">Generate daily performance summary</p>
            <Button variant="outline" className="w-full">
              Generate Daily Report
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Filter className="h-10 w-10 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Custom Report</h3>
            <p className="text-sm text-muted-foreground mb-4">Create custom reports with filters</p>
            <Button variant="outline" className="w-full">
              Create Custom Report
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Users className="h-10 w-10 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Guest Analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">Analyze guest demographics and behavior</p>
            <Button variant="outline" className="w-full">
              View Guest Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}