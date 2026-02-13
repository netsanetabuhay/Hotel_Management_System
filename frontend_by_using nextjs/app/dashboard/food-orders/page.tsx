"use client"

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { adminApi } from '@/lib/api/admin-dashboard'
import { dashboardApi } from '@/lib/api/user-dashboard'

// Import components
import { OrderStats } from '@/components/food-orders/OrderStats'
import { OrderFilters } from '@/components/food-orders/OrderFilters'
import { OrdersKanbanView } from '@/components/food-orders/OrdersKanbanView'
import { OrdersTableView } from '@/components/food-orders/OrdersTableView'
import { OrderDetailsDialog } from '@/components/food-orders/OrderDetailsDialog'
import { EmptyOrderState } from '@/components/food-orders/EmptyOrderState'
import type { FoodOrder } from '@/components/food-orders/OrderCard'

export default function FoodOrdersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === 'admin'
  
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<FoodOrder[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    delivered: 0,
    total: 0
  })
  
  // Filter states
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Fetch orders
  useEffect(() => {
    fetchOrders()
  }, [])

  // Fetch stats for admin
  useEffect(() => {
    if (isAdmin) {
      fetchStats()
    }
  }, [orders, isAdmin])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      
      let fetchedOrders: FoodOrder[] = []
      
      if (isAdmin) {
        fetchedOrders = await adminApi.getFoodOrders()
      } else {
        fetchedOrders = await dashboardApi.getUserFoodOrders(user?.user_id || '')
      }
      
      setOrders(fetchedOrders)
      
      if (!isAdmin) {
        setStats({
          pending: fetchedOrders.filter(o => o.order_status === 'pending').length,
          preparing: fetchedOrders.filter(o => o.order_status === 'preparing').length,
          delivered: fetchedOrders.filter(o => o.order_status === 'delivered').length,
          total: fetchedOrders.length
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const orderStats = await adminApi.getFoodOrderStats()
      
      if (orderStats?.byStatus) {
        const pendingCount = orderStats.byStatus.find((s: any) => s.order_status === 'pending')?.count || 0
        const preparingCount = orderStats.byStatus.find((s: any) => s.order_status === 'preparing')?.count || 0
        const deliveredCount = orderStats.byStatus.find((s: any) => s.order_status === 'delivered')?.count || 0
        
        setStats({
          pending: pendingCount,
          preparing: preparingCount,
          delivered: deliveredCount,
          total: orders.length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = search === '' || (
      order.food_order_id?.toLowerCase().includes(search.toLowerCase()) ||
      (isAdmin && order.username?.toLowerCase().includes(search.toLowerCase())) ||
      (isAdmin && order.email?.toLowerCase().includes(search.toLowerCase()))
    )
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Group orders by status
  const pendingOrders = filteredOrders.filter(o => o.order_status === 'pending')
  const preparingOrders = filteredOrders.filter(o => o.order_status === 'preparing')
  const deliveredOrders = filteredOrders.filter(o => o.order_status === 'delivered')

  // ============= HANDLERS =============
  const handleViewOrder = (order: FoodOrder) => {
    setSelectedOrder(order)
    setDetailsDialogOpen(true)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!isAdmin) return
    try {
      await adminApi.updateFoodOrderStatus(orderId, newStatus)
      toast({
        title: 'Success',
        description: `Order status updated to ${newStatus}`,
      })
      await fetchOrders()
      if (isAdmin) await fetchStats()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update order status',
        variant: 'destructive'
      })
      throw error
    }
  }

  // ✅ ADD THIS HANDLER - for payment updates
  const handlePaymentUpdate = async (orderId: string, paymentStatus: string) => {
    if (!isAdmin) return
    try {
      await adminApi.updateFoodOrderPayment(orderId, paymentStatus)
      toast({
        title: 'Success',
        description: `Payment status updated to ${paymentStatus}`,
      })
      await fetchOrders()
      if (isAdmin) await fetchStats()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update payment status',
        variant: 'destructive'
      })
      throw error
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!isAdmin) return
    try {
      await adminApi.deleteFoodOrder(orderId)
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      })
      await fetchOrders()
      if (isAdmin) await fetchStats()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete order',
        variant: 'destructive'
      })
    }
  }

  const showKanbanView = isAdmin && statusFilter === 'all'
  const hasFilters = search !== '' || statusFilter !== 'all'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <OrderStats
        pending={stats.pending}
        preparing={stats.preparing}
        delivered={stats.delivered}
        total={isAdmin ? orders.length : stats.total}
        isAdmin={isAdmin}
      />

      {/* Filters */}
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isAdmin={isAdmin}
      />

      {/* Orders Display */}
      {filteredOrders.length === 0 ? (
        <EmptyOrderState
          hasFilters={hasFilters}
          isAdmin={isAdmin}
        />
      ) : (
        <>
          {showKanbanView ? (
            <OrdersKanbanView
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              isAdmin={isAdmin}
            />
          ) : (
            <OrdersTableView
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              isAdmin={isAdmin}
            />
          )}
        </>
      )}

      {/* Order Details Dialog - WITH PAYMENT UPDATE PROP */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        isAdmin={isAdmin}
        onStatusUpdate={isAdmin ? handleStatusUpdate : undefined}
        onPaymentUpdate={isAdmin ? handlePaymentUpdate : undefined} // ✅ THIS LINE NEEDS TO BE ADDED
        onDelete={isAdmin ? handleDeleteOrder : undefined}
      />
    </div>
  )
}