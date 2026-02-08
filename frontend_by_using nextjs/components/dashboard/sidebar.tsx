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
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  // Navigation items based on role
  const navItems = user.role === 'admin' ? [
    { href: '/dashboard/admin', label: 'Dashboard', icon: Home },
    { href: '/dashboard/rooms', label: 'Rooms', icon: Hotel },
    { href: '/dashboard/reservations', label: 'Reservations', icon: Calendar },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/dashboard/food-menu', label: 'Food Menu', icon: Utensils },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ] : [
    { href: '/dashboard/user', label: 'Dashboard', icon: Home },
    { href: '/dashboard/reservations', label: 'My Bookings', icon: Calendar },
    { href: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/dashboard/food-menu', label: 'Menu', icon: Utensils },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Hotel className="h-6 w-6 text-primary" />
            <span className="text-lg">Hotel Management</span>
          </Link>
        </div>
        
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
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
        
        <div className="mt-auto p-4 border-t">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}