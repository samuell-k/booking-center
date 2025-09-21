'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, Download, Share2, QrCode } from 'lucide-react'
import { qrService, TicketQRData } from '@/lib/services/qrService'
import { matches } from '@/lib/dummy-data'

interface TicketDisplayProps {
  ticketId: string
  eventId: string
  userId: string
  ticketType: 'regular' | 'vip' | 'student' | 'child'
  purchaseDate: string
  quantity: number
  totalAmount: number
}

export function TicketDisplay({
  ticketId,
  eventId,
  userId,
  ticketType,
  purchaseDate,
  quantity,
  totalAmount
}: TicketDisplayProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [isGeneratingQR, setIsGeneratingQR] = useState(true)

  // Find the event data
  const event = matches.find(m => m.id.toString() === eventId)

  useEffect(() => {
    generateQRCode()
  }, [])

  const generateQRCode = async () => {
    try {
      setIsGeneratingQR(true)
      
      const ticketData: TicketQRData = qrService.generateTicketQRData({
        ticketId,
        eventId,
        userId,
        ticketType,
        purchaseDate
      })

      const qrCode = await qrService.generateQRCode(ticketData)
      setQrCodeDataURL(qrCode)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleDownload = () => {
    // In a real implementation, you would generate a PDF ticket
    console.log('Download ticket functionality would be implemented here')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${event?.home_team} vs ${event?.away_team}`,
        text: `I have a ticket for the ${event?.sport} match!`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Ticket link copied to clipboard!')
    }
  }

  if (!event) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Event not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main Ticket Card */}
      <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">SmartSports RW</CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {ticketType.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Event Details */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {event.home_team} vs {event.away_team}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{event.league}</p>
          </div>

          {/* Event Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              {isGeneratingQR ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <img
                  src={qrCodeDataURL}
                  alt="Ticket QR Code"
                  className="w-48 h-48"
                />
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ticket ID:</span>
              <span className="font-mono text-xs">{ticketId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-bold">{totalAmount.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Purchase Date:</span>
              <span>{new Date(purchaseDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Important:</p>
              <ul className="text-amber-700 space-y-1 text-xs">
                <li>• Present this QR code at the venue entrance</li>
                <li>• Keep your ticket secure and don't share the QR code</li>
                <li>• Arrive at least 30 minutes before the event starts</li>
                <li>• Bring a valid ID for verification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
