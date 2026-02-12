'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirectPage() {
  const { user, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        window.location.href = '/dashboard/admin'
      } else {
        window.location.href = '/dashboard/user'
      }
    }
  }, [user, isLoading])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return null
}