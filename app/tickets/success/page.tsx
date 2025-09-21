"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { CheckCircle, Download, QrCode, Mail, Phone, Calendar, MapPin, Ticket, ArrowLeft, Share2 } from "lucide-react"
import { TicketDisplay } from "@/components/tickets/TicketDisplay"

interface TicketData {
  id: string
  ticket_number: string
  qr_code: string
  qr_image: string
  type: string
  price: number
}

interface PurchaseData {
  payment: {
    id: string
    reference: string
    total_amount: number
    status: string
  }
  tickets: TicketData[]
  qr_codes: Array<{
    ticket_id: string
    ticket_number: string
    qr_image: string
    download_url: string
  }>
  event: {
    title: string
    date: string
    time: string
    location: string
  }
  customer: {
    name: string
    phone: string
    email?: string
  }
}

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch data from the API using the payment reference
    const paymentRef = searchParams.get('ref')
    const eventTitle = searchParams.get('event') || 'APR FC vs Rayon Sports'
    const quantity = parseInt(searchParams.get('quantity') || '2')
    const total = parseInt(searchParams.get('total') || '12400')
    const isMultiple = searchParams.get('multiple') === 'true'

    // Generate mock tickets based on quantity
    const mockTickets = Array.from({ length: quantity }, (_, i) => ({
      id: `ticket_${i + 1}`,
      ticket_number: `${paymentRef}-${String(i + 1).padStart(3, '0')}`,
      qr_code: `mock_qr_data_${i + 1}`,
      qr_image: `data:image/png;base64,mock_image_${i + 1}`,
      type: "regular",
      price: 3000
    }))

    const mockQRCodes = mockTickets.map(ticket => ({
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      qr_image: ticket.qr_image,
      download_url: `/api/v1/tickets/qr/${ticket.id}/download`
    }))

    // Mock data for demonstration
    const mockData: PurchaseData = {
      payment: {
        id: "pay_123",
        reference: paymentRef || "SSR1234567890",
        total_amount: total,
        status: "completed"
      },
      tickets: mockTickets,
      qr_codes: mockQRCodes,
      event: {
        title: eventTitle,
        date: "2025-01-20",
        time: "15:00",
        location: "Kigali Stadium"
      },
      customer: {
        name: "John Doe",
        phone: "0781234567",
        email: "john@example.com"
      }
    }

    setTimeout(() => {
      setPurchaseData(mockData)
      setLoading(false)
    }, 1000)
  }, [searchParams])

  const handleDownloadQR = (downloadUrl: string, ticketNumber: string) => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `ticket-${ticketNumber}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadAllQRs = () => {
    if (!purchaseData) return
    
    purchaseData.qr_codes.forEach((qr, index) => {
      setTimeout(() => {
        handleDownloadQR(qr.download_url, qr.ticket_number)
      }, index * 500) // Stagger downloads
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Tickets - SmartSports Rwanda',
        text: `I just bought tickets for ${purchaseData?.event.title}!`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing your purchase...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold mb-2">Purchase Not Found</h2>
              <p className="text-muted-foreground mb-4">We couldn't find your purchase details.</p>
              <Link href="/tickets/buy">
                <Button>Browse Tickets</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">Purchase Successful!</h1>
          <p className="text-muted-foreground">Your tickets have been generated and are ready to use</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchase Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{purchaseData.event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(purchaseData.event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{purchaseData.event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Tickets ({purchaseData.tickets.length})</span>
                    <span>{(purchaseData.tickets.reduce((sum, t) => sum + t.price, 0)).toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Service Fee</span>
                    <span>{Math.round(purchaseData.tickets.reduce((sum, t) => sum + t.price, 0) * 0.05).toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>VAT (18%)</span>
                    <span>{Math.round((purchaseData.tickets.reduce((sum, t) => sum + t.price, 0) * 1.05) * 0.18).toLocaleString()} RWF</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>{purchaseData.payment.total_amount.toLocaleString()} RWF</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Payment Reference</p>
                  <p className="font-mono text-sm">{purchaseData.payment.reference}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Customer Details</p>
                  <div className="space-y-1 text-sm">
                    <p>{purchaseData.customer.name}</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{purchaseData.customer.phone}</span>
                    </div>
                    {purchaseData.customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{purchaseData.customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets Display */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {purchaseData.tickets.map((ticket, index) => (
                <TicketDisplay
                  key={ticket.id}
                  ticketId={ticket.ticket_number}
                  eventId="1" // This should come from the actual event data
                  userId="user-123" // This should come from the authenticated user
                  ticketType={ticket.type as any}
                  purchaseDate={purchaseData.payment.reference}
                  quantity={1}
                  totalAmount={ticket.price}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/tickets" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Ticket className="mr-2 h-4 w-4" />
                  View My Tickets
                </Button>
              </Link>
              <Link href="/tickets/buy" className="flex-1">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Buy More Tickets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
