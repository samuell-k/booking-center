"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Ticket, QrCode, Calendar, MapPin, Clock, Search, Eye, Download } from "lucide-react"
import { userTickets } from "@/lib/dummy-data"
import { PartnersSection } from "@/components/sections/partners-section"
import { Footer } from "@/components/sections/footer"

export default function MyTicketsPage() {
  const [searchCode, setSearchCode] = useState("")
  const [searchPin, setSearchPin] = useState("")
  const [foundTickets, setFoundTickets] = useState(userTickets)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const handleSearch = () => {
    if (searchCode && searchPin) {
      // Simulate ticket search by code and pin
      const filtered = userTickets.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(searchCode.toLowerCase()) ||
          ticket.qr_code.toLowerCase().includes(searchCode.toLowerCase()),
      )
      setFoundTickets(filtered)
    } else {
      setFoundTickets(userTickets)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "used":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Ticket className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">My Tickets</h1>
          </div>
          <p className="text-muted-foreground">Manage and view your purchased tickets</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Tickets
            </CardTitle>
            <CardDescription>Enter your ticket code and PIN to view your ticket details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ticket-code">Ticket Code</Label>
                <Input
                  id="ticket-code"
                  placeholder="Enter ticket code (e.g., TKT001)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={searchPin}
                  onChange={(e) => setSearchPin(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Tickets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets ({foundTickets.length})</CardTitle>
            <CardDescription>
              {foundTickets.length === 0
                ? "No tickets found. Please check your ticket code and PIN."
                : "Click on any ticket to view full details and QR code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {foundTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Match/Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foundTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold">
                              {ticket.match.home_team} vs {ticket.match.away_team || "TBA"}
                            </div>
                            <div className="text-sm text-muted-foreground">{ticket.match.sport}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>{ticket.match.date}</div>
                              <div className="text-sm text-muted-foreground">{ticket.match.time}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ticket.match.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{ticket.total.toLocaleString()} RWF</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Ticket Details</DialogTitle>
                                  <DialogDescription>Present this QR code at the venue entrance</DialogDescription>
                                </DialogHeader>
                                {selectedTicket && (
                                  <div className="space-y-4">
                                    {/* QR Code */}
                                    <div className="text-center">
                                      <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <div className="text-center">
                                          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                          <div className="text-sm text-gray-500">QR Code</div>
                                          <div className="text-xs font-mono">{selectedTicket.qr_code}</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Ticket Details */}
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ticket ID:</span>
                                        <span className="font-mono">{selectedTicket.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Match:</span>
                                        <span>
                                          {selectedTicket.match.home_team} vs {selectedTicket.match.away_team}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span>
                                          {selectedTicket.match.date} at {selectedTicket.match.time}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span>{selectedTicket.match.location}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Seats:</span>
                                        <span>{selectedTicket.seat_numbers?.join(", ") || "General Admission"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span>{selectedTicket.ticket_type}</span>
                                      </div>
                                    </div>

                                    <Button className="w-full">
                                      <Download className="mr-2 h-4 w-4" />
                                      Download Ticket
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Tickets Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchCode || searchPin
                    ? "Please check your ticket code and PIN, then try again."
                    : "You haven't purchased any tickets yet."}
                </p>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Browse Events
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {foundTickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{foundTickets.filter((t) => t.status === "active").length}</div>
                    <div className="text-sm text-muted-foreground">Active Tickets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{foundTickets.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tickets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {foundTickets.reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent (RWF)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
