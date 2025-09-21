import { NextRequest, NextResponse } from 'next/server'
import { intouchApiService } from '@/lib/services/intouchApiService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestTransactionId, intouchpayTransactionId } = body

    console.log('Payment status check received:', { requestTransactionId, intouchpayTransactionId })

    // Validate required fields
    if (!requestTransactionId || !intouchpayTransactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction IDs are required' },
        { status: 400 }
      )
    }

    // Check transaction status through InTouch API
    const statusResponse = await intouchApiService.getTransactionStatus(
      requestTransactionId,
      intouchpayTransactionId
    )

    console.log('InTouch API status response:', statusResponse)

    if (statusResponse.success) {
      return NextResponse.json({
        success: true,
        status: statusResponse.status,
        message: statusResponse.message,
        responseCode: statusResponse.responseCode
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: statusResponse.message,
          responseCode: statusResponse.responseCode
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}