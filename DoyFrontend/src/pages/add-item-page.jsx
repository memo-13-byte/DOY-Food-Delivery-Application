import React, { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { motion } from "framer-motion"
import { ChevronLeft, ImageIcon, Save, X } from "lucide-react"
import axios from "axios"

export default function AddItemPage() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const { id: restaurantId, categoryId } = params
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

      // Create image preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove image preview
  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
    })
    setImagePreview(null)
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      alert("Lütfen gerekli alanları doldurun!")
      return
    }

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
      // Bu bir mock APi çağrısıdır, gerçek dünyada gerçek bir API endpointi kullanılabilir
      console.log("Ürün ekleme verisi:", apiData)
      
      // API isteği simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));

      // İşlem başarılı olduktan sonra restaurant manage sayfasına yönlendir
      // ID parametresini kullanarak ilgili restoran sayfasına dön
      setLocation(`/restaurants/manage/${restaurantId}`)
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    // ID parametreli restaurant manage sayfasına yönlendirme yapıyoruz
    setLocation(`/restaurants/manage/${restaurantId}`)
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
            Doy Food Delivery
          </div>
        </motion.div>
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <button
              className={`rounded-md px-3 py-1 font-medium ${
                darkMode ? "text-white hover:bg-gray-700" : "text-white hover:bg-amber-600"
              }`}
              onClick={handleCancel}
            >
              İptal
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white"
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
                    className={`inline-flex cursor-pointer items-center rounded-md px-4 py-2 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    <span>Görsel Yükle</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    JPG, PNG veya GIF formatında, max. 2MB boyutunda.
                  </p>
                </div>
              </div>
            </div>

            {/* Item Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ürün Adı*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Örn: Karışık Pizza"
                className={`rounded-md py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:border-amber-500"
                    : "bg-amber-50 text-gray-800 border-amber-200 focus:border-amber-500"
                } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-200`}
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ürün içeriği ve detayları..."
                rows={3}
                className={`rounded-md py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:border-amber-500"
                    : "bg-amber-50 text-gray-800 border-amber-200 focus:border-amber-500"
                } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-200`}
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Fiyat*
              </label>
              <div className="relative">
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`rounded-md py-2 pl-8 pr-3 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:border-amber-500"
                      : "bg-amber-50 text-gray-800 border-amber-200 focus:border-amber-500"
                  } border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors duration-200`}
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className={`rounded-md px-4 py-2 ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-md px-6 py-2 ${
                  darkMode ? "bg-amber-500 text-gray-900" : "bg-amber-500 text-white"
                } hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span> Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}