import type { Product } from "./api"

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export const cartUtils = {
  getCart: (): CartItem[] => {
    if (typeof window === "undefined") return []
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
  },

  setCart: (cart: CartItem[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(cart))
  },

  addToCart: (product: Product, quantity = 1): void => {
    const cart = cartUtils.getCart()
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        product,
        quantity,
      })
    }

    cartUtils.setCart(cart)
  },

  updateQuantity: (productId: string, quantity: number): void => {
    const cart = cartUtils.getCart()
    const item = cart.find((item) => item.product.id === productId)

    if (item) {
      if (quantity <= 0) {
        cartUtils.removeFromCart(productId)
      } else {
        item.quantity = quantity
        cartUtils.setCart(cart)
      }
    }
  },

  removeFromCart: (productId: string): void => {
    const cart = cartUtils.getCart()
    const updatedCart = cart.filter((item) => item.product.id !== productId)
    cartUtils.setCart(updatedCart)
  },

  getCartItemCount: (): number => {
    const cart = cartUtils.getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
  },

  getCartTotal: (): number => {
    const cart = cartUtils.getCart()
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },

  clearCart: (): void => {
    cartUtils.setCart([])
  },
}
