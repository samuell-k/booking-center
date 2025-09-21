"use client"

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth, useRoleAccess } from '@/lib/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Home,
  Users,
  Trophy,
  Ticket,
  ShoppingBag,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  Bell,
  Calendar,
  CreditCard,
  Shield,
  UserCheck,
  TrendingUp,
  FileText,
  Wallet,
  QrCode,
  Grid3X3,
  Briefcase,
  Activity,
  HelpCircle,
  MessageCircle,
  DollarSign,
  Database,
  Server,
  Mail,
  Lock,
  HardDrive,
  Monitor,
  Plus,
  MapPin,
  Tag,
  Copy,
  Receipt,
  Calculator,
  PieChart,
  Banknote,
  TrendingDown
} from 'lucide-react'
import { DashboardNavbar } from './dashboard-navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles: ['admin']
}

const navigationItems: NavItem[] = [
  // Admin Navigation
  {
    title: 'Dashboard & Overview',
    href: '/dashboard',
    icon: Grid3X3,
    roles: ['admin']
  },
  {
    title: 'Events',
    href: '/dashboard/events',
    icon: Calendar,
    roles: ['admin']
  },
  {
    title: 'Create Event',
    href: '/dashboard/events/create',
    icon: Plus,
    roles: ['admin']
  },
  {
    title: 'Event Categories',
    href: '/dashboard/event-categories',
    icon: Tag,
    roles: ['admin']
  },
  {
    title: 'Event Templates',
    href: '/dashboard/event-templates',
    icon: Copy,
    roles: ['admin']
  },
  {
    title: 'Venue Management',
    href: '/dashboard/venues',
    icon: MapPin,
    roles: ['admin']
  },
  {
    title: 'Event Settings',
    href: '/dashboard/event-settings',
    icon: Settings,
    roles: ['admin']
  },
  {
    title: 'Event Calendar',
    href: '/dashboard/event-calendar',
    icon: Calendar,
    roles: ['admin']
  },
  {
    title: 'Event Reports',
    href: '/dashboard/event-reports',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'Event Analytics',
    href: '/dashboard/event-analytics',
    icon: TrendingUp,
    roles: ['admin']
  },
  {
    title: 'Transactions',
    href: '/dashboard/transactions',
    icon: Briefcase,
    roles: ['admin']
  },
  {
    title: 'My Wallet',
    href: '/dashboard/wallet',
    icon: Wallet,
    roles: ['admin']
  },
  {
    title: 'Reports & Analytics',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'User Management',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'Team Management',
    href: '/dashboard/teams',
    icon: Trophy,
    roles: ['admin']
  },
  {
    title: 'Create Team',
    href: '/dashboard/teams/create',
    icon: Plus,
    roles: ['admin']
  },
  {
    title: 'Team Categories',
    href: '/dashboard/team-categories',
    icon: Tag,
    roles: ['admin']
  },
  {
    title: 'Team Members',
    href: '/dashboard/team-members',
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'Team Settings',
    href: '/dashboard/team-settings',
    icon: Settings,
    roles: ['admin']
  },
  {
    title: 'Team Analytics',
    href: '/dashboard/team-analytics',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'Team Reports',
    href: '/dashboard/team-reports',
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'Account Settings',
    href: '/dashboard/settings',
    icon: User,
    roles: ['admin']
  },
  {
    title: 'General Settings',
    href: '/dashboard/general-settings',
    icon: Settings,
    roles: ['admin']
  },
  {
    title: 'Browse Matches',
    href: '/dashboard/matches',
    icon: Calendar,
    roles: ['admin']
  },
  {
    title: 'Matches',
    href: '/dashboard/admin-matches',
    icon: Calendar,
    roles: ['admin']
  },
  {
    title: 'My Tickets',
    href: '/dashboard/my-tickets',
    icon: Ticket,
    roles: ['admin']
  },
  {
    title: 'QR Codes',
    href: '/dashboard/qr-codes',
    icon: QrCode,
    roles: ['admin']
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['admin']
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'Ticket Sales',
    href: '/dashboard/ticket-sales',
    icon: TrendingUp,
    roles: ['admin']
  },
  {
    title: 'Finance',
    href: '/dashboard/finance',
    icon: DollarSign,
    roles: ['admin']
  },
  {
    title: 'Accounting',
    href: '/dashboard/accounting',
    icon: Calculator,
    roles: ['admin']
  },
  {
    title: 'Revenue Management',
    href: '/dashboard/revenue',
    icon: TrendingUp,
    roles: ['admin']
  },
  {
    title: 'Expense Tracking',
    href: '/dashboard/expenses',
    icon: TrendingDown,
    roles: ['admin']
  },
  {
    title: 'Budget Planning',
    href: '/dashboard/budget',
    icon: PieChart,
    roles: ['admin']
  },
  {
    title: 'Financial Reports',
    href: '/dashboard/financial-reports',
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'Tax Management',
    href: '/dashboard/tax',
    icon: Receipt,
    roles: ['admin']
  },
  {
    title: 'Payment Processing',
    href: '/dashboard/payments',
    icon: CreditCard,
    roles: ['admin']
  },
  {
    title: 'Invoice Management',
    href: '/dashboard/invoices',
    icon: Receipt,
    roles: ['admin']
  },
  {
    title: 'Refund Management',
    href: '/dashboard/refunds',
    icon: Banknote,
    roles: ['admin']
  },
  {
    title: 'Financial Analytics',
    href: '/dashboard/financial-analytics',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'Cash Flow',
    href: '/dashboard/cash-flow',
    icon: TrendingUp,
    roles: ['admin']
  },
  {
    title: 'Profit & Loss',
    href: '/dashboard/profit-loss',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'Balance Sheet',
    href: '/dashboard/balance-sheet',
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'Financial Settings',
    href: '/dashboard/financial-settings',
    icon: Settings,
    roles: ['admin']
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    roles: ['admin']
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageCircle,
    roles: ['admin']
  },
  {
    title: 'System Logs',
    href: '/dashboard/logs',
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'Backup & Restore',
    href: '/dashboard/backup',
    icon: HardDrive,
    roles: ['admin']
  },
  {
    title: 'API Management',
    href: '/dashboard/api',
    icon: Server,
    roles: ['admin']
  },
  {
    title: 'Content Management',
    href: '/dashboard/content',
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'Email Templates',
    href: '/dashboard/email-templates',
    icon: Mail,
    roles: ['admin']
  },
  {
    title: 'Security Settings',
    href: '/dashboard/security',
    icon: Lock,
    roles: ['admin']
  },
  {
    title: 'Database Management',
    href: '/dashboard/database',
    icon: Database,
    roles: ['admin']
  },
  {
    title: 'System Monitoring',
    href: '/dashboard/monitoring',
    icon: Monitor,
    roles: ['admin']
  },
  {
    title: 'Integrations',
    href: '/dashboard/integrations',
    icon: Activity,
    roles: ['admin']
  },
  {
    title: 'Audit Trail',
    href: '/dashboard/audit',
    icon: Shield,
    roles: ['admin']
  },
  {
    title: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: Settings,
    roles: ['admin']
  },
  {
    title: 'Help Center',
    href: '/dashboard/help',
    icon: HelpCircle,
    roles: ['admin']
  }
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth()
  const { userRole }: { userRole: 'admin' | undefined } = useRoleAccess()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Memoized mobile menu close handler
  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Filter navigation items by role
  const filteredNavItems = useMemo(() => {
    return navigationItems.filter(item => 
      (!userRole || item.roles.includes(userRole))
    )
  }, [userRole])

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const getRoleColor = (role: string) => {
    return 'bg-red-100 text-red-800'
  }

  const getRoleIcon = (role: string) => {
    return Shield
  }

  const getOrganizationName = () => {
    return 'SmartSports RW Admin'
  }

  const getPlanBadge = () => {
    return 'Pro Plan'
  }

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div 
      className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}
      onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling to sheet
    >
      {/* Logo - Compact */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-900">SmartSports RW</h2>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation - Compact */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={handleMobileMenuClose}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="font-medium text-xs flex-1 truncate">
                {item.title}
              </span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs px-1 py-0.5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout - Compact */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-1.5"
          onClick={logout}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="text-xs">Sign Out</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Smaller */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Fixed Top Navigation Bar */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 z-40">
        <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}