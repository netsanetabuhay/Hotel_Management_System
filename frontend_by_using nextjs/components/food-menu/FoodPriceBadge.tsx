"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface FoodPriceBadgeProps {
  price: number | string
}

export function FoodPriceBadge({ price }: FoodPriceBadgeProps) {
  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
  return (
    <Badge variant="secondary" className="bg-primary/10 text-primary">
      ${numericPrice.toFixed(2)}
    </Badge>
  )
}