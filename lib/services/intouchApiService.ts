/**
 * InTouch API Service for SmartSports Rwanda
 * Handles all interactions with the InTouch Payment API
 */

// InTouch API Configuration
const INTOUCH_CONFIG = {
  username: 'testa',
  partnerPassword: '+$J<wtZktTDs&-Mk("h5=<PH#Jf769P5/Z<*xbR~',
  accountId: '250160000011',
  baseUrl: 'https://www.intouchpay.co.rw/api/',
  requestPaymentUrl: 'https://www.intouchpay.co.rw/api/requestpayment/',
  requestDepositUrl: 'https://www.intouchpay.co.rw/api/requestdeposit/',
  getTransactionStatusUrl: 'https://www.intouchpay.co.rw/api/gettransactionstatus/',
  getBalanceUrl: 'https://www.intouchpay.co.rw/api/getbalance/',
  callbackUrl: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001') + '/api/payments/callback'
}

// Response codes mapping
const RESPONSE_CODES: Record<string, string> = {
  '1000': 'Pending',
  '01': 'Successful',
  '0002': 'Missing Username Information',
  '0003': 'Missing Password Information',
  '0004': 'Missing Date Information',
  '0005': 'Invalid Password',
  '0006': 'User Does not have an intouchPay Account',
  '0007': 'No such user',
  '0008': 'Failed to Authenticate',
  '2100': 'Amount should be greater than 0',
  '2200': 'Amount below minimum',
  '2300': 'Amount above maximum',
  '2400': 'Duplicate Transaction ID',
  '2500': 'Route Not Found',
  '2600': 'Operation Not Allowed',
  '2700': 'Failed to Complete Transaction',
  '1005': 'Failed Due to Insufficient Funds',
  '1002': 'Mobile number not registered on mobile money',
  '1008': 'General Failure',
  '1200': 'Invalid Number',
  '1100': 'Number not supported on this Mobile money network',
  '1300': 'Failed to Complete Transaction, Unknown Exception',
  '2001': 'Request Successful'
}

// Types
export interface PaymentRequest {
  phoneNumber: string
  amount: number
  description?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  intouchpayTransactionId?: string
  message?: string
  responseCode?: string
}

export interface TransactionStatus {
  success: boolean
  status?: string
  responseCode?: string
  message?: string
}

export interface AccountBalance {
  success: boolean
  balance?: number
  message?: string
}

/**
 * Utility functions
 */
function generateTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

async function generatePassword(username: string, accountno: string, partnerpassword: string, timestamp: string): Promise<string> {
  const string = username + accountno + partnerpassword + timestamp

  // For server-side (Node.js)
  if (typeof window === 'undefined') {
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(string).digest('hex')
  }

  // For client-side (browser)
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(string))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateTransactionId(): string {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 9000 + 1000)
}

function validateRwandanPhoneNumber(phone: string): boolean {
  // Must be exactly 12 numeric characters
  if (!/^\d{12}$/.test(phone)) {
    return false
  }
  
  // Check if it starts with valid Rwandan prefixes
  const validPrefixes = [
    '250078', '250079', // MTN
    '250072', '250073', '250075', '250076', '250077', // Airtel
    '250781', '250782', '250783', '250784', '250785', '250786', '250787', '250788', '250789', // MTN
    '250720', '250721', '250722', '250723', '250724', '250725', '250726', '250727', '250728', '250729' // Airtel
  ]
  
  return validPrefixes.some(prefix => phone.startsWith(prefix))
}

function formatPhoneNumber(phone: string): string {
  if (phone.length === 12) {
    return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 9)} ${phone.substring(9)}`
  }
  return phone
}

/**
 * InTouch API Service Class
 */
export class IntouchApiService {
  private static instance: IntouchApiService | null = null

  private constructor() {}

  static getInstance(): IntouchApiService {
    if (!IntouchApiService.instance) {
      IntouchApiService.instance = new IntouchApiService()
    }
    return IntouchApiService.instance
  }

  /**
   * Make API call to InTouch
   */
  private async makeApiCall(url: string, data: Record<string, any>, method: 'GET' | 'POST' = 'POST'): Promise<any> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000,
      }

      if (method === 'POST') {
        const formData = new URLSearchParams()
        Object.keys(data).forEach(key => {
          formData.append(key, data[key])
        })
        options.body = formData
      }

      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      
      try {
        return JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText)
        throw new Error('Invalid JSON response from API')
      }
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  /**
   * Request payment from customer
   */
  async requestPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { phoneNumber, amount, description = '' } = paymentRequest

      // Validate inputs
      if (!validateRwandanPhoneNumber(phoneNumber)) {
        return {
          success: false,
          message: 'Invalid Rwandan phone number'
        }
      }

      if (amount <= 0 || amount < 100) {
        return {
          success: false,
          message: 'Amount must be at least 100 RWF'
        }
      }

      // Generate required parameters
      const timestamp = generateTimestamp()
      const requestTransactionId = generateTransactionId()
      const password = await generatePassword(
        INTOUCH_CONFIG.username,
        INTOUCH_CONFIG.accountId,
        INTOUCH_CONFIG.partnerPassword,
        timestamp
      )

      // Prepare data for IntouchPay API
      const data = {
        username: INTOUCH_CONFIG.username,
        timestamp,
        amount: amount.toString(),
        password,
        mobilephone: phoneNumber,
        requesttransactionid: requestTransactionId,
        accountno: INTOUCH_CONFIG.accountId,
        callbackurl: INTOUCH_CONFIG.callbackUrl
      }

      console.log('Initiating payment request:', { ...data, password: '[HIDDEN]' })

      const response = await this.makeApiCall(INTOUCH_CONFIG.requestPaymentUrl, data)

      if (response && response.success) {
        return {
          success: true,
          transactionId: requestTransactionId,
          intouchpayTransactionId: response.transactionid || response.transaction_id,
          message: 'Payment request sent successfully'
        }
      } else {
        const errorMessage = response?.message || RESPONSE_CODES[response?.responsecode] || 'Payment request failed'
        return {
          success: false,
          message: errorMessage,
          responseCode: response?.responsecode
        }
      }
    } catch (error) {
      console.error('Payment request failed:', error)
      return {
        success: false,
        message: 'Payment request failed due to network error'
      }
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(requestTransactionId: string, intouchpayTransactionId: string): Promise<TransactionStatus> {
    try {
      const timestamp = generateTimestamp()
      const password = await generatePassword(
        INTOUCH_CONFIG.username,
        INTOUCH_CONFIG.accountId,
        INTOUCH_CONFIG.partnerPassword,
        timestamp
      )

      const data = {
        username: INTOUCH_CONFIG.username,
        timestamp,
        password,
        requesttransactionid: requestTransactionId,
        transactionid: intouchpayTransactionId
      }

      const response = await this.makeApiCall(INTOUCH_CONFIG.getTransactionStatusUrl, data)

      if (response) {
        return {
          success: response.success || false,
          status: response.status,
          responseCode: response.responsecode,
          message: response.message || RESPONSE_CODES[response.responsecode] || 'Unknown status'
        }
      } else {
        return {
          success: false,
          message: 'Failed to get transaction status'
        }
      }
    } catch (error) {
      console.error('Get transaction status failed:', error)
      return {
        success: false,
        message: 'Failed to get transaction status due to network error'
      }
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(): Promise<AccountBalance> {
    try {
      const timestamp = generateTimestamp()
      const password = await generatePassword(
        INTOUCH_CONFIG.username,
        INTOUCH_CONFIG.accountId,
        INTOUCH_CONFIG.partnerPassword,
        timestamp
      )

      const data = {
        username: INTOUCH_CONFIG.username,
        timestamp,
        accountno: INTOUCH_CONFIG.accountId,
        password
      }

      const response = await this.makeApiCall(INTOUCH_CONFIG.getBalanceUrl, data)

      if (response && response.success) {
        return {
          success: true,
          balance: parseFloat(response.balance) || 0
        }
      } else {
        return {
          success: false,
          message: response?.message || RESPONSE_CODES[response?.responsecode] || 'Failed to get balance'
        }
      }
    } catch (error) {
      console.error('Get balance failed:', error)
      return {
        success: false,
        message: 'Failed to get balance due to network error'
      }
    }
  }

  /**
   * Utility methods
   */
  validatePhoneNumber = validateRwandanPhoneNumber
  formatPhoneNumber = formatPhoneNumber
  getResponseCodeMessage = (code: string) => RESPONSE_CODES[code] || 'Unknown response code'
}

// Export singleton instance
export const intouchApiService = IntouchApiService.getInstance()
