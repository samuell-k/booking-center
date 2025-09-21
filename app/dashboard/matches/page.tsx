"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Search,
  Filter,
  Star,
  Users,
  Ticket,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Activity,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  StopCircle
} from 'lucide-react'
import { matches } from '@/lib/dummy-data'
import Link from 'next/link'
import Image from 'next/image'

function AdminMatchesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('grid')
  const [isLoading, setIsLoading] = useState(false)

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSport = selectedSport === 'all' || match.sport === selectedSport
    const matchesLocation = selectedLocation === 'all' || match.location === selectedLocation
    
    return matchesSearch && matchesSport && matchesLocation
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      default:
        return 0
    }
  })

  const sports = [...new Set(matches.map(match => match.sport))]
  const locations = [...new Set(matches.map(match => match.location))]

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football': return '⚽'
      case 'basketball': return '🏀'
      case 'volleyball': return '🏐'
      case 'events': return '🎪'
      default: return '🏆'
    }
  }

  const getSportColor = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football': return 'bg-green-100 text-green-800 border-green-200'
      case 'basketball': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'volleyball': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'events': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live': return 'bg-red-100 text-red-800 border-red-200'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Matches</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all sports events and matches
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
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
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
                  <p className="text-3xl font-bold text-gray-900">{matches.length}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Live Matches</p>
                  <p className="text-3xl font-bold text-gray-900">{matches.filter(m => m.status === 'Live').length}</p>
                  <p className="text-xs text-blue-600 mt-1">Currently active</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">2.4M RWF</p>
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
                  <p className="text-sm text-gray-600 font-medium">Avg. Attendance</p>
                  <p className="text-3xl font-bold text-gray-900">85%</p>
                  <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search matches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>
                      {getSportIcon(sport)} {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Earliest)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSport('all')
                  setSelectedLocation('all')
                  setSortBy('date')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 font-medium">
              Showing {filteredMatches.length} of {matches.length} matches
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {filteredMatches.filter(m => m.sport === 'Football').length} Football
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                {filteredMatches.filter(m => m.sport === 'Basketball').length} Basketball
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {filteredMatches.filter(m => m.sport === 'Volleyball').length} Volleyball
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white border-gray-200 hover:bg-gray-50'}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white border-gray-200 hover:bg-gray-50'}
            >
              List
            </Button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredMatches.map((match) => (
            <Card key={match.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-200">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={match.image}
                  alt={`${match.home_team} vs ${match.away_team}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getSportColor(match.sport)} border`}>
                    {getSportIcon(match.sport)} {match.sport}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(match.status)} border`}>
                    {match.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/matches/${match.id}`}>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/matches/${match.id}/edit`}>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {match.home_team} vs {match.away_team}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {match.league}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {match.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {match.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {match.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-sm text-gray-600">Starting from</div>
                      <div className="text-xl font-bold text-green-600">
                        {match.price.toLocaleString()} RWF
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/matches/${match.id}`}>
                        <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/matches/${match.id}/edit`}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMatches.length === 0 && (
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="text-center py-12">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSport('all')
                  setSelectedLocation('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminMatchesPage, ['admin'])
