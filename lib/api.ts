// API utility functions for FoodFast Delivery
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  prepTime: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: "placed" | "preparing" | "out-for-delivery" | "delivered"
  createdAt: string
  deliveryAddress: {
    street: string
    city: string
    zipCode: string
  }
}

export interface PaymentData {
  method: "credit-card" | "paypal" | "cash-on-delivery"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}

// Base API function with error handling
export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

// User API functions
export const userApi = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    return apiCall<User>("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    return apiCall<User>("/api/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>("/api/users/profile")
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiCall<User>("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },
}

// Product API functions
export const productApi = {
  getAll: async (search?: string, category?: string): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (category) params.append("category", category)

    return apiCall<Product[]>(`/api/products?${params.toString()}`)
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiCall<Product>(`/api/products/${id}`)
  },
}

// Order API functions
export const orderApi = {
  create: async (orderData: Omit<Order, "id" | "createdAt" | "status">): Promise<ApiResponse<Order>> => {
    return apiCall<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  },

  getAll: async (): Promise<ApiResponse<Order[]>> => {
    return apiCall<Order[]>("/api/orders")
  },

  getById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiCall<Order>(`/api/orders/${id}`)
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<ApiResponse<Order>> => {
    return apiCall<Order>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  },
}

// Payment API functions
export const paymentApi = {
  process: async (
    orderId: string,
    paymentData: PaymentData,
  ): Promise<ApiResponse<{ success: boolean; transactionId?: string }>> => {
    return apiCall<{ success: boolean; transactionId?: string }>("/api/payments", {
      method: "POST",
      body: JSON.stringify({ orderId, ...paymentData }),
    })
  },
}
