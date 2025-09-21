"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, X, Plus, Users, MapPin, Calendar, Trophy, Star, Shield, Settings } from "lucide-react"

function CreateTeamPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    league: '',
    founded: '',
    location: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    status: 'active',
    isPublic: true,
    autoApproveMatches: true,
    allowPublicRegistration: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Creating team:', formData)
      
      // Redirect back to teams list
      router.push('/dashboard/teams')
    } catch (error) {
      console.error('Error creating team:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/teams')
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Team</h1>
              <p className="text-gray-600 mt-1">Add a new team to the platform</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="bg-white border-gray-200 hover:bg-gray-50">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Team
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Trophy className="h-5 w-5 text-green-600" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Essential team details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Team Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., APR FC"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-gray-700 font-medium">Sport *</Label>
                  <Select value={formData.sport} onValueChange={(value) => handleSelectChange('sport', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Hockey">Hockey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="league" className="text-gray-700 font-medium">League *</Label>
                  <Input
                    id="league"
                    name="league"
                    value={formData.league}
                    onChange={handleInputChange}
                    placeholder="e.g., Rwanda Premier League"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded" className="text-gray-700 font-medium">Founded Year</Label>
                  <Input
                    id="founded"
                    name="founded"
                    type="number"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g., 1993"
                    min="1800"
                    max="2025"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Team Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the team, history, achievements..."
                  rows={4}
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-green-600" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Team contact details and communication
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., contact@team.com"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +250 788 123 456"
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
                  placeholder="e.g., https://www.team.com"
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MapPin className="h-5 w-5 text-green-600" />
                Location Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Team location and venue details
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Kigali, Rwanda"
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Settings */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Settings className="h-5 w-5 text-green-600" />
                Team Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure team behavior and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700 font-medium">Team Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Team Permissions</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Public Team Profile</Label>
                      <p className="text-sm text-gray-600">
                        Make team profile visible to all users
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.isPublic}
                      onChange={(e) => handleCheckboxChange('isPublic', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Auto-approve Matches</Label>
                      <p className="text-sm text-gray-600">
                        Automatically approve match requests for this team
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.autoApproveMatches}
                      onChange={(e) => handleCheckboxChange('autoApproveMatches', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Public Registration</Label>
                      <p className="text-sm text-gray-600">
                        Allow users to join this team without approval
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.allowPublicRegistration}
                      onChange={(e) => handleCheckboxChange('allowPublicRegistration', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Logo Upload */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Upload className="h-5 w-5 text-green-600" />
                Team Logo
              </CardTitle>
              <CardDescription className="text-gray-600">
                Upload team logo and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Upload Team Logo</p>
                  <p className="text-sm text-gray-600">
                    Drag and drop your logo here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, SVG up to 10MB
                  </p>
                </div>
                <Button type="button" variant="outline" className="mt-4 bg-white border-gray-200 hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(CreateTeamPage, ['admin'])
