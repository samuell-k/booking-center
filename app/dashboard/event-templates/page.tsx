"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Copy, Edit, Trash2, Eye, Download, Upload, Settings, Calendar, Users, DollarSign, BarChart3, X } from 'lucide-react'

export default function EventTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isEditFormSliding, setIsEditFormSliding] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    eventType: '',
    duration: '',
    capacity: '',
    pricing: '',
    features: [],
    isActive: true,
    isPublic: false,
    tags: []
  })

  // Mock data
  const templates = [
    {
      id: 1,
      name: 'Football Match Template',
      description: 'Standard template for football matches with seating, pricing, and timing',
      category: 'Sports',
      eventType: 'Match',
      duration: '90 minutes',
      capacity: '50000',
      pricing: 'Tiered',
      features: ['Seating Chart', 'Pricing Tiers', 'Time Slots', 'Weather Backup'],
      isActive: true,
      isPublic: true,
      tags: ['sports', 'football', 'stadium'],
      createdAt: '2024-01-15',
      usageCount: 45,
      author: 'Admin User'
    },
    {
      id: 2,
      name: 'Concert Template',
      description: 'Template for music concerts with stage setup and audio requirements',
      category: 'Entertainment',
      eventType: 'Concert',
      duration: '3 hours',
      capacity: '25000',
      pricing: 'General Admission',
      features: ['Stage Setup', 'Audio System', 'Lighting', 'Security'],
      isActive: true,
      isPublic: true,
      tags: ['music', 'concert', 'entertainment'],
      createdAt: '2024-01-10',
      usageCount: 23,
      author: 'Admin User'
    },
    {
      id: 3,
      name: 'Conference Template',
      description: 'Professional conference template with sessions and networking',
      category: 'Business',
      eventType: 'Conference',
      duration: '8 hours',
      capacity: '500',
      pricing: 'Early Bird',
      features: ['Session Rooms', 'Networking', 'Catering', 'Materials'],
      isActive: true,
      isPublic: false,
      tags: ['business', 'conference', 'professional'],
      createdAt: '2024-01-05',
      usageCount: 12,
      author: 'Admin User'
    }
  ]

  const stats = [
    { title: 'Total Templates', value: '24', change: '+12%', icon: Copy },
    { title: 'Active Templates', value: '18', change: '+8%', icon: Calendar },
    { title: 'Public Templates', value: '15', change: '+15%', icon: Users },
    { title: 'Total Usage', value: '1,234', change: '+25%', icon: BarChart3 }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleCreateTemplate = () => {
    console.log('Creating template:', formData)
    setIsFormSliding(false)
    setTimeout(() => {
      setIsCreateDialogOpen(false)
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        eventType: '',
        duration: '',
        capacity: '',
        pricing: '',
        features: [],
        isActive: true,
        isPublic: false,
        tags: []
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

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      eventType: template.eventType,
      duration: template.duration,
      capacity: template.capacity,
      pricing: template.pricing,
      features: template.features,
      isActive: template.isActive,
      isPublic: template.isPublic,
      tags: template.tags
    })
    setIsEditDialogOpen(true)
    setTimeout(() => setIsEditFormSliding(true), 50)
  }

  const closeEditDialog = () => {
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditDialogOpen(false)
      setEditingTemplate(null)
    }, 500)
  }

  const handleUpdateTemplate = () => {
    console.log('Updating template:', editingTemplate?.id, formData)
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditDialogOpen(false)
      setEditingTemplate(null)
    }, 500)
  }

  const handleDeleteTemplate = (templateId: number) => {
    console.log('Deleting template:', templateId)
  }

  const handleCopyTemplate = (template: any) => {
    console.log('Copying template:', template.id)
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && template.isActive) ||
                         (filterStatus === 'inactive' && !template.isActive) ||
                         (filterStatus === 'public' && template.isPublic)
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Templates</h1>
            <p className="text-gray-600 mt-1">Manage and create reusable event templates</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              if (!open) closeCreateDialog()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
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
                      <DialogTitle className="text-gray-900">Create New Template</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Create a reusable event template with predefined settings
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
                      <Label htmlFor="name" className="text-gray-700 font-medium">Template Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter template name"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
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
                      placeholder="Enter template description"
                      rows={3}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType" className="text-gray-700 font-medium">Event Type</Label>
                      <Select value={formData.eventType} onValueChange={(value) => handleSelectChange('eventType', value)}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200">
                          <SelectItem value="match">Match</SelectItem>
                          <SelectItem value="concert">Concert</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-gray-700 font-medium">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 90 minutes"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-gray-700 font-medium">Capacity</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 50000"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricing" className="text-gray-700 font-medium">Pricing Model</Label>
                    <Select value={formData.pricing} onValueChange={(value) => handleSelectChange('pricing', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="tiered">Tiered Pricing</SelectItem>
                        <SelectItem value="general">General Admission</SelectItem>
                        <SelectItem value="early-bird">Early Bird</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Label htmlFor="isPublic" className="text-gray-700 font-medium">Public Template</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={closeCreateDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                      Create Template
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">Templates ({filteredTemplates.length})</CardTitle>
            <CardDescription className="text-gray-600">
              Manage your event templates and their settings
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">Template</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Capacity</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Usage</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="bg-white hover:bg-gray-50">
                    <TableCell className="text-gray-900">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                        <div className="flex gap-1 mt-1">
                          {template.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">{template.category}</TableCell>
                    <TableCell className="text-gray-900">{template.eventType}</TableCell>
                    <TableCell className="text-gray-900">{template.capacity}</TableCell>
                    <TableCell className="text-gray-900">
                      <div className="text-sm">
                        <div className="font-medium">{template.usageCount} times</div>
                        <div className="text-gray-500">by {template.author}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge className={template.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {template.isPublic && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">Public</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyTemplate(template)}
                          className="hover:bg-gray-100"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
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
                  <DialogTitle className="text-gray-900">Edit Template</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update the template information and settings
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
                  <Label htmlFor="edit-name" className="text-gray-700 font-medium">Template Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter template name"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-gray-700 font-medium">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
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
                  placeholder="Enter template description"
                  rows={3}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-eventType" className="text-gray-700 font-medium">Event Type</Label>
                  <Select value={formData.eventType} onValueChange={(value) => handleSelectChange('eventType', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="match">Match</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration" className="text-gray-700 font-medium">Duration</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 90 minutes"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity" className="text-gray-700 font-medium">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pricing" className="text-gray-700 font-medium">Pricing Model</Label>
                <Select value={formData.pricing} onValueChange={(value) => handleSelectChange('pricing', value)}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="tiered">Tiered Pricing</SelectItem>
                    <SelectItem value="general">General Admission</SelectItem>
                    <SelectItem value="early-bird">Early Bird</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Label htmlFor="edit-isPublic" className="text-gray-700 font-medium">Public Template</Label>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeEditDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateTemplate} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  Update Template
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
