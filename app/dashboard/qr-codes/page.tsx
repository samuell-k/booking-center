"use client"

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  QrCode,
  Download,
  Search,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Share,
  Eye,
  Filter,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Scan,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { userTickets } from '@/lib/dummy-data'

function AdminQRCodesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [qrCodes, setQrCodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Generate QR codes for existing tickets
    const generatedQRCodes = userTickets.flatMap(ticket => 
      ticket.seat_numbers.map((seat, index) => ({
        id: `QR${ticket.id}${index}`,
        ticketId: ticket.id,
        ticketNumber: `${ticket.id}-${index + 1}`,
        seatNumber: seat,
        match: ticket.match,
        status: ticket.status,
        qrData: `TICKET:${ticket.id}:${seat}:${ticket.match.id}`,
        purchaseDate: ticket.purchase_date,
        isUsed: Math.random() > 0.7, // Randomly mark some as used for demo
        customer: `Customer ${Math.floor(Math.random() * 1000)}`,
        email: `customer${Math.floor(Math.random() * 1000)}@example.com`
      }))
    )
    setQrCodes(generatedQRCodes)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing QR codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.match.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'used' && qr.isUsed) ||
                         (selectedStatus === 'unused' && !qr.isUsed)
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (isUsed: boolean) => {
    if (isUsed) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Used</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
    }
  }

  const usedQRCodes = qrCodes.filter(qr => qr.isUsed)
  const activeQRCodes = qrCodes.filter(qr => !qr.isUsed)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all QR codes for ticket validation and entry
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white border-gray-200 hover:bg-gray-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Generate QR Codes
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Scan className="h-4 w-4 mr-2" />
              Scanner Mode
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total QR Codes</p>
                  <p className="text-3xl font-bold text-gray-900">{qrCodes.length}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last week</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active QR Codes</p>
                  <p className="text-3xl font-bold text-gray-900">{activeQRCodes.length}</p>
                  <p className="text-xs text-blue-600 mt-1">Ready for use</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Used QR Codes</p>
                  <p className="text-3xl font-bold text-gray-900">{usedQRCodes.length}</p>
                  <p className="text-xs text-purple-600 mt-1">Successfully scanned</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Usage Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round((usedQRCodes.length / qrCodes.length) * 100)}%
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Conversion rate</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-green-600" />
              Filters & Search
            </CardTitle>
            <CardDescription className="text-gray-600">Filter and search through QR codes</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search QR codes, events, or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unused">Active</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQRCodes.map((qr) => (
            <Card key={qr.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
              <CardHeader className="bg-white pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{qr.ticketNumber}</CardTitle>
                    <CardDescription className="text-gray-600">{qr.customer}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(qr.isUsed)}
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white border-gray-200 hover:bg-gray-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white border-gray-200 hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="bg-white space-y-4">
                {/* QR Code Display */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>

                {/* Match Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-900">
                    {qr.match.home_team} vs {qr.match.away_team}
                  </h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {qr.match.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {qr.match.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {qr.match.venue}
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-3 w-3 text-gray-400" />
                      Seat: {qr.seatNumber}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button size="sm" variant="outline" className="flex-1 bg-white border-gray-200 hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-white border-gray-200 hover:bg-gray-50">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredQRCodes.length === 0 && (
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="text-center py-12">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR codes found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {filteredQRCodes.length > 0 && (
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 font-medium">
                    {filteredQRCodes.length} QR codes selected
                  </p>
                  <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Download
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Share className="h-4 w-4 mr-2" />
                    Bulk Share
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminQRCodesPage, ['admin'])
