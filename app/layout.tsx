import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next" // Removed for performance
import { Suspense } from "react"
import { ConditionalNavigation } from "@/components/navigation/conditional-navigation"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SmartSports RW - Rwanda Sports Ticketing Platform",
  description:
    "Buy tickets for Football, Basketball, Volleyball and Events in Rwanda. Modern digital ticketing with QR codes and mobile money support.",
  generator: "SmartSports RW",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" /> Removed for performance */}
      </head>
      <body className={`font-sans ${playfairDisplay.variable} ${sourceSans.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <ConditionalNavigation />
          <main className="pt-20 pb-20 md:pt-20 md:pb-0">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </AuthProvider>
        {/* <Analytics /> Removed for performance */}
      </body>
    </html>
  )
}
