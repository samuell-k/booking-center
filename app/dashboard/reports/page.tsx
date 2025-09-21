"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  Users,
  Ticket,
  DollarSign,
  Trophy,
  Filter,
  RefreshCw,
  Eye,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Settings,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [selectedFormat, setSelectedFormat] = useState("pdf")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock report data
  const reportStats = {
    totalReports: 45,
    scheduledReports: 12,
    completedReports: 38,
    pendingReports: 7,
    totalDownloads: 1247,
    lastGenerated: "2025-01-15 14:30"
  }

  const availableReports = [
    {
      id: 1,
      name: "User Activity Report",
      description: "Detailed analysis of user engagement and activity patterns",
      category: "Users",
      lastGenerated: "2025-01-15 10:30",
      status: "ready",
      size: "2.4 MB",
      downloads: 45,
      icon: Users,
      color: "blue"
    },
    {
      id: 2,
      name: "Revenue Analytics Report",
      description: "Comprehensive revenue breakdown and financial insights",
      category: "Finance",
      lastGenerated: "2025-01-15 09:15",
      status: "ready",
      size: "3.1 MB",
      downloads: 67,
      icon: DollarSign,
      color: "green"
    },
    {
      id: 3,
      name: "Ticket Sales Report",
      description: "Analysis of ticket sales performance and trends",
      category: "Sales",
      lastGenerated: "2025-01-15 08:45",
      status: "ready",
      size: "1.8 MB",
      downloads: 32,
      icon: Ticket,
      color: "purple"
    },
    {
      id: 4,
      name: "Team Performance Report",
      description: "Team statistics and performance metrics",
      category: "Teams",
      lastGenerated: "2025-01-14 16:20",
      status: "generating",
      size: "2.7 MB",
      downloads: 28,
      icon: Trophy,
      color: "orange"
    },
    {
      id: 5,
      name: "System Usage Report",
      description: "Platform usage statistics and system metrics",
      category: "System",
      lastGenerated: "2025-01-14 14:10",
      status: "ready",
      size: "1.5 MB",
      downloads: 19,
      icon: BarChart3,
      color: "indigo"
    },
    {
      id: 6,
      name: "Customer Satisfaction Report",
      description: "User feedback and satisfaction analysis",
      category: "Users",
      lastGenerated: "2025-01-13 11:30",
      status: "scheduled",
      size: "2.2 MB",
      downloads: 15,
      icon: TrendingUp,
      color: "pink"
    }
  ]

  const scheduledReports = [
    {
      id: 1,
      name: "Daily Revenue Summary",
      frequency: "Daily",
      nextRun: "2025-01-16 06:00",
      status: "active",
      recipients: 3
    },
    {
      id: 2,
      name: "Weekly User Activity",
      frequency: "Weekly",
      nextRun: "2025-01-20 08:00",
      status: "active",
      recipients: 5
    },
    {
      id: 3,
      name: "Monthly Financial Report",
      frequency: "Monthly",
      nextRun: "2025-02-01 09:00",
      status: "active",
      recipients: 8
    },
    {
      id: 4,
      name: "Quarterly Performance Review",
      frequency: "Quarterly",
      nextRun: "2025-04-01 10:00",
      status: "paused",
      recipients: 12
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      case 'generating': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'generating': return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-RW').format(num)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Generate and manage comprehensive business reports</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.totalReports}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.completedReports}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Ready</span>
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.scheduledReports}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Active</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(reportStats.totalDownloads)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Download className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">This month</span>
                  </div>
                </div>
                <Download className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3 h-auto bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Available Reports</TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Generate New</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                    <CardDescription className="text-gray-600">Generate common reports instantly</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm">User Report</span>
                  </Button>
                  <Button variant="outline" className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Revenue Report</span>
                  </Button>
                  <Button variant="outline" className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2">
                    <Ticket className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Sales Report</span>
                  </Button>
                  <Button variant="outline" className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Analytics Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Reports */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Available Reports ({availableReports.length})</CardTitle>
                <CardDescription className="text-gray-600">Download or view generated reports</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableReports.map((report) => {
                    const Icon = report.icon
                    return (
                      <Card key={report.id} className="bg-white border border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(report.color)}`}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(report.status)}
                                <Badge className={`${getStatusColor(report.status)} border`}>
                                  {report.status}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-bold text-gray-900 text-sm mb-1">{report.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                                {report.category}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Size:</span>
                                <span className="font-medium">{report.size}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Downloads:</span>
                                <span className="font-medium">{report.downloads}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Generated:</span>
                                <span className="font-medium">{report.lastGenerated}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 bg-white border-gray-200 hover:bg-gray-50"
                                disabled={report.status === 'generating'}
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 bg-white border-gray-200 hover:bg-gray-50"
                                disabled={report.status === 'generating'}
                                title="Download Report"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 bg-white border-gray-200 hover:bg-gray-50"
                                disabled={report.status === 'generating'}
                                title="Share Report"
                              >
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Scheduled Reports ({scheduledReports.length})</CardTitle>
                    <CardDescription className="text-gray-600">Manage automated report generation</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {scheduledReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-600">
                            {report.frequency} • Next: {report.nextRun}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={report.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                            {report.status}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {report.recipients} recipients
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100" title="Refresh">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Generate Custom Report</CardTitle>
                <CardDescription className="text-gray-600">Create a new report with custom parameters</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="report-type" className="text-gray-700 font-medium">Report Type</Label>
                      <Select>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="user-activity">User Activity</SelectItem>
                          <SelectItem value="revenue">Revenue Analysis</SelectItem>
                          <SelectItem value="ticket-sales">Ticket Sales</SelectItem>
                          <SelectItem value="team-performance">Team Performance</SelectItem>
                          <SelectItem value="system-usage">System Usage</SelectItem>
                          <SelectItem value="custom">Custom Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date-range" className="text-gray-700 font-medium">Date Range</Label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                          <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                          <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                          <SelectItem value="last-year">Last Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="format" className="text-gray-700 font-medium">Export Format</Label>
                      <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV File</SelectItem>
                          <SelectItem value="json">JSON Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="filters" className="text-gray-700 font-medium">Additional Filters</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="include-inactive" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <Label htmlFor="include-inactive" className="text-sm text-gray-700">Include inactive users</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="include-refunds" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <Label htmlFor="include-refunds" className="text-sm text-gray-700">Include refunded tickets</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="detailed-breakdown" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <Label htmlFor="detailed-breakdown" className="text-sm text-gray-700">Detailed breakdown</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="recipients" className="text-gray-700 font-medium">Email Recipients (Optional)</Label>
                      <Input 
                        id="recipients" 
                        placeholder="email1@example.com, email2@example.com"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminReportsPage, ['admin'])
