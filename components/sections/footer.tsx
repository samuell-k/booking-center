"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, Trophy } from "lucide-react"

const quickLinks = [
  { name: "Football", href: "/sports/football" },
  { name: "Basketball", href: "/sports/basketball" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" }
]

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/smartsportsrw", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/smartsportsrw", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com/smartsportsrw", icon: Instagram },
  { name: "YouTube", href: "https://youtube.com/smartsportsrw", icon: Youtube }
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-bold">SmartSports RW</h3>
            </div>
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">
              Rwanda's digital sports platform for tickets and live events.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>info@smartsports.rw</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+250 799393729</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Connect</h4>
            <div className="flex gap-2 mb-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 group"
                    aria-label={social.name}
                  >
                    <Icon className="h-3 w-3 text-gray-300 group-hover:text-white" />
                  </a>
                )
              })}
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="mx-2">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-400">
              &copy; 2024 SmartSports RW. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Made by Infinity tech solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}