"use client"

import React from "react"
import { useState } from "react"
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

interface AddRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoomAdded: () => void
}

export function AddRoomDialog({ open, onOpenChange, onRoomAdded }: AddRoomDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    room_number: "",
    room_type: "deluxe",
    price: "",
    image_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await adminApi.createRoom({
        room_number: formData.room_number,
        room_type: formData.room_type,
        price: parseFloat(formData.price),
        image_url: formData.image_url || null
      })
      
      toast({
        title: "Success",
        description: `Room ${formData.room_number} has been added successfully.`,
      })
      
      onRoomAdded()
      onOpenChange(false)
      setFormData({ room_number: "", room_type: "deluxe", price: "", image_url: "" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add room",
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
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>Enter the details for the new room.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number</Label>
            <Input
              id="room_number"
              placeholder="101"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_type">Room Type</Label>
            <Select value={formData.room_type} onValueChange={(value) => setFormData({ ...formData, room_type: value })}>
              <SelectTrigger id="room_type">
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
            <Label htmlFor="price">Price per Night ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="150.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
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
              {isLoading ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}