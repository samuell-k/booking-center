import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Payment callback received:', body)

    // Handle InTouch payment callback
    const {
      transactionid,
      requesttransactionid,
      status,
      responsecode,
      message,
      amount,
      mobilephone
    } = body

    // Validate callback data
    if (!transactionid || !requesttransactionid) {
      console.error('Invalid callback data:', body)
      return NextResponse.json({ success: false, message: 'Invalid callback data' }, { status: 400 })
    }

    // Process the payment callback
    console.log('Processing payment callback:', {
      transactionId: transactionid,
      requestTransactionId: requesttransactionid,
      status,
      responseCode: responsecode,
      message,
      amount,
      phone: mobilephone
    })

    // Here you would typically:
    // 1. Update the payment record in your database
    // 2. Generate and send tickets
    // 3. Send confirmation emails/SMS
    // 4. Update user wallet if applicable

    // For now, just log the successful payment
    if (responsecode === '01' || status === 'successful') {
      console.log('Payment successful:', {
        transactionId: transactionid,
        amount,
        phone: mobilephone
      })
    }

    return NextResponse.json({ success: true, message: 'Callback processed' })
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { success: false, message: 'Callback processing failed' },
      { status: 500 }
    )
  }
}

// Also handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Payment callback endpoint is active' })
}