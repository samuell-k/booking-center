"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, X, Trophy, Calendar, Users, ShoppingBag } from "lucide-react"
import { Input } from "@/components/ui/lightweight-input"
import { Button } from "@/components/ui/lightweight-button"
import { Card, CardContent } from "@/components/ui/lightweight-card"
import { Badge } from "@/components/ui/lightweight-badge"
import { cn } from "@/lib/utils"
import { matches, storeProducts, teams } from "@/lib/dummy-data"

export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any>({ matches: [], products: [], teams: [] })
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Real-time search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults({ matches: [], products: [], teams: [] })
      return
    }

    const query = searchQuery.toLowerCase()
    
    const matchResults = matches.filter(match => 
      match.home_team.toLowerCase().includes(query) ||
      match.away_team?.toLowerCase().includes(query) ||
      match.sport.toLowerCase().includes(query) ||
      match.location.toLowerCase().includes(query)
    ).slice(0, 3)

    const productResults = storeProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.team.toLowerCase().includes(query)
    ).slice(0, 3)

    const teamResults = teams.filter(team =>
      team.name.toLowerCase().includes(query) ||
      team.sport.toLowerCase().includes(query)
    ).slice(0, 3)

    setResults({
      matches: matchResults,
      products: productResults,
      teams: teamResults
    })
  }, [searchQuery])

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const openSearch = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const closeSearch = () => {
    setIsOpen(false)
    setSearchQuery("")
  }

  const hasResults = results.matches.length > 0 || results.products.length > 0 || results.teams.length > 0

  return (
    <>
      {/* Search Trigger Button */}
      {!isOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 md:hidden safe-area-top">
          <div className="glass-effect border-b border-border/50 px-4 py-3">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground bg-muted/50 border-border/50 rounded-xl h-10"
              onClick={openSearch}
            >
              <Search className="h-4 w-4 mr-3" />
              Search sports, teams, events...
            </Button>
          </div>
        </div>
      )}

      {/* Full Search Interface */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background">
          <div ref={searchRef} className="h-full flex flex-col">
            {/* Search Header */}
            <div className="glass-effect border-b border-border/50 px-4 py-3 safe-area-top">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sports, teams, events..."
                    className="pl-10 pr-4 rounded-xl border-border/50 bg-muted/50"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSearch}
                  className="h-10 w-10 rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Search SmartSports</h3>
                  <p className="text-muted-foreground">Find matches, teams, and products</p>
                </div>
              ) : !hasResults ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try searching for something else</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Matches */}
                  {results.matches.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        MATCHES
                      </h3>
                      <div className="space-y-2">
                        {results.matches.map((match: any) => (
                          <Link key={match.id} href={`/tickets/purchase/${match.id}`} onClick={closeSearch}>
                            <Card className="apple-button rounded-xl border-0 bg-card/50 backdrop-blur-sm">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">
                                      {match.home_team} vs {match.away_team || "Event"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {match.sport} • {match.location}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {match.price.toLocaleString()} RWF
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teams */}
                  {results.teams.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        TEAMS
                      </h3>
                      <div className="space-y-2">
                        {results.teams.map((team: any) => (
                          <Link key={team.id} href={`/teams/${team.id}`} onClick={closeSearch}>
                            <Card className="apple-button rounded-xl border-0 bg-card/50 backdrop-blur-sm">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Trophy className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{team.name}</p>
                                    <p className="text-xs text-muted-foreground">{team.sport}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {results.products.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        PRODUCTS
                      </h3>
                      <div className="space-y-2">
                        {results.products.map((product: any) => (
                          <Link key={product.id} href={`/store/${product.id}`} onClick={closeSearch}>
                            <Card className="apple-button rounded-xl border-0 bg-card/50 backdrop-blur-sm">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {product.category} • {product.team}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {product.price.toLocaleString()} RWF
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
