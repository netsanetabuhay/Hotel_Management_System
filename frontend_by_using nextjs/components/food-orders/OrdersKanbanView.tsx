"use client"

import React from "react"
import { Clock, ChefHat, CheckCircle } from "lucide-react"
import { OrderCard, type FoodOrder } from "./OrderCard"

interface OrdersKanbanViewProps {
  orders: FoodOrder[]
  onViewOrder: (order: FoodOrder) => void
  isAdmin: boolean
}

export function OrdersKanbanView({ orders, onViewOrder, isAdmin }: OrdersKanbanViewProps) {
  // Group orders by status
  const pendingOrders = orders.filter(o => o.order_status === 'pending')
  const preparingOrders = orders.filter(o => o.order_status === 'preparing')
  const deliveredOrders = orders.filter(o => o.order_status === 'delivered')

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Pending Column */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
            <Clock className="h-3.5 w-3.5 text-amber-700" />
          </div>
          <h3 className="font-semibold text-foreground">
            Pending ({pendingOrders.length})
          </h3>
        </div>
        
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.food_order_id}
              order={order}
              onView={() => onViewOrder(order)}
              isAdmin={isAdmin}
            />
          ))}
          
          {pendingOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-lg bg-accent/5">
              <Clock className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No pending orders
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preparing Column */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
            <ChefHat className="h-3.5 w-3.5 text-blue-700" />
          </div>
          <h3 className="font-semibold text-foreground">
            Preparing ({preparingOrders.length})
          </h3>
        </div>
        
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {preparingOrders.map((order) => (
            <OrderCard
              key={order.food_order_id}
              order={order}
              onView={() => onViewOrder(order)}
              isAdmin={isAdmin}
            />
          ))}
          
          {preparingOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-lg bg-accent/5">
              <ChefHat className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No orders preparing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delivered Column */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
            <CheckCircle className="h-3.5 w-3.5 text-green-700" />
          </div>
          <h3 className="font-semibold text-foreground">
            Delivered ({deliveredOrders.length})
          </h3>
        </div>
        
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {deliveredOrders.map((order) => (
            <OrderCard
              key={order.food_order_id}
              order={order}
              onView={() => onViewOrder(order)}
              isAdmin={isAdmin}
            />
          ))}
          
          {deliveredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-lg bg-accent/5">
              <CheckCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No delivered orders
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}