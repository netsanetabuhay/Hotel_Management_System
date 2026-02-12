// app/register/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'  // ✅ Correct for App Router

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
 const router=useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Validation
  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }
  
  if (formData.password.length < 5) {
    toast.error('Password must be at least 5 characters')
    return
  }
  
  setIsLoading(true)
  
  try {
    
    const { confirmPassword, ...rest } = formData
    
    const registerData = {
      username: rest.username,
      email: rest.email,
      password: rest.password,
      first_name: rest.firstName || null,
      last_name: rest.lastName || null,
      phone: rest.phone || null
    }
    
    // Make API request
    const response = await api.post('/users/register', registerData)
    
    if (response.data.success) {
      toast.success('Registration successful! Please login.')
      // Redirect to login page
      router.push('/login')
    }
    
  } catch (error: any) {
    console.error('Registration error:', error)
    toast.error(error.message || error.response?.data?.message || 'Registration failed')
  } finally {
    setIsLoading(false)
  }
}

  return (
<div className="min-h-screen flex items-center justify-center bg-blue-gradient-light">
        <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Register for the hotel management system</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Required Fields */}
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                placeholder="please enter unique username "
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="please enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="please enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="please enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Optional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Optional"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Optional"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Optional"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}