"use client"

import React from "react"
import { Package, Tag, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FoodMenuStatsProps {
  totalItems: number
  totalCategories: number
  averagePrice: number
  isAdmin: boolean
}

export function FoodMenuStats({ 
  totalItems, 
  totalCategories, 
  averagePrice, 
  isAdmin 
}: FoodMenuStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalItems}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCategories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isAdmin && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${averagePrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Average Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}