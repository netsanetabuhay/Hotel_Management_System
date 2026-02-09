"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Package, Edit2, Trash2, Eye, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { adminApi, type FoodItem } from '@/lib/api/admin-dashboard'
import { toast } from 'sonner'

export default function FoodMenuPage() {
  const { user, token } = useAuth()
  const { toast: uiToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: ''
  })

  useEffect(() => {
    if (user && token) {
      fetchFoodItems()
      fetchCategories()
    }
  }, [user, token])

  const fetchFoodItems = async () => {
    try {
      setIsLoading(true)
      const items = await adminApi.getFoodItems(token!)
      setFoodItems(items)
    } catch (error) {
      console.error('Error fetching food items:', error)
      toast.error('Failed to load food items')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const cats = await adminApi.getFoodCategories(token!)
      setCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await adminApi.uploadImage(file, 'food', token!)
    return result.data.image_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const foodData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description || null,
        image_url: formData.image_url || null
      }

      if (selectedItem) {
        // Update existing item
        await adminApi.updateFoodItem(selectedItem.food_id, foodData, token!)
        toast.success('Food item updated successfully')
      } else {
        // Create new item
        await adminApi.createFoodItem(foodData, token!)
        toast.success('Food item created successfully')
      }

      // Refresh data
      await fetchFoodItems()
      
      // Reset form and close dialog
      resetForm()
      setAddDialogOpen(false)
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Error saving food item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save food item')
    }
  }

  const handleDelete = async (item: FoodItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return

    try {
      await adminApi.deleteFoodItem(item.food_id, token!)
      toast.success('Food item deleted successfully')
      await fetchFoodItems()
    } catch (error) {
      console.error('Error deleting food item:', error)
      toast.error('Failed to delete food item')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      image_url: ''
    })
    setSelectedItem(null)
  }

  const handleEdit = (item: FoodItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
      image_url: item.image_url || ''
    })
    setEditDialogOpen(true)
  }

  const handleView = (item: FoodItem) => {
    setSelectedItem(item)
    setViewDialogOpen(true)
  }

  const handleAddNew = () => {
    resetForm()
    setAddDialogOpen(true)
  }

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

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
          <h1 className="text-3xl font-bold text-foreground">Food Menu</h1>
          <p className="text-muted-foreground mt-1">Manage restaurant menu items</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search food items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Food Items Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No food items found</h3>
            <p className="text-sm text-muted-foreground">
              {search || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first food item'}
            </p>
            {user?.role === 'admin' && (
              <Button onClick={handleAddNew} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Food Item
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <Card key={item.food_id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video overflow-hidden bg-gray-100">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    ${item.price.toFixed(2)}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description || 'No description available'}
                </p>

                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  {user?.role === 'admin' && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Food Item Dialog */}
      <Dialog open={addDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update the food item details' : 'Enter the details for the new food item'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <ImageUpload
              value={formData.image_url}
              onChange={(value) => setFormData(prev => ({ ...prev, image_url: value || '' }))}
              onUpload={handleImageUpload}
              uploadType="food"
            />

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    <SelectItem value="_new">+ Add New Category</SelectItem>
                  </SelectContent>
                </Select>
                {formData.category === '_new' && (
                  <Input
                    placeholder="Enter new category name"
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-2"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddDialogOpen(false)
                  setEditDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedItem ? 'Update Food Item' : 'Add Food Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Food Item Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>Food item details</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.image_url && (
                <div className="aspect-video overflow-hidden rounded-lg border">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize text-foreground">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-foreground">${selectedItem.price.toFixed(2)}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-foreground">{selectedItem.description}</p>
                </div>
              )}
              {selectedItem.created_at && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Added on {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}