"use client"

import React from "react"
import { BedDouble, Users, Wifi, Tv, Wind, Wine, Eye, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RoomCardProps {
  room: {
    id: string
    number: string
    type: string
    price: number
    status: string  // This is current_status from RoomsPage
    image: string
    floor?: string
    capacity?: number
    amenities?: string[]
  }
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  isAdmin: boolean
  isDeleting?: boolean
}

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  TV: Tv,
  AC: Wind,
  "Mini Bar": Wine,
}

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-blue-100 text-blue-700",
  booked: "bg-amber-100 text-amber-700",
  reserved: "bg-amber-100 text-amber-700",
  maintenance: "bg-gray-100 text-gray-700",
  cleaning: "bg-purple-100 text-purple-700",
}

const typeColors: Record<string, string> = {
  single: "bg-gray-100 text-gray-700",
  double: "bg-blue-100 text-blue-700",
  suite: "bg-purple-100 text-purple-700",
  deluxe: "bg-amber-100 text-amber-700",
  standard: "bg-gray-100 text-gray-700",
  penthouse: "bg-emerald-100 text-emerald-700",
}

export function RoomCard({ 
  room, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin,
  isDeleting = false
}: RoomCardProps) {
  
  // ✅ Capacity based on room type
  let capacity = 2;
  const roomType = room.type?.toLowerCase() || '';
  
  if (roomType === 'single') {
    capacity = 1;
  } else if (roomType === 'double') {
    capacity = 2;
  } else if (roomType === 'deluxe') {
    capacity = 2;
  } else if (roomType === 'suite') {
    capacity = 3;
  } else if (roomType === 'penthouse') {
    capacity = 4;
  }

  // ✅ Use the status directly from props - this is already current_status!
  const displayStatus = room.status;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <BedDouble className="h-16 w-16 text-primary/40" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Room {room.number}</h3>
            <p className="text-sm text-muted-foreground capitalize">Floor {room.floor || '1'}</p>
          </div>
          {/* ✅ NOW SHOWS CORRECT STATUS - "booked" for room 107, "available" for others */}
          <Badge className={statusColors[displayStatus] || "bg-gray-100 text-gray-700"} variant="secondary">
            {displayStatus}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge className={typeColors[room.type?.toLowerCase()] || "bg-gray-100 text-gray-700"} variant="secondary">
            {room.type}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{capacity}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities?.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity] || Wifi
            return (
              <div
                key={amenity}
                className="flex items-center justify-center w-8 h-8 rounded bg-accent text-accent-foreground"
                title={amenity}
              >
                <Icon className="h-4 w-4" />
              </div>
            )
          })}
          {room.amenities && room.amenities.length > 4 && (
            <div className="flex items-center justify-center w-8 h-8 rounded bg-accent text-accent-foreground text-xs font-medium">
              +{room.amenities.length - 4}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-foreground">
            ${room.price}
            <span className="text-sm font-normal text-muted-foreground">/night</span>
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View room</span>
            </Button>
            {isAdmin && (
              <>
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit room</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="h-4 w-4 animate-spin">⏳</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete room</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}