"use client"

import React from "react"
import { useRouter } from 'next/navigation'

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  CalendarCheck,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  User,
  BedDouble,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react"
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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api/admin-dashboard"

// Define Reservation type based on your backend response
export interface Reservation {
  room_order_id: string
  user_id: string
  room_id: string
  check_in: string
  check_out: string
  status: 'booked' | 'active' | 'completed' | 'cancelled'
  payment_status: 'paid' | 'unpaid'
  created_at: string
  // Joined fields from getReservationByIdWithDetails
  room_number?: string
  room_type?: string
  guest_name?: string
  guest_email?: string
  total_price?: number
}

const statusColors: Record<string, string> = {
  booked: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
}

const paymentColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-amber-100 text-amber-700",
}

function ReservationDetailsDialog({
  reservation,
  open,
  onOpenChange,
  onStatusChange,
}: {
  reservation: Reservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: string) => Promise<void>
}) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  if (!reservation) return null

  const handleStatusUpdate = async (status: string) => {
    try {
      setIsUpdating(true)
      await onStatusChange(reservation.room_order_id, status)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
          <DialogDescription>Booking #{reservation.room_order_id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Guest
              </p>
              <p className="font-medium text-foreground">{reservation.guest_name || 'Guest'}</p>
              <p className="text-sm text-muted-foreground">{reservation.guest_email || ''}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <BedDouble className="h-4 w-4" /> Room
              </p>
              <p className="font-medium text-foreground">Room {reservation.room_number || reservation.room_id}</p>
              <p className="text-sm text-muted-foreground capitalize">{reservation.room_type || 'Standard'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Check-in
              </p>
              <p className="font-medium text-foreground">{new Date(reservation.check_in).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Check-out
              </p>
              <p className="font-medium text-foreground">{new Date(reservation.check_out).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[reservation.status]} variant="secondary">
                {reservation.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment</p>
              <Badge className={paymentColors[reservation.payment_status]} variant="secondary">
                {reservation.payment_status}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">
                ${reservation.total_price?.toLocaleString() || '0.00'}
              </p>
            </div>
            <div className="flex gap-2">
              {reservation.status === "booked" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate("active")}
                    disabled={isUpdating}
                    className="bg-transparent"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Check In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={isUpdating}
                    className="bg-transparent text-destructive hover:text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}
              {reservation.status === "active" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={isUpdating}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewReservationDialog({ 
  open, 
  onOpenChange,
  onReservationCreated 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  onReservationCreated: () => void
}) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [formData, setFormData] = useState({
    room_id: "",
    check_in: "",
    check_out: "",
  })

  // Fetch available rooms when dialog opens
  useEffect(() => {
    if (open && token) {
      fetchAvailableRooms()
    }
  }, [open, token])

  const fetchAvailableRooms = async () => {
    try {
      const rooms = await adminApi.getAvailableRooms(token!)
      setAvailableRooms(rooms)
    } catch (error) {
      console.error('Error fetching available rooms:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      // Create reservation through your API
      const response = await adminApi.createReservation(token!, {
        room_id: formData.room_id,
        check_in: formData.check_in,
        check_out: formData.check_out
      })
      
      toast({
        title: "Success",
        description: "Reservation created successfully",
      })
      
      setFormData({ room_id: "", check_in: "", check_out: "" })
      onReservationCreated()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create reservation",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Reservation</DialogTitle>
          <DialogDescription>Create a new room reservation</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Select 
              value={formData.room_id} 
              onValueChange={(value) => setFormData({ ...formData, room_id: value })}
              required
            >
              <SelectTrigger id="room">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.room_id} value={room.room_id}>
                    Room {room.room_number} - {room.room_type} (${room.price}/night)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                required
                min={formData.check_in || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Reservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ReservationsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const isAdmin = user?.role === "admin" || user?.role === "receptionist"
  
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Fetch real reservations from API
  useEffect(() => {
    if (token) {
      fetchReservations()
    }
  }, [token])

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getReservations(token!)
      setReservations(data)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      toast({
        title: "Error",
        description: "Failed to load reservations",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter reservations based on role and search
  const userReservations = isAdmin
    ? reservations
    : reservations.filter((r) => r.user_id === user?.id)

  const filteredReservations = userReservations.filter((reservation) => {
    const matchesSearch = 
      reservation.room_number?.toLowerCase().includes(search.toLowerCase()) ||
      reservation.room_order_id.toLowerCase().includes(search.toLowerCase()) ||
      reservation.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
      false
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.updateReservation(token!, id, { status })
      toast({
        title: "Success",
        description: `Reservation status updated to ${status}`,
      })
      fetchReservations() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteReservation(token!, id)
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      })
      fetchReservations() // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive"
      })
    }
  }

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setDetailsDialogOpen(true)
  }

  // Calculate stats
  const stats = {
    pending: userReservations.filter(r => r.status === 'booked').length,
    confirmed: userReservations.filter(r => r.status === 'active').length,
    checkedIn: userReservations.filter(r => r.status === 'active').length,
    totalRevenue: userReservations
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + (r.total_price || 0), 0)
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
          <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage all hotel reservations" : "View your reservations"}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setNewDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        )}
      </div>

      {/* Stats Cards - Real Data */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Booked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.checkedIn}</p>
                <p className="text-sm text-muted-foreground">Checked In</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Same as before */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest, room, or booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table - Real Data */}
      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
          <CardDescription>{filteredReservations.length} reservations found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.room_order_id}>
                    <TableCell className="font-medium">{reservation.room_order_id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{reservation.guest_name || 'Guest'}</p>
                        <p className="text-sm text-muted-foreground">{reservation.guest_email || ''}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">Room {reservation.room_number || reservation.room_id}</p>
                        <p className="text-sm text-muted-foreground capitalize">{reservation.room_type || 'Standard'}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(reservation.check_in).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(reservation.check_out).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">${reservation.total_price?.toLocaleString() || '0.00'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[reservation.status]} variant="secondary">
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentColors[reservation.payment_status]} variant="secondary">
                        {reservation.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleView(reservation)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        {isAdmin && (
                          <>
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(reservation.room_order_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No reservations found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <NewReservationDialog 
        open={newDialogOpen} 
        onOpenChange={setNewDialogOpen}
        onReservationCreated={fetchReservations}
      />
      
      <ReservationDetailsDialog
        reservation={selectedReservation}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}