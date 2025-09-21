import { NextRequest, NextResponse } from 'next/server'
import { intouchApiService } from '@/lib/services/intouchApiService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, amount, description } = body

    console.log('Payment request received:', { phoneNumber, amount, description })

    // Validate required fields
    if (!phoneNumber || !amount) {
      return NextResponse.json(
        { success: false, message: 'Phone number and amount are required' },
        { status: 400 }
      )
    }

    // Validate phone number format using InTouch service
    if (!intouchApiService.validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Rwandan phone number format' },
        { status: 400 }
      )
    }

    // Validate amount
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount < 100) {
      return NextResponse.json(
        { success: false, message: 'Amount must be at least 100 RWF' },
        { status: 400 }
      )
    }

    // Request payment through InTouch API
    const paymentResponse = await intouchApiService.requestPayment({
      phoneNumber,
      amount: numericAmount,
      description
    })

    console.log('InTouch API payment response:', paymentResponse)

    if (paymentResponse.success) {
      return NextResponse.json({
        success: true,
        transactionId: paymentResponse.transactionId,
        intouchpayTransactionId: paymentResponse.intouchpayTransactionId,
        message: paymentResponse.message
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: paymentResponse.message,
          responseCode: paymentResponse.responseCode
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment request error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
