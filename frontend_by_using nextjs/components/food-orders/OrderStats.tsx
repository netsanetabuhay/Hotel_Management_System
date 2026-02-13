"use client"

import React from "react"
import { Clock, ChefHat, CheckCircle, UtensilsCrossed } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface OrderStatsProps {
  pending: number
  preparing: number
  delivered: number
  total: number
  isAdmin: boolean
}

export function OrderStats({ 
  pending, 
  preparing, 
  delivered, 
  total, 
  isAdmin 
}: OrderStatsProps) {
  // For non-admin users, show simplified stats
  if (!isAdmin) {
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{total}</p>
                <p className="text-sm text-muted-foreground">Your Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin stats with all counts
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{preparing}</p>
              <p className="text-sm text-muted-foreground">Preparing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{delivered}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}