/**
 * QR Code Service for SmartSports Rwanda
 * Handles QR code generation and validation for tickets
 */

import QRCode from 'qrcode'

export interface TicketQRData {
  ticketId: string
  eventId: string
  userId: string
  ticketType: 'regular' | 'vip' | 'student' | 'child'
  purchaseDate: string
  signature: string
}

export interface QRValidationResult {
  isValid: boolean
  ticketData?: TicketQRData
  error?: string
}

export class QRService {
  private static instance: QRService | null = null
  private secretKey: string

  private constructor() {
    this.secretKey = process.env.QR_SECRET_KEY || 'smartsports-rw-secret-key-2024'
  }

  static getInstance(): QRService {
    if (!QRService.instance) {
      QRService.instance = new QRService()
    }
    return QRService.instance
  }

  /**
   * Generate a secure signature for ticket data
   */
  private generateSignature(data: Omit<TicketQRData, 'signature'>): string {
    const crypto = require('crypto')
    const dataString = `${data.ticketId}-${data.eventId}-${data.userId}-${data.ticketType}-${data.purchaseDate}`
    return crypto.createHmac('sha256', this.secretKey).update(dataString).digest('hex')
  }

  /**
   * Generate QR code data for a ticket
   */
  generateTicketQRData(ticketData: Omit<TicketQRData, 'signature'>): TicketQRData {
    const signature = this.generateSignature(ticketData)
    return {
      ...ticketData,
      signature
    }
  }

  /**
   * Generate QR code as base64 image
   */
  async generateQRCode(ticketData: TicketQRData): Promise<string> {
    try {
      const qrData = JSON.stringify(ticketData)
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      return qrCodeDataURL
    } catch (error) {
      console.error('QR code generation failed:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Generate QR code as SVG string
   */
  async generateQRCodeSVG(ticketData: TicketQRData): Promise<string> {
    try {
      const qrData = JSON.stringify(ticketData)
      const qrCodeSVG = await QRCode.toString(qrData, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      return qrCodeSVG
    } catch (error) {
      console.error('QR code SVG generation failed:', error)
      throw new Error('Failed to generate QR code SVG')
    }
  }

  /**
   * Validate QR code data
   */
  validateQRCode(qrData: string): QRValidationResult {
    try {
      const ticketData: TicketQRData = JSON.parse(qrData)
      
      // Check if all required fields are present
      if (!ticketData.ticketId || !ticketData.eventId || !ticketData.userId || !ticketData.signature) {
        return {
          isValid: false,
          error: 'Invalid QR code data structure'
        }
      }

      // Validate signature
      const expectedSignature = this.generateSignature({
        ticketId: ticketData.ticketId,
        eventId: ticketData.eventId,
        userId: ticketData.userId,
        ticketType: ticketData.ticketType,
        purchaseDate: ticketData.purchaseDate
      })

      if (ticketData.signature !== expectedSignature) {
        return {
          isValid: false,
          error: 'Invalid QR code signature'
        }
      }

      // Check if ticket is not expired (valid for 30 days after purchase)
      const purchaseDate = new Date(ticketData.purchaseDate)
      const expirationDate = new Date(purchaseDate.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
      
      if (new Date() > expirationDate) {
        return {
          isValid: false,
          error: 'QR code has expired'
        }
      }

      return {
        isValid: true,
        ticketData
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid QR code format'
      }
    }
  }

  /**
   * Generate a unique ticket ID
   */
  generateTicketId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `TKT-${timestamp}-${random}`.toUpperCase()
  }

  /**
   * Generate QR code for ticket scanning
   */
  async generateTicketQR(ticketId: string, eventId: string, userId: string, ticketType: string): Promise<string> {
    const ticketData = this.generateTicketQRData({
      ticketId,
      eventId,
      userId,
      ticketType: ticketType as any,
      purchaseDate: new Date().toISOString()
    })

    return await this.generateQRCode(ticketData)
  }
}

// Export singleton instance
export const qrService = QRService.getInstance()
