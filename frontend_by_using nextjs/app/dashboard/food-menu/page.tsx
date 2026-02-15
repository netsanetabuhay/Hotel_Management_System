"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { adminApi } from '@/lib/api/admin-dashboard'
import { dashboardApi } from '@/lib/api/user-dashboard'
import { useRouter } from 'next/navigation'

// Import existing admin components
import { FoodMenuStats } from '@/components/food-menu/FoodMenuStats'
import { FoodMenuFilters } from '@/components/food-menu/FoodMenuFilters'
import { FoodMenuGrid } from '@/components/food-menu/FoodMenuGrid'
import { FoodItemDialog } from '@/components/food-menu/FoodItemDialog'
import { FoodItemViewDialog } from '@/components/food-menu/FoodItemViewDialog'
import { EmptyFoodMenu } from '@/components/food-menu/EmptyFoodMenu'

// Import new user components
import { EnhancedFoodMenuCard } from '@/components/food-menu/EnhancedFoodMenuCard'
import { OrderNowDialog } from '@/components/food-menu/OrderNowDialog'

import type { FoodItem } from '@/components/food-menu/FoodMenuCard'

export default function FoodMenuPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const isAdmin = user?.role === 'admin'
  
  const [isLoading, setIsLoading] = useState(true)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  
  // Filter states
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Dialog states for admin
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  
  // New dialog states for user ordering
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [itemToOrder, setItemToOrder] = useState<FoodItem | null>(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  // Ref for detecting clicks outside
  const pageRef = useRef<HTMLDivElement>(null)

  // Fetch data
  useEffect(() => {
    fetchFoodItems()
    fetchCategories()
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only for non-admin users and when a category is selected
      if (!isAdmin && categoryFilter !== 'all' && pageRef.current) {
        // Check if click is outside any food card
        const target = event.target as HTMLElement
        const isClickOnCard = target.closest('.group') // Cards have 'group' class
        
        if (!isClickOnCard) {
          // Clicked outside any card - show all categories
          handleShowAll()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAdmin, categoryFilter])

  const fetchFoodItems = async () => {
    try {
      setIsLoading(true)
      const items = await adminApi.getFoodItems()
      setFoodItems(items)
    } catch (error) {
      console.error('Error fetching food items:', error)
      toast({
        title: "Error",
        description: "Failed to load food items",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const cats = await adminApi.getFoodCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Filter items
  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Stats calculation (for admin only)
  const stats = {
    totalItems: foodItems.length,
    totalCategories: categories.length,
    averagePrice: foodItems.length > 0 
      ? foodItems.reduce((sum, item) => sum + item.price, 0) / foodItems.length 
      : 0
  }

  // Admin Handlers
  const handleViewDetails = (item: FoodItem) => {
    setSelectedItem(item)
    setViewDialogOpen(true)
  }

  const handleEdit = (item: FoodItem) => {
    setSelectedItem(item)
    setEditDialogOpen(true)
  }

  const handleDelete = async (item: FoodItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return

    try {
      await adminApi.deleteFoodItem(item.food_id)
      toast({
        title: "Success",
        description: "Food item deleted successfully",
      })
      await fetchFoodItems()
      await fetchCategories()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete food item",
        variant: "destructive"
      })
    }
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setAddDialogOpen(true)
  }

  const handleSuccess = () => {
    fetchFoodItems()
    fetchCategories()
  }

  // User Handlers
  const handleOrderNow = (item: FoodItem) => {
    setItemToOrder(item)
    setOrderDialogOpen(true)
  }

  const handleSeeMore = (category: string) => {
    setCategoryFilter(category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShowAll = () => {
    setCategoryFilter('all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmOrder = async (orderData: { order_place: string; quantity: number }) => {
    if (!itemToOrder || !user) return

    setIsSubmittingOrder(true)
    try {
      const orderPayload = {
        order_place: orderData.order_place,
        items: [
          {
            food_id: itemToOrder.food_id,
            quantity: orderData.quantity
          }
        ]
      }

      await dashboardApi.createFoodOrder(orderPayload)
      
      toast({
        title: "Success!",
        description: "Your order has been placed successfully",
      })

      setOrderDialogOpen(false)
      setItemToOrder(null)
      router.push('/dashboard/food-orders')
      
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to place order",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const hasFilters = search !== '' || categoryFilter !== 'all'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Food Menu</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage restaurant menu items' : 'Browse our delicious menu'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </Button>
        )}
      </div>

      {/* Stats - Only for admin */}
      {isAdmin && (
        <FoodMenuStats
          totalItems={stats.totalItems}
          totalCategories={stats.totalCategories}
          averagePrice={stats.averagePrice}
          isAdmin={isAdmin}
        />
      )}

      {/* Filters - Same for both */}
      <FoodMenuFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />

      {/* Food Items Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyFoodMenu
          onAddClick={handleAddNew}
          isAdmin={isAdmin}
          hasFilters={hasFilters}
        />
      ) : (
        <>
          {isAdmin ? (
            /* Admin View - Keep existing grid */
            <FoodMenuGrid
              items={filteredItems}
              onView={(item) => handleViewDetails(item)}
              onEdit={(item) => handleEdit(item)}
              onDelete={(item) => handleDelete(item)}
              isAdmin={isAdmin}
            />
          ) : (
            /* User View - Enhanced grid with new structure */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <EnhancedFoodMenuCard
                  key={item.food_id}
                  item={item}
                  onViewDetails={() => handleViewDetails(item)}
                  onOrderNow={() => handleOrderNow(item)}
                  onSeeMore={() => handleSeeMore(item.category)}
                  onShowAll={handleShowAll}
                  showBackButton={categoryFilter !== 'all'}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Admin Dialogs */}
      <FoodItemDialog
        open={addDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAddDialogOpen(false)
            setEditDialogOpen(false)
            setSelectedItem(null)
          }
        }}
        item={selectedItem}
        categories={categories}
        onSuccess={handleSuccess}
      />

      <FoodItemViewDialog
        item={selectedItem}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        isAdmin={isAdmin}
        onEdit={isAdmin && selectedItem ? () => {
          setViewDialogOpen(false)
          setEditDialogOpen(true)
        } : undefined}
      />

      {/* User Order Dialog */}
      <OrderNowDialog
        item={itemToOrder}
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        onConfirm={handleConfirmOrder}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  )
}