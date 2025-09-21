"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IntouchPaymentModal } from "@/components/payment/IntouchPaymentModal"
import { validateRwandanPhoneNumber, formatPhoneNumber } from "@/lib/utils/phone-validation"

import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, Smartphone, DollarSign, Minus, Plus } from "lucide-react"
import { matches } from "@/lib/dummy-data"

interface TicketPurchasePageProps {
  params: {
    id: string
  }
}

export default function TicketPurchasePage({ params }: TicketPurchasePageProps) {
  const [regularQuantity, setRegularQuantity] = useState(0)
  const [vipQuantity, setVipQuantity] = useState(0)
  const [regularTicketNames, setRegularTicketNames] = useState<string[]>([])
  const [vipTicketNames, setVipTicketNames] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState("mobile_money")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const match = matches.find((m) => m.id.toString() === params.id || m.id === parseInt(params.id))

  if (!match) {
    return (
      <div className="min-h-screen bg-background">

        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Match Not Found</h2>
              <p className="text-muted-foreground mb-4">The match you're looking for doesn't exist.</p>
              <Link href="/sports">
                <Button>Back to Sports</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const regularTotal = match.price * regularQuantity
  const vipTotal = match.vip_price * vipQuantity
  const totalPrice = regularTotal + vipTotal
  const totalQuantity = regularQuantity + vipQuantity
  const serviceFee = Math.round(totalPrice * 0.05) // 5% service fee
  const vatAmount = Math.round((totalPrice + serviceFee) * 0.18) // 18% VAT (EBM)
  const finalTotal = totalPrice + serviceFee + vatAmount

  // Update ticket names when quantity changes
  const updateRegularQuantity = (newQuantity: number) => {
    setRegularQuantity(newQuantity)
    // Adjust names array to match new quantity
    const newNames = [...regularTicketNames]
    if (newQuantity > regularTicketNames.length) {
      // Add empty names for new tickets
      for (let i = regularTicketNames.length; i < newQuantity; i++) {
        newNames.push("")
      }
    } else if (newQuantity < regularTicketNames.length) {
      // Remove excess names
      newNames.splice(newQuantity)
    }
    setRegularTicketNames(newNames)
  }

  const updateVipQuantity = (newQuantity: number) => {
    setVipQuantity(newQuantity)
    // Adjust names array to match new quantity
    const newNames = [...vipTicketNames]
    if (newQuantity > vipTicketNames.length) {
      // Add empty names for new tickets
      for (let i = vipTicketNames.length; i < newQuantity; i++) {
        newNames.push("")
      }
    } else if (newQuantity < vipTicketNames.length) {
      // Remove excess names
      newNames.splice(newQuantity)
    }
    setVipTicketNames(newNames)
  }

  const updateRegularTicketName = (index: number, name: string) => {
    const newNames = [...regularTicketNames]
    newNames[index] = name
    setRegularTicketNames(newNames)
  }

  const updateVipTicketName = (index: number, name: string) => {
    const newNames = [...vipTicketNames]
    newNames[index] = name
    setVipTicketNames(newNames)
  }

  const handlePurchase = async () => {
    // Validate ticket selection
    if (totalQuantity === 0) {
      alert("Please select at least one ticket")
      return
    }

    // Validate required fields
    if (!fullName.trim()) {
      alert("Please enter your full name")
      return
    }

    if (!phoneNumber.trim()) {
      alert("Please enter your phone number")
      return
    }

    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    // Validate phone number format using the new validation utility
    const validation = validateRwandanPhoneNumber(phoneNumber)
    if (!validation.isValid) {
      alert(validation.message)
      return
    }

    // Handle different payment methods
    if (paymentMethod === 'mobile_money') {
      // Show payment modal for mobile money payment
      setShowPaymentModal(true)
    } else if (paymentMethod === 'bank_transfer') {
      // For bank transfer, show instructions or redirect to bank payment page
      alert("Bank transfer payment will be implemented soon. Please use Mobile Money for now.")
    } else if (paymentMethod === 'credit_card') {
      // For credit card, show card payment form or redirect to card payment page
      alert("Credit card payment will be implemented soon. Please use Mobile Money for now.")
    } else {
      alert("Please select a valid payment method")
    }
  }

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData)

    // Create payment reference
    const paymentRef = paymentData.transactionId || `SSR${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Redirect to success page with payment reference
    window.location.href = `/tickets/success?ref=${paymentRef}&event=${encodeURIComponent(match.home_team + ' vs ' + match.away_team)}&quantity=${totalQuantity}&total=${finalTotal}&txn=${paymentData.intouchpayTransactionId || ''}`
  }

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment failed:', error)
    // Don't close the modal automatically - let user see the error and retry
    // The modal has a "Try Again" button for retrying the payment
    console.log('Payment failed, modal remains open for retry')
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="w-full px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold mb-2">Purchase Tickets</h1>
          <p className="text-muted-foreground mb-6">Complete your ticket purchase for the match</p>
          
          <Link href="/sports">
            <Button 
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sports
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Side - Match Details */}
          <div className="xl:col-span-1">
            <Card className="mb-6 overflow-hidden shadow-lg border-0">
              <div className="relative">
                {/* Match Image - Full Width */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={match.image || "/ground.jpg"} 
                    alt={`${match.home_team} vs ${match.away_team}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* League Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 font-semibold text-xs px-3 py-1.5 shadow-lg">
                      {match.league}
                    </Badge>
                  </div>
                  
                  {/* Match Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white font-bold text-xl mb-2 drop-shadow-lg">
                      {match.home_team} vs {match.away_team}
                    </h2>
                    <p className="text-white/90 text-sm font-medium">Tickets</p>
                  </div>
                </div>
                
                {/* Match Details */}
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(match.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{match.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Venue</p>
                        <p className="font-semibold text-gray-900">{match.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Summary - Below the team card */}
            <Card className="mb-6 shadow-lg border-0">
              <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-orange-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tickets Table */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Tickets</div>
                  <div className="space-y-2">
                    {totalQuantity === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No tickets selected
                      </div>
                    ) : (
                      <>
                        {/* Regular Tickets */}
                        {Array.from({ length: regularQuantity }, (_, index) => (
                          <div key={`regular-${index}`} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">Ticket #{String(index + 1).padStart(2, '0')}</span>
                                <span className="text-xs text-gray-500">(REGULAR)</span>
                                {regularTicketNames[index] && (
                                  <span className="text-xs text-blue-600 font-medium">{regularTicketNames[index]}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-semibold">{match.price.toLocaleString()} RWF</span>
                          </div>
                        ))}
                        
                        {/* VIP Tickets */}
                        {Array.from({ length: vipQuantity }, (_, index) => (
                          <div key={`vip-${index}`} className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">Ticket #{String(regularQuantity + index + 1).padStart(2, '0')}</span>
                                <span className="text-xs text-orange-600 font-medium">(VIP)</span>
                                {vipTicketNames[index] && (
                                  <span className="text-xs text-orange-700 font-medium">{vipTicketNames[index]}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-orange-700">{match.vip_price.toLocaleString()} RWF</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  
                  {/* Additional Fees */}
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Service Fee (5%)</span>
                      <span>{serviceFee.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>VAT (18%)</span>
                      <span>{vatAmount.toLocaleString()} RWF</span>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>{finalTotal.toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePurchase}
                  className="w-full h-10"
                  disabled={!paymentMethod || !fullName.trim() || !phoneNumber.trim() || totalQuantity === 0}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {totalQuantity === 0 ? 'Select Tickets' :
                   !paymentMethod ? 'Select Payment Method' :
                   !fullName.trim() ? 'Enter Full Name' :
                   !phoneNumber.trim() ? 'Enter Phone Number' :
                   'Pay Now'}
                </Button>

                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>• Tickets sent to {email ? 'email' : 'phone'}</p>
                  <p>• EBM receipt included</p>
                  <p>• Non-refundable</p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Side - Ticket Selection and Customer Info */}
          <div className="xl:col-span-2">
            {/* Ticket Selection */}
            <Card className="mb-6 shadow-lg border-0">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Select Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ticket Selection - Mixed Types */}
                <div className="space-y-6">
                  {/* Regular Tickets */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-800">Regular Tickets</Label>
                      <span className="text-sm font-bold text-blue-600">{match.price.toLocaleString()} RWF each</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full border-2 hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => updateRegularQuantity(Math.max(0, regularQuantity - 1))}
                        disabled={regularQuantity <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-center w-16 h-10 border-2 border-gray-200 rounded-lg bg-white">
                        <span className="text-lg font-semibold text-gray-900">{regularQuantity}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full border-2 hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => updateRegularQuantity(Math.min(10, regularQuantity + 1))}
                        disabled={regularQuantity >= 10 || totalQuantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {regularQuantity > 0 && (
                      <div className="text-xs text-gray-600">
                        Subtotal: {regularTotal.toLocaleString()} RWF
                      </div>
                    )}
                    
                    {/* Regular Ticket Names */}
                    {regularQuantity > 0 && (
                      <div className="space-y-2 mt-3">
                        <Label className="text-xs font-medium text-gray-700">Ticket Holder Names</Label>
                        {Array.from({ length: regularQuantity }, (_, index) => (
                          <div key={`regular-name-${index}`} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-8">#{String(index + 1).padStart(2, '0')}</span>
                            <Input
                              placeholder={`Enter name for ticket #${String(index + 1).padStart(2, '0')}`}
                              value={regularTicketNames[index] || ""}
                              onChange={(e) => updateRegularTicketName(index, e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* VIP Tickets */}
                  <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-800">VIP Tickets</Label>
                      <span className="text-sm font-bold text-orange-600">{match.vip_price.toLocaleString()} RWF each</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full border-2 hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => updateVipQuantity(Math.max(0, vipQuantity - 1))}
                        disabled={vipQuantity <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-center w-16 h-10 border-2 border-gray-200 rounded-lg bg-white">
                        <span className="text-lg font-semibold text-gray-900">{vipQuantity}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full border-2 hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => updateVipQuantity(Math.min(10, vipQuantity + 1))}
                        disabled={vipQuantity >= 10 || totalQuantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {vipQuantity > 0 && (
                      <div className="text-xs text-gray-600">
                        Subtotal: {vipTotal.toLocaleString()} RWF
                      </div>
                    )}
                    
                    {/* VIP Ticket Names */}
                    {vipQuantity > 0 && (
                      <div className="space-y-2 mt-3">
                        <Label className="text-xs font-medium text-gray-700">Ticket Holder Names</Label>
                        {Array.from({ length: vipQuantity }, (_, index) => (
                          <div key={`vip-name-${index}`} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-8">#{String(regularQuantity + index + 1).padStart(2, '0')}</span>
                            <Input
                              placeholder={`Enter name for ticket #${String(regularQuantity + index + 1).padStart(2, '0')}`}
                              value={vipTicketNames[index] || ""}
                              onChange={(e) => updateVipTicketName(index, e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total Quantity Warning */}
                  {totalQuantity === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Select at least one ticket to continue
                    </div>
                  )}
                </div>

                <hr className="border-gray-200 my-6" />

                {/* Customer Information */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="078 XXX XXX or 250 78X XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setPhoneNumber(formatted)
                      }}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      MTN: 078, 079 | Airtel: 072, 073
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="payment-method" className="text-sm">Payment Method *</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="mt-1 h-12 border-2 border-gray-200 rounded-lg">
                        <SelectValue placeholder="Select payment method">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">(MTN/Airtel)</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <span>(MTN/Airtel)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bank_transfer" disabled>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Bank Transfer
                            <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="credit_card" disabled>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit/Debit Card
                            <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>

      {/* InTouch Payment Modal */}
      <IntouchPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={finalTotal}
        phoneNumber={phoneNumber}
        description={`${totalQuantity} ticket${totalQuantity > 1 ? 's' : ''} (${regularQuantity} Regular, ${vipQuantity} VIP) for ${match.home_team} vs ${match.away_team}`}
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />
    </div>
  )
}
