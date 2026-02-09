"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  UtensilsCrossed,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  ChefHat,
  Truck,
  Loader2,
  MapPin,
  User,
  CreditCard,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

// Types based on your backend response - ALL FIELDS OPTIONAL
interface FoodOrderItem {
  id?: number
  food_order_id?: string
  food_id?: string
  quantity?: number
  price?: string
  name?: string
  category?: string
  description?: string
}

interface FoodOrder {
  food_order_id?: string
  user_id?: string
  order_status?: 'pending' | 'preparing' | 'delivered'
  payment_status?: 'paid' | 'unpaid'
  order_place?: string
  created_at?: string
  username?: string
  email?: string
  total?: number
  items?: FoodOrderItem[]
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  preparing: ChefHat,
  delivered: CheckCircle,
  cancelled: XCircle,
}

function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  isAdmin,
}: {
  order: FoodOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
}) {
  if (!order) return null

  const StatusIcon = order.order_status ? statusIcons[order.order_status] || Clock : Clock

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order #{order.food_order_id?.slice(-8) || 'N/A'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium text-foreground">{order.username || 'N/A'}</p>
            </div>
            {order.order_status && (
              <Badge className={statusColors[order.order_status] || "bg-gray-100 text-gray-700"} variant="secondary">
                <StatusIcon className="h-3 w-3 mr-1" />
                {order.order_status}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{order.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Time</p>
              <p className="font-medium text-foreground">
                {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery Type</p>
              <p className="font-medium text-foreground">{order.order_place || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment</p>
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
                <CreditCard className="h-3 w-3 mr-1" />
                {order.payment_status || 'N/A'}
              </Badge>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Items</p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.name || 'Item'}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price || '0'} x {item.quantity || '0'}
                      </p>
                      {item.category && (
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      )}
                    </div>
                    <p className="font-medium text-foreground">
                      ${((parseFloat(item.price || '0') || 0) * (item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">
                ${order.total?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OrderCard({
  order,
  onView,
  isAdmin,
}: {
  order: FoodOrder
  onView: () => void
  isAdmin: boolean
}) {
  const StatusIcon = order.order_status ? statusIcons[order.order_status] || Clock : Clock

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">
              Order #{order.food_order_id?.slice(-8) || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">{order.username || 'N/A'}</p>
          </div>
          {order.order_status && (
            <Badge className={statusColors[order.order_status] || "bg-gray-100 text-gray-700"} variant="secondary">
              <StatusIcon className="h-3 w-3 mr-1" />
              {order.order_status}
            </Badge>
          )}
        </div>

        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{order.order_place || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground capitalize">{order.payment_status || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="font-bold text-foreground">
              ${order.total?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.created_at ? new Date(order.created_at).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View order</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrdersPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<FoodOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && token) {
      fetchOrders()
    }
  }, [user, token])

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/food-orders`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Ensure data.data is an array
        setOrders(Array.isArray(data.data) ? data.data : [])
      } else {
        setError(data.message || 'Failed to load orders')
        toast.error(data.message || 'Failed to load orders')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders'
      setError(errorMessage)
      toast.error('Failed to load orders')
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isAdmin = user?.role === "admin" || user?.role === "user"

  // Filter orders based on role and search
  const userOrders = isAdmin
    ? orders
    : orders.filter((o) => o.user_id === user?.user_id)

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      (order.food_order_id?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (order.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (order.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (order.order_place?.toLowerCase() || '').includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (order: FoodOrder) => {
    setSelectedOrder(order)
    setDetailsDialogOpen(true)
  }

  // Group orders by status for kanban view (admin only)
  const pendingOrders = filteredOrders.filter((o) => o.order_status === "pending")
  const preparingOrders = filteredOrders.filter((o) => o.order_status === "preparing")
  const deliveredOrders = filteredOrders.filter((o) => o.order_status === "delivered")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Food Orders</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage and track all food orders" : "Track your food orders"}
          </p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700">Error: {error}</p>
            <Button onClick={fetchOrders} variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingOrders.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
                <ChefHat className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{preparingOrders.length}</p>
                <p className="text-sm text-muted-foreground">Preparing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{deliveredOrders.length}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userOrders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No orders found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t placed any orders yet'
              }
            </p>
            <Button onClick={() => window.location.href = '/dashboard/food-menu'}>
              Order Food Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Kanban View for Admin */}
          {isAdmin && statusFilter === "all" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Pending ({pendingOrders.length})
                </h3>
                <div className="space-y-4">
                  {pendingOrders.map((order, index) => (
                    <OrderCard
                      key={order.food_order_id || index}
                      order={order}
                      onView={() => handleView(order)}
                      isAdmin={isAdmin}
                    />
                  ))}
                  {pendingOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No pending orders</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-blue-600" />
                  Preparing ({preparingOrders.length})
                </h3>
                <div className="space-y-4">
                  {preparingOrders.map((order, index) => (
                    <OrderCard
                      key={order.food_order_id || index}
                      order={order}
                      onView={() => handleView(order)}
                      isAdmin={isAdmin}
                    />
                  ))}
                  {preparingOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No orders preparing</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Delivered ({deliveredOrders.length})
                </h3>
                <div className="space-y-4">
                  {deliveredOrders.map((order, index) => (
                    <OrderCard
                      key={order.food_order_id || index}
                      order={order}
                      onView={() => handleView(order)}
                      isAdmin={isAdmin}
                    />
                  ))}
                  {deliveredOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No orders delivered</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Table View */}
          {(!isAdmin || statusFilter !== "all") && (
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>{filteredOrders.length} orders found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Delivery Type</TableHead>
      <TableHead>Total Items</TableHead> {/* NEW COLUMN */}
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Payment</TableHead>
      <TableHead>Date</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredOrders.map((order, index) => {
      const StatusIcon = order.order_status ? statusIcons[order.order_status] || Clock : Clock
      // Calculate total quantity of all items in this order
      const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
      
      return (
        <TableRow key={order.food_order_id || index}>
          <TableCell className="font-medium">#{order.food_order_id?.slice(-8) || 'N/A'}</TableCell>
          <TableCell>
            <div>
              <p className="font-medium">{order.username || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">{order.email || 'N/A'}</p>
            </div>
          </TableCell>
          <TableCell>{order.order_place || 'N/A'}</TableCell>
          <TableCell className="font-medium">
            {totalItems} {/* Shows total quantity */}
          </TableCell>
          <TableCell className="font-medium">
            ${order.total?.toFixed(2) || '0.00'}
          </TableCell>
          <TableCell>
            {order.order_status && (
              <Badge className={statusColors[order.order_status] || "bg-gray-100 text-gray-700"} variant="secondary">
                <StatusIcon className="h-3 w-3 mr-1" />
                {order.order_status}
              </Badge>
            )}
          </TableCell>
          <TableCell>
            <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
              {order.payment_status || 'N/A'}
            </Badge>
          </TableCell>
          <TableCell>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="icon" onClick={() => handleView(order)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
          </TableCell>
        </TableRow>
      )
    })}
  </TableBody>
</Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        isAdmin={isAdmin}
      />
    </div>
  )
}