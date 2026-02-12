"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/hooks/use-toast"
import { adminApi } from "@/lib/api/admin-dashboard"
import type { FoodItem } from "./FoodMenuCard"

interface FoodItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: FoodItem | null
  categories: string[]
  onSuccess: () => void
}

// ✅ Predefined categories for better UX
const PREDEFINED_CATEGORIES = [
  "Appetizer",
  "Main Course", 
  "Dessert",
  "Beverage",
  "Side Dish",
  "Soup",
  "Salad",
  "Breakfast",
  "Seafood",
  "Vegetarian",
  "Vegan",
  "Kids Menu"
]

export function FoodItemDialog({
  open,
  onOpenChange,
  item,
  categories,
  onSuccess
}: FoodItemDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image_url: ""
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        description: item.description || "",
        image_url: item.image_url || ""
      })
    } else {
      resetForm()
    }
  }, [item])

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      image_url: ""
    })
    setNewCategory("")
    setShowNewCategory(false)
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await adminApi.uploadImage(file, 'food')
    return result.data.image_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const priceValue = parseFloat(formData.price)
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price greater than 0",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      const foodData = {
        name: formData.name,
        category: formData.category === "_new" ? newCategory : formData.category,
        price: priceValue,
        description: formData.description || null,
        image_url: formData.image_url || null
      }

      if (item) {
        await adminApi.updateFoodItem(item.food_id, foodData)
        toast({
          title: "Success",
          description: "Food item updated successfully",
        })
      } else {
        await adminApi.createFoodItem(foodData)
        toast({
          title: "Success",
          description: "Food item created successfully",
        })
      }

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save food item",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Combine predefined and existing categories, remove duplicates
  const allCategories = Array.from(new Set([...PREDEFINED_CATEGORIES, ...categories]))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the food item details' : 'Enter the details for the new food item'}
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
              placeholder="e.g., Grilled Salmon, Caesar Salad"
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={showNewCategory ? "_new" : formData.category} 
                onValueChange={(value) => {
                  if (value === "_new") {
                    setShowNewCategory(true)
                    setFormData(prev => ({ ...prev, category: "" }))
                  } else {
                    setShowNewCategory(false)
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {allCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  <SelectItem value="_new" className="text-primary font-medium">+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
              {showNewCategory && (
                <Input
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value)
                    setFormData(prev => ({ ...prev, category: e.target.value }))
                  }}
                  className="mt-2"
                  autoFocus
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
                placeholder="12.99"
              />
            </div>
          </div>

          {/* Description - NOW REQUIRED FOR BETTER UX */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Describe the food item - ingredients, preparation, serving size, etc."
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (item ? "Update Item" : "Add Item")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}