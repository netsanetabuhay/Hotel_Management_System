"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import {
  Home,
  Hotel,
  Calendar,
  Utensils,
  LogOut,
  User,
  Bell,
  Settings,
  Package,
  Menu,
  X
} from 'lucide-react'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    // On mobile, start with sidebar closed
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [])

  if (!user) return null

  // UPDATED NAVIGATION ITEMS ONLY (the changes you requested):
  const userNavItems = [
    { href: '/dashboard/user', label: 'Dashboard', icon: Home },
    { href: '/dashboard/reservations', label: 'Room Reservation', icon: Calendar },
    { href: '/dashboard/rooms', label: 'Rooms', icon: Hotel }, // Changed from "Add Rooms"
    { href: '/dashboard/orders', label: 'Orders', icon: Package }, // Added new item
    { href: '/dashboard/food-menu', label: 'Menu', icon: Utensils },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings }, // Changed from "Profile"
  ]

  return (
    <>
      {/* Hamburger Button - Fixed position */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "border-r bg-background md:block",
        isSidebarOpen ? "block" : "hidden"
      )} style={{ width: '256px', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="h-14 border-b px-4 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Hotel className="h-6 w-6 text-primary" />
              <span className="text-lg">Hotel Management</span>
            </Link>
          </div>
          
          {/* Navigation - Scrollable independently */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {userNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                      isActive 
                        ? "bg-accent text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* Profile Area - Fixed at bottom */}
          <div className="p-4 border-t">
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
                
                <DropdownMenuItem onClick={() => {
                  setShowProfileDropdown(false)
                  window.location.href = '/dashboard/settings'
                }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
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
        </div>
      </div>

      {/* Add margin to main content when sidebar is open */}
      <div style={{ marginLeft: isSidebarOpen ? '256px' : '0', transition: 'margin-left 0.3s' }}>
        {/* This div is for layout spacing only */}
      </div>
    </>
  )
}