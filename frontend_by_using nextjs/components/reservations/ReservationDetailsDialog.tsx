"use client"

import React from "react"
import { useState } from "react"
import { Calendar, User, BedDouble, CheckCircle, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ReservationStatusBadge } from "./ReservationStatusBadge"
import { PaymentStatusBadge } from "./PaymentStatusBadge"

interface Reservation {
  room_order_id: string
  user_id: string
  room_id: string
  check_in: string
  check_out: string
  status: 'booked' | 'active' | 'completed' | 'cancelled'
  payment_status: 'paid' | 'unpaid'
  created_at: string
  room_number?: string
  room_type?: string
  guest_name?: string
  guest_email?: string
  total_price?: number
}

interface ReservationDetailsDialogProps {
  reservation: Reservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: string) => Promise<void>
}

export function ReservationDetailsDialog({
  reservation,
  open,
  onOpenChange,
  onStatusChange,
}: ReservationDetailsDialogProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  if (!reservation) return null

  const handleStatusUpdate = async (status: string) => {
    try {
      setIsUpdating(true)
      await onStatusChange(reservation.room_order_id, status)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
          <DialogDescription>Booking #{reservation.room_order_id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Guest
              </p>
              <p className="font-medium text-foreground">{reservation.guest_name || 'Guest'}</p>
              <p className="text-sm text-muted-foreground">{reservation.guest_email || ''}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <BedDouble className="h-4 w-4" /> Room
              </p>
              <p className="font-medium text-foreground">Room {reservation.room_number || reservation.room_id}</p>
              <p className="text-sm text-muted-foreground capitalize">{reservation.room_type || 'Standard'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Check-in
              </p>
              <p className="font-medium text-foreground">{new Date(reservation.check_in).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Check-out
              </p>
              <p className="font-medium text-foreground">{new Date(reservation.check_out).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <ReservationStatusBadge status={reservation.status} />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment</p>
              <PaymentStatusBadge status={reservation.payment_status} />
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">
                ${reservation.total_price?.toLocaleString() || '0.00'}
              </p>
            </div>
            <div className="flex gap-2">
              {reservation.status === "booked" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate("active")}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Check In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={isUpdating}
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}
              {reservation.status === "active" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={isUpdating}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}