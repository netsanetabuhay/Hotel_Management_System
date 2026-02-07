"use client"

import React from "react"

import { useState } from "react"
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
import { mockFoodOrders, type FoodOrder } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-emerald-100 text-emerald-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
}

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  preparing: ChefHat,
  ready: CheckCircle,
  delivered: Truck,
  cancelled: XCircle,
}

function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onStatusChange,
  isAdmin,
}: {
  order: FoodOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: string) => void
  isAdmin: boolean
}) {
  if (!order) return null

  const StatusIcon = statusIcons[order.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order #{order.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium text-foreground">Room {order.roomNumber}</p>
            </div>
            <Badge className={statusColors[order.status]} variant="secondary">
              <StatusIcon className="h-3 w-3 mr-1" />
              {order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Guest</p>
              <p className="font-medium text-foreground">{order.guestName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Time</p>
              <p className="font-medium text-foreground">
                {new Date(order.orderTime).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {order.specialInstructions && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
              <p className="text-sm text-foreground bg-accent p-3 rounded-lg">{order.specialInstructions}</p>
            </div>
          )}

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
            </div>

            {isAdmin && order.status !== "delivered" && order.status !== "cancelled" && (
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onStatusChange(order.id, "preparing")
                      onOpenChange(false)
                    }}
                  >
                    <ChefHat className="h-4 w-4 mr-1" />
                    Start Preparing
                  </Button>
                )}
                {order.status === "preparing" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onStatusChange(order.id, "ready")
                      onOpenChange(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Ready
                  </Button>
                )}
                {order.status === "ready" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onStatusChange(order.id, "delivered")
                      onOpenChange(false)
                    }}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Mark Delivered
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-destructive hover:text-destructive"
                  onClick={() => {
                    onStatusChange(order.id, "cancelled")
                    onOpenChange(false)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OrderCard({
  order,
  onView,
  onStatusChange,
  isAdmin,
}: {
  order: FoodOrder
  onView: () => void
  onStatusChange: (status: string) => void
  isAdmin: boolean
}) {
  const StatusIcon = statusIcons[order.status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">Room {order.roomNumber}</p>
            <p className="text-sm text-muted-foreground">{order.guestName}</p>
          </div>
          <Badge className={statusColors[order.status]} variant="secondary">
            <StatusIcon className="h-3 w-3 mr-1" />
            {order.status}
          </Badge>
        </div>

        <div className="space-y-1 mb-3">
          {order.items.slice(0, 2).map((item, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {item.quantity}x {item.name}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-muted-foreground">+{order.items.length - 2} more items</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.orderTime).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View order</span>
            </Button>
            {isAdmin && order.status === "pending" && (
              <Button size="sm" onClick={() => onStatusChange("preparing")}>
                <ChefHat className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === "admin" || user?.role === "receptionist"

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Filter orders based on role
  const userOrders = isAdmin
    ? mockFoodOrders
    : mockFoodOrders.filter((o) => o.guestName === user?.name)

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.roomNumber.includes(search) ||
      order.guestName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (id: string, status: string) => {
    toast({
      title: "Status updated",
      description: `Order status changed to ${status}.`,
    })
  }

  const handleView = (order: FoodOrder) => {
    setSelectedOrder(order)
    setDetailsDialogOpen(true)
  }

  // Group orders by status for kanban view (admin only)
  const pendingOrders = filteredOrders.filter((o) => o.status === "pending")
  const preparingOrders = filteredOrders.filter((o) => o.status === "preparing")
  const readyOrders = filteredOrders.filter((o) => o.status === "ready")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Food Orders</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage and track all food orders" : "Track your food orders"}
          </p>
        </div>
      </div>

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
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{readyOrders.length}</p>
                <p className="text-sm text-muted-foreground">Ready</p>
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
                placeholder="Search by room, guest, or order ID..."
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
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban View for Admin */}
      {isAdmin && statusFilter === "all" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending ({pendingOrders.length})
            </h3>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={() => handleView(order)}
                  onStatusChange={(status) => handleStatusChange(order.id, status)}
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
              {preparingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={() => handleView(order)}
                  onStatusChange={(status) => handleStatusChange(order.id, status)}
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
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Ready ({readyOrders.length})
            </h3>
            <div className="space-y-4">
              {readyOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={() => handleView(order)}
                  onStatusChange={(status) => handleStatusChange(order.id, status)}
                  isAdmin={isAdmin}
                />
              ))}
              {readyOrders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No orders ready</p>
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
                    <TableHead>Room</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status]
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>Room {order.roomNumber}</TableCell>
                        <TableCell>{order.guestName}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status]} variant="secondary">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.orderTime).toLocaleString()}</TableCell>
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

            {filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No orders found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onStatusChange={handleStatusChange}
        isAdmin={isAdmin}
      />
    </div>
  )
}
