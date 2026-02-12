"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { adminApi } from "@/lib/api/admin-dashboard"

interface EditRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: {
    room_id: string
    room_number: string
    room_type: string
    price: number
    image_url: string | null
  } | null
  onRoomUpdated: () => void
}

export function EditRoomDialog({ open, onOpenChange, room, onRoomUpdated }: EditRoomDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    room_number: "",
    room_type: "",
    price: "",
    image_url: "",
  })

  useEffect(() => {
    if (room) {
      setFormData({
        room_number: room.room_number,
        room_type: room.room_type,
        price: room.price.toString(),
        image_url: room.image_url || "",
      })
    }
  }, [room])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!room) return
    
    setIsLoading(true)
    
    try {
      const priceValue = parseFloat(formData.price)
      if (isNaN(priceValue) || priceValue <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid price greater than 0",
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      await adminApi.updateRoom(room.room_id, {
        room_number: formData.room_number,
        room_type: formData.room_type,
        price: priceValue,
        image_url: formData.image_url || null
      })
      
      toast({
        title: "✅ Success",
        description: `Room ${formData.room_number} has been updated successfully.`,
      })
      
      onRoomUpdated()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Update room error:", error)
      toast({
        title: "❌ Error",
        description: error.response?.data?.message || "Failed to update room",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Room {room.room_number}</DialogTitle>
          <DialogDescription>Update the room details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_room_number">Room Number</Label>
            <Input
              id="edit_room_number"
              placeholder="101"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_room_type">Room Type</Label>
            <Select value={formData.room_type} onValueChange={(value) => setFormData({ ...formData, room_type: value })}>
              <SelectTrigger id="edit_room_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_price">Price per Night ($)</Label>
            <Input
              id="edit_price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="150.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_image_url">Image URL (Optional)</Label>
            <Input
              id="edit_image_url"
              placeholder="https://example.com/room.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}