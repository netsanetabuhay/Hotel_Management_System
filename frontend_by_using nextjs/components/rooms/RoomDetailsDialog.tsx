"use client"

import React from "react"
import { BedDouble } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Room } from "@/lib/mock-data"

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-blue-100 text-blue-700",
  reserved: "bg-amber-100 text-amber-700",
  maintenance: "bg-gray-100 text-gray-700",
}

interface RoomDetailsDialogProps {
  room: Room | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomDetailsDialog({ room, open, onOpenChange }: RoomDetailsDialogProps) {
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