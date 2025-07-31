'use client'

import { useSession } from "next-auth/react"
import { useDashboard } from './providers/dashboard-provider'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from '@/components/ui/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  DollarSign,
  Activity,
  Zap,
  Database,
  Users
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { currentProject } = useDashboard()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="border-b bg-white">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {session?.user?.name?.split(' ')[0]}!
                  </h1>
                  <p className="text-sm text-gray-600">
                    Here's what's happening with your D2C analytics
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          </div>

          <main className="p-6">
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$24,570</p>
                        <p className="text-sm text-green-600">+12.5% from last month</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">ROAS</p>
                        <p className="text-2xl font-bold text-gray-900">3.2x</p>
                        <p className="text-sm text-green-600">+0.4x this week</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Campaigns</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                        <p className="text-sm text-blue-600">3 optimized today</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Data Sources</p>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                        <p className="text-sm text-gray-600">All connected</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>Aura AI Insights</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations for {currentProject?.name || "your project"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Campaign Optimization Opportunity</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Your Facebook ads are performing 23% better this week. Consider increasing budget for top-performing campaigns to maximize ROAS.
                        </p>
                        <Button size="sm" variant="outline">
                          Chat with Aura
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks for {currentProject?.name || "your project"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-sm">Chat with Aura</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                        <Database className="w-6 h-6" />
                        <span className="text-sm">Add Data Source</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                        <BarChart3 className="w-6 h-6" />
                        <span className="text-sm">View Reports</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-sm">Campaign Analysis</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates for {currentProject?.name || "your project"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "Facebook data synced", time: "2 minutes ago", status: "success" },
                        { action: "Shopify integration updated", time: "1 hour ago", status: "success" },
                        { action: "Campaign report generated", time: "3 hours ago", status: "info" },
                        { action: "ROAS alert triggered", time: "1 day ago", status: "warning" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <Badge variant={activity.status === "success" ? "default" : "secondary"}>
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}