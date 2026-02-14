"use client"

import React from "react"
import { BedDouble, Users, Eye, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UserRoomCardProps {
  room: {
    room_id: string
    room_number: string
    room_type: string
    price: number
    status: string
    image: string
    floor?: string
    capacity?: number
    amenities?: string[]
  }
  onView: () => void
  onBook: () => void
}

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: () => <span>📶</span>,
  TV: () => <span>📺</span>,
  AC: () => <span>❄️</span>,
  "Mini Bar": () => <span>🍷</span>,
}

const typeColors: Record<string, string> = {
  single: "bg-gray-100 text-gray-700",
  double: "bg-blue-100 text-blue-700",
  suite: "bg-purple-100 text-purple-700",
  deluxe: "bg-amber-100 text-amber-700",
  standard: "bg-gray-100 text-gray-700",
  penthouse: "bg-emerald-100 text-emerald-700",
}

export function UserRoomCard({ room, onView, onBook }: UserRoomCardProps) {
  // Capacity based on room type
  let capacity = 2;
  const roomType = room.room_type?.toLowerCase() || '';
  
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden bg-gray-100">
        {room.image && room.image !== "/placeholder-room.jpg" ? (
          <img
            src={room.image}
            alt={`Room ${room.room_number}`}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BedDouble className="h-12 w-12 text-primary/40" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Room {room.room_number}</h3>
            <p className="text-sm text-muted-foreground capitalize">{room.room_type}</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            Available
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge className={typeColors[room.room_type?.toLowerCase()] || "bg-gray-100 text-gray-700"} variant="secondary">
            {room.room_type}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{capacity}</span>
          </div>
          {room.floor && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Floor {room.floor}</span>
            </>
          )}
        </div>

        {/* Amenities Preview */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => {
              const Icon = amenityIcons[amenity];
              return Icon ? (
                <div
                  key={amenity}
                  className="flex items-center justify-center w-7 h-7 rounded bg-accent text-accent-foreground"
                  title={amenity}
                >
                  <Icon />
                </div>
              ) : (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              );
            })}
            {room.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{room.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-foreground">
              ${room.price}
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onBook}
              className="gap-1 bg-primary hover:bg-primary/90"
            >
              <Calendar className="h-3 w-3" />
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}