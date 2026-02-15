// UserRoomsGrid.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { UserRoomCard } from "./UserRoomCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export interface Room {
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

interface UserRoomsGridProps {
  rooms: Room[]
  onViewRoom: (room: Room) => void
  onBookRoom: (room: Room) => void
}

export function UserRoomsGrid({ rooms, onViewRoom, onBookRoom }: UserRoomsGridProps) {
  console.log('UserRoomsGrid received props:', { roomsCount: rooms.length, onViewRoom: !!onViewRoom, onBookRoom: !!onBookRoom })
  
  const [filterType, setFilterType] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Filter rooms by type if filter is active
  const displayedRooms = filterType 
    ? rooms.filter(room => room.room_type.toLowerCase() === filterType.toLowerCase())
    : rooms
  
  // Handle type click
  const handleTypeClick = (roomType: string) => {
    setFilterType(roomType)
  }
  
  // Clear filter
  const handleShowAll = () => {
    setFilterType(null)
  }

  // Handle click outside - clicks on empty space in grid area trigger Show All
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterType && gridRef.current && !gridRef.current.contains(event.target as Node)) {
        handleShowAll()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [filterType])
  
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-3xl">🏨</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Available Rooms</h3>
        <p className="text-muted-foreground max-w-md">
          There are no rooms available at the moment. Please check back later or contact reception.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter header - shows when type is selected */}
      {filterType && (
        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
          <span className="text-sm text-muted-foreground">
            Showing {displayedRooms.length} {filterType} room{displayedRooms.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {/* Rooms grid - exactly 3 per row */}
      <div 
        ref={gridRef}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {displayedRooms.map((room) => (
          <UserRoomCard
            key={room.room_id}
            room={room}
            onView={() => {
              console.log('📢 Calling onViewRoom for room:', room.room_number)
              onViewRoom(room)
            }}
            onBook={() => {
              console.log('📢 Booking room:', room)
              onBookRoom(room)
            }}
            onTypeClick={handleTypeClick}
          />
        ))}
      </div>

      {/* Show All button at BOTTOM */}
      {filterType && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={handleShowAll}
            className="hover:bg-blue-500 hover:text-white transition-colors gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Show All
          </Button>
        </div>
      )}
    </div>
  )
}