"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  LogIn,
  UserPlus,
  Info,
  HelpCircle,
  MessageCircle,
  Heart,
  Settings,
  Shield,
  Bell,
  Wallet,
  Trophy,
  Ticket,
  ChevronRight,
  Globe,
  FileText,
  Users,
  Star,
  Download,
  Share,
  LogOut
} from "lucide-react"

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Mock user data
  const user = {
    name: "Jean Baptiste Uwimana",
    email: "jean.uwimana@email.com",
    avatar: "/placeholder-user.jpg",
    memberSince: "2024",
    stats: {
      ticketsPurchased: 12,
      eventsAttended: 8,
      totalSpent: 45000,
      favoriteTeams: 2,
    }
  }

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: LogIn, label: "Sign In", href: "/auth/signin", description: "Access your account" },
        { icon: UserPlus, label: "Sign Up", href: "/auth/signup", description: "Create new account" },
      ]
    },
    {
      title: "My Account",
      items: [
        { icon: Wallet, label: "My Wallet", href: "/wallet", description: "Manage your balance" },
        { icon: Ticket, label: "My Tickets", href: "/tickets", description: "View purchased tickets" },
        { icon: Trophy, label: "My Teams", href: "/teams", description: "Favorite teams" },
        { icon: Heart, label: "Wishlist", href: "/wishlist", description: "Saved items" },
      ]
    },
    {
      title: "Information",
      items: [
        { icon: Info, label: "About Us", href: "/about", description: "Learn about SmartSports RW" },
        { icon: HelpCircle, label: "FAQ", href: "/faq", description: "Frequently asked questions" },
        { icon: MessageCircle, label: "Contact Us", href: "/contact", description: "Get in touch" },
        { icon: Users, label: "Help Us", href: "/help", description: "Support our mission" },
      ]
    },
    {
      title: "Settings",
      items: [
        { icon: Settings, label: "Preferences", href: "/settings", description: "App settings" },
        { icon: Bell, label: "Notifications", href: "/notifications", description: "Manage alerts" },
        { icon: Shield, label: "Privacy", href: "/privacy", description: "Privacy settings" },
        { icon: Globe, label: "Language", href: "/language", description: "Change language" },
      ]
    },
    {
      title: "Legal",
      items: [
        { icon: FileText, label: "Terms of Service", href: "/terms", description: "Terms and conditions" },
        { icon: Shield, label: "Privacy Policy", href: "/privacy-policy", description: "Privacy information" },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="apple-title text-3xl font-bold mb-2">Profile</h1>
          <p className="apple-body text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* User Profile Card */}
        {isLoggedIn && (
          <Card className="apple-card mb-6 rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="apple-subtitle text-xl font-semibold">{user.name}</h2>
                  <p className="apple-caption text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    Member since {user.memberSince}
                  </Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.stats.ticketsPurchased}</div>
                  <div className="text-xs text-muted-foreground">Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.stats.eventsAttended}</div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.stats.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">RWF Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.stats.favoriteTeams}</div>
                  <div className="text-xs text-muted-foreground">Teams</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <Card key={section.title} className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="p-4 pb-2">
                  <h3 className="apple-subtitle text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-0">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.label} href={item.href}>
                        <div className="apple-button flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors duration-200 border-b border-border/30 last:border-b-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="apple-body font-medium">{item.label}</div>
                            <div className="apple-caption text-xs text-muted-foreground">{item.description}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Logout Button */}
          {isLoggedIn && (
            <Card className="apple-card rounded-2xl border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <button className="apple-button w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 text-red-600 dark:text-red-400">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-950/50 rounded-lg flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="apple-body font-medium">Sign Out</div>
                    <div className="apple-caption text-xs text-muted-foreground">Sign out of your account</div>
                  </div>
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
