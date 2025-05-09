"use client"

import { useEffect, useState } from "react"
import ProductCard from "../components/ui/ProductCard"
import CartSummary from "../components/ui/CartSummary"
import { FaStar, FaRegStar } from "react-icons/fa"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { BsMoon } from "react-icons/bs"
import { FiShoppingCart } from "react-icons/fi" // Added for cart icon
import doyLogo from "../assets/doylogo.jpeg"
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import AuthorizedRequest from "../services/AuthorizedRequest"
import { getResponseErrors } from "../services/exceptionUtils"

// Helper function to render star ratings
const renderStars = (rating) => {
  const numericRating = typeof rating === "number" ? rating : 0
  const full = Math.floor(numericRating)
  const stars = []
  for (let i = 0; i < full; i++) stars.push(<FaStar key={`fs-${i}`} color="#ffcc00" />) // Unique keys
  while (stars.length < 5) stars.push(<FaRegStar key={`es-${stars.length}`} color="#ccc" />) // Unique keys
  return stars
}

// Style for footer icons - using function approach from second file
const iconLinkStyle = (darkMode) => ({
  color: darkMode ? "#ccc" : "#555",
  textDecoration: "none",
  padding: "0.4rem",
  borderRadius: "50%",
  transition: "transform 0.3s",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

// Media query helper for responsive styles
const useResponsiveStyle = (mobileStyle, desktopStyle) => {
  return {
    ...desktopStyle,
    "@media (max-width: 768px)": {
      ...mobileStyle,
    },
  }
}

// Cart Badge Component
const CartBadge = ({ count, darkMode }) => {
  if (count <= 0) return null

  return (
    <div
      style={{
        position: "absolute",
        top: "-8px",
        right: "-8px",
        backgroundColor: "#ff5722", // Orange color for visibility
        color: "white",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        border: `2px solid ${darkMode ? "#1c1c1c" : "#F2E8D6"}`,
      }}
    >
      {count > 99 ? "99+" : count}
    </div>
  )
}

const RestaurantDetail = () => {
  // --- State ---
  const [cart, setCart] = useState([]) // Local frontend cart state
  const location = useLocation()
  const navigate = useNavigate()
  const { id: restaurantIdParam } = useParams() // Get restaurant ID string from URL
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null) // Parsed ID state

  const [restaurant, setRestaurant] = useState(null) // Restaurant details
  const [menu, setMenu] = useState({ categories: [] }) // Menu structure
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)
  const [loadingCart, setLoadingCart] = useState(true) // Cart loading state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showMobileCart, setShowMobileCart] = useState(false) // State for mobile cart visibility

  // State for tracking expanded/collapsed categories
  const [expandedCategories, setExpandedCategories] = useState({})

  // Category mapping (remains same)
  const categoryMap = new Map([
    ["COMBO", 0],
    ["MAIN_DISH", 1],
    ["DRINK", 2],
    ["EXTRA", 3],
  ])

  const [darkMode, setDarkMode] = useState(location.state?.darkMode || false)
  const selectedAddress = location.state?.selectedAddress

  // --- Effects ---

  // Effect to handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) {
        setShowMobileCart(false) // Hide mobile cart when switching to desktop
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Effect to parse and validate restaurant ID from URL param
  useEffect(() => {
    let parsedId = null
    if (restaurantIdParam) {
      parsedId = Number.parseInt(restaurantIdParam, 10)
      if (isNaN(parsedId) || parsedId <= 0) {
        console.error(`Invalid restaurantIdParam from URL: ${restaurantIdParam}`)
        parsedId = null // Treat invalid as null
      }
    }
    setCurrentRestaurantId(parsedId)
    console.log(`Parsed currentRestaurantId: ${parsedId}`)
  }, [restaurantIdParam])

  // Effect to fetch restaurant details
  useEffect(() => {
    const getRestaurant = async () => {
      // Use the parsed state ID
      if (!currentRestaurantId) {
        setLoadingRestaurant(false) // Stop loading if no valid ID
        setRestaurant(null) // Ensure null if ID invalid
        return
      }
      setLoadingRestaurant(true)
      setRestaurant(null) // Reset
      try {
        // Use the exact endpoint structure from user's code
        const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/restaurant/get/${currentRestaurantId}`)
        console.log("Restaurant API response:", response.data)
        setRestaurant(response.data)
      } catch (error) {
        console.error("Error fetching restaurant details:", error)
        setRestaurant(null) // Reset on error
      } finally {
        setLoadingRestaurant(false)
      }
    }
    // Only run if currentRestaurantId has a valid value
    if (currentRestaurantId !== null) {
      getRestaurant()
    } else {
      setLoadingRestaurant(false) // Ensure loading stops if ID was initially invalid
      setRestaurant(null)
    }
  }, [currentRestaurantId]) // Depend on the parsed state variable

  // Effect to fetch menu items
  useEffect(() => {
    const getRestaurantMenus = async () => {
      // Use the parsed state ID
      if (!currentRestaurantId) {
        setLoadingMenu(false)
        setMenu({ categories: [] })
        return
      }
      setLoadingMenu(true)
      setMenu({ categories: [] }) // Reset
      try {
        // Use the exact endpoint structure from user's code
        const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/item/get-items/${currentRestaurantId}`)
        console.log("Menu API response:", response.data)
        const responseItems = response.data || []

        const itemData = [
          { title: "Menüler", items: [] },
          { title: "Yiyecek Seçenekleri", items: [] },
          { title: "İçecek Seçenekleri", items: [] },
          { title: "Ek Seçenekleri", items: [] },
        ]

        responseItems.forEach((item) => {
          if (!item || typeof item.menuItemType === "undefined" || item.id === undefined) {
            console.warn("Skipping invalid item data:", item)
            return
          }
          const categoryIndex = categoryMap.get(item.menuItemType)
          if (categoryIndex !== undefined && itemData[categoryIndex]) {
            const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price || 0)
            itemData[categoryIndex].items.push({
              id: item.id,
              name: item.name || "İsimsiz Ürün",
              description: item.description || "",
              price: isNaN(price) ? 0 : price,
              imageId: item.imageId,
              image: item.imageId? `http://localhost:8080/api/upload/image/${item.imageId}`: "/placeholder.svg"
            })
            
          } else {
            console.warn(`Unknown menu item type: ${item.menuItemType} for item ID: ${item.id}`)
          }
        })
        setMenu({ categories: itemData })

        // Initialize expanded categories - first category expanded by default, others collapsed
        const initialExpandedState = {}
        itemData.forEach((category, index) => {
          if (category.items.length > 0) {
            initialExpandedState[index] = index === 0 // Only first category expanded
          }
        })
        setExpandedCategories(initialExpandedState)
      } catch (error) {
        alert(getResponseErrors(error))
        setMenu({ categories: [] }) 
      } finally {
        setLoadingMenu(false)
      }
    }
    // Only run if currentRestaurantId has a valid value
    if (currentRestaurantId !== null) {
      getRestaurantMenus()
    } else {
      setLoadingMenu(false) // Ensure loading stops if ID was initially invalid
      setMenu({ categories: [] })
    }
  }, [currentRestaurantId]) // Depend on the parsed state variable

  // Effect to load USER's cart and check restaurant match
  useEffect(() => {
    const fetchUserCart = async () => {
      // Don't fetch if the current restaurant ID isn't valid yet
      if (currentRestaurantId === null) {
        console.log("Skipping user cart fetch: Invalid currentRestaurantId.")
        setCart([])
        setLoadingCart(false) // Stop loading if ID is invalid
        return
      }

      console.log("Fetching user's cart from /order/cart...")
      setLoadingCart(true)
      setCart([]) // Clear local cart while fetching

      try {
        // *** Ensure Axios sends authentication (e.g., JWT token via interceptors) ***
        const response = await AuthorizedRequest.getRequest(`http://localhost:8080/order/cart`) // Your single endpoint
        const userCartDto = response.data // Expecting UserCartDTO format defined before

        console.log("Received UserCartDTO:", userCartDto)

        // --- Process UserCartDTO ---
        const formattedCartItems = []
        if (Array.isArray(userCartDto.items)) {
          userCartDto.items.forEach((itemInfo) => {
            // itemInfo is UserCartDTO.ItemInfo
            if (
              itemInfo &&
              typeof itemInfo.quantity === "number" &&
              itemInfo.quantity > 0 &&
              itemInfo.menuItemId != null
            ) {
              for (let i = 0; i < itemInfo.quantity; i++) {
                const price =
                  typeof itemInfo.price === "number" ? itemInfo.price : Number.parseFloat(itemInfo.price || 0)
                formattedCartItems.push({
                  id: itemInfo.menuItemId, // Use menuItemId from DTO
                  name: itemInfo.name || "İsimsiz Ürün",
                  price: isNaN(price) ? 0 : price,
                  description: itemInfo.description || "",
                  // image: itemInfo.imageUrl // If available in DTO
                })
              }
            }
          })
        }
        setCart(formattedCartItems)
        console.log("Frontend cart populated:", formattedCartItems)
        // --- End Processing ---
      
      } catch (error) {
        console.error("Error fetching user cart:", error)
        if (error.response?.status === 401) {
          console.error("Unauthorized: Cannot fetch user cart.") /* Handle */
        }
        setCart([]) // Reset cart on error
      } finally {
        setLoadingCart(false) // Stop cart loading indicator
      }
    }

    fetchUserCart()

    // Re-run this effect if the restaurant ID from the URL changes
  }, [currentRestaurantId])

  // --- Event Handlers ---

  // Toggle category expansion
  const toggleCategory = (categoryIndex) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }))
  }

  // Toggle mobile cart visibility
  const toggleMobileCart = () => {
    setShowMobileCart((prev) => !prev)
  }

  // Handler to add item to cart via API
  const handleAddToCart = async (item) => {
    if (!item || item.id === undefined) {
      console.error("Attempted to add invalid item:", item)
      alert("Bu öğe sepete eklenemedi (geçersiz ürün).")
      return
    }

    console.log("Attempting to add item:", item)

    try {
      // Show visual feedback immediately (optional)
      const feedbackElement = document.getElementById(`add-feedback-${item.id}`)
      if (feedbackElement) {
        feedbackElement.textContent = "Ekleniyor..."
        feedbackElement.style.display = "block"
      }

      const url = `http://localhost:8080/order/add?itemId=${item.id}`
      const header = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
      console.log(header)
      const response = await AuthorizedRequest.getRequest(url, header)

      if (response.data === true) {
        // Optimistic update - add to cart immediately
        setCart((prevCart) => [...prevCart, item])
        console.log("Item added to cart state (optimistic):", item.id)

        // Show success feedback
        if (feedbackElement) {
          feedbackElement.textContent = "Eklendi ✓"
          feedbackElement.style.color = "#4CAF50"
          setTimeout(() => {
            feedbackElement.style.display = "none"
          }, 1500)
        }
      } else {
        console.warn("Backend did not approve adding the item:", item.id)
        alert(`${item.name} şu anda sepete eklenemiyor (backend).`)

        // Show error feedback
        if (feedbackElement) {
          feedbackElement.textContent = "Eklenemedi ✗"
          feedbackElement.style.color = "#F44336"
          setTimeout(() => {
            feedbackElement.style.display = "none"
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Error adding item ID via API:", item.id, error)
      if (error.response) {
        console.error("Error response from backend:", error.response.data)
      }
      alert("Sepete eklerken bir sunucu hatası oluştu.")
    

      // Show error feedback
      const feedbackElement = document.getElementById(`add-feedback-${item.id}`)
      if (feedbackElement) {
        feedbackElement.textContent = "Hata ✗"
        feedbackElement.style.color = "#F44336"
        setTimeout(() => {
          feedbackElement.style.display = "none"
        }, 1500)
      }
    }
  }

  // Handler to remove item from cart via API
  const handleRemoveFromCart = async (itemIdToRemove) => {
    if (itemIdToRemove === undefined) {
      console.error("Attempted to remove item with invalid ID.")
      return
    }
    console.log("Attempting to remove item ID:", itemIdToRemove)
    try {
      const url = `http://localhost:8080/order/remove?itemId=${itemIdToRemove}`
      const header = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
      const response = await AuthorizedRequest.getRequest(url, header)

      if (response.data === true) {
        setCart((prevCart) => {
          const itemIndex = prevCart.findIndex((cartItem) => cartItem.id === itemIdToRemove)
          if (itemIndex > -1) {
            console.log("Removing item from cart state (optimistic):", itemIdToRemove)
            return [...prevCart.slice(0, itemIndex), ...prevCart.slice(itemIndex + 1)]
          }
          return prevCart
        })
      } else {
        console.warn("Backend did not approve removing the item ID:", itemIdToRemove)
        alert("Bu öğe sepetten çıkarılamadı (backend).")
      }
    } catch (error) {
      console.error("Error removing item ID via API:", itemIdToRemove, error)
      alert("Sepetten çıkarırken bir sunucu hatası oluştu.")
    }
  }

  // Handler to confirm order via API and proceed to cart page
  const handleConfirm = async () => {
    if (cart.length === 0) {
      alert("Devam etmek için sepetinize ürün eklemelisiniz.")
      return
    }
    console.log("Confirming order via API...")
    try {
      const header = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
      const response = await AuthorizedRequest.getRequest("http://localhost:8080/order/confirm", header)
      

      console.log("Order confirmation response:", response.data)
      if (response.data === true) {
        console.log("Order confirmed by backend. Navigating to /cart page...")
        navigate("/cart", {
          state: { cartItems: cart, restaurant, selectedAddress, darkMode },
        })
      } else {
        console.warn("Backend confirmation failed.")
        alert("Siparişiniz onaylanamadı.")
      }
    } catch (error) {
      console.error("Error during order confirmation API call:", error)
      alert("Sipariş onaylanırken bir hata oluştu.")
    }
  }

  // Calculate total cart items
  const cartItemCount = cart.length

  // Calculate total cart price
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0)

  // --- Render Logic ---
  if (loadingRestaurant || loadingMenu || loadingCart) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        Yükleniyor...
      </div>
    )
  }

  // Updated checks for invalid ID or missing restaurant *after* loading
  if (currentRestaurantId === null) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: darkMode ? "#fff" : "#000" }}>
        Geçersiz Restoran ID. URL'deki ID parametresini kontrol edin.
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: darkMode ? "#fff" : "#000" }}>
        Restoran bulunamadı (ID: {currentRestaurantId}).
      </div>
    )
  }

  // --- JSX Structure ---
  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative", // For fixed elements
      }}
    >
      {/* Top Bar - Enhanced for mobile */}
      <div
        style={{
          backgroundColor: darkMode ? "#333" : "#47300A",
          padding: isMobile ? "0.5rem 1rem" : "0.6rem 1.5rem",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: isMobile ? "1rem" : "1.1rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Doy!
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "0.5rem" : "1rem" }}>
          {/* Mobile Cart Button with Badge */}
          {isMobile && (
            <div
              style={{
                position: "relative",
                cursor: "pointer",
                marginRight: "0.5rem",
              }}
              onClick={toggleMobileCart}
            >
              <FiShoppingCart size={22} color="white" />
              <CartBadge count={cartItemCount} darkMode={darkMode} />
            </div>
          )}

          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
          >
            <div
              style={{
                width: "34px",
                height: "18px",
                borderRadius: "20px",
                backgroundColor: "#F8F5DE",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#000",
                  position: "absolute",
                  top: "1px",
                  left: darkMode ? "17px" : "1px",
                  transition: "left 0.3s",
                }}
              />
            </div>
            <BsMoon color={darkMode ? "#ccc" : "#fff"} size={18} />
          </div>
          <div style={{ display: "flex", backgroundColor: "#F8F5DE", borderRadius: "10px", overflow: "hidden" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: isMobile ? "0.2rem 0.5rem" : "0.3rem 0.8rem",
                backgroundColor: "transparent",
                color: "#47300A",
                fontWeight: "bold",
                border: "none",
                borderRight: "1px solid #ccc",
                cursor: "pointer",
                fontSize: isMobile ? "0.8rem" : "inherit",
              }}
            >
              KAYIT
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: isMobile ? "0.2rem 0.5rem" : "0.3rem 0.8rem",
                backgroundColor: "transparent",
                color: "#47300A",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: isMobile ? "0.8rem" : "inherit",
              }}
            >
              GİRİŞ
            </button>
          </div>
        </div>
      </div>

      {/* Logo Bar - Enhanced for mobile */}
      <div
        style={{
          backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
          padding: isMobile ? "0.75rem 1.5rem" : "1rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexShrink: 0,
        }}
      >
        <img
          src={doyLogo || "/placeholder.svg"}
          alt="doylogo"
          style={{
            height: isMobile ? "70px" : "100px",
            borderRadius: "50%",
          }}
        />
        <h1
          style={{
            marginLeft: isMobile ? "1rem" : "2rem",
            color: darkMode ? "#eee" : "#47300A",
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {restaurant.restaurantName || "Restoran"}
        </h1>
      </div>

      {/* Divider */}
      <div style={{ height: "2px", backgroundColor: "#47300A", width: "100%", flexShrink: 0 }} />

      {/* Main Content Area - Enhanced for mobile */}
      <div style={{ padding: isMobile ? "1rem" : "2rem", flexGrow: 1 }}>
        {/* Restaurant Info & Cart Summary Row - Enhanced for mobile */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "flex-start",
            marginBottom: isMobile ? "2rem" : "3rem",
            gap: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {/* Left Side: Restaurant Details - Enhanced for mobile */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? "1rem" : "1.5rem",
              alignItems: "center",
              flexGrow: 1,
              minWidth: isMobile ? "100%" : "300px",
            }}
          >
            {restaurant.imageId ? (
              <img
                src={`http://localhost:8080/api/upload/image/${restaurant.imageId}` || "/placeholder.svg"}
                alt={restaurant.restaurantName}
                style={{
                  width: isMobile ? "120px" : "160px",
                  height: isMobile ? "120px" : "160px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: isMobile ? "120px" : "160px",
                  height: isMobile ? "120px" : "160px",
                  borderRadius: "16px",
                  backgroundColor: darkMode ? "#555" : "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: darkMode ? "#aaa" : "#555",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                Resim Yok
              </div>
            )}
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.5rem" }}>
                {renderStars(restaurant.rating)}{" "}
                {typeof restaurant.rating === "number" ? restaurant.rating.toFixed(1) : "N/A"}/5
              </div>
              <p
                style={{
                  margin: "0.5rem 0",
                  color: darkMode ? "#ccc" : "#333",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                }}
              >
                {restaurant.description || "Açıklama bulunamadı."}
              </p>
              <p
                style={{
                  margin: "0.5rem 0",
                  fontSize: isMobile ? "0.8rem" : "0.9rem",
                  color: darkMode ? "#bbb" : "#555",
                }}
              >
                {restaurant.time ? `Teslimat: ~${restaurant.time} dk` : ""}
                {restaurant.time && restaurant.minPrice ? " | " : ""}
                {restaurant.minPrice ? `Min. Sepet: ₺${restaurant.minPrice}` : ""}
              </p>
            </div>
          </div>

          {/* Right Side: Cart Summary - Enhanced for mobile */}
          {!isMobile && (
            <div
              style={{
                width: isMobile ? "100%" : "280px",
                flexShrink: 0,
                flexBasis: isMobile ? "auto" : "300px",
                position: "relative",
              }}
            >
              {/* Desktop Cart Badge */}
              {cartItemCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    backgroundColor: "#ff5722",
                    color: "white",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    border: `2px solid ${darkMode ? "#1c1c1c" : "#F2E8D6"}`,
                    zIndex: 2,
                  }}
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </div>
              )}
              <CartSummary cart={cart} onConfirm={handleConfirm} onRemove={handleRemoveFromCart} darkMode={darkMode} />
            </div>
          )}
        </div>

        {/* Mobile Cart Floating Button (always visible) */}
        {isMobile && !showMobileCart && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 100,
              backgroundColor: darkMode ? "#333" : "#47300A",
              color: "white",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
            onClick={toggleMobileCart}
          >
            <div style={{ position: "relative" }}>
              <FiShoppingCart size={26} />
              <CartBadge count={cartItemCount} darkMode={darkMode} />
            </div>
          </div>
        )}

        {/* Mobile Cart Overlay */}
        {isMobile && showMobileCart && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                padding: "1rem",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  Sepetim <span style={{ fontWeight: "normal", fontSize: "0.9rem" }}>({cartItemCount} ürün)</span>
                </h3>
                <button
                  onClick={toggleMobileCart}
                  style={{
                    background: "none",
                    border: "none",
                    color: darkMode ? "#fff" : "#000",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                >
                  ×
                </button>
              </div>

              <CartSummary cart={cart} onConfirm={handleConfirm} onRemove={handleRemoveFromCart} darkMode={darkMode} />

              {cartItemCount > 0 && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: darkMode ? "#333" : "#E7DECB",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.9rem", color: darkMode ? "#ccc" : "#666" }}>Toplam Tutar</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>₺{cartTotal.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={handleConfirm}
                    style={{
                      backgroundColor: "#ff5722",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.75rem 1.5rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Sepeti Onayla
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Quick Navigation for Mobile */}
        {isMobile && menu.categories.filter((cat) => cat.items.length > 0).length > 1 && (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "0.5rem",
              padding: "0.5rem 0",
              marginBottom: "1rem",
              WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
              scrollbarWidth: "none", // Hide scrollbar on Firefox
              msOverflowStyle: "none", // Hide scrollbar on IE/Edge
            }}
          >
            {menu.categories.map(
              (category, i) =>
                category.items.length > 0 && (
                  <button
                    key={`nav-${i}`}
                    onClick={() => {
                      // Expand the category and scroll to it
                      setExpandedCategories((prev) => ({ ...prev, [i]: true }))
                      document.getElementById(`category-${i}`).scrollIntoView({ behavior: "smooth" })
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: darkMode ? "#333" : "#E7DECB",
                      color: darkMode ? "#fff" : "#47300A",
                      border: "none",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {category.title}
                    <span
                      style={{
                        backgroundColor: darkMode ? "#555" : "#d0c4a9",
                        color: darkMode ? "#ddd" : "#47300A",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      {category.items.length}
                    </span>
                  </button>
                ),
            )}
          </div>
        )}

        {/* Menu Sections - Now with collapsible functionality on mobile */}
        {loadingMenu ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Menü yükleniyor...</div>
        ) : menu.categories.length > 0 ? (
          menu.categories.map(
            (category, i) =>
              category.items.length > 0 && (
                <div
                  key={`cat-${i}-${currentRestaurantId}`}
                  style={{ marginBottom: isMobile ? "1.5rem" : "3rem" }}
                  id={`category-${i}`}
                >
                  {/* Category Header - Clickable on mobile */}
                  <div
                    onClick={isMobile ? () => toggleCategory(i) : undefined}
                    style={{
                      marginBottom: isMobile ? "0.75rem" : "1.5rem",
                      color: darkMode ? "#fff" : "#000",
                      borderBottom: `2px solid ${darkMode ? "#555" : "#ccc"}`,
                      paddingBottom: "0.5rem",
                      cursor: isMobile ? "pointer" : "default",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ fontSize: isMobile ? "1.2rem" : "1.5rem", margin: 0 }}>{category.title}</h3>
                    {isMobile && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "0.8rem", marginRight: "0.5rem", color: darkMode ? "#aaa" : "#666" }}>
                          {category.items.length} ürün
                        </span>
                        {expandedCategories[i] ? (
                          <FiChevronUp size={20} color={darkMode ? "#aaa" : "#666"} />
                        ) : (
                          <FiChevronDown size={20} color={darkMode ? "#aaa" : "#666"} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Category Content - Collapsible on mobile */}
                  <div
                    style={{
                      display: !isMobile || expandedCategories[i] ? "block" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                          ? "repeat(auto-fit, minmax(250px, 1fr))"
                          : "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: isMobile ? "1rem" : "1.5rem",
                      }}
                    >
                      {category.items.map((item) => (
                        <ProductCard key={item.id} item={item} onAdd={handleAddToCart} darkMode={darkMode} />
                      ))}
                    </div>
                  </div>
                </div>
              ),
          )
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>Menü bilgisi bulunamadı.</div>
        )}
      </div>

      {/* Footer - Enhanced for mobile */}
      <footer
        style={{
          marginTop: "auto",
          padding: isMobile ? "1.5rem 1rem" : "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          borderTop: `1px solid ${darkMode ? "#444" : "#ddd"}`,
          flexShrink: 0,
        }}
      >
        <img
          src={doyLogo || "/placeholder.svg"}
          alt="Logo alt"
          style={{
            height: isMobile ? "40px" : "50px",
            width: isMobile ? "40px" : "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div style={{ display: "flex", gap: isMobile ? "0.75rem" : "1rem" }}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaXTwitter size={isMobile ? 18 : 20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaInstagram size={isMobile ? 18 : 20} />
          </a>
          <a
            href="https://googleusercontent.com/youtube.com/3"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLinkStyle(darkMode)}
          >
            <FaYoutube size={isMobile ? 18 : 20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaLinkedin size={isMobile ? 18 : 20} />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default RestaurantDetail
