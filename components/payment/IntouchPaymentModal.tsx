'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { validateRwandanPhoneNumber } from '@/lib/utils/phone-validation'

interface IntouchPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  description: string
  phoneNumber: string // Add phone number as a required prop
  onPaymentComplete?: (paymentData: any) => void
  onPaymentError?: (error: string) => void
}

interface PaymentState {
  step: 'input' | 'processing' | 'success' | 'error'
  phoneNumber: string
  transactionId?: string
  intouchpayTransactionId?: string
  errorMessage?: string
  processingMessage?: string
  successMessage?: string
  statusCheckInterval?: NodeJS.Timeout
}

export function IntouchPaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  phoneNumber,
  onPaymentComplete,
  onPaymentError
}: IntouchPaymentModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    step: 'input',
    phoneNumber: phoneNumber || ''
  })

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (paymentState.statusCheckInterval) {
        clearInterval(paymentState.statusCheckInterval)
      }
    }
  }, [paymentState.statusCheckInterval])

  if (!isOpen) return null

  // Use the shared validation utility
  const validatePhoneNumber = (phone: string): boolean => {
    const validation = validateRwandanPhoneNumber(phone)
    return validation.isValid
  }



  const handlePaymentRequest = async () => {
    console.log('Initiating payment with phone:', phoneNumber)

    const validation = validateRwandanPhoneNumber(phoneNumber)

    if (!validation.isValid) {
      console.log('Phone validation failed:', validation.message)
      setPaymentState(prev => ({
        ...prev,
        step: 'error',
        errorMessage: validation.message || 'Please enter a valid Rwandan phone number'
      }))
      return
    }

    const cleanPhone = validation.formattedNumber || phoneNumber.replace(/\D/g, '')
    console.log('Clean phone number:', cleanPhone)

    setPaymentState(prev => ({ ...prev, step: 'processing' }))

    try {
      const response = await fetch('/api/payments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          amount,
          description
        })
      })

      const data = await response.json()

      if (data.success) {
        // Payment request was sent successfully, but payment is NOT complete yet
        // We must wait for confirmation from the payment provider
        setPaymentState(prev => ({
          ...prev,
          transactionId: data.transactionId,
          intouchpayTransactionId: data.intouchpayTransactionId,
          step: 'processing' // Move to processing state, not success
        }))

        console.log('Payment request sent, starting status checking...')

        // Start checking payment status - this is where we wait for actual confirmation
        startStatusChecking(data.transactionId, data.intouchpayTransactionId)
      } else {
        console.log('Payment request failed:', data.message)
        setPaymentState(prev => ({
          ...prev,
          step: 'error',
          errorMessage: data.message || 'Payment request failed'
        }))

        if (onPaymentError) {
          onPaymentError(data.message || 'Payment request failed')
        }
      }
    } catch (error) {
      console.error('Payment request error:', error)
      setPaymentState(prev => ({
        ...prev,
        step: 'error',
        errorMessage: 'Network error. Please check your connection and try again.'
      }))
      
      if (onPaymentError) {
        onPaymentError('Network error')
      }
    }
  }

  const startStatusChecking = (transactionId: string, intouchpayTransactionId: string) => {
    let attempts = 0
    const maxAttempts = 72 // Check for 6 minutes (72 * 5 seconds) - more realistic timeout

    console.log('Starting payment status checking for transaction:', transactionId)

    const interval = setInterval(async () => {
      attempts++
      console.log(`Payment status check attempt ${attempts}/${maxAttempts}`)

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
        console.log('Payment status response:', data)

        if (data.success && data.status) {
          const status = data.status.toLowerCase()

          // Update the processing message based on current status
          if (status === 'pending' || status === 'processing') {
            setPaymentState(prev => ({
              ...prev,
              step: 'processing',
              processingMessage: data.message || 'Processing payment...'
            }))
          }
          // ONLY show success when payment is actually completed
          else if (status === 'completed' || status === 'successful' || status === 'success' || data.responseCode === '01') {
            console.log('Payment confirmed as successful!')
            clearInterval(interval)
            setPaymentState(prev => ({
              ...prev,
              step: 'success',
              statusCheckInterval: undefined,
              successMessage: data.message || 'Payment completed successfully!'
            }))

            if (onPaymentComplete) {
              onPaymentComplete({
                transactionId,
                intouchpayTransactionId,
                amount,
                description,
                status: 'completed',
                phoneNumber: paymentState.phoneNumber
              })
            }
          }
          // Handle payment failures
          else if (status === 'failed' || status === 'error' || (data.responseCode && data.responseCode !== '1000' && data.responseCode !== '01')) {
            console.log('Payment failed:', data.message)
            clearInterval(interval)
            setPaymentState(prev => ({
              ...prev,
              step: 'error',
              errorMessage: data.message || 'Payment failed',
              statusCheckInterval: undefined
            }))

            if (onPaymentError) {
              onPaymentError(data.message || 'Payment failed')
            }
          }
        }
        
        // Stop checking after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          setPaymentState(prev => ({
            ...prev,
            step: 'error',
            errorMessage: 'Payment timeout. Please check your mobile money account.',
            statusCheckInterval: undefined
          }))
          
          if (onPaymentError) {
            onPaymentError('Payment timeout')
          }
        }
      } catch (error) {
        console.error('Status check error:', error)
        // Continue checking on network errors
      }
    }, 5000) // Check every 5 seconds

    setPaymentState(prev => ({ ...prev, statusCheckInterval: interval }))
  }

  const handleClose = () => {
    if (paymentState.statusCheckInterval) {
      clearInterval(paymentState.statusCheckInterval)
    }
    setPaymentState({ step: 'input', phoneNumber: '' })
    onClose()
  }

  const renderContent = () => {
    switch (paymentState.step) {
      case 'input':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Smartphone className="w-6 h-6 text-primary" />
                Mobile Money Payment
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Pay {amount.toLocaleString()} RWF using MTN Mobile Money or Airtel Money
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium">Payment Details:</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-lg font-bold text-primary">{amount.toLocaleString()} RWF</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Payment will be sent to:</p>
                <p className="text-lg font-mono text-blue-800">{phoneNumber}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Make sure this number has sufficient mobile money balance
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentRequest}
                  disabled={!validatePhoneNumber(phoneNumber)}
                  className="flex-1"
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </>
        )

      case 'processing':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-primary animate-pulse" />
                Processing Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <div>
                <p className="font-medium">Processing Payment...</p>
                <p className="text-sm text-muted-foreground">
                  {paymentState.processingMessage || 'Please check your phone and enter your PIN to complete the payment'}
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">Amount: <span className="font-bold">{amount.toLocaleString()} RWF</span></p>
                <p className="text-sm">Phone: <span className="font-bold">{paymentState.phoneNumber}</span></p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>⏱️ This may take up to 2 minutes</p>
                <p>📱 Check your phone for the payment prompt</p>
              </div>
              <Button variant="outline" onClick={handleClose}>
                Cancel Payment
              </Button>
            </CardContent>
          </>
        )

      case 'success':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                  {paymentState.successMessage || `Your payment of ${amount.toLocaleString()} RWF has been processed successfully.`}
                </p>
                {paymentState.transactionId && (
                  <p className="text-sm text-green-600 mt-2">
                    Transaction ID: {paymentState.transactionId}
                  </p>
                )}
              </div>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </CardContent>
          </>
        )

      case 'error':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle className="w-6 h-6" />
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800">
                  {paymentState.errorMessage || 'An error occurred while processing your payment.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Close
                </Button>
                <Button 
                  onClick={() => setPaymentState(prev => ({ ...prev, step: 'input', errorMessage: undefined }))}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        {renderContent()}
      </Card>
    </div>
  )
}
