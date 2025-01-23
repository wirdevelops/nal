import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ReactNode } from 'react';

interface UserProfile {
    name: string
    email: string
    avatar: string
}

interface ShippingAddress {
    id: string
    fullName: string
    address: string
    city: string
    country: string
    postalCode: string
}

interface PaymentMethod {
    id: string
    type: 'credit-card' | 'mtn-momo' | 'orange-money'
    lastFour?: string
    expiryDate?: string
    phoneNumber?: string
}

interface Product {
    lowStockThreshold: number
    inStock: number
    status: string
    id: number
    name: string
    price: number
    volume: string
    image: string
    category: string
    description: string
    ingredients: string[]
    usage: string
    images: string[]
    rating: number
    reviews: Review[]
    isFeatured?: boolean
    coupon?: {
        code: string
        discount: number
    }
    isPackage?: boolean
    forAilments?: string[]
    routine?: 'morning' | 'evening' | 'both'
    quantity: number
    sellerId: string
}

interface Review {
    id: number
    userId: number
    username: string
    rating: number
    comment: string
    date: string
}

interface CartItem extends Product {
    quantity: number
}

interface Order {
    id: string
    date: string
    status: 'Processing' | 'Fulfilled' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Received' | 'Disputed' | 'Resolved'
    total: number
    items: CartItem[]
    buyerId: string
    trackingNumber?: string
    shippingCarrier?: string
    estimatedDeliveryDate?: string
    disputeReason?: string
    disputeResolution?: string
}

interface Coupon {
    code: string
    discount: number
}

interface Seller {
    id: string
    name: string
    balance: number
}

interface AppState {
    userProfile: UserProfile
    shippingAddresses: ShippingAddress[]
    paymentMethods: PaymentMethod[]
    products: Product[]
    cart: CartItem[]
    favorites: number[]
    orders: Order[]
    theme: 'light' | 'dark'
    categories: string[]
    coupons: Coupon[]
    sellers: Seller[]
    setUserProfile: (profile: UserProfile) => void
    addShippingAddress: (address: Omit<ShippingAddress, 'id'>) => void
    updateShippingAddress: (id: string, address: Omit<ShippingAddress, 'id'>) => void
    deleteShippingAddress: (id: string) => void
    addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
    deletePaymentMethod: (id: string) => void
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (productId: number) => void
    updateCartItemQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    toggleFavorite: (productId: number) => void
    addOrder: (order: Order) => void
    updateOrderStatus: (orderId: string, status: Order['status'], additionalInfo?: string) => void
    getProductById: (id: number) => Product | undefined
    addReview: (productId: number, review: Omit<Review, 'id'>) => void
    getCartTotal: () => number
    reorder: (orderId: string) => void
    toggleTheme: () => void
    addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews' | 'status'>) => void
    updateProduct: (id: number, product: Partial<Product>) => void
    deleteProduct: (id: number) => void
    addCategory: (category: string) => void
    deleteCategory: (category: string) => void
    addCoupon: (coupon: Coupon) => void
    deleteCoupon: (code: string) => void
    applyCoupon: (code: string) => number | null
    fulfillOrder: (orderId: string) => void
    addSeller: (seller: Omit<Seller, 'id'>) => void
    updateSellerBalance: (sellerId: string, amount: number) => void
    updateOrderShipping: (orderId: string, trackingNumber: string, shippingCarrier: string) => void
    markOrderAsReceived: (orderId: string) => void
    initiateDispute: (orderId: string, reason: string) => void
    resolveDispute: (orderId: string, resolution: string) => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            userProfile: {
                name: 'Kwati Collete',
                email: 'kwati@example.com',
                avatar: '/placeholder.svg',
            },
            shippingAddresses: [],
            paymentMethods: [],
            products: [
              {
                id: 1,
                name: "Organic Hair Oil",
                price: 20000,
                volume: "300ml",
                image: "/placeholder.svg",
                category: "hair",
                description: "Nourishing organic hair oil for healthy, shiny hair.",
                ingredients: ["Argan Oil", "Jojoba Oil", "Vitamin E", "Lavender Essential Oil"],
                usage: "Apply a small amount to damp or dry hair, focusing on the ends. Style as usual.",
                images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
                rating: 4.5,
                reviews: [
                  {
                    id: 1,
                    userId: 1,
                    username: "Jane Doe",
                    rating: 5,
                    comment: "Amazing product! My hair feels so soft and healthy.",
                    date: "2023-05-15"
                  },
                  {
                    id: 2,
                    userId: 2,
                    username: "John Smith",
                    rating: 4,
                    comment: "Good oil, but a bit pricey.",
                    date: "2023-06-02"
                  }
                ],
                isFeatured: true,
                forAilments: ["Dry Scalp", "Hair Loss"],
                routine: "evening",
                 inStock: 100,
                lowStockThreshold: 5,
                quantity: 100,
                sellerId: '1',
                status: 'active'
              },
              {
                id: 2,
                name: "Fresh Body Oil",
                price: 18000,
                volume: "250ml",
                image: "/placeholder.svg",
                category: "body",
                description: "Refreshing body oil for soft, smooth skin.",
                ingredients: ["Coconut Oil", "Shea Butter", "Vitamin E"],
                usage: "Apply to clean, dry skin after showering or bathing.",
                images: ["/placeholder.svg"],
                rating: 4,
                reviews: [],
                coupon: {
                  code: "FRESH20",
                  discount: 20
                },
                 inStock: 50,
                lowStockThreshold: 5,
                routine: "both",
                quantity: 50,
                sellerId: '2',
                  status: 'active'
              },
              {
                id: 3,
                name: "Natural Face Serum",
                price: 25000,
                volume: "100ml",
                image: "/placeholder.svg",
                category: "face",
                description: "Rejuvenating face serum for a youthful glow.",
                ingredients: ["Hyaluronic Acid", "Vitamin C", "Niacinamide"],
                usage: "Apply a few drops to clean, dry skin morning and night.",
                images: ["/placeholder.svg", "/placeholder.svg"],
                rating: 4.8,
                reviews: [
                  {
                    id: 3,
                    userId: 3,
                    username: "Emily Green",
                    rating: 5,
                    comment: "This serum is amazing! My skin looks so much brighter and healthier.",
                    date: "2023-07-10"
                  }
                ],
                isFeatured: true,
                forAilments: ["Fine Lines", "Uneven Skin Tone"],
                 inStock: 75,
                lowStockThreshold: 5,
                routine: "both",
                quantity: 75,
                sellerId: '1',
                  status: 'active'
              },
              {
                id: 4,
                name: "Body Butter",
                price: 15000,
                volume: "200ml",
                image: "/placeholder.svg",
                category: "body",
                description: "Rich body butter for deep hydration.",
                ingredients: ["Shea Butter", "Cocoa Butter", "Mango Butter"],
                usage: "Apply to clean, dry skin as needed.",
                images: ["/placeholder.svg"],
                rating: 4.2,
                reviews: [],
                forAilments: ["Dry Skin", "Rough Patches"],
                 inStock: 100,
                lowStockThreshold: 5,
                routine: "evening",
                quantity: 100,
                sellerId: '2',
                  status: 'active'
              },
              {
                id: 5,
                name: "Complete Skincare Package",
                price: 50000,
                volume: "3 products",
                image: "/placeholder.svg",
                category: "face",
                description: "Complete skincare routine package for radiant skin.",
                ingredients: ["Various natural ingredients"],
                usage: "Follow individual product instructions for a complete skincare routine.",
                images: ["/placeholder.svg"],
                rating: 4.9,
                reviews: [],
                isPackage: true,
                isFeatured: true,
                 inStock: 25,
                lowStockThreshold: 5,
                quantity: 25,
                sellerId: '1',
                  status: 'active'
              },
              {
                id: 6,
                name: "Acne Treatment Serum",
                price: 22000,
                volume: "50ml",
                image: "/placeholder.svg",
                category: "face",
                description: "Powerful serum to combat acne and prevent breakouts.",
                ingredients: ["Salicylic Acid", "Tea Tree Oil", "Niacinamide"],
                usage: "Apply a small amount to affected areas twice daily.",
                images: ["/placeholder.svg"],
                rating: 4.6,
                reviews: [],
                forAilments: ["Acne", "Oily Skin"],
                 inStock: 50,
                lowStockThreshold: 5,
                routine: "both",
                quantity: 50,
                sellerId: '2',
                  status: 'active'
              }
            ],
            cart: [],
            favorites: [],
            orders: [],
            theme: 'light',
            categories: ['face', 'body', 'hair'],
            coupons: [],
            sellers: [
                { id: '1', name: 'Kwati Collete', balance: 0 },
                { id: '2', name: 'Natural Wellness Co.', balance: 0 },
            ],
            setUserProfile: (profile) => set({ userProfile: profile }),
            addShippingAddress: (address) => set((state) => ({
                shippingAddresses: [...state.shippingAddresses, { ...address, id: Date.now().toString() }],
            })),
            updateShippingAddress: (id, address) => set((state) => ({
                shippingAddresses: state.shippingAddresses.map((a) =>
                    a.id === id ? { ...a, ...address } : a
                ),
            })),
            deleteShippingAddress: (id) => set((state) => ({
                shippingAddresses: state.shippingAddresses.filter((a) => a.id !== id),
            })),
            addPaymentMethod: (method) => set((state) => {
                const newMethod = { ...method, id: Date.now().toString() }
                if (newMethod.type === 'mtn-momo' || newMethod.type === 'orange-money') {
                    newMethod.phoneNumber = newMethod.phoneNumber?.replace(/\D/g, '').slice(-9)
                }
                return { paymentMethods: [...state.paymentMethods, newMethod] }
            }),
            deletePaymentMethod: (id) => set((state) => ({
                paymentMethods: state.paymentMethods.filter((m) => m.id !== id),
            })),
            addToCart: (product, quantity = 1) => set((state) => {
                if (product.inStock <= 0) {
                  console.error("This product is out of stock")
                  return state
                }
                const existingItem = state.cart.find(item => item.id === product.id)
                if(product.inStock < quantity){
                    console.error("Not enough stock for this product.");
                      return state;
                  }
                
                if (existingItem) {
                  
                    return {
                        cart: state.cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                      
                    }
                } else {
                  
                    return { cart: [...state.cart, { ...product, quantity }] }
                }
            }),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.id !== productId),
            })),
            updateCartItemQuantity: (productId, quantity) => set((state) => {
                const product = state.products.find(p => p.id === productId)
               if (product && product.inStock < quantity) {
                     console.error("Not enough stock for this product.");
                       return state
                  }
                
               return  {
                cart: state.cart.map(item =>
                   item.id === productId ? { ...item, quantity } : item
               ),
             }
            }),
            clearCart: () => set({ cart: [] }),
            toggleFavorite: (productId) => set((state) => {
                const isFavorite = state.favorites.includes(productId)
                return {
                    favorites: isFavorite
                        ? state.favorites.filter(id => id !== productId)
                        : [...state.favorites, productId]
                }
            }),
            addOrder: (order) => set((state) => ({
                orders: [...state.orders, order],
            })),
            updateOrderStatus: (orderId, status, additionalInfo) => set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            status,
                            ...(status === 'Shipped' && {
                                trackingNumber: additionalInfo,
                                shippingCarrier: additionalInfo, // In a real scenario, we'd split this into two parameters
                            }),
                            ...(status === 'Out for Delivery' && {
                                estimatedDeliveryDate: additionalInfo,
                            }),
                        }
                        : order
                ),
            })),
            getProductById: (id) => get().products.find(p => p.id === id),
            addReview: (productId, review) => set((state) => ({
                products: state.products.map(p =>
                    p.id === productId
                        ? { ...p, reviews: [...p.reviews, { ...review, id: Date.now() }] }
                        : p
                )
            })),
            getCartTotal: () => {
                const state = get()
                return state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
            },
            reorder: (orderId) => {
                const state = get()
                const order = state.orders.find((o) => o.id === orderId)
                if (order) {
                    order.items.forEach((item) => {
                        state.addToCart(item, item.quantity)
                    })
                }
            },
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light',
            })),
            addProduct: (product) => set((state) => {
                 const newProduct = {
                    ...product,
                    id: Date.now(),
                    rating: 0,
                    reviews: [],
                    status: product.inStock === 0 ? 'out-of-stock' :
                        product.inStock <= product.lowStockThreshold ? 'low-stock' :
                            'active',
                }
                return { products: [...state.products, newProduct] }
            }),
            updateProduct: (id, updatedProduct) => set((state) => ({
                products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            })),
            addCategory: (category) => set((state) => ({
                categories: [...state.categories, category],
            })),
            deleteCategory: (category) => set((state) => ({
                categories: state.categories.filter((c) => c !== category),
            })),
            addCoupon: (coupon) => set((state) => ({
                coupons: [...state.coupons, coupon],
            })),
            deleteCoupon: (code) => set((state) => ({
                coupons: state.coupons.filter((c) => c.code !== code),
            })),
            applyCoupon: (code) => {
                const coupon = get().coupons.find((c) => c.code === code)
                if (coupon) {
                    return coupon.discount
                }
                return null
            },
           fulfillOrder: (orderId) => set((state) => {
                const order = state.orders.find(o => o.id === orderId)
                if (!order || order.status !== 'Processing') return state

                const updatedProducts = [...state.products]
                const updatedSellers = [...state.sellers]

                order.items.forEach(item => {
                  const product = updatedProducts.find(p => p.id === item.id)
                  if (product) {
                    product.inStock -= item.quantity;
                    product.status = product.inStock === 0 ? 'out-of-stock' :
                     product.inStock <= product.lowStockThreshold ? 'low-stock' :
                     'active';
                    const seller = updatedSellers.find(s => s.id === product.sellerId)
                    if (seller) {
                      seller.balance += item.price * item.quantity
                    }
                  }
                })

                const updatedOrders = state.orders.map(o => 
                   o.id === orderId ? { ...o, status: 'Fulfilled' } : o
                )

                return {
                  products: updatedProducts,
                  sellers: updatedSellers,
                  orders: updatedOrders,
                }
            }),
            addSeller: (seller) => set((state) => ({
                sellers: [...state.sellers, { ...seller, id: Date.now().toString() }],
            })),
            updateSellerBalance: (sellerId, amount) => set((state) => ({
                sellers: state.sellers.map(s =>
                    s.id === sellerId ? { ...s, balance: s.balance + amount } : s
                ),
            })),
            updateOrderShipping: (orderId, trackingNumber, shippingCarrier) => set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId ? { ...order, trackingNumber, shippingCarrier } : order
                ),
            })),
            markOrderAsReceived: (orderId) => set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId && order.status === 'Delivered'
                        ? { ...order, status: 'Received' }
                        : order
                ),
            })),
            initiateDispute: (orderId, reason) => set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId && ['Delivered', 'Received'].includes(order.status)
                        ? { ...order, status: 'Disputed', disputeReason: reason }
                        : order
                ),
            })),
            resolveDispute: (orderId, resolution) => set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId && order.status === 'Disputed'
                        ? { ...order, status: 'Resolved', disputeResolution: resolution }
                        : order
                ),
            })),
        }),
        {
            name: 'wellness-app-storage',
        }
    )
)