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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface AddRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRoomDialog({ open, onOpenChange }: AddRoomDialogProps) {
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