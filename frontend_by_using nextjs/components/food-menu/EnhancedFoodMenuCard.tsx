"use client"

import React from "react"
import { Package, Eye, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FoodCategoryBadge } from "./FoodCategoryBadge"
import { FoodPriceBadge } from "./FoodPriceBadge"
import type { FoodItem } from "./FoodMenuCard"

interface EnhancedFoodMenuCardProps {
  item: FoodItem
  onViewDetails: () => void
  onOrderNow: () => void
  onSeeMore: () => void
  onShowAll?: () => void
  showBackButton?: boolean
}

export function EnhancedFoodMenuCard({ 
  item, 
  onViewDetails, 
  onOrderNow,
  onSeeMore,
  onShowAll,
  showBackButton = false
}: EnhancedFoodMenuCardProps) {
  
  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Package className="h-12 w-12 text-primary/30" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons Overlay - See More (category list) & Order Now */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
          <Button 
            variant="secondary"
            className="bg-white text-gray-900 hover:bg-primary hover:text-white transform hover:scale-110 transition-all duration-200 shadow-lg font-medium px-5 py-2 h-auto"
            onClick={onSeeMore}
          >
            See More
          </Button>
          <Button 
            className="bg-primary text-white hover:bg-primary/80 transform hover:scale-110 transition-all duration-200 shadow-lg font-medium px-5 py-2 h-auto"
            onClick={onOrderNow}
          >
            Order Now
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Header with Name, Eye Icon, and Price - NO hover effect on name */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 flex items-center gap-2">
            <h3 className="font-bold text-xl text-foreground line-clamp-1">
              {item.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onViewDetails}
              className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-110"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-2">
            <FoodPriceBadge price={itemPrice} />
          </div>
        </div>

        {/* Category - Blue hover effect */}
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={onSeeMore}
            className="inline-block transition-all duration-200 hover:scale-105 focus:outline-none"
            title={`Click to see all ${item.category} items`}
          >
            <div className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md border border-blue-200 hover:border-blue-700">
              {item.category}
            </div>
          </button>
          
          {/* Show All / Back button */}
          {showBackButton && onShowAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowAll}
              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 h-auto rounded-full transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Show All
            </Button>
          )}
        </div>

        {/* Price value display */}
        <div className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">Price: </span>
          <span className="text-primary font-semibold">${itemPrice.toFixed(2)}</span>
        </div>

        {/* Action Buttons - Below image */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="border-gray-300 hover:border-primary hover:bg-primary/5 hover:text-primary transform hover:scale-105 transition-all duration-200 font-medium"
            onClick={onSeeMore}
          >
            See More
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/80 text-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            onClick={onOrderNow}
          >
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}