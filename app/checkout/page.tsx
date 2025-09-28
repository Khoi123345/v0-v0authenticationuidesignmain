"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Wallet, Banknote, Loader2 } from "lucide-react"
import { cartUtils, type CartItem } from "@/lib/cart"
import { orderApi, paymentApi, type PaymentData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  useEffect(() => {
    // Load cart from localStorage
    const cart = cartUtils.getCart()
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      })
      router.push("/cart")
      return
    }
    setCartItems(cart)
    setIsLoading(false)
    console.log("[v0] Checkout loaded with", cart.length, "items")
  }, [router, toast])

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = 4.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handlePayment = async () => {
    setIsProcessing(true)
    setError("")

    try {
      // Validate form data
      if (
        !deliveryInfo.firstName ||
        !deliveryInfo.lastName ||
        !deliveryInfo.address ||
        !deliveryInfo.city ||
        !deliveryInfo.zipCode ||
        !deliveryInfo.phone
      ) {
        setError("Please fill in all delivery information fields")
        toast({
          title: "Missing information",
          description: "Please fill in all delivery information fields",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      if (
        paymentMethod === "credit-card" &&
        (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardName)
      ) {
        setError("Please fill in all payment information fields")
        toast({
          title: "Missing payment info",
          description: "Please fill in all payment information fields",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      // Create order
      const orderData = {
        userId: "1", // In real app, get from auth context
        items: cartItems,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: {
          street: `${deliveryInfo.address}`,
          city: deliveryInfo.city,
          zipCode: deliveryInfo.zipCode,
        },
      }

      console.log("[v0] Creating order:", orderData)
      const orderResponse = await orderApi.create(orderData)

      if (!orderResponse.success || !orderResponse.data) {
        setError(orderResponse.error || "Failed to create order")
        toast({
          title: "Order failed",
          description: orderResponse.error || "Failed to create order",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      const newOrderId = orderResponse.data.id
      setOrderId(newOrderId)

      // Process payment
      const paymentData: PaymentData = {
        method: paymentMethod as PaymentData["method"],
        ...(paymentMethod === "credit-card" && {
          cardNumber: paymentInfo.cardNumber,
          expiryDate: paymentInfo.expiryDate,
          cvv: paymentInfo.cvv,
        }),
      }

      console.log("[v0] Processing payment for order:", newOrderId)
      const paymentResponse = await paymentApi.process(newOrderId, paymentData)

      if (paymentResponse.success) {
        // Clear cart on successful payment
        cartUtils.clearCart()
        setShowSuccessModal(true)
        // Added success toast notification
        toast({
          title: "Order placed successfully!",
          description: `Your order #${newOrderId} is being prepared`,
          variant: "default",
        })
        console.log("[v0] Payment successful, cart cleared")
      } else {
        setError(paymentResponse.error || "Payment failed")
        setShowFailureModal(true)
        // Added payment failure toast notification
        toast({
          title: "Payment failed",
          description: paymentResponse.error || "Please try again",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setShowFailureModal(true)
      toast({
        title: "Connection error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
      console.error("[v0] Checkout error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading checkout...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-balance">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={deliveryInfo.firstName}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, firstName: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={deliveryInfo.lastName}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, lastName: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={deliveryInfo.city}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={deliveryInfo.state}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="10001"
                      value={deliveryInfo.zipCode}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} disabled={isProcessing}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="cash-on-delivery" id="cash" />
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {/* Credit Card Form */}
                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          disabled={isProcessing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                        {item.quantity}x
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                      </div>
                      <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handlePayment} disabled={isProcessing} className="w-full h-12 text-base">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
              <CardTitle className="text-xl">Order Placed Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">Your order #{orderId} has been placed and is being prepared.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push("/orders")} className="flex-1">
                  View Orders
                </Button>
                <Button onClick={() => router.push("/")} className="flex-1">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Failure Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✗</span>
                </div>
              </div>
              <CardTitle className="text-xl">Payment Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {error || "There was an issue processing your payment. Please try again."}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowFailureModal(false)} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => router.push("/cart")} className="flex-1">
                  Back to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
