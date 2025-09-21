"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Loader2, ThumbsUp, ThumbsDown, Copy, RefreshCw, Send, X, MessageCircle } from "lucide-react"

interface FloatingChatProps {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingChat({ isOpen, onToggle }: FloatingChatProps) {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm your AI assistant. How can I help you with SmartSports today?",
      timestamp: new Date(),
      isTyping: false
    }
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Quick suggestions for chatbot
  const quickSuggestions = [
    "How do I buy tickets?",
    "How to cancel a ticket?",
    "Where are my QR codes?",
    "How to contact support?",
    "Payment issues",
    "Account problems"
  ]

  // Mock AI responses
  const getAIResponse = (userMessage: string) => {
    const responses = {
      "ticket": "To buy tickets, go to 'Browse Matches', select your event, choose seats, and proceed to checkout. You can pay with mobile money, credit card, or bank transfer.",
      "cancel": "You can cancel tickets up to 24 hours before the event. Go to 'My Tickets', select the ticket, and click 'Cancel'. A small fee may apply.",
      "qr": "Your QR codes are in 'My Tickets'. Click on any active ticket to view and download the QR code for entry.",
      "support": "You can contact support by submitting a ticket in the 'Support' tab, calling +250 788 123 456, or emailing support@smartsports.rw",
      "payment": "For payment issues, check your payment method, ensure sufficient funds, or try a different payment option. Contact support if problems persist.",
      "account": "For account issues, try logging out and back in, clear your browser cache, or reset your password. Contact support for further assistance."
    }
    
    const lowerMessage = userMessage.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    
    return "I understand you need help. Let me connect you with our support team for personalized assistance. You can also browse our FAQ section for common questions."
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput,
      timestamp: new Date(),
      isTyping: false
    }

    const currentInput = chatInput // Store before clearing
    setChatInput("") // Clear input immediately
    setChatMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Use requestAnimationFrame to avoid forced reflow
    requestAnimationFrame(() => {
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'bot',
          message: getAIResponse(currentInput),
          timestamp: new Date(),
          isTyping: false
        }
        setChatMessages(prev => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    })
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setChatInput(suggestion)
  }

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="relative">
            {/* Boxicons message bubble check icon */}
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <i className="bx bx-message-bubble-check text-2xl text-pink-600"></i>
              </div>
            </div>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-2xl border-0 bg-white">
        <CardHeader className="pb-4 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="bx bx-message-bubble-check text-2xl text-white"></i>
              </div>
              <div>
                <CardTitle className="text-lg text-white font-semibold">AI Assistant</CardTitle>
                <CardDescription className="text-pink-100">Get instant help</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Online
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 h-[400px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ contain: 'layout style' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`} style={{ contain: 'layout' }}>
                <div className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
                      : 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 min-w-0 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm break-words">{msg.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70 flex-shrink-0">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.type === 'bot' && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                            onClick={() => copyMessage(msg.message)}
                          >
                            <Copy className="h-2 w-2" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                          >
                            <ThumbsUp className="h-2 w-2" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                          >
                            <ThumbsDown className="h-2 w-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs text-gray-600">AI is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="p-3 border-t border-gray-200">
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => handleQuickSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="pr-8 text-sm"
                  style={{ contain: 'layout' }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setChatInput("")}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 h-9 px-3 flex-shrink-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
