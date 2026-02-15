"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { useState } from 'react'
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
  X,
  Users,
  BarChart3,
  ShoppingBag,
  Shield,
  Layers
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
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (!user) return null

  // Navigation items for all users
  const baseNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/rooms', label: 'Rooms', icon: Hotel },
    { href: '/dashboard/reservations', label: 'Reservations', icon: Calendar },
    { href: '/dashboard/food-menu', label: 'Food Menu', icon: Utensils },
    { href: '/dashboard/food-orders', label: 'Food Orders', icon: ShoppingBag },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  // Admin-only navigation items - NO "Admin" badges!
  const adminNavItems = user.role === 'admin' ? [
    { href: '/dashboard/users', label: 'User Management', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/analytics', label: 'Analytics', icon: Layers },
  ] : []

  // Combine based on user role
  const navItems = [...baseNavItems, ...adminNavItems]

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Sidebar - X button INSIDE the sidebar */}
      <div className={cn(
        "border-r bg-background fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        {/* Header with Logo and X button */}
        <div className="h-14 border-b px-4 flex items-center justify-between shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Hotel className="h-6 w-6 text-primary" />
            <span className="text-lg">Hotel Management</span>
          </Link>
          
          {/* X button INSIDE sidebar header */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-accent transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation - Scrollable independently */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  // ✅ REMOVED: onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm",
                    isActive 
                      ? "bg-accent text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {/* REMOVED - Admin badges no longer show */}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Profile Area - Fixed at bottom */}
        <div className="p-4 border-t shrink-0">
          <DropdownMenu open={showProfileDropdown} onOpenChange={setShowProfileDropdown}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-accent transition-colors">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.first_name?.[0] ||'User'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user.first_name || 'user'}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.first_name ||'User'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {user.phone && (
                  <p className="text-xs text-muted-foreground mt-1">{user.phone}</p>
                )}
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => {
                setShowProfileDropdown(false)
                // ✅ KEEP: Settings should close sidebar
                setIsSidebarOpen(false)
                router.push('/dashboard/settings')
              }}>
                <User className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  setShowProfileDropdown(false)
                  // ✅ Logout closes sidebar
                  setIsSidebarOpen(false)
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

      {/* Hamburger Menu Button - ONLY shows when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Main content margin adjustment */}
      <div 
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      />
    </>
  )
}