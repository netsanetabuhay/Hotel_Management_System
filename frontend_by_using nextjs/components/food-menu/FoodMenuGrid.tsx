"use client"

import React from "react"
import { FoodMenuCard, type FoodItem } from "./FoodMenuCard"

interface FoodMenuGridProps {
  items: FoodItem[]
  onView: (item: FoodItem) => void
  onEdit?: (item: FoodItem) => void
  onDelete?: (item: FoodItem) => void
  isAdmin: boolean
}

export function FoodMenuGrid({
  items,
  onView,
  onEdit,
  onDelete,
  isAdmin
}: FoodMenuGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <FoodMenuCard
          key={item.food_id}
          item={item}
          onView={() => onView(item)}
          onEdit={onEdit ? () => onEdit(item) : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )
}