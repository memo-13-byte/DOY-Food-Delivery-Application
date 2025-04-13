import React, { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { motion } from "framer-motion"
import { ChevronLeft, ImageIcon, Save, X } from "lucide-react"
import axios from "axios"

export default function AddItemPage() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const { restaurantId, categoryId } = params
  const [darkMode, setDarkMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
const [imagePreview, setImagePreview] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  })

  // Category names mapping
  const categoryNames = {
    "1": "Menüler",
    "2": "Yiyecek Seçenekleri",
    "3": "İçecek Seçenekleri",
    "4": "Ek Seçenekleri",
  }

  // Category to API category mapping
  const categoryToApiCategory = {
    "1": "menu",
    "2": "yiyecek",
    "3": "icecek",
    "4": "ekstra",
  }

  // Check dark mode from body class
  useEffect(() => {
    const isDarkMode = document.body.classList.contains("dark-mode")
    setDarkMode(isDarkMode)
  }, [])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        image: file,
      })

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
    setIsSubmitting(true)

    try {
      // Create form data for API
      const apiData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: categoryId && categoryToApiCategory[categoryId] ? categoryToApiCategory[categoryId] : "menu",
        restaurantId: Number.parseInt(restaurantId || "1"),
      }

      // Send data to API
      await axios.post("http://localhost:8080/api/item/add-item", apiData)

      // Redirect back to restaurant management page
      setLocation(`/restaurants/${restaurantId}`)
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setLocation(`/restaurants/${restaurantId}`)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100"
      }`}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-10 flex items-center justify-between p-4 shadow-md ${
          darkMode ? "bg-gray-800" : "bg-gradient-to-r from-amber-600 to-amber-500"
        }`}
      >
        <motion.div whileHover={{ scale: 1.05 }} className="text-xl font-bold text-white">
          <div className="flex items-center gap-2">
            <img src="/image1.png" alt="Doy Logo" className="h-8 w-8 rounded-full bg-white p-1" />
            Doy!
          </div>
        </motion.div>
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <button
              className={`rounded-md px-3 py-1 font-medium ${
                darkMode ? "text-white hover:bg-gray-700" : "text-white hover:bg-amber-600"
              }`}
            >
              Yeni Ürün Ekle
            </button>
          </motion.div>
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
            onClick={handleCancel}
            className={`flex items-center gap-1 rounded-full p-2 ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-amber-200 hover:bg-amber-300"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-2xl font-bold">
            {categoryId && categoryNames[categoryId] ? categoryNames[categoryId] : "Kategori"} - Yeni Ürün Ekle
          </h1>
        </motion.div>

        {/* Add Item Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-6 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Ürün Görseli</label>
              <div className="flex items-start gap-4">
                <div
                  className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 ${
                    darkMode ? "border-gray-700 bg-gray-700" : "border-amber-200 bg-amber-100"
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null)
                          setFormData({ ...formData, image: null })
                        }}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <ImageIcon className={`h-8 w-8 ${darkMode ? "text-gray-500" : "text-amber-400"}`} />
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="image-upload"
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Görsel Seç
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Önerilen: 500x500 piksel, maksimum 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ürün Adı*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`rounded-lg border p-3 ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-900"
                }`}
                placeholder="Ürün adını girin"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Açıklama*
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`rounded-lg border p-3 ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-900"
                }`}
                placeholder="Ürün açıklamasını girin"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Fiyat (TL)*
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={`rounded-lg border p-3 ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-900"
                }`}
                placeholder="0.00"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                  darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-500 text-white hover:bg-amber-400"
                } ${isSubmitting ? "opacity-70" : ""}`}
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium shadow-md transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                }`}
              >
                <X className="h-5 w-5" />
                İptal
              </motion.button>
            </div>
          </form>
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
          <p className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-amber-700"}`}>
            © {new Date().getFullYear()} Doy! Tüm hakları saklıdır.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}