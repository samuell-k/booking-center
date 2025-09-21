"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, Search, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { sportsData } from "@/lib/dummy-data"
import { FootballIcon, BasketballIcon, VolleyballIcon, EventIcon } from "@/components/icons/sport-icons"
import { PartnersSection } from "@/components/sections/partners-section"
import { Footer } from "@/components/sections/footer"

export default function SportsPage() {
  const [followedTeams, setFollowedTeams] = useState<string[]>([])
  const [showUnfollowPopup, setShowUnfollowPopup] = useState<string | null>(null)

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
  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold mb-2">Choose Your Sport</h1>
          <p className="text-muted-foreground mb-6">Select a sport category to view teams and upcoming matches</p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search sports, teams, or events..." className="pl-10 border border-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(sportsData).map(([key, sport]) => {
            const getIconComponent = (sportName: string) => {
              switch (sportName.toLowerCase()) {
                case 'football':
                  return <FootballIcon size={24} className="text-white" />
                case 'basketball':
                  return <BasketballIcon size={24} className="text-white" />
                case 'volleyball':
                  return <VolleyballIcon size={24} className="text-white" />
                case 'events':
                  return <EventIcon size={24} className="text-white" />
                default:
                  return <Trophy className="h-6 w-6 text-white" />
              }
            }

            return (
              <Link key={key} href={`/sports/${key.toLowerCase()}`}>
                <Card className="relative overflow-hidden cursor-pointer rounded-xl border-0 shadow-lg bg-white h-96 flex flex-col">
                  
                  <CardHeader className="relative z-10 pb-3 flex-shrink-0">
                    <div className="flex items-center justify-start mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300">
                        {getIconComponent(sport.name)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {sport.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm leading-tight line-clamp-2">
                        {sport.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-primary/5 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-gray-600">Teams</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{sport.teams.length}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-primary/5 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-gray-600">Season</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">2024-25</div>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col justify-end">
                      <div className="text-xs text-gray-500 line-clamp-2">
                        <span className="font-semibold text-gray-700">Top Teams:</span> {sport.teams.slice(0, 2).join(', ')}
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg py-2 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Trophy className="mr-2 h-4 w-4" />
                        Explore {sport.name}
                        <div className="ml-2">
                          →
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Popular Teams</h2>
            <p className="text-gray-600 text-sm">Follow your favorite teams and never miss a match</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["APR FC", "Rayon Sports", "REG BBC", "Patriots BBC"].map((team) => (
              <Card key={team} className="text-center rounded-xl border border-gray-200 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="pt-6 pb-6 px-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-2">{team}</h3>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    {team.includes("FC") ? "Football" : "Basketball"}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <span className="font-bold text-gray-800">25K+</span> followers
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleFollow(team)}
                    className={`w-full rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 py-2 ${
                      followedTeams.includes(team)
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                        : "bg-gradient-to-r from-primary to-primary/90 hover:from-orange-600 hover:to-orange-700 text-white"
                    }`}
                  >
                    {followedTeams.includes(team) ? (
                      <>
                        <Heart className="h-4 w-4 mr-2 fill-current" />
                        Following
                      </>
                    ) : (
                      "+ Follow"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />

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
