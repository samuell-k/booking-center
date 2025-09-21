"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ShoppingCart, Search, Star, Heart, ShoppingBag, Grid, List } from "lucide-react"
import { storeProducts } from "@/lib/dummy-data"
import { PartnersSection } from "@/components/sections/partners-section"
import { Footer } from "@/components/sections/footer"

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cart, setCart] = useState<any[]>([])

  const categories = ["all", "Jerseys", "Accessories", "Equipment"]
  const teams = ["all", "APR FC", "Rayon Sports", "REG BBC", "General"]

  const filteredProducts = storeProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesTeam = selectedTeam === "all" || product.team === selectedTeam
    return matchesSearch && matchesCategory && matchesTeam
  })

  const addToCart = (product: any) => {
    setCart([...cart, product])
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Sports Store</h1>
          </div>
          <p className="text-muted-foreground">Official team merchandise and sports equipment</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team === "all" ? "All Teams" : team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredProducts.length} products found</span>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>{cart.length} items in cart</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex" : ""}`}>
              {viewMode === "grid" ? (
                <>
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-gray-400" />
                    </div>
                    <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    {product.team !== "General" && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        {product.team}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <div className="mb-2">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-lg">{product.price.toLocaleString()} RWF</div>
                      <Badge variant="outline" className="text-xs">
                        {product.stock} in stock
                      </Badge>
                    </div>
                    {product.sizes && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Sizes:</p>
                        <div className="flex gap-1">
                          {product.sizes.map((size) => (
                            <Badge key={size} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button onClick={() => addToCart(product)} className="w-full" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </>
              ) : (
                <div className="flex w-full">
                  <div className="w-32 h-32 bg-gray-100 rounded-l-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardContent className="flex-1 pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          {product.team !== "General" && (
                            <Badge variant="secondary" className="text-xs">
                              {product.team}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                        </div>
                        {product.sizes && (
                          <div className="flex gap-1 mb-2">
                            {product.sizes.map((size) => (
                              <Badge key={size} variant="outline" className="text-xs">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-lg mb-1">{product.price.toLocaleString()} RWF</div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {product.stock} in stock
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => addToCart(product)} size="sm">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedTeam("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Featured Categories */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(1).map((category) => (
              <Card key={category} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {storeProducts.filter((p) => p.category === category).length} products
                  </p>
                  <Button variant="outline" onClick={() => setSelectedCategory(category)}>
                    Shop {category}
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
    </div>
  )
}
