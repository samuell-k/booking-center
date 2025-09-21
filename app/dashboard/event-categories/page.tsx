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
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  MoreHorizontal,
  X,
  Save,
  AlertCircle
} from 'lucide-react'

function AdminEventCategories() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isEditFormSliding, setIsEditFormSliding] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '🏆',
    isActive: true,
    sortOrder: 0,
    parentCategory: '',
    settings: {
      allowSubcategories: true,
      requireApproval: false,
      maxEventsPerCategory: 100,
      allowCustomPricing: true
    }
  })

  // Mock categories data
  const categories = [
    {
      id: 1,
      name: 'Football',
      description: 'Football matches and tournaments',
      color: '#10B981',
      icon: '⚽',
      isActive: true,
      sortOrder: 1,
      parentCategory: null,
      eventCount: 45,
      totalRevenue: 2500000,
      lastUpdated: '2024-03-15',
      settings: {
        allowSubcategories: true,
        requireApproval: false,
        maxEventsPerCategory: 100,
        allowCustomPricing: true
      }
    },
    {
      id: 2,
      name: 'Basketball',
      description: 'Basketball games and competitions',
      color: '#F59E0B',
      icon: '🏀',
      isActive: true,
      sortOrder: 2,
      parentCategory: null,
      eventCount: 23,
      totalRevenue: 1200000,
      lastUpdated: '2024-03-14',
      settings: {
        allowSubcategories: true,
        requireApproval: false,
        maxEventsPerCategory: 50,
        allowCustomPricing: true
      }
    },
    {
      id: 3,
      name: 'Volleyball',
      description: 'Volleyball matches and tournaments',
      color: '#3B82F6',
      icon: '🏐',
      isActive: true,
      sortOrder: 3,
      parentCategory: null,
      eventCount: 18,
      totalRevenue: 800000,
      lastUpdated: '2024-03-13',
      settings: {
        allowSubcategories: false,
        requireApproval: true,
        maxEventsPerCategory: 30,
        allowCustomPricing: false
      }
    },
    {
      id: 4,
      name: 'Tennis',
      description: 'Tennis tournaments and matches',
      color: '#8B5CF6',
      icon: '🎾',
      isActive: true,
      sortOrder: 4,
      parentCategory: null,
      eventCount: 12,
      totalRevenue: 600000,
      lastUpdated: '2024-03-12',
      settings: {
        allowSubcategories: true,
        requireApproval: false,
        maxEventsPerCategory: 25,
        allowCustomPricing: true
      }
    },
    {
      id: 5,
      name: 'Rugby',
      description: 'Rugby matches and competitions',
      color: '#EF4444',
      icon: '🏉',
      isActive: false,
      sortOrder: 5,
      parentCategory: null,
      eventCount: 8,
      totalRevenue: 400000,
      lastUpdated: '2024-03-10',
      settings: {
        allowSubcategories: false,
        requireApproval: true,
        maxEventsPerCategory: 20,
        allowCustomPricing: true
      }
    },
    {
      id: 6,
      name: 'Youth Football',
      description: 'Youth and junior football events',
      color: '#10B981',
      icon: '⚽',
      isActive: true,
      sortOrder: 6,
      parentCategory: 'Football',
      eventCount: 15,
      totalRevenue: 300000,
      lastUpdated: '2024-03-11',
      settings: {
        allowSubcategories: false,
        requireApproval: true,
        maxEventsPerCategory: 40,
        allowCustomPricing: false
      }
    }
  ]

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.isActive) ||
                         (statusFilter === 'inactive' && !category.isActive)
    
    return matchesSearch && matchesStatus
  })

  const activeCategories = categories.filter(cat => cat.isActive)
  const totalEvents = categories.reduce((sum, cat) => sum + cat.eventCount, 0)
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.totalRevenue, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: checked
      }
    }))
  }

  const handleCreateCategory = () => {
    console.log('Creating category:', formData)
    // Start closing animation
    setIsFormSliding(false)
    // Close dialog after animation completes
    setTimeout(() => {
      setIsCreateDialogOpen(false)
      // Reset form
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: '🏆',
        isActive: true,
        sortOrder: 0,
        parentCategory: '',
        settings: {
          allowSubcategories: true,
          requireApproval: false,
          maxEventsPerCategory: 100,
          allowCustomPricing: true
        }
      })
    }, 500)
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
    // Start animation immediately when dialog opens
    setTimeout(() => setIsFormSliding(true), 50)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    // Close dialog after animation completes
    setTimeout(() => setIsCreateDialogOpen(false), 500)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentCategory: category.parentCategory || '',
      settings: category.settings
    })
    setIsEditDialogOpen(true)
    // Start animation immediately when dialog opens
    setTimeout(() => setIsEditFormSliding(true), 50)
  }

  const closeEditDialog = () => {
    setIsEditFormSliding(false)
    // Close dialog after animation completes
    setTimeout(() => {
      setIsEditDialogOpen(false)
      setEditingCategory(null)
    }, 500)
  }

  const handleUpdateCategory = () => {
    console.log('Updating category:', editingCategory?.id, formData)
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditDialogOpen(false)
      setEditingCategory(null)
    }, 500)
  }

  const handleDeleteCategory = (categoryId: number) => {
    console.log('Deleting category:', categoryId)
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800">Active</Badge> : 
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Categories</h1>
            <p className="text-gray-600 mt-1">
              Manage event categories and their settings
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          if (!open) closeCreateDialog()
        }}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
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
                      <DialogTitle className="text-gray-900">Create New Category</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Add a new event category to organize your events
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
                      <Label htmlFor="name" className="text-gray-700 font-medium">Category Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Football"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon" className="text-gray-700 font-medium">Icon</Label>
                      <Input
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        placeholder="🏆"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe this category..."
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-gray-700 font-medium">Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="color"
                          name="color"
                          type="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={formData.color}
                          onChange={handleInputChange}
                          className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sortOrder" className="text-gray-700 font-medium">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        name="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Category Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-gray-700 font-medium">Allow Subcategories</Label>
                          <p className="text-sm text-gray-600">
                            Allow this category to have subcategories
                          </p>
                        </div>
                        <Switch
                          checked={formData.settings.allowSubcategories}
                          onCheckedChange={(checked) => handleSwitchChange('allowSubcategories', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-gray-700 font-medium">Require Approval</Label>
                          <p className="text-sm text-gray-600">
                            Events in this category require admin approval
                          </p>
                        </div>
                        <Switch
                          checked={formData.settings.requireApproval}
                          onCheckedChange={(checked) => handleSwitchChange('requireApproval', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-gray-700 font-medium">Allow Custom Pricing</Label>
                          <p className="text-sm text-gray-600">
                            Allow custom pricing for events in this category
                          </p>
                        </div>
                        <Switch
                          checked={formData.settings.allowCustomPricing}
                          onCheckedChange={(checked) => handleSwitchChange('allowCustomPricing', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={closeCreateDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCategory} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Create Category
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
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <Tag className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCategories.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
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
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{(totalRevenue / 1000000).toFixed(1)}M RWF</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
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
                  placeholder="Search categories..."
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

        {/* Categories Table */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">Event Categories</CardTitle>
            <CardDescription className="text-gray-600">
              Manage and organize your event categories
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Description</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Events</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Revenue</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Last Updated</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id} className="bg-white hover:bg-gray-50">
                    <TableCell className="text-gray-900">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {category.parentCategory && (
                            <div className="text-sm text-gray-500">
                              Subcategory of {category.parentCategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="max-w-xs truncate">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="text-center">
                        <div className="font-medium">{category.eventCount}</div>
                        <div className="text-xs text-gray-500">events</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="text-right">
                        <div className="font-medium">{(category.totalRevenue / 1000).toFixed(0)}K RWF</div>
                        <div className="text-xs text-gray-500">total</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(category.isActive)}</TableCell>
                    <TableCell className="text-gray-900">{category.lastUpdated}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="hover:bg-gray-100">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
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
                  <DialogTitle className="text-gray-900">Edit Category</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update the category information and settings
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
                  <Label htmlFor="edit-name" className="text-gray-700 font-medium">Category Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-icon" className="text-gray-700 font-medium">Icon</Label>
                  <Input
                    id="edit-icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-color" className="text-gray-700 font-medium">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit-color"
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sortOrder" className="text-gray-700 font-medium">Sort Order</Label>
                  <Input
                    id="edit-sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeEditDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateCategory} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update Category
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminEventCategories, ['admin'])
