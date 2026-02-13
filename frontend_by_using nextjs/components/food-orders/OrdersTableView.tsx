"use client"

import React from "react"
import { Eye, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { OrderPaymentBadge } from "./OrderPaymentBadge"
import type { FoodOrder } from "./OrderCard"

interface OrdersTableViewProps {
  orders: FoodOrder[]
  onViewOrder: (order: FoodOrder) => void
  isAdmin: boolean
}

export function OrdersTableView({ orders, onViewOrder, isAdmin }: OrdersTableViewProps) {
  // Calculate total items for each order
  const ordersWithTotals = orders.map(order => ({
    ...order,
    totalItems: order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  }))

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
            </CardDescription>
          </div>
          {!isAdmin && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Your order history</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">Order ID</TableHead>
                {isAdmin && <TableHead>Customer</TableHead>}
                <TableHead>Delivery Type</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Payment</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersWithTotals.map((order) => (
                <TableRow 
                  key={order.food_order_id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onViewOrder(order)}
                >
                  <TableCell className="font-medium">
                    #{order.food_order_id?.slice(-8) || 'N/A'}
                  </TableCell>
                  
                  {isAdmin && (
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {order.username || 'N/A'}
                        </p>
                        {order.email && (
                          <p className="text-xs text-muted-foreground">
                            {order.email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  )}
                  
                  <TableCell className="capitalize">
                    {order.order_place || 'N/A'}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-xs font-medium">
                      <Package className="h-3 w-3" />
                      {order.totalItems}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-right font-medium">
                    ${order.total?.toFixed(2) || '0.00'}
                  </TableCell>
                  
                  <TableCell>
                    <OrderStatusBadge status={order.order_status || 'pending'} />
                  </TableCell>
                  
                  {isAdmin && (
                    <TableCell>
                      <OrderPaymentBadge status={order.payment_status || 'unpaid'} />
                    </TableCell>
                  )}
                  
                  <TableCell>
                    {order.created_at 
                      ? new Date(order.created_at).toLocaleDateString() 
                      : 'N/A'
                    }
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewOrder(order)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View order</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}