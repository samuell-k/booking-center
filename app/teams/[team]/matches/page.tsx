"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { ArrowLeft, Calendar, Clock, MapPin, Users, ShoppingCart, Edit, Trash2 } from "lucide-react"
import { matches } from "@/lib/dummy-data"

interface TeamMatchesPageProps {
  params: {
    team: string
  }
}

export default function TeamMatchesPage({ params }: TeamMatchesPageProps) {
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const teamName = decodeURIComponent(params.team)

  // Filter matches for this team (either home or away) and add some additional sample matches
  const teamMatches = [
    ...matches.filter((match) => match.home_team === teamName || match.away_team === teamName),
    // Add more sample matches for demonstration
    {
      id: "match-101",
      home_team: teamName,
      away_team: "Kiyovu Sports",
      date: "2025-01-25",
      time: "15:00",
      location: "Amahoro Stadium",
      sport: "Football",
      league: "Rwanda Premier League",
      price: 3000,
      vip_price: 8000,
      status: "upcoming",
      image: "/football-stadium-crowd.png",
    },
    {
      id: "match-102",
      home_team: "Mukura Victory",
      away_team: teamName,
      date: "2025-02-01",
      time: "16:30",
      location: "Huye Stadium",
      sport: "Football",
      league: "Rwanda Premier League",
      price: 2500,
      vip_price: 7000,
      status: "upcoming",
      image: "/football-stadium-crowd.png",
    },
    {
      id: "match-103",
      home_team: teamName,
      away_team: "Police FC",
      date: "2025-02-08",
      time: "14:00",
      location: "Kigali Stadium",
      sport: "Football",
      league: "Rwanda Premier League",
      price: 3500,
      vip_price: 9000,
      status: "upcoming",
      image: "/football-stadium-crowd.png",
    },
  ]

  const handleMatchSelection = (matchId: string | number) => {
    const matchIdStr = matchId.toString()
    setSelectedMatches((prev) => (prev.includes(matchIdStr) ? prev.filter((id) => id !== matchIdStr) : [...prev, matchIdStr]))
  }

  const getTotalPrice = () => {
    return selectedMatches.reduce((total, matchId) => {
      const match = teamMatches.find((m) => m.id.toString() === matchId)
      return total + (match?.price || 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {teamName} Matches
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Select multiple matches to book tickets
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/sports">
              <Button className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sports
              </Button>
            </Link>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedMatches.length > 0 && (
          <div className="mb-6 sm:mb-8">
            {/* Header with title and button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h3 className="font-semibold text-lg text-primary">Selected Matches: {selectedMatches.length}</h3>
              </div>
              <Link href={`/tickets/purchase/multiple?matches=${selectedMatches.join(",")}&team=${encodeURIComponent(teamName)}`}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Book Selected Tickets
                </Button>
              </Link>
            </div>
            
            {/* Table Format - Full Width */}
            <div className="bg-white border border-gray-200 overflow-hidden w-full">
              <div className="max-h-48 overflow-y-auto overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[120px]">Match</th>
                      <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[80px]">Home</th>
                      <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[80px]">Away</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[100px]">Date & Time</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[120px]">Venue</th>
                      <th className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[100px]">Price</th>
                      <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedMatches.map((matchId) => {
                      const match = teamMatches.find((m) => m.id.toString() === matchId)
                      if (!match) return null
                      return (
                        <tr key={matchId} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap border-r border-gray-200">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {match.home_team} vs {match.away_team}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center border-r border-gray-200">
                            <div className="flex items-center justify-center">
                              {match.home_team === teamName ? (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  ✗ No
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center border-r border-gray-200">
                            <div className="flex items-center justify-center">
                              {match.away_team === teamName ? (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  ✗ No
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap border-r border-gray-200">
                            <div className="text-xs sm:text-sm text-gray-600">
                              {new Date(match.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap border-r border-gray-200">
                            <div className="text-xs sm:text-sm text-gray-600">
                              {match.location}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-right border-r border-gray-200">
                            <div className="text-xs sm:text-sm font-semibold text-primary">
                              {match.price.toLocaleString()} RWF
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <button
                                onClick={() => {
                                  // Edit functionality - could open a modal or navigate to edit page
                                  console.log('Edit match:', matchId)
                                }}
                                className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                                title="Edit match"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() => handleMatchSelection(matchId)}
                                className="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                                title="Remove match"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Total Row */}
              <div className="bg-primary/5 border-t border-primary/20 px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {getTotalPrice().toLocaleString()} RWF
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {teamMatches.map((match) => (
            <Card key={match.id} className="overflow-hidden border-0 shadow-md bg-white">
              <div className="h-48 sm:h-52 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                <img
                  src={match.image || "/image.jpg"}
                  alt={`${match.home_team} vs ${match.away_team}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedMatches.includes(match.id.toString())}
                    onCheckedChange={() => handleMatchSelection(match.id)}
                    className="bg-white/90 border-white/90 data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-lg"
                  />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="outline" 
                    className={`bg-white/95 text-black border-white/95 font-medium ${
                      match.status === 'upcoming' ? 'text-green-700' : 
                      match.status === 'live' ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {match.status}
                  </Badge>
                </div>
                
                {/* League Badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-white/95 text-black font-medium shadow-md">
                    {match.league}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 sm:p-5">
                {/* Match Teams */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                    <div className="text-center flex-1 min-w-0">
                      <div className={`font-bold text-sm sm:text-base truncate ${match.home_team === teamName ? "text-primary" : "text-foreground"}`}>
                        {match.home_team}
                      </div>
                      <div className="text-xs text-muted-foreground">Home</div>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-primary px-2">VS</div>
                    <div className="text-center flex-1 min-w-0">
                      <div className={`font-bold text-sm sm:text-base truncate ${match.away_team === teamName ? "text-primary" : "text-foreground"}`}>
                        {match.away_team || "TBA"}
                      </div>
                      <div className="text-xs text-muted-foreground">Away</div>
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(match.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{match.location}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Regular</div>
                    <div className="font-bold text-sm sm:text-base text-foreground">
                      {match.price.toLocaleString()} RWF
                    </div>
                  </div>
                  <div className="w-px h-8 bg-border mx-2"></div>
                  <div className="text-center flex-1">
                    <div className="text-xs text-muted-foreground mb-1">VIP</div>
                    <div className="font-bold text-sm sm:text-base text-primary">
                      {match.vip_price.toLocaleString()} RWF
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${
                      selectedMatches.includes(match.id.toString()) 
                        ? "bg-red-50 border-red-200 text-red-700" 
                        : "bg-transparent"
                    }`}
                    onClick={() => handleMatchSelection(match.id)}
                  >
                    {selectedMatches.includes(match.id.toString()) ? "Remove" : "Select"}
                  </Button>
                  <Link href={`/tickets/purchase/${match.id}`} className="flex-1">
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-md"
                    >
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teamMatches.length === 0 && (
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2">No Matches Found</h3>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                No upcoming matches for {teamName}. Check back later for new fixtures!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
