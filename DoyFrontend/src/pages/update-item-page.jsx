"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sun,
  Moon,
  ChevronLeft,
  Save,
  X,
  ImageIcon,
  CheckCircle,
  Loader2,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Upload,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import axios from "axios"
import { getResponseErrors } from "../services/exceptionUtils"

export default function UpdateItemPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { id: restaurantId, menuItemTypeId, itemId } = params
  const isEditMode = !!itemId

  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=200")
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

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

  // Handle drag over for image upload
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  // Handle drag leave for image upload
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  // Handle drop for image upload
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      // Sadece resim dosyalarını kabul et
      if (file.type.startsWith("image/")) {
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
      } else {
        // Resim olmayan dosyalar için uyarı
        alert("Lütfen sadece resim dosyaları yükleyin (JPG, PNG, GIF, vb.)")
      }
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
        restaurantId: restaurantId,
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
        console.log(itemId);
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
      setErrorMessages(getResponseErrors(error))
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
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#1c1c1c] text-white" : "bg-[#F2E8D6]"}`}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 shadow-lg ${darkMode ? "bg-[#333]" : "bg-[#47300A]"}`}
      >
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white">
          <span className="flex items-center gap-2">
            <img src="/image1.png" alt="Doy Logo" className="h-10 w-10 rounded-full bg-white p-1" />
            Doy!
          </span>
        </motion.div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? "#6c4c9c" : "#e2e8f0",
                transition: "background-color 0.3s",
              }}
            >
              <span className="sr-only">Toggle dark mode</span>
              <motion.span
                className="inline-block h-5 w-5 rounded-full bg-white shadow-lg"
                animate={{
                  x: darkMode ? 24 : 3,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />
            </motion.button>
            {darkMode ? <Moon className="h-4 w-4 text-amber-200" /> : <Sun className="h-4 w-4 text-amber-600" />}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto max-w-3xl px-6 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/restaurants/manage/${restaurantId}`)}
            className={`flex items-center gap-1 rounded-full px-4 py-2 ${
              darkMode ? "bg-[#2c2c2c] text-white hover:bg-[#333]" : "bg-white text-[#47300A] hover:bg-amber-50"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Geri Dön
          </motion.button>
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isEditMode ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
          </motion.h1>
        </motion.div>

        {errorMessages.map((message, i) => (
                        
                        <motion.div key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm dark:bg-red-900/30 dark:text-red-400"
                        >
                          <div className="flex">
                            <div className="py-1">
                              <svg 
                                className="h-6 w-6 text-red-500 dark:text-red-400 mr-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">{message}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: darkMode ? "0 8px 30px rgba(0, 0, 0, 0.3)" : "0 8px 30px rgba(108, 76, 156, 0.15)" }}
          className={`rounded-2xl p-6 shadow-md ${darkMode ? "bg-[#2c2c2c]" : "bg-white"}`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4 sm:flex-row"
            >
              <motion.div
                className={`relative h-40 w-40 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  isDragging
                    ? darkMode
                      ? "border-[#6c4c9c] bg-[#6c4c9c]/20"
                      : "border-[#6c4c9c] bg-[#6c4c9c]/10"
                    : "border-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-white text-center p-2`}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-sm font-medium">Bırak</span>
                    </motion.div>
                  </div>
                )}
                <motion.img
                  key={imagePreview}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={imagePreview || "/placeholder.svg"}
                  alt="Ürün Görseli"
                  className="h-full w-full object-cover"
                />
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  htmlFor="image-upload"
                  className={`absolute bottom-2 right-2 cursor-pointer rounded-full p-2 ${
                    darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"
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
                </motion.label>
                <div className="absolute -bottom-2 left-0 right-0 text-center">
                  <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Resmi Sürükle veya Tıkla
                  </span>
                </div>
              </motion.div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">Ürün Görseli</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Ürün için bir görsel yükleyin. Önerilen boyut: 500x500 piksel.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload").click()}
                    className={`w-full ${
                      darkMode
                        ? "border-gray-600 bg-[#333] text-white hover:bg-[#444]"
                        : "border-[#6c4c9c]/20 bg-[#6c4c9c]/10 text-[#6c4c9c] hover:bg-[#6c4c9c]/20"
                    }`}
                  >
                    Görsel Seç
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* menuItemType Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="menuItemType">Kategori</Label>
              <div>
                <Select
                  value={formData.menuItemType}
                  onValueChange={handlemenuItemTypeChange}
                  disabled={isLoading || isSuccess}
                >
                  <SelectTrigger
                    id="menuItemType"
                    className={`w-full ${darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"}`}
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
            </motion.div>

            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="flex items-center">
                Ürün Adı
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ürün adını girin"
                required
                disabled={isLoading || isSuccess}
                className={`w-full rounded-xl ${
                  darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"
                }`}
              />
            </motion.div>

            {/* Description Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ürün açıklamasını girin"
                rows={3}
                disabled={isLoading || isSuccess}
                className={`w-full rounded-xl ${
                  darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"
                }`}
              />
            </motion.div>

            {/* Price Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <Label htmlFor="price" className="flex items-center">
                Fiyat (TL)
                <span className="text-red-500 ml-1">*</span>
              </Label>
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
                className={`w-full rounded-xl ${
                  darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"
                }`}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-3 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                type="button"
                onClick={() => navigate(`/restaurants/manage/${restaurantId}`)}
                disabled={isLoading || isSuccess}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                  darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-[#7A0000] text-white hover:bg-[#6A0000]"
                } ${isLoading || isSuccess ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <X className="h-5 w-5" />
                İptal
              </motion.button>

              <div className="relative flex-1" ref={confettiContainerRef}>
                <motion.button
                  whileHover={!isLoading && !isSuccess ? { scale: 1.05 } : {}}
                  whileTap={!isLoading && !isSuccess ? { scale: 0.95 } : {}}
                  transition={{ type: "spring", stiffness: 400 }}
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-all duration-300 ${
                    isSuccess
                      ? darkMode
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white"
                      : darkMode
                        ? "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                        : "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
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
            </motion.div>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "2rem",
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <img
          src="/image1.png"
          alt="Logo alt"
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}
