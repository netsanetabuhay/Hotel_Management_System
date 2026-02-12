"use client"

import React from "react"
import { Clock, CheckCircle, CalendarCheck, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ReservationStatsProps {
  booked: number
  active: number
  checkedIn: number
  totalRevenue: number
  isAdmin: boolean  // Only show revenue to admin
}

export function ReservationStats({ 
  booked, 
  active, 
  checkedIn, 
  totalRevenue, 
  isAdmin 
}: ReservationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{booked}</p>
              <p className="text-sm text-muted-foreground">Booked</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{checkedIn}</p>
              <p className="text-sm text-muted-foreground">Checked In</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isAdmin && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}