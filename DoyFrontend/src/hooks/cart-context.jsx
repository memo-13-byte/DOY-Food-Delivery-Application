import { createContext, useContext, useState, useEffect } from "react"

// Create cart context
const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Calculate cart totals whenever cartItems changes
  useEffect(() => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    setTotalItems(itemCount)

    const price = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    setTotalPrice(price)
  }, [cartItems])

  // Retrieve cart from local storage on mount (client-side only)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("doyCart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("doyCart", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cartItems])

  // Add item to cart
  const addItem = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        // If item doesn't exist, add it
        return [...prevItems, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    )
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Context value
  const value = {
    cartItems,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}