'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { qrService, QRValidationResult } from '@/lib/services/qrService'

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (ticketData: any) => void
  onScanError: (error: string) => void
}

export function QRScanner({ isOpen, onClose, onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<QRValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      startScanner()
    } else {
      stopScanner()
    }

    return () => {
      stopScanner()
    }
  }, [isOpen])

  const startScanner = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Camera access failed:', err)
      setError('Camera access denied. Please allow camera access to scan QR codes.')
      setIsScanning(false)
    }
  }

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/png')
  }

  const scanQRCode = async () => {
    try {
      const imageData = captureFrame()
      if (!imageData) return

      // In a real implementation, you would use a QR code scanning library
      // For now, we'll simulate scanning with a mock QR code
      const mockQRData = JSON.stringify({
        ticketId: 'TKT-123456789',
        eventId: 'EVT-001',
        userId: 'USR-001',
        ticketType: 'regular',
        purchaseDate: new Date().toISOString(),
        signature: 'mock-signature'
      })

      const result = qrService.validateQRCode(mockQRData)
      setScanResult(result)

      if (result.isValid && result.ticketData) {
        onScanSuccess(result.ticketData)
        stopScanner()
      } else {
        onScanError(result.error || 'Invalid QR code')
      }
    } catch (err) {
      console.error('QR scan failed:', err)
      onScanError('Failed to scan QR code')
    }
  }

  const handleClose = () => {
    stopScanner()
    setScanResult(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scan QR Code
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scanResult && (
            <Alert variant={scanResult.isValid ? "default" : "destructive"}>
              {scanResult.isValid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {scanResult.isValid ? 'Valid ticket!' : scanResult.error}
              </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-gray-100 rounded-lg object-cover"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-lg p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={scanQRCode}
              disabled={!isScanning}
              className="flex-1"
            >
              <Camera className="mr-2 h-4 w-4" />
              Scan QR Code
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Position the QR code within the camera view and tap "Scan QR Code"
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
