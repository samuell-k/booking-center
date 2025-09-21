"use client"

import { useState, useEffect, useRef } from "react"

interface SimpleVideoBackgroundProps {
  videos: string[]
  className?: string
  slideInterval?: number
}

export function SimpleVideoBackground({
  videos,
  className = "",
  slideInterval = 10000
}: SimpleVideoBackgroundProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-slide effect
  useEffect(() => {
    if (videos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      )
    }, slideInterval)

    return () => clearInterval(interval)
  }, [videos.length, slideInterval])

  // Handle video loading and autoplay
  useEffect(() => {
    const video = videoRef.current
    if (!video || videos.length === 0) return

    const handleLoadedData = () => {
      // Ensure video plays when loaded
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        video.play().catch(error => {
          if (error.name === 'AbortError') {
            console.warn("Video play interrupted (power saving):", videos[currentVideoIndex])
            // Try again after a delay for AbortError
            setTimeout(() => {
              if (video && video.paused && video.readyState >= 3) {
                video.play().catch(() => {
                  console.warn("Retry autoplay failed")
                })
              }
            }, 1000)
          } else {
            console.warn("Autoplay failed:", error)
          }
        })
      }
    }

    const handleCanPlay = () => {
      // Backup play attempt
      if (video.paused && video.readyState >= 3) {
        video.play().catch(error => {
          if (error.name === 'AbortError') {
            console.warn("Video play interrupted on canplay:", videos[currentVideoIndex])
          } else {
            console.warn("Autoplay failed on canplay:", error)
          }
        })
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)

    // Force load the video
    video.load()

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [currentVideoIndex, videos])

  if (videos.length === 0) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/25" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
        suppressHydrationWarning
        style={{
          zIndex: 1,
          display: 'block'
        }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Video Indicators */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentVideoIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Switch to video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
