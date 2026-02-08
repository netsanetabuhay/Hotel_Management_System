"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Hotel, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Email and password are required",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        if (data.success) {
          const { token, user } = data.data
          
          // Store token and user info in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
          }
          
          toast({
            title: "Welcome back!",
            description: `Welcome back, ${user.first_name || user.username || user.email}!`,
          })
          
          // Navigate to dashboard
          router.push("/dashboard")
        } else {
          toast({
            title: "Login failed",
            description: data.message || "Please check your credentials.",
            variant: "destructive",
          })
        }
      } else {
        // Handle non-ok responses
        const errorMessage = data?.message || data?.error || `Login failed with status ${response.status}`
        
        if (response.status === 401) {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          })
        } else if (response.status === 400) {
          toast({
            title: "Login failed",
            description: "Email and password are required",
            variant: "destructive",
          })
        } else if (response.status === 500) {
          toast({
            title: "Server error",
            description: "Please try again later.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Login failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error)
      
      if (error.name === 'TypeError') {
        toast({
          title: "Network error",
          description: "Please check your connection and make sure the backend server is running at http://localhost:5000",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login failed",
          description: error.message || "An error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Hotel className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Grand Hotel</h1>
          <p className="text-muted-foreground">Management System</p>
        </div>

        <Card className="border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@grandhotel.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{"Don't have an account? "}</span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium">Admin:</span> admin@grandhotel.com
                </p>
                <p>
                  <span className="font-medium">Guest:</span> guest@example.com
                </p>
                <p>
                  <span className="font-medium">Password:</span> any 6+ characters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}