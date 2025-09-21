"use client"

import { lazy, Suspense } from "react"

// Lazy load navigation components
const DesktopTopNav = lazy(() => import("./desktop-top-nav").then(module => ({ default: module.DesktopTopNav })))
const MobileBottomNav = lazy(() => import("./mobile-bottom-nav").then(module => ({ default: module.MobileBottomNav })))
const MobileSearch = lazy(() => import("./mobile-search").then(module => ({ default: module.MobileSearch })))

// Loading fallback components
const DesktopNavSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 z-50 hidden md:block safe-area-top">
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
)

const MobileNavSkeleton = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
    <div className="glass-effect border-t border-border/50 px-4 py-2">
      <div className="flex items-center justify-around">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
)

export function AppNavigation() {
  return (
    <>
      <Suspense fallback={<DesktopNavSkeleton />}>
        <DesktopTopNav />
      </Suspense>
      <Suspense fallback={null}>
        <MobileSearch />
      </Suspense>
      <Suspense fallback={<MobileNavSkeleton />}>
        <MobileBottomNav />
      </Suspense>
    </>
  )
}
