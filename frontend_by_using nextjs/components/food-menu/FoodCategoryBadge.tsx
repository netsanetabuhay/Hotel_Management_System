"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface FoodCategoryBadgeProps {
  category: string
}

const categoryColors: Record<string, string> = {
  appetizer: "bg-blue-100 text-blue-700",
  main: "bg-emerald-100 text-emerald-700",
  dessert: "bg-purple-100 text-purple-700",
  beverage: "bg-amber-100 text-amber-700",
  side: "bg-gray-100 text-gray-700",
}

export function FoodCategoryBadge({ category }: FoodCategoryBadgeProps) {
  const colorClass = categoryColors[category.toLowerCase()] || "bg-gray-100 text-gray-700"
  
  return (
    <Badge className={colorClass} variant="secondary">
      {category}
    </Badge>
  )
}