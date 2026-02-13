"use client"

import React from "react"
import { useState } from "react"
import { 
  X, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  ChefHat, 
  CheckCircle, 
  Trash2,
  AlertCircle,
  DollarSign
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { OrderPaymentBadge } from "./OrderPaymentBadge"
import { OrderItemsList } from "./OrderItemsList"
import type { FoodOrder } from "./OrderCard"

interface OrderDetailsDialogProps {
  order: FoodOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
  onStatusUpdate?: (orderId: string, status: string) => Promise<void>
  onPaymentUpdate?: (orderId: string, paymentStatus: string) => Promise<void>
  onDelete?: (orderId: string) => Promise<void>
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  isAdmin,
  onStatusUpdate,
  onPaymentUpdate,
  onDelete
}: OrderDetailsDialogProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('')

  // ✅ FIXED: Move useEffect to TOP LEVEL, never conditional
  React.useEffect(() => {
    if (order?.payment_status) {
      setSelectedPaymentStatus(order.payment_status)
    }
  }, [order])

  if (!order) return null

  const displayId = order.food_order_id?.slice(-8) || 'N/A'
  const orderDate = order.created_at 
    ? new Date(order.created_at).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A'
  
  const orderTime = order.created_at
    ? new Date(order.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A'

  const handleStatusUpdate = async (newStatus: string) => {
    if (!onStatusUpdate || !order.food_order_id) return
    
    try {
      setIsUpdating(true)
      await onStatusUpdate(order.food_order_id, newStatus)
      toast({
        title: "Status Updated",
        description: `Order #${displayId} is now ${newStatus}.`,
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentUpdate = async () => {
    if (!onPaymentUpdate || !order.food_order_id || !selectedPaymentStatus) return
    if (selectedPaymentStatus === order.payment_status) {
      toast({
        title: "No Change",
        description: "Payment status is already set to this value.",
      })
      return
    }
    
    try {
      setIsUpdatingPayment(true)
      await onPaymentUpdate(order.food_order_id, selectedPaymentStatus)
      toast({
        title: "Payment Updated",
        description: `Order #${displayId} payment status is now ${selectedPaymentStatus}.`,
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingPayment(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !order.food_order_id) return
    
    if (!confirm(`Are you sure you want to delete Order #${displayId}? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      await onDelete(order.food_order_id)
      toast({
        title: "Order Deleted",
        description: `Order #${displayId} has been deleted.`,
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Determine next status for workflow
  const getNextStatus = () => {
    switch (order.order_status) {
      case 'pending': return 'preparing'
      case 'preparing': return 'delivered'
      default: return null
    }
  }

  const nextStatus = getNextStatus()
  const canUpdate = isAdmin && nextStatus && onStatusUpdate
  const canDelete = isAdmin && onDelete && order.order_status !== 'delivered'
  const canUpdatePayment = isAdmin && onPaymentUpdate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                Order #{displayId}
                {!isAdmin && order.order_status === 'pending' && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Preparing soon
                  </Badge>
                )}
              </DialogTitle>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <OrderStatusBadge status={order.order_status || 'pending'} />
                {isAdmin && (
                  <OrderPaymentBadge status={order.payment_status || 'unpaid'} />
                )}
              </div>
            </div>
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-accent/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{order.username || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{order.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Details
              </h4>
              <p className="font-medium text-foreground capitalize">
                {order.order_place || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Order type
              </p>
            </div>

            <div className="bg-accent/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </h4>
              <p className="font-medium text-foreground capitalize">
                {order.payment_status || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Payment status
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-accent/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Order Timeline
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">{orderDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium text-foreground">{orderTime}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-accent/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="text-lg">🍽️</span>
              Ordered Items
            </h4>
            <OrderItemsList items={order.items} />
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="space-y-4">
              <Separator />
              
              {/* Status Update Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Order Status
                </h4>
                
                {canUpdate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {order.order_status === 'pending' && (
                        <>
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-sm text-muted-foreground">
                            Order is waiting to be prepared
                          </span>
                        </>
                      )}
                      {order.order_status === 'preparing' && (
                        <>
                          <ChefHat className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-muted-foreground">
                            Order is being prepared
                          </span>
                        </>
                      )}
                    </div>
                    <Button
                      onClick={() => handleStatusUpdate(nextStatus)}
                      disabled={isUpdating}
                      className={`
                        ${order.order_status === 'pending' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        ${order.order_status === 'preparing' ? 'bg-green-600 hover:bg-green-700' : ''}
                      `}
                    >
                      {isUpdating ? (
                        <>Updating...</>
                      ) : (
                        <>
                          {order.order_status === 'pending' && 'Start Preparing'}
                          {order.order_status === 'preparing' && 'Mark as Delivered'}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Status Update Section */}
              {canUpdatePayment && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment Status
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Current: <span className="font-medium capitalize">{order.payment_status || 'unpaid'}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedPaymentStatus}
                        onValueChange={setSelectedPaymentStatus}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePaymentUpdate}
                        disabled={isUpdatingPayment || !selectedPaymentStatus || selectedPaymentStatus === order.payment_status}
                      >
                        {isUpdatingPayment ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Button */}
              {canDelete && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Danger Zone
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Permanently delete this order
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? 'Deleting...' : 'Delete Order'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Completed Order Message */}
              {order.order_status === 'delivered' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">
                    This order has been delivered and completed.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Non-Admin View */}
          {!isAdmin && order.order_status === 'delivered' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">
                Your order has been delivered. Enjoy your meal!
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}