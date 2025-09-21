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
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  MapPin, 
  Clock, 
  Users, 
  Trophy, 
  Star,
  BarChart3,
  DollarSign,
  TrendingUp,
  Settings,
  Trash2,
  MoreHorizontal,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  StopCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"

function AdminMatches() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Mock matches data - Admin view with all teams
  const upcomingMatches = [
    {
      id: 1,
      homeTeam: "APR FC",
      awayTeam: "Rayon Sports",
      date: "2024-03-20",
      time: "16:00",
      venue: "Amahoro Stadium",
      competition: "Rwanda Premier League",
      status: "upcoming",
      ticketsSold: 12000,
      totalCapacity: 30000,
      ticketPrice: 5000,
      expectedRevenue: 60000000,
      organizer: "Rwanda Football Federation"
    },
    {
      id: 2,
      homeTeam: "AS Kigali",
      awayTeam: "Police FC",
      date: "2024-03-25",
      time: "19:00",
      venue: "Kigali Stadium",
      competition: "Rwanda Premier League",
      status: "upcoming",
      ticketsSold: 8500,
      totalCapacity: 25000,
      ticketPrice: 3000,
      expectedRevenue: 25500000,
      organizer: "Rwanda Football Federation"
    },
    {
      id: 3,
      homeTeam: "Mukura VS",
      awayTeam: "Gasogi United",
      date: "2024-03-28",
      time: "15:00",
      venue: "Huye Stadium",
      competition: "Rwanda Premier League",
      status: "upcoming",
      ticketsSold: 6000,
      totalCapacity: 20000,
      ticketPrice: 2000,
      expectedRevenue: 12000000,
      organizer: "Rwanda Football Federation"
    }
  ]

  const recentMatches = [
    {
      id: 4,
      homeTeam: "APR FC",
      awayTeam: "Police FC",
      date: "2024-03-10",
      time: "15:00",
      venue: "Amahoro Stadium",
      competition: "Rwanda Premier League",
      status: "completed",
      ticketsSold: 18000,
      totalCapacity: 30000,
      ticketPrice: 4000,
      revenue: 72000000,
      result: "W 2-1",
      organizer: "Rwanda Football Federation"
    },
    {
      id: 5,
      homeTeam: "Rayon Sports",
      awayTeam: "Mukura VS",
      date: "2024-03-05",
      time: "16:30",
      venue: "Huye Stadium",
      competition: "Rwanda Premier League",
      status: "completed",
      ticketsSold: 15000,
      totalCapacity: 20000,
      ticketPrice: 3500,
      revenue: 52500000,
      result: "D 1-1",
      organizer: "Rwanda Football Federation"
    },
    {
      id: 6,
      homeTeam: "AS Kigali",
      awayTeam: "Gasogi United",
      date: "2024-02-28",
      time: "18:00",
      venue: "Kigali Stadium",
      competition: "Rwanda Premier League",
      status: "completed",
      ticketsSold: 12000,
      totalCapacity: 25000,
      ticketPrice: 3000,
      revenue: 36000000,
      result: "L 0-1",
      organizer: "Rwanda Football Federation"
    }
  ]

  const cancelledMatches = [
    {
      id: 7,
      homeTeam: "Police FC",
      awayTeam: "Mukura VS",
      date: "2024-02-20",
      time: "16:00",
      venue: "Amahoro Stadium",
      competition: "Rwanda Premier League",
      status: "cancelled",
      ticketsSold: 8000,
      totalCapacity: 30000,
      ticketPrice: 4000,
      refundAmount: 32000000,
      organizer: "Rwanda Football Federation",
      reason: "Weather conditions"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>
      case 'completed': return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'cancelled': return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      case 'live': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Live</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getResultBadge = (result: string) => {
    if (result.startsWith('W')) return <Badge className="bg-green-100 text-green-800 border-green-200">Win</Badge>
    if (result.startsWith('L')) return <Badge className="bg-red-100 text-red-800 border-red-200">Loss</Badge>
    if (result.startsWith('D')) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Draw</Badge>
    return <Badge variant="secondary">{result}</Badge>
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing matches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const allMatches = [...upcomingMatches, ...recentMatches, ...cancelledMatches]
  const totalUpcomingTickets = upcomingMatches.reduce((sum, match) => sum + match.ticketsSold, 0)
  const totalUpcomingRevenue = upcomingMatches.reduce((sum, match) => sum + match.expectedRevenue, 0)
  const totalRecentRevenue = recentMatches.reduce((sum, match) => sum + match.revenue, 0)
  const totalRefunds = cancelledMatches.reduce((sum, match) => sum + (match.refundAmount || 0), 0)

  const filteredMatches = allMatches.filter(match => {
    const matchesSearch = match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.competition.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter
    const matchesTeam = teamFilter === 'all' || 
                       match.homeTeam.toLowerCase().includes(teamFilter.toLowerCase()) ||
                       match.awayTeam.toLowerCase().includes(teamFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesTeam
  })

  const teams = [...new Set(allMatches.flatMap(match => [match.homeTeam, match.awayTeam]))]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Matches</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all matches across the platform
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
            <Link href="/dashboard/matches/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Match
              </Button>
            </Link>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Matches</p>
                  <p className="text-3xl font-bold text-gray-900">{allMatches.length}</p>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Upcoming Matches</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingMatches.length}</p>
                  <p className="text-xs text-blue-600 mt-1">Scheduled</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{(totalRecentRevenue / 1000000).toFixed(1)}M RWF</p>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
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
                  <p className="text-sm text-gray-600 font-medium">Expected Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{(totalUpcomingRevenue / 1000000).toFixed(1)}M RWF</p>
                  <p className="text-xs text-purple-600 mt-1">Projected</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
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
            <CardDescription className="text-gray-600">Filter and search through matches</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search matches, teams, venues..."
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
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>

              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTeamFilter('all')
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
            <TabsTrigger value="all" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">All Matches ({filteredMatches.length})</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Upcoming ({upcomingMatches.length})</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Completed ({recentMatches.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Cancelled ({cancelledMatches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">All Matches</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete overview of all matches across the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Match</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date & Time</TableHead>
                      <TableHead className="text-gray-700 font-medium">Venue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Competition</TableHead>
                      <TableHead className="text-gray-700 font-medium">Tickets Sold</TableHead>
                      <TableHead className="text-gray-700 font-medium">Revenue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.map((match) => (
                      <TableRow key={match.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{match.homeTeam} vs {match.awayTeam}</div>
                            <div className="text-sm text-gray-600">{match.organizer}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{match.date}</div>
                              <div className="text-xs text-gray-600">{match.time}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{match.venue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{match.competition}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{match.ticketsSold.toLocaleString()}</div>
                              <div className="text-xs text-gray-600">of {match.totalCapacity.toLocaleString()}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">
                            {match.status === 'completed' 
                              ? `${((match as any).revenue / 1000000).toFixed(1)}M RWF`
                              : match.status === 'cancelled'
                              ? `Refund: ${((match as any).refundAmount / 1000000).toFixed(1)}M RWF`
                              : `Expected: ${((match as any).expectedRevenue / 1000000).toFixed(1)}M RWF`
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(match.status)}
                            {(match as any).result && getResultBadge((match as any).result)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/matches/${match.id}`}>
                              <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/matches/${match.id}/edit`}>
                              <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600">
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="upcoming" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Upcoming Matches</CardTitle>
                <CardDescription className="text-gray-600">
                  Matches scheduled for the future
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((match) => (
                    <Card key={match.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="bg-white">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-gray-900">{match.homeTeam} vs {match.awayTeam}</CardTitle>
                          {getStatusBadge(match.status)}
                        </div>
                        <CardDescription className="text-gray-600">{match.competition}</CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {match.date} at {match.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {match.venue}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tickets Sold:</span>
                            <span className="font-medium text-gray-900">{match.ticketsSold.toLocaleString()}/{match.totalCapacity.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium text-gray-900">{match.ticketPrice.toLocaleString()} RWF</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Revenue:</span>
                            <span className="font-medium text-green-600">{(match.expectedRevenue / 1000000).toFixed(1)}M RWF</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <Link href={`/dashboard/matches/${match.id}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/matches/${match.id}/edit`} className="flex-1">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Completed Matches</CardTitle>
                <CardDescription className="text-gray-600">
                  Recently completed matches with results and revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Match</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Result</TableHead>
                      <TableHead className="text-gray-700 font-medium">Tickets Sold</TableHead>
                      <TableHead className="text-gray-700 font-medium">Revenue</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMatches.map((match) => (
                      <TableRow key={match.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">{match.homeTeam} vs {match.awayTeam}</div>
                          <div className="text-sm text-gray-600">{match.competition}</div>
                        </TableCell>
                        <TableCell className="text-gray-900">{match.date}</TableCell>
                        <TableCell>{getResultBadge(match.result)}</TableCell>
                        <TableCell className="text-gray-900">{match.ticketsSold.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-green-600">{(match.revenue / 1000000).toFixed(1)}M RWF</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/matches/${match.id}`}>
                              <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <BarChart3 className="h-4 w-4" />
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
                <CardTitle className="text-gray-900">Cancelled Matches</CardTitle>
                <CardDescription className="text-gray-600">
                  Matches that were cancelled with refund information
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">Match</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Reason</TableHead>
                      <TableHead className="text-gray-700 font-medium">Tickets Sold</TableHead>
                      <TableHead className="text-gray-700 font-medium">Refund Amount</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledMatches.map((match) => (
                      <TableRow key={match.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">{match.homeTeam} vs {match.awayTeam}</div>
                          <div className="text-sm text-gray-600">{match.competition}</div>
                        </TableCell>
                        <TableCell className="text-gray-900">{match.date}</TableCell>
                        <TableCell className="text-gray-900">{match.reason}</TableCell>
                        <TableCell className="text-gray-900">{match.ticketsSold.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          -{((match.refundAmount || 0) / 1000000).toFixed(1)}M RWF
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/matches/${match.id}`}>
                              <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                              <Activity className="h-4 w-4" />
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

export default withAuth(AdminMatches, ['admin'])
