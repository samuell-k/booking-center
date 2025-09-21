// Image utilities for SmartSports Rwanda
// Local images for consistent branding

export const sportsImages = {
  football: {
    stadium: "/image.jpg",
    match: "/image.jpg",
    crowd: "/image.jpg",
    action: "/image.jpg",
    ball: "/image.jpg"
  },
  basketball: {
    arena: "/image.jpg",
    game: "/image.jpg",
    court: "/image.jpg"
  },
  volleyball: {
    court: "/image.jpg",
    match: "/image.jpg"
  },
  events: {
    concert: "/image.jpg",
    festival: "/image.jpg"
  }
}

export const merchandiseImages = {
  jersey: "/image.jpg",
  scarf: "/image.jpg",
  cap: "/image.jpg",
  bottle: "/image.jpg"
}

export const profileImages = {
  default: "/image.jpg",
  athlete: "/image.jpg"
}

// Helper function to get sport-specific fallback image
export function getSportImage(sport: string, type: 'default' | 'action' | 'venue' = 'default'): string {
  const sportLower = sport.toLowerCase()
  
  switch (sportLower) {
    case 'football':
      return type === 'venue' ? sportsImages.football.stadium : 
             type === 'action' ? sportsImages.football.action : 
             sportsImages.football.match
    case 'basketball':
      return type === 'venue' ? sportsImages.basketball.arena : 
             type === 'action' ? sportsImages.basketball.game : 
             sportsImages.basketball.court
    case 'volleyball':
      return type === 'venue' ? sportsImages.volleyball.court : 
             sportsImages.volleyball.match
    case 'events':
      return type === 'venue' ? sportsImages.events.concert : 
             sportsImages.events.festival
    default:
      return sportsImages.football.stadium
  }
}

// Helper function to optimize image URLs with size parameters
export function optimizeImageUrl(url: string, width: number = 800, height?: number): string {
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0]
    const heightParam = height ? `&h=${height}` : ''
    return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}${heightParam}&q=80`
  }
  return url
}

// Helper function to get responsive image sizes
export function getResponsiveImageSizes(breakpoints: { sm?: number, md?: number, lg?: number, xl?: number } = {}) {
  const { sm = 400, md = 600, lg = 800, xl = 1200 } = breakpoints
  return {
    small: optimizeImageUrl('', sm),
    medium: optimizeImageUrl('', md),
    large: optimizeImageUrl('', lg),
    xlarge: optimizeImageUrl('', xl)
  }
}
