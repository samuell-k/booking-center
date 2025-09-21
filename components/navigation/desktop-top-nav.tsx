"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, LogIn, Info, Phone, Calendar, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/lightweight-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tickets/buy", icon: Trophy, label: "Buy Tickets" },
  { href: "/about", icon: Info, label: "About Us" },
  { href: "/contact", icon: Phone, label: "Contact Us" },
]

export function DesktopTopNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden md:block safe-area-top">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-black text-foreground transition-colors duration-200 group-hover:text-primary">
              SmartSports RW
            </h1>
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-3 h-12 rounded-full transition-colors duration-200 group",
                    "hover:bg-gray-100/80 hover:shadow-sm",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-bold">{item.label}</span>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  href={user.role === 'admin' ? '/admin' : user.role === 'team' ? '/team-dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-bold">{user.role}</span>
                </Link>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-full px-3 py-2 transition-all duration-200 hover:scale-105"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:shadow-lg group relative"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-bold">Sign In</span>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 transform -skew-x-12 pointer-events-none" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
