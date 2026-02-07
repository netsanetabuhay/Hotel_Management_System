"use client"

import React from "react"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  UtensilsCrossed,
  Clock,
  Edit2,
  Trash2,
  ShoppingCart,
  Minus,
  Coffee,
  Sandwich,
  Wine,
  Cake,
  Sun,
  Moon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { mockMenuItems, type MenuItem } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

const categoryIcons: Record<string, React.ElementType> = {
  breakfast: Sun,
  lunch: Sandwich,
  dinner: Moon,
  drinks: Wine,
  desserts: Cake,
  snacks: Coffee,
}

const categoryColors: Record<string, string> = {
  breakfast: "bg-amber-100 text-amber-700",
  lunch: "bg-emerald-100 text-emerald-700",
  dinner: "bg-blue-100 text-blue-700",
  drinks: "bg-purple-100 text-purple-700",
  desserts: "bg-pink-100 text-pink-700",
  snacks: "bg-orange-100 text-orange-700",
}

interface CartItem {
  menuItem: MenuItem
  quantity: number
}

function MenuItemCard({
  item,
  onAddToCart,
  onEdit,
  onDelete,
  isAdmin,
}: {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  isAdmin: boolean
}) {
  const Icon = categoryIcons[item.category] || UtensilsCrossed

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
        <Icon className="h-16 w-16 text-primary/40" />
        {!item.available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="bg-gray-200 text-gray-600">
              Unavailable
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <Badge className={categoryColors[item.category]} variant="secondary">
              {item.category}
            </Badge>
          </div>
          <p className="text-lg font-bold text-foreground">${item.price.toFixed(2)}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{item.preparationTime} min</span>
          </div>

          <div className="flex items-center gap-1">
            {isAdmin ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => onAddToCart(item)} disabled={!item.available}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CartDialog({
  open,
  onOpenChange,
  cart,
  onUpdateQuantity,
  onPlaceOrder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onPlaceOrder: () => void
}) {
  const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Order</DialogTitle>
          <DialogDescription>Review your items before placing the order</DialogDescription>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.menuItem.name}</p>
                    <p className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={onPlaceOrder}>
                Place Order
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function AddMenuItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "lunch",
    preparationTime: "15",
    available: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Menu item added",
      description: `${formData.name} has been added to the menu.`,
    })
    onOpenChange(false)
    setFormData({ name: "", description: "", price: "", category: "lunch", preparationTime: "15", available: true })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>Create a new item for the food menu</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="Grilled Salmon"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the dish..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="29.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time (min)</Label>
              <Input
                id="prepTime"
                type="number"
                placeholder="15"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
                <SelectItem value="desserts">Desserts</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="available">Available</Label>
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function FoodMenuPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === "admin" || user?.role === "receptionist"

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])

  const filteredItems = mockMenuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ["breakfast", "lunch", "dinner", "drinks", "desserts", "snacks"]

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id)
      if (existing) {
        return prev.map((c) => (c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { menuItem: item, quantity: 1 }]
    })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your order.`,
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId))
    } else {
      setCart((prev) => prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity } : c)))
    }
  }

  const placeOrder = () => {
    toast({
      title: "Order placed!",
      description: "Your order has been sent to the kitchen.",
    })
    setCart([])
    setCartOpen(false)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Food Menu</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage the hotel restaurant menu" : "Browse and order from our menu"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <Button variant="outline" onClick={() => setCartOpen(true)} className="relative bg-transparent">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartTotal > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </Button>
          )}
          {isAdmin && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("all")}
          className={categoryFilter !== "all" ? "bg-transparent" : ""}
        >
          All Items
        </Button>
        {categories.map((category) => {
          const Icon = categoryIcons[category]
          return (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className={categoryFilter !== category ? "bg-transparent" : ""}
            >
              <Icon className="h-4 w-4 mr-1" />
              <span className="capitalize">{category}</span>
            </Button>
          )
        })}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            onEdit={(item) => toast({ title: "Edit mode", description: `Editing ${item.name}` })}
            onDelete={(item) => toast({ title: "Deleted", description: `${item.name} removed from menu`, variant: "destructive" })}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No items found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      <AddMenuItemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={placeOrder}
      />
    </div>
  )
}
