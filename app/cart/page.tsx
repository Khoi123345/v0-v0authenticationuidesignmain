"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react"
import { cartUtils, type CartItem } from "@/lib/cart"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const cart = cartUtils.getCart()
    setCartItems(cart)
    setIsLoading(false)
    console.log("[v0] Cart loaded:", cart.length, "items")
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    cartUtils.updateQuantity(id, newQuantity)
    const updatedCart = cartUtils.getCart()
    setCartItems(updatedCart)
    console.log("[v0] Cart quantity updated for item:", id, "new quantity:", newQuantity)

    toast({
      title: "Cart Updated",
      description: "Item quantity has been updated.",
    })
  }

  const removeItem = (id: string) => {
    const item = cartItems.find((item) => item.product.id === id)
    const itemName = item?.product.name || "Item"

    cartUtils.removeFromCart(id)
    const updatedCart = cartUtils.getCart()
    setCartItems(updatedCart)
    console.log("[v0] Item removed from cart:", id)

    toast({
      title: "Item Removed",
      description: `${itemName} has been removed from your cart.`,
      variant: "destructive",
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = 4.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading cart...</span>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-balance">Your Cart</h1>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground mb-6">Add some delicious items from our menu</p>
              <Link href="/products">
                <Button className="w-full">Browse Menu</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-balance">Your Cart</h1>
          <Badge variant="secondary" className="ml-auto">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.product.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 text-sm text-muted-foreground">
                  <p>🚚 Free delivery on orders over $35</p>
                  <p>⏱️ Estimated delivery: 25-35 minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
