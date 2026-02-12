"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface PaymentStatusBadgeProps {
  status: 'paid' | 'unpaid'
}

const paymentColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-amber-100 text-amber-700",
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <Badge className={paymentColors[status]} variant="secondary">
      {status}
    </Badge>
  )
}