import { type NextRequest, NextResponse } from "next/server"

// Mock order for demo
const mockOrder = {
  id: "ord_123456",
  userId: "1",
  items: [
    {
      id: "1",
      product: {
        id: "1",
        name: "Margherita Pizza",
        description: "Fresh basil, mozzarella, and tomato sauce",
        price: 18.99,
        image: "/margherita-pizza-with-fresh-basil-and-mozzarella.jpg",
        category: "Pizza",
        rating: 4.8,
        prepTime: "25-30 min",
      },
      quantity: 2,
    },
  ],
  subtotal: 37.98,
  deliveryFee: 4.99,
  total: 42.97,
  status: "preparing",
  createdAt: new Date().toISOString(),
  deliveryAddress: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001",
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockOrder)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const updatedOrder = {
      ...mockOrder,
      status,
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
