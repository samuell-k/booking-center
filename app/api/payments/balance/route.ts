import { NextRequest, NextResponse } from 'next/server'
import { intouchApiService } from '@/lib/services/intouchApiService'

export async function GET(request: NextRequest) {
  try {
    // Get account balance from InTouch API
    const balanceResponse = await intouchApiService.getAccountBalance()

    if (balanceResponse.success) {
      return NextResponse.json({
        success: true,
        balance: balanceResponse.balance,
        message: 'Balance retrieved successfully'
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: balanceResponse.message
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Balance check error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
