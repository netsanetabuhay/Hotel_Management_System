'use client'
import api from './axios'  
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  user_id: string  
  email: string
  first_name?: string | null 
  last_name?: string | null   
  phone?: string | null
  role: 'admin' | 'user'  
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
  isLoading: boolean
  token: string | null
}

interface RegisterData {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('1️⃣ Login attempt:', email);
      
      const response = await api.post('/users/login', { email, password });
      const responseData = response.data;
      
      console.log('2️⃣ Login response:', responseData);
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Login failed')
      }
      
      const { user, token } = responseData.data;
      
      console.log('3️⃣ Token received:', token ? '✅ Yes' : '❌ No');
      console.log('4️⃣ User role:', user.role);
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('5️⃣ Axios header set:', api.defaults.headers.common['Authorization'] ? '✅' : '❌');
      
      setToken(token)
      setUser(user)
      
      console.log('6️⃣ Redirecting to:', user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
      
      if (user.role === 'admin') {
        window.location.replace('/dashboard/admin?t=' + Date.now())
      } else {
        window.location.replace('/dashboard/user?t=' + Date.now())
      }
      
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/users/register', userData)
      const responseData = response.data
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Registration failed')
      }
      
      window.location.href = '/login'
    } catch (error: any) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    delete api.defaults.headers.common['Authorization']
    
    setToken(null)
    setUser(null)
    
    window.location.replace('/login?t=' + Date.now())
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}