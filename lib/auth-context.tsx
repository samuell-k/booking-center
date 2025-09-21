"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogoutModal } from '@/components/ui/logout-modal'

export interface User {
  id: string
  email: string
  role: 'admin'
  name: string
  firstName?: string
  lastName?: string
  phone?: string
  emailVerified?: boolean
  phoneVerified?: boolean
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  register: (userData: RegisterData) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  const isAuthenticated = !!user

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('user')
      }
      // Set loading to false immediately after checking
      setIsLoading(false)
    }

    // Check auth immediately for faster loading
    checkAuth()
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Default credentials check
      const defaultCredentials = {
        admin: { email: "admin", password: "admin", role: "admin" },
        adminEmail: { email: "admin@admin.com", password: "123456", role: "admin" }
      }

      const credential = Object.values(defaultCredentials).find(
        cred => (cred.email === email || email === cred.email) && 
                cred.password === password &&
                cred.role === role
      )

      if (credential) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          role: 'admin',
          name: "Admin User",
          firstName: "Admin",
          lastName: "User",
          emailVerified: true,
          phoneVerified: true,
          avatar: `/placeholder-user.jpg`
        }

        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        role: 'admin',
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        emailVerified: false,
        phoneVerified: false,
        avatar: `/placeholder-user.jpg`
      }

      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    // Clear user data immediately
    setUser(null)
    localStorage.removeItem('user')
    setShowLogoutModal(false)
    
    // Force immediate redirect to home page
    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: ['admin']
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/auth/login')
          return
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.push('/unauthorized')
          return
        }
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
      return null
    }

    return <Component {...props} />
  }
}

// Hook for role-based access control
export function useRoleAccess() {
  const { user } = useAuth()

  const hasRole = (role: 'admin') => {
    return user?.role === role
  }

  const hasAnyRole = (roles: ['admin']) => {
    return user ? roles.includes(user.role) : false
  }

  const isAdmin = () => hasRole('admin')

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    userRole: user?.role
  }
}
