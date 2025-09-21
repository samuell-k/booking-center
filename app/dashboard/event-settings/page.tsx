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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Globe,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Image,
  FileText,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'

function EventSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Smart Sport',
    platformDescription: 'Rwanda\'s premier sports event management platform',
    defaultCurrency: 'RWF',
    timezone: 'Africa/Kigali',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    maxFileSize: '10',
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
    autoApproveEvents: false,
    requireEventApproval: true,
    allowPublicRegistration: true,
    enableNotifications: true
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    paymentConfirmations: true,
    ticketUpdates: true,
    marketingEmails: false,
    reminderDays: '7,3,1',
    notificationEmail: 'noreply@smartsport.rw',
    smsProvider: 'africastalking'
  })

  const [paymentSettings, setPaymentSettings] = useState({
    enablePayments: true,
    paymentMethods: ['mobile_money', 'card', 'bank_transfer'],
    defaultPaymentMethod: 'mobile_money',
    currency: 'RWF',
    taxRate: '18',
    processingFee: '2.5',
    minimumAmount: '1000',
    maximumAmount: '1000000',
    autoRefund: false,
    refundPeriod: '7',
    enablePartialPayments: false,
    paymentGateway: 'intouchpay'
  })

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requirePhoneVerification: true,
    enableTwoFactor: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireStrongPasswords: true,
    enableAuditLog: true,
    dataRetentionDays: '365',
    enableGDPR: true,
    allowDataExport: true
  })

  const handleGeneralChange = (field: string, value: any) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: string, value: any) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentChange = (field: string, value: any) => {
    setPaymentSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSecurityChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    // Show success message
  }

  const handleResetSettings = () => {
    // Reset to default values
    console.log('Resetting settings to defaults')
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure platform settings and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              className="bg-white border-gray-200 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="h-5 w-5 text-green-600" />
                  General Platform Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure basic platform information and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Platform Name</Label>
                    <Input
                      value={generalSettings.platformName}
                      onChange={(e) => handleGeneralChange('platformName', e.target.value)}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Default Currency</Label>
                    <Select value={generalSettings.defaultCurrency} onValueChange={(value) => handleGeneralChange('defaultCurrency', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Platform Description</Label>
                  <Textarea
                    value={generalSettings.platformDescription}
                    onChange={(e) => handleGeneralChange('platformDescription', e.target.value)}
                    rows={3}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Timezone</Label>
                    <Select value={generalSettings.timezone} onValueChange={(value) => handleGeneralChange('timezone', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="Africa/Kigali">Africa/Kigali</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Date Format</Label>
                    <Select value={generalSettings.dateFormat} onValueChange={(value) => handleGeneralChange('dateFormat', value)}>
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
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Time Format</Label>
                    <Select value={generalSettings.timeFormat} onValueChange={(value) => handleGeneralChange('timeFormat', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="24h">24 Hour</SelectItem>
                        <SelectItem value="12h">12 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Event Management</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Auto-approve Events</Label>
                        <p className="text-sm text-gray-600">Automatically approve events without manual review</p>
                      </div>
                      <Switch
                        checked={generalSettings.autoApproveEvents}
                        onCheckedChange={(checked) => handleGeneralChange('autoApproveEvents', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Allow Public Registration</Label>
                        <p className="text-sm text-gray-600">Allow users to register without invitation</p>
                      </div>
                      <Switch
                        checked={generalSettings.allowPublicRegistration}
                        onCheckedChange={(checked) => handleGeneralChange('allowPublicRegistration', checked)}
                      />
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
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure how users receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Notification Channels</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Event Reminders</Label>
                        <p className="text-sm text-gray-600">Send reminders before events</p>
                      </div>
                      <Switch
                        checked={notificationSettings.eventReminders}
                        onCheckedChange={(checked) => handleNotificationChange('eventReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Payment Confirmations</Label>
                        <p className="text-sm text-gray-600">Send payment confirmation notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.paymentConfirmations}
                        onCheckedChange={(checked) => handleNotificationChange('paymentConfirmations', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Ticket Updates</Label>
                        <p className="text-sm text-gray-600">Send ticket update notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.ticketUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('ticketUpdates', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Reminder Days</Label>
                    <Input
                      value={notificationSettings.reminderDays}
                      onChange={(e) => handleNotificationChange('reminderDays', e.target.value)}
                      placeholder="7,3,1"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500">Days before event to send reminders (comma-separated)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Notification Email</Label>
                    <Input
                      value={notificationSettings.notificationEmail}
                      onChange={(e) => handleNotificationChange('notificationEmail', e.target.value)}
                      type="email"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure payment processing and fees
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-700 font-medium">Enable Payments</Label>
                    <p className="text-sm text-gray-600">Allow users to make payments for events</p>
                  </div>
                  <Switch
                    checked={paymentSettings.enablePayments}
                    onCheckedChange={(checked) => handlePaymentChange('enablePayments', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Default Payment Method</Label>
                    <Select value={paymentSettings.defaultPaymentMethod} onValueChange={(value) => handlePaymentChange('defaultPaymentMethod', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Payment Gateway</Label>
                    <Select value={paymentSettings.paymentGateway} onValueChange={(value) => handlePaymentChange('paymentGateway', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="intouchpay">IntouchPay</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Tax Rate (%)</Label>
                    <Input
                      value={paymentSettings.taxRate}
                      onChange={(e) => handlePaymentChange('taxRate', e.target.value)}
                      type="number"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Processing Fee (%)</Label>
                    <Input
                      value={paymentSettings.processingFee}
                      onChange={(e) => handlePaymentChange('processingFee', e.target.value)}
                      type="number"
                      step="0.1"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Minimum Amount (RWF)</Label>
                    <Input
                      value={paymentSettings.minimumAmount}
                      onChange={(e) => handlePaymentChange('minimumAmount', e.target.value)}
                      type="number"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Auto Refund</Label>
                      <p className="text-sm text-gray-600">Automatically process refunds for cancelled events</p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoRefund}
                      onCheckedChange={(checked) => handlePaymentChange('autoRefund', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Enable Partial Payments</Label>
                      <p className="text-sm text-gray-600">Allow users to make partial payments</p>
                    </div>
                    <Switch
                      checked={paymentSettings.enablePartialPayments}
                      onCheckedChange={(checked) => handlePaymentChange('enablePartialPayments', checked)}
                    />
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
                  Configure security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">User Verification</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Require Email Verification</Label>
                        <p className="text-sm text-gray-600">Users must verify their email address</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireEmailVerification}
                        onCheckedChange={(checked) => handleSecurityChange('requireEmailVerification', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Require Phone Verification</Label>
                        <p className="text-sm text-gray-600">Users must verify their phone number</p>
                      </div>
                      <Switch
                        checked={securitySettings.requirePhoneVerification}
                        onCheckedChange={(checked) => handleSecurityChange('requirePhoneVerification', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                      </div>
                      <Switch
                        checked={securitySettings.enableTwoFactor}
                        onCheckedChange={(checked) => handleSecurityChange('enableTwoFactor', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Password Policy</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Minimum Password Length</Label>
                      <Input
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => handleSecurityChange('passwordMinLength', e.target.value)}
                        type="number"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Max Login Attempts</Label>
                      <Input
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => handleSecurityChange('maxLoginAttempts', e.target.value)}
                        type="number"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Require Strong Passwords</Label>
                      <p className="text-sm text-gray-600">Enforce complex password requirements</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireStrongPasswords}
                      onCheckedChange={(checked) => handleSecurityChange('requireStrongPasswords', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Data & Privacy</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Enable Audit Log</Label>
                        <p className="text-sm text-gray-600">Log all administrative actions</p>
                      </div>
                      <Switch
                        checked={securitySettings.enableAuditLog}
                        onCheckedChange={(checked) => handleSecurityChange('enableAuditLog', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Enable GDPR Compliance</Label>
                        <p className="text-sm text-gray-600">Enable GDPR data protection features</p>
                      </div>
                      <Switch
                        checked={securitySettings.enableGDPR}
                        onCheckedChange={(checked) => handleSecurityChange('enableGDPR', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-700 font-medium">Allow Data Export</Label>
                        <p className="text-sm text-gray-600">Allow users to export their data</p>
                      </div>
                      <Switch
                        checked={securitySettings.allowDataExport}
                        onCheckedChange={(checked) => handleSecurityChange('allowDataExport', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Status */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Settings Status</p>
                <p className="text-sm text-gray-600">
                  Changes are saved automatically. Use the "Save Settings" button to apply changes immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(EventSettingsPage, ['admin'])
