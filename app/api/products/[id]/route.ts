import { type NextRequest, NextResponse } from "next/server"

const mockProducts = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Fresh basil, mozzarella, and tomato sauce on crispy crust",
    price: 18.99,
    image: "/margherita-pizza-with-fresh-basil-and-mozzarella.jpg",
    category: "Pizza",
    rating: 4.8,
    prepTime: "25-30 min",
  },
  // ... other products would be here in a real app
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const product = mockProducts.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
