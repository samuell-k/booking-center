"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Trophy, 
  Calendar, 
  DollarSign, 
  Target, 
  Award, 
  Star, 
  Activity, 
  PieChart, 
  LineChart, 
  RefreshCw, 
  Download, 
  Filter, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Globe
} from "lucide-react"

function TeamAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock analytics data
  const analyticsData = {
    totalTeams: 24,
    activeTeams: 18,
    totalMembers: 456,
    totalMatches: 89,
    totalRevenue: 12500000,
    averageRating: 4.2,
    growthRate: 12.5,
    engagementRate: 78.3
  }

  const teamPerformance = [
    { name: "APR FC", matches: 15, wins: 12, draws: 2, losses: 1, goalsFor: 28, goalsAgainst: 8, points: 38, rating: 4.8 },
    { name: "Rayon Sports", matches: 14, wins: 10, draws: 3, losses: 1, goalsFor: 24, goalsAgainst: 10, points: 33, rating: 4.6 },
    { name: "Patriots Basketball", matches: 12, wins: 8, draws: 2, losses: 2, goalsFor: 18, goalsAgainst: 12, points: 26, rating: 4.4 },
    { name: "Rwanda Volleyball", matches: 10, wins: 6, draws: 1, losses: 3, goalsFor: 15, goalsAgainst: 14, points: 19, rating: 4.2 },
    { name: "Youth Academy", matches: 8, wins: 5, draws: 1, losses: 2, goalsFor: 12, goalsAgainst: 8, points: 16, rating: 4.0 }
  ]

  const monthlyData = [
    { month: "Jan", teams: 18, members: 320, matches: 45, revenue: 8500000 },
    { month: "Feb", teams: 20, members: 380, matches: 52, revenue: 9200000 },
    { month: "Mar", teams: 22, members: 420, matches: 58, revenue: 9800000 },
    { month: "Apr", teams: 24, members: 456, matches: 65, revenue: 10500000 },
    { month: "May", teams: 24, members: 456, matches: 89, revenue: 12500000 }
  ]

  const categoryDistribution = [
    { category: "Football", teams: 12, percentage: 50, color: "#3B82F6" },
    { category: "Basketball", teams: 6, percentage: 25, color: "#EF4444" },
    { category: "Volleyball", teams: 4, percentage: 17, color: "#10B981" },
    { category: "Other", teams: 2, percentage: 8, color: "#F59E0B" }
  ]

  const topPerformers = [
    { name: "APR FC", metric: "Win Rate", value: "80%", trend: "up", change: "+5%" },
    { name: "Rayon Sports", metric: "Goals Scored", value: "24", trend: "up", change: "+3" },
    { name: "Patriots Basketball", metric: "Member Growth", value: "25%", trend: "up", change: "+8%" },
    { name: "Rwanda Volleyball", metric: "Engagement", value: "92%", trend: "up", change: "+12%" }
  ]

  const recentActivity = [
    { team: "APR FC", action: "Won match against Rayon Sports", time: "2 hours ago", type: "match" },
    { team: "Patriots Basketball", action: "Added 3 new members", time: "4 hours ago", type: "members" },
    { team: "Youth Academy", action: "Scheduled training session", time: "6 hours ago", type: "training" },
    { team: "Rwanda Volleyball", action: "Updated team profile", time: "8 hours ago", type: "profile" },
    { team: "APR FC", action: "Received payment for match", time: "12 hours ago", type: "payment" }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'match': return <Trophy className="h-4 w-4 text-green-600" />
      case 'members': return <Users className="h-4 w-4 text-blue-600" />
      case 'training': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'profile': return <Eye className="h-4 w-4 text-orange-600" />
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-RW').format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-48 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="apr-fc">APR FC</SelectItem>
                <SelectItem value="rayon-sports">Rayon Sports</SelectItem>
                <SelectItem value="patriots">Patriots Basketball</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalTeams}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+{analyticsData.growthRate}%</span>
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.activeTeams}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Competing</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalMembers)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Registered</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">This period</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 h-auto bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Performance</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Trends</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Performance Chart */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Team Performance
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Win rates and performance metrics by team
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {teamPerformance.slice(0, 5).map((team, index) => (
                      <div key={team.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{team.name}</p>
                            <p className="text-sm text-gray-500">{team.matches} matches</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{team.points} pts</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-500">{team.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Category Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Teams by sport category
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {categoryDistribution.map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-gray-900">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{category.teams} teams</p>
                          <p className="text-sm text-gray-500">{category.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Activity className="h-5 w-5 text-green-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Latest team activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.team}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Team Performance Metrics
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed performance analysis for all teams
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Team</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Matches</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Wins</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Draws</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Losses</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Goals</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Points</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPerformance.map((team, index) => (
                        <tr key={team.name} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-green-600">{index + 1}</span>
                              </div>
                              <span className="font-medium text-gray-900">{team.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{team.matches}</td>
                          <td className="py-3 px-4 text-green-600 font-medium">{team.wins}</td>
                          <td className="py-3 px-4 text-yellow-600 font-medium">{team.draws}</td>
                          <td className="py-3 px-4 text-red-600 font-medium">{team.losses}</td>
                          <td className="py-3 px-4 text-gray-900">{team.goalsFor}-{team.goalsAgainst}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{team.points}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-gray-900">{team.rating}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <LineChart className="h-5 w-5 text-green-600" />
                    Monthly Growth
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Team and member growth over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {monthlyData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{month.month}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Teams</p>
                            <p className="font-bold text-gray-900">{month.teams}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Members</p>
                            <p className="font-bold text-gray-900">{formatNumber(month.members)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="font-bold text-gray-900">{formatCurrency(month.revenue)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Performers
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Teams with best performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div key={performer.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{performer.name}</p>
                            <p className="text-sm text-gray-500">{performer.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{performer.value}</p>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(performer.trend)}
                            <span className="text-sm text-green-600">{performer.change}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Zap className="h-5 w-5 text-green-600" />
                    Key Insights
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Automated insights and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-900">High Performance</p>
                          <p className="text-sm text-green-700">APR FC has the highest win rate at 80%</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">Growth Opportunity</p>
                          <p className="text-sm text-blue-700">Basketball teams show 25% member growth</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-900">Attention Needed</p>
                          <p className="text-sm text-yellow-700">3 teams have low engagement rates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Target className="h-5 w-5 text-green-600" />
                    Recommendations
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Actionable recommendations for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Security Enhancement</p>
                          <p className="text-sm text-gray-600">Enable two-factor authentication for all team managers</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Marketing Opportunity</p>
                          <p className="text-sm text-gray-600">Promote volleyball category to increase participation</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Schedule Optimization</p>
                          <p className="text-sm text-gray-600">Optimize match scheduling to reduce conflicts</p>
                        </div>
                      </div>
                    </div>
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

export default withAuth(TeamAnalyticsPage, ['admin'])
