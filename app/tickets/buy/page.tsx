"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { Calendar, Clock, MapPin, Search, Trophy, Ticket } from "lucide-react"
import { matches } from "@/lib/dummy-data"
import { PartnersSection } from "@/components/sections/partners-section"
import { Footer } from "@/components/sections/footer"

export default function BuyTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")

  // Filter matches based on search and sport
  const filteredMatches = matches.filter((match) => {
    const matchesSearch = searchTerm === "" || 
      match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.away_team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSport = selectedSport === "all" || match.sport.toLowerCase() === selectedSport.toLowerCase()
    
    return matchesSearch && matchesSport && match.status === "upcoming"
  })

  // Get unique sports for filter
  const sports = ["all", ...Array.from(new Set(matches.map(match => match.sport)))]

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Ticket className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Buy Tickets</h1>
              <p className="text-muted-foreground">Choose from available matches and upcoming events</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search matches, teams, or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {sports.map((sport) => (
                <Button
                  key={sport}
                  variant={selectedSport === sport ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSport(sport)}
                  className="capitalize"
                >
                  {sport}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} available
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Fast & Easy Booking</span>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                <img
                  src={match.image || "/image.jpg"}
                  alt={`${match.home_team} vs ${match.away_team || 'Event'}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {match.sport}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {match.away_team ? `${match.home_team} vs ${match.away_team}` : match.home_team}
                  </h3>
                  {match.league && (
                    <p className="text-white/80 text-sm">{match.league}</p>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Match Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(match.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{match.location}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Regular</div>
                    <div className="font-bold text-primary">{match.price.toLocaleString()} RWF</div>
                  </div>
                  {match.vip_price && (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">VIP</div>
                      <div className="font-bold text-primary">{match.vip_price.toLocaleString()} RWF</div>
                    </div>
                  )}
                </div>

                {/* Buy Ticket Button */}
                <Link href={`/tickets/purchase/${match.id}`}>
                  <Button className="w-full apple-button rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Ticket className="mr-2 h-4 w-4" />
                    Buy Tickets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMatches.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Matches Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedSport !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No upcoming matches available at the moment."}
              </p>
              {(searchTerm || selectedSport !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSport("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
