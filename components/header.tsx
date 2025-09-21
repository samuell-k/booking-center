"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Home, Trophy, Calendar, User, Wallet, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/tickets/buy", icon: Trophy, label: "Buy Tickets" },
    { href: "/tickets", icon: Calendar, label: "My Tickets" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-serif text-xl font-bold text-primary">SmartSports RW</h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex md:hidden items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-1 px-2"
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
              <Settings className="h-4 w-4 mr-1" />
              Admin
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
