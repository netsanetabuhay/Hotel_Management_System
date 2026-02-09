"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  X,
  Users,
  BarChart3,
  FileText,
  Image,
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
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Admin-only navigation items
  const adminNavItems = [
    { href: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/dashboard/users', label: 'User Management', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/analytics', label: 'Analytics', icon: Layers },
    { href: '/dashboard/uploads', label: 'Media Library', icon: Image },
  ]

  // Combine based on user role
  const navItems = user.role === 'admin' 
    ? [...baseNavItems, ...adminNavItems]
    : baseNavItems

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Hamburger Button - Only show on mobile */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground shadow-lg",
          isSidebarOpen && "left-[calc(256px+1rem)]"
        )}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "border-r bg-background fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out",
        "md:translate-x-0 md:static md:z-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="h-14 border-b px-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Hotel className="h-6 w-6 text-primary" />
              <span className="text-lg">Hotel Management</span>
            </Link>
            {/* Close button for desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
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
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm",
                      isActive 
                        ? "bg-accent text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.href.includes('/admin') && user.role === 'admin' && (
                      <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Admin</span>
                    )}
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
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.first_name?.[0] || user.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
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
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => {
                  setShowProfileDropdown(false)
                  isMobile && setIsSidebarOpen(false)
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
                    isMobile && setIsSidebarOpen(false)
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

      {/* Add margin to main content when sidebar is open on desktop */}
      {!isMobile && (
        <div 
          className={cn(
            "transition-all duration-300",
            isSidebarOpen ? "md:ml-64" : "md:ml-0"
          )}
        />
      )}
    </>
  )
}