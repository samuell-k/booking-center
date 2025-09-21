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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Bell, 
  Shield, 
  Save, 
  Upload, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Crown,
  Settings,
  Activity,
  BarChart3,
  Users,
  Trophy,
  DollarSign
} from "lucide-react"

function AdminProfile() {
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@smartsports.rw",
    phone: "+250 788 000 000",
    address: "Kigali, Rwanda",
    bio: "System Administrator for SmartSports RW",
    dateOfBirth: "1985-03-20",
    role: "Super Admin",
    department: "IT Administration",
    employeeId: "ADM-001",
    joinDate: "2023-01-15"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    ticketUpdates: true,
    promotionalEmails: true,
    systemAlerts: true,
    securityAlerts: true,
    financialReports: true,
    userActivity: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: false,
    deviceManagement: true
  })

  const [adminStats] = useState({
    totalUsers: 1250,
    totalEvents: 45,
    totalRevenue: 2500000,
    systemUptime: 99.9
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Admin profile saved")
    } catch (error) {
      console.error('Error saving profile:', error)
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your admin account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <Crown className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
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

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{adminStats.totalEvents}</p>
                  <p className="text-xs text-blue-600 mt-1">Active events</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{(adminStats.totalRevenue / 1000000).toFixed(1)}M RWF</p>
                  <p className="text-xs text-purple-600 mt-1">+8% from last month</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">System Uptime</p>
                  <p className="text-3xl font-bold text-gray-900">{adminStats.systemUptime}%</p>
                  <p className="text-xs text-orange-600 mt-1">Excellent performance</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto bg-white border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-green-600" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-green-100">
                      <AvatarImage src="/profile.jpg" alt="Admin Profile" />
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Edit className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-500">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      disabled
                      className="bg-gray-50 border-gray-200 text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700 font-medium">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-gray-700 font-medium">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={profileData.employeeId}
                      disabled
                      className="bg-gray-50 border-gray-200 text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className="text-gray-700 font-medium">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={profileData.joinDate}
                      disabled
                      className="bg-gray-50 border-gray-200 text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Bell className="h-5 w-5 text-green-600" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, smsNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Push Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Receive push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">System Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Receive system alerts and warnings
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, systemAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Security Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Receive security-related notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, securityAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Financial Reports</Label>
                      <p className="text-sm text-gray-600">
                        Receive financial reports and summaries
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.financialReports}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, financialReports: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">User Activity</Label>
                      <p className="text-sm text-gray-600">
                        Receive notifications about user activity
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.userActivity}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, userActivity: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your account security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Login Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, loginAlerts: checked})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Session Timeout (minutes)</Label>
                    <Select 
                      value={securitySettings.sessionTimeout.toString()} 
                      onValueChange={(value) => 
                        setSecuritySettings({...securitySettings, sessionTimeout: parseInt(value)})
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Password Expiry (days)</Label>
                    <Select 
                      value={securitySettings.passwordExpiry.toString()} 
                      onValueChange={(value) => 
                        setSecuritySettings({...securitySettings, passwordExpiry: parseInt(value)})
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">IP Whitelist</Label>
                      <p className="text-sm text-gray-600">
                        Restrict access to specific IP addresses
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.ipWhitelist}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, ipWhitelist: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-900 font-medium">Device Management</Label>
                      <p className="text-sm text-gray-600">
                        Manage and monitor connected devices
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.deviceManagement}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, deviceManagement: checked})
                      }
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50">
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50">
                      <Activity className="h-4 w-4 mr-2" />
                      View Login History
                    </Button>
                    <Button variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="h-5 w-5 text-green-600" />
                  Admin Preferences
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure your admin dashboard preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Default Dashboard View</Label>
                    <Select defaultValue="overview">
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Date Format</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Time Zone</Label>
                    <Select defaultValue="east-africa">
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="east-africa">East Africa Time (EAT)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Currency</Label>
                    <Select defaultValue="rwf">
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rwf">Rwandan Franc (RWF)</SelectItem>
                        <SelectItem value="usd">US Dollar (USD)</SelectItem>
                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
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

export default withAuth(AdminProfile, ['admin'])
