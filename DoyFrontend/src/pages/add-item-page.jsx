"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
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
  AlertCircle,
  CheckIcon,
  AlertTriangle,
  Upload,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import axios from "axios"
import { getResponseErrors } from "../services/exceptionUtils"

export default function AddItemPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { id: restaurantId, menuItemTypeId, itemId } = params
  const isEditMode = !!itemId

  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=200")
  const [showSuccess, setShowSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const formRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Form validation states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formShake, setFormShake] = useState(false)
  const [validationAttempted, setValidationAttempted] = useState(false)

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

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Ürün adı gereklidir"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Ürün adı en az 3 karakter olmalıdır"
    }

    // Validate price
    if (formData.price <= 0) {
      newErrors.price = "Fiyat sıfırdan büyük olmalıdır"
    }

    // Validate description (optional but if provided, should be at least 10 chars)
    if (formData.description && formData.description.trim().length < 10) {
      newErrors.description = "Açıklama en az 10 karakter olmalıdır"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate on change if validation was already attempted
    if (validationAttempted) {
      validateForm()
    }
  }

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target
    setFocusedField(null)

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate on blur
    validateForm()
  }

  // Handle menuItemType selection
  const handlemenuItemTypeChange = (value) => {
    console.log("Selected value:", value, typeof value)
    setFormData((prev) => ({
      ...prev,
      menuItemType: value,
    }))
  }

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      if (!validExtensions.includes(fileExtension)) {
        alert("Lütfen sadece JPG, JPEG veya PNG formatında bir görsel yükleyin.");
        setFormData((prev) => ({
          ...prev,
          image: null,
        }));
        setImagePreview(null);
              return;
      }
  
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  

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

  // Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  setValidationAttempted(true);
  const allTouched = Object.keys(formData).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
  setTouched(allTouched);

  const isValid = validateForm();
  if (!isValid) {
    setFormShake(true);
    setTimeout(() => setFormShake(false), 500);
    return;
  }

  setIsLoading(true);

  // Prepare item data (excluding the image file itself)
  const itemDataToSend = {
    name: formData.name,
    description: formData.description,
    price: Number.parseFloat(formData.price),
    restaurantId: restaurantId,
    menuItemType: reversemenuItemTypeMap[Number.parseInt(formData.menuItemType)],
  };
  console.log("Sending item data:", itemDataToSend);

  try {
    let newItemId = itemId; // Use existing itemId if in edit mode

    // --- Step 1: Create or Update Item ---
    if (isEditMode) {
      // Update existing item (logic remains similar, maybe update image separately too)
      console.log(`Updating item ${itemId}`);
      await axios.put(`http://localhost:8080/api/item/update/${itemId}`, itemDataToSend);
      console.log(`Item ${itemId} updated successfully.`);
      // Decide if image needs re-uploading on edit
      // For now, let's assume image upload only happens on create or if a *new* image is selected in edit mode
    } else {
      // Create new item
      console.log("Creating new item...");
      const response = await axios.post("http://localhost:8080/api/item/post", itemDataToSend);
      console.log("Item creation response:", response.data);
      // --- Step 2: Get the new Item ID ---
      if (response.data && response.data.id) {
        newItemId = response.data.id; // Get the ID from the response
        console.log(`New item created with ID: ${newItemId}`);
      } else {
        throw new Error("Failed to get new item ID from response.");
      }
    }

    // --- Step 3: Upload Image if available and we have an ID ---
    if (formData.image && newItemId) {
       console.log(`Uploading image for item ID: ${newItemId}`);
       const imageFormData = new FormData();
       imageFormData.append("file", formData.image); // 'file' should match backend @RequestParam("file")

       try {
         // Use the newItemId in the URL
         const imageResponse = await axios.post(
           `http://localhost:8080/api/upload/image/${newItemId}`, // <--- MODIFIED URL
           imageFormData,
           {
             headers: {
               "Content-Type": "multipart/form-data",
             },
           }
         );
         console.log("Image upload success:", imageResponse.data);
         // Optionally update item with image URL returned from image upload endpoint
         // Example: await axios.patch(`/api/item/update-image-url/${newItemId}`, { imageUrl: imageResponse.data.imageUrl });

       } catch (imageError) {
         console.error("Image upload error:", imageError);
         // Decide how to handle image upload failure. Maybe show a specific error.
         // You might want to alert the user that the item was created but the image failed to upload.
         setErrors(prev => ({ ...prev, image: "Görsel yüklenemedi: " + (getResponseErrors(imageError)?.message || "Sunucu hatası") }));
         setIsLoading(false);
         return; // Stop further execution if image upload fails
       }
    } else if (formData.image && !newItemId) {
        console.warn("Image selected but no Item ID available for upload.");
        // This case shouldn't happen with the logic above unless item creation failed unexpectedly without throwing an error.
    }

    // Show success animation and redirect
    setShowSuccess(true);
    setTimeout(() => {
      navigate(`/restaurants/manage/${restaurantId}`);
    }, 1500);

  } catch (error) {
    console.error("Error during form submission:", error);
    // Extract and set errors from the item creation/update phase
    const extractedErrors = getResponseErrors(error);
    setErrors(prev => ({ ...prev, ...extractedErrors })); // Merge errors
    setIsLoading(false);
  }
};

  // Update the back button click handler
  const handleBackClick = () => {
    navigate(`/restaurants/manage/${restaurantId}`)
  }

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Form field animation variants
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  // Success animation variants
  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like effect
      },
    },
  }

  // Pulse animation for submit button
  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
  }

  // Shake animation for form validation errors
  const shakeVariants = {
    initial: { x: 0 },
    shake: {
      x: [-10, 10, -8, 8, -5, 5, -2, 2, 0],
      transition: { duration: 0.5 },
    },
  }

  // Error message animation variants
  const errorMessageVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Field validation state animation variants
  const validationIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Helper function to determine field validation state
  const getFieldValidationState = (fieldName) => {
    if (!touched[fieldName]) return null
    return errors[fieldName] ? "error" : "success"
  }

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
              onClick={toggleDarkMode}
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
            onClick={handleBackClick}
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

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: darkMode ? "0 8px 30px rgba(0, 0, 0, 0.3)" : "0 8px 30px rgba(108, 76, 156, 0.15)" }}
          className={`rounded-2xl p-6 shadow-md ${darkMode ? "bg-[#2c2c2c]" : "bg-white"}`}
        >
          <AnimatePresence>
            {showSuccess ? (
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="flex h-full w-full flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`mb-4 rounded-full p-3 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}
                >
                  <CheckCircle className={`h-12 w-12 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-2 text-xl font-bold"
                >
                  {isEditMode ? "Ürün Güncellendi!" : "Ürün Eklendi!"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Yönlendiriliyorsunuz...
                </motion.p>
              </motion.div>
            ) : (
              <motion.form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={shakeVariants}
                initial="initial"
                animate={formShake ? "shake" : "initial"}
              >
                {/* Validation Summary - shows when form is submitted with errors */}
                <AnimatePresence>
                  {validationAttempted && Object.keys(errors).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-md p-3 mb-4 ${
                        darkMode ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-500"
                      }`}
                    >
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium">Lütfen aşağıdaki hataları düzeltin:</h3>
                          <ul className="mt-1 text-xs list-disc list-inside">
                            {Object.entries(errors).map(([field, error]) => (
                              <li key={field}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image Upload */}
                <motion.div
                  custom={0}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
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
                  custom={1}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <Label htmlFor="menuItemType">Kategori</Label>
                  <div>
                    <Select value={formData.menuItemType} onValueChange={handlemenuItemTypeChange} disabled={isLoading}>
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
                  custom={2}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="flex items-center">
                      Ürün Adı
                      <span className="text-red-500 ml-1">*</span>
                    </Label>

                    {/* Validation state indicator */}
                    <AnimatePresence mode="wait">
                      {getFieldValidationState("name") === "error" && (
                        <motion.div
                          key="name-error"
                          variants={validationIconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`rounded-full p-1 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}
                        >
                          <AlertCircle className={`h-3 w-3 ${darkMode ? "text-red-400" : "text-red-500"}`} />
                        </motion.div>
                      )}
                      {getFieldValidationState("name") === "success" && (
                        <motion.div
                          key="name-success"
                          variants={validationIconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`rounded-full p-1 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}
                        >
                          <CheckIcon className={`h-3 w-3 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    animate={
                      focusedField === "name"
                        ? { boxShadow: `0 0 0 2px ${darkMode ? "#6c4c9c" : "#6c4c9c"}` }
                        : getFieldValidationState("name") === "error"
                          ? { boxShadow: `0 0 0 2px ${darkMode ? "#ef4444" : "#f87171"}` }
                          : getFieldValidationState("name") === "success"
                            ? { boxShadow: `0 0 0 2px ${darkMode ? "#10b981" : "#34d399"}` }
                            : {}
                    }
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative"
                  >
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={handleBlur}
                      placeholder="Ürün adını girin"
                      required
                      disabled={isLoading}
                      className={`w-full rounded-xl ${
                        darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"
                      } ${
                        getFieldValidationState("name") === "error"
                          ? darkMode
                            ? "border-red-700"
                            : "border-red-300"
                          : getFieldValidationState("name") === "success"
                            ? darkMode
                              ? "border-green-700"
                              : "border-green-300"
                            : ""
                      }`}
                    />
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence>
                    {touched.name && errors.name && (
                      <motion.div
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}
                      >
                        {errors.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Description Input */}
                <motion.div
                  custom={3}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Açıklama</Label>

                    {/* Validation state indicator */}
                    <AnimatePresence mode="wait">
                      {getFieldValidationState("description") === "error" && (
                        <motion.div
                          key="description-error"
                          variants={validationIconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`rounded-full p-1 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}
                        >
                          <AlertCircle className={`h-3 w-3 ${darkMode ? "text-red-400" : "text-red-500"}`} />
                        </motion.div>
                      )}
                      {getFieldValidationState("description") === "success" && (
                        <motion.div
                          key="description-success"
                          variants={validationIconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`rounded-full p-1 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}
                        >
                          <CheckIcon className={`h-3 w-3 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    animate={
                      focusedField === "description"
                        ? { boxShadow: `0 0 0 2px ${darkMode ? "#6c4c9c" : "#6c4c9c"}` }
                        : getFieldValidationState("description") === "error"
                          ? { boxShadow: `0 0 0 2px ${darkMode ? "#ef4444" : "#f87171"}` }
                          : getFieldValidationState("description") === "success"
                            ? { boxShadow: `0 0 0 2px ${darkMode ? "#10b981" : "#34d399"}` }
                            : {}
                    }
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("description")}
                      onBlur={handleBlur}
                      placeholder="Ürün açıklamasını girin"
                      rows={3}
                      disabled={isLoading}
                      className={`w-full rounded-xl ${
                        darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"
                      } ${
                        getFieldValidationState("description") === "error"
                          ? darkMode
                            ? "border-red-700"
                            : "border-red-300"
                          : getFieldValidationState("description") === "success"
                            ? darkMode
                              ? "border-green-700"
                              : "border-green-300"
                            : ""
                      }`}
                    />
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence>
                    {touched.description && errors.description && (
                      <motion.div
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}
                      >
                        {errors.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Price Input */}
                <motion.div
                  custom={4}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <Label htmlFor="price" className="flex items-center">
                      Fiyat (TL)
                      <span className="text-red-500 ml-1">*</span>
                    </Label>

                    {/* Validation state indicator */}
                    <AnimatePresence mode="wait">
                      {getFieldValidationState("price") === "error" && (
                        <motion.div
                          key="price-error"
                          variants={validationIconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`rounded-full p-1 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}
                        >
                          <AlertCircle className={`h-3 w-3 ${darkMode ? "text-red-400" : "text-red-500"}`} />
                        </motion.div>
                      )}
                      {getFieldValidationState("price") === "success" && (
                        <motion.div
                          key="price-success"
                          variants={validationIconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`rounded-full p-1 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}
                        >
                          <CheckIcon className={`h-3 w-3 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    animate={
                      focusedField === "price"
                        ? { boxShadow: `0 0 0 2px ${darkMode ? "#6c4c9c" : "#6c4c9c"}` }
                        : getFieldValidationState("price") === "error"
                          ? { boxShadow: `0 0 0 2px ${darkMode ? "#ef4444" : "#f87171"}` }
                          : getFieldValidationState("price") === "success"
                            ? { boxShadow: `0 0 0 2px ${darkMode ? "#10b981" : "#34d399"}` }
                            : {}
                    }
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("price")}
                      onBlur={handleBlur}
                      placeholder="Ürün fiyatını girin"
                      required
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                      className={`w-full rounded-xl ${
                        darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"
                      } ${
                        getFieldValidationState("price") === "error"
                          ? darkMode
                            ? "border-red-700"
                            : "border-red-300"
                          : getFieldValidationState("price") === "success"
                            ? darkMode
                              ? "border-green-700"
                              : "border-green-300"
                            : ""
                      }`}
                    />
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence>
                    {touched.price && errors.price && (
                      <motion.div
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}
                      >
                        {errors.price}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  custom={5}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    type="button"
                    onClick={handleBackClick}
                    disabled={isLoading}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-[#7A0000] text-white hover:bg-[#6A0000]"
                    }`}
                  >
                    <X className="h-5 w-5" />
                    İptal
                  </motion.button>
                  <motion.button
                    variants={pulseVariants}
                    initial="initial"
                    animate={isLoading ? "initial" : "pulse"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    type="submit"
                    disabled={isLoading}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${
                      darkMode
                        ? "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                        : "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Loader2 className="h-5 w-5" />
                        </motion.div>
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Kaydet
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer - Updated to match restaurant-manage-page.tsx */}
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
