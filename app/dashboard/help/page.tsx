"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Search, MessageCircle, Phone, Mail, BookOpen, Video, FileText, Send, Star } from "lucide-react"
import { FloatingChat } from "@/components/ui/floating-chat"

function AdminHelp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Mock help data
  const faqCategories = [
    {
      name: "Getting Started",
      icon: BookOpen,
      questions: [
        {
          question: "How do I create a new event?",
          answer: "To create a new event, go to Events > Create Event and fill in the required information including event name, date, venue, and ticket details."
        },
        {
          question: "How do I manage user accounts?",
          answer: "Navigate to User Management to view, edit, or suspend user accounts. You can also send notifications to specific users."
        },
        {
          question: "How do I view platform analytics?",
          answer: "Go to Reports & Analytics to view detailed reports on ticket sales, revenue, user activity, and other key metrics."
        }
      ]
    },
    {
      name: "Payment & Billing",
      icon: FileText,
      questions: [
        {
          question: "How do I configure payment methods?",
          answer: "Go to General Settings > Payment to enable/disable payment methods like Stripe, Mobile Money, and Bank Transfer."
        },
        {
          question: "How do I process refunds?",
          answer: "Navigate to Transactions, find the specific transaction, and click the refund button. Refunds are processed within 3-5 business days."
        },
        {
          question: "How do I view financial reports?",
          answer: "Go to Reports & Analytics > Financial Reports to view revenue, expenses, and profit/loss statements."
        }
      ]
    },
    {
      name: "Technical Support",
      icon: HelpCircle,
      questions: [
        {
          question: "How do I backup the database?",
          answer: "Go to General Settings > Maintenance and click 'Backup Database'. Regular backups are recommended."
        },
        {
          question: "How do I enable maintenance mode?",
          answer: "In General Settings > Maintenance, toggle the 'Maintenance Mode' switch to temporarily disable public access."
        },
        {
          question: "How do I clear the cache?",
          answer: "Go to General Settings > Maintenance and click 'Clear Cache' to refresh the system cache."
        }
      ]
    }
  ]

  const supportTickets = [
    {
      id: "TICKET-001",
      subject: "Unable to process payments",
      status: "open",
      priority: "high",
      created: "2024-03-15",
      category: "Payment"
    },
    {
      id: "TICKET-002",
      subject: "User registration issues",
      status: "in-progress",
      priority: "medium",
      created: "2024-03-14",
      category: "User Management"
    },
    {
      id: "TICKET-003",
      subject: "Email notifications not working",
      status: "resolved",
      priority: "low",
      created: "2024-03-13",
      category: "Technical"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-red-100 text-red-800">Open</Badge>
      case 'in-progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default: return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
            <p className="text-gray-600 mt-1">Get support and find answers to common questions</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.5h</p>
                </div>
                <HelpCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Knowledge Base</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* FAQ Section */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-6">
                  {filteredFaqs.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <div className="space-y-3">
                        {category.questions.map((faq, faqIndex) => (
                          <div key={faqIndex} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage and track support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>ID: {ticket.id}</span>
                            <span>Category: {ticket.category}</span>
                            <span>Created: {ticket.created}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Ticket</CardTitle>
                  <CardDescription>Send us a detailed message about your issue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Describe your issue in detail..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Reach out to us directly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-500">support@smartsports.rw</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-500">+250 788 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Getting Started Guide</h4>
                    <p className="text-sm text-gray-500">Learn the basics of managing your platform</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Event Management</h4>
                    <p className="text-sm text-gray-500">How to create and manage events</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Payment Processing</h4>
                    <p className="text-sm text-gray-500">Setting up and managing payments</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">API Documentation</h4>
                    <p className="text-sm text-gray-500">Complete API reference guide</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">User Manual</h4>
                    <p className="text-sm text-gray-500">Detailed user guide and instructions</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Developer Guide</h4>
                    <p className="text-sm text-gray-500">Integration and customization guide</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating AI Chat */}
      <FloatingChat 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </DashboardLayout>
  )
}

export default withAuth(AdminHelp)
