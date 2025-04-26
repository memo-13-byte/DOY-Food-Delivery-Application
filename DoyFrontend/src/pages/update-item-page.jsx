"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, ChevronLeft, Save, X, ImageIcon, CheckCircle, Loader2 } from "lucide-react"
import { Toggle } from "../components/ui/toggle"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import axios from "axios"

export default function UpdateItemPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { id: restaurantId, menuItemTypeId, itemId } = params
  const isEditMode = !!itemId

  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=200")

  // Ref for confetti container
  const confettiContainerRef = useRef(null)

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

  // Create confetti effect
  const createConfetti = () => {
    const container = confettiContainerRef.current
    if (!container) return

    const colors = ["#FFD700", "#FFA500", "#FF8C00", "#FF4500", "#FF6347"]

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      const size = Math.random() * 10 + 5

      confetti.style.width = `${size}px`
      confetti.style.height = `${size}px`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.position = "absolute"
      confetti.style.borderRadius = "50%"
      confetti.style.opacity = "0"
      confetti.style.zIndex = "10"

      // Random starting position centered around the button
      const startX = 0
      const startY = 0

      // Random ending position
      const endX = (Math.random() - 0.5) * 200
      const endY = (Math.random() - 0.5) * 200

      confetti.style.transform = `translate(${startX}px, ${startY}px)`

      container.appendChild(confetti)

      // Animate the confetti
      const animation = confetti.animate(
        [
          { transform: `translate(${startX}px, ${startY}px)`, opacity: 1 },
          { transform: `translate(${endX}px, ${endY}px)`, opacity: 0 },
        ],
        {
          duration: 1000 + Math.random() * 1000,
          easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
          fill: "forwards",
        },
      )

      animation.onfinish = () => {
        if (container.contains(confetti)) {
          container.removeChild(confetti)
        }
      }
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
        menuItemType: reversemenuItemTypeMap[formData.menuItemType],
      }
      console.log(formDataToSend)
      /*
            if (formData.image) {
              formDataToSend.append("image", formData.image)
            }*/

      let response
      if (isEditMode) {
        // Update existing item
        response = await axios.put(`http://localhost:8080/api/item/update/${itemId}`, formDataToSend)
      } else {
        // Create new item
        response = await axios.post("http://localhost:8080/api/item/post", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      // Show success animation
      setIsLoading(false)
      setIsSuccess(true)
      createConfetti()

      // Redirect after showing success animation
      setTimeout(() => {
        navigate(`/restaurants/manage/${restaurantId}`)
      }, 1500)
    } catch (error) {
      console.error("Error saving item:", error)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
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
        className={`sticky top-0 z-10 flex items-center justify-between p-4 shadow-md ${darkMode ? "bg-gray-800" : "border-amber-200 bg-[#47300A]"}`}
      >
        <motion.div
          initial={{ rotate: -5 }}
          animate={{
            rotate: 0,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: 0,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 },
          }}
          whileTap={{ scale: 0.95 }}
          className="text-xl font-bold text-white relative"
        >
          <span className="flex items-center gap-2">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0px 0px 0px rgba(255,255,255,0)",
                    "0px 0px 8px rgba(255,255,255,0.5)",
                    "0px 0px 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="rounded-full"
              >
                <img src="/image1.png" alt="Doy Logo" className="h-8 w-8 rounded-full bg-white p-1 relative z-10" />
              </motion.div>
            </motion.div>
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="relative"
            >
              Doy!
              <motion.span
                className="absolute -top-1 -right-2 text-xs text-amber-300"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              >
                ✨
              </motion.span>
            </motion.span>
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
            onClick={() => navigate(`/restaurants/manage/${restaurantId}`)}
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
              <Select
                value={formData.menuItemType}
                onValueChange={handlemenuItemTypeChange}
                disabled={isLoading || isSuccess}
              >
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
                disabled={isLoading || isSuccess}
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
                disabled={isLoading || isSuccess}
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
                disabled={isLoading || isSuccess}
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
                onClick={() => navigate(`/restaurants/manage/${restaurantId}`)}
                disabled={isLoading || isSuccess}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                } ${isLoading || isSuccess ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <X className="h-5 w-5" />
                İptal
              </motion.button>

              <div className="relative flex-1" ref={confettiContainerRef}>
                <motion.button
                  whileHover={!isLoading && !isSuccess ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-all duration-300 ${
                    isSuccess
                      ? darkMode
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white"
                      : darkMode
                        ? "bg-amber-600 text-white hover:bg-amber-500"
                        : "bg-amber-500 text-white hover:bg-amber-400"
                  } ${isSuccess ? "scale-105" : ""}`}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 10,
                        }}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Save className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.span
                        key="loading-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Kaydediliyor...
                      </motion.span>
                    ) : isSuccess ? (
                      <motion.span
                        key="success-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 10,
                          delay: 0.1,
                        }}
                      >
                        Kaydedildi!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Kaydet
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
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
          darkMode ? "border-gray-700 bg-gray-800" : "border-amber-200 bg-[#47300A] from-amber-800 to-amber-600"
        } py-6`}
      >
        <div className="container mx-auto text-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-amber-200"}`}>
            © {new Date().getFullYear()} Doy! Tüm hakları saklıdır.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
