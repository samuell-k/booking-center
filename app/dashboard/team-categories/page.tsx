"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Settings, 
  TrendingUp, 
  Users, 
  Trophy, 
  X, 
  Save, 
  Calendar,
  BarChart3,
  Star,
  Shield
} from "lucide-react"

function AdminTeamCategories() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isEditFormSliding, setIsEditFormSliding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'Trophy',
    status: 'active',
    sortOrder: 0,
    requirements: '',
    maxTeams: 0,
    minTeams: 0
  })

  // Mock categories data
  const categories = [
    {
      id: 1,
      name: "Premier League",
      description: "Top-tier professional teams with highest competition level",
      color: "#EF4444",
      icon: "Trophy",
      status: "active",
      sortOrder: 1,
      requirements: "Professional license, minimum 25 players",
      maxTeams: 20,
      minTeams: 16,
      teamCount: 18,
      createdAt: "2024-01-15",
      updatedAt: "2025-01-10"
    },
    {
      id: 2,
      name: "Championship",
      description: "Second-tier professional teams aspiring for promotion",
      color: "#F59E0B",
      icon: "Star",
      status: "active",
      sortOrder: 2,
      requirements: "Semi-professional license, minimum 20 players",
      maxTeams: 24,
      minTeams: 20,
      teamCount: 22,
      createdAt: "2024-01-15",
      updatedAt: "2025-01-08"
    },
    {
      id: 3,
      name: "League One",
      description: "Third-tier professional and amateur teams",
      color: "#10B981",
      icon: "Users",
      status: "active",
      sortOrder: 3,
      requirements: "Amateur license, minimum 15 players",
      maxTeams: 24,
      minTeams: 18,
      teamCount: 20,
      createdAt: "2024-01-15",
      updatedAt: "2025-01-05"
    },
    {
      id: 4,
      name: "Youth League",
      description: "Teams for players under 21 years old",
      color: "#8B5CF6",
      icon: "Shield",
      status: "active",
      sortOrder: 4,
      requirements: "Youth registration, ages 16-21",
      maxTeams: 16,
      minTeams: 12,
      teamCount: 14,
      createdAt: "2024-02-01",
      updatedAt: "2025-01-12"
    },
    {
      id: 5,
      name: "Women's League",
      description: "Professional women's teams and competitions",
      color: "#EC4899",
      icon: "Trophy",
      status: "active",
      sortOrder: 5,
      requirements: "Women's team registration, minimum 18 players",
      maxTeams: 12,
      minTeams: 8,
      teamCount: 10,
      createdAt: "2024-03-01",
      updatedAt: "2025-01-15"
    },
    {
      id: 6,
      name: "Community League",
      description: "Local community and recreational teams",
      color: "#6B7280",
      icon: "Users",
      status: "inactive",
      sortOrder: 6,
      requirements: "Community registration, flexible requirements",
      maxTeams: 30,
      minTeams: 10,
      teamCount: 0,
      createdAt: "2024-01-20",
      updatedAt: "2024-12-15"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'inactive': return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="h-4 w-4" />
      case 'Star': return <Star className="h-4 w-4" />
      case 'Users': return <Users className="h-4 w-4" />
      case 'Shield': return <Shield className="h-4 w-4" />
      default: return <Tag className="h-4 w-4" />
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateCategory = () => {
    console.log('Creating category:', formData)
    setIsFormSliding(false)
    setTimeout(() => {
      setIsAddCategoryOpen(false)
      setFormData({ 
        name: '', 
        description: '', 
        color: '#3B82F6', 
        icon: 'Trophy', 
        status: 'active', 
        sortOrder: 0, 
        requirements: '', 
        maxTeams: 0, 
        minTeams: 0 
      })
    }, 500)
  }

  const openCreateDialog = () => {
    setIsAddCategoryOpen(true)
    setTimeout(() => setIsFormSliding(true), 50)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    setTimeout(() => setIsAddCategoryOpen(false), 500)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      status: category.status,
      sortOrder: category.sortOrder,
      requirements: category.requirements,
      maxTeams: category.maxTeams,
      minTeams: category.minTeams
    })
    setIsEditCategoryOpen(true)
    setTimeout(() => setIsEditFormSliding(true), 50)
  }

  const closeEditDialog = () => {
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditCategoryOpen(false)
      setEditingCategory(null)
    }, 500)
  }

  const handleUpdateCategory = () => {
    console.log('Updating category:', editingCategory?.id, formData)
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditCategoryOpen(false)
      setEditingCategory(null)
    }, 500)
  }

  const handleDeleteCategory = (categoryId: number) => {
    console.log('Deleting category:', categoryId)
  }

  const handleToggleStatus = (categoryId: number) => {
    console.log('Toggling status for category:', categoryId)
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || category.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCategories = categories.length
  const activeCategories = categories.filter(cat => cat.status === 'active').length
  const totalTeams = categories.reduce((sum, cat) => sum + cat.teamCount, 0)
  const averageTeamsPerCategory = totalTeams / totalCategories

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Categories</h1>
            <p className="text-gray-600 mt-1">Manage team categories and competition levels</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+2 this month</span>
                  </div>
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
                  <p className="text-2xl font-bold text-gray-900">{activeCategories}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Competing</span>
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Registered</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Teams/Category</p>
                  <p className="text-2xl font-bold text-gray-900">{averageTeamsPerCategory.toFixed(1)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Distribution</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

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
            <CardTitle className="text-gray-900">All Categories ({filteredCategories.length})</CardTitle>
            <CardDescription className="text-gray-600">Manage team categories and their settings</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Description</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Teams</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Requirements</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Sort Order</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="bg-white hover:bg-gray-50">
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            {getIconComponent(category.icon)}
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-500">ID: {category.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <p className="text-sm max-w-xs truncate">{category.description}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(category.status)}</TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{category.teamCount}</span>
                          <span className="text-xs text-gray-500">/ {category.maxTeams}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <p className="text-sm max-w-xs truncate">{category.requirements}</p>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          {category.sortOrder}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-gray-100" 
                            title="Edit Category"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-100 text-red-600" 
                            title={category.status === 'active' ? 'Deactivate' : 'Activate'}
                            onClick={() => handleToggleStatus(category.id)}
                          >
                            {category.status === 'active' ? <X className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-100 text-red-600" 
                            title="Delete Category"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryOpen} onOpenChange={(open) => {
          if (!open) closeCreateDialog()
        }}>
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
                  <DialogTitle className="text-gray-900">Add New Category</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new team category with specific requirements
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
                    placeholder="e.g., Premier League"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-gray-700 font-medium">Color *</Label>
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the category..."
                  rows={3}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-gray-700 font-medium">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => handleSelectChange('icon', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="Trophy">Trophy</SelectItem>
                      <SelectItem value="Star">Star</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Shield">Shield</SelectItem>
                      <SelectItem value="Tag">Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-gray-700 font-medium">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minTeams" className="text-gray-700 font-medium">Min Teams</Label>
                  <Input
                    id="minTeams"
                    name="minTeams"
                    type="number"
                    value={formData.minTeams}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTeams" className="text-gray-700 font-medium">Max Teams</Label>
                  <Input
                    id="maxTeams"
                    name="maxTeams"
                    type="number"
                    value={formData.maxTeams}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-gray-700 font-medium">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Specific requirements for teams in this category..."
                  rows={3}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeCreateDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryOpen} onOpenChange={(open) => {
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
                    Update category information and settings
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
                    placeholder="e.g., Premier League"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color" className="text-gray-700 font-medium">Color *</Label>
                  <Input
                    id="edit-color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-gray-700 font-medium">Description *</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the category..."
                  rows={3}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-icon" className="text-gray-700 font-medium">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => handleSelectChange('icon', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="Trophy">Trophy</SelectItem>
                      <SelectItem value="Star">Star</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Shield">Shield</SelectItem>
                      <SelectItem value="Tag">Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-gray-700 font-medium">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-sortOrder" className="text-gray-700 font-medium">Sort Order</Label>
                  <Input
                    id="edit-sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minTeams" className="text-gray-700 font-medium">Min Teams</Label>
                  <Input
                    id="edit-minTeams"
                    name="minTeams"
                    type="number"
                    value={formData.minTeams}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxTeams" className="text-gray-700 font-medium">Max Teams</Label>
                  <Input
                    id="edit-maxTeams"
                    name="maxTeams"
                    type="number"
                    value={formData.maxTeams}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-requirements" className="text-gray-700 font-medium">Requirements</Label>
                <Textarea
                  id="edit-requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Specific requirements for teams in this category..."
                  rows={3}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
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

export default withAuth(AdminTeamCategories, ['admin'])
