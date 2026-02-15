"use client"

import React, { useState, useEffect } from "react"
import { Calendar, X, BedDouble, Users, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { adminApi } from "@/lib/api/admin-dashboard"
import { useRouter } from "next/navigation"

interface RoomBookingModalProps {
  room: {
    id: string
    number: string
    type: string
    price: number
    image: string
    capacity?: number
    amenities?: string[]
    floor?: string
    description?: string
    bed_display?: string  // Added bed_display
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingSuccess?: () => void
}

export function RoomBookingModal({ 
  room, 
  open, 
  onOpenChange,
  onBookingSuccess 
}: RoomBookingModalProps) {
  const { toast } = useToast()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [nights, setNights] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCheckIn("")
      setCheckOut("")
      setNights(0)
      setTotalPrice(0)
    }
  }, [open])

  // Calculate nights and total price when dates change
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0) {
        setNights(diffDays)
        setTotalPrice(diffDays * room.price)
      } else {
        setNights(0)
        setTotalPrice(0)
      }
    } else {
      setNights(0)
      setTotalPrice(0)
    }
  }, [checkIn, checkOut, room])

  const handleBookNow = async () => {
    console.log("🔵 Book Now clicked", { room, checkIn, checkOut })
    
    if (!room) {
      toast({
        title: "Error",
        description: "No room selected",
        variant: "destructive"
      })
      return
    }

    if (!room.id) {
      toast({
        title: "Error",
        description: "Invalid room data - missing ID",
        variant: "destructive"
      })
      return
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Dates Required",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      })
      return
    }

    if (nights <= 0) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive"
      })
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkInDate = new Date(checkIn)
    
    if (checkInDate < today) {
      toast({
        title: "Invalid Date",
        description: "Check-in date cannot be in the past",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      // Format dates to YYYY-MM-DD for backend
      const formattedCheckIn = new Date(checkIn).toISOString().split('T')[0]
      const formattedCheckOut = new Date(checkOut).toISOString().split('T')[0]
      
      const reservationData = {
        room_id: room.id,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut
      }
      
      console.log("📤 Sending reservation data:", reservationData)
      
      const response = await adminApi.createReservation(reservationData)
      
      console.log("response", response)

      toast({
        title: "✅ Booking Confirmed",
        description: `Room ${room.number} has been booked from ${formattedCheckIn} to ${formattedCheckOut}`,
      })

      onOpenChange(false)
      
      if (onBookingSuccess) {
        onBookingSuccess()
      }

      setTimeout(() => {
        router.push('/dashboard/reservations')
      }, 1500)

    } catch (error: any) {
      console.error("❌ Booking error:", error)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Room is not available for selected dates"
      
      toast({
        title: "❌ Booking Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BedDouble className="h-6 w-6" />
            Book Room {room.number}
          </DialogTitle>
          <DialogDescription>
            Complete your booking by selecting dates below
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Room Details Card */}
          <div className="bg-accent/30 rounded-xl p-5 flex flex-col md:flex-row gap-5">
            {/* Room Image */}
            <div className="md:w-1/3 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              {room.image && room.image !== "/placeholder-room.jpg" ? (
                <img
                  src={room.image}
                  alt={`Room ${room.number}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BedDouble className="h-16 w-16 text-primary/40" />
              )}
            </div>

            {/* Room Info */}
            <div className="md:w-2/3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Room {room.number}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
                  {/* Display bed configuration */}
                  {room.bed_display && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Bed: {room.bed_display}
                    </p>
                  )}
                </div>
                <Badge className="bg-primary/10 text-primary text-lg px-3 py-1">
                  ${room.price}
                  <span className="text-xs font-normal ml-1">/night</span>
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{room.capacity || 2} guests</span>
                </div>
                {room.floor && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span>Floor {room.floor}</span>
                  </>
                )}
              </div>

              {/* Room Description */}
              {room.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>
              )}

              {/* Amenities Preview */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.amenities.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Date Selection Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Your Stay Dates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check-in" className="text-base">Check-in Date</Label>
                <Input
                  id="check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  className="w-full h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check-out" className="text-base">Check-out Date</Label>
                <Input
                  id="check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  className="w-full h-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          {nights > 0 ? (
            <div className="bg-primary/5 rounded-xl p-5 space-y-3">
              <h4 className="font-medium">Price Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Room rate</span>
                  <span>${room.price} × {nights} nights</span>
                </div>
                <div className="flex items-center justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-accent/30 rounded-xl p-5 text-center text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select check-in and check-out dates to see total price</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookNow}
              disabled={isLoading || !checkIn || !checkOut || nights <= 0}
              className="flex-1 h-12 gap-2 bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}