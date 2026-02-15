"use client"

import React, { useState, useEffect } from "react"
import { Package, Calendar, Clock, Tag, DollarSign, Edit3, Utensils, Flame } from "lucide-react"
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
import { Card, CardContent } from "@/components/ui/card"
import { FoodCategoryBadge } from "./FoodCategoryBadge"
import { FoodPriceBadge } from "./FoodPriceBadge"
import { adminApi } from "@/lib/api/admin-dashboard"
import type { FoodItem } from "./FoodMenuCard"
import { useRouter } from "next/navigation"

interface FoodItemViewDialogProps {
  item: FoodItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  isAdmin?: boolean
}

export function FoodItemViewDialog({ 
  item, 
  open, 
  onOpenChange,
  onEdit,
  isAdmin = false
}: FoodItemViewDialogProps) {
  const router = useRouter()
  const [similarItems, setSimilarItems] = useState<FoodItem[]>([])
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false)

  useEffect(() => {
    if (item && open) {
      fetchSimilarItems()
    }
  }, [item, open])

  const fetchSimilarItems = async () => {
    if (!item) return
    
    setIsLoadingSimilar(true)
    try {
      const allItems = await adminApi.getFoodItems()
      // Get items with same category, excluding current item, limit to 3
      const similar = allItems
        .filter(f => f.category === item.category && f.food_id !== item.food_id)
        .slice(0, 3)
      setSimilarItems(similar)
    } catch (error) {
      console.error('Error fetching similar items:', error)
    } finally {
      setIsLoadingSimilar(false)
    }
  }

  const handleItemClick = (clickedItem: FoodItem) => {
    // Close current dialog and open new one with clicked item
    onOpenChange(false)
    // Small delay to allow dialog to close before opening new one
    setTimeout(() => {
      // This would need to be handled by parent component
      // For now, we'll just navigate or refresh
    }, 300)
  }

  const handleOrderNow = (orderItem: FoodItem) => {
    onOpenChange(false)
    // Navigate to food menu with order dialog open for this item
    router.push(`/dashboard/food-menu?order=${orderItem.food_id}`)
  }

  if (!item) return null

  // Mock additional data - in real app, fetch from backend
  const additionalInfo = {
    timesOrdered: Math.floor(Math.random() * 50) + 10,
    lastOrdered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    preparationTime: '15-20 min',
    calories: Math.floor(Math.random() * 300) + 200,
    isPopular: Math.random() > 0.5,
    isAvailable: true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <FoodCategoryBadge category={item.category} />
            {additionalInfo.isPopular && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                <Flame className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-video overflow-hidden rounded-lg border bg-gray-50">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <FoodPriceBadge price={item.price} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={additionalInfo.isAvailable ? "default" : "secondary"}>
                    {additionalInfo.isAvailable ? 'Available' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-accent/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">Prep Time</span>
                  </div>
                  <p className="font-medium text-sm">{additionalInfo.preparationTime}</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Utensils className="h-3 w-3" />
                    <span className="text-xs">Calories</span>
                  </div>
                  <p className="font-medium text-sm">{additionalInfo.calories} kcal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Description
            </h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-foreground whitespace-pre-wrap">
                {item.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Additional Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {additionalInfo.timesOrdered}
              </p>
              <p className="text-xs text-muted-foreground">Times Ordered</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {item.food_id?.slice(-4) || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">Item ID</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {additionalInfo.lastOrdered}
              </p>
              <p className="text-xs text-muted-foreground">Last Ordered</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${item.price.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Unit Price</p>
            </div>
          </div>

          {/* Similar Items Section */}
          {similarItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                More in {item.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarItems.map((similar) => (
                  <Card key={similar.food_id} className="overflow-hidden hover:shadow-lg transition-all group">
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      {similar.image_url ? (
                        <img
                          src={similar.image_url}
                          alt={similar.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm line-clamp-1">{similar.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <FoodPriceBadge price={similar.price} />
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 text-xs hover:scale-105 transition-transform"
                          onClick={() => handleOrderNow(similar)}
                        >
                          Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Edit Button for Admin */}
          {isAdmin && onEdit && (
            <div className="flex justify-end pt-2">
              <Button onClick={onEdit} className="gap-2 hover:scale-105 transition-transform">
                <Edit3 className="h-4 w-4" />
                Edit Food Item
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}