"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppNavigation } from "./app-navigation"
import { memo } from "react"

const ConditionalNavigation = memo(function ConditionalNavigation() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  // Check if current path is a dashboard path
  const isDashboardPath = pathname.startsWith('/dashboard')

  // If we're on a dashboard path and user is logged in, don't show public navigation
  if (isDashboardPath && user) {
    return null
  }

  // If we're on a dashboard path but no user (logged out), show public navigation immediately
  if (isDashboardPath && !user) {
    return <AppNavigation />
  }

  // Show public navigation for all other cases (including home page)
  return <AppNavigation />
})

export { ConditionalNavigation }
