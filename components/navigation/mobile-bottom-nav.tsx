"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, Calendar, User, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tickets/buy", icon: Trophy, label: "Buy Tickets" },
  { href: "/tickets", icon: Calendar, label: "Tickets" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Menu" },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
      {/* Notch Background */}
      <div className="relative">
        {/* Main Navigation Bar */}
        <div className="glass-effect border-t border-border/50 px-4 py-2">
          <div className="flex items-center justify-around relative">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isCenter = index === 2 // Tickets is the center item

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center relative transition-all duration-200",
                    isCenter && "transform -translate-y-4"
                  )}
                >
                  {/* Center notch design */}
                  {isCenter && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-background transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl">
                        <Icon
                          className={cn(
                            "h-6 w-6 text-primary-foreground transition-all duration-200 hover:scale-110"
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Regular nav items */}
                  {!isCenter && (
                    <>
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300 transform",
                        isActive
                          ? "bg-primary/10 text-primary scale-110"
                          : "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={cn(
                        "text-xs mt-1 transition-all duration-200 font-medium",
                        isActive ? "text-primary scale-105" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    </>
                  )}
                  
                  {/* Center item label */}
                  {isCenter && (
                    <span className="text-xs mt-1 text-primary font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Notch curve background */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <svg
            width="80"
            height="40"
            viewBox="0 0 80 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-background"
          >
            <path
              d="M0 40 Q40 0 80 40 L80 40 L0 40 Z"
              fill="currentColor"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
