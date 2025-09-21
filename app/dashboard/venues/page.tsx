"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Map,
  Users,
  Calendar,
  Star,
  MoreHorizontal,
  X,
  Save,
  Phone,
  Mail,
  Globe
} from 'lucide-react'

function AdminVenues() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<any>(null)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isEditFormSliding, setIsEditFormSliding] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: 'Rwanda',
    capacity: '',
    venueType: '',
    amenities: [],
    contactPhone: '',
    contactEmail: '',
    website: '',
    isActive: true,
    isPublic: true,
    coordinates: {
      latitude: '',
      longitude: ''
    }
  })

  // Mock venues data
  const venues = [
    {
      id: 1,
      name: 'Amahoro Stadium',
      description: 'Main football stadium in Kigali with modern facilities',
      address: 'KG 17 Ave, Kigali',
      city: 'Kigali',
      country: 'Rwanda',
      capacity: 30000,
      venueType: 'Stadium',
      amenities: ['Parking', 'Food Court', 'VIP Lounge', 'Media Center'],
      contactPhone: '+250 788 123 456',
      contactEmail: 'info@amahorostadium.rw',
      website: 'www.amahorostadium.rw',
      isActive: true,
      isPublic: true,
      coordinates: { latitude: '-1.9441', longitude: '30.0619' },
      rating: 4.8,
      eventsCount: 45,
      lastUsed: '2024-03-15'
    },
    {
      id: 2,
      name: 'Kigali Convention Centre',
      description: 'Modern convention center for business events and conferences',
      address: 'KG 2 Ave, Kigali',
      city: 'Kigali',
      country: 'Rwanda',
      capacity: 5000,
      venueType: 'Convention Center',
      amenities: ['Conference Rooms', 'Exhibition Hall', 'Catering', 'WiFi'],
      contactPhone: '+250 788 234 567',
      contactEmail: 'events@kcc.rw',
      website: 'www.kcc.rw',
      isActive: true,
      isPublic: true,
      coordinates: { latitude: '-1.9441', longitude: '30.0619' },
      rating: 4.6,
      eventsCount: 23,
      lastUsed: '2024-03-14'
    },
    {
      id: 3,
      name: 'Intare Conference Arena',
      description: 'Multi-purpose arena for sports and entertainment events',
      address: 'KG 1 Ave, Kigali',
      city: 'Kigali',
      country: 'Rwanda',
      capacity: 10000,
      venueType: 'Arena',
      amenities: ['Sound System', 'Lighting', 'Backstage', 'Dressing Rooms'],
      contactPhone: '+250 788 345 678',
      contactEmail: 'bookings@intare.rw',
      website: 'www.intare.rw',
      isActive: true,
      isPublic: true,
      coordinates: { latitude: '-1.9441', longitude: '30.0619' },
      rating: 4.4,
      eventsCount: 18,
      lastUsed: '2024-03-13'
    },
    {
      id: 4,
      name: 'Kigali Cultural Village',
      description: 'Traditional venue for cultural events and ceremonies',
      address: 'KG 28 Ave, Kigali',
      city: 'Kigali',
      country: 'Rwanda',
      capacity: 2000,
      venueType: 'Cultural Center',
      amenities: ['Traditional Setup', 'Outdoor Space', 'Cultural Artifacts'],
      contactPhone: '+250 788 456 789',
      contactEmail: 'culture@kigali.rw',
      website: 'www.kigali.rw',
      isActive: true,
      isPublic: false,
      coordinates: { latitude: '-1.9441', longitude: '30.0619' },
      rating: 4.2,
      eventsCount: 12,
      lastUsed: '2024-03-12'
    },
    {
      id: 5,
      name: 'Huye Stadium',
      description: 'Regional stadium in Huye for local sports events',
      address: 'Huye District, Southern Province',
      city: 'Huye',
      country: 'Rwanda',
      capacity: 15000,
      venueType: 'Stadium',
      amenities: ['Parking', 'Basic Facilities', 'Refreshments'],
      contactPhone: '+250 788 567 890',
      contactEmail: 'huye@stadium.rw',
      website: 'www.huyestadium.rw',
      isActive: false,
      isPublic: true,
      coordinates: { latitude: '-2.5833', longitude: '29.7500' },
      rating: 3.8,
      eventsCount: 8,
      lastUsed: '2024-03-10'
    }
  ]

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && venue.isActive) ||
                         (statusFilter === 'inactive' && !venue.isActive)
    
    return matchesSearch && matchesStatus
  })

  const activeVenues = venues.filter(venue => venue.isActive)
  const totalCapacity = venues.reduce((sum, venue) => sum + venue.capacity, 0)
  const totalEvents = venues.reduce((sum, venue) => sum + venue.eventsCount, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleCreateVenue = () => {
    console.log('Creating venue:', formData)
    setIsFormSliding(false)
    setTimeout(() => {
      setIsCreateDialogOpen(false)
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        city: '',
        country: 'Rwanda',
        capacity: '',
        venueType: '',
        amenities: [],
        contactPhone: '',
        contactEmail: '',
        website: '',
        isActive: true,
        isPublic: true,
        coordinates: {
          latitude: '',
          longitude: ''
        }
      })
    }, 500)
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
    setTimeout(() => setIsFormSliding(true), 50)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    setTimeout(() => setIsCreateDialogOpen(false), 500)
  }

  const handleEditVenue = (venue: any) => {
    setEditingVenue(venue)
    setFormData({
      name: venue.name,
      description: venue.description,
      address: venue.address,
      city: venue.city,
      country: venue.country,
      capacity: venue.capacity.toString(),
      venueType: venue.venueType,
      amenities: venue.amenities,
      contactPhone: venue.contactPhone,
      contactEmail: venue.contactEmail,
      website: venue.website,
      isActive: venue.isActive,
      isPublic: venue.isPublic,
      coordinates: venue.coordinates
    })
    setIsEditDialogOpen(true)
    setTimeout(() => setIsEditFormSliding(true), 50)
  }

  const closeEditDialog = () => {
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditDialogOpen(false)
      setEditingVenue(null)
    }, 500)
  }

  const handleUpdateVenue = () => {
    console.log('Updating venue:', editingVenue?.id, formData)
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditDialogOpen(false)
      setEditingVenue(null)
    }, 500)
  }

  const handleDeleteVenue = (venueId: number) => {
    console.log('Deleting venue:', venueId)
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge> : 
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Venues</h1>
            <p className="text-gray-600 mt-1">
              Manage event venues and their facilities
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Map className="h-4 w-4 mr-2" />
              View Map
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              if (!open) closeCreateDialog()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Venue
                </Button>
              </DialogTrigger>
              <DialogContent className={`w-[600px] h-full max-w-none bg-white [&>button]:hidden ${
                isFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`} style={{ 
                position: 'fixed',
                top: '0',
                right: '0',
                height: '100vh',
                width: '600px',
                transform: isFormSliding 
                  ? 'translateX(0)' 
                  : 'translateX(100%)',
                transition: 'transform 700ms ease-out, opacity 700ms ease-out',
                borderRadius: '0',
                border: 'none',
                boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
                zIndex: 9999,
                margin: '0',
                maxWidth: '600px',
                left: 'auto'
              }}>
                <DialogHeader className="bg-white border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-gray-900">Add New Venue</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Add a new venue with its facilities and contact information
                      </DialogDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeCreateDialog}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>
                <div className="space-y-6 bg-white overflow-y-auto h-full pb-20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Venue Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Amahoro Stadium"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueType" className="text-gray-700 font-medium">Venue Type</Label>
                      <Select value={formData.venueType} onValueChange={(value) => handleSelectChange('venueType', value)}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select venue type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="stadium">Stadium</SelectItem>
                          <SelectItem value="arena">Arena</SelectItem>
                          <SelectItem value="convention">Convention Center</SelectItem>
                          <SelectItem value="cultural">Cultural Center</SelectItem>
                          <SelectItem value="outdoor">Outdoor Venue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the venue and its features..."
                      rows={3}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 font-medium">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g., KG 17 Ave, Kigali"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-700 font-medium">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g., Kigali"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-gray-700 font-medium">Capacity *</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 30000"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="text-gray-700 font-medium">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="e.g., +250 788 123 456"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-gray-700 font-medium">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="e.g., info@venue.rw"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-700 font-medium">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="e.g., www.venue.rw"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                      />
                      <Label htmlFor="isActive" className="text-gray-700 font-medium">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
                      />
                      <Label htmlFor="isPublic" className="text-gray-700 font-medium">Public Venue</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={closeCreateDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateVenue} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Add Venue
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Venues</p>
                  <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Venues</p>
                  <p className="text-2xl font-bold text-gray-900">{activeVenues.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
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
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:ring-green-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Venues Table */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">Venues</CardTitle>
            <CardDescription className="text-gray-600">
              Manage and organize your event venues
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">Venue</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Location</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Capacity</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Events</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Rating</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVenues.map((venue) => (
                  <TableRow key={venue.id} className="bg-white hover:bg-gray-50">
                    <TableCell className="text-gray-900">
                      <div>
                        <div className="font-medium">{venue.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{venue.description}</div>
                        <div className="flex gap-1 mt-1">
                          {venue.amenities.slice(0, 2).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                              {amenity}
                            </Badge>
                          ))}
                          {venue.amenities.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              +{venue.amenities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div>
                        <div className="font-medium">{venue.city}</div>
                        <div className="text-sm text-gray-500">{venue.address}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="text-center">
                        <div className="font-medium">{venue.capacity.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">people</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">{venue.venueType}</TableCell>
                    <TableCell className="text-gray-900">
                      <div className="text-center">
                        <div className="font-medium">{venue.eventsCount}</div>
                        <div className="text-xs text-gray-500">events</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{venue.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(venue.isActive)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="hover:bg-gray-100">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditVenue(venue)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteVenue(venue.id)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) closeEditDialog()
        }}>
          <DialogContent className={`w-[600px] h-full max-w-none bg-white [&>button]:hidden ${
            isEditFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`} style={{ 
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100vh',
            width: '600px',
            transform: isEditFormSliding 
              ? 'translateX(0)' 
              : 'translateX(100%)',
            transition: 'transform 700ms ease-out, opacity 700ms ease-out',
            borderRadius: '0',
            border: 'none',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            margin: '0',
            maxWidth: '600px',
            left: 'auto'
          }}>
            <DialogHeader className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-gray-900">Edit Venue</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update the venue information and settings
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeEditDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-6 bg-white overflow-y-auto h-full pb-20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-gray-700 font-medium">Venue Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-venueType" className="text-gray-700 font-medium">Venue Type</Label>
                  <Select value={formData.venueType} onValueChange={(value) => handleSelectChange('venueType', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="stadium">Stadium</SelectItem>
                      <SelectItem value="arena">Arena</SelectItem>
                      <SelectItem value="convention">Convention Center</SelectItem>
                      <SelectItem value="cultural">Cultural Center</SelectItem>
                      <SelectItem value="outdoor">Outdoor Venue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-gray-700 font-medium">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address" className="text-gray-700 font-medium">Address *</Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city" className="text-gray-700 font-medium">City *</Label>
                  <Input
                    id="edit-city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country" className="text-gray-700 font-medium">Country</Label>
                  <Input
                    id="edit-country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity" className="text-gray-700 font-medium">Capacity *</Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPhone" className="text-gray-700 font-medium">Contact Phone</Label>
                  <Input
                    id="edit-contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactEmail" className="text-gray-700 font-medium">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-website" className="text-gray-700 font-medium">Website</Label>
                <Input
                  id="edit-website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                  />
                  <Label htmlFor="edit-isActive" className="text-gray-700 font-medium">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
                  />
                  <Label htmlFor="edit-isPublic" className="text-gray-700 font-medium">Public Venue</Label>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeEditDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateVenue} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update Venue
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminVenues, ['admin'])
