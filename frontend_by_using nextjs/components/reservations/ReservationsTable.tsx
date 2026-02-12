"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarCheck } from "lucide-react"
import { ReservationStatusBadge } from "./ReservationStatusBadge"
import { PaymentStatusBadge } from "./PaymentStatusBadge"
import { ReservationActions } from "./ReservationActions"

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

interface ReservationsTableProps {
  reservations: Reservation[]
  onView: (reservation: Reservation) => void
  onEdit?: (reservation: Reservation) => void
  onDelete?: (id: string) => void
  isAdmin: boolean
}

export function ReservationsTable({
  reservations,
  onView,
  onEdit,
  onDelete,
  isAdmin
}: ReservationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Reservations</CardTitle>
        <CardDescription>{reservations.length} reservations found</CardDescription>
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
              {reservations.map((reservation) => (
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
                    <ReservationStatusBadge status={reservation.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={reservation.payment_status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ReservationActions
                      onView={() => onView(reservation)}
                      onEdit={onEdit ? () => onEdit(reservation) : undefined}
                      onDelete={onDelete ? () => onDelete(reservation.room_order_id) : undefined}
                      isAdmin={isAdmin}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {reservations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No reservations found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}