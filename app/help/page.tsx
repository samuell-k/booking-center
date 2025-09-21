"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Users, 
  Trophy, 
  Smartphone,
  Globe,
  Zap,
  ArrowRight,
  Target,
  Star,
  Gift
} from "lucide-react"

export default function HelpPage() {
  const supportWays = [
    {
      icon: Heart,
      title: "Spread the Word",
      description: "Share SmartSports RW with friends and family. Help us grow the sports community in Rwanda.",
      action: "Share Now",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: Users,
      title: "Join Our Community",
      description: "Follow us on social media and engage with our content. Be part of the conversation.",
      action: "Follow Us",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Trophy,
      title: "Support Local Teams",
      description: "Buy tickets to local matches and events. Your attendance makes a difference.",
      action: "Buy Tickets",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Star,
      title: "Leave Reviews",
      description: "Rate and review events you attend. Help other fans make informed decisions.",
      action: "Write Review",
      color: "bg-yellow-50 text-yellow-600"
    }
  ]

  const impactStats = [
    { number: "25+", label: "Teams Supported", icon: Trophy },
    { number: "50K+", label: "Fans Connected", icon: Users },
    { number: "100+", label: "Events Hosted", icon: Target },
    { number: "₹2M+", label: "Revenue Generated", icon: Gift }
  ]

  const initiatives = [
    {
      title: "Youth Sports Development",
      description: "Supporting young athletes with training programs and equipment donations.",
      impact: "500+ young athletes supported"
    },
    {
      title: "Community Sports Events",
      description: "Organizing free community tournaments and sports festivals across Rwanda.",
      impact: "50+ community events organized"
    },
    {
      title: "Digital Inclusion",
      description: "Making sports accessible through technology and mobile-first solutions.",
      impact: "90% mobile user adoption"
    },
    {
      title: "Local Team Support",
      description: "Providing marketing and ticketing support to grassroots sports teams.",
      impact: "25+ teams empowered"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Help Us Grow</Badge>
          <h1 className="apple-title text-4xl md:text-5xl font-bold mb-6">
            Help Us Build Rwanda's
            <span className="text-primary block">Sports Future</span>
          </h1>
          <p className="apple-body text-lg text-muted-foreground max-w-3xl mx-auto">
            SmartSports RW is more than a ticketing platform - we're building a movement 
            to transform sports culture in Rwanda. Here's how you can be part of our mission.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="apple-card text-center rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Ways to Help */}
        <div className="mb-16">
          <h2 className="apple-subtitle text-3xl font-bold text-center mb-8">How You Can Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportWays.map((way, index) => {
              const Icon = way.icon
              return (
                <Card key={index} className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${way.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="apple-subtitle font-semibold mb-2">{way.title}</h3>
                        <p className="apple-body text-muted-foreground mb-4">{way.description}</p>
                        <Button variant="outline" className="apple-button rounded-xl">
                          {way.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Our Initiatives */}
        <div className="mb-16">
          <h2 className="apple-subtitle text-3xl font-bold text-center mb-8">Our Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="apple-subtitle font-semibold mb-3">{initiative.title}</h3>
                  <p className="apple-body text-muted-foreground mb-4">{initiative.description}</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {initiative.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="apple-card mb-12 rounded-2xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="apple-subtitle text-2xl font-bold mb-4">Our Mission</h2>
            <p className="apple-body text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              To democratize access to sports in Rwanda by creating a digital ecosystem 
              that connects fans, supports teams, and celebrates our rich sporting heritage. 
              Together, we're building a future where every Rwandan can participate in and 
              enjoy the sports they love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="apple-button bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-3">
                Join Our Mission
              </Button>
              <Button variant="outline" className="apple-button rounded-xl px-6 py-3">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="apple-subtitle flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-primary" />
                For Developers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="apple-body text-muted-foreground mb-4">
                Help us build better features and improve the platform. 
                Contribute to open-source projects or join our development team.
              </p>
              <Button variant="outline" className="apple-button rounded-xl">
                Contribute Code
              </Button>
            </CardContent>
          </Card>

          <Card className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="apple-subtitle flex items-center gap-3">
                <Globe className="h-6 w-6 text-primary" />
                For Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="apple-body text-muted-foreground mb-4">
                Partner with us to sponsor events, support teams, or promote sports 
                development in your community.
              </p>
              <Button variant="outline" className="apple-button rounded-xl">
                Partner With Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
