"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Utensils, Search, ShoppingCart, Star, Clock, User, UserPlus, Plus, Minus, Loader2 } from "lucide-react"
import { productApi, type Product } from "@/lib/api"
import { cartUtils } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"

const categories = ["All", "Pizza", "Burger", "Appetizer", "Drinks"]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [cartItems, setCartItems] = useState<Record<string, number>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productApi.getAll()
        if (response.success && response.data) {
          setProducts(response.data)
          console.log("[v0] Products loaded:", response.data.length)
        } else {
          setError(response.error || "Failed to load products")
          toast({
            title: "Failed to load menu",
            description: response.error || "Please try refreshing the page",
            variant: "destructive",
          })
        }
      } catch (err) {
        setError("Network error. Please try again.")
        toast({
          title: "Connection error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        })
        console.error("[v0] Products load error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    // Load cart state
    const cart = cartUtils.getCart()
    const cartQuantities: Record<string, number> = {}
    cart.forEach((item) => {
      cartQuantities[item.product.id] = item.quantity
    })
    setCartItems(cartQuantities)

    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    loadProducts()
  }, [toast])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  const updateQuantity = (product: Product, change: number) => {
    const currentQty = cartItems[product.id] || 0
    const newQty = Math.max(0, currentQty + change)

    if (newQty === 0) {
      cartUtils.removeFromCart(product.id)
      const { [product.id]: removed, ...rest } = cartItems
      setCartItems(rest)
      toast({
        title: "Removed from cart",
        description: `${product.name} removed from your cart`,
        variant: "default",
      })
    } else {
      if (currentQty === 0) {
        cartUtils.addToCart(product, newQty)
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
          variant: "default",
        })
      } else {
        cartUtils.updateQuantity(product.id, newQty)
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated`,
          variant: "default",
        })
      }
      setCartItems((prev) => ({ ...prev, [product.id]: newQty }))
    }

    console.log("[v0] Cart updated for product:", product.name, "quantity:", newQty)
  }

  const getQuantity = (productId: string) => cartItems[productId] || 0

  const totalCartItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load products</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FoodFast Delivery</h1>
                <p className="text-sm text-muted-foreground">Fast food, faster delivery</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {totalCartItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {totalCartItems}
                    </Badge>
                  )}
                </Button>
              </Link>
              {currentUser ? (
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {currentUser.name}
                  </Button>
                </Link>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Our Menu</h2>
          <p className="text-muted-foreground">Discover delicious meals delivered fresh to your door</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-11">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} items
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {product.rating}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.prepTime}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-balance">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  <div className="flex items-center gap-2">
                    {getQuantity(product.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(product, -1)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{getQuantity(product.id)}</span>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(product, 1)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQuantity(product, 1)
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedProduct.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{selectedProduct.prepTime}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-3xl font-bold text-primary">${selectedProduct.price}</span>
                    <div className="flex items-center gap-3">
                      {getQuantity(selectedProduct.id) > 0 ? (
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            onClick={() => updateQuantity(selectedProduct, -1)}
                            className="h-10 w-10 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">{getQuantity(selectedProduct.id)}</span>
                          <Button onClick={() => updateQuantity(selectedProduct, 1)} className="h-10 w-10 p-0">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => updateQuantity(selectedProduct, 1)} className="h-11 px-6">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
