"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, CheckCircle, Truck, MapPin, Phone, MessageCircle, Loader2 } from "lucide-react"
import { orderApi, type Order } from "@/lib/api"

interface OrderStatus {
  id: string
  title: string
  description: string
  timestamp: string
  completed: boolean
  current: boolean
  icon: React.ReactNode
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await orderApi.getById(params.id)
        if (response.success && response.data) {
          setOrder(response.data)
          console.log("[v0] Order loaded:", response.data.id)
        } else {
          setError(response.error || "Order not found")
        }
      } catch (err) {
        setError("Network error. Please try again.")
        console.error("[v0] Order load error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading order...</span>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusSteps: OrderStatus[] = [
    {
      id: "placed",
      title: "Order Placed",
      description: "Your order has been confirmed",
      timestamp: new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completed: true,
      current: order.status === "placed",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      id: "preparing",
      title: "Preparing",
      description: "Kitchen is preparing your order",
      timestamp: "Est. 5-10 min",
      completed: ["preparing", "out-for-delivery", "delivered"].includes(order.status),
      current: order.status === "preparing",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "out-for-delivery",
      title: "Out for Delivery",
      description: "Driver is on the way",
      timestamp: "Est. 20-30 min",
      completed: ["out-for-delivery", "delivered"].includes(order.status),
      current: order.status === "out-for-delivery",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Order delivered successfully",
      timestamp: order.status === "delivered" ? "Completed" : "Est. 25-35 min",
      completed: order.status === "delivered",
      current: false,
      icon: <MapPin className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Order Tracking</h1>
            <p className="text-muted-foreground">Order #{order.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Status Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Status
                </CardTitle>
                <p className="text-sm text-muted-foreground">Estimated delivery: 25-35 minutes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                          flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                          ${
                            step.completed
                              ? "bg-primary border-primary text-primary-foreground"
                              : step.current
                                ? "bg-primary/20 border-primary text-primary animate-pulse"
                                : "bg-muted border-muted-foreground/20 text-muted-foreground"
                          }
                        `}
                        >
                          {step.icon}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`
                            w-0.5 h-12 mt-2 transition-colors
                            ${step.completed ? "bg-primary" : "bg-muted-foreground/20"}
                          `}
                          />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${step.current ? "text-primary" : ""}`}>{step.title}</h3>
                          <span className="text-sm text-muted-foreground">{step.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {step.current && (
                          <Badge variant="secondary" className="mt-2">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            {order.status === "out-for-delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Mike Johnson</p>
                      <p className="text-sm text-muted-foreground">Your delivery driver</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
                </p>
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
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(order.total - order.subtotal - order.deliveryFee).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    Need Help?
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
