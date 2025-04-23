"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { Sun, Moon, X, Plus, Twitter, Instagram, Youtube, Linkedin, ChevronLeft, Edit, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

export default function RestaurantManagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const restaurantId = params.id
  const [darkMode, setDarkMode] = useState(false)
  const [activeCategory, setActiveCategory] = useState(1)
  const categoryMap = new Map()
  categoryMap.set("MENU", 0)
  categoryMap.set("MAIN_DISH", 1)
  categoryMap.set("DRINK", 2)
  categoryMap.set("COMBO", 3)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")
  // Add a new state for the restaurant image at the top of the component with the other state declarations
  const [restaurantImage, setRestaurantImage] = useState("/placeholder.svg?height=128&width=128")
  const fileInputRef = useRef(null)

  // Restoran verilerini ID'ye göre getir
  const [restaurant, setRestaurant] = useState({
    name: "Restoran A",
    description: "Restoran Hakkında kısım",
  })

  // Mock function to get restaurant data by ID
  const getRestaurantById = (id) => {
    // Mock data for restaurants
    const restaurants = [
      {
        id: "1",
        name: "Lezzet Köşesi",
        description: "Geleneksel Türk lezzetleri",
      },
      {
        id: "2",
        name: "Pasta Durağı",
        description: "Enfes İtalyan lezzetleri",
      },
      {
        id: "3",
        name: "Sushi Cenneti",
        description: "Uzakdoğu lezzetleri",
      },
      {
        id: "4",
        name: "Burger Diyarı",
        description: "Amerikan lezzetleri",
      },
    ]

    // Find the restaurant by ID
    const restaurant = restaurants.find((r) => r.id === id)
    return restaurant || null // Return the restaurant object or null if not found
  }

  // ID'ye göre restoran verilerini yükle
  useEffect(() => {
    if (restaurantId) {
      try {
        // ID'ye göre restaurant verilerini al
        const restaurantData = getRestaurantById(restaurantId)
        if (restaurantData) {
          setRestaurant((prev) => ({
            ...prev,
            name: restaurantData.name || prev.name,
            description: restaurantData.description || prev.description,
          }))
        }
        console.log(`Restaurant ID: ${restaurantId} için veriler yüklendi`)
      } catch (error) {
        console.error("Restoran verisi yüklenirken hata oluştu:", error)
      }
    }

    // Dark mode body class
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [restaurantId, darkMode])

  // Mock menu categories and items
  const [menuCategories, setMenuCategories] = useState([
    {
      id: 1,
      name: "Sandviçler",
      items: [
        {
          id: 1,
          name: "Tavuk Sandviç",
          description: "Izgara tavuk, marul, domates, turşu, özel sos",
          price: 120,
        },
        {
          id: 2,
          name: "Köfte Sandviç",
          description: "Izgara köfte, marul, domates, turşu, özel sos",
          price: 135,
        },
        {
          id: 3,
          name: "Veggie Sandviç",
          description: "Izgara sebzeler, marul, domates, özel sos",
          price: 100,
        },
      ],
    },
    {
      id: 2,
      name: "Pizzalar",
      items: [
        {
          id: 4,
          name: "Margherita",
          description: "Domates sos, mozzarella, fesleğen",
          price: 150,
        },
        {
          id: 5,
          name: "Pepperoni",
          description: "Domates sos, mozzarella, pepperoni",
          price: 180,
        },
        {
          id: 6,
          name: "Dört Peynirli",
          description: "Domates sos, mozzarella, parmesan, gorgonzola, ricotta",
          price: 190,
        },
      ],
    },
    {
      id: 3,
      name: "İçecekler",
      items: [
        {
          id: 7,
          name: "Cola",
          description: "Kutu Cola",
          price: 30,
        },
        {
          id: 8,
          name: "Ayran",
          description: "Ev yapımı ayran",
          price: 20,
        },
        {
          id: 9,
          name: "Şalgam",
          description: "Şalgam suyu",
          price: 20,
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
    axios.delete(`http://localhost:8080/api/item/delete/${itemId}`).then(
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
      ),
    )
  }

  const handleAddItemClick = (categoryId) => {
    // Ensure restaurantId is passed in the URL
    navigate(`/restaurants/manage/${restaurantId}/add-item/${categoryId}`)
  }

  const handleEditItemClick = (categoryId, itemId) => {
    // Ensure restaurantId is passed in the URL
    navigate(`/restaurants/manage/${restaurantId}/edit-item/${categoryId}/${itemId}`)
  }

  const handleButtonClick = (categoryId) => {
    setActiveCategory(categoryId)
  }

  const handleBackClick = () => {
    // Updated to match App.js routing structure
    navigate(`/restaurant/profile/${restaurantId || ""}`)
  }

  useEffect(() => {
    const getRestaurantInformation = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/restaurant/get/${restaurantId}`)
        const restInfo = {
          name: response.data.restaurantName,
          description: response.data.restaurantPhone,
        }

        setRestaurant(restInfo)
      } catch (error) {
        alert("Error fetching restaurant information:", error)
      }
    }

    const getRestaurantItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/item/get-items/${restaurantId}`)
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
        console.log("Response Items:", responseItems)

        for (let i = 0; i < responseItems.length; i++) {
          itemData[categoryMap.get(responseItems[i].menuItemType)].items.push({
            id: responseItems[i].id,
            name: responseItems[i].name,
            description: responseItems[i].description,
            price: responseItems[i].price,
          })
        }

        setMenuCategories(itemData)
      } catch (error) {
        console.log("Error fetching restaurant items:", error)
        alert("Error fetching restaurant items:", error)
      }
    }

    getRestaurantInformation().then(() => {
      getRestaurantItems()
    })

    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [restaurantId, darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState("")

  const handleEditProfileClick = () => {
    setIsEditing(true)
    setDescriptionInput(restaurant.description)
  }

  const handleSaveDescription = () => {
    setRestaurant((prev) => ({
      ...prev,
      description: descriptionInput,
    }))
    setIsEditing(false)
    // Here you would typically make an API call to update the restaurant description
    console.log("Saving new description:", descriptionInput)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveChangesClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmSave = () => {
    // Here you would typically make an API call to save all changes
    console.log("All changes saved successfully")
    setShowConfirmation(false)
    // You could add a success notification here
  }

  const handleCancelSave = () => {
    setShowConfirmation(false)
  }

  const handleEditNameClick = () => {
    setIsEditingName(true)
    setNameInput(restaurant.name)
  }

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setRestaurant((prev) => ({
        ...prev,
        name: nameInput,
      }))
      // Here you would typically make an API call to update the restaurant name
      console.log("Saving new name:", nameInput)
    }
    setIsEditingName(false)
  }

  const handleCancelNameEdit = () => {
    setIsEditingName(false)
  }

  // Add a function to handle the image icon click
  const handleImageIconClick = () => {
    fileInputRef.current.click()
  }

  // Add a function to handle the file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setRestaurantImage(event.target.result)
        // Here you would typically upload the file to your server
        console.log("File selected:", file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100"}`}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-10 flex items-center justify-between p-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-[#47300A] from-amber-800 to-amber-600"}`}
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
            onClick={toggleDarkMode}
            className={`flex h-8 w-8 items-center justify-center rounded-md border p-1 ${darkMode ? "border-gray-600 bg-gray-700" : "border-amber-400 bg-amber-200"}`}
          >
            {darkMode ? <Moon className="h-4 w-4 text-amber-200" /> : <Sun className="h-4 w-4 text-amber-600" />}
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }}>
            <button
              className={`rounded-md px-3 py-1 font-medium ${darkMode ? "text-white hover:bg-gray-700" : "text-white hover:bg-amber-600"}`}
            >
              {restaurant.name}
            </button>
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
            {/* Update the image element in the restaurant info section to use the restaurantImage state */}
            {/* Replace the existing image and button with this code: */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={restaurantImage || "/placeholder.svg"}
                alt="Restaurant Icon"
                className="h-full w-full object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImageIconClick}
                className={`absolute bottom-2 right-2 rounded-full p-1 ${darkMode ? "bg-gray-700" : "bg-amber-100"}`}
              >
                <ImageIcon className={`h-4 w-4 ${darkMode ? "text-amber-300" : "text-amber-600"}`} />
              </motion.button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                {isEditingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className={`rounded-md border px-2 py-1 text-xl font-bold ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                      }`}
                    />
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveName}
                        className={`rounded-full p-1 ${
                          darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancelNameEdit}
                        className={`rounded-full p-1 ${
                          darkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditNameClick}
                  className={`rounded-full p-2 ${darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-100 text-amber-600"}`}
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
              </div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    className={`w-full rounded-md border p-2 ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                    }`}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className={`rounded-md px-3 py-1 text-sm ${
                        darkMode
                          ? "bg-green-600 text-white hover:bg-green-500"
                          : "bg-green-500 text-white hover:bg-green-400"
                      }`}
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`rounded-md px-3 py-1 text-sm ${
                        darkMode
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{restaurant.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditProfileClick}
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
                onClick={() => handleButtonClick(category.id)}
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
                  <div className="mb-8">
                    <div
                      className={`mb-4 flex items-center gap-3 rounded-xl p-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
                    >
                      <h2 className="text-xl font-bold">{category.name}</h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddItemClick(category.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          darkMode
                            ? "bg-amber-600 text-white hover:bg-amber-500"
                            : "bg-amber-500 text-white hover:bg-amber-400"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                          darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-200 text-amber-800"
                        }`}
                      >
                        {category.items.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {category.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="relative">
                            <motion.div
                              whileHover={{ y: -5 }}
                              className={`flex overflow-hidden rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} p-4 shadow-md transition-shadow hover:shadow-lg`}
                            >
                              <div className="relative mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => deleteMenuItem(category.id, item.id)}
                                  className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                                >
                                  <X className="h-3 w-3" />
                                </motion.button>
                                <img
                                  src={`/placeholder.svg?height=100&width=100`}
                                  alt={item.name}
                                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                              </div>
                              <div className="flex flex-1 flex-col">
                                <h3 className="mb-1 font-bold">{item.name}</h3>
                                <p className={`mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                  {item.description}
                                </p>
                                <div className="mt-auto flex items-center justify-between">
                                  <div
                                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                                      darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    ₺{item.price}
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEditItemClick(category.id, item.id)}
                                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                                      darkMode
                                        ? "bg-amber-600 text-white hover:bg-amber-500"
                                        : "bg-amber-500 text-white hover:bg-amber-400"
                                    }`}
                                  >
                                    Düzenle
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>

        {/* Social Media Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md mb-6`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Sosyal Medya Hesapları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900/40" : "bg-blue-50"}`}>
                <Twitter className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
              </div>
              <input
                type="text"
                placeholder="Twitter kullanıcı adı"
                className={`flex-1 py-2 px-3 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-amber-500 text-gray-700"
                } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-150`}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${darkMode ? "bg-pink-900/40" : "bg-pink-50"}`}>
                <Instagram className={`h-5 w-5 ${darkMode ? "text-pink-400" : "text-pink-500"}`} />
              </div>
              <input
                type="text"
                placeholder="Instagram kullanıcı adı"
                className={`flex-1 py-2 px-3 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-amber-500 text-gray-700"
                } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-150`}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${darkMode ? "bg-red-900/40" : "bg-red-50"}`}>
                <Youtube className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-500"}`} />
              </div>
              <input
                type="text"
                placeholder="Youtube kanal linki"
                className={`flex-1 py-2 px-3 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-amber-500 text-gray-700"
                } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-150`}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900/40" : "bg-blue-50"}`}>
                <Linkedin className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
              </div>
              <input
                type="text"
                placeholder="LinkedIn sayfa linki"
                className={`flex-1 py-2 px-3 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-amber-500 text-gray-700"
                } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-150`}
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 justify-end mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-gray-700"
            } transition-colors duration-150 shadow-sm`}
          >
            İptal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveChangesClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-150 shadow-sm`}
          >
            Değişiklikleri Kaydet
          </motion.button>
        </motion.div>

        {/* Back to Profile Button */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackClick}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
              darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-400 text-amber-900 hover:bg-amber-300"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            Profil Sayfasına Dön
          </motion.button>
        </motion.div>
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-xl p-6 max-w-md w-full mx-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-4">Değişiklikleri Kaydetmek İstiyor musunuz?</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Yaptığınız tüm değişiklikler kaydedilecektir. Bu işlem geri alınamaz.
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelSave}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } transition-colors duration-150`}
                >
                  İptal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmSave}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-150"
                >
                  Onayla
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className={`mt-8 border-t ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-amber-200 bg-[#47300A] from-amber-800 to-amber-600"
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
