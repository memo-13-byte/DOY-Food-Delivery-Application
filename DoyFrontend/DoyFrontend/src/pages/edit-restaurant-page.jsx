"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams } from "wouter"
import { Button } from "../components/ui/button"
import { Toggle } from "../components/ui/toggle"
import { Sun, Moon, X, Plus, Twitter, Instagram, Youtube, Linkedin, ChevronLeft, Edit, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

export default function RestaurantManagePage() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const { id: restaurantId } = params
  const [darkMode, setDarkMode] = useState(false)
  const [activeCategory, setActiveCategory] = useState(1)
  const categoryMap = new Map()
  categoryMap.set("COMBO", 0)
  categoryMap.set("MAIN_DISH", 1)
  categoryMap.set("DRINK", 2)
  categoryMap.set("EXTRA", 3)

  // Mock restaurant data
  const [restaurant, setRestaurant] = useState({
    name: "Restoran A",
    description: "Restoran Hakkında kısım",
  })

  // Mock menu categories and items
  const [menuCategories, setMenuCategories] = useState([
    {
      id: 1,
      name: "Menüler",
      items: [
        {
          id: 1,
          name: "Tavuk Burger Menü",
          description: "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
          price: 300,
        },
        {
          id: 2,
          name: "Tavuk Burger Menü",
          description: "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
          price: 300,
        },
      ],
    },
    {
      id: 2,
      name: "Yiyecek Seçenekleri",
      items: [
        {
          id: 3,
          name: "Tavuk Burger",
          description: "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
          price: 240,
        },
        {
          id: 4,
          name: "Tavuk Burger",
          description: "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
          price: 240,
        },
        {
          id: 5,
          name: "Tavuk Burger",
          description: "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
          price: 240,
        },
        {
          id: 6,
          name: "Tavuk Burger",
          description: "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı tavuk burger köftesi, marul, burger sos, mayonez",
          price: 240,
        },
      ],
    },
    {
      id: 3,
      name: "İçecek Seçenekleri",
      items: [
        {
          id: 7,
          name: "Soda",
          description: "Cam şişede sade soda",
          price: 25,
        },
        {
          id: 8,
          name: "Soda",
          description: "Cam şişede sade soda",
          price: 25,
        },
        {
          id: 9,
          name: "Soda",
          description: "Cam şişede sade soda",
          price: 25,
        },
        {
          id: 10,
          name: "Soda",
          description: "Cam şişede sade soda",
          price: 25,
        },
      ],
    },
    {
      id: 4,
      name: "Ek Seçenekleri",
      items: [
        {
          id: 11,
          name: "Patates Kızartması",
          description: "Parmak dilim patates kızartması",
          price: 100,
        },
        {
          id: 12,
          name: "Patates Kızartması",
          description: "Parmak dilim patates kızartması",
          price: 100,
        },
        {
          id: 13,
          name: "Patates Kızartması",
          description: "Parmak dilim patates kızartması",
          price: 100,
        },
        {
          id: 14,
          name: "Patates Kızartması",
          description: "Parmak dilim patates kızartması",
          price: 100,
        },
      ],
    },
  ])

  // Function to delete a menu item
  const deleteMenuItem = (categoryId, itemId) => {
    setMenuCategories(
      menuCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          }
        }
        return category
      }),
    )
  }

  // Function to navigate to add item page
  const addMenuItem = (categoryId) => {
    setLocation(`/restaurants/${restaurantId}/add-item/${categoryId}`)
  }

  // Function to go back to restaurant profile
  const handleBackToProfile = () => {
    setLocation(`/restaurant/profile`)
  }

  // Toggle dark mode and update body class
  useEffect(() => {
    const getRestaurantInformation = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/restaurant/get/${restaurantId || 1}`)
        const restInfo = {
          name: response.data.restaurantName,
          description: response.data.restaurantPhone,
        }
        setRestaurant(restInfo)
      } catch (e) {
        alert("patladım")
      }
    }

    const getRestaurantItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/item/get-items/${restaurantId || 1}`)
        const itemData = [
          {
            id: 1,
            name: "Menüler",
            items: [],
          },
          {
            id: 2,
            name: "Yiyecek Seçenekleri",
            items: [],
          },
          {
            id: 3,
            name: "İçecek Seçenekleri",
            items: [],
          },
          {
            id: 4,
            name: "Ek Seçenekleri",
            items: [],
          },
        ]
        const responseItems = response.data
        console.log(response)

        for (let i = 0; i < responseItems.length; i++) {
          itemData[categoryMap.get(responseItems[i].menuItemType)].items.push({
            id: responseItems[i].id,
            name: responseItems[i].name,
            description: responseItems[i].description,
            price: responseItems[i].price,
          })
        }
        setMenuCategories(itemData)
      } catch (e) {
        console.log(e)
        alert("Error fetching data.")
      }
    }

    getRestaurantInformation().then(() => getRestaurantItems())

    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode, restaurantId])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100"}`}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-10 flex items-center justify-between p-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-amber-600 to-amber-500"}`}
      >
        <motion.div whileHover={{ scale: 1.05 }} className="text-xl font-bold text-white">
          <Link href="/">
            <span className="flex items-center gap-2">
              <img src="/image1.png" alt="Doy Logo" className="h-8 w-8 rounded-full bg-white p-1" />
              Doy!
            </span>
          </Link>
        </motion.div>
        <div className="flex items-center gap-3">
          <Toggle
            variant="outline"
            size="sm"
            aria-label="Toggle theme"
            pressed={darkMode}
            onPressedChange={setDarkMode}
            className={`border ${darkMode ? "border-gray-600 bg-gray-700" : "border-amber-400 bg-amber-200"}`}
          >
            {darkMode ? <Moon className="h-4 w-4 text-amber-200" /> : <Sun className="h-4 w-4 text-amber-600" />}
          </Toggle>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className={`font-medium ${darkMode ? "text-white hover:bg-gray-700" : "text-white hover:bg-amber-600"}`}
            >
              {restaurant.name}
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative h-48 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-amber-300"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <img
          src="/placeholder.svg?height=200&width=1200"
          alt="Restaurant Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-4 left-4 flex items-end gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`relative h-24 w-24 overflow-hidden rounded-full border-4 ${darkMode ? "border-gray-700 bg-gray-800" : "border-white bg-white"} shadow-lg`}
          >
            <img
              src="/placeholder.svg?height=96&width=96"
              alt="Restaurant Logo"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white"
          >
            <h1 className="text-2xl font-bold drop-shadow-md">{restaurant.name}</h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Restaurant Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mb-8 rounded-xl p-6 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg?height=128&width=128"
                alt="Restaurant Icon"
                className="h-full w-full object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute bottom-2 right-2 rounded-full p-1 ${darkMode ? "bg-gray-700" : "bg-amber-100"}`}
              >
                <ImageIcon className={`h-4 w-4 ${darkMode ? "text-amber-300" : "text-amber-600"}`} />
              </motion.button>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-full p-2 ${darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-100 text-amber-600"}`}
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
              </div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{restaurant.description}</p>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-500 text-white hover:bg-amber-400"} transition-colors`}
                >
                  Profil Düzenle
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-amber-200 text-amber-800 hover:bg-amber-300"} transition-colors`}
                >
                  Menü Ayarları
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mb-6 overflow-x-auto rounded-xl p-2 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex gap-2">
            {menuCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? darkMode
                      ? "bg-amber-600 text-white"
                      : "bg-amber-500 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                {category.name} ({category.items.length})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Menu Sections */}
        <AnimatePresence mode="wait">
          {menuCategories.map(
            (category) =>
              category.id === activeCategory && (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MenuSection
                    title={category.name}
                    count={category.items.length}
                    onAddItem={() => addMenuItem(category.id)}
                    darkMode={darkMode}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {category.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <MenuItem
                            image="/placeholder.svg?height=100&width=100"
                            title={item.name}
                            description={item.description}
                            price={`${item.price} TL`}
                            onDelete={() => deleteMenuItem(category.id, item.id)}
                            darkMode={darkMode}
                            category={category}
                            item={item}
                            setLocation={setLocation}
                            restaurantId={restaurantId}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </MenuSection>
                </motion.div>
              ),
          )}
        </AnimatePresence>

        {/* Back to Profile Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackToProfile}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
              darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-400 text-amber-900 hover:bg-amber-300"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            Profil Sayfasına Dön
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`mt-8 border-t ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-amber-200 bg-gradient-to-b from-amber-100 to-amber-200"
        } py-8`}
      >
        <div className="container mx-auto flex flex-col items-center justify-center gap-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative h-16 w-16 overflow-hidden rounded-full bg-white p-2 shadow-md"
          >
            <img src="/image1.png" alt="DOY Food Delivery" className="object-contain" />
          </motion.div>
          <div className="flex gap-6">
            {[Twitter, Instagram, Youtube, Linkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full p-2 ${
                  darkMode
                    ? "bg-gray-700 text-amber-300 hover:bg-gray-600"
                    : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
          <p className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-amber-700"}`}>
            © {new Date().getFullYear()} Doy! Tüm hakları saklıdır.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

function MenuSection({ title, count, children, onAddItem, darkMode }) {
  return (
    <div className="mb-8">
      <div className={`mb-4 flex items-center gap-3 rounded-xl p-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <h2 className="text-xl font-bold">{title}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddItem}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-500 text-white hover:bg-amber-400"
          }`}
        >
          <Plus className="h-4 w-4" />
        </motion.button>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
            darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-200 text-amber-800"
          }`}
        >
          {count}
        </span>
      </div>
      {children}
    </div>
  )
}

function MenuItem({ image, title, description, price, onDelete, darkMode, category, item, setLocation, restaurantId }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`flex overflow-hidden rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} p-4 shadow-md transition-shadow ${isHovered ? "shadow-lg" : "shadow-sm"}`}
    >
      <div className="relative mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
        >
          <X className="h-3 w-3" />
        </motion.button>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="mb-1 font-bold">{title}</h3>
        <p className={`mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-100 text-amber-800"
            }`}
          >
            {price}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation(`/restaurants/${restaurantId}/edit-item/${category.id}/${item.id}`)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-500 text-white hover:bg-amber-400"
            }`}
          >
            Düzenle
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
