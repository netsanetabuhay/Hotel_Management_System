"use client"

import React from "react"
import { MapPin, CreditCard, Calendar, Eye, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { OrderPaymentBadge } from "./OrderPaymentBadge"

export interface FoodOrder {
  food_order_id?: string
  user_id?: string
  order_status?: 'pending' | 'preparing' | 'delivered' | 'cancelled'
  payment_status?: 'paid' | 'unpaid'
  order_place?: string
  created_at?: string
  username?: string
  email?: string
  total?: number
  items?: Array<{
    id?: number
    food_id?: string
    name?: string
    quantity?: number
    price?: number
    category?: string
  }>
}

interface OrderCardProps {
  order: FoodOrder
  onView: () => void
  isAdmin: boolean
}

export function OrderCard({ order, onView, isAdmin }: OrderCardProps) {
  // Format order ID for display
  const displayId = order.food_order_id?.slice(-8) || 'N/A'
  
  // Calculate total items
  const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  
  // Format date
  const orderDate = order.created_at 
    ? new Date(order.created_at).toLocaleDateString() 
    : 'N/A'
  
  const orderTime = order.created_at 
    ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : 'N/A'

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onView}>
      <CardContent className="p-4">
        {/* Header with ID and Status */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">
                #{displayId}
              </span>
              {!isAdmin && order.username && (
                <span className="text-xs text-muted-foreground">
                  • {order.username}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.order_status || 'pending'} />
              {isAdmin && (
                <OrderPaymentBadge status={order.payment_status || 'unpaid'} />
              )}
            </div>
          </div>
          
          {/* Items count badge */}
          {totalItems > 0 && (
            <div className="flex items-center gap-1 text-xs bg-accent px-2 py-1 rounded-full">
              <Package className="h-3 w-3" />
              <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="space-y-2 mb-3">
          {/* Customer name for admin */}
          {isAdmin && order.username && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{order.username}</span>
              {order.email && (
                <span className="text-xs text-muted-foreground">({order.email})</span>
              )}
            </div>
          )}

          {/* Order place */}
          {order.order_place && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground capitalize">
                {order.order_place}
              </span>
            </div>
          )}

          {/* Payment status for non-admin */}
          {!isAdmin && order.payment_status && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground capitalize">
                {order.payment_status}
              </span>
            </div>
          )}

          {/* Date and time */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">
              {orderDate} at {orderTime}
            </span>
          </div>
        </div>

        {/* Footer with Total and View Button */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-lg font-bold text-foreground">
              ${order.total?.toFixed(2) || '0.00'}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}