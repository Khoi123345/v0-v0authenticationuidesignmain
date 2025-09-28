import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, method, cardNumber } = await request.json()

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock payment validation
    if (method === "credit-card" && cardNumber === "4000000000000002") {
      // Simulate card declined
      return NextResponse.json({ error: "Payment declined. Please try a different card." }, { status: 402 })
    }

    // Mock successful payment
    const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      transactionId,
      message: "Payment processed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
