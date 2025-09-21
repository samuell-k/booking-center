"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Search, Calendar, MapPin, Trophy, ShoppingBag, Users, Filter } from "lucide-react"
import { matches, storeProducts, teams } from "@/lib/dummy-data"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const categories = ["all", "events", "products", "teams"]
  const locations = ["all", "Kigali", "Huye", "Musanze", "Rubavu"]

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === "all" || match.location === selectedLocation
    return matchesSearch && matchesLocation
  })

  // Filter products
  const filteredProducts = storeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.team.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Filter teams
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.league.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const allResults = [
    ...filteredMatches.map((m) => ({ ...m, type: "event" })),
    ...filteredProducts.map((p) => ({ ...p, type: "product" })),
    ...filteredTeams.map((t) => ({ ...t, type: "team" })),
  ]

  const getResultsByTab = () => {
    switch (activeTab) {
      case "events":
        return filteredMatches
      case "products":
        return filteredProducts
      case "teams":
        return filteredTeams
      default:
        return allResults
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Search</h1>
          </div>
          <p className="text-muted-foreground">Find events, products, and teams</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for events, products, teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {getResultsByTab().length} results found
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({allResults.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({filteredMatches.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({filteredProducts.length})</TabsTrigger>
            <TabsTrigger value="teams">Teams ({filteredTeams.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allResults.length > 0 ? (
              allResults.map((result, index) => (
                <Card key={`${result.type}-${result.id || index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {result.type === "event" && <Calendar className="h-6 w-6 text-primary" />}
                        {result.type === "product" && <ShoppingBag className="h-6 w-6 text-primary" />}
                        {result.type === "team" && <Users className="h-6 w-6 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">
                            {result.type}
                          </Badge>
                          {result.type === "event" && <Badge variant="secondary">{(result as any).sport}</Badge>}
                          {result.type === "product" && <Badge variant="secondary">{(result as any).team}</Badge>}
                          {result.type === "team" && <Badge variant="secondary">{(result as any).sport}</Badge>}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {result.type === "event" && `${(result as any).home_team} vs ${(result as any).away_team}`}
                          {result.type === "product" && (result as any).name}
                          {result.type === "team" && (result as any).name}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          {result.type === "event" && (
                            <span className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {(result as any).date} {(result as any).time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {(result as any).location}
                              </span>
                            </span>
                          )}
                          {result.type === "product" && (result as any).description}
                          {result.type === "team" && `${(result as any).league} • Founded ${(result as any).founded}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">
                            {result.type === "event" && `${(result as any).price.toLocaleString()} RWF`}
                            {result.type === "product" && `${(result as any).price.toLocaleString()} RWF`}
                            {result.type === "team" && `${(result as any).members} members`}
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or browse our categories.
                  </p>
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {match.home_team} vs {match.away_team}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {match.date} {match.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {match.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{match.price.toLocaleString()} RWF</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">
                      {product.team}
                    </Badge>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg">{product.price.toLocaleString()} RWF</div>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{team.sport}</span>
                        <span>{team.league}</span>
                        <span>Founded {team.founded}</span>
                      </div>
                      <p className="text-muted-foreground">{team.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{team.members} members</div>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Follow Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
