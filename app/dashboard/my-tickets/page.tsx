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
import { Ticket, Search, Filter, Download, Eye, Calendar, MapPin, Clock, QrCode, Users, Plus, Minus, Edit, Trash2, MoreHorizontal, RefreshCw, TrendingUp, DollarSign, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import Link from "next/link"

function AdminMyTickets() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [editingTicket, setEditingTicket] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)

  // Mock tickets data
  const [tickets, setTickets] = useState([
    {
      id: "TKT-001",
      event: "Rwanda vs Ghana - World Cup Qualifier",
      date: "2024-03-15",
      time: "19:00",
      venue: "Amahoro Stadium",
      section: "VIP A",
      seat: "A12",
      price: 15000,
      quantity: 2,
      status: "active",
      qrCode: "QR123456789",
      purchaseDate: "2024-03-10",
      customer: "John Doe",
      email: "john@example.com"
    },
    {
      id: "TKT-002",
      event: "APR vs Rayon Sports - League Match",
      date: "2024-03-20",
      time: "16:00",
      venue: "Kigali Stadium",
      section: "General",
      seat: "G45",
      price: 5000,
      quantity: 1,
      status: "used",
      qrCode: "QR987654321",
      purchaseDate: "2024-03-12",
      customer: "Jane Smith",
      email: "jane@example.com"
    },
    {
      id: "TKT-003",
      event: "Basketball Championship Final",
      date: "2024-03-25",
      time: "18:30",
      venue: "BK Arena",
      section: "Premium",
      seat: "P08",
      price: 8000,
      quantity: 3,
      status: "cancelled",
      qrCode: "QR456789123",
      purchaseDate: "2024-03-14",
      customer: "Mike Johnson",
      email: "mike@example.com"
    },
    {
      id: "TKT-004",
      event: "Volleyball League Final",
      date: "2024-03-30",
      time: "17:00",
      venue: "Petit Stade",
      section: "Standard",
      seat: "S23",
      price: 3000,
      quantity: 1,
      status: "active",
      qrCode: "QR789123456",
      purchaseDate: "2024-03-16",
      customer: "Sarah Wilson",
      email: "sarah@example.com"
    }
  ])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "used":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Used</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTicket = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket) {
      setEditingTicket(ticketId)
      setEditQuantity(ticket.quantity)
    }
  }

  const handleSaveEdit = async (ticketId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, quantity: editQuantity }
          : ticket
      ))
      
      setEditingTicket(null)
    } catch (error) {
      console.error('Error updating ticket:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingTicket(null)
    setEditQuantity(1)
  }

  const activeTickets = filteredTickets.filter(t => t.status === "active")
  const usedTickets = filteredTickets.filter(t => t.status === "used")
  const cancelledTickets = filteredTickets.filter(t => t.status === "cancelled")

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all your ticket purchases and bookings
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
        <Link href="/tickets/buy">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Buy New Tickets
          </Button>
        </Link>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
                  <p className="text-xs text-green-600 mt-1">All time</p>
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
                  <p className="text-sm text-gray-600 font-medium">Active Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{activeTickets.length}</p>
                  <p className="text-xs text-blue-600 mt-1">Ready to use</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(tickets.reduce((sum, ticket) => sum + ticket.price, 0) / 1000).toFixed(0)}K RWF
                  </p>
                  <p className="text-xs text-green-600 mt-1">+12% this month</p>
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
                  <p className="text-sm text-gray-600 font-medium">Used Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{usedTickets.length}</p>
                  <p className="text-xs text-yellow-600 mt-1">Attended events</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
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
            <CardDescription className="text-gray-600">Filter and search through your tickets</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets, events, or venues..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
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
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 h-auto bg-white border border-gray-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">All Tickets ({filteredTickets.length})</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Active ({activeTickets.length})</TabsTrigger>
            <TabsTrigger value="used" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Used ({usedTickets.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Cancelled ({cancelledTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">All Tickets</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete overview of all your ticket purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Ticket ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date & Time</TableHead>
                      <TableHead className="text-gray-700 font-medium">Venue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Seat</TableHead>
                      <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                      <TableHead className="text-gray-700 font-medium">Price</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.event}</div>
                            <div className="text-sm text-gray-600">{ticket.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{ticket.date}</div>
                              <div className="text-xs text-gray-600">{ticket.time}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{ticket.venue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{ticket.section} - {ticket.seat}</TableCell>
                        <TableCell>
                          {editingTicket === ticket.id ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                                className="bg-white border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 h-8 text-center bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                                min="1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditQuantity(editQuantity + 1)}
                                className="bg-white border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-medium">{ticket.quantity}</span>
                              {ticket.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditTicket(ticket.id)}
                                  className="bg-white border-gray-200 hover:bg-gray-50 h-6 w-6 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {(ticket.price * ticket.quantity).toLocaleString()} RWF
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {editingTicket === ticket.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(ticket.id)}
                                  disabled={isLoading}
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                                >
                                  {isLoading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  className="bg-white border-gray-200 hover:bg-gray-50 h-8 px-3"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Active Tickets</CardTitle>
                <CardDescription className="text-gray-600">
                  Tickets that are valid and can be used for entry
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Ticket ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date & Time</TableHead>
                      <TableHead className="text-gray-700 font-medium">Venue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Seat</TableHead>
                      <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                      <TableHead className="text-gray-700 font-medium">Price</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.event}</div>
                            <div className="text-sm text-gray-600">{ticket.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{ticket.date}</div>
                              <div className="text-xs text-gray-600">{ticket.time}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{ticket.venue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{ticket.section} - {ticket.seat}</TableCell>
                        <TableCell>
                          {editingTicket === ticket.id ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                                className="bg-white border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 h-8 text-center bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                                min="1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditQuantity(editQuantity + 1)}
                                className="bg-white border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-medium">{ticket.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTicket(ticket.id)}
                                className="bg-white border-gray-200 hover:bg-gray-50 h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {(ticket.price * ticket.quantity).toLocaleString()} RWF
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {editingTicket === ticket.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(ticket.id)}
                                  disabled={isLoading}
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                                >
                                  {isLoading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  className="bg-white border-gray-200 hover:bg-gray-50 h-8 px-3"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="used" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Used Tickets</CardTitle>
                <CardDescription className="text-gray-600">
                  Tickets that have been scanned and used for entry
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Ticket ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date & Time</TableHead>
                      <TableHead className="text-gray-700 font-medium">Venue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Seat</TableHead>
                      <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                      <TableHead className="text-gray-700 font-medium">Price</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usedTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.event}</div>
                            <div className="text-sm text-gray-600">{ticket.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{ticket.date}</div>
                              <div className="text-xs text-gray-600">{ticket.time}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{ticket.venue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{ticket.section} - {ticket.seat}</TableCell>
                        <TableCell>
                          <span className="text-gray-900 font-medium">{ticket.quantity}</span>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {(ticket.price * ticket.quantity).toLocaleString()} RWF
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
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

          <TabsContent value="cancelled" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Cancelled Tickets</CardTitle>
                <CardDescription className="text-gray-600">
                  Tickets that have been cancelled or refunded
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Ticket ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date & Time</TableHead>
                      <TableHead className="text-gray-700 font-medium">Venue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Seat</TableHead>
                      <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                      <TableHead className="text-gray-700 font-medium">Price</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.event}</div>
                            <div className="text-sm text-gray-600">{ticket.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{ticket.date}</div>
                              <div className="text-xs text-gray-600">{ticket.time}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{ticket.venue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{ticket.section} - {ticket.seat}</TableCell>
                        <TableCell>
                          <span className="text-gray-900 font-medium">{ticket.quantity}</span>
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {(ticket.price * ticket.quantity).toLocaleString()} RWF
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <RefreshCw className="h-4 w-4" />
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminMyTickets, ['admin'])
