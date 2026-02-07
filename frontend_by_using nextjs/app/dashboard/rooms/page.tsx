"use client"

import React from "react"

import { useState } from "react"
import { Plus, Search, Filter, BedDouble, Users, Wifi, Tv, Wind, Wine, Eye, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { mockRooms, type Room } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  TV: Tv,
  AC: Wind,
  "Mini Bar": Wine,
}

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-blue-100 text-blue-700",
  reserved: "bg-amber-100 text-amber-700",
  maintenance: "bg-gray-100 text-gray-700",
}

const typeColors: Record<string, string> = {
  single: "bg-gray-100 text-gray-700",
  double: "bg-blue-100 text-blue-700",
  suite: "bg-purple-100 text-purple-700",
  deluxe: "bg-amber-100 text-amber-700",
  penthouse: "bg-emerald-100 text-emerald-700",
}

function RoomCard({ room, onView, onEdit, onDelete, isAdmin }: { room: Room; onView: () => void; onEdit: () => void; onDelete: () => void; isAdmin: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <BedDouble className="h-16 w-16 text-primary/40" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Room {room.number}</h3>
            <p className="text-sm text-muted-foreground capitalize">Floor {room.floor}</p>
          </div>
          <Badge className={statusColors[room.status]} variant="secondary">
            {room.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge className={typeColors[room.type]} variant="secondary">
            {room.type}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{room.capacity}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities.slice(0, 4).map((amenity) => {
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
          {room.amenities.length > 4 && (
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
                <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
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

function AddRoomDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    number: "",
    type: "single",
    price: "",
    capacity: "1",
    floor: "1",
    amenities: [] as string[],
  })

  const allAmenities = ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Kitchen", "Living Room", "Jacuzzi", "Ocean View", "Private Pool", "Butler Service"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Room added",
      description: `Room ${formData.number} has been added successfully.`,
    })
    onOpenChange(false)
    setFormData({ number: "", type: "single", price: "", capacity: "1", floor: "1", amenities: [] })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>Enter the details for the new room.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Room Number</Label>
              <Input
                id="number"
                placeholder="101"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select value={formData.floor} onValueChange={(value) => setFormData({ ...formData, floor: value })}>
                <SelectTrigger id="floor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((f) => (
                    <SelectItem key={f} value={f.toString()}>
                      Floor {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Select value={formData.capacity} onValueChange={(value) => setFormData({ ...formData, capacity: value })}>
                <SelectTrigger id="capacity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <SelectItem key={c} value={c.toString()}>
                      {c} {c === 1 ? "guest" : "guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per Night ($)</Label>
            <Input
              id="price"
              type="number"
              placeholder="99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {allAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, amenities: [...formData.amenities, amenity] })
                      } else {
                        setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== amenity) })
                      }
                    }}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit">Add Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RoomDetailsDialog({ room, open, onOpenChange }: { room: Room | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Room {room.number}</DialogTitle>
          <DialogDescription>Room details and amenities</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <BedDouble className="h-20 w-20 text-primary/40" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Room Type</p>
              <p className="font-medium capitalize text-foreground">{room.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[room.status]} variant="secondary">
                {room.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Floor</p>
              <p className="font-medium text-foreground">Floor {room.floor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-medium text-foreground">{room.capacity} guests</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-2xl font-bold text-foreground">
              ${room.price}
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RoomsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === "admin" || user?.role === "receptionist"

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = room.number.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleView = (room: Room) => {
    setSelectedRoom(room)
    setViewDialogOpen(true)
  }

  const handleEdit = (room: Room) => {
    toast({
      title: "Edit mode",
      description: `Editing room ${room.number}`,
    })
  }

  const handleDelete = (room: Room) => {
    toast({
      title: "Room deleted",
      description: `Room ${room.number} has been deleted.`,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rooms</h1>
          <p className="text-muted-foreground mt-1">Manage hotel rooms and availability</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        )}
      </div>

      {/* Filters */}
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
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <BedDouble className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onView={() => handleView(room)}
            onEdit={() => handleEdit(room)}
            onDelete={() => handleDelete(room)}
            isAdmin={isAdmin}
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

      <AddRoomDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <RoomDetailsDialog room={selectedRoom} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
    </div>
  )
}
