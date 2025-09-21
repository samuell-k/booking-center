"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Ticket, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Eye, 
  Download, 
  RefreshCw, 
  Filter, 
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  LineChart,
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
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  StopCircle,
  ShoppingCart,
  CreditCard,
  QrCode
} from "lucide-react"

function TicketSalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock ticket sales data
  const ticketSalesData = {
    overview: {
      totalSales: 125000,
      totalRevenue: 24500000,
      averageTicketPrice: 1960,
      conversionRate: 12.5,
      refundRate: 2.1,
      salesGrowth: 15.2,
      revenueGrowth: 18.7,
      todaySales: 45,
      todayRevenue: 125000
    },
    recentSales: [
      {
        id: 1,
        customerName: "Jean Baptiste",
        customerEmail: "jean@example.com",
        eventName: "APR vs Rayon Sports",
        ticketType: "VIP",
        quantity: 2,
        price: 10000,
        totalAmount: 20000,
        purchaseDate: "2024-03-20",
        status: "completed",
        paymentMethod: "Mobile Money"
      },
      {
        id: 2,
        customerName: "Marie Claire",
        customerEmail: "marie@example.com",
        eventName: "REG vs Patriots",
        ticketType: "Standard",
        quantity: 4,
        price: 5000,
        totalAmount: 20000,
        purchaseDate: "2024-03-20",
        status: "completed",
        paymentMethod: "Bank Transfer"
      },
      {
        id: 3,
        customerName: "Paul Nkurunziza",
        customerEmail: "paul@example.com",
        eventName: "Police vs AS Kigali",
        ticketType: "Premium",
        quantity: 1,
        price: 15000,
        totalAmount: 15000,
        purchaseDate: "2024-03-19",
        status: "pending",
        paymentMethod: "Credit Card"
      },
      {
        id: 4,
        customerName: "Grace Uwimana",
        customerEmail: "grace@example.com",
        eventName: "Kigali Music Fest",
        ticketType: "General",
        quantity: 3,
        price: 3000,
        totalAmount: 9000,
        purchaseDate: "2024-03-19",
        status: "refunded",
        paymentMethod: "Mobile Money"
      },
      {
        id: 5,
        customerName: "David Mugenzi",
        customerEmail: "david@example.com",
        eventName: "APR vs Rayon Sports",
        ticketType: "Standard",
        quantity: 2,
        price: 5000,
        totalAmount: 10000,
        purchaseDate: "2024-03-18",
        status: "completed",
        paymentMethod: "Mobile Money"
      }
    ],
    topEvents: [
      { name: "APR vs Rayon Sports", ticketsSold: 850, revenue: 850000, growth: 15.2 },
      { name: "REG vs Patriots", ticketsSold: 420, revenue: 420000, growth: 8.7 },
      { name: "Police vs AS Kigali", ticketsSold: 320, revenue: 320000, growth: 22.1 },
      { name: "Kigali Music Fest", ticketsSold: 500, revenue: 500000, growth: 12.4 }
    ],
    ticketTypes: [
      { type: "VIP", price: 10000, sold: 250, revenue: 2500000, percentage: 20 },
      { type: "Premium", price: 15000, sold: 180, revenue: 2700000, percentage: 15 },
      { type: "Standard", price: 5000, sold: 600, revenue: 3000000, percentage: 45 },
      { type: "General", price: 3000, sold: 220, revenue: 660000, percentage: 20 }
    ],
    salesTrends: [
      { month: "Jan", sales: 1200, revenue: 2400000 },
      { month: "Feb", sales: 1400, revenue: 2800000 },
      { month: "Mar", sales: 1600, revenue: 3200000 },
      { month: "Apr", sales: 1450, revenue: 2900000 },
      { month: "May", sales: 1750, revenue: 3500000 },
      { month: "Jun", sales: 2100, revenue: 4200000 }
    ],
    paymentMethods: [
      { method: "Mobile Money", percentage: 65, count: 81250, revenue: 15925000 },
      { method: "Bank Transfer", percentage: 20, count: 25000, revenue: 4900000 },
      { method: "Credit Card", percentage: 10, count: 12500, revenue: 2450000 },
      { method: "Cash", percentage: 5, count: 6250, revenue: 1225000 }
    ]
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing ticket sales:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'refunded': return <Badge className="bg-red-100 text-red-800 border-red-200">Refunded</Badge>
      case 'cancelled': return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Cancelled</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
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

  const filteredSales = ticketSalesData.recentSales.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter
    const matchesEvent = eventFilter === 'all' || sale.eventName.toLowerCase().includes(eventFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesEvent
  })

  const events = [...new Set(ticketSalesData.recentSales.map(sale => sale.eventName))]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ticket Sales</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor ticket sales performance and analytics
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
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Sales
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Sales</p>
                  <p className="text-3xl font-bold text-gray-900">{ticketSalesData.overview.totalSales.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(ticketSalesData.overview.salesGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(ticketSalesData.overview.salesGrowth)}`}>
                      +{ticketSalesData.overview.salesGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(ticketSalesData.overview.totalRevenue / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(ticketSalesData.overview.revenueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(ticketSalesData.overview.revenueGrowth)}`}>
                      +{ticketSalesData.overview.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Average Price</p>
                  <p className="text-3xl font-bold text-gray-900">{ticketSalesData.overview.averageTicketPrice.toLocaleString()} RWF</p>
                  <p className="text-xs text-gray-500 mt-1">Per ticket</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{ticketSalesData.overview.conversionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Sales conversion</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
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
                  <p className="text-sm text-gray-600 font-medium">Today's Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{ticketSalesData.overview.todaySales}</p>
                  <p className="text-xs text-gray-500 mt-1">Tickets sold today</p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{(ticketSalesData.overview.todayRevenue / 1000).toLocaleString()}K RWF</p>
                  <p className="text-xs text-gray-500 mt-1">Revenue today</p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Refund Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{ticketSalesData.overview.refundRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Refund percentage</p>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-green-600" />
              Filters & Search
            </CardTitle>
            <CardDescription className="text-gray-600">Filter and search through ticket sales</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers, events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event} value={event}>{event}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setEventFilter('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-5 h-auto bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Recent Sales</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Event Performance</TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Ticket Types</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Sales Trend</CardTitle>
                  <CardDescription className="text-gray-600">Monthly ticket sales performance</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Sales trend chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <p className="text-gray-500">Revenue trend chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Events */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Top Performing Events</CardTitle>
                <CardDescription className="text-gray-600">Events with highest ticket sales and revenue</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {ticketSalesData.topEvents.map((event, index) => (
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
                        <div className="flex items-center gap-1">
                          {getGrowthIcon(event.growth)}
                          <span className={`text-xs font-medium ${getGrowthColor(event.growth)}`}>
                            +{event.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Recent Sales</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest ticket sales transactions ({filteredSales.length} sales)
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Customer</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Ticket Type</TableHead>
                      <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                      <TableHead className="text-gray-700 font-medium">Amount</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{sale.customerName}</div>
                            <div className="text-sm text-gray-600">{sale.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{sale.eventName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {sale.ticketType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900">{sale.quantity}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {sale.totalAmount.toLocaleString()} RWF
                        </TableCell>
                        <TableCell className="text-gray-900">{sale.purchaseDate}</TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Performance Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Event Performance</CardTitle>
                <CardDescription className="text-gray-600">Detailed performance metrics for each event</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {ticketSalesData.topEvents.map((event, index) => (
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
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(event.revenue / 1000).toLocaleString()}K RWF</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(event.growth)}
                            <span className={`text-sm font-medium ${getGrowthColor(event.growth)}`}>
                              +{event.growth}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Growth</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ticket Types Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Ticket Types Performance</CardTitle>
                <CardDescription className="text-gray-600">Sales performance by ticket category</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {ticketSalesData.ticketTypes.map((ticket, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Ticket className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.type}</h4>
                          <p className="text-sm text-gray-600">{ticket.price.toLocaleString()} RWF per ticket</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{ticket.sold} sold</p>
                          <p className="text-sm text-gray-600">{ticket.percentage}%</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(ticket.revenue / 1000).toLocaleString()}K RWF</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Payment Methods</CardTitle>
                  <CardDescription className="text-gray-600">Distribution of payment methods used</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {ticketSalesData.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{method.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{method.percentage}%</p>
                          <p className="text-sm text-gray-600">{method.count.toLocaleString()} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Distribution */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Sales Distribution</CardTitle>
                  <CardDescription className="text-gray-600">Ticket sales by category</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Sales distribution chart</p>
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

export default withAuth(TicketSalesPage, ['admin'])
