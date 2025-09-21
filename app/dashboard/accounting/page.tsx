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
  Calculator,
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Activity,
  CreditCard,
  Banknote,
  Receipt,
  Settings,
  X
} from "lucide-react"

function AccountingPage() {
  const [activeTab, setActiveTab] = useState("chart-of-accounts")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [accountTypeFilter, setAccountTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'journal-entry',
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    debitAccount: '',
    creditAccount: '',
    amount: '',
    notes: ''
  })

  // Mock accounting data
  const chartOfAccounts = [
    { id: "1000", name: "Cash", type: "Asset", category: "Current Assets", balance: 2500000, normalBalance: "Debit" },
    { id: "1100", name: "Accounts Receivable", type: "Asset", category: "Current Assets", balance: 1800000, normalBalance: "Debit" },
    { id: "1200", name: "Inventory", type: "Asset", category: "Current Assets", balance: 3200000, normalBalance: "Debit" },
    { id: "1500", name: "Equipment", type: "Asset", category: "Fixed Assets", balance: 8500000, normalBalance: "Debit" },
    { id: "2000", name: "Accounts Payable", type: "Liability", category: "Current Liabilities", balance: 1200000, normalBalance: "Credit" },
    { id: "2100", name: "Accrued Expenses", type: "Liability", category: "Current Liabilities", balance: 450000, normalBalance: "Credit" },
    { id: "3000", name: "Owner's Equity", type: "Equity", category: "Equity", balance: 15000000, normalBalance: "Credit" },
    { id: "4000", name: "Ticket Sales Revenue", type: "Revenue", category: "Operating Revenue", balance: 8500000, normalBalance: "Credit" },
    { id: "5000", name: "Cost of Goods Sold", type: "Expense", category: "Operating Expenses", balance: 2100000, normalBalance: "Debit" },
    { id: "6000", name: "Marketing Expenses", type: "Expense", category: "Operating Expenses", balance: 750000, normalBalance: "Debit" }
  ]

  const journalEntries = [
    { id: "JE001", date: "2024-03-20", description: "Ticket sales for APR vs Rayon Sports", debitAccount: "Cash", creditAccount: "Ticket Sales Revenue", amount: 125000, reference: "TXN-001" },
    { id: "JE002", date: "2024-03-20", description: "Payment gateway fees", debitAccount: "Payment Processing Fees", creditAccount: "Cash", amount: 3750, reference: "TXN-002" },
    { id: "JE003", date: "2024-03-19", description: "Equipment purchase", debitAccount: "Equipment", creditAccount: "Accounts Payable", amount: 500000, reference: "INV-001" },
    { id: "JE004", date: "2024-03-18", description: "Marketing campaign payment", debitAccount: "Marketing Expenses", creditAccount: "Cash", amount: 150000, reference: "MKT-001" },
    { id: "JE005", date: "2024-03-17", description: "Inventory purchase", debitAccount: "Inventory", creditAccount: "Cash", amount: 200000, reference: "INV-002" }
  ]

  const generalLedger = [
    { account: "Cash", date: "2024-03-20", description: "Ticket sales", debit: 125000, credit: 0, balance: 2500000 },
    { account: "Cash", date: "2024-03-20", description: "Payment gateway fees", debit: 0, credit: 3750, balance: 2496250 },
    { account: "Ticket Sales Revenue", date: "2024-03-20", description: "Ticket sales", debit: 0, credit: 125000, balance: 8500000 },
    { account: "Equipment", date: "2024-03-19", description: "Equipment purchase", debit: 500000, credit: 0, balance: 8500000 },
    { account: "Marketing Expenses", date: "2024-03-18", description: "Marketing campaign", debit: 150000, credit: 0, balance: 750000 }
  ]

  const trialBalance = [
    { account: "Cash", debit: 2500000, credit: 0 },
    { account: "Accounts Receivable", debit: 1800000, credit: 0 },
    { account: "Inventory", debit: 3200000, credit: 0 },
    { account: "Equipment", debit: 8500000, credit: 0 },
    { account: "Accounts Payable", debit: 0, credit: 1200000 },
    { account: "Owner's Equity", debit: 0, credit: 15000000 },
    { account: "Ticket Sales Revenue", debit: 0, credit: 8500000 },
    { account: "Marketing Expenses", debit: 750000, credit: 0 }
  ]

  const balanceSheet = {
    assets: {
      currentAssets: [
        { name: "Cash", amount: 2500000 },
        { name: "Accounts Receivable", amount: 1800000 },
        { name: "Inventory", amount: 3200000 }
      ],
      fixedAssets: [
        { name: "Equipment", amount: 8500000 },
        { name: "Accumulated Depreciation", amount: -1200000 }
      ]
    },
    liabilities: {
      currentLiabilities: [
        { name: "Accounts Payable", amount: 1200000 },
        { name: "Accrued Expenses", amount: 450000 }
      ]
    },
    equity: [
      { name: "Owner's Equity", amount: 15000000 },
      { name: "Retained Earnings", amount: 8500000 }
    ]
  }

  const incomeStatement = {
    revenue: [
      { name: "Ticket Sales Revenue", amount: 8500000 },
      { name: "Merchandise Sales", amount: 1200000 },
      { name: "Sponsorship Revenue", amount: 800000 }
    ],
    expenses: [
      { name: "Cost of Goods Sold", amount: 2100000 },
      { name: "Marketing Expenses", amount: 750000 },
      { name: "Administrative Expenses", amount: 450000 },
      { name: "Payment Processing Fees", amount: 180000 }
    ]
  }

  const cashFlowStatement = {
    operating: [
      { name: "Net Income", amount: 5000000 },
      { name: "Depreciation", amount: 200000 },
      { name: "Accounts Receivable Change", amount: -150000 },
      { name: "Inventory Change", amount: -200000 }
    ],
    investing: [
      { name: "Equipment Purchase", amount: -500000 },
      { name: "Property Investment", amount: -1000000 }
    ],
    financing: [
      { name: "Owner Investment", amount: 2000000 },
      { name: "Loan Repayment", amount: -300000 }
    ]
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing accounting data:', error)
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
        type: 'journal-entry',
        date: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        debitAccount: '',
        creditAccount: '',
        amount: '',
        notes: ''
      })
      
      closeCreateDialog()
      // You could add a success toast here
    } catch (error) {
      console.error('Error creating accounting entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'bg-green-100 text-green-800 border-green-200'
      case 'Liability': return 'bg-red-100 text-red-800 border-red-200'
      case 'Equity': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Revenue': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Expense': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getNormalBalanceColor = (balance: string) => {
    return balance === 'Debit' ? 'text-green-600' : 'text-blue-600'
  }

  const totalDebits = trialBalance.reduce((sum, account) => sum + account.debit, 0)
  const totalCredits = trialBalance.reduce((sum, account) => sum + account.credit, 0)
  const isBalanced = totalDebits === totalCredits

  const totalAssets = balanceSheet.assets.currentAssets.reduce((sum, asset) => sum + asset.amount, 0) + 
                     balanceSheet.assets.fixedAssets.reduce((sum, asset) => sum + asset.amount, 0)
  const totalLiabilities = balanceSheet.liabilities.currentLiabilities.reduce((sum, liability) => sum + liability.amount, 0)
  const totalEquity = balanceSheet.equity.reduce((sum, equity) => sum + equity.amount, 0)

  const totalRevenue = incomeStatement.revenue.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = incomeStatement.expenses.reduce((sum, item) => sum + item.amount, 0)
  const netIncome = totalRevenue - totalExpenses

  const filteredAccounts = chartOfAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = accountTypeFilter === 'all' || account.type === accountTypeFilter
    return matchesSearch && matchesType
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
            <p className="text-gray-600 mt-1">
              Core accounting features and financial reporting
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
                  New Entry
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
                      <DialogTitle className="text-gray-900">Create New Accounting Entry</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Add a new journal entry or accounting transaction
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
                    {/* Entry Type & Basic Info */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Entry Details</CardTitle>
                        <CardDescription className="text-gray-600">
                          Basic information about the accounting entry
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="type" className="text-gray-700 font-medium">Entry Type *</Label>
                            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select entry type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="journal-entry">Journal Entry</SelectItem>
                                <SelectItem value="adjusting-entry">Adjusting Entry</SelectItem>
                                <SelectItem value="closing-entry">Closing Entry</SelectItem>
                                <SelectItem value="reversing-entry">Reversing Entry</SelectItem>
                              </SelectContent>
                            </Select>
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

                        <div className="space-y-2">
                          <Label htmlFor="reference" className="text-gray-700 font-medium">Reference Number</Label>
                          <Input
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleInputChange}
                            placeholder="e.g., JE-001, TXN-123"
                            className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Debit and Credit Accounts */}
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardHeader className="bg-white">
                        <CardTitle className="text-gray-900">Account Details</CardTitle>
                        <CardDescription className="text-gray-600">
                          Specify the debit and credit accounts for this entry
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="debitAccount" className="text-gray-700 font-medium">Debit Account *</Label>
                            <Select value={formData.debitAccount} onValueChange={(value) => handleSelectChange('debitAccount', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select debit account" />
                              </SelectTrigger>
                              <SelectContent>
                                {chartOfAccounts.filter(account => account.normalBalance === 'Debit').map(account => (
                                  <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="creditAccount" className="text-gray-700 font-medium">Credit Account *</Label>
                            <Select value={formData.creditAccount} onValueChange={(value) => handleSelectChange('creditAccount', value)}>
                              <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select credit account" />
                              </SelectTrigger>
                              <SelectContent>
                                {chartOfAccounts.filter(account => account.normalBalance === 'Credit').map(account => (
                                  <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
                            placeholder="Additional notes or comments about this entry..."
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
                            Create Entry
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
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Assets</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(totalAssets / 1000000).toFixed(1)}M RWF
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
                  <p className="text-sm text-gray-600 font-medium">Total Liabilities</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(totalLiabilities / 1000000).toFixed(1)}M RWF
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
                  <p className="text-sm text-gray-600 font-medium">Net Income</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(netIncome / 1000000).toFixed(1)}M RWF
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
                  <p className="text-sm text-gray-600 font-medium">Trial Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isBalanced ? "Balanced" : "Unbalanced"}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  isBalanced ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isBalanced ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  )}
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
            <CardDescription className="text-gray-600">Filter and search through accounting data</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search accounts, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Account Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Account Types</SelectItem>
                  <SelectItem value="Asset">Assets</SelectItem>
                  <SelectItem value="Liability">Liabilities</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expenses</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setAccountTypeFilter('all')
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
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-7 h-auto bg-white border border-gray-200">
            <TabsTrigger value="chart-of-accounts" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Chart of Accounts</TabsTrigger>
            <TabsTrigger value="journal-entries" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Journal Entries</TabsTrigger>
            <TabsTrigger value="general-ledger" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">General Ledger</TabsTrigger>
            <TabsTrigger value="trial-balance" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Trial Balance</TabsTrigger>
            <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Balance Sheet</TabsTrigger>
            <TabsTrigger value="income-statement" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Income Statement</TabsTrigger>
            <TabsTrigger value="cash-flow" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Cash Flow</TabsTrigger>
          </TabsList>

          {/* Chart of Accounts Tab */}
          <TabsContent value="chart-of-accounts" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Chart of Accounts</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete list of all accounts with balances ({filteredAccounts.length} accounts)
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Account ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Account Name</TableHead>
                      <TableHead className="text-gray-700 font-medium">Type</TableHead>
                      <TableHead className="text-gray-700 font-medium">Category</TableHead>
                      <TableHead className="text-gray-700 font-medium">Balance (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Normal Balance</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{account.id}</TableCell>
                        <TableCell className="text-gray-900">{account.name}</TableCell>
                        <TableCell>
                          <Badge className={getAccountTypeColor(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{account.category}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {account.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getNormalBalanceColor(account.normalBalance)}`}>
                            {account.normalBalance}
                          </span>
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

          {/* Journal Entries Tab */}
          <TabsContent value="journal-entries" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Journal Entries</CardTitle>
                <CardDescription className="text-gray-600">
                  Record of all financial transactions with debit and credit entries
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Entry ID</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Description</TableHead>
                      <TableHead className="text-gray-700 font-medium">Debit Account</TableHead>
                      <TableHead className="text-gray-700 font-medium">Credit Account</TableHead>
                      <TableHead className="text-gray-700 font-medium">Amount (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Reference</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalEntries.map((entry) => (
                      <TableRow key={entry.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{entry.id}</TableCell>
                        <TableCell className="text-gray-900">{entry.date}</TableCell>
                        <TableCell className="text-gray-900">{entry.description}</TableCell>
                        <TableCell className="text-green-600 font-medium">{entry.debitAccount}</TableCell>
                        <TableCell className="text-blue-600 font-medium">{entry.creditAccount}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {entry.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-600">{entry.reference}</TableCell>
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

          {/* General Ledger Tab */}
          <TabsContent value="general-ledger" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">General Ledger</CardTitle>
                <CardDescription className="text-gray-600">
                  Central record where all journal entries are posted
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Account</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Description</TableHead>
                      <TableHead className="text-gray-700 font-medium">Debit (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Credit (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium">Balance (RWF)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generalLedger.map((entry, index) => (
                      <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{entry.account}</TableCell>
                        <TableCell className="text-gray-900">{entry.date}</TableCell>
                        <TableCell className="text-gray-900">{entry.description}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {entry.debit > 0 ? entry.debit.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-blue-600 font-medium">
                          {entry.credit > 0 ? entry.credit.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {entry.balance.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trial Balance Tab */}
          <TabsContent value="trial-balance" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Trial Balance</CardTitle>
                <CardDescription className="text-gray-600">
                  Verification that total debits equal total credits
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Account</TableHead>
                      <TableHead className="text-gray-700 font-medium text-right">Debit (RWF)</TableHead>
                      <TableHead className="text-gray-700 font-medium text-right">Credit (RWF)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trialBalance.map((account, index) => (
                      <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{account.account}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {account.debit > 0 ? account.debit.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-right text-blue-600 font-medium">
                          {account.credit > 0 ? account.credit.toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-gray-200 border-t-2 font-bold">
                      <TableCell className="font-bold text-gray-900">TOTAL</TableCell>
                      <TableCell className="text-right text-green-600 font-bold">
                        {totalDebits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-blue-600 font-bold">
                        {totalCredits.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className={`mt-4 p-4 rounded-lg ${
                  isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`flex items-center gap-2 ${
                    isBalanced ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isBalanced ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {isBalanced ? 'Trial Balance is Balanced' : 'Trial Balance is Unbalanced'}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    isBalanced ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isBalanced 
                      ? `Total Debits (${totalDebits.toLocaleString()}) = Total Credits (${totalCredits.toLocaleString()})`
                      : `Difference: ${Math.abs(totalDebits - totalCredits).toLocaleString()} RWF`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Sheet Tab */}
          <TabsContent value="balance-sheet" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Balance Sheet</CardTitle>
                <CardDescription className="text-gray-600">
                  Snapshot of assets, liabilities, and equity as of current date
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-6">
                  {/* Assets Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ASSETS</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Current Assets</h4>
                        <Table>
                          <TableBody>
                            {balanceSheet.assets.currentAssets.map((asset, index) => (
                              <TableRow key={index} className="border-gray-200">
                                <TableCell className="text-gray-900 pl-8">{asset.name}</TableCell>
                                <TableCell className="text-right font-medium text-gray-900">
                                  {asset.amount.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Fixed Assets</h4>
                        <Table>
                          <TableBody>
                            {balanceSheet.assets.fixedAssets.map((asset, index) => (
                              <TableRow key={index} className="border-gray-200">
                                <TableCell className="text-gray-900 pl-8">{asset.name}</TableCell>
                                <TableCell className="text-right font-medium text-gray-900">
                                  {asset.amount.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <Table>
                          <TableBody>
                            <TableRow className="border-gray-200 font-bold">
                              <TableCell className="text-gray-900">TOTAL ASSETS</TableCell>
                              <TableCell className="text-right font-bold text-gray-900">
                                {totalAssets.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {/* Liabilities Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">LIABILITIES</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Current Liabilities</h4>
                        <Table>
                          <TableBody>
                            {balanceSheet.liabilities.currentLiabilities.map((liability, index) => (
                              <TableRow key={index} className="border-gray-200">
                                <TableCell className="text-gray-900 pl-8">{liability.name}</TableCell>
                                <TableCell className="text-right font-medium text-gray-900">
                                  {liability.amount.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <Table>
                          <TableBody>
                            <TableRow className="border-gray-200 font-bold">
                              <TableCell className="text-gray-900">TOTAL LIABILITIES</TableCell>
                              <TableCell className="text-right font-bold text-gray-900">
                                {totalLiabilities.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {/* Equity Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">EQUITY</h3>
                    <Table>
                      <TableBody>
                        {balanceSheet.equity.map((equity, index) => (
                          <TableRow key={index} className="border-gray-200">
                            <TableCell className="text-gray-900 pl-8">{equity.name}</TableCell>
                            <TableCell className="text-right font-medium text-gray-900">
                              {equity.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-gray-200 font-bold">
                          <TableCell className="text-gray-900">TOTAL EQUITY</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {totalEquity.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Total Liabilities + Equity */}
                  <div className="border-t-2 border-gray-400 pt-4">
                    <Table>
                      <TableBody>
                        <TableRow className="border-gray-200 font-bold text-lg">
                          <TableCell className="text-gray-900">TOTAL LIABILITIES + EQUITY</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {(totalLiabilities + totalEquity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Statement Tab */}
          <TabsContent value="income-statement" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Income Statement (Profit & Loss)</CardTitle>
                <CardDescription className="text-gray-600">
                  Shows revenue, expenses, and profit for the current period
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-6">
                  {/* Revenue Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">REVENUE</h3>
                    <Table>
                      <TableBody>
                        {incomeStatement.revenue.map((item, index) => (
                          <TableRow key={index} className="border-gray-200">
                            <TableCell className="text-gray-900 pl-8">{item.name}</TableCell>
                            <TableCell className="text-right font-medium text-gray-900">
                              {item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-gray-200 font-bold">
                          <TableCell className="text-gray-900">TOTAL REVENUE</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {totalRevenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Expenses Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">EXPENSES</h3>
                    <Table>
                      <TableBody>
                        {incomeStatement.expenses.map((item, index) => (
                          <TableRow key={index} className="border-gray-200">
                            <TableCell className="text-gray-900 pl-8">{item.name}</TableCell>
                            <TableCell className="text-right font-medium text-gray-900">
                              {item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-gray-200 font-bold">
                          <TableCell className="text-gray-900">TOTAL EXPENSES</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {totalExpenses.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Net Income */}
                  <div className="border-t-2 border-gray-400 pt-4">
                    <Table>
                      <TableBody>
                        <TableRow className="border-gray-200 font-bold text-lg">
                          <TableCell className="text-gray-900">NET INCOME</TableCell>
                          <TableCell className={`text-right font-bold ${
                            netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {netIncome.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Statement Tab */}
          <TabsContent value="cash-flow" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Cash Flow Statement</CardTitle>
                <CardDescription className="text-gray-600">
                  Tracks cash inflows and outflows from operating, investing, and financing activities
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-6">
                  {/* Operating Activities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">OPERATING ACTIVITIES</h3>
                    <Table>
                      <TableBody>
                        {cashFlowStatement.operating.map((item, index) => (
                          <TableRow key={index} className="border-gray-200">
                            <TableCell className="text-gray-900 pl-8">{item.name}</TableCell>
                            <TableCell className={`text-right font-medium ${
                              item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-gray-200 font-bold">
                          <TableCell className="text-gray-900">NET CASH FROM OPERATING</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {cashFlowStatement.operating.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Investing Activities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">INVESTING ACTIVITIES</h3>
                    <Table>
                      <TableBody>
                        {cashFlowStatement.investing.map((item, index) => (
                          <TableRow key={index} className="border-gray-200">
                            <TableCell className="text-gray-900 pl-8">{item.name}</TableCell>
                            <TableCell className={`text-right font-medium ${
                              item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-gray-200 font-bold">
                          <TableCell className="text-gray-900">NET CASH FROM INVESTING</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {cashFlowStatement.investing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Financing Activities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">FINANCING ACTIVITIES</h3>
                    <Table>
                      <TableBody>
                        {cashFlowStatement.financing.map((item, index) => (
                          <TableRow key={index} className="border-gray-200">
                            <TableCell className="text-gray-900 pl-8">{item.name}</TableCell>
                            <TableCell className={`text-right font-medium ${
                              item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-gray-200 font-bold">
                          <TableCell className="text-gray-900">NET CASH FROM FINANCING</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {cashFlowStatement.financing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Net Change in Cash */}
                  <div className="border-t-2 border-gray-400 pt-4">
                    <Table>
                      <TableBody>
                        <TableRow className="border-gray-200 font-bold text-lg">
                          <TableCell className="text-gray-900">NET CHANGE IN CASH</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {[
                              ...cashFlowStatement.operating,
                              ...cashFlowStatement.investing,
                              ...cashFlowStatement.financing
                            ].reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AccountingPage, ['admin'])
