"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter, 
  Calendar,
  Users,
  DollarSign,
  Ticket,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  MapPin,
  Star,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

function EventAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalEvents: 156,
      totalRevenue: 24500000,
      totalTicketsSold: 125000,
      averageTicketPrice: 1960,
      conversionRate: 12.5,
      revenueGrowth: 15.2,
      ticketSalesGrowth: 8.7,
      eventsGrowth: 22.1,
      attendanceRate: 94.5,
      customerSatisfaction: 4.6
    },
    trends: [
      { month: 'Jan', events: 12, revenue: 1800000, ticketsSold: 9000, attendance: 89.2 },
      { month: 'Feb', events: 15, revenue: 2250000, ticketsSold: 11250, attendance: 91.5 },
      { month: 'Mar', events: 18, revenue: 2700000, ticketsSold: 13500, attendance: 94.2 },
      { month: 'Apr', events: 22, revenue: 3300000, ticketsSold: 16500, attendance: 95.1 },
      { month: 'May', events: 25, revenue: 3750000, ticketsSold: 18750, attendance: 96.3 },
      { month: 'Jun', events: 28, revenue: 4200000, ticketsSold: 21000, attendance: 97.8 }
    ],
    topEvents: [
      {
        id: 1,
        name: 'Rwanda Premier League Final',
        revenue: 14250000,
        ticketsSold: 28500,
        attendance: 95.0,
        rating: 4.8,
        growth: 12.5
      },
      {
        id: 2,
        name: 'Basketball Championship',
        revenue: 1440000,
        ticketsSold: 4800,
        attendance: 96.0,
        rating: 4.6,
        growth: 8.3
      },
      {
        id: 3,
        name: 'Tennis Championship',
        revenue: 3800000,
        ticketsSold: 950,
        attendance: 95.0,
        rating: 4.7,
        growth: 15.2
      },
      {
        id: 4,
        name: 'Volleyball Tournament',
        revenue: 380000,
        ticketsSold: 1900,
        attendance: 95.0,
        rating: 4.4,
        growth: 5.7
      },
      {
        id: 5,
        name: 'Athletics Meet',
        revenue: 1800000,
        ticketsSold: 12000,
        attendance: 80.0,
        rating: 4.3,
        growth: -2.1
      }
    ],
    demographics: {
      ageGroups: [
        { range: '18-25', percentage: 35, count: 43750 },
        { range: '26-35', percentage: 28, count: 35000 },
        { range: '36-45', percentage: 20, count: 25000 },
        { range: '46-55', percentage: 12, count: 15000 },
        { range: '55+', percentage: 5, count: 6250 }
      ],
      gender: [
        { type: 'Male', percentage: 58, count: 72500 },
        { type: 'Female', percentage: 42, count: 52500 }
      ],
      location: [
        { city: 'Kigali', percentage: 45, count: 56250 },
        { city: 'Huye', percentage: 20, count: 25000 },
        { city: 'Musanze', percentage: 15, count: 18750 },
        { city: 'Rubavu', percentage: 10, count: 12500 },
        { city: 'Other', percentage: 10, count: 12500 }
      ]
    },
    devices: [
      { type: 'Mobile', percentage: 65, count: 81250, icon: Smartphone },
      { type: 'Desktop', percentage: 25, count: 31250, icon: Monitor },
      { type: 'Tablet', percentage: 10, count: 12500, icon: Tablet }
    ],
    channels: [
      { name: 'Website', visitors: 45000, conversions: 5400, rate: 12.0 },
      { name: 'Social Media', visitors: 32000, conversions: 3840, rate: 12.0 },
      { name: 'Email Marketing', visitors: 18000, conversions: 2700, rate: 15.0 },
      { name: 'Referrals', visitors: 12000, conversions: 1440, rate: 12.0 },
      { name: 'Direct', visitors: 8000, conversions: 800, rate: 10.0 }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-RW').format(num)
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const exportAnalytics = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting analytics as ${format}`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Analytics</h1>
            <p className="text-gray-600 mt-1">
              Deep insights and performance metrics for your events
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-green-600" />
              Analytics Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Primary Metric</label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="tickets">Ticket Sales</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="events">Event Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Export Format</label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportAnalytics('pdf')}
                    className="bg-white border-gray-200 hover:bg-gray-50"
                  >
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportAnalytics('excel')}
                    className="bg-white border-gray-200 hover:bg-gray-50"
                  >
                    Excel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportAnalytics('csv')}
                    className="bg-white border-gray-200 hover:bg-gray-50"
                  >
                    CSV
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger 
              value="demographics" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Demographics
            </TabsTrigger>
            <TabsTrigger 
              value="channels" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Globe className="h-4 w-4 mr-2" />
              Channels
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                        <span className={`text-sm ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                          +{analyticsData.overview.revenueGrowth}%
                        </span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalTicketsSold)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getGrowthIcon(analyticsData.overview.ticketSalesGrowth)}
                        <span className={`text-sm ${getGrowthColor(analyticsData.overview.ticketSalesGrowth)}`}>
                          +{analyticsData.overview.ticketSalesGrowth}%
                        </span>
                      </div>
                    </div>
                    <Ticket className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.attendanceRate}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">+2.3%</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.customerSatisfaction}/5</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">Excellent</span>
                      </div>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Events */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Award className="h-5 w-5 text-green-600" />
                  Top Performing Events
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Events ranked by revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {analyticsData.topEvents.map((event, index) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{event.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatCurrency(event.revenue)}</span>
                            <span>{formatNumber(event.ticketsSold)} tickets</span>
                            <span>{event.attendance}% attendance</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(event.growth)}
                            <span className={`text-sm font-medium ${getGrowthColor(event.growth)}`}>
                              {event.growth > 0 ? '+' : ''}{event.growth}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{event.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-gray-100">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Revenue Trends</CardTitle>
                  <CardDescription className="text-gray-600">
                    Monthly revenue performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.trends.map((trend, index) => (
                      <div key={trend.month} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {trend.month}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{formatCurrency(trend.revenue)}</p>
                            <p className="text-sm text-gray-600">{trend.events} events</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{formatNumber(trend.ticketsSold)} tickets</p>
                          <p className="text-xs text-gray-500">{trend.attendance}% attendance</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Growth Insights</CardTitle>
                  <CardDescription className="text-gray-600">
                    Key performance indicators and trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Revenue Growth</h4>
                        <p className="text-sm text-green-700">
                          Consistent 15%+ monthly growth in revenue over the past 6 months.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Attendance Improvement</h4>
                        <p className="text-sm text-blue-700">
                          Attendance rates have improved from 89% to 98% over 6 months.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Peak Performance</h4>
                        <p className="text-sm text-yellow-700">
                          June shows the highest performance with 28 events and 98% attendance.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Age Groups */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Age Distribution</CardTitle>
                  <CardDescription className="text-gray-600">
                    Audience breakdown by age groups
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.demographics.ageGroups.map((group) => (
                      <div key={group.range} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{group.range} years</span>
                          <span className="text-sm text-gray-600">{group.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{formatNumber(group.count)} people</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gender Distribution */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Gender Distribution</CardTitle>
                  <CardDescription className="text-gray-600">
                    Audience breakdown by gender
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.demographics.gender.map((group) => (
                      <div key={group.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{group.type}</span>
                          <span className="text-sm text-gray-600">{group.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{formatNumber(group.count)} people</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Distribution */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Geographic Distribution</CardTitle>
                  <CardDescription className="text-gray-600">
                    Audience breakdown by location
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.demographics.location.map((location) => (
                      <div key={location.city} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{location.city}</span>
                          <span className="text-sm text-gray-600">{location.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{formatNumber(location.count)} people</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Traffic Sources</CardTitle>
                  <CardDescription className="text-gray-600">
                    Performance by marketing channel
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.channels.map((channel) => (
                      <div key={channel.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{channel.name}</h3>
                          <p className="text-sm text-gray-600">{formatNumber(channel.visitors)} visitors</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatNumber(channel.conversions)} conversions</p>
                          <p className="text-xs text-gray-500">{channel.rate}% conversion rate</p>
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
                  <CardDescription className="text-gray-600">
                    Platform breakdown by device type
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {analyticsData.devices.map((device) => {
                      const IconComponent = device.icon
                      return (
                        <div key={device.type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-green-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">{device.type}</h3>
                              <p className="text-sm text-gray-600">{formatNumber(device.count)} users</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{device.percentage}%</p>
                            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${device.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(EventAnalyticsPage, ['admin'])
