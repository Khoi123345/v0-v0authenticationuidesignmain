"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Utensils, Check, X, Loader2 } from "lucide-react"
import { userApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ""
  const passwordValid = formData.password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch || !passwordValid) return

    setIsLoading(true)

    try {
      const response = await userApi.register(formData.name, formData.email, formData.password)

      if (response.success && response.data) {
        console.log("[v0] Registration successful:", response.data)
        localStorage.setItem("user", JSON.stringify(response.data))

        toast({
          title: "Account created!",
          description: `Welcome to FoodFast, ${response.data.name}!`,
          variant: "default",
        })

        router.push("/products")
      } else {
        toast({
          title: "Registration failed",
          description: response.error || "Please try again",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Connection error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
      console.error("[v0] Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          <p className="text-muted-foreground mt-1">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <Card className="border-border shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-11 bg-input border-border"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11 bg-input border-border"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-11 bg-input border-border pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValid ? (
                      <Check className="w-3 h-3 text-primary" />
                    ) : (
                      <X className="w-3 h-3 text-destructive" />
                    )}
                    <span className={passwordValid ? "text-primary" : "text-destructive"}>At least 8 characters</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="h-11 bg-input border-border pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordsMatch ? (
                      <Check className="w-3 h-3 text-primary" />
                    ) : (
                      <X className="w-3 h-3 text-destructive" />
                    )}
                    <span className={passwordsMatch ? "text-primary" : "text-destructive"}>Passwords match</span>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-input mt-0.5"
                  required
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={!passwordsMatch || !passwordValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                Try existing@foodfast.com to test error handling
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
