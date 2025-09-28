import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (email === "existing@foodfast.com") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Mock successful registration
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: "/professional-headshot.png",
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
