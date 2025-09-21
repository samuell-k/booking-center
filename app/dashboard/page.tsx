"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts'

import {
  BarChart3,
  Users,
  Ticket,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Shield,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  FileText,
  Activity,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from "lucide-react"
import { matches, userTickets, storeProducts } from "@/lib/dummy-data"
import Link from "next/link"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Mock admin stats
  const stats = {
    totalUsers: 1247,
    totalTicketsSold: 3456,
    totalRevenue: 12450000,
    activeEvents: 15,
    storeOrders: 89,
    pendingPayments: 23,
    newUsersToday: 12,
    ticketsSoldToday: 45,
    revenueToday: 125000,
    systemAlerts: 3
  }

  // Chart data
  const revenueData = [
    { month: "Jan", revenue: 2400000, tickets: 1200, bookings: 45, confirmed: 6 },
    { month: "Feb", revenue: 2800000, tickets: 1400, bookings: 55, confirmed: 6 },
    { month: "Mar", revenue: 3200000, tickets: 1600, bookings: 60, confirmed: 8 },
    { month: "Apr", revenue: 2900000, tickets: 1450, bookings: 45, confirmed: 1 },
    { month: "May", revenue: 3500000, tickets: 1750, bookings: 30, confirmed: 7 },
    { month: "Jun", revenue: 4200000, tickets: 2100, bookings: 25, confirmed: 8 },
    { month: "Jul", revenue: 3800000, tickets: 1900, bookings: 45, confirmed: 10 },
    { month: "Aug", revenue: 4100000, tickets: 2050, bookings: 40, confirmed: 7 },
    { month: "Sep", revenue: 4600000, tickets: 2300, bookings: 65, confirmed: 12 },
    { month: "Oct", revenue: 4400000, tickets: 2200, bookings: 50, confirmed: 11 },
    { month: "Nov", revenue: 4800000, tickets: 2400, bookings: 45, confirmed: 11 },
    { month: "Dec", revenue: 5200000, tickets: 2600, bookings: 42, confirmed: 9 }
  ]

  const customerReservationData = [
    { month: "Feb-24", confirmed: 6, pending: 45 },
    { month: "Mar-24", confirmed: 6, pending: 55 },
    { month: "Apr-24", confirmed: 8, pending: 60 },
    { month: "May-24", confirmed: 1, pending: 45 },
    { month: "Jun-24", confirmed: 7, pending: 30 },
    { month: "Jul-24", confirmed: 8, pending: 25 },
    { month: "Aug-24", confirmed: 10, pending: 45 },
    { month: "Sep-24", confirmed: 7, pending: 40 },
    { month: "Oct-24", confirmed: 12, pending: 65 },
    { month: "Nov-24", confirmed: 11, pending: 50 },
    { month: "Dec-24", confirmed: 11, pending: 45 },
    { month: "Jan-25", confirmed: 9, pending: 42 }
  ]

  const teamPerformanceData = [
    { team: "APR FC", revenue: 3750000, tickets: 1250, growth: 15.2 },
    { team: "Rayon Sports", revenue: 2670000, tickets: 890, growth: 8.7 },
    { team: "REG BBC", revenue: 900000, tickets: 450, growth: 22.1 },
    { team: "Patriots BBC", revenue: 640000, tickets: 320, growth: 12.4 },
    { team: "Police FC", revenue: 1800000, tickets: 600, growth: 18.9 },
  ]

  const eventPerformanceData = [
    { event: "APR vs Rayon Sports", date: "2025-01-20", revenue: 850000, tickets: 850, status: "upcoming" },
    { event: "REG vs Patriots", date: "2025-01-22", revenue: 420000, tickets: 420, status: "upcoming" },
    { event: "Police vs AS Kigali", date: "2025-01-25", revenue: 320000, tickets: 320, status: "upcoming" },
    { event: "Gisagara vs UTB", date: "2025-01-27", revenue: 180000, tickets: 180, status: "upcoming" },
    { event: "Kigali Music Fest", date: "2025-02-01", revenue: 500000, tickets: 500, status: "upcoming" },
  ]

  const recentUsers = [
    { id: 1, name: "Jean Baptiste", email: "jean@email.com", joined: "2025-01-15", status: "active", role: "client", lastLogin: "2025-01-15 14:30" },
    { id: 2, name: "Marie Claire", email: "marie@email.com", joined: "2025-01-14", status: "active", role: "client", lastLogin: "2025-01-15 09:15" },
    { id: 3, name: "Paul Kagame", email: "paul@email.com", joined: "2025-01-13", status: "pending", role: "team", lastLogin: "Never" },
    { id: 4, name: "Alice Uwimana", email: "alice@email.com", joined: "2025-01-12", status: "active", role: "client", lastLogin: "2025-01-14 16:45" },
    { id: 5, name: "David Nkurunziza", email: "david@email.com", joined: "2025-01-11", status: "suspended", role: "client", lastLogin: "2025-01-13 11:20" },
  ]

  const recentOrders = [
    { id: "ORD001", user: "Jean Baptiste", amount: 25000, status: "completed", date: "2025-01-15", type: "ticket", items: 2 },
    { id: "ORD002", user: "Marie Claire", amount: 8000, status: "pending", date: "2025-01-15", type: "store", items: 1 },
    { id: "ORD003", user: "Paul Kagame", amount: 15000, status: "completed", date: "2025-01-14", type: "ticket", items: 3 },
    { id: "ORD004", user: "Alice Uwimana", amount: 12000, status: "failed", date: "2025-01-14", type: "ticket", items: 2 },
    { id: "ORD005", user: "David Nkurunziza", amount: 5000, status: "completed", date: "2025-01-13", type: "store", items: 1 },
  ]

  const systemAlerts = [
    { id: 1, type: "warning", message: "High server load detected", time: "2 minutes ago", severity: "medium" },
    { id: 2, type: "info", message: "Scheduled maintenance in 2 hours", time: "1 hour ago", severity: "low" },
    { id: 3, type: "error", message: "Payment gateway timeout", time: "5 minutes ago", severity: "high" },
  ]

  const teams = [
    { id: 1, name: "APR FC", sport: "Football", members: 25000, ticketsSold: 1250, revenue: 3750000, status: "active" },
    { id: 2, name: "Rayon Sports", sport: "Football", members: 18000, ticketsSold: 890, revenue: 2670000, status: "active" },
    { id: 3, name: "REG BBC", sport: "Basketball", members: 8000, ticketsSold: 450, revenue: 900000, status: "active" },
    { id: 4, name: "Patriots BBC", sport: "Basketball", members: 6500, ticketsSold: 320, revenue: 640000, status: "active" },
    { id: 5, name: "Police FC", sport: "Football", members: 12000, ticketsSold: 600, revenue: 1800000, status: "active" },
  ]

  const filteredUsers = recentUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2 lg:px-3"
    >
      {children}
      {sortField === field && (
        sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
      )}
      {sortField !== field && <ArrowUpDown className="ml-2 h-4 w-4" />}
    </Button>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-100 m-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">SmartSports Rwanda Analytics & Management</p>
            </div>
            <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
                </Button>
            <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Export
                </Button>
          </div>
        </div>

        {/* Key Metrics Table */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription className="text-gray-600">Overview of platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">Metric</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Current Value</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Previous Period</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Growth</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-white hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Total Revenue
                </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-semibold">{(stats.totalRevenue / 1000000).toFixed(1)}M RWF</TableCell>
                  <TableCell className="text-gray-600">10.4M RWF</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      +20.2%
                </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-green-600" />
                      Tickets Sold
              </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-semibold">{stats.totalTicketsSold.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-600">2,800</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      +23.4%
                </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      Active Users
              </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-semibold">{stats.totalUsers.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-600">1,100</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      +13.4%
                </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Good</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      Active Events
                </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-semibold">{stats.activeEvents}</TableCell>
                  <TableCell className="text-gray-600">12</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      +25.0%
              </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </CardContent>
          </Card>

        {/* Revenue Chart */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Revenue & Ticket Sales Trend
                </CardTitle>
                <CardDescription className="text-gray-600">Monthly performance over the last 12 months</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">Last 7 Days</Button>
                <Button variant="outline" size="sm" className="bg-green-600 text-white hover:bg-green-700 border-green-600">Last 30 Days</Button>
                <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">Last Quarter</Button>
                </div>
              </div>
          </CardHeader>
          <CardContent className="bg-white">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`${(value as number).toLocaleString()} RWF`, 'Revenue']
                        if (name === 'tickets') return [value, 'Tickets Sold']
                        return [value, name]
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="revenue" 
                      fill="#10b981" 
                      name="Revenue (RWF)"
                      radius={[2, 2, 0, 0]}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="tickets" 
                      stroke="#059669" 
                      strokeWidth={3}
                      dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                      name="Tickets Sold"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Chart Summary */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Peak: 5.2M RWF in December
                </div>
                <div className="text-sm text-gray-500">
                  Total Revenue: {(revenueData.reduce((sum, item) => sum + item.revenue, 0) / 1000000).toFixed(1)}M RWF
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Reservations Chart */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="h-5 w-5 text-green-600" />
                  Customer Reservations
                </CardTitle>
                <CardDescription className="text-gray-600">Booking confirmed vs pending over time</CardDescription>
                </div>
              </div>
          </CardHeader>
          <CardContent className="bg-white">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={customerReservationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => {
                        if (name === 'confirmed') return [value, 'Booking Confirmed']
                        if (name === 'pending') return [value, 'Booking Pending']
                        return [value, name]
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="confirmed" 
                      fill="#10b981" 
                      name="Booking Confirmed"
                      radius={[2, 2, 0, 0]}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      name="Booking Pending"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Chart Summary */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Peak Confirmed: 12 in October
                </div>
                <div className="text-sm text-gray-500">
                  Peak Pending: 65 in October
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Table */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Team Performance Analysis
                </CardTitle>
                <CardDescription className="text-gray-600">Revenue and ticket sales by team</CardDescription>
                </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Search teams..." className="w-64 bg-white border-gray-200" />
                <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
              </Button>
            </div>
                    </div>
            </CardHeader>
          <CardContent className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="team">Team</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="revenue">Revenue</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="tickets">Tickets Sold</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="growth">Growth</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamPerformanceData.map((team) => (
                  <TableRow key={team.team} className="bg-white hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-green-600" />
                    </div>
                        {team.team}
                  </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-semibold">{(team.revenue / 1000000).toFixed(1)}M RWF</div>
                      <div className="text-sm text-gray-500">This month</div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-semibold">{team.tickets.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Tickets</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">+{team.growth}%</span>
                </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                  </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200">
                          <DropdownMenuLabel className="text-gray-900">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </CardContent>
            </Card>

        {/* Event Performance Table */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Event Performance
                </CardTitle>
                <CardDescription className="text-gray-600">Upcoming events and their performance metrics</CardDescription>
                  </div>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-40 bg-white border-gray-200">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="all" className="text-gray-700">All Events</SelectItem>
                    <SelectItem value="upcoming" className="text-gray-700">Upcoming</SelectItem>
                    <SelectItem value="completed" className="text-gray-700">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
              </div>
                </div>
              </CardHeader>
          <CardContent className="bg-white">
                  <Table>
                    <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="event">Event</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="date">Date</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="revenue">Revenue</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="tickets">Tickets Sold</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                {eventPerformanceData.map((event, index) => (
                  <TableRow key={index} className="bg-white hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                            <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-green-600" />
                              </div>
                        {event.event}
                            </div>
                          </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-semibold">{event.date}</div>
                      <div className="text-sm text-gray-500">15:00</div>
                          </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-semibold">{(event.revenue / 1000).toFixed(0)}K RWF</div>
                      <div className="text-sm text-gray-500">Projected</div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-semibold">{event.tickets}</div>
                      <div className="text-sm text-gray-500">Sold</div>
                          </TableCell>
                          <TableCell>
                      <Badge className={event.status === "upcoming" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                        {event.status}
                      </Badge>
                          </TableCell>
                          <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                              </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200">
                          <DropdownMenuLabel className="text-gray-900">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>

        {/* Recent Transactions Table */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Ticket className="h-5 w-5 text-green-600" />
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-gray-600">Latest ticket sales and payment activities</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Search transactions..." className="w-64 bg-white border-gray-200" />
                <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
              </CardHeader>
          <CardContent className="bg-white">
                  <Table>
                    <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="id">Transaction ID</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="customer">Customer</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="event">Event</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="amount">Amount</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="status">Status</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <SortButton field="date">Date</SortButton>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="bg-white hover:bg-gray-50">
                    <TableCell className="font-mono text-sm text-gray-900">{order.id}</TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-medium">{order.user}</div>
                      <div className="text-sm text-gray-500">{order.items} items</div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                              <div className="font-medium">
                        {order.type === 'ticket' ? 'Sports Ticket' : 'Store Purchase'}
                              </div>
                      <div className="text-sm text-gray-500">
                        {order.type === 'ticket' ? 'Match Ticket' : 'Merchandise'}
                            </div>
                          </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-semibold">{order.amount.toLocaleString()} RWF</div>
                      <div className="text-sm text-gray-500">
                        {order.type === 'ticket' ? 'Ticket Sale' : 'Store Sale'}
                      </div>
                          </TableCell>
                          <TableCell>
                      <Badge 
                        className={
                          order.status === "completed" ? "bg-green-100 text-green-800 border-green-200" : 
                          order.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                          "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="font-medium">{order.date}</div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                          </TableCell>
                          <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                              </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200">
                          <DropdownMenuLabel className="text-gray-900">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>

      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminDashboard, ['admin'])
