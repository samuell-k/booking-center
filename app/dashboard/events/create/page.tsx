"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Save,
  ArrowLeft,
  Plus,
  X,
  Settings,
  BarChart3,
  Ticket,
  Eye
} from 'lucide-react'
import Link from 'next/link'

function AdminCreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    sport: "",
    capacity: "",
    price: "",
    category: "",
    status: "draft",
    thumbnail: null as File | null,
    images: [] as File[],
    ticketTypes: [
      { 
        name: "General Admission", 
        category: "standard",
        price: "", 
        quantity: "",
        description: "Basic entry or seating",
        benefits: []
      },
      { 
        name: "VIP", 
        category: "vip",
        price: "", 
        quantity: "",
        description: "Premium access, best seats, extra perks",
        benefits: ["Best seats", "Premium access", "Extra perks"]
      }
    ],
    settings: {
      allowRefunds: true,
      requireApproval: false,
      maxTicketsPerUser: 4,
      earlyBirdDiscount: false,
      groupDiscount: false
    }
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }))
      
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleTicketTypeChange = (index: number, field: string, value: string) => {
    const newTicketTypes = [...formData.ticketTypes]
    newTicketTypes[index] = {
      ...newTicketTypes[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      ticketTypes: newTicketTypes
    }))
  }

  const handleTicketTypeCategoryChange = (index: number, categoryId: string) => {
    const selectedCategory = ticketTypeCategories.find(cat => cat.id === categoryId)
    if (selectedCategory) {
      const newTicketTypes = [...formData.ticketTypes]
      newTicketTypes[index] = {
        ...newTicketTypes[index],
        category: categoryId,
        name: selectedCategory.name,
        description: selectedCategory.description,
        benefits: selectedCategory.benefits
      }
      setFormData(prev => ({
        ...prev,
        ticketTypes: newTicketTypes
      }))
    }
  }

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { 
        name: "", 
        category: "",
        price: "", 
        quantity: "",
        description: "",
        benefits: []
      }]
    }))
  }

  const removeTicketType = (index: number) => {
    const newTicketTypes = formData.ticketTypes.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      ticketTypes: newTicketTypes
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Event created:", formData)
    // Handle form submission
  }

  const sports = ["Football", "Basketball", "Volleyball", "Tennis", "Rugby", "Athletics", "Other"]
  const venues = ["Amahoro Stadium", "Kigali Stadium", "BK Arena", "Petit Stade", "Nyamirambo Stadium", "Other"]
  const categories = ["Professional", "Amateur", "Youth", "Women", "Championship", "Friendly", "Tournament"]
  
  const ticketTypeCategories = [
    {
      id: "vip",
      name: "VIP (Very Important Person)",
      description: "Premium access, best seats, extra perks",
      benefits: ["Best seats", "Premium access", "Extra perks", "VIP lounge access", "Complimentary refreshments"]
    },
    {
      id: "premium",
      name: "Premium / Business Class",
      description: "Better than standard, but below VIP",
      benefits: ["Priority seating", "Enhanced comfort", "Better view", "Faster entry"]
    },
    {
      id: "standard",
      name: "Standard / Regular / General Admission",
      description: "Basic entry or seating",
      benefits: ["Standard seating", "Event access", "Basic amenities"]
    },
    {
      id: "economy",
      name: "Economy",
      description: "Affordable, basic services",
      benefits: ["Basic seating", "Event access", "Cost-effective"]
    },
    {
      id: "student",
      name: "Student / Youth / Child",
      description: "Discounted tickets for eligible groups",
      benefits: ["Discounted pricing", "Student ID required", "Youth-friendly pricing"]
    },
    {
      id: "earlybird",
      name: "Early Bird / Advance",
      description: "Tickets purchased before the event at lower prices",
      benefits: ["Lower pricing", "Early access", "Limited time offer"]
    },
    {
      id: "group",
      name: "Group / Family",
      description: "Tickets for multiple people with discounted rates",
      benefits: ["Bulk discount", "Family packages", "Group benefits"]
    },
    {
      id: "standing",
      name: "Standing / Lawn / Balcony",
      description: "For concerts or stadium events, refers to location or type of seating",
      benefits: ["Standing area", "Flexible positioning", "Event atmosphere"]
    },
    {
      id: "allaccess",
      name: "All-Access / Backstage",
      description: "Full access including areas not open to general public",
      benefits: ["Backstage access", "Meet & greet", "Exclusive areas", "Behind-the-scenes"]
    },
    {
      id: "weekend",
      name: "Weekend / Day Pass",
      description: "Tickets valid for specific day(s) rather than the full event",
      benefits: ["Multi-day access", "Flexible scheduling", "Day-specific pricing"]
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between m-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/events">
              <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="text-gray-600 mt-1">
                Set up a new sporting event with all necessary details
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
              <div className="text-sm text-gray-600">
                Step {currentStep} of 4
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="1" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Basic Info</TabsTrigger>
            <TabsTrigger value="2" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Tickets & Pricing</TabsTrigger>
            <TabsTrigger value="3" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Media & Details</TabsTrigger>
            <TabsTrigger value="4" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="1" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm mx-6">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Basic Event Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the essential details for your event
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-medium">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Rwanda vs Ghana - World Cup Qualifier"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sport" className="text-gray-700 font-medium">Sport *</Label>
                    <Select value={formData.sport} onValueChange={(value) => handleSelectChange('sport', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        {sports.map(sport => (
                          <SelectItem key={sport} value={sport} className="text-gray-700">{sport}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-gray-700 font-medium">Event Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-gray-700 font-medium">Event Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue" className="text-gray-700 font-medium">Venue *</Label>
                    <Select value={formData.venue} onValueChange={(value) => handleSelectChange('venue', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select venue" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        {venues.map(venue => (
                          <SelectItem key={venue} value={venue} className="text-gray-700">{venue}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        {categories.map(category => (
                          <SelectItem key={category} value={category} className="text-gray-700">{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">Event Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your event in detail..."
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-gray-700 font-medium">Expected Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 10000"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="draft" className="text-gray-700">Draft</SelectItem>
                        <SelectItem value="published" className="text-gray-700">Published</SelectItem>
                        <SelectItem value="cancelled" className="text-gray-700">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm mx-6">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Ticket className="h-5 w-5 text-green-600" />
                  Ticket Types & Pricing
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Set up different ticket types and their pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                {formData.ticketTypes.map((ticketType, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg text-gray-900">Ticket Type {index + 1}</h4>
                      {formData.ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Ticket Category Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Ticket Category *</Label>
                      <Select 
                        value={ticketType.category} 
                        onValueChange={(value) => handleTicketTypeCategoryChange(index, value)}
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select ticket category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          {ticketTypeCategories.map(category => (
                            <SelectItem key={category.id} value={category.id} className="text-gray-700">
                              <div className="flex flex-col">
                                <span className="font-medium">{category.name}</span>
                                <span className="text-sm text-gray-500">{category.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ticket Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Custom Name (Optional)</Label>
                        <Input
                          value={ticketType.name}
                          onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                          placeholder="e.g., Premium VIP Access"
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Price (RWF) *</Label>
                        <Input
                          type="number"
                          value={ticketType.price}
                          onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                          placeholder="e.g., 5000"
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Quantity Available *</Label>
                        <Input
                          type="number"
                          value={ticketType.quantity}
                          onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                          placeholder="e.g., 100"
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    {/* Description and Benefits */}
                    {ticketType.description && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">Description</Label>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {ticketType.description}
                          </p>
                        </div>
                        
                        {ticketType.benefits && ticketType.benefits.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Included Benefits</Label>
                            <div className="flex flex-wrap gap-2">
                              {ticketType.benefits.map((benefit, benefitIndex) => (
                                <Badge 
                                  key={benefitIndex} 
                                  variant="secondary" 
                                  className="bg-green-100 text-green-800 border-green-200"
                                >
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTicketType}
                    className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Ticket Type
                  </Button>
                  
                  {/* Help Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">💡 Ticket Type Tips</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>VIP tickets</strong> are perfect for premium experiences with exclusive benefits</li>
                      <li>• <strong>Early Bird</strong> tickets encourage early purchases with discounted pricing</li>
                      <li>• <strong>Group/Family</strong> tickets offer bulk discounts for multiple attendees</li>
                      <li>• <strong>Student/Youth</strong> tickets provide affordable options for younger audiences</li>
                      <li>• Mix different categories to cater to various customer segments</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="3" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm mx-6">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  Media & Additional Details
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Add images and additional information for your event
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium">Event Thumbnail</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="thumbnail" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-green-600" />
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                        </div>
                        <input 
                          id="thumbnail" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Thumbnail preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, thumbnail: null }))
                            setPreviewUrl(null)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="4" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm mx-6">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="h-5 w-5 text-green-600" />
                  Event Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure additional settings for your event
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Refunds</Label>
                      <p className="text-sm text-gray-600">
                        Allow customers to request refunds for this event
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.allowRefunds}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowRefunds: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Require Approval</Label>
                      <p className="text-sm text-gray-600">
                        Require admin approval for ticket purchases
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.requireApproval}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requireApproval: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Max Tickets Per User</Label>
                    <Input
                      type="number"
                      value={formData.settings.maxTicketsPerUser}
                      onChange={(e) => 
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, maxTicketsPerUser: parseInt(e.target.value) }
                        }))
                      }
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Early Bird Discount</Label>
                      <p className="text-sm text-gray-600">
                        Offer early bird pricing for this event
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.earlyBirdDiscount}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, earlyBirdDiscount: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Group Discount</Label>
                      <p className="text-sm text-gray-600">
                        Offer group discounts for bulk purchases
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.groupDiscount}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, groupDiscount: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="bg-white border border-gray-100 shadow-sm mx-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                Previous
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                  Save as Draft
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                >
                  {currentStep === 4 ? 'Create Event' : 'Next'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminCreateEvent, ['admin'])
