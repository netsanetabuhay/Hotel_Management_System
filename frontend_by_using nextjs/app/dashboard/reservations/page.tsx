"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { adminApi } from '@/lib/api/admin-dashboard'

// Import components
import { FoodMenuStats } from '@/components/food-menu/FoodMenuStats'
import { FoodMenuFilters } from '@/components/food-menu/FoodMenuFilters'
import { FoodMenuGrid } from '@/components/food-menu/FoodMenuGrid'
import { FoodItemDialog } from '@/components/food-menu/FoodItemDialog'
import { FoodItemViewDialog } from '@/components/food-menu/FoodItemViewDialog'
import { EmptyFoodMenu } from '@/components/food-menu/EmptyFoodMenu'
import type { FoodItem } from '@/components/food-menu/FoodMenuCard'

export default function FoodMenuPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === 'admin'
  
  const [isLoading, setIsLoading] = useState(true)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  
  // Filter states
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)

  // Fetch data
  useEffect(() => {
    fetchFoodItems()
    fetchCategories()
  }, [])

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

  // Stats calculation
  const stats = {
    totalItems: foodItems.length,
    totalCategories: categories.length,
    averagePrice: foodItems.length > 0 
      ? foodItems.reduce((sum, item) => sum + item.price, 0) / foodItems.length 
      : 0
  }

  // Handlers
  const handleView = (item: FoodItem) => {
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

  const hasFilters = search !== '' || categoryFilter !== 'all'

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
          <h1 className="text-3xl font-bold text-foreground">Food Menu</h1>
          <p className="text-muted-foreground mt-1">Manage restaurant menu items</p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </Button>
        )}
      </div>

      {/* Stats */}
      <FoodMenuStats
        totalItems={stats.totalItems}
        totalCategories={stats.totalCategories}
        averagePrice={stats.averagePrice}
        isAdmin={isAdmin}
      />

      {/* Filters */}
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
        <FoodMenuGrid
          items={filteredItems}
          onView={handleView}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          isAdmin={isAdmin}
        />
      )}

      {/* Add/Edit Dialog */}
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

      {/* ✅ View Dialog - FIXED with proper onEdit handler */}
      <FoodItemViewDialog
        item={selectedItem}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onEdit={() => {
          // Close view dialog first
          setViewDialogOpen(false)
          // Then open edit dialog with the same item
          if (selectedItem) {
            setEditDialogOpen(true)
          }
        }}
        isAdmin={isAdmin}
      />
    </div>
  )
}