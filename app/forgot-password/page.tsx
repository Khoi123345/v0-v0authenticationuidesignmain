"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Utensils, Loader2, ArrowLeft, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEmailSent(true)
        toast({
          title: "Reset link sent!",
          description: "Check your email for password reset instructions.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send reset email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Connection error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
      console.error("[v0] Forgot password error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Utensils className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">FoodFast Delivery</h1>
          <p className="text-muted-foreground mt-1">{isEmailSent ? "Check your email" : "Reset your password"}</p>
        </div>

        {/* Forgot Password Card */}
        <Card className="border-border shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              {isEmailSent ? "Email Sent" : "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {isEmailSent
                ? "We've sent password reset instructions to your email address."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEmailSent ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If an account with <strong>{email}</strong> exists, you'll receive an email with reset instructions.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setIsEmailSent(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full h-11"
                  >
                    Try Different Email
                  </Button>
                  <Link href="/login" className="block">
                    <Button variant="default" className="w-full h-11">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-input border-border"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading || !email}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}

            {!isEmailSent && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
