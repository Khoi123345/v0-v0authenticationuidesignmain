import { type NextRequest, NextResponse } from "next/server"

const mockOrders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: "placed",
      createdAt: new Date().toISOString(),
    }

    mockOrders.push(newOrder)

    return NextResponse.json(newOrder)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockOrders)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
