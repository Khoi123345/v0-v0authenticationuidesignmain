import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Check if the email exists in your database
    // 2. Generate a secure reset token with expiration
    // 3. Store the token in your database
    // 4. Send an email with the reset link
    // 5. Return success regardless of whether email exists (security best practice)

    // Mock implementation - simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, we'll accept any valid email
    console.log(`[v0] Password reset requested for: ${email}`)

    // In production, you would send an actual email here
    // Example: await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({
      message: "If an account with this email exists, you will receive a password reset link shortly.",
      success: true,
    })
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
