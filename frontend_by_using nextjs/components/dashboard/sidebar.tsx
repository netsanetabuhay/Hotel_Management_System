"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Home,
  Hotel,
  Calendar,
  Utensils,
  Users,
  BarChart3,
  LogOut,
  User,
  ShoppingBag,
  Bell,
  Settings,
  PlusCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  if (!user) return null

  // User navigation items (updated as requested)
  const userNavItems = [
    { href: '/dashboard/user', label: 'Dashboard', icon: Home },
    { href: '/dashboard/reservations', label: 'Room Reservation', icon: Calendar }, // Changed from "My Bookings"
    { href: '/dashboard/rooms', label: 'Add Rooms', icon: PlusCircle }, // Shows available rooms
    { href: '/dashboard/food-menu', label: 'Menu', icon: Utensils },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings }, // Changed from "Profile"
  ]

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo/Header */}
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Hotel className="h-6 w-6 text-primary" />
            <span className="text-lg">Hotel Management</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {userNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive 
                      ? "bg-accent text-primary" 
                      : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Profile Area (Updated as requested) */}
        <div className="mt-auto p-4 border-t">
          <div className="mb-4">
            <DropdownMenu open={showProfileDropdown} onOpenChange={setShowProfileDropdown}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-accent transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.first_name?.[0] || user.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user.first_name || user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize truncate">{user.role}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Profile Info */}
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.first_name || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {user.phone && (
                    <p className="text-xs text-muted-foreground mt-1">{user.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Edit Profile (username/email cannot be changed) */}
                <DropdownMenuItem onClick={() => {
                  setShowProfileDropdown(false)
                  // Navigate to settings page
                  window.location.href = '/dashboard/settings'
                }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    setShowProfileDropdown(false)
                    logout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Removed standalone Logout button as requested */}
        </div>
      </div>
    </div>
  )
}