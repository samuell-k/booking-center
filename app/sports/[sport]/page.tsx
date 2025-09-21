"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { ArrowLeft, Users, MapPin, Clock, Calendar, Heart, Search, Eye, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { sportsData, matches } from "@/lib/dummy-data"
import { notFound } from "next/navigation"

interface SportPageProps {
  params: {
    sport: string
  }
}

export default function SportPage({ params }: SportPageProps) {
  const [followedTeams, setFollowedTeams] = useState<string[]>([])
  const [showUnfollowPopup, setShowUnfollowPopup] = useState<string | null>(null)

  const sportKey = params.sport.charAt(0).toUpperCase() + params.sport.slice(1)
  const sport = sportsData[sportKey as keyof typeof sportsData]

  if (!sport) {
    notFound()
  }

  const sportMatches = matches.filter((match) => match.sport === sportKey)

  const handleFollow = (team: string) => {
    if (followedTeams.includes(team)) {
      setShowUnfollowPopup(team)
    } else {
      setFollowedTeams((prev) => [...prev, team])
    }
  }

  const handleUnfollow = (team: string) => {
    setFollowedTeams((prev) => prev.filter((t) => t !== team))
    setShowUnfollowPopup(null)
  }

  const handleCancelUnfollow = () => {
    setShowUnfollowPopup(null)
  }

  const getFollowerCount = (team: string) => {
    const counts: { [key: string]: number } = {
      "APR FC": 15420,
      "Rayon Sports": 12350,
      "Kiyovu Sports": 8900,
      "Mukura Victory": 6750,
      "REG BBC": 9800,
      "Patriots BBC": 11200,
      "APR BBC": 7600,
      "Espoir BBC": 5400,
      "Rwanda Energy Group": 4200,
      "Police VC": 3800,
      "Gisagara VC": 2900,
      "University of Rwanda": 5600,
      "Police FC": 1972,
      "Gasogi United": 3200,
      "Musanze FC": 2800,
      "SC Kiyovu": 4500,
      "Mukura VS": 3800,
      "AS Kigali": 4200,
      "UTB VC": 2100,
      "REG VC": 1800,
      "RRA VC": 1500,
    }
    return counts[team] || 2500
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col items-center text-center gap-4 mb-4">
            <div className="text-4xl">{sport.icon}</div>
            <div>
              <h1 className="font-serif text-3xl font-bold">{sport.name}</h1>
              <p className="text-muted-foreground">{sport.description}</p>
            </div>
          </div>

          <div className="relative max-w-md mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder={`Search ${sport.name.toLowerCase()} teams or matches...`} className="pl-10 rounded-lg border border-gray-300" />
          </div>

          {/* Back Navigation */}
          <div className="flex justify-center">
            <Link href="/sports">
              <Button 
                className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Back to Sports
                <ArrowLeft className="ml-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>

         {/* Teams Section */}
         <section className="mb-12">
           <h2 className="font-serif text-2xl font-bold mb-6">Teams</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sport.teams.map((team) => (
              <Card key={team} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <img src="/image.jpg" alt={team} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      {getFollowerCount(team).toLocaleString()} followers
                    </Badge>
                  </div>
                </div>

                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 -mt-8 border-4 border-white">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{team}</h3>
                    <p className="text-sm text-muted-foreground">Founded 2010 • 25K Members</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                     <div className="flex flex-col items-center gap-1 h-auto py-2">
                       <button
                         onClick={() => handleFollow(team)}
                         className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                           followedTeams.includes(team) 
                             ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md hover:shadow-lg" 
                             : "bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary"
                         }`}
                       >
                         <Heart className={`h-4 w-4 ${followedTeams.includes(team) ? "fill-current" : ""}`} />
                       </button>
                       {followedTeams.includes(team) ? (
                         <button
                           onClick={() => handleFollow(team)}
                           className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                         >
                           Following
                         </button>
                       ) : (
                         <span className="text-xs text-gray-600">Follow</span>
                       )}
                     </div>

                    <Link href={`/donate/${encodeURIComponent(team)}`}>
                      <Button size="sm" className="w-full flex flex-col items-center gap-1 h-auto py-2">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-xs">Donate</span>
                      </Button>
                    </Link>

                    <Link href={`/teams/${encodeURIComponent(team)}/matches`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex flex-col items-center gap-1 h-auto py-2 bg-transparent"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">Matches</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Matches */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-6">Upcoming Matches</h2>
          {sportMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sportMatches.slice(0, 10).map((match) => (
                <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    <img
                      src={match.image || "/football-stadium-crowd.png"}
                      alt={`${match.home_team} vs ${match.away_team}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-2 left-2 text-white">
                      <Badge variant="secondary" className="bg-white/90 text-black mb-1">
                        {match.league}
                      </Badge>
                      <div className="font-bold text-sm">
                        {new Date(match.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-white/90 text-black border-white/90">
                        {match.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="pt-4">
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="text-center flex-1">
                          <div className="font-semibold text-sm">{match.home_team}</div>
                          <div className="text-xs text-muted-foreground">Home</div>
                        </div>
                        <div className="text-lg font-bold text-primary">VS</div>
                        <div className="text-center flex-1">
                          <div className="font-semibold text-sm">{match.away_team || "TBA"}</div>
                          <div className="text-xs text-muted-foreground">Away</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(match.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{match.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Regular</div>
                        <div className="font-bold">{match.price.toLocaleString()} RWF</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">VIP</div>
                        <div className="font-bold">{match.vip_price.toLocaleString()} RWF</div>
                      </div>
                    </div>

                    <Link href={`/tickets/purchase/${match.id}`}>
                      <Button className="w-full" size="sm">
                        Buy Tickets
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Upcoming Matches</h3>
                <p className="text-muted-foreground">Check back later for new {sport.name.toLowerCase()} matches.</p>
              </CardContent>
            </Card>
          )}
         </section>
       </div>

       {/* Unfollow Popup */}
       {showUnfollowPopup && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
             <div className="text-center">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Heart className="h-8 w-8 text-red-500 fill-current" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Unfollow {showUnfollowPopup}?</h3>
               <p className="text-gray-600 text-sm mb-6">
                 You'll stop receiving updates about this team
               </p>
               <div className="flex gap-3">
                 <button
                   onClick={handleCancelUnfollow}
                   className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => handleUnfollow(showUnfollowPopup)}
                   className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                 >
                   Unfollow
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
