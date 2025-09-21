"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Users, 
  Target, 
  Heart, 
  Globe, 
  Smartphone,
  Shield,
  Zap
} from "lucide-react"
import { PartnersSection } from "@/components/sections/partners-section"
import { Footer } from "@/components/sections/footer"

export default function AboutPage() {
  const features = [
    {
      icon: Trophy,
      title: "Sports Excellence",
      description: "Supporting Rwanda's vibrant sports culture with premium ticketing solutions"
    },
    {
      icon: Smartphone,
      title: "Digital Innovation", 
      description: "Modern mobile-first platform with QR code tickets and mobile money integration"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security ensuring safe transactions and authentic tickets"
    },
    {
      icon: Heart,
      title: "Community Focused",
      description: "Empowering local teams and bringing fans closer to the sports they love"
    }
  ]

  const stats = [
    { number: "50K+", label: "Tickets Sold" },
    { number: "25+", label: "Teams Supported" },
    { number: "100+", label: "Events Hosted" },
    { number: "4.9", label: "User Rating" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">About SmartSports RW</Badge>
          <h1 className="apple-title text-4xl md:text-5xl font-bold mb-6">
            Revolutionizing Sports
            <span className="text-primary block">in Rwanda</span>
          </h1>
          <p className="apple-body text-lg text-muted-foreground max-w-2xl mx-auto">
            SmartSports RW is Rwanda's premier digital sports ticketing platform, 
            connecting fans with their favorite teams and events through innovative technology.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="apple-card text-center rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <Card className="apple-card mb-12 rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="apple-subtitle text-2xl font-bold mb-4">Our Mission</h2>
              <p className="apple-body text-lg text-muted-foreground max-w-3xl mx-auto">
                To democratize access to sports events in Rwanda by providing a seamless, 
                secure, and user-friendly digital ticketing platform that supports local teams, 
                enhances fan experiences, and contributes to the growth of sports culture in our nation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="apple-subtitle text-3xl font-bold text-center mb-8">Why Choose SmartSports RW?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="apple-subtitle font-semibold mb-2">{feature.title}</h3>
                        <p className="apple-body text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Vision Section */}
        <Card className="apple-card mb-12 rounded-2xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="apple-subtitle text-2xl font-bold mb-4">Our Vision</h2>
              <p className="apple-body text-lg text-muted-foreground max-w-3xl mx-auto">
                To become the leading sports technology platform in East Africa, 
                fostering a thriving sports ecosystem that brings communities together, 
                supports athletic excellence, and showcases Rwanda's sporting achievements to the world.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="apple-subtitle text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Heart, title: "Passion", desc: "For sports and community" },
              { icon: Shield, title: "Integrity", desc: "In every transaction" },
              { icon: Zap, title: "Innovation", desc: "Driving digital transformation" },
              { icon: Users, title: "Unity", desc: "Bringing fans together" }
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="apple-subtitle font-semibold mb-2">{value.title}</h3>
                    <p className="apple-caption text-sm text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
