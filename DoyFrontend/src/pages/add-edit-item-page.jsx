"use client"

import { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { motion } from "framer-motion"
import { Sun, Moon, ChevronLeft, Save, X, ImageIcon } from "lucide-react"
import { Toggle } from "../components/ui/toggle"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import AuthorizedRequest from "../services/AuthorizedRequest"

export default function AddEditItemPage() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const { id: restaurantId, menuItemTypeId, itemId } = params
  const isEditMode = !!itemId

  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=200")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    menuItemType: menuItemTypeId ? String(menuItemTypeId) : "1",
    image: null,
  })

  // menuItemType mapping
  const menuItemTypeMap = {
    "1": "Menüler",
    "2": "Yiyecek Seçenekleri",
    "3": "İçecek Seçenekleri",
    "4": "Ek Seçenekleri",
  }

  const reversemenuItemTypeMap = {
    "1": "COMBO",
    "2": "MAIN_DISH",
    "3": "DRINK",
    "4": "EXTRA",
  }

  // Load item data if in edit mode
  useEffect(() => {
    if (isEditMode && itemId) {
      setIsLoading(true)
      // In a real app, fetch the item data from API
      axios
        .get(`http://localhost:8080/api/item/get/${itemId}`)
        .then((response) => {
          const item = response.data
          setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            menuItemType: getmenuItemTypeIdFromType(item.menuItemType),
            image: null,
          })
          // If there's an image URL in the response
          if (item.imageUrl) {
            setImagePreview(item.imageUrl)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching item:", error)
          setIsLoading(false)
        })
    }
  }, [isEditMode, itemId])

  // Get menuItemType ID from menuItemType type
  const getmenuItemTypeIdFromType = (type) => {
    const menuItemTypeIds = {
      COMBO: "1",
      MAIN_DISH: "2",
      DRINK: "3",
      EXTRA: "4",
    }
    return menuItemTypeIds[type] || "1"
  }

  // Handle form input changes
  const handleInputChange = (e) => {

    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle menuItemType selection
  const handlemenuItemTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      menuItemType: value,
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
      const formDataToSend = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        restaurantId: 1,
        menuItemType: reversemenuItemTypeMap[formData.menuItemType]
      }
      console.log(formDataToSend)
/*
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }*/

      let response
      if (isEditMode) {
        // Update existing item
        response = await AuthorizedRequest.putRequest(`http://localhost:8080/api/item/update/${itemId}`, formDataToSend)

      } else {
        // Create new item
        response = await AuthorizedRequest.postRequest("http://localhost:8080/api/item/post", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      // Redirect back to management page on success with restaurant ID
      setLocation(`/restaurants/manage`)
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
            <img src="/image1.png" alt="Doy Logo" className="h-8 w-8 rounded-full bg-white p-1" />
            Doy!
          </span>
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
            onClick={() => setLocation(`/restaurants/manage`)}
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
                  src={imagePreview || "/placeholder.svg"}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload").click()}
                  className={`w-full ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                      : "border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  Görsel Seç
                </Button>
              </div>
            </div>

            {/* menuItemType Selection */}
            <div className="space-y-2">
              <Label htmlFor="menuItemType">Kategori</Label>
              <Select value={formData.menuItemType} onValueChange={handlemenuItemTypeChange} disabled={isLoading}>
                <SelectTrigger
                  id="menuItemType"
                  className={`w-full ${
                    darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                  }`}
                >
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Menüler</SelectItem>
                  <SelectItem value="2">Yiyecek Seçenekleri</SelectItem>
                  <SelectItem value="3">İçecek Seçenekleri</SelectItem>
                  <SelectItem value="4">Ek Seçenekleri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ürün adını girin"
                required
                disabled={isLoading}
                className={`w-full ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                }`}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ürün açıklamasını girin"
                rows={3}
                disabled={isLoading}
                className={`w-full ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-amber-200 bg-white text-gray-800"
                }`}
              />
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat (TL)</Label>
              <Input
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
                className={`w-full ${
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
                onClick={() => setLocation(`/restaurants/manage`)}
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
