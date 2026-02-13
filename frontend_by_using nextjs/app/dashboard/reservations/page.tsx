"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { adminApi } from '@/lib/api/admin-dashboard'

// Import reservation components (6 main components - these are correct!)
import { ReservationStats } from '@/components/reservations/ReservationStats'
import { ReservationFilters } from '@/components/reservations/ReservationFilters'
import { ReservationsTable } from '@/components/reservations/ReservationsTable'
import { ReservationDetailsDialog } from '@/components/reservations/ReservationDetailsDialog'
import { NewReservationDialog } from '@/components/reservations/NewReservationDialog'
import { EditReservationDialog } from '@/components/reservations/EditReservationDialog'

// The other 3 components (StatusBadge, PaymentBadge, Actions) are used INSIDE these components
// No need to import them here

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
  
  // ✅ Only two roles: admin or user
  const isAdmin = user?.role === 'admin'
  
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

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
        title: 'Error',
        description: 'Failed to load reservations',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ ROLE-BASED FILTERING:
  // - Admin: sees ALL reservations
  // - User: sees ONLY their own reservations
  const userReservations = isAdmin
    ? reservations  // Admin sees all
    : reservations.filter((r) => r.user_id === user?.user_id) // User sees only own

  const filteredReservations = userReservations.filter((reservation) => {
    const matchesSearch =
      reservation.room_number?.toLowerCase().includes(search.toLowerCase()) ||
      reservation.room_order_id.toLowerCase().includes(search.toLowerCase()) ||
      (isAdmin && reservation.guest_name?.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // ✅ STATS: Based on user's visible reservations
  const stats = {
    booked: userReservations.filter((r) => r.status === 'booked').length,
    active: userReservations.filter((r) => r.status === 'active').length,
    checkedIn: userReservations.filter((r) => r.status === 'active').length,
    totalRevenue: userReservations
      .filter((r) => r.payment_status === 'paid')
      .reduce((sum, r) => sum + (r.total_price || 0), 0)
  }

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setDetailsDialogOpen(true)
  }

  const handleEdit = (reservation: Reservation) => {
    // ✅ Only admin can edit
    if (!isAdmin) return
    setSelectedReservation(reservation)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    // ✅ Only admin can delete
    if (!isAdmin) return
    if (!confirm('Are you sure you want to delete this reservation?')) return
    try {
      await adminApi.deleteReservation(id)
      toast({
        title: 'Success',
        description: 'Reservation deleted successfully',
      })
      fetchReservations()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete reservation',
        variant: 'destructive'
      })
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    // ✅ Only admin can update status
    if (!isAdmin) return
    try {
      await adminApi.updateReservation(id, { status })
      toast({
        title: 'Success',
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage all room reservations' : 'View your reservations'}
          </p>
        </div>
        {/* ✅ BOTH admin AND user can create reservations */}
        <Button onClick={() => setNewDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
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

      {/* ✅ Only admin can edit reservations */}
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