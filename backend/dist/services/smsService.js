const twilio = require('twilio');
const AfricasTalking = require('africastalking');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
class SMSService {
    constructor() {
        // Initialize Twilio client
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            this.twilioPhone = process.env.TWILIO_PHONE_NUMBER;
        }
        // Initialize Africa's Talking client
        if (process.env.AFRICAS_TALKING_USERNAME && process.env.AFRICAS_TALKING_API_KEY) {
            this.africasTalking = AfricasTalking({
                apiKey: process.env.AFRICAS_TALKING_API_KEY,
                username: process.env.AFRICAS_TALKING_USERNAME
            });
            this.atSMS = this.africasTalking.SMS;
            this.atSenderId = process.env.AFRICAS_TALKING_SENDER_ID || 'SmartSports';
        }
        // Default to Africa's Talking for Rwanda
        this.defaultProvider = 'africastalking';
    }
    // Send SMS
    async sendSMS({ to, message, provider = this.defaultProvider }) {
        try {
            // Normalize phone number
            const phoneNumber = this.normalizePhoneNumber(to);
            let result;
            switch (provider) {
                case 'twilio':
                    result = await this.sendTwilioSMS(phoneNumber, message);
                    break;
                case 'africastalking':
                    result = await this.sendAfricasTalkingSMS(phoneNumber, message);
                    break;
                default:
                    throw new AppError('Unsupported SMS provider', 400);
            }
            logger.logInfo('SMS sent successfully', {
                to: phoneNumber,
                provider,
                messageId: result.messageId
            });
            return {
                success: true,
                messageId: result.messageId,
                provider
            };
        }
        catch (error) {
            logger.error('SMS sending failed:', error);
            throw new AppError('Failed to send SMS', 500);
        }
    }
    // Send SMS via Twilio
    async sendTwilioSMS(to, message) {
        if (!this.twilioClient) {
            throw new AppError('Twilio not configured', 500);
        }
        try {
            const result = await this.twilioClient.messages.create({
                body: message,
                from: this.twilioPhone,
                to: to
            });
            return {
                messageId: result.sid,
                status: result.status
            };
        }
        catch (error) {
            logger.error('Twilio SMS failed:', error);
            throw error;
        }
    }
    // Send SMS via Africa's Talking
    async sendAfricasTalkingSMS(to, message) {
        if (!this.atSMS) {
            throw new AppError('Africa\'s Talking not configured', 500);
        }
        try {
            const options = {
                to: [to],
                message: message,
                from: this.atSenderId
            };
            const result = await this.atSMS.send(options);
            if (result.SMSMessageData.Recipients.length > 0) {
                const recipient = result.SMSMessageData.Recipients[0];
                if (recipient.status === 'Success') {
                    return {
                        messageId: recipient.messageId,
                        status: 'sent'
                    };
                }
                else {
                    throw new AppError(`SMS failed: ${recipient.status}`, 500);
                }
            }
            else {
                throw new AppError('No recipients processed', 500);
            }
        }
        catch (error) {
            logger.error('Africa\'s Talking SMS failed:', error);
            throw error;
        }
    }
    // Normalize phone number for Rwanda
    normalizePhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        let normalized = phoneNumber.replace(/\D/g, '');
        // Handle different formats
        if (normalized.startsWith('250')) {
            // Already has country code
            return `+${normalized}`;
        }
        else if (normalized.startsWith('0')) {
            // Remove leading 0 and add country code
            return `+250${normalized.substring(1)}`;
        }
        else if (normalized.length === 9) {
            // Just the local number
            return `+250${normalized}`;
        }
        else {
            // Invalid format
            throw new AppError('Invalid phone number format', 400);
        }
    }
    // Send verification code SMS
    async sendVerificationCode(phoneNumber, code) {
        const message = `Your SmartSports Rwanda verification code is: ${code}. This code expires in 10 minutes.`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send ticket confirmation SMS
    async sendTicketConfirmation(phoneNumber, ticketDetails) {
        const message = `Your tickets for ${ticketDetails.eventTitle} have been confirmed! ` +
            `Ticket numbers: ${ticketDetails.ticketNumbers.join(', ')}. ` +
            `Event date: ${ticketDetails.eventDate}. ` +
            `Show this SMS and your ID at the venue.`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send payment confirmation SMS
    async sendPaymentConfirmation(phoneNumber, paymentDetails) {
        const message = `Payment confirmed! Amount: ${paymentDetails.amount} RWF. ` +
            `Reference: ${paymentDetails.reference}. ` +
            `Thank you for using SmartSports Rwanda!`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send event reminder SMS
    async sendEventReminder(phoneNumber, eventDetails) {
        const message = `Reminder: ${eventDetails.eventTitle} is tomorrow at ${eventDetails.time}! ` +
            `Venue: ${eventDetails.venue}. ` +
            `Don't forget to bring your tickets and ID. See you there!`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send wallet topup confirmation SMS
    async sendWalletTopupConfirmation(phoneNumber, topupDetails) {
        const message = `Wallet topped up successfully! ` +
            `Amount: ${topupDetails.amount} RWF. ` +
            `New balance: ${topupDetails.newBalance} RWF. ` +
            `Reference: ${topupDetails.reference}`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send low balance alert SMS
    async sendLowBalanceAlert(phoneNumber, balance) {
        const message = `Your SmartSports wallet balance is low: ${balance} RWF. ` +
            `Top up now to avoid missing out on tickets!`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send event cancellation SMS
    async sendEventCancellation(phoneNumber, eventDetails) {
        const message = `IMPORTANT: ${eventDetails.eventTitle} on ${eventDetails.date} has been cancelled. ` +
            `Your tickets will be refunded automatically. ` +
            `We apologize for any inconvenience.`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send security alert SMS
    async sendSecurityAlert(phoneNumber, alertDetails) {
        const message = `Security Alert: ${alertDetails.message} ` +
            `If this wasn't you, please contact support immediately. ` +
            `Time: ${alertDetails.timestamp}`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Send promotional SMS
    async sendPromotionalSMS(phoneNumber, promotion) {
        const message = `🎉 ${promotion.title}! ` +
            `${promotion.description} ` +
            `Use code: ${promotion.code}. ` +
            `Valid until: ${promotion.validUntil}. ` +
            `Book now at smartsports.rw`;
        return await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
    // Bulk SMS sending
    async sendBulkSMS(recipients, message) {
        const results = [];
        for (const recipient of recipients) {
            try {
                const result = await this.sendSMS({
                    to: recipient.phoneNumber,
                    message: this.personalizeMessage(message, recipient)
                });
                results.push({
                    phoneNumber: recipient.phoneNumber,
                    success: true,
                    messageId: result.messageId
                });
            }
            catch (error) {
                results.push({
                    phoneNumber: recipient.phoneNumber,
                    success: false,
                    error: error.message
                });
            }
        }
        return results;
    }
    // Personalize message with recipient data
    personalizeMessage(template, recipient) {
        let message = template;
        // Replace placeholders
        message = message.replace(/\{name\}/g, recipient.name || '');
        message = message.replace(/\{firstName\}/g, recipient.firstName || '');
        message = message.replace(/\{lastName\}/g, recipient.lastName || '');
        return message;
    }
    // Check SMS delivery status
    async checkDeliveryStatus(messageId, provider = this.defaultProvider) {
        try {
            switch (provider) {
                case 'twilio':
                    return await this.checkTwilioStatus(messageId);
                case 'africastalking':
                    return await this.checkAfricasTalkingStatus(messageId);
                default:
                    throw new AppError('Unsupported SMS provider', 400);
            }
        }
        catch (error) {
            logger.error('SMS status check failed:', error);
            return { status: 'unknown', error: error.message };
        }
    }
    // Check Twilio message status
    async checkTwilioStatus(messageId) {
        if (!this.twilioClient) {
            throw new AppError('Twilio not configured', 500);
        }
        const message = await this.twilioClient.messages(messageId).fetch();
        return {
            status: message.status,
            errorCode: message.errorCode,
            errorMessage: message.errorMessage,
            dateUpdated: message.dateUpdated
        };
    }
    // Check Africa's Talking message status
    async checkAfricasTalkingStatus(messageId) {
        // Africa's Talking doesn't provide a direct status check API
        // This would typically be handled via webhooks
        return {
            status: 'sent',
            note: 'Status tracking via webhooks'
        };
    }
    // Test SMS service
    async testService() {
        try {
            const testNumber = process.env.TEST_PHONE_NUMBER;
            if (!testNumber) {
                throw new AppError('Test phone number not configured', 500);
            }
            await this.sendSMS({
                to: testNumber,
                message: 'SmartSports Rwanda SMS service test - working correctly!'
            });
            logger.info('SMS service test successful');
            return true;
        }
        catch (error) {
            logger.error('SMS service test failed:', error);
            return false;
        }
    }
}
module.exports = new SMSService();
//# sourceMappingURL=smsService.js.map