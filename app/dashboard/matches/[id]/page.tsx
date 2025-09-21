"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
  BarChart3,
  Ticket,
  TrendingUp,
  Activity,
  Eye,
  Share2
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

function ViewMatchPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [match, setMatch] = useState<any>(null)

  useEffect(() => {
    const loadMatchData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call to fetch match data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - in real app, this would come from API
        setMatch({
          id: matchId,
          homeTeam: "APR FC",
          awayTeam: "Rayon Sports",
          date: "2024-03-20",
          time: "16:00",
          venue: "Amahoro Stadium",
          competition: "Rwanda Premier League",
          sport: "football",
          status: "upcoming",
          ticketPrice: 5000,
          totalCapacity: 30000,
          ticketsSold: 12000,
          expectedRevenue: 60000000,
          description: "Exciting match between two top teams in the Rwanda Premier League",
          image: "/placeholder.jpg",
          organizer: "Rwanda Football Federation"
        })
      } catch (error) {
        console.error("Error loading match:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (matchId) {
      loadMatchData()
    }
  }, [matchId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>
      case 'completed': return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'cancelled': return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      case 'live': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Live</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football': return '⚽'
      case 'basketball': return '🏀'
      case 'volleyball': return '🏐'
      case 'events': return '🎪'
      default: return '🏆'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!match) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Match not found</h3>
            <p className="text-gray-600 mb-4">The match you're looking for doesn't exist.</p>
            <Link href="/dashboard/matches">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Back to Matches
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/matches">
              <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Matches
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Match Details</h1>
              <p className="text-gray-600 mt-1">
                View and manage match information
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href={`/dashboard/matches/${match.id}/edit`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit Match
              </Button>
            </Link>
          </div>
        </div>

        {/* Match Header */}
        <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="relative h-64">
            <Image
              src={match.image}
              alt={`${match.homeTeam} vs ${match.awayTeam}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-2">
                  {match.homeTeam} vs {match.awayTeam}
                </h2>
                <p className="text-xl text-gray-200">{match.competition}</p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {getSportIcon(match.sport)} {match.sport}
                  </Badge>
                  {getStatusBadge(match.status)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Match Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Basic details about the match
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">{match.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium text-gray-900">{match.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Venue</p>
                      <p className="font-medium text-gray-900">{match.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="font-medium text-gray-900">{match.totalCapacity.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                {match.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{match.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket Information */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Ticket Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Pricing and availability details
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Ticket Price</p>
                      <p className="text-2xl font-bold text-green-600">{match.ticketPrice.toLocaleString()} RWF</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tickets Sold</p>
                      <p className="text-2xl font-bold text-gray-900">{match.ticketsSold.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round((match.ticketsSold / match.totalCapacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(match.ticketsSold / match.totalCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="bg-white space-y-3">
                <Link href={`/dashboard/matches/${match.id}/edit`} className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Match
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50">
                  <Activity className="h-4 w-4 mr-2" />
                  Match Stats
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Information */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Revenue</CardTitle>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Expected Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(match.expectedRevenue / 1000000).toFixed(1)}M RWF
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tickets Sold</span>
                    <span className="font-medium">{match.ticketsSold.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price per Ticket</span>
                    <span className="font-medium">{match.ticketPrice.toLocaleString()} RWF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Status */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="text-gray-900">Status</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="text-center">
                  {getStatusBadge(match.status)}
                  <p className="text-sm text-gray-600 mt-2">
                    {match.status === 'upcoming' && 'Match is scheduled'}
                    {match.status === 'live' && 'Match is currently live'}
                    {match.status === 'completed' && 'Match has ended'}
                    {match.status === 'cancelled' && 'Match was cancelled'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(ViewMatchPage, ['admin'])
