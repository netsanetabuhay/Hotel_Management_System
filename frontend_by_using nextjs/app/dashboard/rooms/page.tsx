"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, Filter, BedDouble, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomCard } from "@/components/rooms/RoomCard"
import { AddRoomDialog } from "@/components/rooms/AddRoomDialog"
import { EditRoomDialog } from "@/components/rooms/EditRoomDialog"
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api/admin-dashboard"

export interface Room {
  room_id: string
  room_number: string
  room_type: string
  price: number
  image_url: string | null
  status: string
  current_status: string
}

export default function RoomsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === "admin"
  console.log('👑 Admin status:', isAdmin, 'User role:', user?.role)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getAvailableRooms()
      
      // ✅ ENSURE every room has ALL required fields
      const formattedRooms = data.map((room: any) => ({
        room_id: room.room_id,
        room_number: room.room_number,
        room_type: room.room_type,
        price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
        image_url: room.image_url || null,
        status: room.status || 'available',
        current_status: room.current_status || room.status || 'available'
      }))
      
      console.log('✅ Rooms loaded:', formattedRooms.length)
      setRooms(formattedRooms)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.room_number.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.current_status === statusFilter || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.room_type.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })

  const handleView = (room: Room) => {
    setSelectedRoom(room)
    setViewDialogOpen(true)
  }

  const handleEdit = (room: Room) => {
    setRoomToEdit(room)
    setEditDialogOpen(true)
  }

  const handleDelete = async (room: Room) => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "Only administrators can delete rooms.",
        variant: "destructive"
      })
      return
    }
    
    const result = window.confirm(`⚠️ Are you sure you want to delete Room ${room.room_number}?\n\nThis action cannot be undone.`)
    
    if (!result) {
      toast({
        title: "Cancelled",
        description: `Room ${room.room_number} was not deleted.`,
      })
      return
    }
    
    try {
      setIsDeleting(true)
      await adminApi.deleteRoom(room.room_id)
      
      toast({
        title: "✅ Success",
        description: `Room ${room.room_number} has been permanently deleted.`,
      })
      
      fetchRooms()
      
    } catch (error: any) {
      console.error("Delete room error:", error)
      
      let errorMessage = "Failed to delete room"
      
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Cannot delete room with active reservations"
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to delete rooms"
      } else if (error.response?.status === 404) {
        errorMessage = "Room not found"
      }
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateRoom = async (roomId: string, roomData: any) => {
    try {
      await adminApi.updateRoom(roomId, roomData)
      toast({
        title: "✅ Success",
        description: `Room ${roomData.room_number} has been updated.`,
      })
      fetchRooms()
      setEditDialogOpen(false)
      setRoomToEdit(null)
    } catch (error: any) {
      console.error("Update room error:", error)
      toast({
        title: "❌ Error",
        description: error.response?.data?.message || "Failed to update room",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rooms</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage hotel rooms and availability' : 'View available rooms'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by room number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <BedDouble className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.room_id}
            room={{
              id: room.room_id,
              number: room.room_number,
              type: room.room_type,
              price: room.price,
              status: room.current_status || room.status,
              image: room.image_url || "/placeholder-room.jpg",
              floor: "1",
              capacity: 2,
              amenities: []
            }}
            onView={() => handleView(room)}
            onEdit={() => handleEdit(room)}
            onDelete={() => handleDelete(room)}
            isAdmin={isAdmin}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BedDouble className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No rooms found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}

      <AddRoomDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onRoomAdded={fetchRooms}
      />
      
      <EditRoomDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        room={roomToEdit}
        onRoomUpdated={fetchRooms}
      />
      
      <RoomDetailsDialog 
        room={selectedRoom ? {
          id: selectedRoom.room_id,
          number: selectedRoom.room_number,
          type: selectedRoom.room_type,
          price: selectedRoom.price,
          status: selectedRoom.current_status || selectedRoom.status,
          image: selectedRoom.image_url || "/placeholder-room.jpg",
          floor: "1",
          capacity: 2,
          amenities: []
        } : null} 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
      />
    </div>
  )
}