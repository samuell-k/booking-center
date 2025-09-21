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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Calendar,
  Users,
  Ticket,
  ShoppingCart,
  Award,
  CreditCard,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Settings,
  Activity,
  Star,
  Clock,
  MapPin,
  Globe,
  Smartphone,
  Tablet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Heart,
  X
} from "lucide-react"

function RevenuePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState("30d")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    source: 'ticket-sales',
    amount: '',
    description: '',
    event: '',
    customer: '',
    paymentMethod: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // Mock revenue data
  const revenueData = {
    overview: {
      totalRevenue: 24500000,
      monthlyRevenue: 3500000,
      dailyRevenue: 125000,
      growthRate: 15.2,
      targetRevenue: 30000000,
      achievementRate: 81.7
    },
    sources: [
      { name: "Ticket Sales", amount: 18000000, percentage: 73.5, growth: 12.5, color: "blue" },
      { name: "Merchandise", amount: 3200000, percentage: 13.1, growth: 18.2, color: "green" },
      { name: "Sponsorships", amount: 2000000, percentage: 8.2, growth: 25.8, color: "purple" },
      { name: "Donations", amount: 800000, percentage: 3.3, growth: -5.2, color: "orange" },
      { name: "Other", amount: 500000, percentage: 2.0, growth: 8.1, color: "gray" }
    ],
    monthlyTrend: [
      { month: "Jan", revenue: 1800000, tickets: 900, events: 12 },
      { month: "Feb", revenue: 2200000, tickets: 1100, events: 15 },
      { month: "Mar", revenue: 2800000, tickets: 1400, events: 18 },
      { month: "Apr", revenue: 3200000, tickets: 1600, events: 22 },
      { month: "May", revenue: 3500000, tickets: 1750, events: 25 },
      { month: "Jun", revenue: 4200000, tickets: 2100, events: 28 }
    ],
    topEvents: [
      { name: "APR vs Rayon Sports", revenue: 850000, tickets: 850, date: "2024-03-20", growth: 15.2 },
      { name: "REG vs Patriots", revenue: 420000, tickets: 420, date: "2024-03-22", growth: 8.7 },
      { name: "Police vs AS Kigali", revenue: 320000, tickets: 320, date: "2024-03-25", growth: 22.1 },
      { name: "Kigali Music Fest", revenue: 500000, tickets: 500, date: "2024-03-28", growth: 12.4 }
    ],
    topCustomers: [
      { name: "Jean Baptiste", email: "jean@example.com", totalSpent: 150000, orders: 8, lastPurchase: "2024-03-20" },
      { name: "Marie Claire", email: "marie@example.com", totalSpent: 125000, orders: 6, lastPurchase: "2024-03-19" },
      { name: "Paul Nkurunziza", email: "paul@example.com", totalSpent: 98000, orders: 5, lastPurchase: "2024-03-18" },
      { name: "Grace Uwimana", email: "grace@example.com", totalSpent: 87000, orders: 4, lastPurchase: "2024-03-17" },
      { name: "David Mugenzi", email: "david@example.com", totalSpent: 75000, orders: 3, lastPurchase: "2024-03-16" }
    ],
    paymentMethods: [
      { method: "Mobile Money", revenue: 16000000, percentage: 65.3, transactions: 1250, avgTicket: 12800 },
      { method: "Bank Transfer", revenue: 4500000, percentage: 18.4, transactions: 180, avgTicket: 25000 },
      { method: "Credit Card", revenue: 3000000, percentage: 12.2, transactions: 95, avgTicket: 31579 },
      { method: "Cash", revenue: 1000000, percentage: 4.1, transactions: 200, avgTicket: 5000 }
    ],
    geographic: [
      { region: "Kigali", revenue: 15000000, percentage: 61.2, customers: 750, events: 95 },
      { region: "Huye", revenue: 4500000, percentage: 18.4, customers: 225, events: 28 },
      { region: "Musanze", revenue: 3000000, percentage: 12.2, customers: 150, events: 18 },
      { region: "Other", revenue: 2000000, percentage: 8.2, customers: 122, events: 15 }
    ],
    recentTransactions: [
      { id: "TXN001", customer: "Jean Baptiste", event: "APR vs Rayon Sports", amount: 25000, method: "Mobile Money", date: "2024-03-20 14:30", status: "completed" },
      { id: "TXN002", customer: "Marie Claire", event: "REG vs Patriots", amount: 20000, method: "Bank Transfer", date: "2024-03-20 13:45", status: "completed" },
      { id: "TXN003", customer: "Paul Nkurunziza", event: "Police vs AS Kigali", amount: 15000, method: "Mobile Money", date: "2024-03-19 16:20", status: "pending" },
      { id: "TXN004", customer: "Grace Uwimana", event: "Kigali Music Fest", amount: 30000, method: "Credit Card", date: "2024-03-19 15:10", status: "completed" },
      { id: "TXN005", customer: "David Mugenzi", event: "APR vs Rayon Sports", amount: 10000, method: "Mobile Money", date: "2024-03-18 18:30", status: "completed" }
    ]
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing revenue data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
    setTimeout(() => setIsFormSliding(true), 10)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    setTimeout(() => setIsCreateDialogOpen(false), 700)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      setFormData({
        source: 'ticket-sales',
        amount: '',
        description: '',
        event: '',
        customer: '',
        paymentMethod: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      
      closeCreateDialog()
      // You could add a success toast here
    } catch (error) {
      console.error('Error creating revenue entry:', error)
    } finally {
      setIsSubmitting(false)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'failed': return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      gray: 'bg-gray-100 text-gray-600'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  const filteredTransactions = revenueData.recentTransactions.filter(transaction => {
    const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = sourceFilter === 'all' || transaction.method.toLowerCase().includes(sourceFilter.toLowerCase())
    return matchesSearch && matchesSource
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
            <p className="text-gray-600 mt-1">
              Track and analyze revenue streams and financial performance
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
                  Add Revenue
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
                      <DialogTitle className="text-gray-900">Add New Revenue</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Record a new revenue transaction
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
                    {/* Revenue Source & Basic Info */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Revenue Details</CardTitle>
                        <CardDescription className="text-gray-600">
                          Basic information about the revenue transaction
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="source" className="text-gray-700 font-medium">Revenue Source *</Label>
                            <Select value={formData.source} onValueChange={(value) => handleSelectChange('source', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select revenue source" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ticket-sales">Ticket Sales</SelectItem>
                                <SelectItem value="merchandise">Merchandise</SelectItem>
                                <SelectItem value="sponsorships">Sponsorships</SelectItem>
                                <SelectItem value="donations">Donations</SelectItem>
                                <SelectItem value="other">Other Revenue</SelectItem>
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
                            placeholder="e.g., Ticket sales for APR vs Rayon Sports"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="event" className="text-gray-700 font-medium">Event/Activity</Label>
                            <Input
                              id="event"
                              name="event"
                              value={formData.event}
                              onChange={handleInputChange}
                              placeholder="e.g., APR vs Rayon Sports"
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="customer" className="text-gray-700 font-medium">Customer</Label>
                            <Input
                              id="customer"
                              name="customer"
                              value={formData.customer}
                              onChange={handleInputChange}
                              placeholder="e.g., John Doe"
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Payment Information</CardTitle>
                        <CardDescription className="text-gray-600">
                          Payment method and transaction details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="paymentMethod" className="text-gray-700 font-medium">Payment Method *</Label>
                            <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mobile-money">Mobile Money</SelectItem>
                                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                <SelectItem value="credit-card">Credit Card</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reference" className="text-gray-700 font-medium">Reference Number</Label>
                            <Input
                              id="reference"
                              name="reference"
                              value={formData.reference}
                              onChange={handleInputChange}
                              placeholder="e.g., TXN-001, Invoice #123"
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                        </div>

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
                      </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Additional Information</CardTitle>
                        <CardDescription className="text-gray-600">
                          Optional details for better record keeping
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Additional notes or comments about this revenue..."
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
                            Add Revenue
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
                    {(revenueData.overview.totalRevenue / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(revenueData.overview.growthRate)}
                    <span className={`text-xs font-medium ${getGrowthColor(revenueData.overview.growthRate)}`}>
                      +{revenueData.overview.growthRate}%
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
                  <p className="text-sm text-gray-600 font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(revenueData.overview.monthlyRevenue / 1000000).toFixed(1)}M RWF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current month</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Daily Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(revenueData.overview.dailyRevenue / 1000).toFixed(0)}K RWF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Today's revenue</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Target Achievement</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {revenueData.overview.achievementRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(revenueData.overview.targetRevenue / 1000000).toFixed(1)}M RWF target
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
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
            <CardDescription className="text-gray-600">Filter and search through revenue data</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setPeriodFilter('30d')
                  setSourceFilter('all')
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
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-6 h-auto bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Revenue Sources</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Top Events</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Top Customers</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Analytics</TabsTrigger>
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
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue trend chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Sources Pie Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Revenue Sources</CardTitle>
                  <CardDescription className="text-gray-600">Distribution by source</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue sources pie chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Sources Breakdown */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Revenue Sources Breakdown</CardTitle>
                <CardDescription className="text-gray-600">Detailed breakdown by revenue source</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {revenueData.sources.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getColorClass(source.color)}`} />
                          <span className="font-medium text-gray-900">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {(source.amount / 1000000).toFixed(1)}M RWF
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${
                            source.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {getGrowthIcon(source.growth)}
                            {Math.abs(source.growth)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {source.percentage}% of total revenue
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Revenue Sources</CardTitle>
                <CardDescription className="text-gray-600">Detailed analysis of all revenue streams</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {revenueData.sources.map((source, index) => (
                    <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(source.color)}`}>
                                {source.name === 'Ticket Sales' ? <Ticket className="h-5 w-5" /> :
                                 source.name === 'Merchandise' ? <ShoppingCart className="h-5 w-5" /> :
                                 source.name === 'Sponsorships' ? <Award className="h-5 w-5" /> :
                                 source.name === 'Donations' ? <Heart className="h-5 w-5" /> :
                                 <DollarSign className="h-5 w-5" />}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{source.name}</h3>
                                <p className="text-xs text-gray-600">{source.percentage}% of total</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium text-gray-900">{(source.amount / 1000000).toFixed(1)}M RWF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Growth:</span>
                              <div className="flex items-center gap-1">
                                {getGrowthIcon(source.growth)}
                                <span className={`font-medium ${getGrowthColor(source.growth)}`}>
                                  {source.growth > 0 ? '+' : ''}{source.growth}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${source.percentage}%` }}
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

          {/* Top Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Top Revenue Events</CardTitle>
                <CardDescription className="text-gray-600">Events generating the highest revenue</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Tickets Sold</TableHead>
                      <TableHead className="text-gray-700 font-medium">Revenue (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Growth</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.topEvents.map((event, index) => (
                      <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{event.name}</TableCell>
                        <TableCell className="text-gray-900">{event.date}</TableCell>
                        <TableCell className="text-gray-900">{event.tickets}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {event.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(event.growth)}
                            <span className={`text-sm font-medium ${getGrowthColor(event.growth)}`}>
                              +{event.growth}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Edit className="h-4 w-4" />
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

          {/* Top Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Top Revenue Customers</CardTitle>
                <CardDescription className="text-gray-600">Customers contributing the most revenue</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Customer</TableHead>
                      <TableHead className="text-gray-700 font-medium">Email</TableHead>
                      <TableHead className="text-gray-700 font-medium">Total Spent (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Orders</TableHead>
                      <TableHead className="text-gray-700 font-medium">Last Purchase</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.topCustomers.map((customer, index) => (
                      <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                        <TableCell className="text-gray-900">{customer.email}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {customer.totalSpent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-900">{customer.orders}</TableCell>
                        <TableCell className="text-gray-900">{customer.lastPurchase}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Edit className="h-4 w-4" />
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

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Recent Revenue Transactions</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest revenue transactions ({filteredTransactions.length} transactions)
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Transaction ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Customer</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Amount (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Payment Method</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{transaction.id}</TableCell>
                        <TableCell className="text-gray-900">{transaction.customer}</TableCell>
                        <TableCell className="text-gray-900">{transaction.event}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-900">{transaction.method}</TableCell>
                        <TableCell className="text-gray-900">{transaction.date}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Edit className="h-4 w-4" />
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Payment Methods</CardTitle>
                  <CardDescription className="text-gray-600">Revenue by payment method</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {revenueData.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{method.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(method.revenue / 1000000).toFixed(1)}M RWF</p>
                          <p className="text-sm text-gray-600">{method.percentage}% • {method.transactions} txn</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Geographic Distribution</CardTitle>
                  <CardDescription className="text-gray-600">Revenue by region</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {revenueData.geographic.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{region.region}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(region.revenue / 1000000).toFixed(1)}M RWF</p>
                          <p className="text-sm text-gray-600">{region.percentage}% • {region.customers} customers</p>
                        </div>
                      </div>
                    ))}
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

export default withAuth(RevenuePage, ['admin'])
