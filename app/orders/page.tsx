"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Clock, CheckCircle, Truck, MapPin, Loader2 } from "lucide-react"
import { orderApi, type Order } from "@/lib/api"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderApi.getAll()
        if (response.success && response.data) {
          setOrders(response.data)
          console.log("[v0] Orders loaded:", response.data.length)
        } else {
          setError(response.error || "Failed to load orders")
          toast({
            title: "Failed to Load Orders",
            description: response.error || "Unable to fetch your orders. Please try again.",
            variant: "destructive",
          })
        }
      } catch (err) {
        setError("Network error. Please try again.")
        console.error("[v0] Orders load error:", err)
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection and try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <CheckCircle className="h-4 w-4" />
      case "preparing":
        return <Clock className="h-4 w-4" />
      case "out-for-delivery":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <MapPin className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "secondary"
      case "preparing":
        return "default"
      case "out-for-delivery":
        return "default"
      case "delivered":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "placed":
        return "Order Placed"
      case "preparing":
        return "Preparing"
      case "out-for-delivery":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load orders</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
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
          <h1 className="text-3xl font-bold text-balance">Your Orders</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status) as any} className="mb-1">
                        {getStatusText(order.status)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start by ordering some delicious food from our menu</p>
              <Link href="/products">
                <Button>Browse Menu</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
