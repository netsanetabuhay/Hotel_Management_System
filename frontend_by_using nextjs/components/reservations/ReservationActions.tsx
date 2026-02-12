"use client"

import React from "react"
import { Eye, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReservationActionsProps {
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
  isAdmin: boolean  // Admin/receptionist can edit/delete, users can only view
}

export function ReservationActions({ 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin 
}: ReservationActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={onView}>
        <Eye className="h-4 w-4" />
        <span className="sr-only">View</span>
      </Button>
      {isAdmin && (
        <>
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </>
      )}
    </div>
  )
}