"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  Upload, 
  Mail, 
  Phone, 
  MapPin, 
  RefreshCw, 
  Settings, 
  Eye, 
  EyeOff, 
  Key, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText
} from "lucide-react"

function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@admin.com",
    phone: "+250 788 123 456",
    address: "Kigali, Rwanda",
    bio: "Platform Administrator",
    role: "Administrator",
    joinDate: "2024-01-15",
    lastLogin: "2025-01-15 14:30"
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPasswords: true,
    maxLoginAttempts: 5
  })

  const [platformSettings, setPlatformSettings] = useState({
    platformName: "SmartSports RW",
    currency: "RWF",
    timezone: "Africa/Kigali",
    language: "en",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    autoApproveUsers: false
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    teamUpdates: true,
    matchReminders: true,
    paymentAlerts: true,
    systemMaintenance: true,
    userRegistrations: true,
    ticketSales: true
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Settings saved")
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and platform settings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleSave} 
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 h-auto bg-white border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Notifications</TabsTrigger>
            <TabsTrigger value="platform" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Platform</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-green-600" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-600">Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-green-600" />
                    </div>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full bg-green-600 hover:bg-green-700 text-white">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Click to upload a new profile picture</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {/* Account Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Role</Label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Administrator</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Join Date</Label>
                      <p className="text-sm text-gray-600">{profileData.joinDate}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Last Login</Label>
                      <p className="text-sm text-gray-600">{profileData.lastLogin}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Status</Label>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Active</span>
                      </div>
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
                <CardDescription className="text-gray-600">Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={securitySettings.twoFactorAuth ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {securitySettings.twoFactorAuth ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Login Alerts</h3>
                      <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={securitySettings.loginAlerts ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {securitySettings.loginAlerts ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive security notifications via email</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={securitySettings.emailNotifications ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {securitySettings.emailNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={securitySettings.emailNotifications}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, emailNotifications: checked})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive security notifications via SMS</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={securitySettings.smsNotifications ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {securitySettings.smsNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={securitySettings.smsNotifications}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, smsNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-gray-700 font-medium">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-700 font-medium">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Session Timeout (minutes)</Label>
                      <Select value={securitySettings.sessionTimeout.toString()}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Max Login Attempts</Label>
                      <Select value={securitySettings.maxLoginAttempts.toString()}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-600">Choose how you want to be notified about platform activities</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={notificationSettings.emailNotifications ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {notificationSettings.emailNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={notificationSettings.smsNotifications ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {notificationSettings.smsNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={notificationSettings.pushNotifications ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {notificationSettings.pushNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">New user registrations</span>
                      </div>
                      <Switch 
                        checked={notificationSettings.userRegistrations}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, userRegistrations: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Ticket sales updates</span>
                      </div>
                      <Switch 
                        checked={notificationSettings.ticketSales}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, ticketSales: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Payment notifications</span>
                      </div>
                      <Switch 
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Team updates</span>
                      </div>
                      <Switch 
                        checked={notificationSettings.teamUpdates}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, teamUpdates: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Match reminders</span>
                      </div>
                      <Switch 
                        checked={notificationSettings.matchReminders}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, matchReminders: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">System maintenance alerts</span>
                      </div>
                      <Switch 
                        checked={notificationSettings.systemMaintenance}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemMaintenance: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Settings */}
          <TabsContent value="platform" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Globe className="h-5 w-5 text-green-600" />
                  Platform Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name" className="text-gray-700 font-medium">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value={platformSettings.platformName}
                      onChange={(e) => setPlatformSettings({...platformSettings, platformName: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-700 font-medium">Default Currency</Label>
                    <Select value={platformSettings.currency}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
                    <Select value={platformSettings.timezone}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Kigali">Africa/Kigali</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-700 font-medium">Default Language</Label>
                    <Select value={platformSettings.language}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="rw">Kinyarwanda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">Temporarily disable public access to the platform</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={platformSettings.maintenanceMode ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                          {platformSettings.maintenanceMode ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={platformSettings.maintenanceMode}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, maintenanceMode: checked})}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">User Registration</h3>
                        <p className="text-sm text-gray-500">Allow new users to register on the platform</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={platformSettings.registrationEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {platformSettings.registrationEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={platformSettings.registrationEnabled}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, registrationEnabled: checked})}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Verification</h3>
                        <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={platformSettings.emailVerification ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {platformSettings.emailVerification ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={platformSettings.emailVerification}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, emailVerification: checked})}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Auto Approve Users</h3>
                        <p className="text-sm text-gray-500">Automatically approve new user registrations</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={platformSettings.autoApproveUsers ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {platformSettings.autoApproveUsers ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={platformSettings.autoApproveUsers}
                          onCheckedChange={(checked) => setPlatformSettings({...platformSettings, autoApproveUsers: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminSettings)
