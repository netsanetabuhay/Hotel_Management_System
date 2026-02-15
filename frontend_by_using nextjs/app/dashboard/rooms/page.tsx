"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, Filter, BedDouble, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomCard } from "@/components/rooms/RoomCard"
import { UserRoomCard } from "@/components/rooms/UserRoomCard"
import { UserRoomsGrid } from "@/components/rooms/UserRoomsGrid"
import { AddRoomDialog } from "@/components/rooms/AddRoomDialog"
import { EditRoomDialog } from "@/components/rooms/EditRoomDialog"
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog"
import { RoomBookingModal } from "@/components/rooms/RoomBookingModal"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api/admin-dashboard"
import { useRouter } from "next/navigation"

export interface Room {
  room_id: string
  room_number: string
  room_type: string
  price: number
  image_url: string | null
  status: string
  current_status: string
  floor?: string
  capacity?: number
  amenities?: string[]
  bed_config?: string
  bed_display?: string
}

export default function RoomsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const isAdmin = user?.role === "admin"
  
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [bedConfigFilter, setBedConfigFilter] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const getBedConfig = (roomType: string, capacity: number): { value: string, display: string } => {
    const type = roomType?.toLowerCase() || '';
    const cap = capacity || 2;
    
    // Single type configurations
    if (type === 'single') {
      if (cap === 1) return { value: "single_one", display: "1 Person" };
      if (cap === 2) return { value: "single_two", display: "2 Persons" };
    }
    
    // Double type configurations
    if (type === 'double') {
      if (cap === 2) return { value: "double_one", display: "Each 1 Person" };
      if (cap === 4) return { value: "double_two", display: "Each 2 Persons" };
      if (cap === 3) return { value: "double_mixed", display: "Mixed (1+2)" };
    }
    
    // Triple type configurations
    if (type === 'triple') {
      if (cap === 3) return { value: "triple_one", display: "Each 1 Person" };
      if (cap === 6) return { value: "triple_two", display: "Each 2 Persons" };
      if (cap === 4 || cap === 5) return { value: "triple_mixed", display: "Mixed" };
    }
    
    // Suite type configurations
    if (type === 'suite') {
      if (cap === 4) return { value: "family", display: "Family (2+2)" };
      if (cap === 3) return { value: "suite", display: "King + Sofa" };
    }
    
    // Default fallback based on capacity
    if (cap === 1) return { value: "single_one", display: "1 Person" };
    if (cap === 2) return { value: "double_one", display: "Each 1 Person" };
    if (cap === 3) return { value: "triple_one", display: "Each 1 Person" };
    if (cap === 4) return { value: "family", display: "Family (2+2)" };
    
    return { value: "double_one", display: "Each 1 Person" };
  }

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getAvailableRooms()
      
      const formattedRooms = data.map((room: any) => {
        const bedConfig = getBedConfig(room.room_type, room.capacity);
        return {
          room_id: room.room_id,
          room_number: room.room_number,
          room_type: room.room_type,
          price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
          image_url: room.image_url || null,
          status: room.status || 'available',
          current_status: room.current_status || room.status || 'available',
          floor: room.floor || "1",
          capacity: room.capacity || 2,
          amenities: room.amenities || [],
          bed_config: bedConfig.value,
          bed_display: bedConfig.display
        };
      });
      
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

  // Get available bed options based on selected room type
  const getBedOptionsForType = () => {
    if (typeFilter === "all") {
      return [
        { value: "all", label: "All Beds" },
        { value: "single_one", label: "1 Person" },
        { value: "single_two", label: "2 Persons" },
        { value: "double_one", label: "Each 1 Person" },
        { value: "double_two", label: "Each 2 Persons" },
        { value: "double_mixed", label: "Mixed (1+2)" },
        { value: "triple_one", label: "Each 1 Person" },
        { value: "triple_two", label: "Each 2 Persons" },
        { value: "triple_mixed", label: "Mixed" },
        { value: "family", label: "Family (2+2)" },
        { value: "suite", label: "King + Sofa" }
      ];
    }
    
    if (typeFilter === "single") {
      return [
        { value: "all", label: "All Single Beds" },
        { value: "single_one", label: "1 Person" },
        { value: "single_two", label: "2 Persons" }
      ];
    }
    
    if (typeFilter === "double") {
      return [
        { value: "all", label: "All Double Beds" },
        { value: "double_one", label: "Each 1 Person" },
        { value: "double_two", label: "Each 2 Persons" },
        { value: "double_mixed", label: "Mixed (1+2)" }
      ];
    }
    
    if (typeFilter === "triple") {
      return [
        { value: "all", label: "All Triple Beds" },
        { value: "triple_one", label: "Each 1 Person" },
        { value: "triple_two", label: "Each 2 Persons" },
        { value: "triple_mixed", label: "Mixed" }
      ];
    }
    
    if (typeFilter === "suite") {
      return [
        { value: "all", label: "All Suites" },
        { value: "family", label: "Family (2+2)" },
        { value: "suite", label: "King + Sofa" }
      ];
    }
    
    return [{ value: "all", label: "All Beds" }];
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.room_number.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || room.room_type.toLowerCase() === typeFilter.toLowerCase()
    const matchesBedConfig = bedConfigFilter === "all" || room.bed_config === bedConfigFilter
    
    if (isAdmin) {
      const matchesStatus = statusFilter === "all" || 
                           room.current_status === statusFilter || 
                           room.status === statusFilter
      return matchesSearch && matchesStatus && matchesType && matchesBedConfig
    }
    
    return matchesSearch && matchesType && matchesBedConfig && room.current_status === 'available'
  })

  const handleView = (room: Room) => {
    setSelectedRoom(room)
    setViewDialogOpen(true)
  }

  const handleEdit = (room: Room) => {
    setRoomToEdit(room)
    setEditDialogOpen(true)
  }

  const handleBook = (room: Room) => {
    console.log('🔵 ===== BOOK BUTTON CLICKED =====')
    console.log("room on handle webhook",room)
    console.log('🔵 Room data:', {
      room_id: room?.room_id,
      room_number: room.room_number,
      room_type: room.room_type,
      price: room.price,
      bed_config: room.bed_config,
      bed_display: room.bed_display
    })
    
    setBookingRoom(room)
    setBookingModalOpen(true)
    
    setTimeout(() => {
      console.log('🔵 bookingRoom after set:', bookingRoom)
    }, 100)
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

  const handleBookingSuccess = () => {
    fetchRooms()
    setBookingModalOpen(false)
    setBookingRoom(null)
    toast({
      title: "✅ Booking Successful",
      description: "Your room has been booked. Redirecting to reservations...",
    })
    setTimeout(() => {
      router.push('/dashboard/reservations')
    }, 1500)
  }

  const handleBookingModalClose = (open: boolean) => {
    setBookingModalOpen(open)
    if (!open) {
      setBookingRoom(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const bedOptions = getBedOptionsForType();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rooms</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage hotel rooms and availability' : 'View and book available rooms'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        )}
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by room number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {isAdmin && (
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
            )}
            
            {/* Room Type Filter - REMOVED Standard and Deluxe */}
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              setBedConfigFilter("all"); // Reset bed filter when type changes
            }}>
              <SelectTrigger className="w-full sm:w-40">
                <BedDouble className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="triple">Triple</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>

            {/* Bed Configuration Filter - Dynamic based on selected type */}
            <Select value={bedConfigFilter} onValueChange={setBedConfigFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <BedDouble className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Bed Configuration" />
              </SelectTrigger>
              <SelectContent>
                {bedOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Display */}
      {filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BedDouble className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No rooms found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {isAdmin ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
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
                    floor: room.floor || "1",
                    capacity: room.capacity || 2,
                    amenities: room.amenities || [],
                    bed_config: room.bed_config,
                    bed_display: room.bed_display
                  }}
                  onView={() => handleView(room)}
                  onEdit={() => handleEdit(room)}
                  onDelete={() => handleDelete(room)}
                  isAdmin={isAdmin}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          ) : (
            <UserRoomsGrid
              rooms={filteredRooms.map(room => ({
                room_id: room.room_id,
                room_number: room.room_number,
                room_type: room.room_type,
                price: room.price,
                status: room.current_status || room.status,
                image: room.image_url || "/placeholder-room.jpg",
                floor: room.floor || "1",
                capacity: room.capacity || 2,
                amenities: room.amenities || [],
                bed_config: room.bed_config,
                bed_display: room.bed_display
              }))}
              onViewRoom={handleView}
              onBookRoom={handleBook}
            />
          )}
        </>
      )}

      {/* Dialogs */}
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
          floor: selectedRoom.floor || "1",
          capacity: selectedRoom.capacity || 2,
          amenities: selectedRoom.amenities || []
        } : null} 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
      />

      {/* Booking Modal */}
      <RoomBookingModal
        room={bookingRoom ? {
          id: bookingRoom.room_id,
          number: bookingRoom.room_number,
          type: bookingRoom.room_type,
          price: bookingRoom.price,
          image: bookingRoom.image_url || "/placeholder-room.jpg",
          capacity: bookingRoom.capacity || 2,
          amenities: bookingRoom.amenities || [],
          floor: bookingRoom.floor || "1",
          bed_display: bookingRoom.bed_display,
          description: `${bookingRoom.room_type} Room - ${bookingRoom.bed_display || ''}`
        } : null}
        open={bookingModalOpen}
        onOpenChange={handleBookingModalClose}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  )
}