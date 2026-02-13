"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Ban } from "lucide-react"

interface OrderPaymentBadgeProps {
  status: 'paid' | 'unpaid'
}

const paymentConfig: Record<string, { color: string; icon: React.ElementType }> = {
  paid: {
    color: "bg-green-100 text-green-700",
    icon: CreditCard
  },
  unpaid: {
    color: "bg-amber-100 text-amber-700",
    icon: Ban
  }
}

export function OrderPaymentBadge({ status }: OrderPaymentBadgeProps) {
  const config = paymentConfig[status] || paymentConfig.unpaid
  const Icon = config.icon

  return (
    <Badge variant={status === 'paid' ? 'default' : 'outline'} className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  )
}