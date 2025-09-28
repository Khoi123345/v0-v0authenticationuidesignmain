import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, User, UserPlus, ArrowRight, ShoppingBag, ShoppingCart, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FoodFast Delivery</h1>
                <p className="text-sm text-muted-foreground">Fast food, faster delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Menu
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to FoodFast Delivery</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the fastest food delivery service in your area. Fresh meals delivered hot to your doorstep in
            minutes.
          </p>
          <div className="mt-8">
            <Link href="/products">
              <Button size="lg" className="h-12 px-8 text-lg">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Our Menu
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Authentication Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 mx-auto">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription className="text-base">
                Welcome back! Access your account to continue ordering your favorite meals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Access your order history</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Manage saved addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Track your deliveries</span>
                </div>
              </div>
              <Link href="/login" className="block">
                <Button className="w-full h-11">
                  Sign In to Your Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 mx-auto">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription className="text-base">
                New to FoodFast? Join thousands of satisfied customers and start ordering today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Free account creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Exclusive member discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Loyalty rewards program</span>
                </div>
              </div>
              <Link href="/register" className="block">
                <Button className="w-full h-11">
                  Create Your Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Demo Profile Link */}
        <div className="text-center mt-12">
          <Card className="inline-block border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">View Profile Demo</h3>
                  <p className="text-sm text-muted-foreground">See what your profile page will look like</p>
                </div>
                <Link href="/profile">
                  <Button variant="outline">
                    View Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
