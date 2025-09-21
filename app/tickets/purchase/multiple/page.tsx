"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  CreditCard,
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { matches } from "@/lib/dummy-data"

export default function MultipleTicketPurchasePage() {
  const [ticketQuantities, setTicketQuantities] = useState<{[key: string]: number}>({})
  const [selectedMatches, setSelectedMatches] = useState<any[]>([])
  const [ticketOwners, setTicketOwners] = useState<{[key: string]: string[]}>({})
  const [editableOwners, setEditableOwners] = useState<{[key: string]: string[]}>({})
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const matchIds = searchParams.get('matches')?.split(',') || []
    const teamName = searchParams.get('team') || ''
    
    const matchesData = matchIds.map(id => {
      // First try to find in the original matches array
      let match = matches.find(match => match.id.toString() === id)
      
      // If not found and it's a custom team match ID, reconstruct the team match data
      if (!match && id.startsWith('match-')) {
        // Reconstruct team match data based on the ID pattern
        const matchNumber = id.replace('match-', '')
        let teamMatch = null
        
        // Map the custom IDs to the team match data
        switch (id) {
          case 'match-101':
            teamMatch = {
              id: id,
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
            }
            break
          case 'match-102':
            teamMatch = {
              id: id,
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
            }
            break
          case 'match-103':
            teamMatch = {
              id: id,
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
            }
            break
          default:
            // Fallback for unknown team match IDs
            teamMatch = {
              id: id,
              home_team: teamName,
              away_team: "vs Opponent",
              date: "2025-01-01",
              time: "00:00",
              location: "TBD",
              sport: "Football",
              league: "Team League",
              price: 0,
              vip_price: 0,
              status: "upcoming",
              image: "/image.jpg",
            }
        }
        
        return teamMatch
      }
      
      return match
    }).filter(Boolean)
    
    setSelectedMatches(matchesData)
    
    // Initialize quantities to 1 for all selected matches
    const initialQuantities: {[key: string]: number} = {}
    const initialOwners: {[key: string]: string[]} = {}
    const initialEditableOwners: {[key: string]: string[]} = {}
    
    matchesData.forEach((match, index) => {
      if (match) {
        const matchId = match.id.toString()
        initialQuantities[matchId] = 1
        
        // Initialize ticket owners with unique numbers across all matches
        const ticketNumber = index + 1
        initialOwners[matchId] = [`Ticket #${String(ticketNumber).padStart(3, '0')} - Owner 1`]
        initialEditableOwners[matchId] = [`Owner 1`]
      }
    })
    
    setTicketQuantities(initialQuantities)
    setTicketOwners(initialOwners)
    setEditableOwners(initialEditableOwners)
    
    // Debug: Log the initialized ticket owners
    console.log('Initialized ticket owners:', initialOwners)
  }, [searchParams])

  const events = selectedMatches.map(match => ({
    id: match.id.toString(),
    name: `${match.home_team} vs ${match.away_team}`,
    date: match.date,
    time: match.time,
    venue: match.location,
    price: match.price,
    available: 50, // Default availability
    sport: match.sport,
    league: match.league
  }))

  // Helper function to generate unique ticket numbers across all matches
  const generateUniqueTicketNumbers = (eventId: string, quantity: number) => {
    // Get all current ticket numbers to avoid duplicates
    const allCurrentTickets = Object.values(ticketOwners).flat()
    const existingNumbers = new Set(
      allCurrentTickets.map(ticket => {
        const match = ticket.match(/Ticket #(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
    )
    
    // Find the highest existing ticket number
    const maxExistingNumber = existingNumbers.size > 0 ? Math.max(...existingNumbers) : 0
    
    // Generate new unique ticket numbers
    const owners = Array.from({ length: quantity }, (_, index) => {
      const ticketNumber = maxExistingNumber + index + 1
      return `Ticket #${String(ticketNumber).padStart(3, '0')} - Owner ${index + 1}`
    })
    
    return owners
  }

  const updateQuantity = (eventId: string, quantity: number) => {
    const finalQuantity = Math.max(0, Math.min(quantity, events.find(e => e.id === eventId)?.available || 0))
    
    setTicketQuantities(prev => ({
      ...prev,
      [eventId]: finalQuantity
    }))
    
    // Generate ticket owners when quantity changes
    if (finalQuantity > 0) {
      const owners = generateUniqueTicketNumbers(eventId, finalQuantity)
      const editableNames = Array.from({ length: finalQuantity }, (_, index) => 
        `Owner ${index + 1}`
      )
      setTicketOwners(prev => ({
        ...prev,
        [eventId]: owners
      }))
      setEditableOwners(prev => ({
        ...prev,
        [eventId]: editableNames
      }))
    } else {
      setTicketOwners(prev => {
        const newOwners = { ...prev }
        delete newOwners[eventId]
        return newOwners
      })
      setEditableOwners(prev => {
        const newEditable = { ...prev }
        delete newEditable[eventId]
        return newEditable
      })
    }
  }

  const updateOwnerName = (eventId: string, ticketIndex: number, newName: string) => {
    setEditableOwners(prev => ({
      ...prev,
      [eventId]: prev[eventId]?.map((name, index) => 
        index === ticketIndex ? newName : name
      ) || []
    }))
    
    // Update the display name as well, preserving the original ticket number
    setTicketOwners(prev => ({
      ...prev,
      [eventId]: prev[eventId]?.map((owner, index) => {
        if (index === ticketIndex) {
          // Extract the original ticket number from the owner string
          const ticketNumberMatch = owner.match(/Ticket #(\d+)/)
          const ticketNumber = ticketNumberMatch ? ticketNumberMatch[1] : String(ticketIndex + 1).padStart(3, '0')
          return `Ticket #${ticketNumber} - ${newName}`
        }
        return owner
      }) || []
    }))
  }


  const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0)
  const totalPrice = Object.entries(ticketQuantities).reduce((sum, [eventId, qty]) => {
    const event = events.find(e => e.id === eventId)
    return sum + (event ? event.price * qty : 0)
  }, 0)

  if (selectedMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/sports">
              <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sports
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">No Matches Selected</h1>
              <p className="text-gray-600 mt-1">Please select matches to purchase tickets</p>
            </div>
          </div>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">The selected matches could not be loaded.</p>
              <Link href="/sports">
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                  Browse Sports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <Link href="/sports">
              <Button 
                variant="outline" 
                className="group bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-700 hover:text-primary font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Sports
              </Button>
            </Link>
          </div>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Buy Multiple Tickets</h1>
            <p className="text-sm text-gray-600 mb-3">Purchase tickets for {selectedMatches.length} selected match{selectedMatches.length !== 1 ? 'es' : ''}</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Full Width Table */}
        <div className="w-full mb-8">
          <Card className="bg-white border border-gray-100 shadow-lg rounded-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-xl font-bold text-gray-900">Selected Matches</CardTitle>
              <CardDescription className="text-gray-600">
                Choose quantity for each match you want to attend
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{event.name}</div>
                            <div className="text-sm text-gray-500">{event.league}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {event.venue}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-lg font-bold text-primary">{event.price.toLocaleString()} RWF</div>
                          <div className="text-xs text-gray-600">{event.available} available</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(event.id, (ticketQuantities[event.id] || 0) - 1)}
                              disabled={(ticketQuantities[event.id] || 0) <= 0}
                              className="bg-white border-gray-200 hover:bg-gray-50 w-8 h-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={ticketQuantities[event.id] || 0}
                              onChange={(e) => updateQuantity(event.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center bg-white border-gray-200 focus:border-primary focus:ring-primary"
                              min="0"
                              max={event.available}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(event.id, (ticketQuantities[event.id] || 0) + 1)}
                              disabled={(ticketQuantities[event.id] || 0) >= event.available}
                              className="bg-white border-gray-200 hover:bg-gray-50 w-8 h-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-lg font-bold text-primary">
                            {((ticketQuantities[event.id] || 0) * event.price).toLocaleString()} RWF
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="w-full">
          <Card className="bg-white border border-gray-100 shadow-lg rounded-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-xl font-bold text-gray-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="bg-white space-y-4">
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead className="bg-gray-50 border-b border-gray-200">
                           <tr>
                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                             <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price Each</th>
                             <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                             <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                           </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                           {Object.entries(ticketQuantities).map(([eventId, qty]) => {
                             if (qty === 0) return null
                             const event = events.find(e => e.id === eventId)
                             if (!event) return null
                             const owners = ticketOwners[eventId] || []
                             
                             return (
                               <tr key={eventId} className="hover:bg-gray-50">
                                 <td className="px-4 py-4">
                                   <div>
                                     <div className="text-sm font-semibold text-gray-900">{event.name}</div>
                                     <div className="text-xs text-gray-500">{event.league}</div>
                                   </div>
                                 </td>
                                 <td className="px-4 py-4">
                                   <div className="space-y-1">
                                     {owners.map((owner, index) => {
                                       const editableName = editableOwners[eventId]?.[index] ?? `Owner ${index + 1}`
                                       // Extract ticket number from owner string (e.g., "Ticket #001 - Owner 1" -> "001")
                                       const ticketNumberMatch = owner.match(/Ticket #(\d+)/)
                                       const ticketNumber = ticketNumberMatch ? ticketNumberMatch[1] : String(index + 1).padStart(3, '0')
                                       
                                       // Debug: Log ticket information
                                       console.log(`Event ${eventId}, Index ${index}, Owner: "${owner}", Ticket Number: "${ticketNumber}"`)
                                       return (
                                         <div key={index} className="flex items-center gap-2">
                                           <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                           <div className="flex items-center gap-1 flex-1">
                                             <span className="text-xs text-gray-500">
                                               #{ticketNumber} -
                                             </span>
                                             <input
                                               type="text"
                                               value={editableOwners[eventId]?.[index] || ''}
                                               onChange={(e) => updateOwnerName(eventId, index, e.target.value)}
                                               onFocus={(e) => {
                                                 if (e.target.value === `Owner ${index + 1}`) {
                                                   e.target.select()
                                                 }
                                               }}
                                               className="text-xs font-medium text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 px-1 py-0.5 rounded flex-1 min-w-0 focus:ring-1 focus:ring-primary/20"
                                               placeholder={`Owner ${index + 1}`}
                                             />
                                           </div>
                                         </div>
                                       )
                                     })}
                                   </div>
                                 </td>
                                 <td className="px-4 py-4 text-right">
                                   <div className="text-sm font-bold text-primary">
                                     {event.price.toLocaleString()} RWF
                                   </div>
                                 </td>
                                 <td className="px-4 py-4 text-right">
                                   <div className="text-sm font-bold text-primary">
                                     {(event.price * qty).toLocaleString()} RWF
                                   </div>
                                 </td>
                                 <td className="px-4 py-4 text-center">
                                   <div className="flex items-center justify-center gap-1">
                                     <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => updateQuantity(eventId, qty + 1)}
                                       disabled={qty >= (event.available || 50)}
                                       className="w-6 h-6 p-0 bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/50 text-primary hover:text-primary"
                                     >
                                       <Plus className="h-3 w-3" />
                                     </Button>
                                     <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => updateQuantity(eventId, qty - 1)}
                                       disabled={qty <= 1}
                                       className="w-6 h-6 p-0 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
                                     >
                                       <Minus className="h-3 w-3" />
                                     </Button>
                                   </div>
                                 </td>
                               </tr>
                             )
                           })}
                         </tbody>
                       </table>
                     </div>
                
                {totalTickets > 0 && (
                  <>
                    <div className="pt-4 border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-primary">
                          {totalPrice.toLocaleString()} RWF
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {totalTickets} ticket{totalTickets !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </Button>
                  </>
                )}
                
                {totalTickets === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tickets selected</p>
                    <p className="text-sm text-gray-500">Add tickets to your order</p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}