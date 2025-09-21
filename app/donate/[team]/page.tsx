"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ArrowLeft, Heart, Users, DollarSign, CreditCard, Smartphone } from "lucide-react"

interface DonatePageProps {
  params: {
    team: string
  }
}

export default function DonatePage({ params }: DonatePageProps) {
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)

  const teamName = decodeURIComponent(params.team)
  const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

  const handleDonate = () => {
    const donationAmount = amount === "custom" ? Number.parseInt(customAmount) : Number.parseInt(amount)

    if (!donationAmount || !paymentMethod || !phoneNumber) {
      alert("Please fill in all required fields")
      return
    }

    alert(`Thank you for your ${donationAmount.toLocaleString()} RWF donation to ${teamName}! Payment processing...`)

    // Reset form
    setAmount("")
    setCustomAmount("")
    setPhoneNumber("")
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <Link href="/sports">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sports
            </Button>
          </Link>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">Support {teamName}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your donation helps {teamName} with training, equipment, travel expenses, and player development. Every
              contribution makes a difference in supporting local sports in Rwanda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Select Donation Amount</Label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((presetAmount) => (
                      <Button
                        key={presetAmount}
                        variant={amount === presetAmount.toString() ? "default" : "outline"}
                        onClick={() => {
                          setAmount(presetAmount.toString())
                          setCustomAmount("")
                        }}
                        className="h-12"
                      >
                        {presetAmount.toLocaleString()} RWF
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={amount === "custom" ? "default" : "outline"}
                      onClick={() => setAmount("custom")}
                      className="flex-shrink-0"
                    >
                      Custom Amount
                    </Button>
                    {amount === "custom" && (
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <Label htmlFor="payment-method" className="text-base font-semibold">
                    Payment Method
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          MTN Mobile Money
                        </div>
                      </SelectItem>
                      <SelectItem value="airtel">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Airtel Money
                        </div>
                      </SelectItem>
                      <SelectItem value="wallet">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          My Wallet
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Bank Card
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="07XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* Optional Message */}
                <div>
                  <Label htmlFor="message" className="text-base font-semibold">
                    Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Leave a message of support for the team..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="anonymous">Make this donation anonymous</Label>
                </div>

                {/* Donate Button */}
                <Button onClick={handleDonate} className="w-full h-12 text-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Donate {amount === "custom" ? customAmount : amount} RWF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Team Info & Recent Donations */}
          <div className="space-y-6">
            {/* Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-semibold">2010</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-semibold">25,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">League</span>
                  <span className="font-semibold">Premier League</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Raised</span>
                  <span className="font-semibold text-primary">2.5M RWF</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Anonymous</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="font-semibold text-primary">5,000 RWF</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Jean Baptiste</div>
                      <div className="text-sm text-muted-foreground">1 day ago</div>
                    </div>
                    <div className="font-semibold text-primary">10,000 RWF</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Marie Claire</div>
                      <div className="text-sm text-muted-foreground">3 days ago</div>
                    </div>
                    <div className="font-semibold text-primary">2,500 RWF</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Statement */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Your Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Donations help provide training equipment, travel support for away games, and development programs for
                  young players in Rwanda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
