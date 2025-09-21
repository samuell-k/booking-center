/**
 * Utility functions for Rwandan phone number validation and formatting
 */

export interface PhoneValidationResult {
  isValid: boolean
  message?: string
  formattedNumber?: string
}

/**
 * Validates Rwandan phone numbers according to the requirements:
 * - MTN Rwanda: 078 or 079
 * - Airtel Rwanda: 072 or 073
 * - Can include country code (+250) for 13 digits total
 * - Without country code: 10 digits
 */
export function validateRwandanPhoneNumber(phoneNumber: string): PhoneValidationResult {
  // Remove all non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // Check if empty
  if (!cleanPhone) {
    return {
      isValid: false,
      message: "Phone number is required"
    }
  }
  
  let normalizedPhone = cleanPhone
  
  // Handle country code cases
  if (cleanPhone.startsWith('250')) {
    // With country code - should be 13 digits total
    if (cleanPhone.length !== 12) {
      return {
        isValid: false,
        message: "Phone number with country code must be 12 digits (250XXXXXXXXX)"
      }
    }
    normalizedPhone = cleanPhone.substring(3) // Remove country code for validation
  } else if (cleanPhone.startsWith('+250')) {
    // Handle +250 prefix
    const withoutPlus = cleanPhone.substring(4)
    if (withoutPlus.length !== 9) {
      return {
        isValid: false,
        message: "Phone number with country code must be 13 digits (+250XXXXXXXXX)"
      }
    }
    normalizedPhone = withoutPlus
  } else {
    // Without country code - should be 10 digits
    if (cleanPhone.length !== 10) {
      return {
        isValid: false,
        message: "Phone number must be 10 digits (07XXXXXXXX)"
      }
    }
  }
  
  // Validate the actual phone number format (without country code)
  if (normalizedPhone.length !== 9) {
    return {
      isValid: false,
      message: "Invalid phone number format"
    }
  }
  
  // Check for valid prefixes
  const prefix = normalizedPhone.substring(0, 2)
  const validPrefixes = ['78', '79', '72', '73'] // MTN: 78, 79; Airtel: 72, 73
  
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      message: "Phone number must start with 078, 079 (MTN) or 072, 073 (Airtel)"
    }
  }
  
  // Format the number for display (with country code)
  const formattedNumber = `250${normalizedPhone}`
  
  return {
    isValid: true,
    formattedNumber
  }
}

/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  if (cleanPhone.length === 0) return ''
  
  // If it starts with 250, format as: 250 7XX XXX XXX
  if (cleanPhone.startsWith('250') && cleanPhone.length === 12) {
    return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`
  }
  
  // If it's 10 digits starting with 07, format as: 07X XXX XXX
  if (cleanPhone.length === 10 && cleanPhone.startsWith('07')) {
    return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`
  }
  
  // For partial numbers, format progressively
  if (cleanPhone.length <= 3) return cleanPhone
  if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`
  if (cleanPhone.length <= 9) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`
  
  return cleanPhone
}

/**
 * Normalizes a phone number to the standard format (250XXXXXXXXX)
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  const validation = validateRwandanPhoneNumber(phoneNumber)
  return validation.formattedNumber || phoneNumber
}
