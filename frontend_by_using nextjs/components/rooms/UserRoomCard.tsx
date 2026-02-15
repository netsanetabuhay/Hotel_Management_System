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
    bed_config?: string
    bed_display?: string
  }
  onView: () => void
  onBook: () => void
  onTypeClick: (roomType: string) => void
}

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: () => <span>📶</span>,
  TV: () => <span>📺</span>,
  AC: () => <span>❄️</span>,
  "Mini Bar": () => <span>🍷</span>,
}

const typeColors: Record<string, string> = {
  single: "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer",
  double: "bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer",
  triple: "bg-purple-100 text-purple-700 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer",
  suite: "bg-amber-100 text-amber-700 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer",
}

export function UserRoomCard({ room, onView, onBook, onTypeClick }: UserRoomCardProps) {
  let capacity = 2;
  const roomType = room.room_type?.toLowerCase() || '';
  
  if (roomType === 'single') {
    capacity = 1;
  } else if (roomType === 'double') {
    capacity = 2;
  } else if (roomType === 'triple') {
    capacity = 3;
  } else if (roomType === 'suite') {
    capacity = 4;
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-video overflow-hidden bg-gray-100 relative">
        {room.image && room.image !== "/placeholder-room.jpg" ? (
          <img
            src={room.image}
            alt={`Room ${room.room_number}`}
            className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BedDouble className="h-12 w-12 text-primary/40 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        
        {/* See More Button - WITHOUT text */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onTypeClick(room.room_type)}
            className="bg-white text-gray-900 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
          >
            See More
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Room {room.room_number}</h3>
            <p className="text-sm text-muted-foreground capitalize">{room.room_type}</p>
            <Badge 
              className={typeColors[room.room_type?.toLowerCase()] || "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer mt-1"} 
              variant="secondary"
              onClick={() => onTypeClick(room.room_type)}
            >
              {room.room_type}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
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

        {/* Bed Configuration Display */}
        {room.bed_display && (
          <div className="mb-3 text-xs text-muted-foreground bg-accent/50 p-1.5 rounded-md">
            {room.room_type} • {room.bed_display}
          </div>
        )}

        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => {
              const Icon = amenityIcons[amenity];
              return Icon ? (
                <div
                  key={amenity}
                  className="flex items-center justify-center w-7 h-7 rounded bg-accent text-accent-foreground hover:bg-primary hover:text-white transition-all duration-300"
                  title={amenity}
                >
                  <Icon />
                </div>
              ) : (
                <Badge 
                  key={amenity} 
                  variant="outline" 
                  className="text-xs hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  {amenity}
                </Badge>
              );
            })}
            {room.amenities.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                +{room.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-foreground">
              price: {room.price}$/night
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onView}
              className="hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onBook}
              className="gap-1 bg-primary hover:bg-blue-600 transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-medium whitespace-nowrap"
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