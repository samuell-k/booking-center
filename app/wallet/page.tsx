"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Wallet,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Eye,
  EyeOff,
} from "lucide-react"
import { walletTransactions } from "@/lib/dummy-data"

export default function WalletPage() {
  const [balance, setBalance] = useState(34000)
  const [showBalance, setShowBalance] = useState(true)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "purchase":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "donation":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600"
      case "purchase":
        return "text-red-600"
      case "donation":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const handleDeposit = () => {
    if (depositAmount && paymentMethod && phoneNumber) {
      // Simulate deposit
      setBalance((prev) => prev + Number.parseInt(depositAmount))
      setDepositAmount("")
      setPhoneNumber("")
      alert("Deposit successful!")
    }
  }

  const handleWithdraw = () => {
    if (withdrawAmount && paymentMethod && phoneNumber) {
      const amount = Number.parseInt(withdrawAmount)
      if (amount <= balance) {
        setBalance((prev) => prev - amount)
        setWithdrawAmount("")
        setPhoneNumber("")
        alert("Withdrawal successful!")
      } else {
        alert("Insufficient balance!")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">My Wallet</h1>
          </div>
          <p className="text-muted-foreground">Manage your funds and view transaction history</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Available Balance</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold">{showBalance ? `${balance.toLocaleString()} RWF` : "••••••"}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Wallet ID</p>
                <p className="font-mono text-sm">RW-2025-001</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="flex-1">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Money
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Money to Wallet</DialogTitle>
                    <DialogDescription>Add funds using Mobile Money or Bank Card</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount (RWF)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="card">Bank Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        placeholder="07XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleDeposit} className="w-full">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Add Money
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Minus className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Money</DialogTitle>
                    <DialogDescription>Withdraw funds to your Mobile Money account</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount (RWF)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Available: {balance.toLocaleString()} RWF</p>
                    </div>
                    <div>
                      <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select withdrawal method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="withdraw-phone">Phone Number</Label>
                      <Input
                        id="withdraw-phone"
                        placeholder="07XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleWithdraw} className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Withdraw Money
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {walletTransactions.filter((t) => t.type === "deposit").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Deposits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {walletTransactions.filter((t) => t.type === "purchase").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Purchases</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {walletTransactions.filter((t) => t.type === "donation").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Donations</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <History className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{walletTransactions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>View all your wallet transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toLocaleString()} RWF
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          className={transaction.status === "completed" ? "bg-green-100 text-green-800" : ""}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Security Notice</h3>
                <p className="text-sm text-amber-700">
                  Keep your wallet secure. Never share your PIN or personal information with anyone. SmartSports RW will
                  never ask for your PIN via phone or email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
