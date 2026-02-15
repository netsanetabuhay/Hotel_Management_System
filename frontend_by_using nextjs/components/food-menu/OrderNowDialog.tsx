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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingBag, MapPin } from "lucide-react"
import { FoodPriceBadge } from "./FoodPriceBadge"
import type { FoodItem } from "./FoodMenuCard"

interface OrderNowDialogProps {
  item: FoodItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (orderData: { order_place: string; quantity: number; delivery_fee?: number }) => Promise<void>
  isSubmitting?: boolean
}

const DELIVERY_RATE_PER_KM = 10 // $10 per km

export function OrderNowDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false
}: OrderNowDialogProps) {
  const [quantity, setQuantity] = useState<number | string>("")
  const [orderPlace, setOrderPlace] = useState("take away")
  const [showDeliveryInputs, setShowDeliveryInputs] = useState(false)
  const [deliveryLocation, setDeliveryLocation] = useState("")
  const [deliveryDistance, setDeliveryDistance] = useState<number | string>("")

  // Reset state when dialog opens with new item
  React.useEffect(() => {
    if (open && item) {
      setQuantity("")
      setOrderPlace("take away")
      setShowDeliveryInputs(false)
      setDeliveryLocation("")
      setDeliveryDistance("")
    }
  }, [open, item])

  if (!item) return null

  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
  const numericQuantity = typeof quantity === 'string' ? (quantity === "" ? 0 : parseInt(quantity) || 0) : quantity
  const numericDistance = typeof deliveryDistance === 'string' ? (deliveryDistance === "" ? 0 : parseFloat(deliveryDistance) || 0) : deliveryDistance
  
  const deliveryFee = showDeliveryInputs ? numericDistance * DELIVERY_RATE_PER_KM : 0
  const subtotal = itemPrice * numericQuantity
  const totalPrice = subtotal + deliveryFee

  const handleQuantityChange = (delta: number) => {
    const currentQty = typeof quantity === 'string' ? (quantity === "" ? 0 : parseInt(quantity) || 0) : quantity
    const newQuantity = currentQty + delta
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity)
    }
  }

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setQuantity("")
      return
    }
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setQuantity(numValue)
    }
  }

  const handleQuantityBlur = () => {
    if (quantity === "" || (typeof quantity === 'number' && quantity < 1)) {
      setQuantity("")
    }
  }

  const handlePlaceChange = (value: string) => {
    setOrderPlace(value)
    setShowDeliveryInputs(value === "delivery")
    if (value !== "delivery") {
      setDeliveryLocation("")
      setDeliveryDistance("")
    }
  }

  const handleConfirm = async () => {
    if (quantity === "" || numericQuantity < 1) return
    
    let finalOrderPlace = orderPlace
    if (orderPlace === "delivery") {
      finalOrderPlace = `delivery to ${deliveryLocation || 'address not provided'} (${numericDistance}km)`
    }
    
    await onConfirm({
      order_place: finalOrderPlace,
      quantity: numericQuantity,
      ...(orderPlace === "delivery" && { delivery_fee: deliveryFee })
    })
  }

  const isQuantityValid = quantity !== "" && numericQuantity >= 1 && numericQuantity <= 20
  const isDeliveryValid = !showDeliveryInputs || (showDeliveryInputs && numericDistance > 0)
  const isConfirmDisabled = isSubmitting || !isQuantityValid || !isDeliveryValid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order {item.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Please fill in the details below to place your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Food Preview */}
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-700 shadow-sm flex-shrink-0">
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
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg text-white truncate">{item.name}</h4>
              <p className="text-sm text-gray-400 line-clamp-2 mb-1">
                {item.description || 'Delicious food item'}
              </p>
              <FoodPriceBadge price={itemPrice} />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Enter quantity you want to order</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={numericQuantity <= 1 || isSubmitting}
                className="h-10 w-10 hover:scale-105 transition-transform flex-shrink-0 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInput}
                  onBlur={handleQuantityBlur}
                  min="1"
                  max="20"
                  disabled={isSubmitting}
                  className="text-center font-medium bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  placeholder="Enter quantity"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={numericQuantity >= 20 || isSubmitting}
                className="h-10 w-10 hover:scale-105 transition-transform flex-shrink-0 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-right">
              Minimum 1, Maximum 20 items
            </p>
          </div>

          {/* Order Place - Select dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Where would you like to receive your order?</Label>
            <Select
              value={orderPlace}
              onValueChange={handlePlaceChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="take away" className="text-white hover:bg-gray-700 focus:bg-gray-700">Take Away (Pick up yourself)</SelectItem>
                <SelectItem value="in room" className="text-white hover:bg-gray-700 focus:bg-gray-700">In Room (Deliver to your room)</SelectItem>
                <SelectItem value="in hotel" className="text-white hover:bg-gray-700 focus:bg-gray-700">In Hotel (Deliver within hotel)</SelectItem>
                <SelectItem value="delivery" className="text-white hover:bg-gray-700 focus:bg-gray-700">Delivery (Deliver to external address)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Details - Show only when delivery is selected */}
          {showDeliveryInputs && (
            <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="font-medium text-sm text-white">Delivery Details</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-400">Enter address</Label>
                  <Input
                    placeholder="Enter address"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    disabled={isSubmitting}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Enter distance (km)</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Enter distance"
                    value={deliveryDistance}
                    onChange={(e) => setDeliveryDistance(e.target.value === "" ? "" : parseFloat(e.target.value) || 0)}
                    disabled={isSubmitting}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  ⚡ Delivery fee: ${DELIVERY_RATE_PER_KM} per kilometer
                </p>
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm text-white mb-2">Order Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price per item:</span>
              <span className="font-medium text-white">${itemPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Quantity:</span>
              <span className="font-medium text-white">{numericQuantity || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal:</span>
              <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
            </div>
            {showDeliveryInputs && numericDistance > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery fee ({numericDistance}km):</span>
                <span className="font-medium text-white">+${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold">
              <span className="text-white">Total amount to pay:</span>
              <span className="text-lg text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 sticky bottom-0 bg-gray-900 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="hover:scale-105 transition-transform bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="min-w-[120px] hover:scale-105 transition-transform bg-primary hover:bg-primary/80 text-white"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Placing order...
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}