const QRCode = require('qrcode');
const crypto = require('crypto');
const { db } = require('../config/database');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
class QRService {
    constructor() {
        this.qrOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: process.env.QR_CODE_COLOR_DARK || '#000000',
                light: process.env.QR_CODE_COLOR_LIGHT || '#FFFFFF'
            },
            width: parseInt(process.env.QR_CODE_SIZE) || 300
        };
    }
    // Generate QR code for ticket
    async generateTicketQR(ticketData) {
        try {
            const { ticket_id, ticket_number, event_id, user_id, ticket_type, seat_number, section, row } = ticketData;
            // Create secure QR data
            const qrData = {
                id: ticket_id,
                num: ticket_number,
                evt: event_id,
                usr: user_id,
                typ: ticket_type,
                seat: seat_number,
                sec: section,
                row: row,
                ts: Date.now() // timestamp
            };
            // Generate signature for security
            const signature = this.generateSignature(qrData);
            qrData.sig = signature;
            // Convert to JSON string
            const qrString = JSON.stringify(qrData);
            // Generate QR code image
            const qrCodeBuffer = await QRCode.toBuffer(qrString, this.qrOptions);
            const qrCodeDataURL = await QRCode.toDataURL(qrString, this.qrOptions);
            // Store QR code data in cache for quick validation
            await cache.set(`qr:${ticket_id}`, qrString, 24 * 60 * 60); // 24 hours
            logger.logInfo('QR code generated', {
                ticketId: ticket_id,
                ticketNumber: ticket_number,
                eventId: event_id
            });
            return {
                qrString,
                qrCodeBuffer,
                qrCodeDataURL,
                signature
            };
        }
        catch (error) {
            logger.error('QR code generation failed:', error);
            throw new AppError('Failed to generate QR code', 500);
        }
    }
    // Generate signature for QR data security
    generateSignature(data) {
        const secretKey = process.env.QR_SECRET_KEY || process.env.JWT_SECRET;
        const dataString = JSON.stringify(data);
        return crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
    }
    // Verify QR code signature
    verifySignature(data, signature) {
        const expectedSignature = this.generateSignature(data);
        return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
    }
    // Validate QR code
    async validateQR(qrString, scannerInfo = {}) {
        try {
            // Parse QR data
            let qrData;
            try {
                qrData = JSON.parse(qrString);
            }
            catch (error) {
                return {
                    valid: false,
                    reason: 'Invalid QR code format',
                    code: 'INVALID_FORMAT'
                };
            }
            // Check required fields
            if (!qrData.id || !qrData.num || !qrData.evt || !qrData.sig) {
                return {
                    valid: false,
                    reason: 'Missing required QR data',
                    code: 'MISSING_DATA'
                };
            }
            // Verify signature
            const { sig, ...dataToVerify } = qrData;
            if (!this.verifySignature(dataToVerify, sig)) {
                return {
                    valid: false,
                    reason: 'Invalid QR code signature',
                    code: 'INVALID_SIGNATURE'
                };
            }
            // Get ticket from database
            const ticket = await db('tickets')
                .join('events', 'tickets.event_id', 'events.id')
                .join('venues', 'events.venue_id', 'venues.id')
                .select('tickets.*', 'events.title as event_title', 'events.start_datetime', 'events.end_datetime', 'events.status as event_status', 'venues.name as venue_name')
                .where('tickets.id', qrData.id)
                .first();
            if (!ticket) {
                return {
                    valid: false,
                    reason: 'Ticket not found',
                    code: 'TICKET_NOT_FOUND'
                };
            }
            // Validate ticket data matches QR
            if (ticket.ticket_number !== qrData.num || ticket.event_id !== qrData.evt) {
                return {
                    valid: false,
                    reason: 'QR data mismatch',
                    code: 'DATA_MISMATCH'
                };
            }
            // Check ticket status
            if (ticket.status === 'cancelled') {
                return {
                    valid: false,
                    reason: 'Ticket has been cancelled',
                    code: 'TICKET_CANCELLED'
                };
            }
            if (ticket.status === 'refunded') {
                return {
                    valid: false,
                    reason: 'Ticket has been refunded',
                    code: 'TICKET_REFUNDED'
                };
            }
            if (ticket.status === 'used') {
                return {
                    valid: false,
                    reason: 'Ticket has already been used',
                    code: 'TICKET_ALREADY_USED',
                    usedAt: ticket.used_at
                };
            }
            if (ticket.status === 'expired') {
                return {
                    valid: false,
                    reason: 'Ticket has expired',
                    code: 'TICKET_EXPIRED'
                };
            }
            // Check event status
            if (ticket.event_status === 'cancelled') {
                return {
                    valid: false,
                    reason: 'Event has been cancelled',
                    code: 'EVENT_CANCELLED'
                };
            }
            if (ticket.event_status === 'postponed') {
                return {
                    valid: false,
                    reason: 'Event has been postponed',
                    code: 'EVENT_POSTPONED'
                };
            }
            // Check event timing
            const now = new Date();
            const eventStart = new Date(ticket.start_datetime);
            const eventEnd = new Date(ticket.end_datetime);
            // Allow entry 2 hours before event and during event
            const entryAllowedFrom = new Date(eventStart.getTime() - 2 * 60 * 60 * 1000);
            if (now < entryAllowedFrom) {
                return {
                    valid: false,
                    reason: 'Too early for entry',
                    code: 'TOO_EARLY',
                    allowedFrom: entryAllowedFrom
                };
            }
            if (now > eventEnd) {
                return {
                    valid: false,
                    reason: 'Event has ended',
                    code: 'EVENT_ENDED'
                };
            }
            // Check venue location (if scanner provides location)
            if (scannerInfo.venueId && ticket.venue_id !== scannerInfo.venueId) {
                return {
                    valid: false,
                    reason: 'Wrong venue',
                    code: 'WRONG_VENUE'
                };
            }
            // All validations passed
            return {
                valid: true,
                ticket: {
                    id: ticket.id,
                    number: ticket.ticket_number,
                    type: ticket.ticket_type,
                    holder: ticket.holder_name,
                    seat: ticket.seat_number,
                    section: ticket.section,
                    row: ticket.row,
                    event: {
                        id: ticket.event_id,
                        title: ticket.event_title,
                        start: ticket.start_datetime,
                        venue: ticket.venue_name
                    }
                }
            };
        }
        catch (error) {
            logger.error('QR validation failed:', error);
            return {
                valid: false,
                reason: 'Validation error',
                code: 'VALIDATION_ERROR'
            };
        }
    }
    // Mark ticket as used after successful scan
    async markTicketAsUsed(ticketId, scannerInfo = {}) {
        try {
            const now = new Date();
            // Update ticket status
            await db('tickets')
                .where({ id: ticketId })
                .update({
                status: 'used',
                used_at: now,
                used_by_scanner: scannerInfo.operatorId,
                scanner_location: scannerInfo.location,
                usage_details: JSON.stringify({
                    scannerId: scannerInfo.scannerId,
                    scannerType: scannerInfo.scannerType,
                    location: scannerInfo.location,
                    timestamp: now.toISOString()
                })
            });
            // Log the scan
            await db('scanner_logs').insert({
                scanner_id: scannerInfo.scannerId || 'unknown',
                scanner_name: scannerInfo.scannerName,
                scanner_location: scannerInfo.location,
                scanner_type: scannerInfo.scannerType || 'kiosk',
                ticket_id: ticketId,
                scanned_at: now,
                scan_result: 'valid',
                ticket_valid: true,
                operator_id: scannerInfo.operatorId,
                device_id: scannerInfo.deviceId,
                ip_address: scannerInfo.ipAddress
            });
            // Remove from cache
            await cache.del(`qr:${ticketId}`);
            logger.logBusiness('Ticket Scanned', {
                ticketId,
                scannerId: scannerInfo.scannerId,
                location: scannerInfo.location,
                timestamp: now
            });
            return true;
        }
        catch (error) {
            logger.error('Failed to mark ticket as used:', error);
            throw new AppError('Failed to process ticket scan', 500);
        }
    }
    // Generate batch QR codes for multiple tickets
    async generateBatchQR(tickets) {
        const results = [];
        for (const ticket of tickets) {
            try {
                const qrResult = await this.generateTicketQR(ticket);
                results.push({
                    ticketId: ticket.ticket_id,
                    ticketNumber: ticket.ticket_number,
                    success: true,
                    qrCode: qrResult.qrString,
                    qrImage: qrResult.qrCodeDataURL,
                    qrBuffer: qrResult.qrCodeBuffer,
                    signature: qrResult.signature
                });
            }
            catch (error) {
                results.push({
                    ticketId: ticket.ticket_id,
                    ticketNumber: ticket.ticket_number || 'Unknown',
                    success: false,
                    error: error.message
                });
            }
        }
        return results;
    }
    // Generate individual QR codes for a purchase (one per ticket quantity)
    async generateIndividualTicketQRs(purchaseData) {
        try {
            const { event_id, user_id, ticket_type, quantity, payment_reference, customer_name, customer_phone, customer_email } = purchaseData;
            const tickets = [];
            const qrResults = [];
            // Generate individual tickets for each quantity
            for (let i = 1; i <= quantity; i++) {
                const ticketNumber = `${payment_reference}-${String(i).padStart(3, '0')}`;
                const ticketId = `${payment_reference}-ticket-${i}`;
                const ticketData = {
                    ticket_id: ticketId,
                    ticket_number: ticketNumber,
                    event_id,
                    user_id,
                    ticket_type,
                    seat_number: `${ticket_type.toUpperCase()}-${String(i).padStart(4, '0')}`,
                    section: ticket_type.toUpperCase(),
                    row: Math.ceil(i / 10), // Simple row calculation
                    customer_name,
                    customer_phone,
                    customer_email,
                    purchase_reference: payment_reference
                };
                tickets.push(ticketData);
                // Generate QR code for this individual ticket
                const qrResult = await this.generateTicketQR(ticketData);
                qrResults.push({
                    ticketId: ticketData.ticket_id,
                    ticketNumber: ticketData.ticket_number,
                    success: true,
                    qrCode: qrResult.qrString,
                    qrImage: qrResult.qrCodeDataURL,
                    qrBuffer: qrResult.qrCodeBuffer,
                    signature: qrResult.signature,
                    ticketData: ticketData
                });
            }
            logger.logInfo('Individual QR codes generated', {
                paymentReference: payment_reference,
                quantity: quantity,
                eventId: event_id,
                userId: user_id
            });
            return {
                success: true,
                tickets: tickets,
                qrCodes: qrResults,
                totalGenerated: quantity
            };
        }
        catch (error) {
            logger.error('Individual QR generation failed:', error);
            throw new AppError('Failed to generate individual QR codes', 500);
        }
    }
    // Generate QR code for wallet
    async generateWalletQR(walletData) {
        try {
            const qrData = {
                type: 'wallet',
                id: walletData.wallet_id,
                num: walletData.wallet_number,
                usr: walletData.user_id,
                ts: Date.now()
            };
            const signature = this.generateSignature(qrData);
            qrData.sig = signature;
            const qrString = JSON.stringify(qrData);
            const qrCodeDataURL = await QRCode.toDataURL(qrString, this.qrOptions);
            return {
                qrString,
                qrCodeDataURL
            };
        }
        catch (error) {
            logger.error('Wallet QR generation failed:', error);
            throw new AppError('Failed to generate wallet QR code', 500);
        }
    }
    // Generate QR code for event check-in
    async generateEventQR(eventData) {
        try {
            const qrData = {
                type: 'event',
                id: eventData.event_id,
                title: eventData.title,
                venue: eventData.venue_id,
                date: eventData.start_datetime,
                ts: Date.now()
            };
            const signature = this.generateSignature(qrData);
            qrData.sig = signature;
            const qrString = JSON.stringify(qrData);
            const qrCodeDataURL = await QRCode.toDataURL(qrString, this.qrOptions);
            return {
                qrString,
                qrCodeDataURL
            };
        }
        catch (error) {
            logger.error('Event QR generation failed:', error);
            throw new AppError('Failed to generate event QR code', 500);
        }
    }
    // Bulk validate QR codes (for batch scanning)
    async bulkValidateQR(qrCodes, scannerInfo = {}) {
        const results = [];
        for (const qrCode of qrCodes) {
            try {
                const validation = await this.validateQR(qrCode, scannerInfo);
                results.push({
                    qrCode,
                    ...validation
                });
            }
            catch (error) {
                results.push({
                    qrCode,
                    valid: false,
                    reason: 'Validation error',
                    error: error.message
                });
            }
        }
        return results;
    }
    // Get QR code statistics
    async getQRStats(eventId = null) {
        try {
            let query = db('scanner_logs');
            if (eventId) {
                query = query.where('event_id', eventId);
            }
            const stats = await query
                .select(db.raw('COUNT(*) as total_scans'), db.raw('COUNT(CASE WHEN scan_result = \'valid\' THEN 1 END) as valid_scans'), db.raw('COUNT(CASE WHEN scan_result = \'invalid\' THEN 1 END) as invalid_scans'), db.raw('COUNT(CASE WHEN scan_result = \'already_used\' THEN 1 END) as duplicate_scans'), db.raw('COUNT(DISTINCT ticket_id) as unique_tickets'), db.raw('COUNT(DISTINCT scanner_id) as active_scanners'))
                .first();
            return {
                totalScans: parseInt(stats.total_scans),
                validScans: parseInt(stats.valid_scans),
                invalidScans: parseInt(stats.invalid_scans),
                duplicateScans: parseInt(stats.duplicate_scans),
                uniqueTickets: parseInt(stats.unique_tickets),
                activeScanners: parseInt(stats.active_scanners),
                successRate: stats.total_scans > 0 ? (stats.valid_scans / stats.total_scans * 100).toFixed(2) : 0
            };
        }
        catch (error) {
            logger.error('Failed to get QR stats:', error);
            throw new AppError('Failed to retrieve QR statistics', 500);
        }
    }
}
module.exports = new QRService();
//# sourceMappingURL=qrService.js.map