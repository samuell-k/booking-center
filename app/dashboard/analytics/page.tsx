"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Ticket, 
  Eye, 
  Download, 
  RefreshCw, 
  Filter, 
  Activity, 
  Target, 
  Award, 
  Clock, 
  MapPin, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Zap, 
  Globe, 
  Smartphone, 
  Tablet,
  PieChart,
  LineChart,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  StopCircle
} from "lucide-react"

function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 24500000,
      totalUsers: 1247,
      totalEvents: 156,
      totalTicketsSold: 125000,
      averageTicketPrice: 1960,
      conversionRate: 12.5,
      revenueGrowth: 15.2,
      userGrowth: 8.7,
      eventGrowth: 22.1,
      attendanceRate: 94.5,
      customerSatisfaction: 4.6
    },
    trends: [
      { month: 'Jan', revenue: 1800000, users: 1200, events: 12, ticketsSold: 9000, attendance: 89.2 },
      { month: 'Feb', revenue: 2250000, users: 1350, events: 15, ticketsSold: 11250, attendance: 91.5 },
      { month: 'Mar', revenue: 2700000, users: 1480, events: 18, ticketsSold: 13500, attendance: 94.2 },
      { month: 'Apr', revenue: 3300000, users: 1620, events: 22, ticketsSold: 16500, attendance: 95.1 },
      { month: 'May', revenue: 3750000, users: 1750, events: 25, ticketsSold: 18750, attendance: 96.3 },
      { month: 'Jun', revenue: 4200000, users: 1900, events: 28, ticketsSold: 21000, attendance: 97.8 }
    ],
    topEvents: [
      { name: "APR vs Rayon Sports", revenue: 850000, ticketsSold: 850, attendance: 98.5, rating: 4.8 },
      { name: "REG vs Patriots", revenue: 420000, ticketsSold: 420, attendance: 95.2, rating: 4.6 },
      { name: "Police vs AS Kigali", revenue: 320000, ticketsSold: 320, attendance: 92.8, rating: 4.4 },
      { name: "Kigali Music Fest", revenue: 500000, ticketsSold: 500, attendance: 96.1, rating: 4.7 }
    ],
    topTeams: [
      { name: "APR FC", revenue: 3750000, matches: 15, winRate: 80, rating: 4.8 },
      { name: "Rayon Sports", revenue: 2670000, matches: 14, winRate: 71, rating: 4.6 },
      { name: "REG BBC", revenue: 900000, matches: 12, winRate: 67, rating: 4.4 },
      { name: "Patriots BBC", revenue: 640000, matches: 10, winRate: 60, rating: 4.2 }
    ],
    userSegments: [
      { segment: "Premium Users", count: 245, percentage: 19.6, revenue: 8500000 },
      { segment: "Regular Users", count: 678, percentage: 54.4, revenue: 12000000 },
      { segment: "New Users", count: 324, percentage: 26.0, revenue: 4000000 }
    ],
    deviceUsage: [
      { device: "Mobile", percentage: 65, users: 810 },
      { device: "Desktop", percentage: 25, users: 312 },
      { device: "Tablet", percentage: 10, users: 125 }
    ],
    geographicData: [
      { region: "Kigali", revenue: 15000000, users: 750, events: 95 },
      { region: "Huye", revenue: 4500000, users: 225, events: 28 },
      { region: "Musanze", revenue: 3000000, users: 150, events: 18 },
      { region: "Other", revenue: 2000000, users: 122, events: 15 }
    ]
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600"
    if (growth < 0) return "text-red-600"
    return "text-gray-500"
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights and business intelligence for SmartSports platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white border-gray-200 hover:bg-gray-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                      +{analyticsData.overview.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(analyticsData.overview.userGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.userGrowth)}`}>
                      +{analyticsData.overview.userGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalEvents}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(analyticsData.overview.eventGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(analyticsData.overview.eventGrowth)}`}>
                      +{analyticsData.overview.eventGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tickets Sold</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalTicketsSold.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">Avg: {analyticsData.overview.averageTicketPrice.toLocaleString()} RWF</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Ticket sales conversion</p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.attendanceRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Average event attendance</p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.customerSatisfaction}/5</p>
                  <p className="text-xs text-gray-500 mt-1">Average rating</p>
                </div>
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-5 h-auto bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Revenue</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Events</TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Teams</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Revenue Trend</CardTitle>
                  <CardDescription className="text-gray-600">Monthly revenue performance</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Growth Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">User Growth</CardTitle>
                  <CardDescription className="text-gray-600">Monthly user acquisition</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">User growth chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Events */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Top Performing Events</CardTitle>
                <CardDescription className="text-gray-600">Events with highest revenue and attendance</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {analyticsData.topEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.ticketsSold} tickets sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{(event.revenue / 1000).toLocaleString()}K RWF</p>
                        <p className="text-sm text-gray-600">{event.attendance}% attendance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Region */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Revenue by Region</CardTitle>
                  <CardDescription className="text-gray-600">Geographic revenue distribution</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.geographicData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{region.region}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(region.revenue / 1000000).toFixed(1)}M RWF</p>
                          <p className="text-sm text-gray-600">{region.users} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Sources */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Revenue Sources</CardTitle>
                  <CardDescription className="text-gray-600">Breakdown by revenue type</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Ticket className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Ticket Sales</span>
                      </div>
                      <p className="font-medium text-gray-900">18.5M RWF</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">Merchandise</span>
                      </div>
                      <p className="font-medium text-gray-900">4.2M RWF</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">Sponsorships</span>
                      </div>
                      <p className="font-medium text-gray-900">2.3M RWF</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Segments */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">User Segments</CardTitle>
                  <CardDescription className="text-gray-600">User distribution by type</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.userSegments.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{segment.segment}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{segment.count} users</p>
                          <p className="text-sm text-gray-600">{segment.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Usage */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Device Usage</CardTitle>
                  <CardDescription className="text-gray-600">Platform access by device type</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.deviceUsage.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            {device.device === 'Mobile' ? <Smartphone className="h-4 w-4 text-green-600" /> :
                             device.device === 'Desktop' ? <Globe className="h-4 w-4 text-green-600" /> :
                             <Tablet className="h-4 w-4 text-green-600" />}
                          </div>
                          <span className="font-medium text-gray-900">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{device.percentage}%</p>
                          <p className="text-sm text-gray-600">{device.users} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Event Performance</CardTitle>
                <CardDescription className="text-gray-600">Detailed event analytics and metrics</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {analyticsData.topEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.ticketsSold} tickets • {event.attendance}% attendance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(event.revenue / 1000).toLocaleString()}K RWF</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-gray-900">{event.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Team Performance</CardTitle>
                <CardDescription className="text-gray-600">Team revenue and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {analyticsData.topTeams.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{team.name}</h4>
                          <p className="text-sm text-gray-600">{team.matches} matches • {team.winRate}% win rate</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(team.revenue / 1000000).toFixed(1)}M RWF</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-gray-900">{team.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AnalyticsPage, ['admin'])
