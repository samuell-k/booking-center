"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Create Account' on the homepage or profile page. Fill in your details including name, email, and phone number. You'll receive a verification code via SMS to complete the registration."
        },
        {
          question: "What sports events are available?",
          answer: "We offer tickets for Football, Basketball, Volleyball, and various other sporting events across Rwanda. Check our Sports section for the latest available events."
        },
        {
          question: "Is the platform free to use?",
          answer: "Yes, creating an account and browsing events is completely free. You only pay for the tickets you purchase."
        }
      ]
    },
    {
      category: "Tickets & Booking",
      questions: [
        {
          question: "How do I buy tickets?",
          answer: "Browse available events, select your preferred match, choose your seats, and proceed to payment. You can pay using Mobile Money (MTN, Airtel) or bank transfer."
        },
        {
          question: "Are tickets digital?",
          answer: "Yes, all tickets are digital with QR codes. After purchase, you'll receive your ticket via email and SMS. Simply show the QR code at the venue for entry."
        },
        {
          question: "Can I cancel or refund my ticket?",
          answer: "Refund policies vary by event. Generally, tickets can be refunded up to 24 hours before the event. Check the specific event's terms during purchase."
        },
        {
          question: "What if I lose my ticket?",
          answer: "Don't worry! Your tickets are saved in your account. You can always access them from 'My Tickets' section or we can resend them to your email/SMS."
        }
      ]
    },
    {
      category: "Payment & Mobile Money",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept MTN Mobile Money, Airtel Money, and bank transfers. All payments are processed securely through our trusted payment partners."
        },
        {
          question: "Is mobile money payment safe?",
          answer: "Absolutely! We use bank-level encryption and work with certified payment processors. Your financial information is never stored on our servers."
        },
        {
          question: "How long does payment processing take?",
          answer: "Mobile Money payments are usually instant. Bank transfers may take 1-2 business days to process. You'll receive confirmation once payment is successful."
        }
      ]
    },
    {
      category: "Events & Venues",
      questions: [
        {
          question: "How do I find events near me?",
          answer: "Use our location filter in the Sports section to find events in your area. We cover major venues across Kigali and other cities in Rwanda."
        },
        {
          question: "What happens if an event is cancelled?",
          answer: "If an event is cancelled, you'll be notified immediately via email and SMS. Full refunds are automatically processed within 3-5 business days."
        },
        {
          question: "Can I get notifications for my favorite teams?",
          answer: "Yes! Follow your favorite teams in your profile settings to receive notifications about their upcoming matches and special offers."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "The app is not working properly, what should I do?",
          answer: "Try refreshing the page or clearing your browser cache. If the problem persists, contact our support team with details about the issue you're experiencing."
        },
        {
          question: "I'm not receiving SMS notifications",
          answer: "Check that your phone number is correct in your profile settings. Ensure you have good network coverage. If issues persist, contact support."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your Profile page and click 'Edit Profile'. You can update your name, email, phone number, and notification preferences."
        }
      ]
    }
  ]

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const itemId = categoryIndex * 100 + questionIndex
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Frequently Asked Questions</Badge>
          <h1 className="apple-title text-4xl md:text-5xl font-bold mb-6">
            How can we
            <span className="text-primary block">help you?</span>
          </h1>
          <p className="apple-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about SmartSports RW. 
            Can't find what you're looking for? Contact our support team.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-border/50 bg-muted/50"
            />
          </div>
        </div>

        {/* FAQ Content */}
        {filteredFAQ.length === 0 ? (
          <Card className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try searching with different keywords or browse all categories.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {filteredFAQ.map((category, categoryIndex) => (
              <div key={category.category}>
                <h2 className="apple-subtitle text-2xl font-bold mb-4 text-primary">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const itemId = categoryIndex * 100 + questionIndex
                    const isOpen = openItems.includes(itemId)
                    
                    return (
                      <Card key={questionIndex} className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleItem(categoryIndex, questionIndex)}
                            className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 rounded-2xl"
                          >
                            <h3 className="apple-body font-semibold pr-4">{faq.question}</h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6">
                              <p className="apple-body text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <Card className="apple-card mt-12 rounded-2xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="apple-subtitle text-xl font-bold mb-2">Still need help?</h3>
            <p className="apple-body text-muted-foreground mb-4">
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact" className="apple-button bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Contact Support
              </a>
              <a href="mailto:support@smartsports.rw" className="apple-button bg-muted text-foreground px-6 py-3 rounded-xl hover:bg-muted/80 transition-colors">
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
