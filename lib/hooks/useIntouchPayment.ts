'use client'

import { useState, useCallback } from 'react'

export interface PaymentRequest {
  phoneNumber: string
  amount: number
  description?: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  intouchpayTransactionId?: string
  message?: string
  responseCode?: string
}

export interface TransactionStatus {
  success: boolean
  status?: string
  message?: string
  responseCode?: string
}

export interface UseIntouchPaymentReturn {
  isLoading: boolean
  error: string | null
  requestPayment: (request: PaymentRequest) => Promise<PaymentResult>
  checkTransactionStatus: (transactionId: string, intouchpayTransactionId: string) => Promise<TransactionStatus>
  getAccountBalance: () => Promise<{ success: boolean; balance?: number; message?: string }>
  clearError: () => void
}

export function useIntouchPayment(): UseIntouchPaymentReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const requestPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Payment request failed')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment request failed'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkTransactionStatus = useCallback(async (
    transactionId: string, 
    intouchpayTransactionId: string
  ): Promise<TransactionStatus> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestTransactionId: transactionId,
          intouchpayTransactionId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Status check failed')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Status check failed'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAccountBalance = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Balance check failed')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Balance check failed'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    requestPayment,
    checkTransactionStatus,
    getAccountBalance,
    clearError
  }
}
