"use client"

import React from "react"
import { UtensilsCrossed } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface EmptyOrderStateProps {
  hasFilters: boolean
  isAdmin: boolean
}

export function EmptyOrderState({ hasFilters, isAdmin }: EmptyOrderStateProps) {
  const router = useRouter()

  const handleOrderFood = () => {
    router.push('/dashboard/food-menu')
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <UtensilsCrossed className="h-12 w-12 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No orders found
        </h3>
        
        <p className="text-muted-foreground text-center max-w-md mb-8">
          {hasFilters 
            ? 'Try adjusting your search or filters to find what you\'re looking for.'
            : isAdmin 
              ? 'There are no food orders in the system yet. Orders will appear here once customers place them.'
              : 'You haven\'t placed any food orders yet. Browse our menu and order your favorite meals!'
          }
        </p>

        {!isAdmin && !hasFilters && (
          <Button 
            onClick={handleOrderFood}
            size="lg"
            className="gap-2"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Order Food Now
          </Button>
        )}

        {isAdmin && !hasFilters && (
          <div className="text-sm text-muted-foreground">
            <p>Orders will appear here in real-time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}