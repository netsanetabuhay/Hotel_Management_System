"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api/admin-dashboard"

// Import components
import { ReservationStats } from "@/components/reservations/ReservationStats"
import { ReservationFilters } from "@/components/reservations/ReservationFilters"
import { ReservationsTable } from "@/components/reservations/ReservationsTable"
import { ReservationDetailsDialog } from "@/components/reservations/ReservationDetailsDialog"
import { NewReservationDialog } from "@/components/reservations/NewReservationDialog"
import { EditReservationDialog } from "@/components/reservations/EditReservationDialog"

// Define Reservation type
export interface Reservation {
  room_order_id: string
  user_id: string
  room_id: string
  check_in: string
  check_out: string
  status: 'booked' | 'active' | 'completed' | 'cancelled'
  payment_status: 'paid' | 'unpaid'
  created_at: string
  room_number?: string
  room_type?: string
  guest_name?: string
  guest_email?: string
  total_price?: number
}

export default function ReservationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === "admin" || user?.role === "receptionist"
  
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  
  // Filter states
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Dialog states
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // Fetch reservations
  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getReservations()
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
    : reservations.filter((r) => r.user_id === user?.user_id)

  const filteredReservations = userReservations.filter((reservation) => {
    const matchesSearch = 
      reservation.room_number?.toLowerCase().includes(search.toLowerCase()) ||
      reservation.room_order_id.toLowerCase().includes(search.toLowerCase()) ||
      (isAdmin && reservation.guest_name?.toLowerCase().includes(search.toLowerCase())) ||
      false
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats calculation
  const stats = {
    booked: userReservations.filter(r => r.status === 'booked').length,
    active: userReservations.filter(r => r.status === 'active').length,
    checkedIn: userReservations.filter(r => r.status === 'active').length,
    totalRevenue: userReservations
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + (r.total_price || 0), 0)
  }

  // Handlers
  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setDetailsDialogOpen(true)
  }

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return
    
    try {
      await adminApi.deleteReservation(id)
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      })
      fetchReservations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive"
      })
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.updateReservation(id, { status })
      toast({
        title: "Success",
        description: `Reservation status updated to ${status}`,
      })
      fetchReservations()
    } catch (error) {
      throw error
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
      {/* Header */}
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

      {/* Stats Cards */}
      <ReservationStats
        booked={stats.booked}
        active={stats.active}
        checkedIn={stats.checkedIn}
        totalRevenue={stats.totalRevenue}
        isAdmin={isAdmin}
      />

      {/* Filters */}
      <ReservationFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isAdmin={isAdmin}
      />

      {/* Reservations Table */}
      <ReservationsTable
        reservations={filteredReservations}
        onView={handleView}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        isAdmin={isAdmin}
      />

      {/* Dialogs */}
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

      {isAdmin && selectedReservation && (
        <EditReservationDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          reservationId={selectedReservation.room_order_id}
          currentStatus={selectedReservation.status}
          currentPaymentStatus={selectedReservation.payment_status}
          onReservationUpdated={fetchReservations}
        />
      )}
    </div>
  )
}