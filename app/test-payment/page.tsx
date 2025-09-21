'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { IntouchPaymentModal } from '@/components/payment/IntouchPaymentModal'
import { useIntouchPayment } from '@/lib/hooks/useIntouchPayment'

export default function TestPaymentPage() {
  const [showModal, setShowModal] = useState(false)
  const [testAmount, setTestAmount] = useState(1000)
  const [testPhone, setTestPhone] = useState('250781234567')
  const [result, setResult] = useState<any>(null)
  
  const { requestPayment, getAccountBalance, isLoading, error } = useIntouchPayment()

  const handleTestPayment = () => {
    setShowModal(true)
  }

  const handleDirectAPITest = async () => {
    const result = await requestPayment({
      phoneNumber: testPhone,
      amount: testAmount,
      description: 'Test payment from SmartSports Rwanda'
    })
    setResult(result)
  }

  const handleBalanceTest = async () => {
    const result = await getAccountBalance()
    setResult(result)
  }

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData)
    setResult({ type: 'payment_complete', data: paymentData })
    setShowModal(false)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    setResult({ type: 'payment_error', error })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">InTouch Payment System Test</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Phone Number</label>
                <Input
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="250781234567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Test Amount (RWF)</label>
                <Input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(parseInt(e.target.value) || 0)}
                  placeholder="1000"
                />
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleTestPayment} 
                  className="w-full"
                  disabled={isLoading}
                >
                  Test Payment Modal
                </Button>
                
                <Button 
                  onClick={handleDirectAPITest} 
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading}
                >
                  Test Direct API Call
                </Button>
                
                <Button 
                  onClick={handleBalanceTest} 
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading}
                >
                  Test Balance Check
                </Button>
              </div>

              {isLoading && (
                <div className="text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  Error: {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No test results yet. Run a test to see results here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>POST /api/payments/request</strong> - Request payment from customer</div>
              <div><strong>POST /api/payments/status</strong> - Check transaction status</div>
              <div><strong>GET /api/payments/balance</strong> - Get account balance</div>
              <div><strong>POST /api/payments/callback</strong> - Payment callback handler</div>
            </div>
          </CardContent>
        </Card>

        {/* InTouch Payment Modal */}
        <IntouchPaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          amount={testAmount}
          description={`Test payment of ${testAmount} RWF`}
          onPaymentComplete={handlePaymentComplete}
          onPaymentError={handlePaymentError}
        />
      </div>
    </div>
  )
}
