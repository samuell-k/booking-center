"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Calendar, Wallet, Users, Star, ArrowRight, Search, Clock, MapPin, Heart, ShoppingCart, Check } from "lucide-react"
import { matches } from "@/lib/dummy-data"
import { getSportImage } from "@/lib/images"
import { FootballIcon, BasketballIcon, VolleyballIcon, EventIcon, AllSportsIcon } from "@/components/icons/sport-icons"
// import { VideoBackgroundSlides } from "@/components/ui/video-background-slides"
import { AutoTyping } from "@/components/ui/auto-typing"
import { PartnersSection } from "@/components/sections/partners-section"
import { Footer } from "@/components/sections/footer"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Throttled scroll handlers to prevent forced reflows
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => container.removeEventListener('scroll', throttledHandleScroll)
  }, [])

  // Throttled back to top scroll listener
  useEffect(() => {
    let ticking = false
    const throttledHandleScrollToTop = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            setShowBackToTop(true)
          } else {
            setShowBackToTop(false)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScrollToTop, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScrollToTop)
  }, [])

  // Back to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  const filteredMatches = matches.slice(0, 8)

  const upcomingMatches = filteredMatches.slice(0, 3)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSearchSuggestions(false)
    // You can add navigation logic here
    console.log('Searching for:', query)
  }

  // Optimized scroll handler - cache layout values
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Cache layout values to prevent multiple reads
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    
    // Avoid division by zero and unnecessary calculations
    const maxScroll = scrollWidth - clientWidth
    if (maxScroll <= 0) return
    
    // Calculate which page we're on (0 or 1) - 2 pages total, 3 cards per page
    const page = Math.round((scrollLeft / maxScroll) * 1)
    setCurrentPage(Math.min(page, 1))
  }, [])

  // Optimized dot click handler - cache layout values
  const handleDotClick = useCallback((page: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    // Cache layout values to prevent multiple reads
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    const maxScroll = scrollWidth - clientWidth
    
    if (maxScroll <= 0) return
    
    const scrollLeft = (page / 1) * maxScroll
    
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    })
  }, [])

  // Video backgrounds - commented out, using image instead
  // const heroVideos = [
  //   "/videos/football.mp4",
  //   "/videos/basketball.mp4",
  //   "/videos/volleyball.mp4",
  //   "/videos/handball.mp4"
  // ]

  // Auto-typing texts
  const typingTexts = [
    "Rwanda's Premier Sports Platform",
    "Digital Tickets, Real Experiences",
    "Support Your Favorite Teams",
    "Mobile Money Made Easy"
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section with Image Background */}
      <section className="relative min-h-screen">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/std.jpg"
            alt="Sports background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient for better content visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="hero-content-centered container max-w-4xl mx-auto px-4">
          <div className="text-white">
            {/* Auto-typing Title */}
            <h1 className="apple-title text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 min-h-[3rem] md:min-h-[4rem] lg:min-h-[5rem] flex items-center justify-center">
              <AutoTyping
                texts={typingTexts}
                typeSpeed={80}
                deleteSpeed={40}
                pauseDuration={3000}
                className="text-white drop-shadow-lg text-center"
                minHeight="3rem"
              />
            </h1>

            {/* Google-style Search Bar */}
            <div className="mb-6 md:mb-8">
              <div className="relative max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search teams, matches, or events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    className="w-full pl-10 pr-12 py-3 text-base bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-black"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Search suggestions dropdown */}
                <div className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 z-[100] ${showSearchSuggestions ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">Popular searches</div>
                    <div className="space-y-2">
                      <div 
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                        onClick={() => handleSearch("APR FC vs Rayon Sports")}
                      >
                        <Trophy className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">APR FC vs Rayon Sports</span>
                      </div>
                      <div 
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                        onClick={() => handleSearch("Basketball matches")}
                      >
                        <Trophy className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">Basketball matches</span>
                      </div>
                      <div 
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                        onClick={() => handleSearch("Volleyball tickets")}
                      >
                        <Trophy className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">Volleyball tickets</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tickets/buy" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="apple-button w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-4 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Trophy className="mr-3 h-5 w-5" />
                  BUY TICKET
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="apple-button w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-2xl px-8 py-4 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  CREATE ACCOUNT
                </Button>
              </Link>
            </div>
          </div>

          {/* Browse by Sport Section - Over Background */}
          <div className="relative z-10 mt-8 md:mt-12">
            <div className="container max-w-5xl mx-auto px-4">
              {/* Header Section */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-white drop-shadow-lg">Browse by Sport</h2>
                </div>
                <p className="text-white/90 text-xs md:text-sm max-w-xl mx-auto drop-shadow-md">
                  Discover exciting sports and events happening across Rwanda
                </p>
              </div>

              {/* Sport Buttons */}
              <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6">
                {/* Mobile Layout - 3 cards per page with pagination on small screens */}
                <div className="w-full lg:hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory" ref={scrollContainerRef}>
                    {/* Page 1 - First 3 buttons */}
                    <div className="flex gap-3 flex-shrink-0 w-full snap-start">
                      <Link href="/sports" className="group flex-1">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-3 py-3 h-10 text-xs font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group whitespace-nowrap w-full"
                        >
                          <AllSportsIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>All Sports</span>
                        </Button>
                      </Link>
                      <Link href="/sports/football" className="group flex-1">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-3 py-3 h-10 text-xs font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group whitespace-nowrap w-full"
                        >
                          <FootballIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>Football</span>
                        </Button>
                      </Link>
                      <Link href="/sports/basketball" className="group flex-1">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-3 py-3 h-10 text-xs font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group whitespace-nowrap w-full"
                        >
                          <BasketballIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>Basketball</span>
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Page 2 - 3 buttons including All Sports */}
                    <div className="flex gap-3 flex-shrink-0 w-full snap-start">
                      <Link href="/sports" className="group flex-1">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-3 py-3 h-10 text-xs font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group whitespace-nowrap w-full"
                        >
                          <AllSportsIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>All Sports</span>
                        </Button>
                      </Link>
                      <Link href="/sports/volleyball" className="group flex-1">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-3 py-3 h-10 text-xs font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group whitespace-nowrap w-full"
                        >
                          <VolleyballIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>Volleyball</span>
                        </Button>
                      </Link>
                      <Link href="/sports/events" className="group flex-1">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-3 py-3 h-10 text-xs font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group whitespace-nowrap w-full"
                        >
                          <EventIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
                          <span>Events</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Pagination Dots */}
                  <div className="flex justify-center mt-3 gap-2">
                    <button 
                      onClick={() => handleDotClick(0)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${currentPage === 0 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                    ></button>
                    <button 
                      onClick={() => handleDotClick(1)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${currentPage === 1 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                    ></button>
          </div>
        </div>

                {/* Desktop Layout - 2-1-2 arrangement on large screens */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                  {/* Left Side - 2 buttons */}
                  <div className="flex gap-4">
                    <Link href="/sports/football" className="group">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-4 py-3 h-12 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
                      >
                        <FootballIcon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Football</span>
              </Button>
            </Link>
                    <Link href="/sports/basketball" className="group">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-4 py-3 h-12 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
                      >
                        <BasketballIcon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Basketball</span>
              </Button>
            </Link>
                  </div>

                  {/* Center - All Sports */}
                  <Link href="/sports" className="group">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-6 py-3 h-12 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
                    >
                      <AllSportsIcon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                      <span>All Sports</span>
              </Button>
            </Link>

                  {/* Right Side - 2 buttons */}
                  <div className="flex gap-4">
                    <Link href="/sports/volleyball" className="group">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-4 py-3 h-12 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
                      >
                        <VolleyballIcon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Volleyball</span>
              </Button>
            </Link>
                    <Link href="/sports/events" className="group">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-2 border-white/50 hover:border-primary text-gray-800 hover:text-white rounded-lg flex items-center justify-center gap-2 px-4 py-3 h-12 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
                      >
                        <EventIcon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Events</span>
              </Button>
            </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Upcoming Matches */}
      <section className="px-4 py-6 md:py-8 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Upcoming Sports & Events</h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              Don't miss out on the most exciting sports events happening across Rwanda
            </p>
          </div>


          {/* View All Button */}
          <div className="text-center mb-4">
            <Link href="/sports">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white hover:bg-primary hover:text-white border-primary text-primary hover:border-primary px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer hover:!bg-primary"
              >
                Explore All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden !border-0 rounded-lg shadow-lg bg-white">
                <div className="w-full h-[80px] bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  <Image
                    src={match.image || getSportImage(match.sport)}
                    alt={`${match.home_team} vs ${match.away_team || "Event"}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
                    {match.sport}
                  </div>
                </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-primary text-white font-bold text-sm px-3 py-1.5 rounded-lg shadow-lg">
                      {match.price.toLocaleString()} RWF
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                     <Link href={`/tickets/purchase/${match.id}`}>
                       <button
                         className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-red-50 shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
                         aria-label="Purchase ticket for this match"
                       >
                         <Heart className="h-4 w-4" />
                       </button>
                     </Link>
                  </div>
                </div>
                <CardHeader className="pb-1 px-2 pt-2">
                  <CardTitle className="text-sm font-bold text-gray-900">
                    {match.away_team ? `${match.home_team} vs ${match.away_team}` : match.home_team}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span>
                    {new Date(match.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{match.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-gray-700">
                        {match.id === 1 && "15/50 tickets"}
                        {match.id === 2 && "8/30 tickets"}
                        {match.id === 3 && "22/45 tickets"}
                        {match.id === 4 && "12/25 tickets"}
                        {match.id === 5 && "35/100 tickets"}
                        {match.id === 6 && "18/40 tickets"}
                        {match.id === 7 && "5/20 tickets"}
                        {match.id === 8 && "14/35 tickets"}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 px-2 pb-2">
                  <Link href={`/tickets/purchase/${match.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-orange-700 text-white rounded-lg py-1.5 text-xs font-semibold cursor-pointer transition-colors duration-300 group">
                      Buy Ticket
                      <ShoppingCart className="ml-1 h-3 w-3 group-hover:hidden" />
                      <Check className="ml-1 h-3 w-3 hidden group-hover:block" />
                    </Button>
                    </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Back to top"
        >
          <ChevronUp className="h-6 w-6 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </button>
      )}
    </div>
  )
}
