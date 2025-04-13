import { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { motion } from "framer-motion"
import { Sun, Moon, ChevronLeft, Save, X, ImageIcon } from "lucide-react"

export default function UpdateItemPage() {
  const [location, setLocation] = useLocation()
  const params = useParams()

  // Extract parameters from URL
  const restaurantId = params.id
  const categoryId = params.categoryId
  const itemId = params.itemId
  const isEditMode = !!itemId

  // Store restaurantId in sessionStorage when component mounts
  useEffect(() => {
    if (restaurantId) {
      // Save restaurantId to sessionStorage to persist across page navigations
      sessionStorage.setItem("currentRestaurantId", restaurantId)
    } else {
      // If restaurantId is undefined, try to get it from sessionStorage
      const storedRestaurantId = sessionStorage.getItem("currentRestaurantId")
      if (storedRestaurantId) {
        // Redirect to the same page but with the stored restaurantId
        setLocation(
          `/restaurants/manage/${storedRestaurantId}/add-item/${categoryId || "1"}${itemId ? `/edit-item/${itemId}` : ""}`,
        )
      }
    }
  }, [restaurantId, categoryId, itemId, setLocation])

  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=200")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categoryId ? String(categoryId) : "1",
    image: null,
  })

  // Category mapping
  const categoryMap = {
    "1": "Menüler",
    "2": "Yiyecek Seçenekleri",
    "3": "İçecek Seçenekleri",
    "4": "Ek Seçenekleri",
  }

  const reverseCategoryMap = {
    "1": "menu",
    "2": "yiyecek",
    "3": "icecek",
    "4": "ekstra",
  }

  // Load item data if in edit mode
  useEffect(() => {
    if (isEditMode && itemId) {
      setIsLoading(true)
      // In a real app, fetch the item data from API
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockItem = {
          name: "Örnek Ürün",
          description: "Bu bir örnek ürün açıklamasıdır",
          price: "150",
          category: "menu",
        }

        setFormData({
          name: mockItem.name,
          description: mockItem.description,
          price: String(mockItem.price),
          category: getCategoryIdFromType(mockItem.category),
          image: null,
        })
        setIsLoading(false)
      }, 500)
    }
  }, [isEditMode, itemId])

  // Get category ID from category type
  const getCategoryIdFromType = (type) => {
    const categoryIds = {
      menu: "1",
      yiyecek: "2",
      icecek: "3",
      ekstra: "4",
    }
    return categoryIds[type] || "1"
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle category selection
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, send data to API
      console.log("Submitting form data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get restaurantId from sessionStorage if it's not in params
      const currentRestaurantId = restaurantId || sessionStorage.getItem("currentRestaurantId")

      // Redirect back to management page on success with restaurant ID
      setLocation(`/restaurants/manage/${currentRestaurantId}`)
    } catch (error) {
      console.error("Error saving item:", error)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  // Get restaurantId from sessionStorage if it's not in params
  const currentRestaurantId = restaurantId || sessionStorage.getItem("currentRestaurantId")

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
          <span className="flex items-center gap-2">
            <img
              src="/image1.png"
              alt="Doy Logo"
              className="h-8 w-8 rounded-full bg-white p-1"
            />
            Doy Food Delivery
          </span>
        </motion.div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex h-8 w-8 items-center justify-center rounded-md border p-1 ${darkMode ? "border-gray-600 bg-gray-700" : "border-amber-400 bg-amber-200"}`}
          >
            {darkMode ? <Moon className="h-4 w-4 text-amber-200" /> : <Sun className="h-4 w-4 text-amber-600" />}
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation(`/restaurants/manage/${currentRestaurantId}`)}
            className={`flex items-center gap-1 rounded-full px-4 py-2 ${
              darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-amber-800 hover:bg-amber-50"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Geri Dön
          </motion.button>
          <h1 className="text-2xl font-bold">{isEditMode ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h1>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-6 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                <img
                  src={imagePreview || "/placeholder.svg?height=160&width=160"}
                  alt="Ürün Görseli"
                  className="h-full w-full object-cover"
                />
                <label
                  htmlFor="image-upload"
                  className={`absolute bottom-2 right-2 cursor-pointer rounded-full p-2 ${
                    darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">Ürün Görseli</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Ürün için bir görsel yükleyin. Önerilen boyut: 500x500 piksel.
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById("image-upload").click()}
                  className={`w-full rounded-lg px-4 py-2 ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                      : "border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  Görsel Seç
                </button>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label htmlFor="category" className="block font-medium">
                Kategori
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isLoading}
                className={`w-full rounded-lg border p-2 ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                }`}
              >
                <option value="1">Menüler</option>
                <option value="2">Yiyecek Seçenekleri</option>
                <option value="3">İçecek Seçenekleri</option>
                <option value="4">Ek Seçenekleri</option>
              </select>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium">
                Ürün Adı
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ürün adını girin"
                required
                disabled={isLoading}
                className={`w-full rounded-lg border p-2 ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                }`}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ürün açıklamasını girin"
                rows={3}
                disabled={isLoading}
                className={`w-full rounded-lg border p-2 ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                }`}
              />
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <label htmlFor="price" className="block font-medium">
                Fiyat (TL)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ürün fiyatını girin"
                required
                min="0"
                step="0.01"
                disabled={isLoading}
                className={`w-full rounded-lg border p-2 ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setLocation(`/restaurants/manage/${currentRestaurantId}`)}
                disabled={isLoading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                <X className="h-5 w-5" />
                İptal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                  darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-500 text-white hover:bg-amber-400"
                }`}
              >
                <Save className="h-5 w-5" />
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-8 border-t ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-amber-200 bg-gradient-to-b from-amber-100 to-amber-200"
        } py-6`}
      >
        <div className="container mx-auto text-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-amber-700"}`}>
            © {new Date().getFullYear()} Doy! Tüm hakları saklıdır.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
