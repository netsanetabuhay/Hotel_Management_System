"use client"

import React from "react"
import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FoodCategoryBadge } from "./FoodCategoryBadge"
import { FoodPriceBadge } from "./FoodPriceBadge"
import { FoodItemActions } from "./FoodItemActions"

export interface FoodItem {
  food_id: string
  name: string
  category: string
  price: number
  description: string | null
  image_url: string | null
}

interface FoodMenuCardProps {
  item: FoodItem
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
  isAdmin: boolean
}

export function FoodMenuCard({ 
  item, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin 
}: FoodMenuCardProps) {
  
  // ✅ FIXED: Move this INSIDE the component!
  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
            <FoodCategoryBadge category={item.category} />
          </div>
          {/* ✅ Use itemPrice, not item.price */}
          <FoodPriceBadge price={itemPrice} />
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {item.description || 'No description available'}
        </p>

        <FoodItemActions
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdmin={isAdmin}
        />
      </CardContent>
    </Card>
  )
}