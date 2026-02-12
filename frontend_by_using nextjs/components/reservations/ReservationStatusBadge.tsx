"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface ReservationStatusBadgeProps {
  status: 'booked' | 'active' | 'completed' | 'cancelled'
}

const statusColors: Record<string, string> = {
  booked: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  return (
    <Badge className={statusColors[status]} variant="secondary">
      {status}
    </Badge>
  )
}