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
import AuthorizedRequest from "../services/AuthorizedRequest"
import { getResponseErrors } from "../services/exceptionUtils"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"

// Switch Component (Copied from Header to be self-contained in this file)
const Switch = ({ checked, onCheckedChange, className }) => {
    return (
        <button
            type= "button"
            role="switch"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            onClick={() => onCheckedChange(!checked)}
            className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                checked ? "bg-primary" : "bg-input"
            } ${className}`}
        >
      <span
          data-state={checked ? "checked" : "unchecked"}
          className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
        </button>
    )
}

export default function AddItemPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const restaurantEmail = localStorage.getItem("email");
    const [restaurantId, setRestaurantId] = useState(0);

    const { /*id: restaurantId,*/ menuItemTypeId, itemId } = params
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
        image: null, // This will store the File object if a new image is selected
        allergens: [],
        availability: true, // Initialized to true
        imageId: null, // This will store the ID of an existing image
    })
    const [availableAllergens, setAvailableAllergens] = useState([])

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
        // Fetch restaurant ID for both edit and add modes
        AuthorizedRequest.getRequest(`http://localhost:8080/api/users/restaurant-owners/get-by-email/${restaurantEmail}`)
            .then((response) => {
                if (response.data && response.data.id) {
                    setRestaurantId(response.data.id);
                } else {
                    console.error("Could not fetch restaurant ID for email:", restaurantEmail);
                    setErrors(prev => ({ ...prev, restaurant: "Restoran bilgileri alınamadı."}));
                }
            })
            .catch((error) => {
                console.error("Error fetching restaurant ID:", error);
                setErrors(prev => ({ ...prev, restaurant: "Restoran bilgileri alınamadı."}));
            });

        if (isEditMode && itemId) {
            setIsLoading(true);
            AuthorizedRequest
                .getRequest(`http://localhost:8080/api/item/get/${itemId}`)
                .then((response) => {
                    const item = response.data;
                    console.log("Fetched item:", item);
                    setFormData({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        availability: item.availability, // Set availability from fetched item data
                        menuItemType: getmenuItemTypeIdFromType(item.menuItemType),
                        imageId: item.imageId,
                        allergens: Array.isArray(item.allergens) ? item.allergens : [],
                        image: null,
                    });
                    if(item.imageId != null) {
                        setImagePreview(`http://localhost:8080/api/upload/image/${item.imageId}`);
                    } else {
                        setImagePreview("/placeholder.svg?height=200&width=200");
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching item:", error);
                    setErrors(getResponseErrors(error));
                    setIsLoading(false);
                });
        }
    }, [isEditMode, itemId, restaurantEmail]);

    useEffect(() => {
        AuthorizedRequest.getRequest(`http://localhost:8080/api/item/get-types`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setAvailableAllergens(response.data);
                } else {
                    console.warn("Fetched allergen types are not in the expected array format:", response.data);
                    setAvailableAllergens([]);
                }
            })
            .catch(error => {
                console.error("Error fetching allergen types:", error);
                setErrors(prev => ({ ...prev, allergensLoad: "Alerjen tipleri yüklenemedi." }));
            });
    }, []);

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
        if (!formData.name.trim()) {
            newErrors.name = "Ürün adı gereklidir"
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Ürün adı en az 3 karakter olmalıdır"
        }
        if (formData.price <= 0) {
            newErrors.price = "Fiyat sıfırdan büyük olmalıdır"
        }
        if (formData.description && formData.description.trim().length < 10) {
            newErrors.description = "Açıklama en az 10 karakter olmalıdır"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAllergenChange = (allergenValue, checked) => {
        setFormData((prev) => {
            const currentAllergens = prev.allergens || [];
            if (checked) {
                return { ...prev, allergens: [...currentAllergens, allergenValue] };
            } else {
                return { ...prev, allergens: currentAllergens.filter(a => a !== allergenValue) };
            }
        });
        setTouched((prev) => ({ ...prev, allergens: true }));
        if (validationAttempted) validateForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? (value === "" ? "" : Number(value)) : value, // Handle number input better
        }))
        setTouched((prev) => ({ ...prev, [name]: true, }))
        if (validationAttempted) {
            validateForm()
        }
    }

    // Handler for availability switch
    const handleAvailabilityChange = (newAvailability) => {
        setFormData((prev) => ({
            ...prev,
            availability: newAvailability,
        }));
        setTouched((prev) => ({ ...prev, availability: true }));
        // No validation needed for availability directly, but can re-validate if desired
        if (validationAttempted) validateForm();
    };

    const handleBlur = (e) => {
        const { name } = e.target
        setFocusedField(null)
        setTouched((prev) => ({ ...prev, [name]: true, }))
        validateForm()
    }

    const handlemenuItemTypeChange = (value) => {
        setFormData((prev) => ({ ...prev, menuItemType: value, }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({ ...prev, image: file, imageId: null })) // Clear previous imageId if new file is selected
            const reader = new FileReader()
            reader.onloadend = () => { setImagePreview(reader.result) }
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    }

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            const file = files[0]
            if (file.type.startsWith("image/")) {
                setFormData((prev) => ({ ...prev, image: file, imageId: null })) // Clear previous imageId
                const reader = new FileReader()
                reader.onloadend = () => { setImagePreview(reader.result) }
                reader.readAsDataURL(file)
            } else {
                alert("Lütfen sadece resim dosyaları yükleyin (JPG, PNG, GIF, vb.)")
            }
        }
    }

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

        if (restaurantId === 0) {
            setErrors(prev => ({ ...prev, form: "Restoran ID bulunamadı. Lütfen tekrar giriş yapmayı deneyin."}));
            console.error("Restaurant ID is not set. Cannot submit form.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const itemDataToSend = {
            name: formData.name,
            description: formData.description,
            price: Number.parseFloat(String(formData.price)), // Ensure price is float
            restaurantId: restaurantId,
            menuItemType: reversemenuItemTypeMap[formData.menuItemType],
            availability: formData.availability, // Send availability status
            allergens: formData.allergens || [],
            imageId: formData.imageId, // Send existing imageId if no new image is uploaded
        };

        let submissionItemId = isEditMode ? itemId : null;

        try {
            if (isEditMode) {
                await AuthorizedRequest.putRequest(`http://localhost:8080/api/item/update/${itemId}`, itemDataToSend);
                console.log("Item updated with data:", itemDataToSend);
            } else {
                // For new items, don't send imageId initially as it's for existing images
                const { imageId, ...newItemData } = itemDataToSend;
                const response = await AuthorizedRequest.postRequest("http://localhost:8080/api/item/post", newItemData);
                if (response.data && response.data.id) {
                    submissionItemId = response.data.id;
                    console.log("Item created with ID:", submissionItemId, "Data:", newItemData);
                } else {
                    console.error("Failed to get new item ID from response:", response);
                    throw new Error("Yeni ürün ID'si yanıttan alınamadı.");
                }
            }

            // Image upload logic if a new image file is selected (formData.image is a File object)
            if (formData.image && submissionItemId) {
                const imageFormData = new FormData();
                imageFormData.append("file", formData.image);

                try {
                    const imageResponse = await AuthorizedRequest.postRequest(
                        `http://localhost:8080/api/upload/image/item/${submissionItemId}`,
                        imageFormData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                    console.log("Image upload success:", imageResponse.data);
                    // If backend updates item with new imageId, no need to do it here
                    // Otherwise, might need to update item with imageResponse.data.id (if it's imageId)
                } catch (imageError) {
                    console.error("Image upload error:", imageError);
                    setErrors(prev => ({ ...prev, imageUpload: "Görsel yüklenemedi: " + (getResponseErrors(imageError)?.message || "Sunucu hatası") }));
                    // Decide if this is a fatal error for the success message. For now, we'll allow item success.
                }
            } else if (formData.image && !submissionItemId) {
                console.warn("Image selected but no Item ID available for upload.");
                setErrors(prev => ({...prev, imageUpload: "Görsel seçildi ancak ürün ID'si olmadığı için yüklenemedi."}));
            }

            setShowSuccess(true);
            setTimeout(() => {
                navigate(`/restaurants/manage`); // Consistent navigation
            }, 1500);

        } catch (error) {
            console.error("Error during form submission:", error);
            const extractedErrors = getResponseErrors(error);
            setErrors(prev => ({ ...prev, ...extractedErrors, form: "Form gönderilirken bir hata oluştu: " + (extractedErrors.message || error.message) }));
        } finally {
            // Only set isLoading to false if not showing success (success has its own flow)
            // or if an error occurred that didn't lead to success.
            if (!showSuccess || Object.keys(errors).length > 0 ) { // Updated condition
                setIsLoading(false);
            }
        }
    };

    const handleBackClick = () => {
        navigate(`/restaurants/manage`);
    }

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

    const formFieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1, y: 0,
            transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut", },
        }),
    }

    const successVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1, opacity: 1,
            transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], },
        },
    }

    const pulseVariants = {
        initial: { scale: 1 },
        pulse: {
            scale: [1, 1.03, 1],
            transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", },
        },
    }

    const shakeVariants = {
        initial: { x: 0 },
        shake: {
            x: [-10, 10, -8, 8, -5, 5, -2, 2, 0],
            transition: { duration: 0.5 },
        },
    }

    const errorMessageVariants = {
        hidden: { opacity: 0, y: -10, height: 0 },
        visible: {
            opacity: 1, y: 0, height: "auto",
            transition: { duration: 0.3, ease: "easeOut", },
        },
        exit: {
            opacity: 0, y: -10, height: 0,
            transition: { duration: 0.2, },
        },
    }

    const validationIconVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1, opacity: 1,
            transition: { type: "spring", stiffness: 500, damping: 15, },
        },
        exit: {
            scale: 0, opacity: 0,
            transition: { duration: 0.2, },
        },
    }

    const getFieldValidationState = (fieldName) => {
        if (!touched[fieldName]) return null
        return errors[fieldName] ? "error" : "success"
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#1c1c1c] text-white" : "bg-[#F2E8D6]"}`}
        >
            <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

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
                        className={`flex items-center gap-1 rounded-full px-4 py-2 ${darkMode ? "bg-[#2c2c2c] text-white hover:bg-[#333]" : "bg-white text-[#47300A] hover:bg-amber-50"
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
                                {/* Validation Summary */}
                                <AnimatePresence>
                                    {validationAttempted && Object.keys(errors).length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`rounded-md p-3 mb-4 ${darkMode ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-500"
                                            }`}
                                        >
                                            <div className="flex items-start">
                                                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h3 className="text-sm font-medium">Lütfen aşağıdaki hataları düzeltin:</h3>
                                                    <ul className="mt-1 text-xs list-disc list-inside">
                                                        {Object.entries(errors).map(([field, errorMsg]) => ( // Renamed to errorMsg
                                                            <li key={field}>{String(errorMsg)}</li> // Ensure errorMsg is a string
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Image Upload */}
                                <motion.div
                                    custom={0} variants={formFieldVariants} initial="hidden" animate="visible"
                                    className="flex flex-col items-center gap-4 sm:flex-row"
                                >
                                    <motion.div
                                        className={`relative h-40 w-40 overflow-hidden rounded-xl border-2 transition-all duration-300 ${isDragging
                                            ? darkMode ? "border-[#6c4c9c] bg-[#6c4c9c]/20" : "border-[#6c4c9c] bg-[#6c4c9c]/10"
                                            : "border-transparent"
                                        }`}
                                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                        whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {isDragging && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-white text-center p-2`}>
                                                    <Upload className="h-8 w-8 mx-auto mb-1" />
                                                    <span className="text-sm font-medium">Bırak</span>
                                                </motion.div>
                                            </div>
                                        )}
                                        <motion.img
                                            key={imagePreview} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                                            src={imagePreview || "/placeholder.svg"} alt="Ürün Görseli" className="h-full w-full object-cover"
                                        />
                                        <motion.label
                                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} htmlFor="image-upload"
                                            className={`absolute bottom-2 right-2 cursor-pointer rounded-full p-2 ${darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"
                                            }`}
                                        >
                                            <ImageIcon className="h-5 w-5" />
                                            <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                                                type="button" variant="outline" onClick={() => document.getElementById("image-upload").click()}
                                                className={`w-full ${darkMode
                                                    ? "border-gray-600 bg-[#333] text-white hover:bg-[#444]"
                                                    : "border-[#6c4c9c]/20 bg-[#6c4c9c]/10 text-[#6c4c9c] hover:bg-[#6c4c9c]/20"
                                                }`}
                                            >
                                                Görsel Seç
                                            </Button>
                                        </motion.div>
                                        <AnimatePresence>
                                            {errors.imageUpload && (
                                                <motion.div
                                                    variants={errorMessageVariants} initial="hidden" animate="visible" exit="exit"
                                                    className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}
                                                >
                                                    {errors.imageUpload}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* menuItemType Selection */}
                                <motion.div custom={1} variants={formFieldVariants} initial="hidden" animate="visible" className="space-y-2">
                                    <Label htmlFor="menuItemType">Kategori</Label>
                                    <div>
                                        <Select value={formData.menuItemType} onValueChange={handlemenuItemTypeChange} disabled={isLoading}>
                                            <SelectTrigger id="menuItemType" className={`w-full ${darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"}`}>
                                                <SelectValue placeholder="Kategori seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">{menuItemTypeMap["1"]}</SelectItem>
                                                <SelectItem value="2">{menuItemTypeMap["2"]}</SelectItem>
                                                <SelectItem value="3">{menuItemTypeMap["3"]}</SelectItem>
                                                <SelectItem value="4">{menuItemTypeMap["4"]}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </motion.div>

                                {/* Name Input */}
                                <motion.div custom={2} variants={formFieldVariants} initial="hidden" animate="visible" className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="name" className="flex items-center">Ürün Adı<span className="text-red-500 ml-1">*</span></Label>
                                        <AnimatePresence mode="wait">
                                            {getFieldValidationState("name") === "error" && (
                                                <motion.div key="name-error" variants={validationIconVariants} initial="hidden" animate="visible" exit="exit" className={`rounded-full p-1 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}>
                                                    <AlertCircle className={`h-3 w-3 ${darkMode ? "text-red-400" : "text-red-500"}`} />
                                                </motion.div>
                                            )}
                                            {getFieldValidationState("name") === "success" && (
                                                <motion.div key="name-success" variants={validationIconVariants} initial="hidden" animate="visible" exit="exit" className={`rounded-full p-1 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                                    <CheckIcon className={`h-3 w-3 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        animate={
                                            focusedField === "name" ? { boxShadow: `0 0 0 2px ${darkMode ? "#6c4c9c" : "#6c4c9c"}` }
                                                : getFieldValidationState("name") === "error" ? { boxShadow: `0 0 0 2px ${darkMode ? "#ef4444" : "#f87171"}` }
                                                    : getFieldValidationState("name") === "success" ? { boxShadow: `0 0 0 2px ${darkMode ? "#10b981" : "#34d399"}` } : {}
                                        }
                                        transition={{ type: "spring", stiffness: 400 }} className="relative"
                                    >
                                        <Input
                                            id="name" name="name" value={formData.name} onChange={handleInputChange}
                                            onFocus={() => setFocusedField("name")} onBlur={handleBlur} placeholder="Ürün adını girin" required disabled={isLoading}
                                            className={`w-full rounded-xl ${darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"} ${getFieldValidationState("name") === "error" ? darkMode ? "border-red-700" : "border-red-300" : getFieldValidationState("name") === "success" ? darkMode ? "border-green-700" : "border-green-300" : ""}`}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {touched.name && errors.name && (
                                            <motion.div variants={errorMessageVariants} initial="hidden" animate="visible" exit="exit" className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>
                                                {errors.name}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Description Input */}
                                <motion.div custom={3} variants={formFieldVariants} initial="hidden" animate="visible" className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="description">Açıklama</Label>
                                        <AnimatePresence mode="wait">
                                            {getFieldValidationState("description") === "error" && (
                                                <motion.div key="description-error" variants={validationIconVariants} initial="hidden" animate="visible" exit="exit" className={`rounded-full p-1 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}>
                                                    <AlertCircle className={`h-3 w-3 ${darkMode ? "text-red-400" : "text-red-500"}`} />
                                                </motion.div>
                                            )}
                                            {getFieldValidationState("description") === "success" && (
                                                <motion.div key="description-success" variants={validationIconVariants} initial="hidden" animate="visible" exit="exit" className={`rounded-full p-1 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                                    <CheckIcon className={`h-3 w-3 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        animate={
                                            focusedField === "description" ? { boxShadow: `0 0 0 2px ${darkMode ? "#6c4c9c" : "#6c4c9c"}` }
                                                : getFieldValidationState("description") === "error" ? { boxShadow: `0 0 0 2px ${darkMode ? "#ef4444" : "#f87171"}` }
                                                    : getFieldValidationState("description") === "success" ? { boxShadow: `0 0 0 2px ${darkMode ? "#10b981" : "#34d399"}` } : {}
                                        }
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Textarea
                                            id="description" name="description" value={formData.description} onChange={handleInputChange}
                                            onFocus={() => setFocusedField("description")} onBlur={handleBlur} placeholder="Ürün açıklamasını girin"
                                            rows={3} disabled={isLoading}
                                            className={`w-full rounded-xl ${darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"} ${getFieldValidationState("description") === "error" ? darkMode ? "border-red-700" : "border-red-300" : getFieldValidationState("description") === "success" ? darkMode ? "border-green-700" : "border-green-300" : ""}`}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {touched.description && errors.description && (
                                            <motion.div variants={errorMessageVariants} initial="hidden" animate="visible" exit="exit" className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>
                                                {errors.description}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Price Input */}
                                <motion.div custom={4} variants={formFieldVariants} initial="hidden" animate="visible" className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="price" className="flex items-center">Fiyat (TL)<span className="text-red-500 ml-1">*</span></Label>
                                        <AnimatePresence mode="wait">
                                            {getFieldValidationState("price") === "error" && (
                                                <motion.div key="price-error" variants={validationIconVariants} initial="hidden" animate="visible" exit="exit" className={`rounded-full p-1 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}>
                                                    <AlertCircle className={`h-3 w-3 ${darkMode ? "text-red-400" : "text-red-500"}`} />
                                                </motion.div>
                                            )}
                                            {getFieldValidationState("price") === "success" && (
                                                <motion.div key="price-success" variants={validationIconVariants} initial="hidden" animate="visible" exit="exit" className={`rounded-full p-1 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                                    <CheckIcon className={`h-3 w-3 ${darkMode ? "text-green-400" : "text-green-500"}`} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        animate={
                                            focusedField === "price" ? { boxShadow: `0 0 0 2px ${darkMode ? "#6c4c9c" : "#6c4c9c"}` }
                                                : getFieldValidationState("price") === "error" ? { boxShadow: `0 0 0 2px ${darkMode ? "#ef4444" : "#f87171"}` }
                                                    : getFieldValidationState("price") === "success" ? { boxShadow: `0 0 0 2px ${darkMode ? "#10b981" : "#34d399"}` } : {}
                                        }
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Input
                                            id="price" name="price" type="number" value={formData.price} onChange={handleInputChange}
                                            onFocus={() => setFocusedField("price")} onBlur={handleBlur} placeholder="Ürün fiyatını girin"
                                            required min="0" step="0.01" disabled={isLoading}
                                            className={`w-full rounded-xl ${darkMode ? "border-gray-600 bg-[#333] text-white" : "border-[#6c4c9c]/20 bg-white text-gray-800"} ${getFieldValidationState("price") === "error" ? darkMode ? "border-red-700" : "border-red-300" : getFieldValidationState("price") === "success" ? darkMode ? "border-green-700" : "border-green-300" : ""}`}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {touched.price && errors.price && (
                                            <motion.div variants={errorMessageVariants} initial="hidden" animate="visible" exit="exit" className={`text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>
                                                {errors.price}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Availability Switch */}
                                <motion.div custom={5} variants={formFieldVariants} initial="hidden" animate="visible" className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="availability" className="flex items-center gap-2">
                                        <span>Ürün Stokta Mevcut Mu?</span>
                                        <AnimatePresence mode="wait">
                                            {formData.availability ? (
                                                <motion.span key="available-icon" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={`text-sm ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                    (Evet)
                                                </motion.span>
                                            ) : (
                                                <motion.span key="unavailable-icon" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}>
                                                    (Hayır)
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Label>
                                    <Switch
                                        id="availability"
                                        checked={formData.availability}
                                        onCheckedChange={handleAvailabilityChange}
                                        disabled={isLoading}
                                        className={`${darkMode ? "bg-amber-600" : "bg-[#6c4c9c]"} transition-colors duration-300`}
                                    />
                                </motion.div>

                                {/* Allergens selection */}
                                <motion.div
                                    custom={6} // Adjusted index
                                    variants={formFieldVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-3"
                                >
                                    <Label>Alerjenler</Label>
                                    {errors.allergensLoad && (
                                        <p className={`text-xs ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors.allergensLoad}</p>
                                    )}
                                    {availableAllergens.length === 0 && !errors.allergensLoad && <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Alerjen tipleri yükleniyor veya bulunamadı.</p>}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                        {availableAllergens.map((allergenKey) => (
                                            <motion.div
                                                key={allergenKey}
                                                className="flex items-center"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`allergen-${allergenKey}`}
                                                    value={allergenKey}
                                                    checked={(formData.allergens || []).includes(allergenKey)}
                                                    onChange={(e) => handleAllergenChange(allergenKey, e.target.checked)}
                                                    disabled={isLoading}
                                                    className={`h-4 w-4 rounded border-gray-300 text-[#6c4c9c] focus:ring-[#5d3d8d] ${darkMode ? "bg-gray-700 border-gray-600 focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
                                                />
                                                <label
                                                    htmlFor={`allergen-${allergenKey}`}
                                                    className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                                >
                                                    {allergenKey}
                                                </label>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>


                                {/* Action Buttons */}
                                <motion.div
                                    custom={7} // Adjusted index due to new element
                                    variants={formFieldVariants} initial="hidden" animate="visible" className="flex gap-3 pt-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400 }}
                                        type="button" onClick={handleBackClick} disabled={isLoading}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${darkMode
                                            ? "bg-gray-700 text-white hover:bg-gray-600"
                                            : "bg-[#7A0000] text-white hover:bg-[#6A0000]"
                                        }`}
                                    >
                                        <X className="h-5 w-5" /> İptal
                                    </motion.button>
                                    <motion.button
                                        variants={pulseVariants} initial="initial" animate={isLoading ? "initial" : "pulse"}
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400 }}
                                        type="submit" disabled={isLoading}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium shadow-md transition-colors ${darkMode
                                            ? "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                                            : "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
                                                    <Loader2 className="h-5 w-5" />
                                                </motion.div>
                                                <span>Kaydediliyor...</span>
                                            </>
                                        ) : (
                                            <> <Save className="h-5 w-5" /> Kaydet </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>

            <Footer darkMode={darkMode}></Footer>
        </div>
    )
}
