"use client"

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Hotel, 
  ShoppingBag,
  DollarSign,
  Activity,
  Target,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function AnalyticsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    if (user && token && user.role === 'admin') {
      // Simulate loading analytics data
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }, [user, token, router])

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
        <p className="text-muted-foreground">Deep insights and predictive analytics for business optimization</p>
      </div>

      {/* Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer Satisfaction</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+2.1%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Repeat Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">68%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+5.7%</span>
              <span>customer retention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Room Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$149.99</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+8.3%</span>
              <span>year over year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue per Guest</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$245.75</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600">+12.5%</span>
              <span>incremental revenue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Insights</CardTitle>
          <CardDescription>AI-powered forecasts and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-emerald-800">High Demand Alert</h4>
                  <p className="text-sm text-emerald-700">
                    Next weekend shows 92% projected occupancy. Consider increasing rates by 15-20%.
                  </p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Opportunity</Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800">Menu Optimization</h4>
                  <p className="text-sm text-blue-700">
                    Pizza Margherita has 45% higher profit margin than other items. Consider promoting it.
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Recommendation</Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3">
                <Hotel className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800">Maintenance Schedule</h4>
                  <p className="text-sm text-amber-700">
                    Rooms 101, 205, and 312 show higher maintenance requests. Schedule preventive maintenance.
                  </p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Action Required</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Trends</CardTitle>
            <CardDescription>Booking patterns by season</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Summer (Jun-Aug)</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Spring (Mar-May)</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm font-medium">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fall (Sep-Nov)</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-medium">65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Winter (Dec-Feb)</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '48%' }}></div>
                  </div>
                  <span className="text-sm font-medium">48%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Demographics</CardTitle>
            <CardDescription>Breakdown of guest profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Business Travelers</span>
                <Badge variant="outline">42%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tourists</span>
                <Badge variant="outline">35%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Couples</span>
                <Badge variant="outline">15%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Families</span>
                <Badge variant="outline">8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}