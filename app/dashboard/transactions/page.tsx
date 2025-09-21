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
import { Search, Filter, Download, Eye, CreditCard, DollarSign, Calendar, User, RefreshCw, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Mock transactions data
  const transactions = [
    {
      id: "TXN-001",
      user: "John Doe",
      email: "john@example.com",
      type: "ticket_purchase",
      amount: 15000,
      status: "completed",
      date: "2024-03-15",
      time: "14:30",
      event: "Rwanda vs Ghana",
      paymentMethod: "Mobile Money"
    },
    {
      id: "TXN-002",
      user: "Jane Smith",
      email: "jane@example.com",
      type: "refund",
      amount: 25000,
      status: "pending",
      date: "2024-03-14",
      time: "10:15",
      event: "APR vs Rayon Sports",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "TXN-003",
      user: "Mike Johnson",
      email: "mike@example.com",
      type: "ticket_purchase",
      amount: 30000,
      status: "completed",
      date: "2024-03-13",
      time: "16:45",
      event: "Basketball Championship",
      paymentMethod: "Credit Card"
    },
    {
      id: "TXN-004",
      user: "Sarah Wilson",
      email: "sarah@example.com",
      type: "withdrawal",
      amount: 50000,
      status: "failed",
      date: "2024-03-12",
      time: "09:20",
      event: "Team Earnings",
      paymentMethod: "Bank Transfer"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'failed': return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ticket_purchase': return <Badge className="bg-green-100 text-green-800 border-green-200">Ticket Purchase</Badge>
      case 'refund': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Refund</Badge>
      case 'withdrawal': return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Withdrawal</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{type}</Badge>
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.type === 'ticket_purchase')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const completedTransactions = transactions.filter(t => t.status === 'completed').length
  const successRate = ((completedTransactions / transactions.length) * 100).toFixed(1)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Monitor all financial transactions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} RWF</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+12.5%</span>
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
                  <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingAmount.toLocaleString()} RWF</p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">Awaiting</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{completedTransactions} completed</span>
                  </div>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Excellent</span>
                  </div>
                </div>
                <User className="h-8 w-8 text-green-600" />
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
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ticket_purchase">Ticket Purchase</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">All Transactions ({filteredTransactions.length})</CardTitle>
            <CardDescription className="text-gray-600">View and manage all financial transactions</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Transaction ID</TableHead>
                    <TableHead className="text-gray-700 font-semibold">User Details</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Amount</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Date & Time</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Event</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Payment Method</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="bg-white hover:bg-gray-50">
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{transaction.id}</p>
                          <p className="text-xs text-gray-500">Transaction</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{transaction.user}</p>
                          <p className="text-xs text-gray-500">{transaction.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{transaction.amount.toLocaleString()} RWF</p>
                          <p className="text-xs text-gray-500">Amount</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-green-600" />
                            <p className="text-sm font-medium">{transaction.date}</p>
                          </div>
                          <p className="text-xs text-gray-500">{transaction.time}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <p className="text-sm">{transaction.event}</p>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3 text-green-600" />
                          <p className="text-sm">{transaction.paymentMethod}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-1" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-green-100 text-green-600 p-1" title="Download Receipt">
                            <Download className="h-4 w-4" />
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
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminTransactions)
