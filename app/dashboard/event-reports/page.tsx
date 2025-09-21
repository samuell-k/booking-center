"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
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
  Edit
} from 'lucide-react'

function EventReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for reports
  const reportData = {
    overview: {
      totalEvents: 156,
      totalRevenue: 24500000,
      totalTicketsSold: 125000,
      averageTicketPrice: 1960,
      conversionRate: 12.5,
      topPerformingEvent: 'Rwanda Premier League Final',
      revenueGrowth: 15.2,
      ticketSalesGrowth: 8.7,
      eventsGrowth: 22.1
    },
    events: [
      {
        id: 1,
        name: 'Rwanda Premier League Final',
        date: '2024-03-25',
        time: '15:00',
        category: 'Football',
        venue: 'Amahoro Stadium',
        capacity: 30000,
        ticketsSold: 28500,
        revenue: 14250000,
        status: 'completed',
        rating: 4.8,
        attendance: 95.0
      },
      {
        id: 2,
        name: 'Basketball Championship',
        date: '2024-03-20',
        time: '18:00',
        category: 'Basketball',
        venue: 'Kigali Arena',
        capacity: 5000,
        ticketsSold: 4800,
        revenue: 1440000,
        status: 'completed',
        rating: 4.6,
        attendance: 96.0
      },
      {
        id: 3,
        name: 'Volleyball Tournament',
        date: '2024-03-18',
        time: '14:00',
        category: 'Volleyball',
        venue: 'Intare Arena',
        capacity: 2000,
        ticketsSold: 1900,
        revenue: 380000,
        status: 'completed',
        rating: 4.4,
        attendance: 95.0
      },
      {
        id: 4,
        name: 'Tennis Championship',
        date: '2024-03-15',
        time: '10:00',
        category: 'Tennis',
        venue: 'Kigali Tennis Club',
        capacity: 1000,
        ticketsSold: 950,
        revenue: 3800000,
        status: 'completed',
        rating: 4.7,
        attendance: 95.0
      },
      {
        id: 5,
        name: 'Athletics Meet',
        date: '2024-03-12',
        time: '08:00',
        category: 'Athletics',
        venue: 'Huye Stadium',
        capacity: 15000,
        ticketsSold: 12000,
        revenue: 1800000,
        status: 'completed',
        rating: 4.3,
        attendance: 80.0
      }
    ],
    categories: [
      { name: 'Football', events: 45, revenue: 12000000, ticketsSold: 60000, avgPrice: 2000 },
      { name: 'Basketball', events: 32, revenue: 4800000, ticketsSold: 16000, avgPrice: 3000 },
      { name: 'Volleyball', events: 28, revenue: 2800000, ticketsSold: 14000, avgPrice: 2000 },
      { name: 'Tennis', events: 25, revenue: 7500000, ticketsSold: 15000, avgPrice: 5000 },
      { name: 'Athletics', events: 26, revenue: 2600000, ticketsSold: 20000, avgPrice: 1300 }
    ],
    monthlyData: [
      { month: 'Jan', events: 12, revenue: 1800000, ticketsSold: 9000 },
      { month: 'Feb', events: 15, revenue: 2250000, ticketsSold: 11250 },
      { month: 'Mar', events: 18, revenue: 2700000, ticketsSold: 13500 },
      { month: 'Apr', events: 22, revenue: 3300000, ticketsSold: 16500 },
      { month: 'May', events: 25, revenue: 3750000, ticketsSold: 18750 },
      { month: 'Jun', events: 28, revenue: 4200000, ticketsSold: 21000 }
    ]
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Completed' },
      ongoing: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Ongoing' },
      upcoming: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Upcoming' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Cancelled' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed
    return <Badge className={`${config.color} border`}>{config.text}</Badge>
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

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`)
    // Implement export functionality
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Reports</h1>
            <p className="text-gray-600 mt-1">
              Analytics and insights for your events
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-green-600" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="text-sm font-medium text-gray-700">Event</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="all">All Events</SelectItem>
                    {reportData.events.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>{event.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="all">All Categories</SelectItem>
                    {reportData.categories.map(category => (
                      <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Export Format</label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportReport('pdf')}
                    className="bg-white border-gray-200 hover:bg-gray-50"
                  >
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportReport('excel')}
                    className="bg-white border-gray-200 hover:bg-gray-50"
                  >
                    Excel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportReport('csv')}
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
              value="events" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Analytics
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
                      <p className="text-sm font-medium text-gray-600">Total Events</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalEvents}</p>
                      <p className="text-sm text-green-600">+{reportData.overview.eventsGrowth}% vs last period</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.overview.totalRevenue)}</p>
                      <p className="text-sm text-green-600">+{reportData.overview.revenueGrowth}% vs last period</p>
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
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.overview.totalTicketsSold)}</p>
                      <p className="text-sm text-green-600">+{reportData.overview.ticketSalesGrowth}% vs last period</p>
                    </div>
                    <Ticket className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.conversionRate}%</p>
                      <p className="text-sm text-gray-600">Average ticket price: {formatCurrency(reportData.overview.averageTicketPrice)}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Event */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Award className="h-5 w-5 text-green-600" />
                  Top Performing Event
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportData.overview.topPerformingEvent}</h3>
                    <p className="text-gray-600">Highest revenue generating event</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">#1</p>
                    <p className="text-sm text-gray-600">Best Performer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Event Performance</CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed performance metrics for each event
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-gray-700 font-semibold min-w-[200px]">Event Details</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[100px]">Date & Time</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Category & Venue</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[150px]">Tickets & Attendance</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Revenue</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[100px]">Rating</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[100px]">Status</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.events.map((event) => (
                        <TableRow key={event.id} className="bg-white hover:bg-gray-50">
                          <TableCell className="text-gray-900">
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{event.name}</div>
                              <div className="text-xs text-gray-500">ID: #{event.id}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                {event.category}
                              </Badge>
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.venue}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">{event.ticketsSold.toLocaleString()}</span>
                                <span className="text-gray-500">/{event.capacity.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${event.attendance}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600">{event.attendance}%</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{formatCurrency(event.revenue)}</div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(event.revenue / event.ticketsSold)} avg
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{event.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="hover:bg-gray-100 p-1" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-gray-100 p-1" title="Download Report">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-green-100 text-green-600 p-1" title="Edit Event">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Category Performance</CardTitle>
                <CardDescription className="text-gray-600">
                  Performance breakdown by sport category
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Category</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[80px]">Events</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Tickets Sold</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Revenue</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[100px]">Avg Price</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[120px]">Market Share</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[100px]">Performance</TableHead>
                        <TableHead className="text-gray-700 font-semibold min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.categories.map((category, index) => {
                        const totalRevenue = reportData.categories.reduce((sum, cat) => sum + cat.revenue, 0)
                        const marketShare = ((category.revenue / totalRevenue) * 100).toFixed(1)
                        const performance = Math.round((category.revenue / reportData.categories[0].revenue) * 100)
                        
                        return (
                          <TableRow key={category.name} className="bg-white hover:bg-gray-50">
                            <TableCell className="text-gray-900">
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{category.name}</div>
                                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                  Sport Category
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{category.events}</div>
                                <div className="text-xs text-gray-500">events</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{formatNumber(category.ticketsSold)}</div>
                                <div className="text-xs text-gray-500">
                                  {((category.ticketsSold / reportData.categories.reduce((sum, cat) => sum + cat.ticketsSold, 0)) * 100).toFixed(1)}% of total
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{formatCurrency(category.revenue)}</div>
                                <div className="text-xs text-gray-500">
                                  {marketShare}% market share
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              <div className="text-center">
                                <div className="font-medium text-sm">{formatCurrency(category.avgPrice)}</div>
                                <div className="text-xs text-gray-500">per ticket</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full" 
                                      style={{ width: `${marketShare}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600">{marketShare}%</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${performance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">#{index + 1}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" className="hover:bg-gray-100 p-1" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="hover:bg-gray-100 p-1" title="Download Report">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="hover:bg-green-100 text-green-600 p-1" title="Edit Category">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Monthly Trends</CardTitle>
                  <CardDescription className="text-gray-600">
                    Events and revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {reportData.monthlyData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{month.month}</p>
                          <p className="text-sm text-gray-600">{month.events} events</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(month.revenue)}</p>
                          <p className="text-sm text-gray-600">{formatNumber(month.ticketsSold)} tickets</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Key Insights</CardTitle>
                  <CardDescription className="text-gray-600">
                    Important trends and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Revenue Growth</h4>
                        <p className="text-sm text-blue-700">
                          Revenue has increased by {reportData.overview.revenueGrowth}% compared to last period.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">High Attendance</h4>
                        <p className="text-sm text-green-700">
                          Average attendance rate is 95% across all events.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Peak Season</h4>
                        <p className="text-sm text-yellow-700">
                          March shows the highest activity with 18 events scheduled.
                        </p>
                      </div>
                    </div>
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

export default withAuth(EventReportsPage, ['admin'])
