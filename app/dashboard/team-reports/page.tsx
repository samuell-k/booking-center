"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Trophy, 
  DollarSign, 
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
  ArrowDownRight, 
  Minus,
  Mail,
  Bell,
  Zap,
  Target,
  Shield,
  Globe,
  Activity
} from "lucide-react"

function TeamReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("pdf")
  const [activeTab, setActiveTab] = useState("available")
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock report data
  const reportStats = {
    totalReports: 28,
    generatedToday: 5,
    scheduledReports: 8,
    completedReports: 24,
    totalDownloads: 1847,
    lastGenerated: "2025-01-15 14:30"
  }

  const availableReports = [
    {
      id: 1,
      name: "Team Performance Summary",
      description: "Comprehensive team performance analysis and statistics",
      category: "Performance",
      lastGenerated: "2025-01-15 10:30",
      status: "ready",
      size: "2.4 MB",
      downloads: 45,
      icon: Trophy,
      color: "blue",
      type: "performance"
    },
    {
      id: 2,
      name: "Member Activity Report",
      description: "Detailed analysis of team member engagement and activity",
      category: "Members",
      lastGenerated: "2025-01-15 09:15",
      status: "ready",
      size: "1.8 MB",
      downloads: 32,
      icon: Users,
      color: "green",
      type: "members"
    },
    {
      id: 3,
      name: "Financial Summary",
      description: "Team financial performance and revenue analysis",
      category: "Finance",
      lastGenerated: "2025-01-15 08:45",
      status: "ready",
      size: "3.1 MB",
      downloads: 28,
      icon: DollarSign,
      color: "purple",
      type: "finance"
    },
    {
      id: 4,
      name: "Match Statistics",
      description: "Comprehensive match data and performance metrics",
      category: "Matches",
      lastGenerated: "2025-01-14 16:20",
      status: "generating",
      size: "2.7 MB",
      downloads: 19,
      icon: BarChart3,
      color: "orange",
      type: "matches"
    },
    {
      id: 5,
      name: "Team Growth Analysis",
      description: "Team growth trends and member acquisition data",
      category: "Growth",
      lastGenerated: "2025-01-14 14:10",
      status: "ready",
      size: "1.5 MB",
      downloads: 15,
      icon: TrendingUp,
      color: "indigo",
      type: "growth"
    },
    {
      id: 6,
      name: "Compliance Report",
      description: "Team compliance and regulatory adherence report",
      category: "Compliance",
      lastGenerated: "2025-01-13 11:30",
      status: "scheduled",
      size: "2.2 MB",
      downloads: 12,
      icon: Shield,
      color: "red",
      type: "compliance"
    }
  ]

  const scheduledReports = [
    {
      id: 1,
      name: "Weekly Team Performance",
      frequency: "Weekly",
      nextRun: "2025-01-20 08:00",
      status: "active",
      recipients: 5,
      lastRun: "2025-01-13 08:00"
    },
    {
      id: 2,
      name: "Monthly Financial Summary",
      frequency: "Monthly",
      nextRun: "2025-02-01 09:00",
      status: "active",
      recipients: 8,
      lastRun: "2025-01-01 09:00"
    },
    {
      id: 3,
      name: "Quarterly Growth Report",
      frequency: "Quarterly",
      nextRun: "2025-04-01 10:00",
      status: "active",
      recipients: 12,
      lastRun: "2024-10-01 10:00"
    },
    {
      id: 4,
      name: "Daily Activity Summary",
      frequency: "Daily",
      nextRun: "2025-01-16 06:00",
      status: "paused",
      recipients: 3,
      lastRun: "2025-01-15 06:00"
    }
  ]

  const reportTemplates = [
    {
      id: 1,
      name: "Executive Summary",
      description: "High-level overview for management",
      category: "Executive",
      fields: ["Team Performance", "Financial Summary", "Key Metrics"],
      icon: Target,
      color: "blue"
    },
    {
      id: 2,
      name: "Detailed Analysis",
      description: "Comprehensive team analysis report",
      category: "Analysis",
      fields: ["Performance Metrics", "Member Statistics", "Match Data", "Financials"],
      icon: BarChart3,
      color: "green"
    },
    {
      id: 3,
      name: "Compliance Report",
      description: "Regulatory compliance and audit report",
      category: "Compliance",
      fields: ["Regulatory Status", "Documentation", "Audit Trail"],
      icon: Shield,
      color: "red"
    },
    {
      id: 4,
      name: "Custom Report",
      description: "Build your own custom report",
      category: "Custom",
      fields: ["Select Fields", "Custom Filters", "Format Options"],
      icon: Settings,
      color: "purple"
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
      red: 'bg-red-100 text-red-600'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('Generating report:', reportType)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-RW').format(num)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
            <p className="text-gray-600 mt-1">Generate and manage comprehensive team reports</p>
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
                    <span className="text-sm text-green-600">+8.2%</span>
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
                  <p className="text-sm font-medium text-gray-600">Generated Today</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.generatedToday}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Ready</span>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
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
                <Calendar className="h-8 w-8 text-blue-600" />
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
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 h-auto bg-white border border-gray-200">
            <TabsTrigger value="available" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Available Reports</TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Report Templates</TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Generate New</TabsTrigger>
          </TabsList>

          {/* Available Reports Tab */}
          <TabsContent value="available" className="space-y-6">
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
                  <Button 
                    variant="outline" 
                    className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2"
                    onClick={() => handleGenerateReport('performance')}
                  >
                    <Trophy className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Performance Report</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2"
                    onClick={() => handleGenerateReport('members')}
                  >
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Member Report</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2"
                    onClick={() => handleGenerateReport('finance')}
                  >
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Financial Report</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 bg-white border-gray-200 hover:bg-gray-50 flex-col gap-2"
                    onClick={() => handleGenerateReport('matches')}
                  >
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Match Report</span>
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

          {/* Scheduled Reports Tab */}
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
                          <div className="text-xs text-gray-500">
                            Last run: {report.lastRun}
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
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100" title="Edit Schedule">
                            <Settings className="h-4 w-4" />
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

          {/* Report Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Report Templates ({reportTemplates.length})</CardTitle>
                <CardDescription className="text-gray-600">Pre-built report templates for quick generation</CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {reportTemplates.map((template) => {
                    const Icon = template.icon
                    return (
                      <Card key={template.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(template.color)}`}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                                {template.category}
                              </Badge>
                            </div>

                            <div>
                              <h3 className="font-bold text-gray-900 text-sm mb-1">{template.name}</h3>
                              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-700">Includes:</p>
                              <div className="space-y-1">
                                {template.fields.map((field, index) => (
                                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                    {field}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleGenerateReport(template.name.toLowerCase())}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate New Tab */}
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
                          <SelectItem value="team-performance">Team Performance</SelectItem>
                          <SelectItem value="member-activity">Member Activity</SelectItem>
                          <SelectItem value="financial-summary">Financial Summary</SelectItem>
                          <SelectItem value="match-statistics">Match Statistics</SelectItem>
                          <SelectItem value="growth-analysis">Growth Analysis</SelectItem>
                          <SelectItem value="compliance-report">Compliance Report</SelectItem>
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
                      <Label htmlFor="team-filter" className="text-gray-700 font-medium">Team Filter</Label>
                      <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="all">All Teams</SelectItem>
                          <SelectItem value="apr-fc">APR FC</SelectItem>
                          <SelectItem value="rayon-sports">Rayon Sports</SelectItem>
                          <SelectItem value="patriots">Patriots Basketball</SelectItem>
                          <SelectItem value="volleyball">Rwanda Volleyball</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="filters" className="text-gray-700 font-medium">Additional Filters</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="include-inactive" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <Label htmlFor="include-inactive" className="text-sm text-gray-700">Include inactive teams</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="include-financials" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <Label htmlFor="include-financials" className="text-sm text-gray-700">Include financial data</Label>
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
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isGenerating}
                    onClick={() => handleGenerateReport('custom')}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
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

export default withAuth(TeamReportsPage, ['admin'])
