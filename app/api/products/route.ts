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
  {
    id: "2",
    name: "Gourmet Beef Burger",
    description: "Premium beef patty with truffle aioli and caramelized onions",
    price: 24.99,
    image: "/gourmet-beef-burger-with-truffle-aioli-and-caramel.jpg",
    category: "Burger",
    rating: 4.9,
    prepTime: "15-20 min",
  },
  {
    id: "3",
    name: "Buffalo Chicken Wings",
    description: "Spicy buffalo wings served with blue cheese dip",
    price: 16.99,
    image: "/spicy-buffalo-chicken-wings-with-blue-cheese-dip.jpg",
    category: "Appetizer",
    rating: 4.7,
    prepTime: "20-25 min",
  },
  {
    id: "4",
    name: "Fresh Mango Smoothie",
    description: "Tropical mango smoothie with coconut milk and lime",
    price: 8.99,
    image: "/fresh-mango-smoothie-with-coconut-milk-and-lime.jpg",
    category: "Drinks",
    rating: 4.6,
    prepTime: "5-10 min",
  },
  {
    id: "5",
    name: "Pepperoni Supreme Pizza",
    description: "Loaded with pepperoni, sausage, and bell peppers",
    price: 22.99,
    image: "/pepperoni-supreme-pizza-with-sausage-and-bell-pepp.jpg",
    category: "Pizza",
    rating: 4.8,
    prepTime: "25-30 min",
  },
  {
    id: "6",
    name: "Crispy Fish Burger",
    description: "Beer-battered fish with tartar sauce on brioche bun",
    price: 19.99,
    image: "/crispy-fish-burger-with-tartar-sauce-on-brioche-bu.jpg",
    category: "Burger",
    rating: 4.5,
    prepTime: "18-22 min",
  },
  {
    id: "7",
    name: "Iced Coffee Frappe",
    description: "Rich espresso frappe with whipped cream",
    price: 6.99,
    image: "/iced-coffee-frappe-with-whipped-cream-and-espresso.jpg",
    category: "Drinks",
    rating: 4.4,
    prepTime: "5-8 min",
  },
  {
    id: "8",
    name: "Loaded Nachos",
    description: "Crispy nachos with cheese, jalapeños, and sour cream",
    price: 14.99,
    image: "/loaded-nachos-with-cheese-jalape-os-sour-cream-and.jpg",
    category: "Appetizer",
    rating: 4.6,
    prepTime: "12-15 min",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredProducts = mockProducts

    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by category
    if (category && category !== "All") {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    return NextResponse.json(filteredProducts)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
