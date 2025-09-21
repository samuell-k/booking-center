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
  Settings, 
  Globe, 
  Shield, 
  CreditCard, 
  Mail, 
  Save, 
  Upload, 
  Database, 
  Server, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Activity,
  DollarSign,
  Key,
  Lock,
  Wifi,
  HardDrive,
  Monitor
} from "lucide-react"

function AdminGeneralSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("system")
  const [systemSettings, setSystemSettings] = useState({
    siteName: "SmartSports RW",
    siteDescription: "Rwanda's premier sports ticketing platform",
    siteUrl: "https://smartsports.rw",
    adminEmail: "admin@smartsports.rw",
    supportEmail: "support@smartsports.rw",
    timezone: "Africa/Kigali",
    language: "en"
  })

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    mobileMoneyEnabled: true,
    bankTransferEnabled: true,
    currency: "RWF",
    taxRate: 18,
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paypalClientId: "",
    paypalSecret: ""
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@smartsports.rw",
    smtpPassword: "********",
    fromName: "SmartSports RW",
    fromEmail: "noreply@smartsports.rw",
    smtpSecure: true,
    emailQueue: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: true,
    sessionTimeout: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    ipWhitelist: false,
    sslRequired: true
  })

  const [maintenanceSettings, setMaintenanceSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    lastBackup: "2024-03-15 14:30",
    uptime: "15 days, 8 hours"
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("General settings saved")
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
            <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
            <p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
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
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-5 h-auto bg-white border border-gray-200">
            <TabsTrigger value="system" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">System</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Payment</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Email</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Security</TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Maintenance</TabsTrigger>
          </TabsList>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="h-5 w-5 text-green-600" />
                  System Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">Basic platform information and configuration</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name" className="text-gray-700 font-medium">Site Name</Label>
                    <Input
                      id="site-name"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url" className="text-gray-700 font-medium">Site URL</Label>
                    <Input
                      id="site-url"
                      value={systemSettings.siteUrl}
                      onChange={(e) => setSystemSettings({...systemSettings, siteUrl: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-gray-700 font-medium">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={systemSettings.adminEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email" className="text-gray-700 font-medium">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={systemSettings.supportEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-description" className="text-gray-700 font-medium">Site Description</Label>
                  <Textarea
                    id="site-description"
                    value={systemSettings.siteDescription}
                    onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                    rows={3}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-12 w-12 text-green-600" />
                    </div>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full bg-green-600 hover:bg-green-700 text-white">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Site Logo</h3>
                    <p className="text-sm text-gray-500">Upload your platform logo (PNG, JPG, SVG)</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Timezone</Label>
                      <Select value={systemSettings.timezone}>
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
                      <Label className="text-gray-700 font-medium">Default Language</Label>
                      <Select value={systemSettings.language}>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">Configure payment methods and processing settings</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                          <span className="text-sm font-medium text-gray-900">Stripe</span>
                        <p className="text-xs text-gray-500">Credit card payments</p>
                      </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={paymentSettings.stripeEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {paymentSettings.stripeEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      <Switch
                        checked={paymentSettings.stripeEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, stripeEnabled: checked})}
                      />
                    </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                      <div>
                          <span className="text-sm font-medium text-gray-900">Mobile Money</span>
                        <p className="text-xs text-gray-500">MTN, Airtel, Orange Money</p>
                      </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={paymentSettings.mobileMoneyEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {paymentSettings.mobileMoneyEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      <Switch
                        checked={paymentSettings.mobileMoneyEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, mobileMoneyEnabled: checked})}
                      />
                    </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-gray-500" />
                      <div>
                          <span className="text-sm font-medium text-gray-900">Bank Transfer</span>
                        <p className="text-xs text-gray-500">Direct bank transfers</p>
                      </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={paymentSettings.bankTransferEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {paymentSettings.bankTransferEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      <Switch
                        checked={paymentSettings.bankTransferEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, bankTransferEnabled: checked})}
                      />
                    </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                          <span className="text-sm font-medium text-gray-900">PayPal</span>
                        <p className="text-xs text-gray-500">PayPal payments</p>
                      </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={paymentSettings.paypalEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {paymentSettings.paypalEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      <Switch
                        checked={paymentSettings.paypalEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paypalEnabled: checked})}
                      />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <Label htmlFor="currency" className="text-gray-700 font-medium">Default Currency</Label>
                    <Select value={paymentSettings.currency}>
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
                      <Label htmlFor="tax-rate" className="text-gray-700 font-medium">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: Number(e.target.value)})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stripe-public-key" className="text-gray-700 font-medium">Stripe Public Key</Label>
                      <Input
                        id="stripe-public-key"
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripePublicKey: e.target.value})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe-secret-key" className="text-gray-700 font-medium">Stripe Secret Key</Label>
                      <Input
                        id="stripe-secret-key"
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypal-client-id" className="text-gray-700 font-medium">PayPal Client ID</Label>
                      <Input
                        id="paypal-client-id"
                        value={paymentSettings.paypalClientId}
                        onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypal-secret" className="text-gray-700 font-medium">PayPal Secret</Label>
                      <Input
                        id="paypal-secret"
                        type="password"
                        value={paymentSettings.paypalSecret}
                        onChange={(e) => setPaymentSettings({...paymentSettings, paypalSecret: e.target.value})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Mail className="h-5 w-5 text-green-600" />
                  Email Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">Configure SMTP settings for email notifications</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host" className="text-gray-700 font-medium">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port" className="text-gray-700 font-medium">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: Number(e.target.value)})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username" className="text-gray-700 font-medium">SMTP Username</Label>
                    <Input
                      id="smtp-username"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password" className="text-gray-700 font-medium">SMTP Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-name" className="text-gray-700 font-medium">From Name</Label>
                    <Input
                      id="from-name"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email" className="text-gray-700 font-medium">From Email</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">SMTP Secure</h3>
                        <p className="text-sm text-gray-500">Use SSL/TLS for secure email transmission</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={emailSettings.smtpSecure ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {emailSettings.smtpSecure ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={emailSettings.smtpSecure}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, smtpSecure: checked})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Queue</h3>
                        <p className="text-sm text-gray-500">Queue emails for better performance</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={emailSettings.emailQueue ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {emailSettings.emailQueue ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={emailSettings.emailQueue}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailQueue: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email
                  </Button>
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                    <Activity className="h-4 w-4 mr-2" />
                    Send Test Notification
                  </Button>
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
                  Security Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">Configure platform security settings and policies</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Security Features</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
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
                        <h3 className="text-sm font-medium text-gray-900">Password Policy</h3>
                      <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                    </div>
                      <div className="flex items-center gap-3">
                        <Badge className={securitySettings.passwordPolicy ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {securitySettings.passwordPolicy ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={securitySettings.passwordPolicy}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordPolicy: checked})}
                        />
                      </div>
                  </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Session Timeout</h3>
                      <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                    </div>
                      <div className="flex items-center gap-3">
                        <Badge className={securitySettings.sessionTimeout ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {securitySettings.sessionTimeout ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={securitySettings.sessionTimeout}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, sessionTimeout: checked})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">SSL Required</h3>
                        <p className="text-sm text-gray-500">Force HTTPS for all connections</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={securitySettings.sslRequired ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {securitySettings.sslRequired ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={securitySettings.sslRequired}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, sslRequired: checked})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">IP Whitelist</h3>
                        <p className="text-sm text-gray-500">Restrict admin access to specific IPs</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={securitySettings.ipWhitelist ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {securitySettings.ipWhitelist ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={securitySettings.ipWhitelist}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipWhitelist: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <Label htmlFor="session-timeout" className="text-gray-700 font-medium">Session Timeout (minutes)</Label>
                      <Input 
                        id="session-timeout" 
                        type="number" 
                        value={securitySettings.sessionTimeoutMinutes}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeoutMinutes: Number(e.target.value)})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="max-login-attempts" className="text-gray-700 font-medium">Max Login Attempts</Label>
                      <Input 
                        id="max-login-attempts" 
                        type="number" 
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: Number(e.target.value)})}
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Settings */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Server className="h-5 w-5 text-green-600" />
                  System Maintenance
                </CardTitle>
                <CardDescription className="text-gray-600">Manage system maintenance and database operations</CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Maintenance Features</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Temporarily disable public access</p>
                    </div>
                      <div className="flex items-center gap-3">
                        <Badge className={maintenanceSettings.maintenanceMode ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                          {maintenanceSettings.maintenanceMode ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={maintenanceSettings.maintenanceMode}
                          onCheckedChange={(checked) => setMaintenanceSettings({...maintenanceSettings, maintenanceMode: checked})}
                        />
                      </div>
                  </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Auto Backup</h3>
                      <p className="text-sm text-gray-500">Automatically backup database daily</p>
                    </div>
                      <div className="flex items-center gap-3">
                        <Badge className={maintenanceSettings.autoBackup ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {maintenanceSettings.autoBackup ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={maintenanceSettings.autoBackup}
                          onCheckedChange={(checked) => setMaintenanceSettings({...maintenanceSettings, autoBackup: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Database Operations</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Optimize Database
                    </Button>
                    <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Activity className="h-4 w-4 mr-2" />
                      System Health Check
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Platform Version:
                        </span>
                        <Badge className="bg-green-100 text-green-800">v2.1.0</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Database Version:
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">MySQL 8.0</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Last Backup:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{maintenanceSettings.lastBackup}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Uptime:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{maintenanceSettings.uptime}</span>
                      </div>
                    </div>
                    </div>
                    </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Backup Frequency</Label>
                      <Select value={maintenanceSettings.backupFrequency}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Database className="h-4 w-4 mr-2" />
                        Create Backup Now
                      </Button>
                      <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                        <Wifi className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
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

export default withAuth(AdminGeneralSettings)
