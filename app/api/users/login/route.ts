import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    if (email === "demo@foodfast.com" && password === "password") {
      const user = {
        id: "1",
        name: "John Doe",
        email: "demo@foodfast.com",
        avatar: "/professional-headshot.png",
      }

      return NextResponse.json(user)
    }

    // Invalid credentials
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
