"use client"

import React from "react"
import { UserRoomCard } from "./UserRoomCard"

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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rooms.map((room) => (
        <UserRoomCard
          key={room.room_id}
          room={room}
          onView={() => {
            console.log('📢 Calling onViewRoom for room:', room.room_number)
            onViewRoom(room)
          }}
          onBook={() => {
            console.log('📢  room:', room)
            onBookRoom(room)
          }}
        />
      ))}
    </div>
  )
}