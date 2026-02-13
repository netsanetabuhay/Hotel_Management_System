"use client"

import React from "react"
import { UtensilsCrossed } from "lucide-react"

interface OrderItem {
  id?: number
  food_id?: string
  name?: string
  quantity?: number
  price?: number | string  // Allow string or number
  category?: string
  description?: string
}

interface OrderItemsListProps {
  items?: OrderItem[]
  showHeader?: boolean
}

export function OrderItemsList({ items = [], showHeader = true }: OrderItemsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        <UtensilsCrossed className="h-5 w-5 mr-2" />
        <span className="text-sm">No items in this order</span>
      </div>
    )
  }

  // ✅ FIXED: Convert price to number safely
  const itemsWithNumericPrice = items.map(item => ({
    ...item,
    numericPrice: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0)
  }))

  // Calculate totals using numeric prices
  const totalItems = itemsWithNumericPrice.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const subtotal = itemsWithNumericPrice.reduce((sum, item) => 
    sum + ((item.numericPrice || 0) * (item.quantity || 0)), 0)

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Items ({totalItems})</span>
          <span className="text-muted-foreground">Subtotal: ${subtotal.toFixed(2)}</span>
        </div>
      )}

      <div className="space-y-2">
        {itemsWithNumericPrice.map((item, index) => {
          const itemTotal = (item.numericPrice || 0) * (item.quantity || 0)
          
          return (
            <div 
              key={item.id || index} 
              className="flex items-start justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-foreground">
                    {item.name || 'Unknown Item'}
                  </span>
                </div>
                
                {item.category && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.category}
                  </p>
                )}
                
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
              
              <div className="text-right ml-4">
                <p className="font-medium text-foreground">
                  ${itemTotal.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${(item.numericPrice || 0).toFixed(2)} each
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Row */}
      <div className="pt-2 border-t flex items-center justify-between">
        <span className="font-medium text-foreground">Total</span>
        <span className="font-bold text-foreground">
          ${subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  )
}