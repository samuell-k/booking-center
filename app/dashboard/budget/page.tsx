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
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Calculator,
  PiggyBank,
  Building,
  ShoppingCart,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap
} from "lucide-react"

function BudgetPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'operating',
    name: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    totalRevenue: '',
    totalExpenses: '',
    notes: ''
  })

  // Mock budget data
  const budgetData = {
    overview: {
      totalRevenue: 15000000,
      totalExpenses: 10800000,
      netProfit: 4200000,
      profitMargin: 28.0,
      budgetVariance: 5.2,
      monthlyTarget: 1250000
    },
    budgets: [
      {
        id: "BUD001",
        name: "Q1 2024 Operating Budget",
        type: "operating",
        period: "quarterly",
        startDate: "2024-01-01",
        endDate: "2024-03-31",
        status: "active",
        totalRevenue: 5000000,
        totalExpenses: 3600000,
        variance: 2.5
      },
      {
        id: "BUD002", 
        name: "Cash Flow Budget",
        type: "cash",
        period: "monthly",
        startDate: "2024-03-01",
        endDate: "2024-03-31",
        status: "active",
        totalRevenue: 1500000,
        totalExpenses: 1200000,
        variance: -1.2
      },
      {
        id: "BUD003",
        name: "Capital Investment Budget",
        type: "capital", 
        period: "yearly",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "planning",
        totalRevenue: 0,
        totalExpenses: 8000000,
        variance: 0
      }
    ],
    budgetTypes: [
      {
        name: "Operating Budget",
        description: "Daily operations, sales, costs, and expenses",
        icon: Calculator,
        color: "bg-blue-100 text-blue-600",
        examples: ["Revenue forecasts", "Operating expenses", "COGS"]
      },
      {
        name: "Cash Budget", 
        description: "Cash inflows & outflows for liquidity management",
        icon: CreditCard,
        color: "bg-green-100 text-green-600",
        examples: ["Cash receipts", "Cash payments", "Bank balance"]
      },
      {
        name: "Capital Budget",
        description: "Major investments in assets and infrastructure", 
        icon: Building,
        color: "bg-purple-100 text-purple-600",
        examples: ["Equipment purchases", "Property investments", "IT systems"]
      },
      {
        name: "Sales Budget",
        description: "Forecast of expected sales revenue",
        icon: TrendingUp,
        color: "bg-orange-100 text-orange-600", 
        examples: ["Product sales", "Service revenue", "Market projections"]
      },
      {
        name: "Expense Budget",
        description: "Planned operational and overhead expenses",
        icon: FileText,
        color: "bg-red-100 text-red-600",
        examples: ["Marketing costs", "Salaries", "Utilities", "Rent"]
      }
    ],
    rwandaExample: {
      expectedSales: 5000000,
      expenses: [
        { category: "Rent", amount: 500000, percentage: 10.0 },
        { category: "Salaries", amount: 1500000, percentage: 30.0 },
        { category: "Inventory", amount: 2000000, percentage: 40.0 },
        { category: "Utilities & Others", amount: 300000, percentage: 6.0 },
        { category: "Marketing", amount: 200000, percentage: 4.0 },
        { category: "Insurance", amount: 100000, percentage: 2.0 },
        { category: "Miscellaneous", amount: 200000, percentage: 4.0 }
      ],
      totalExpenses: 4800000,
      budgetedProfit: 200000,
      profitMargin: 4.0
    },
    varianceAnalysis: [
      { category: "Revenue", budgeted: 5000000, actual: 4800000, variance: -200000, percentage: -4.0 },
      { category: "Rent", budgeted: 500000, actual: 500000, variance: 0, percentage: 0.0 },
      { category: "Salaries", budgeted: 1500000, actual: 1550000, variance: 50000, percentage: 3.3 },
      { category: "Inventory", budgeted: 2000000, actual: 1900000, variance: -100000, percentage: -5.0 },
      { category: "Utilities", budgeted: 300000, actual: 320000, variance: 20000, percentage: 6.7 }
    ]
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing budget data:', error)
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setFormData({
        type: 'operating',
        name: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: '',
        totalRevenue: '',
        totalExpenses: '',
        notes: ''
      })
      
      closeCreateDialog()
    } catch (error) {
      console.error('Error creating budget:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (variance < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getVarianceColor = (percentage: number) => {
    if (percentage > 5) return "text-red-600"
    if (percentage > 0) return "text-yellow-600"
    if (percentage < -5) return "text-green-600"
    if (percentage < 0) return "text-blue-600"
    return "text-gray-500"
  }

  const getBudgetTypeIcon = (type: string) => {
    const budgetType = budgetData.budgetTypes.find(bt => bt.name.toLowerCase().includes(type))
    return budgetType ? budgetType.icon : Calculator
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'planning': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Planning</Badge>
      case 'completed': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>
      case 'cancelled': return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
            <p className="text-gray-600 mt-1">
              Plan, monitor, and control your financial resources with comprehensive budgeting
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
                  Create Budget
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
                      <DialogTitle className="text-gray-900">Create New Budget</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Plan your financial resources for better control
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
                    {/* Budget Information */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Budget Information</CardTitle>
                        <CardDescription className="text-gray-600">
                          Basic information about the budget
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 font-medium">Budget Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Q1 2024 Operating Budget"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="type" className="text-gray-700 font-medium">Budget Type *</Label>
                            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select budget type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="operating">Operating Budget</SelectItem>
                                <SelectItem value="cash">Cash Budget</SelectItem>
                                <SelectItem value="capital">Capital Budget</SelectItem>
                                <SelectItem value="sales">Sales Budget</SelectItem>
                                <SelectItem value="expense">Expense Budget</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="period" className="text-gray-700 font-medium">Period *</Label>
                            <Select value={formData.period} onValueChange={(value) => handleSelectChange('period', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-gray-700 font-medium">Start Date *</Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              value={formData.startDate}
                              onChange={handleInputChange}
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-gray-700 font-medium">End Date *</Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              value={formData.endDate}
                              onChange={handleInputChange}
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the purpose and scope of this budget..."
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Targets */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Financial Targets</CardTitle>
                        <CardDescription className="text-gray-600">
                          Set your revenue and expense targets
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="totalRevenue" className="text-gray-700 font-medium">Expected Revenue (RWF)</Label>
                            <Input
                              id="totalRevenue"
                              name="totalRevenue"
                              type="number"
                              value={formData.totalRevenue}
                              onChange={handleInputChange}
                              placeholder="e.g., 5000000"
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="totalExpenses" className="text-gray-700 font-medium">Planned Expenses (RWF)</Label>
                            <Input
                              id="totalExpenses"
                              name="totalExpenses"
                              type="number"
                              value={formData.totalExpenses}
                              onChange={handleInputChange}
                              placeholder="e.g., 4300000"
                              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        {/* Auto-calculated profit */}
                        {formData.totalRevenue && formData.totalExpenses && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Calculator className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">Projected Profit</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900 mt-2">
                              {(parseInt(formData.totalRevenue || '0') - parseInt(formData.totalExpenses || '0')).toLocaleString()} RWF
                            </p>
                            <p className="text-sm text-green-700">
                              Profit Margin: {(((parseInt(formData.totalRevenue || '0') - parseInt(formData.totalExpenses || '0')) / parseInt(formData.totalRevenue || '1')) * 100).toFixed(1)}%
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Additional Information</CardTitle>
                        <CardDescription className="text-gray-600">
                          Additional notes and assumptions
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
                            placeholder="Include any assumptions, constraints, or additional context for this budget..."
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                            rows={4}
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
                            Create Budget
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
                    {(budgetData.overview.totalRevenue / 1000000).toFixed(1)}M RWF
                  </p>
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
                    {(budgetData.overview.totalExpenses / 1000000).toFixed(1)}M RWF
                  </p>
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
                    {(budgetData.overview.netProfit / 1000000).toFixed(1)}M RWF
                  </p>
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
                  <p className="text-sm text-gray-600 font-medium">Profit Margin</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {budgetData.overview.profitMargin}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Types Overview */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">Budget Types</CardTitle>
            <CardDescription className="text-gray-600">Understanding different types of budgets</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetData.budgetTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{type.name}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Examples:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {type.examples.map((example, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rwanda Example */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">Rwanda Small Business Example</CardTitle>
            <CardDescription className="text-gray-600">Practical budget example for a small shop in Rwanda</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Expected Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(budgetData.rwandaExample.expectedSales / 1000000).toFixed(1)}M RWF
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(budgetData.rwandaExample.totalExpenses / 1000000).toFixed(1)}M RWF
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Budgeted Profit</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(budgetData.rwandaExample.budgetedProfit / 1000).toFixed(0)}K RWF
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Expense Breakdown:</h4>
                <div className="space-y-3">
                  {budgetData.rwandaExample.expenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-100 rounded-full" />
                        <span className="font-medium text-gray-900">{expense.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {(expense.amount / 1000).toFixed(0)}K RWF
                        </div>
                        <div className="text-sm text-gray-600">{expense.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(BudgetPage, ['admin'])