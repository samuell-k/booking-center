"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Plus,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Banknote,
  Receipt,
  Target,
  Search,
  Minus,
  Settings,
  FileText,
  Activity,
  X
} from 'lucide-react'

function AdminFinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'revenue',
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    vendor: '',
    reference: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  })

  // Mock financial data
  const financeStats = {
    totalRevenue: 12450000,
    monthlyRevenue: 2850000,
    totalExpenses: 3200000,
    monthlyExpenses: 750000,
    netProfit: 9250000,
    monthlyProfit: 2100000,
    revenueGrowth: 15.2,
    expenseGrowth: -8.5,
    profitMargin: 74.3,
    pendingPayments: 450000,
    completedTransactions: 1247,
    failedTransactions: 23
  }

  const revenueStreams = [
    { name: "Ticket Sales", amount: 8500000, percentage: 68.3, growth: 12.5, color: "blue" },
    { name: "Store Sales", amount: 2200000, percentage: 17.7, growth: 18.2, color: "green" },
    { name: "Sponsorships", amount: 1200000, percentage: 9.6, growth: 25.8, color: "purple" },
    { name: "Donations", amount: 350000, percentage: 2.8, growth: -5.2, color: "orange" },
    { name: "Other", amount: 200000, percentage: 1.6, growth: 8.1, color: "gray" }
  ]

  const expenseCategories = [
    { name: "Platform Maintenance", amount: 1200000, percentage: 37.5, budget: 1500000, color: "red" },
    { name: "Payment Processing", amount: 850000, percentage: 26.6, budget: 900000, color: "yellow" },
    { name: "Marketing", amount: 600000, percentage: 18.8, budget: 800000, color: "blue" },
    { name: "Staff Salaries", amount: 400000, percentage: 12.5, budget: 450000, color: "green" },
    { name: "Other Expenses", amount: 150000, percentage: 4.7, budget: 200000, color: "gray" }
  ]

  const recentTransactions = [
    { id: "TXN001", type: "revenue", description: "Ticket Sales - APR FC vs Rayon Sports", amount: 125000, date: "2025-01-15 14:30", status: "completed", method: "MTN Mobile Money" },
    { id: "TXN002", type: "expense", description: "Payment Gateway Fees", amount: -8500, date: "2025-01-15 14:25", status: "completed", method: "Bank Transfer" },
    { id: "TXN003", type: "revenue", description: "Store Purchase - Team Jersey", amount: 25000, date: "2025-01-15 13:45", status: "completed", method: "Airtel Money" },
    { id: "TXN004", type: "revenue", description: "Sponsorship Payment - Bank of Kigali", amount: 500000, date: "2025-01-15 10:20", status: "pending", method: "Bank Transfer" },
    { id: "TXN005", type: "expense", description: "Server Hosting Costs", amount: -45000, date: "2025-01-15 09:15", status: "completed", method: "Credit Card" },
    { id: "TXN006", type: "revenue", description: "Donation - Community Support", amount: 15000, date: "2025-01-14 16:30", status: "completed", method: "MTN Mobile Money" }
  ]

  const paymentMethods = [
    { name: "MTN Mobile Money", transactions: 456, amount: 5200000, percentage: 41.8, status: "active" },
    { name: "Airtel Money", transactions: 234, amount: 2800000, percentage: 22.5, status: "active" },
    { name: "Bank Transfer", transactions: 189, amount: 3100000, percentage: 24.9, status: "active" },
    { name: "Credit Card", transactions: 98, amount: 850000, percentage: 6.8, status: "active" },
    { name: "Cash", transactions: 45, amount: 500000, percentage: 4.0, status: "limited" }
  ]

  const getTransactionIcon = (type: string) => {
    return type === 'revenue' ? 
      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-600" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <RefreshCw className="h-4 w-4 text-gray-600" />
    }
  }

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      gray: 'bg-gray-100 text-gray-600'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing finance data:', error)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
    setTimeout(() => setIsFormSliding(true), 10)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    setTimeout(() => setIsCreateDialogOpen(false), 700)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      setFormData({
        type: 'revenue',
        description: '',
        amount: '',
        category: '',
        paymentMethod: '',
        vendor: '',
        reference: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5)
      })
      
      closeCreateDialog()
      // You could add a success toast here
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
          <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
            <p className="text-gray-600 mt-1">
                Monitor revenue, expenses, and financial performance
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
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              if (!open) closeCreateDialog()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className={`w-[600px] h-full max-w-none bg-white [&>button]:hidden ${
                isFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`} style={{ 
                position: 'fixed',
                top: '0',
                right: '0',
                height: '100vh',
                width: '600px',
                transform: isFormSliding 
                  ? 'translateX(0)' 
                  : 'translateX(100%)',
                transition: 'transform 700ms ease-out, opacity 700ms ease-out',
                borderRadius: '0',
                border: 'none',
                boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
                zIndex: 9999,
                margin: '0',
                maxWidth: '600px',
                left: 'auto'
              }}>
                <DialogHeader className="bg-white border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-gray-900">Create New Transaction</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Add a new financial transaction to the system
                      </DialogDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeCreateDialog}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
              </div>
                </DialogHeader>
                
                <div className="space-y-6 bg-white overflow-y-auto h-full pb-20">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Transaction Type & Basic Info */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                    <CardHeader className="bg-white">
                      <CardTitle className="text-gray-900">Transaction Details</CardTitle>
                      <CardDescription className="text-gray-600">
                        Basic information about the transaction
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-gray-700 font-medium">Transaction Type *</Label>
                          <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                            <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="revenue">Revenue</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
            </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount" className="text-gray-700 font-medium">Amount (RWF) *</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="e.g., 50000"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
          </div>
        </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-700 font-medium">Description *</Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="e.g., Ticket Sales - APR FC vs Rayon Sports"
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-gray-700 font-medium">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                            <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.type === 'revenue' ? (
                                <>
                                  <SelectItem value="ticket-sales">Ticket Sales</SelectItem>
                                  <SelectItem value="store-sales">Store Sales</SelectItem>
                                  <SelectItem value="sponsorships">Sponsorships</SelectItem>
                                  <SelectItem value="donations">Donations</SelectItem>
                                  <SelectItem value="other-revenue">Other Revenue</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="platform-maintenance">Platform Maintenance</SelectItem>
                                  <SelectItem value="payment-processing">Payment Processing</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="staff-salaries">Staff Salaries</SelectItem>
                                  <SelectItem value="other-expenses">Other Expenses</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                  </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod" className="text-gray-700 font-medium">Payment Method *</Label>
                          <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                            <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mtn-mobile-money">MTN Mobile Money</SelectItem>
                              <SelectItem value="airtel-money">Airtel Money</SelectItem>
                              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                </div>
              </div>
            </CardContent>
          </Card>

                    {/* Additional Information */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                    <CardHeader className="bg-white">
                      <CardTitle className="text-gray-900">Additional Information</CardTitle>
                      <CardDescription className="text-gray-600">
                        Optional details for better transaction tracking
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="vendor" className="text-gray-700 font-medium">Vendor/Customer</Label>
                          <Input
                            id="vendor"
                            name="vendor"
                            value={formData.vendor}
                            onChange={handleInputChange}
                            placeholder="e.g., Bank of Kigali, John Doe"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reference" className="text-gray-700 font-medium">Reference Number</Label>
                          <Input
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleInputChange}
                            placeholder="e.g., TXN001, Invoice #123"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-gray-700 font-medium">Date *</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-gray-700 font-medium">Time *</Label>
                          <Input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Additional notes or comments about this transaction..."
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeCreateDialog}
                        className="bg-white border-gray-200 hover:bg-gray-50"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Transaction
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
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
                    {(financeStats.totalRevenue / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(financeStats.revenueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(financeStats.revenueGrowth)}`}>
                      +{financeStats.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(financeStats.totalExpenses / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(financeStats.expenseGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(financeStats.expenseGrowth)}`}>
                    {financeStats.expenseGrowth}%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Net Profit</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(financeStats.netProfit / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-blue-600 font-medium">
                    {financeStats.profitMargin}% margin
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Payments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(financeStats.pendingPayments / 1000).toFixed(0)}K RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                    {financeStats.failedTransactions} failed
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
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
            <CardDescription className="text-gray-600">Filter and search through financial data</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions, descriptions..."
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
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-5 h-auto bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Revenue</TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Expenses</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Transactions</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Monthly Performance
                  </CardTitle>
                  <CardDescription className="text-gray-600">Current month financial summary</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Monthly Revenue</span>
                      <span className="font-semibold text-green-600">
                        {(financeStats.monthlyRevenue / 1000000).toFixed(1)}M RWF
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Monthly Expenses</span>
                      <span className="font-semibold text-red-600">
                        {(financeStats.monthlyExpenses / 1000000).toFixed(1)}M RWF
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Monthly Profit</span>
                      <span className="font-semibold text-blue-600">
                        {(financeStats.monthlyProfit / 1000000).toFixed(1)}M RWF
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-gray-900">Profit Margin</span>
                        <span className="text-green-600">
                          {((financeStats.monthlyProfit / financeStats.monthlyRevenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-green-600" />
                    Transaction Summary
                  </CardTitle>
                  <CardDescription className="text-gray-600">Recent transaction activity</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Completed Transactions</span>
                      <span className="font-semibold text-green-600">
                        {financeStats.completedTransactions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Failed Transactions</span>
                      <span className="font-semibold text-red-600">
                        {financeStats.failedTransactions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Success Rate</span>
                      <span className="font-semibold text-blue-600">
                        {((financeStats.completedTransactions / (financeStats.completedTransactions + financeStats.failedTransactions)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-gray-900">Pending Amount</span>
                        <span className="text-green-600">
                          {(financeStats.pendingPayments / 1000).toFixed(0)}K RWF
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Recent Transactions</CardTitle>
                    <CardDescription className="text-gray-600">Latest financial activity</CardDescription>
                  </div>
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Eye className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{transaction.description}</div>
                          <div className="text-xs text-gray-600">
                            {transaction.id} • {transaction.method}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} RWF
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          {getStatusIcon(transaction.status)}
                          <Badge className={`${getStatusColor(transaction.status)} border-${transaction.status === 'completed' ? 'green' : transaction.status === 'pending' ? 'yellow' : 'red'}-200`} variant="secondary">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Revenue Streams</CardTitle>
                    <CardDescription className="text-gray-600">Breakdown of income sources</CardDescription>
                  </div>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getColorClass(stream.color)}`} />
                          <span className="font-medium text-gray-900">{stream.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {(stream.amount / 1000000).toFixed(1)}M RWF
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${
                            stream.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stream.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(stream.growth)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stream.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {stream.percentage}% of total revenue
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Expense Categories</CardTitle>
                <CardDescription className="text-gray-600">Budget vs actual spending analysis</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-6">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getColorClass(category.color)}`} />
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {(category.amount / 1000000).toFixed(1)}M RWF
                          </div>
                          <div className="text-sm text-gray-600">
                            Budget: {(category.budget / 1000000).toFixed(1)}M RWF
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              category.amount > category.budget ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((category.amount / category.budget) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {category.percentage}% of total expenses
                          </span>
                          <span className={`font-medium ${
                            category.amount > category.budget ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {((category.amount / category.budget) * 100).toFixed(1)}% of budget
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-gray-900">All Transactions</CardTitle>
                    <CardDescription className="text-gray-600">Complete transaction history</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700 font-medium">Transaction</TableHead>
                        <TableHead className="text-gray-700 font-medium">Type</TableHead>
                        <TableHead className="text-gray-700 font-medium">Amount</TableHead>
                        <TableHead className="text-gray-700 font-medium">Method</TableHead>
                        <TableHead className="text-gray-700 font-medium">Status</TableHead>
                        <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-gray-200 hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{transaction.id}</div>
                              <div className="text-sm text-gray-600">
                                {transaction.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              <Badge variant={transaction.type === 'revenue' ? 'default' : 'secondary'} className="bg-green-100 text-green-800 border-green-200">
                                {transaction.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} RWF
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">{transaction.method}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              <Badge className={`${getStatusColor(transaction.status)} border-${transaction.status === 'completed' ? 'green' : transaction.status === 'pending' ? 'yellow' : 'red'}-200`}>
                                {transaction.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {transaction.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Payment Methods</CardTitle>
                <CardDescription className="text-gray-600">Payment gateway performance and statistics</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paymentMethods.map((method, index) => (
                    <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{method.name}</h3>
                                <Badge variant={method.status === 'active' ? 'default' : 'secondary'} className={`text-xs ${method.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                  {method.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Transactions:</span>
                              <span className="font-medium text-gray-900">{method.transactions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium text-gray-900">{(method.amount / 1000000).toFixed(1)}M RWF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Share:</span>
                              <span className="font-medium text-gray-900">{method.percentage}%</span>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${method.percentage}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

export default withAuth(AdminFinancePage, ['admin'])
