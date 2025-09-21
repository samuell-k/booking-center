const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

class EmailService {
  constructor() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      this.from = process.env.EMAIL_FROM || 'SmartSports Rwanda <noreply@smartsports.rw>';
      this.templatesPath = path.join(__dirname, '../templates/email');
    } catch (error) {
      logger.error('EmailService initialization failed:', error);
      this.transporter = null;
    }
  }

  // Send email with template
  async sendEmail({ to, subject, template, data = {}, attachments = [] }) {
    try {
      if (!this.transporter) {
        logger.warn('Email service not initialized, skipping email send');
        return { success: false, error: 'Email service not available' };
      }

      let html = '';

      if (template) {
        html = await this.renderTemplate(template, data);
      } else if (data.html) {
        html = data.html;
      } else {
        throw new AppError('Email template or HTML content required', 400);
      }

      const mailOptions = {
        from: this.from,
        to,
        subject,
        html,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);

      logger.logInfo('Email sent successfully', {
        to,
        subject,
        template,
        messageId: result.messageId
      });

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      logger.error('Email sending failed:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  // Render email template
  async renderTemplate(templateName, data) {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      
      return template({
        ...data,
        baseUrl: process.env.FRONTEND_URL,
        currentYear: new Date().getFullYear(),
        companyName: 'SmartSports Rwanda'
      });
    } catch (error) {
      logger.error('Template rendering failed:', error);
      throw new AppError('Failed to render email template', 500);
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    return await this.sendEmail({
      to: user.email,
      subject: 'Welcome to SmartSports Rwanda! 🎉',
      template: 'welcome',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        referralCode: user.referral_code
      }
    });
  }

  // Send email verification
  async sendEmailVerification(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    return await this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        verificationUrl
      }
    });
  }

  // Send password reset email
  async sendPasswordReset(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    return await this.sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        resetUrl
      }
    });
  }

  // Send ticket confirmation email with individual QR codes
  async sendTicketConfirmation(user, tickets, event, payment, qrCodes = []) {
    const ticketAttachments = [];

    // Generate PDF tickets as attachments
    for (const ticket of tickets) {
      try {
        const pdfBuffer = await this.generateTicketPDF(ticket, event);
        ticketAttachments.push({
          filename: `ticket-${ticket.ticket_number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        });
      } catch (error) {
        logger.error('Failed to generate ticket PDF:', error);
      }
    }

    // Add individual QR code PNG attachments
    for (const qrCode of qrCodes) {
      try {
        if (qrCode.qrBuffer) {
          ticketAttachments.push({
            filename: `qr-code-${qrCode.ticketNumber}.png`,
            content: qrCode.qrBuffer,
            contentType: 'image/png'
          });
        }
      } catch (error) {
        logger.error('Failed to attach QR code:', error);
      }
    }

    return await this.sendEmail({
      to: user.email,
      subject: `Your Tickets for ${event.title}`,
      template: 'ticket-confirmation',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        event: {
          title: event.title,
          date: new Date(event.start_datetime).toLocaleDateString(),
          time: new Date(event.start_datetime).toLocaleTimeString(),
          venue: event.venue_name
        },
        tickets: tickets.map(ticket => ({
          number: ticket.ticket_number,
          type: ticket.ticket_type,
          price: ticket.price,
          seat: ticket.seat_number ? `${ticket.section} - Row ${ticket.row} - Seat ${ticket.seat_number}` : 'General Admission'
        })),
        payment: {
          reference: payment.payment_reference,
          total: payment.total_amount,
          method: payment.payment_method
        },
        totalTickets: tickets.length,
        totalAmount: payment.total_amount,
        qrCodesCount: qrCodes.length
      },
      attachments: ticketAttachments
    });
  }

  // Send individual QR codes email
  async sendIndividualQRCodes(user, tickets, event, payment, qrCodes) {
    const qrAttachments = [];

    // Add individual QR code PNG attachments
    for (const qrCode of qrCodes) {
      try {
        if (qrCode.qrBuffer) {
          qrAttachments.push({
            filename: `ticket-${qrCode.ticketNumber}-qr.png`,
            content: qrCode.qrBuffer,
            contentType: 'image/png'
          });
        }
      } catch (error) {
        logger.error('Failed to attach QR code:', error);
      }
    }

    return await this.sendEmail({
      to: user.email,
      subject: `Your QR Codes for ${event.title}`,
      template: 'qr-codes',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        event: {
          title: event.title,
          date: new Date(event.start_datetime).toLocaleDateString(),
          time: new Date(event.start_datetime).toLocaleTimeString(),
          venue: event.venue_name
        },
        tickets: tickets.map((ticket, index) => ({
          number: ticket.ticket_number,
          type: ticket.ticket_type,
          price: ticket.price,
          qrCode: qrCodes[index]?.qrImage || null
        })),
        payment: {
          reference: payment.payment_reference,
          total: payment.total_amount,
          method: payment.payment_method
        },
        totalTickets: tickets.length,
        instructions: [
          'Save these QR codes to your phone or print them',
          'Each QR code is valid for one person only',
          'Arrive at the venue 30 minutes before the event',
          'Present your QR code at the entrance for scanning'
        ]
      },
      attachments: qrAttachments
    });
  }

  // Send event reminder email
  async sendEventReminder(user, event, tickets) {
    return await this.sendEmail({
      to: user.email,
      subject: `Reminder: ${event.title} is Tomorrow!`,
      template: 'event-reminder',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        event: {
          title: event.title,
          date: new Date(event.start_datetime).toLocaleDateString(),
          time: new Date(event.start_datetime).toLocaleTimeString(),
          venue: event.venue_name,
          address: event.venue_address
        },
        ticketCount: tickets.length,
        qrCodes: tickets.map(t => t.qr_code)
      }
    });
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(user, payment) {
    return await this.sendEmail({
      to: user.email,
      subject: 'Payment Confirmation',
      template: 'payment-confirmation',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        payment: {
          reference: payment.payment_reference,
          amount: payment.total_amount,
          method: payment.payment_method,
          date: new Date(payment.completed_at).toLocaleDateString()
        }
      }
    });
  }

  // Send wallet topup confirmation
  async sendWalletTopupConfirmation(user, transaction) {
    return await this.sendEmail({
      to: user.email,
      subject: 'Wallet Top-up Successful',
      template: 'wallet-topup',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        transaction: {
          reference: transaction.transaction_reference,
          amount: transaction.amount,
          newBalance: transaction.balance_after,
          date: new Date(transaction.completed_at).toLocaleDateString()
        }
      }
    });
  }

  // Send event cancellation email
  async sendEventCancellation(user, event, tickets) {
    return await this.sendEmail({
      to: user.email,
      subject: `Event Cancelled: ${event.title}`,
      template: 'event-cancellation',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        event: {
          title: event.title,
          originalDate: new Date(event.start_datetime).toLocaleDateString(),
          venue: event.venue_name,
          reason: event.cancellation_reason
        },
        ticketCount: tickets.length,
        refundAmount: tickets.reduce((sum, ticket) => sum + ticket.price, 0)
      }
    });
  }

  // Send promotional email
  async sendPromotionalEmail(user, promotion) {
    return await this.sendEmail({
      to: user.email,
      subject: promotion.subject,
      template: 'promotional',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        promotion: {
          title: promotion.title,
          description: promotion.description,
          discount: promotion.discount,
          code: promotion.code,
          validUntil: promotion.validUntil,
          ctaUrl: promotion.ctaUrl
        }
      }
    });
  }

  // Generate ticket PDF (placeholder - would use a PDF library like puppeteer or pdf-lib)
  async generateTicketPDF(ticket, event) {
    // This is a placeholder - in a real implementation, you would use
    // a library like puppeteer, pdf-lib, or jsPDF to generate the PDF
    const PDFDocument = require('pdf-lib').PDFDocument;
    
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      
      // Add ticket content (simplified)
      const { width, height } = page.getSize();
      
      page.drawText(`SmartSports Rwanda`, {
        x: 50,
        y: height - 50,
        size: 20
      });
      
      page.drawText(`${event.title}`, {
        x: 50,
        y: height - 100,
        size: 16
      });
      
      page.drawText(`Ticket: ${ticket.ticket_number}`, {
        x: 50,
        y: height - 150,
        size: 12
      });
      
      page.drawText(`Date: ${new Date(event.start_datetime).toLocaleDateString()}`, {
        x: 50,
        y: height - 180,
        size: 12
      });
      
      page.drawText(`QR Code: ${ticket.qr_code}`, {
        x: 50,
        y: height - 210,
        size: 10
      });
      
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
      
    } catch (error) {
      logger.error('PDF generation failed:', error);
      throw new AppError('Failed to generate ticket PDF', 500);
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}

// Temporarily disable to test server startup
// module.exports = new EmailService();
module.exports = {
  sendEmail: () => Promise.resolve({ success: false, error: 'Email service disabled' }),
  sendWelcomeEmail: () => Promise.resolve({ success: false }),
  sendEmailVerification: () => Promise.resolve({ success: false }),
  sendPasswordReset: () => Promise.resolve({ success: false }),
  sendTicketConfirmation: () => Promise.resolve({ success: false }),
  sendEventReminder: () => Promise.resolve({ success: false }),
  sendPaymentConfirmation: () => Promise.resolve({ success: false }),
  sendWalletTopupConfirmation: () => Promise.resolve({ success: false }),
  sendEventCancellation: () => Promise.resolve({ success: false }),
  sendPromotionalEmail: () => Promise.resolve({ success: false }),
  testConnection: () => Promise.resolve(false)
};
