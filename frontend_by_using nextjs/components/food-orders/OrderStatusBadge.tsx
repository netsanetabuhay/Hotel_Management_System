"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, CheckCircle, XCircle } from "lucide-react"

interface OrderStatusBadgeProps {
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled'
}

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: {
    color: "bg-amber-100 text-amber-700",
    icon: Clock
  },
  preparing: {
    color: "bg-blue-100 text-blue-700",
    icon: ChefHat
  },
  delivered: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle
  },
  cancelled: {
    color: "bg-red-100 text-red-700",
    icon: XCircle
  }
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <Badge className={config.color} variant="secondary">
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  )
}