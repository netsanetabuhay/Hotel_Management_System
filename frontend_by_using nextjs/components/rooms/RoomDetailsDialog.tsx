"use client"

import React from "react"
import { BedDouble, Calendar, User, Clock, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { adminApi } from "@/lib/api/admin-dashboard"

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-blue-100 text-blue-700",
  booked: "bg-amber-100 text-amber-700",
  reserved: "bg-amber-100 text-amber-700",
  maintenance: "bg-gray-100 text-gray-700",
  cleaning: "bg-purple-100 text-purple-700",
}

interface RoomDetailsDialogProps {
  room: {
    id: string
    number: string
    type: string
    price: number
    status: string
    image: string
    floor?: string
    capacity?: number
    amenities?: string[]
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface BookingInfo {
  guestName: string
  checkIn: string
  checkOut: string
  nights: number
  totalPrice: number
}

export function RoomDetailsDialog({ room, open, onOpenChange }: RoomDetailsDialogProps) {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (room && room.status === 'booked' && open) {
      fetchBookingInfo()
    } else {
      setBookingInfo(null)
    }
  }, [room, open])

  const fetchBookingInfo = async () => {
    if (!room) return
    setLoading(true)
    try {
      const reservations = await adminApi.getReservations({
        room_id: room.id,
        status: 'booked'
      })
      
      if (reservations && reservations.length > 0) {
        const reservation = reservations[0]
        const checkIn = new Date(reservation.check_in)
        const checkOut = new Date(reservation.check_out)
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        
        setBookingInfo({
          guestName: reservation.guest_name || 'Guest',
          checkIn: reservation.check_in,
          checkOut: reservation.check_out,
          nights,
          totalPrice: reservation.total_price || room.price * nights
        })
      }
    } catch (error) {
      console.error('Error fetching booking info:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!room) return null

  const isBooked = room.status === 'booked'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {/* ✅ SINGLE X BUTTON - ONLY ONE! */}
        <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <DialogTitle>Room {room.number}</DialogTitle>
          <DialogDescription>
            {isBooked ? 'Currently booked • View reservation details' : 'Room details and amenities'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Room Image */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <BedDouble className="h-16 w-16 text-primary/40" />
          </div>

          {/* Room Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Room Type</p>
              <p className="font-medium capitalize text-foreground">{room.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className={statusColors[room.status] || "bg-gray-100 text-gray-700"} variant="secondary">
                {room.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Floor</p>
              <p className="font-medium text-foreground">Floor {room.floor || '1'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-medium text-foreground">{room.capacity || 2} guests</p>
            </div>
          </div>

          {/* ✅ BOOKING INFORMATION - NO X BUTTON HERE */}
          {isBooked && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-2">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Current Reservation
              </h4>
              
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading booking details...</p>
              ) : bookingInfo ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{bookingInfo.guestName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Check-in: {new Date(bookingInfo.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Check-out: {new Date(bookingInfo.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{bookingInfo.nights} {bookingInfo.nights === 1 ? 'night' : 'nights'}</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-200 dark:border-amber-800 mt-1.5">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold">${bookingInfo.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No active reservation found</p>
              )}
            </div>
          )}

          {/* Amenities */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Amenities</p>
            <div className="flex flex-wrap gap-1.5">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs px-2 py-0.5">
                    {amenity}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No amenities listed</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="pt-3 border-t">
            <p className="text-xl font-bold text-foreground">
              ${room.price}
              <span className="text-xs font-normal text-muted-foreground">/night</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}