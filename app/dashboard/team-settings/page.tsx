"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell, 
  Users, 
  Trophy, 
  Calendar, 
  DollarSign, 
  FileText, 
  Lock, 
  Globe, 
  Mail, 
  MessageCircle, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Download,
  Copy,
  Share,
  Tag
} from "lucide-react"

function TeamSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "SmartSports RW",
    platformDescription: "Rwanda's premier sports management platform",
    timezone: "Africa/Kigali",
    currency: "RWF",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    
    // Team Settings
    allowTeamRegistration: true,
    requireTeamApproval: true,
    maxTeamsPerUser: 3,
    teamRegistrationFee: 50000,
    allowTeamDeletion: false,
    teamNameMinLength: 3,
    teamNameMaxLength: 50,
    
    // Member Settings
    allowMemberInvites: true,
    requireMemberApproval: true,
    maxMembersPerTeam: 30,
    allowMemberSelfRegistration: false,
    memberRolePermissions: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    teamUpdates: true,
    matchReminders: true,
    paymentAlerts: true,
    systemMaintenance: true,
    
    // Security Settings
    requireTwoFactor: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPasswords: true,
    allowPasswordReset: true,
    maxLoginAttempts: 5,
    
    // Payment Settings
    paymentMethods: ["mobile_money", "bank_transfer", "card"],
    transactionFee: 2.5,
    minimumPayment: 1000,
    maximumPayment: 10000000,
    autoRefund: false,
    refundPeriod: 7,
    
    // Match Settings
    allowMatchCreation: true,
    requireMatchApproval: true,
    maxMatchesPerDay: 5,
    matchDuration: 90,
    allowMatchCancellation: true,
    cancellationDeadline: 24,
    
    // Reporting Settings
    generateReports: true,
    reportRetention: 365,
    allowDataExport: true,
    anonymizeData: false,
    shareAnalytics: true
  })

  const [teamCategories, setTeamCategories] = useState([
    { id: 1, name: "Premier League", status: "active", color: "#EF4444" },
    { id: 2, name: "Championship", status: "active", color: "#F59E0B" },
    { id: 3, name: "League One", status: "active", color: "#10B981" },
    { id: 4, name: "Youth League", status: "active", color: "#8B5CF6" },
    { id: 5, name: "Women's League", status: "active", color: "#EC4899" }
  ])

  const [permissions, setPermissions] = useState([
    { id: 1, name: "Create Teams", description: "Allow users to create new teams", enabled: true, role: "admin" },
    { id: 2, name: "Edit Teams", description: "Allow users to edit team information", enabled: true, role: "admin" },
    { id: 3, name: "Delete Teams", description: "Allow users to delete teams", enabled: false, role: "admin" },
    { id: 4, name: "Manage Members", description: "Allow team managers to manage members", enabled: true, role: "manager" },
    { id: 5, name: "View Analytics", description: "Allow users to view team analytics", enabled: true, role: "member" },
    { id: 6, name: "Create Matches", description: "Allow teams to create matches", enabled: true, role: "manager" },
    { id: 7, name: "Manage Finances", description: "Allow financial management", enabled: false, role: "admin" },
    { id: 8, name: "Export Data", description: "Allow data export functionality", enabled: true, role: "admin" }
  ])

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [field]: checked }))
  }

  const handlePermissionToggle = (id: number) => {
    setPermissions(prev => 
      prev.map(perm => 
        perm.id === id ? { ...perm, enabled: !perm.enabled } : perm
      )
    )
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Saving settings:', settings)
      console.log('Saving permissions:', permissions)
      console.log('Saving categories:', teamCategories)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'inactive': return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Settings</h1>
            <p className="text-gray-600 mt-1">Configure team management and platform settings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-6 h-auto bg-white border border-gray-200">
            <TabsTrigger value="general" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">General</TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Teams</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Members</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Security</TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Permissions</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="h-5 w-5 text-green-600" />
                  Platform Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure basic platform information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="platformName" className="text-gray-700 font-medium">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) => handleInputChange('platformName', e.target.value)}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="Africa/Kigali">Africa/Kigali</SelectItem>
                        <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platformDescription" className="text-gray-700 font-medium">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={settings.platformDescription}
                    onChange={(e) => handleInputChange('platformDescription', e.target.value)}
                    rows={3}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-700 font-medium">Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="RWF">RWF (Rwandan Franc)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-700 font-medium">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="rw">Kinyarwanda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat" className="text-gray-700 font-medium">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => handleInputChange('dateFormat', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="teams" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Team Management Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure team registration and management rules
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Team Registration</Label>
                      <p className="text-sm text-gray-600">Allow users to register new teams</p>
                    </div>
                    <Switch
                      checked={settings.allowTeamRegistration}
                      onCheckedChange={(checked) => handleSwitchChange('allowTeamRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Require Team Approval</Label>
                      <p className="text-sm text-gray-600">Teams must be approved before becoming active</p>
                    </div>
                    <Switch
                      checked={settings.requireTeamApproval}
                      onCheckedChange={(checked) => handleSwitchChange('requireTeamApproval', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Team Deletion</Label>
                      <p className="text-sm text-gray-600">Allow users to delete their teams</p>
                    </div>
                    <Switch
                      checked={settings.allowTeamDeletion}
                      onCheckedChange={(checked) => handleSwitchChange('allowTeamDeletion', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxTeamsPerUser" className="text-gray-700 font-medium">Max Teams Per User</Label>
                    <Input
                      id="maxTeamsPerUser"
                      type="number"
                      value={settings.maxTeamsPerUser}
                      onChange={(e) => handleInputChange('maxTeamsPerUser', parseInt(e.target.value))}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamRegistrationFee" className="text-gray-700 font-medium">Team Registration Fee (RWF)</Label>
                    <Input
                      id="teamRegistrationFee"
                      type="number"
                      value={settings.teamRegistrationFee}
                      onChange={(e) => handleInputChange('teamRegistrationFee', parseInt(e.target.value))}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamNameMinLength" className="text-gray-700 font-medium">Team Name Min Length</Label>
                    <Input
                      id="teamNameMinLength"
                      type="number"
                      value={settings.teamNameMinLength}
                      onChange={(e) => handleInputChange('teamNameMinLength', parseInt(e.target.value))}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamNameMaxLength" className="text-gray-700 font-medium">Team Name Max Length</Label>
                    <Input
                      id="teamNameMaxLength"
                      type="number"
                      value={settings.teamNameMaxLength}
                      onChange={(e) => handleInputChange('teamNameMaxLength', parseInt(e.target.value))}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Categories Management */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Tag className="h-5 w-5 text-green-600" />
                      Team Categories
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage team categories and their settings
                    </CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {teamCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-600">Category ID: {category.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(category.status)}
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-red-100 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Member Settings */}
          <TabsContent value="members" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="h-5 w-5 text-green-600" />
                  Member Management Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure team member management and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Member Invites</Label>
                      <p className="text-sm text-gray-600">Allow team managers to invite new members</p>
                    </div>
                    <Switch
                      checked={settings.allowMemberInvites}
                      onCheckedChange={(checked) => handleSwitchChange('allowMemberInvites', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Require Member Approval</Label>
                      <p className="text-sm text-gray-600">New members must be approved by team managers</p>
                    </div>
                    <Switch
                      checked={settings.requireMemberApproval}
                      onCheckedChange={(checked) => handleSwitchChange('requireMemberApproval', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Member Self Registration</Label>
                      <p className="text-sm text-gray-600">Allow members to join teams without invitation</p>
                    </div>
                    <Switch
                      checked={settings.allowMemberSelfRegistration}
                      onCheckedChange={(checked) => handleSwitchChange('allowMemberSelfRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Member Role Permissions</Label>
                      <p className="text-sm text-gray-600">Enable role-based permissions for team members</p>
                    </div>
                    <Switch
                      checked={settings.memberRolePermissions}
                      onCheckedChange={(checked) => handleSwitchChange('memberRolePermissions', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembersPerTeam" className="text-gray-700 font-medium">Max Members Per Team</Label>
                  <Input
                    id="maxMembersPerTeam"
                    type="number"
                    value={settings.maxMembersPerTeam}
                    onChange={(e) => handleInputChange('maxMembersPerTeam', parseInt(e.target.value))}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Bell className="h-5 w-5 text-green-600" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure notification preferences and delivery methods
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Delivery Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Send push notifications to mobile devices</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Team Updates</Label>
                        <p className="text-sm text-gray-600">Notify about team changes and updates</p>
                      </div>
                      <Switch
                        checked={settings.teamUpdates}
                        onCheckedChange={(checked) => handleSwitchChange('teamUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Match Reminders</Label>
                        <p className="text-sm text-gray-600">Send reminders before matches</p>
                      </div>
                      <Switch
                        checked={settings.matchReminders}
                        onCheckedChange={(checked) => handleSwitchChange('matchReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Payment Alerts</Label>
                        <p className="text-sm text-gray-600">Notify about payment activities</p>
                      </div>
                      <Switch
                        checked={settings.paymentAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('paymentAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">System Maintenance</Label>
                        <p className="text-sm text-gray-600">Notify about system maintenance and updates</p>
                      </div>
                      <Switch
                        checked={settings.systemMaintenance}
                        onCheckedChange={(checked) => handleSwitchChange('systemMaintenance', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure security policies and authentication requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Require Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Force users to enable 2FA for enhanced security</p>
                    </div>
                    <Switch
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => handleSwitchChange('requireTwoFactor', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Allow Password Reset</Label>
                      <p className="text-sm text-gray-600">Allow users to reset their passwords</p>
                    </div>
                    <Switch
                      checked={settings.allowPasswordReset}
                      onCheckedChange={(checked) => handleSwitchChange('allowPasswordReset', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Require Strong Passwords</Label>
                      <p className="text-sm text-gray-600">Enforce strong password requirements</p>
                    </div>
                    <Switch
                      checked={settings.requireStrongPasswords}
                      onCheckedChange={(checked) => handleSwitchChange('requireStrongPasswords', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="text-gray-700 font-medium">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength" className="text-gray-700 font-medium">Password Min Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts" className="text-gray-700 font-medium">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Settings */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Lock className="h-5 w-5 text-green-600" />
                  Permission Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure role-based permissions and access control
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{permission.name}</div>
                        <div className="text-sm text-gray-600">{permission.description}</div>
                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                          {permission.role}
                        </Badge>
                      </div>
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(TeamSettingsPage, ['admin'])
