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
  TrendingDown,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Calendar,
  Users,
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
  Receipt,
  ShoppingCart,
  Wrench,
  Megaphone,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  StopCircle,
  X
} from "lucide-react"

function ExpensesPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState("30d")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category: 'platform-maintenance',
    amount: '',
    description: '',
    vendor: '',
    paymentMethod: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    status: 'paid',
    notes: ''
  })

  // Mock expenses data
  const expensesData = {
    overview: {
      totalExpenses: 3200000,
      monthlyExpenses: 750000,
      dailyExpenses: 25000,
      growthRate: -8.5,
      budgetLimit: 1000000,
      budgetUsed: 75.0
    },
    categories: [
      { name: "Platform Maintenance", amount: 1200000, percentage: 37.5, budget: 1500000, color: "red", growth: -5.2 },
      { name: "Payment Processing", amount: 850000, percentage: 26.6, budget: 900000, color: "yellow", growth: 12.1 },
      { name: "Marketing", amount: 600000, percentage: 18.8, budget: 800000, color: "blue", growth: -15.3 },
      { name: "Staff Salaries", amount: 400000, percentage: 12.5, budget: 450000, color: "green", growth: 8.7 },
      { name: "Other Expenses", amount: 150000, percentage: 4.7, budget: 200000, color: "gray", growth: -2.1 }
    ],
    monthlyTrend: [
      { month: "Jan", expenses: 2800000, budget: 3000000, variance: -200000 },
      { month: "Feb", expenses: 3200000, budget: 3000000, variance: 200000 },
      { month: "Mar", expenses: 2900000, budget: 3000000, variance: -100000 },
      { month: "Apr", expenses: 3500000, budget: 3000000, variance: 500000 },
      { month: "May", expenses: 3200000, budget: 3000000, variance: 200000 },
      { month: "Jun", expenses: 2800000, budget: 3000000, variance: -200000 }
    ],
    recentExpenses: [
      { id: "EXP001", description: "Server hosting costs", category: "Platform Maintenance", amount: 45000, vendor: "AWS", date: "2024-03-20", status: "paid", paymentMethod: "Credit Card" },
      { id: "EXP002", description: "Payment gateway fees", category: "Payment Processing", amount: 8500, vendor: "Stripe", date: "2024-03-20", status: "paid", paymentMethod: "Bank Transfer" },
      { id: "EXP003", description: "Marketing campaign", category: "Marketing", amount: 150000, vendor: "Google Ads", date: "2024-03-19", status: "pending", paymentMethod: "Credit Card" },
      { id: "EXP004", description: "Office supplies", category: "Other Expenses", amount: 25000, vendor: "Office Depot", date: "2024-03-18", status: "paid", paymentMethod: "Cash" },
      { id: "EXP005", description: "Staff salary - March", category: "Staff Salaries", amount: 400000, vendor: "Payroll", date: "2024-03-15", status: "paid", paymentMethod: "Bank Transfer" }
    ],
    topVendors: [
      { name: "AWS", totalSpent: 450000, transactions: 12, category: "Platform Maintenance", lastPayment: "2024-03-20" },
      { name: "Stripe", totalSpent: 180000, transactions: 45, category: "Payment Processing", lastPayment: "2024-03-20" },
      { name: "Google Ads", totalSpent: 320000, transactions: 8, category: "Marketing", lastPayment: "2024-03-19" },
      { name: "Office Depot", totalSpent: 75000, transactions: 15, category: "Other Expenses", lastPayment: "2024-03-18" },
      { name: "Payroll", totalSpent: 400000, transactions: 1, category: "Staff Salaries", lastPayment: "2024-03-15" }
    ],
    budgetAnalysis: [
      { category: "Platform Maintenance", budgeted: 1500000, spent: 1200000, remaining: 300000, percentage: 80.0 },
      { category: "Payment Processing", budgeted: 900000, spent: 850000, remaining: 50000, percentage: 94.4 },
      { category: "Marketing", budgeted: 800000, spent: 600000, remaining: 200000, percentage: 75.0 },
      { category: "Staff Salaries", budgeted: 450000, spent: 400000, remaining: 50000, percentage: 88.9 },
      { category: "Other Expenses", budgeted: 200000, spent: 150000, remaining: 50000, percentage: 75.0 }
    ],
    paymentMethods: [
      { method: "Bank Transfer", amount: 1200000, percentage: 37.5, transactions: 25, avgAmount: 48000 },
      { method: "Credit Card", amount: 950000, percentage: 29.7, transactions: 18, avgAmount: 52778 },
      { method: "Mobile Money", amount: 650000, percentage: 20.3, transactions: 35, avgAmount: 18571 },
      { method: "Cash", amount: 400000, percentage: 12.5, transactions: 50, avgAmount: 8000 }
    ]
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing expenses data:', error)
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
        category: 'platform-maintenance',
        amount: '',
        description: '',
        vendor: '',
        paymentMethod: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
        notes: ''
      })
      
      closeCreateDialog()
      // You could add a success toast here
    } catch (error) {
      console.error('Error creating expense entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-red-600" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-green-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-red-600"
    if (growth < 0) return "text-green-600"
    return "text-gray-500"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'overdue': return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Platform Maintenance': return <Wrench className="h-5 w-5" />
      case 'Payment Processing': return <CreditCard className="h-5 w-5" />
      case 'Marketing': return <Megaphone className="h-5 w-5" />
      case 'Staff Salaries': return <Users className="h-5 w-5" />
      case 'Other Expenses': return <Receipt className="h-5 w-5" />
      default: return <DollarSign className="h-5 w-5" />
    }
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      gray: 'bg-gray-100 text-gray-600'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  const filteredExpenses = expensesData.recentExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalBudgeted = expensesData.budgetAnalysis.reduce((sum, item) => sum + item.budgeted, 0)
  const totalSpent = expensesData.budgetAnalysis.reduce((sum, item) => sum + item.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
            <p className="text-gray-600 mt-1">
              Track and manage business expenses and budget allocation
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
                  Add Expense
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
                      <DialogTitle className="text-gray-900">Add New Expense</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Record a new business expense
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
                    {/* Expense Category & Basic Info */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Expense Details</CardTitle>
                        <CardDescription className="text-gray-600">
                          Basic information about the expense
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="category" className="text-gray-700 font-medium">Expense Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select expense category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="platform-maintenance">Platform Maintenance</SelectItem>
                                <SelectItem value="payment-processing">Payment Processing</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="staff-salaries">Staff Salaries</SelectItem>
                                <SelectItem value="other-expenses">Other Expenses</SelectItem>
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
                            placeholder="e.g., Server hosting costs"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="vendor" className="text-gray-700 font-medium">Vendor/Supplier *</Label>
                            <Input
                              id="vendor"
                              name="vendor"
                              value={formData.vendor}
                              onChange={handleInputChange}
                              placeholder="e.g., AWS, Google Ads"
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status" className="text-gray-700 font-medium">Status *</Label>
                            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                              </SelectContent>
                            </Select>
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
                                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                <SelectItem value="credit-card">Credit Card</SelectItem>
                                <SelectItem value="mobile-money">Mobile Money</SelectItem>
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
                              placeholder="e.g., EXP-001, Invoice #123"
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
                            placeholder="Additional notes or comments about this expense..."
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
                            Add Expense
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
                  <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(expensesData.overview.totalExpenses / 1000000).toFixed(1)}M RWF
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getGrowthIcon(expensesData.overview.growthRate)}
                    <span className={`text-xs font-medium ${getGrowthColor(expensesData.overview.growthRate)}`}>
                      {expensesData.overview.growthRate}%
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
                  <p className="text-sm text-gray-600 font-medium">Monthly Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(expensesData.overview.monthlyExpenses / 1000000).toFixed(1)}M RWF
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
                  <p className="text-sm text-gray-600 font-medium">Daily Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(expensesData.overview.dailyExpenses / 1000).toFixed(0)}K RWF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Today's expenses</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Budget Used</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {expensesData.overview.budgetUsed}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(expensesData.overview.budgetLimit / 1000000).toFixed(1)}M RWF limit
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
            <CardDescription className="text-gray-600">Filter and search through expense data</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses, vendors..."
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

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Platform Maintenance">Platform Maintenance</SelectItem>
                  <SelectItem value="Payment Processing">Payment Processing</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Staff Salaries">Staff Salaries</SelectItem>
                  <SelectItem value="Other Expenses">Other Expenses</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setPeriodFilter('30d')
                  setCategoryFilter('all')
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
            <TabsTrigger value="categories" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Categories</TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Expenses</TabsTrigger>
            <TabsTrigger value="vendors" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Top Vendors</TabsTrigger>
            <TabsTrigger value="budget" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Budget Analysis</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Trend Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Expense Trend</CardTitle>
                  <CardDescription className="text-gray-600">Monthly expense performance vs budget</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Expense trend chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Categories Pie Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Expense Categories</CardTitle>
                  <CardDescription className="text-gray-600">Distribution by category</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Expense categories pie chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Categories Breakdown */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Expense Categories Breakdown</CardTitle>
                <CardDescription className="text-gray-600">Detailed breakdown by expense category</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {expensesData.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getCategoryColor(category.color)}`} />
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {(category.amount / 1000000).toFixed(1)}M RWF
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${
                            category.growth > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {getGrowthIcon(category.growth)}
                            {Math.abs(category.growth)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {category.percentage}% of total expenses
                        </span>
                        <span className="text-gray-600">
                          Budget: {(category.budget / 1000000).toFixed(1)}M RWF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Expense Categories</CardTitle>
                <CardDescription className="text-gray-600">Detailed analysis of all expense categories</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expensesData.categories.map((category, index) => (
                    <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(category.color)}`}>
                                {getCategoryIcon(category.name)}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{category.name}</h3>
                                <p className="text-xs text-gray-600">{category.percentage}% of total</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium text-gray-900">{(category.amount / 1000000).toFixed(1)}M RWF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Budget:</span>
                              <span className="font-medium text-gray-900">{(category.budget / 1000000).toFixed(1)}M RWF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Growth:</span>
                              <div className="flex items-center gap-1">
                                {getGrowthIcon(category.growth)}
                                <span className={`font-medium ${getGrowthColor(category.growth)}`}>
                                  {category.growth > 0 ? '+' : ''}{category.growth}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${category.percentage}%` }}
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

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Recent Expenses</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest expense transactions ({filteredExpenses.length} expenses)
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Expense ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Description</TableHead>
                      <TableHead className="text-gray-700 font-medium">Category</TableHead>
                      <TableHead className="text-gray-700 font-medium">Vendor</TableHead>
                      <TableHead className="text-gray-700 font-medium">Amount (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Payment Method</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{expense.id}</TableCell>
                        <TableCell className="text-gray-900">{expense.description}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900">{expense.vendor}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-900">{expense.paymentMethod}</TableCell>
                        <TableCell className="text-gray-900">{expense.date}</TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
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

          {/* Top Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Top Vendors</CardTitle>
                <CardDescription className="text-gray-600">Vendors with highest expense amounts</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Vendor</TableHead>
                      <TableHead className="text-gray-700 font-medium">Category</TableHead>
                      <TableHead className="text-gray-700 font-medium">Total Spent (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Transactions</TableHead>
                      <TableHead className="text-gray-700 font-medium">Last Payment</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expensesData.topVendors.map((vendor, index) => (
                      <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{vendor.name}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {vendor.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {vendor.totalSpent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-900">{vendor.transactions}</TableCell>
                        <TableCell className="text-gray-900">{vendor.lastPayment}</TableCell>
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

          {/* Budget Analysis Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Budget Analysis</CardTitle>
                <CardDescription className="text-gray-600">Budget vs actual spending by category</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-6">
                  {expensesData.budgetAnalysis.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-100" />
                          <span className="font-medium text-gray-900">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {(item.spent / 1000000).toFixed(1)}M / {(item.budgeted / 1000000).toFixed(1)}M RWF
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.remaining > 0 ? `${(item.remaining / 1000).toFixed(0)}K remaining` : 'Over budget'}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.percentage > 100 ? 'bg-red-500' : item.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.percentage.toFixed(1)}% of budget used
                          </span>
                          <span className={`font-medium ${
                            item.percentage > 100 ? 'text-red-600' : item.percentage > 80 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {item.remaining > 0 ? `${(item.remaining / 1000).toFixed(0)}K remaining` : 'Over budget'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Budget Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Budgeted</p>
                        <p className="text-2xl font-bold text-gray-900">{(totalBudgeted / 1000000).toFixed(1)}M RWF</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">{(totalSpent / 1000000).toFixed(1)}M RWF</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalRemaining >= 0 ? '+' : ''}{(totalRemaining / 1000000).toFixed(1)}M RWF
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <CardDescription className="text-gray-600">Expenses by payment method</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {expensesData.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{method.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(method.amount / 1000000).toFixed(1)}M RWF</p>
                          <p className="text-sm text-gray-600">{method.percentage}% • {method.transactions} txn</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">Monthly Trend</CardTitle>
                  <CardDescription className="text-gray-600">Expenses vs budget over time</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {expensesData.monthlyTrend.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{month.month}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(month.expenses / 1000000).toFixed(1)}M RWF</p>
                          <p className={`text-sm ${month.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {month.variance >= 0 ? '+' : ''}{(month.variance / 1000000).toFixed(1)}M vs budget
                          </p>
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

export default withAuth(ExpensesPage, ['admin'])
