import { useState, useEffect } from "react"
import { Link, useLocation } from "wouter"
import { Switch } from "../components/ui/switch"
import { Input } from "../components/ui/input"
import {
  Moon,
  Search,
  Star,
  MapPin,
  ChevronRight,
  Utensils,
  Filter,
  Clock,
  TrendingUp,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useRestaurantApi from "../services/useRestaurantApi"
import { CartProvider, useCart } from "../hooks/cart-context"
import Cart from "../components/ui/cart"

function RestaurantsPageContent() {
  const [location, setLocation] = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentNeighborhood, setCurrentNeighborhood] = useState("Kadıköy") // Default neighborhood
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("default") // default, rating, deliveryTime, etc.

  // Use the cart context
  const { totalItems, setIsCartOpen } = useCart()

  // Use the custom API hook
  const {
    restaurants = [],
    featuredRestaurants = [],
    categories = [],
    neighborhoods = [],
    popularCuisines = [],
    isLoading = false,
    error = null,
    loadInitialData,
    searchRestaurants,
    fetchNearbyRestaurants,
  } = useRestaurantApi()

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await loadInitialData(currentNeighborhood)
        setIsLoaded(true)
      } catch (err) {
        console.error("Failed to load initial data:", err)
      }
    }

    fetchInitialData()
  }, [loadInitialData, currentNeighborhood])

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === "") {
        // If search is cleared, restore original restaurants
        await fetchNearbyRestaurants(currentNeighborhood)
        return
      }

      // Search with a debounce
      await searchRestaurants(searchQuery)
    }

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(handleSearch, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentNeighborhood, fetchNearbyRestaurants, searchRestaurants])

  // Filter by category
  useEffect(() => {
    const filterByCategory = async () => {
      if (!selectedCategory) {
        await fetchNearbyRestaurants(currentNeighborhood)
        return
      }

      // Using the search function for filtering by category
      await searchRestaurants(selectedCategory)
    }

    if (isLoaded) {
      filterByCategory()
    }
  }, [selectedCategory, currentNeighborhood, fetchNearbyRestaurants, searchRestaurants, isLoaded])

  // Render star ratings with animation
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 * star,
            }}
          >
            <Star className={`h-4 w-4 ${star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
          </motion.div>
        ))}
      </div>
    )
  }

  // Handle order button click
  const handleOrderClick = (restaurantId) => {
    setLocation(`/restaurants/${restaurantId}`)
  }

  // Toggle favorite status (would connect to API in real app)
  const toggleFavorite = (e, restaurantId) => {
    e.stopPropagation()
    // In a real app, this would call an API to toggle favorite status
    console.log(`Toggle favorite for restaurant ${restaurantId}`)
  }

  // Add to cart functionality
  const { addItem } = useCart()

  const handleAddToCart = (e, restaurant) => {
    e.stopPropagation()

    // In a real app, this would open a modal to select menu items
    // For now, we'll just add a sample item
    addItem({
      id: `${restaurant.id}-burger`,
      name: "Tavuk Burger",
      price: 240,
      quantity: 1,
      image: restaurant.image,
      description: "Ev yapımı burger ekmeğine; 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
    })

    // Open the cart
    setIsCartOpen(true)
  }

  // Sort restaurants based on the selected criteria
  const getSortedRestaurants = () => {
    if (!restaurants || !Array.isArray(restaurants) || restaurants.length === 0) return []

    switch (sortBy) {
      case "rating":
        return [...restaurants].sort((a, b) => b.rating - a.rating)
      case "deliveryTime":
        return [...restaurants].sort((a, b) => {
          const aTime = Number.parseInt(a.deliveryTime.split("-")[0])
          const bTime = Number.parseInt(b.deliveryTime.split("-")[0])
          return aTime - bTime
        })
      case "minOrder":
        return [...restaurants].sort((a, b) => {
          const aAmount = Number.parseInt(a.minOrderAmount)
          const bAmount = Number.parseInt(b.minOrderAmount)
          return aAmount - bAmount
        })
      default:
        return restaurants
    }
  }

  // Get the sorted restaurants
  const sortedRestaurants = getSortedRestaurants()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const logoVariants = {
    initial: { rotate: 0 },
    hover: {
      rotate: 5,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-[#f5f2e8] text-gray-800"}`}>
      {/* Header section */}
      <motion.header
        className={`${darkMode ? "bg-gray-800" : "bg-[#47300A]"} text-white py-3 px-6 shadow-md`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/">
              <span className="font-bold text-xl tracking-tight">Doy!</span>
            </Link>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div className="flex items-center gap-2" whileTap={{ scale: 0.95 }}>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className={`${darkMode ? "data-[state=checked]:bg-amber-400" : "data-[state=checked]:bg-amber-200"}`}
              />
              <motion.div animate={{ rotate: darkMode ? 360 : 0 }} transition={{ duration: 0.5 }}>
                <Moon className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-200"}`} />
              </motion.div>
            </motion.div>

            {/* Cart button */}
            <motion.button
              className="relative p-2 rounded-full bg-amber-500 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </motion.button>

            <Link href="/auth?tab=register">
              <motion.button
                className="bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-full px-5 py-1.5 text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                KAYIT
              </motion.button>
            </Link>
            <Link href="/auth?tab=login">
              <motion.button
                className="bg-white hover:bg-gray-100 text-amber-800 rounded-full px-5 py-1.5 text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                GİRİŞ
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero section with logo and address selection */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-amber-100 to-amber-200"} py-12 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="flex items-center mb-8 md:mb-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          >
            <motion.div
              className="rounded-full bg-white p-6 w-36 h-36 flex items-center justify-center shadow-lg"
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
            >
              <div className="relative w-28 h-28">
                <motion.img
                  src="/image1.png"
                  alt="DOY Logo"
                  width={112}
                  height={112}
                  className="w-full h-full"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
                <div className="text-center text-[10px] font-bold mt-1 text-gray-600">FOOD DELIVERY</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
          >
            <motion.h2
              className={`${darkMode ? "text-amber-300" : "text-amber-800"} text-2xl font-semibold mb-6`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Konumunu seç, karnın doysun!
            </motion.h2>

            {/* Location picker */}
            <motion.div className="relative w-full md:w-96" whileHover={{ scale: 1.01 }}>
              <motion.button
                className="bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-full flex items-center px-8 py-4 w-full shadow-md transition-all hover:shadow-lg"
                whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <motion.div
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                </motion.div>
                <span className="font-medium">{currentNeighborhood || "Adresini Belirle veya Seç"}</span>
                <motion.div
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </motion.div>
              </motion.button>

              {/* Dropdown for neighborhoods */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    className={`absolute top-full left-0 right-0 mt-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl z-10 p-4`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className={`text-lg font-medium mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>Semtler</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {neighborhoods &&
                        neighborhoods.length > 0 &&
                        neighborhoods.map((hood) => (
                          <motion.button
                            key={hood}
                            className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              currentNeighborhood === hood
                                ? darkMode
                                  ? "bg-amber-500 text-white"
                                  : "bg-amber-500 text-white"
                                : darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-amber-100"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCurrentNeighborhood(hood)
                              setShowFilters(false)
                            }}
                          >
                            {hood}
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search and filter bar */}
      <div
        className={`${darkMode ? "bg-gray-900" : "bg-amber-50"} py-8 px-6 sticky top-0 z-20 ${darkMode ? "shadow-gray-800/30" : "shadow-amber-800/10"} shadow-md`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <motion.div
              className="relative w-full md:max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
            >
              <Input
                type="text"
                placeholder="Restoran veya Mutfak Ara"
                className={`${
                  darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-amber-100"
                } pl-12 pr-4 py-3 rounded-full shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                animate={{
                  rotate: searchQuery ? [0, 15, 0, -15, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <Search className="h-5 w-5 text-amber-500" />
              </motion.div>
            </motion.div>

            {/* Category filters */}
            <motion.div
              className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
            >
              <motion.button
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? darkMode
                      ? "bg-amber-500 text-white"
                      : "bg-amber-500 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-white text-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
              >
                Tümü
              </motion.button>

              {categories &&
                categories.length > 0 &&
                categories.slice(0, 10).map((category) => (
                  <motion.button
                    key={category}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? darkMode
                          ? "bg-amber-500 text-white"
                          : "bg-amber-500 text-white"
                        : darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-white text-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </motion.button>
                ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Restaurant listings */}
      <div className={`flex-grow px-6 pb-12 ${darkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <div className="max-w-7xl mx-auto">
          {/* Loading state */}
          {isLoading && (
            <motion.div
              className="flex justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className={`${darkMode ? "text-amber-400" : "text-amber-600"} mb-4`}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                >
                  <Utensils className="h-12 w-12" />
                </motion.div>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg`}>Restoranlar yükleniyor...</p>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <motion.div className="flex justify-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col items-center">
                <div className={`${darkMode ? "text-red-400" : "text-red-600"} mb-4`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg font-medium mb-2`}>
                  Bir hata oluştu
                </p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center max-w-md mb-4`}>
                  {error && typeof error === "string" ? error : "Bilinmeyen bir hata oluştu."}
                </p>
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-amber-500 text-white" : "bg-amber-500 text-white"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadInitialData(currentNeighborhood)}
                >
                  Tekrar Dene
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Featured restaurants section */}
          {!isLoading && !error && featuredRestaurants && featuredRestaurants.length > 0 && (
            <motion.div
              className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-8 shadow-lg mb-8`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <TrendingUp className={`h-5 w-5 mr-2 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
                <motion.h2
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Öne Çıkan Restoranlar
                </motion.h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={`featured-${restaurant.id}`}
                    className={`flex flex-col rounded-lg overflow-hidden shadow-md ${
                      darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-amber-50"
                    } transition-colors cursor-pointer`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => handleOrderClick(restaurant.id)}
                  >
                    <div className="relative h-32 bg-amber-100 overflow-hidden">
                      {restaurant.image ? (
                        <img
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Utensils className="h-12 w-12 text-amber-500 opacity-50" />
                        </div>
                      )}
                      {restaurant.hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          %{restaurant.discountPercentage} İndirim
                        </div>
                      )}
                      {restaurant.isNew && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          YENİ
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {restaurant.name}
                        </h3>
                        <motion.button
                          className={`p-1 rounded-full ${
                            restaurant.isFavorite
                              ? "text-red-500"
                              : darkMode
                                ? "text-gray-500 hover:text-gray-300"
                                : "text-gray-400 hover:text-gray-600"
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => toggleFavorite(e, restaurant.id)}
                        >
                          <Heart className={`h-4 w-4 ${restaurant.isFavorite ? "fill-current" : ""}`} />
                        </motion.button>
                      </div>
                      <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {restaurant.cuisine}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={`featured-star-${restaurant.id}-${star}`}
                              className={`h-3 w-3 ${
                                star <= restaurant.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs ml-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          ({restaurant.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{restaurant.deliveryTime}</span>
                        <span
                          className={
                            restaurant.deliveryFee === "Ücretsiz"
                              ? darkMode
                                ? "text-green-400"
                                : "text-green-600"
                              : darkMode
                                ? "text-gray-400"
                                : "text-gray-600"
                          }
                        >
                          {restaurant.deliveryFee}
                        </span>
                      </div>

                      {/* Add to cart button */}
                      <motion.button
                        onClick={(e) => handleAddToCart(e, restaurant)}
                        className="w-full mt-2 py-1.5 bg-amber-500 text-white text-xs rounded-full hover:bg-amber-600 transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Sepete Ekle
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main restaurant list */}
          <motion.div
            className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-8 shadow-lg`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.h1
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {searchQuery
                  ? `"${searchQuery}" için Sonuçlar`
                  : selectedCategory
                    ? `${selectedCategory} Restoranları`
                    : `${currentNeighborhood} Bölgesindeki Restoranlar`}
              </motion.h1>

              <div className="flex items-center">
                {/* Sort dropdown */}
                <div className="relative">
                  <motion.button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-amber-50 text-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // In a real app this would open a dropdown
                      const sortOptions = ["default", "rating", "deliveryTime", "minOrder"]
                      const currentIndex = sortOptions.indexOf(sortBy)
                      const nextIndex = (currentIndex + 1) % sortOptions.length
                      setSortBy(sortOptions[nextIndex])
                    }}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {sortBy === "default" && "Önerilen Sıralama"}
                      {sortBy === "rating" && "En Yüksek Puan"}
                      {sortBy === "deliveryTime" && "En Hızlı Teslimat"}
                      {sortBy === "minOrder" && "En Düşük Minimum Sipariş"}
                    </span>
                  </motion.button>
                </div>

                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ml-2 ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-amber-50 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">Filtrele</span>
                </motion.div>
              </div>
            </div>

            {/* Empty state */}
            {!isLoading && !error && restaurants && restaurants.length === 0 && (
              <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Utensils className={`h-16 w-16 ${darkMode ? "text-gray-600" : "text-gray-300"} mb-4`} />
                <h3 className={`text-xl font-medium ${darkMode ? "text-white" : "text-gray-800"} mb-2`}>
                  Restoran Bulunamadı
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} text-center max-w-md mb-4`}>
                  Arama kriterlerinize uygun restoran bulunamadı. Lütfen farklı bir arama terimi veya filtre deneyin.
                </p>
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-amber-500 text-white" : "bg-amber-500 text-white"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                    fetchNearbyRestaurants(currentNeighborhood)
                  }}
                >
                  Tümünü Göster
                </motion.button>
              </motion.div>
            )}

            {/* Restaurant list */}
            {!isLoading && !error && restaurants && restaurants.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
              >
                {sortedRestaurants &&
                  sortedRestaurants.length > 0 &&
                  sortedRestaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      className={`flex items-start p-4 rounded-lg transition-all ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-amber-50"
                      } cursor-pointer`}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        transition: { type: "spring", stiffness: 400, damping: 10 },
                      }}
                      onClick={() => handleOrderClick(restaurant.id)}
                    >
                      <motion.div
                        className={`rounded-lg overflow-hidden mr-4 relative ${darkMode ? "bg-gray-700" : "bg-amber-100"}`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <div className="w-24 h-24 flex items-center justify-center">
                          {restaurant.image ? (
                            <img
                              src={restaurant.image || "/placeholder.svg"}
                              alt={restaurant.name}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          ) : (
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="opacity-70"
                            >
                              <Utensils className="h-12 w-12 text-amber-500" />
                            </motion.div>
                          )}
                        </div>
                        {restaurant.isNew && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                            YENİ
                          </div>
                        )}
                        {!restaurant.isOpen && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white text-xs font-bold px-2 py-1 bg-gray-900 bg-opacity-80 rounded">
                              KAPALI
                            </span>
                          </div>
                        )}
                      </motion.div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <motion.h3
                            className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            {restaurant.name}
                            {restaurant.isChain && (
                              <span
                                className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                  darkMode ? "bg-blue-500 bg-opacity-30 text-blue-200" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                ZİNCİR
                              </span>
                            )}
                          </motion.h3>
                          <div className="flex items-center">
                            <motion.span
                              className={`text-xs px-2 py-1 rounded-full ${
                                darkMode ? "bg-gray-700 text-gray-300" : "bg-amber-100 text-amber-800"
                              }`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * index + 0.1 }}
                            >
                              {restaurant.priceRange}
                            </motion.span>
                            <motion.button
                              className={`ml-2 p-1 rounded-full ${
                                restaurant.isFavorite
                                  ? "text-red-500"
                                  : darkMode
                                    ? "text-gray-500 hover:text-gray-300"
                                    : "text-gray-400 hover:text-gray-600"
                              }`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              onClick={(e) => toggleFavorite(e, restaurant.id)}
                            >
                              <Heart className={`h-5 w-5 ${restaurant.isFavorite ? "fill-current" : ""}`} />
                            </motion.button>
                          </div>
                        </div>
                        <motion.p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * index + 0.1 }}
                        >
                          {restaurant.cuisine} • {restaurant.deliveryTime}
                        </motion.p>
                        <div className="flex items-center my-2">
                          {renderStars(restaurant.rating)}
                          <motion.span
                            className={`ml-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index + 0.2 }}
                          >
                            ({restaurant.reviewCount})
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 mb-2">
                          <motion.span
                            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index + 0.2 }}
                          >
                            Min. {restaurant.minOrderAmount}
                          </motion.span>
                          <motion.span
                            className={`text-xs ${
                              restaurant.deliveryFee === "Ücretsiz"
                                ? darkMode
                                  ? "text-green-400"
                                  : "text-green-600"
                                : darkMode
                                  ? "text-gray-400"
                                  : "text-gray-600"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                          >
                            Teslimat: {restaurant.deliveryFee}
                          </motion.span>
                          {restaurant.popularDishes && restaurant.popularDishes.length > 0 && (
                            <motion.span
                              className={`text-xs ${darkMode ? "text-amber-400" : "text-amber-700"}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * index + 0.4 }}
                            >
                              🔥 {restaurant.popularDishes[0]}
                            </motion.span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <motion.button
                            onClick={(e) => handleAddToCart(e, restaurant)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-6 py-2 rounded-full transition-colors shadow-sm"
                            whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            disabled={!restaurant.isOpen}
                          >
                            {restaurant.isOpen ? "Sepete Ekle" : "Şu Anda Kapalı"}
                          </motion.button>
                          {restaurant.hasDiscount && (
                            <motion.span
                              className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
                            >
                              %{restaurant.discountPercentage} İndirim
                            </motion.span>
                          )}
                          {restaurant.deliveryFee === "Ücretsiz" && (
                            <motion.span
                              className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
                            >
                              Ücretsiz Teslimat
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className={`${
          darkMode ? "bg-gray-800 border-t border-gray-700" : "bg-[#47300A] border-t border-amber-200"
        } py-8 px-6 text-white`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <motion.div
              className="rounded-full bg-white p-4 w-20 h-20 flex items-center justify-center shadow-md mr-4"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="relative w-16 h-16">
                <img src="/image1.png" alt="DOY Logo" width={64} height={64} className="w-full h-full" />
              </div>
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-white">Doy!</h3>
              <p className="text-sm text-white opacity-80">FOOD DELIVERY</p>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              {
                href: "https://twitter.com",
                path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
              },
              {
                href: "https://instagram.com",
                path: ["M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", "M17.5 6.5h.01"],
                rect: { width: 20, height: 20, x: 2, y: 2, rx: 5, ry: 5 },
              },
              {
                href: "https://youtube.com",
                path: [
                  "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
                  "m10 15 5-3-5-3z",
                ],
              },
              {
                href: "https://linkedin.com",
                path: [
                  "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                  "M4 4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
                ],
                rect: { width: 4, height: 12, x: 2, y: 9 },
              },
            ].map((social, index) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-amber-200 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  delay: 0.8 + index * 0.1,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {social.rect && <rect {...social.rect} />}
                  {Array.isArray(social.path) ? (
                    social.path.map((p, i) => <path key={i} d={p} />)
                  ) : (
                    <path d={social.path} />
                  )}
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <CartProvider>
      <RestaurantsPageContent />
      <Cart />
    </CartProvider>
  )
}

