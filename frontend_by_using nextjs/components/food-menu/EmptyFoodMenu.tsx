"use client"

import React from "react"
import { Package, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyFoodMenuProps {
  onAddClick: () => void
  isAdmin: boolean
  hasFilters: boolean
}

export function EmptyFoodMenu({ onAddClick, isAdmin, hasFilters }: EmptyFoodMenuProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground">No food items found</h3>
        <p className="text-sm text-muted-foreground">
          {hasFilters 
            ? 'Try adjusting your filters' 
            : 'Get started by adding your first food item'}
        </p>
        {isAdmin && !hasFilters && (
          <Button onClick={onAddClick} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </Button>
        )}
      </CardContent>
    </Card>
  )
}