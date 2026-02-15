"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingBag, CreditCard, MapPin } from "lucide-react"
import { FoodPriceBadge } from "./FoodPriceBadge"
import type { FoodItem } from "./FoodMenuCard"

interface OrderNowDialogProps {
  item: FoodItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (orderData: { order_place: string; quantity: number }) => void
  isSubmitting?: boolean
}

export function OrderNowDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false
}: OrderNowDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [orderPlace, setOrderPlace] = useState("take away")
  const [customPlace, setCustomPlace] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  if (!item) return null

  // Convert price to number if it's string
  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
  const totalPrice = itemPrice * quantity

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity)
    }
  }

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty input for editing
    if (value === "") {
      setQuantity(0)
      return
    }
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setQuantity(numValue)
    }
  }

  const handleQuantityBlur = () => {
    if (quantity === 0 || quantity < 1) {
      setQuantity(1)
    }
  }

  const handlePlaceChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true)
      setOrderPlace("")
    } else {
      setShowCustomInput(false)
      setOrderPlace(value)
      setCustomPlace("")
    }
  }

  const handleConfirm = () => {
    const finalPlace = showCustomInput && customPlace.trim() 
      ? customPlace.trim() 
      : orderPlace
    onConfirm({
      order_place: finalPlace,
      quantity
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order {item.name}
          </DialogTitle>
          <DialogDescription>
            Customize your order and place it now
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Food Preview */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border">
            <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10">
                  <ShoppingBag className="h-8 w-8 text-primary/40" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-foreground">{item.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                {item.description || 'Delicious food item'}
              </p>
              <FoodPriceBadge price={itemPrice} />
            </div>
          </div>

          {/* Quantity Selector - Editable input with + and - */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10 hover:scale-105 transition-transform"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  type="number"
                  value={quantity || ""}
                  onChange={handleQuantityInput}
                  onBlur={handleQuantityBlur}
                  min="1"
                  max="20"
                  className="text-center font-medium"
                  placeholder="1"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 20}
                className="h-10 w-10 hover:scale-105 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              Max: 20 items
            </p>
          </div>

          {/* Order Place - Select with custom option */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Order Place</Label>
            <RadioGroup
              value={showCustomInput ? "custom" : orderPlace}
              onValueChange={handlePlaceChange}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem
                  value="take away"
                  id="take-away"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="take-away"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all hover:scale-105"
                >
                  <ShoppingBag className="mb-2 h-5 w-5" />
                  <span className="text-sm font-medium">Take Away</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="dine in"
                  id="dine-in"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="dine-in"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all hover:scale-105"
                >
                  <CreditCard className="mb-2 h-5 w-5" />
                  <span className="text-sm font-medium">Dine In</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="in room"
                  id="in-room"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="in-room"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all hover:scale-105"
                >
                  <MapPin className="mb-2 h-5 w-5" />
                  <span className="text-sm font-medium">In Room</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="custom"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all hover:scale-105"
                >
                  <MapPin className="mb-2 h-5 w-5" />
                  <span className="text-sm font-medium">Other</span>
                </Label>
              </div>
            </RadioGroup>
            
            {/* Custom place input */}
            {showCustomInput && (
              <Input
                placeholder="Enter delivery location..."
                value={customPlace}
                onChange={(e) => setCustomPlace(e.target.value)}
                className="mt-2 transition-all focus:scale-105"
                autoFocus
              />
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per item:</span>
              <span className="font-medium">${itemPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-lg text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="hover:scale-105 transition-transform"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || (showCustomInput && !customPlace.trim())}
            className="min-w-[120px] hover:scale-105 transition-transform bg-primary hover:bg-primary/80"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Placing...
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Confirm Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}