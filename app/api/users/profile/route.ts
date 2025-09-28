import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock user profile
    const user = {
      id: "1",
      name: "John Doe",
      email: "demo@foodfast.com",
      avatar: "/professional-headshot.png",
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userData = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock profile update
    const updatedUser = {
      id: "1",
      name: userData.name || "John Doe",
      email: userData.email || "demo@foodfast.com",
      avatar: userData.avatar || "/professional-headshot.png",
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
