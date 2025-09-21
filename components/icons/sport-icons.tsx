import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export function FootballIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 2C12 2 8 6 8 12s4 10 4 10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2C12 2 16 6 16 12s-4 10-4 10" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 7h12" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 17h12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function BasketballIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 2v20" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2C8 6 8 18 12 22" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2C16 6 16 18 12 22" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function VolleyballIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 2C8 6 8 18 12 22" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2C16 6 16 18 12 22" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12C6 8 18 8 22 12" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12C6 16 18 16 22 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function EventIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function AllSportsIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3 3h18v18H3z" stroke="currentColor" strokeWidth="2" fill="none" rx="2"/>
      <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M3 9h6" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9h6" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 3v6" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 15v6" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 3v6" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 15v6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
