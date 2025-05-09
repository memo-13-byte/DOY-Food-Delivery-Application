"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import AuthorizedRequest from "../services/AuthorizedRequest"
import {
  Moon, Sun, Utensils, Star, MessageSquare, ChevronRight, 
  Instagram, Twitter, Youtube, Linkedin, AlertCircle, CheckCircle,
  Loader2, Bike, Store
} from "lucide-react"

import { OrderDetailModal } from "../components/OrderDetailModal" // Correct import
import { navigate } from "wouter/use-browser-location"

const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className, error, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        error ? "border-red-500 focus-visible:ring-red-500" : "border-input"
      } ${className}`}
      {...props}
    />
  )
}

const Textarea = ({ className, error, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        error ? "border-red-500 focus-visible:ring-red-500" : "border-input"
      } ${className}`}
      {...props}
    />
  )
}

const Label = ({ className, ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  )
}

const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <button
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

const ErrorMessage = ({ message, darkMode }) => {
  if (!message) return null
  return (
    <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${darkMode ? "text-red-400" : "text-red-500"}`}>
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  )
}

const SuccessIndicator = ({ darkMode }) => {
  return (
    <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-green-400" : "text-green-500"}`}>
      <CheckCircle className="h-4 w-4" />
    </div>
  )
}

const StarRating = ({ rating, setRating, error, darkMode }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`focus:outline-none ${
            star <= rating
              ? darkMode
                ? "text-amber-400"
                : "text-amber-500"
              : darkMode
              ? "text-gray-600"
              : "text-gray-300"
          }`}
        >
          <Star
            className={`h-6 w-6 ${star <= rating ? "fill-current" : ""}`}
            aria-label={`${star} yıldız`}
          />
        </button>
      ))}
      {error && <ErrorMessage message={error} darkMode={darkMode} />}
    </div>
  )
}

export default function OrderReviewPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null })
  const [formData, setFormData] = useState({
    restaurantRating: 0,
    restaurantComment: "",
    courierRating: 0,
    courierComment: "",
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  // State for OrderDetailModal
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [orderIdInformation, setOrderIdInformation] = useState(null)

  const { id: orderId } = useParams() // Assuming orderId is passed via URL (e.g., /review/:orderId)
  const API_BASE_URL = "http://localhost:8080"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const getOrderIdInformation = async () => {
      const response = await AuthorizedRequest.getRequest(`http://localhost:8080/order/details/get-user-info/${orderId}`);
      setOrderIdInformation(response.data)
      console.log(response.data)
      console.log(localStorage.getItem("token"))
    }

    getOrderIdInformation()
  }, [])

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    
    if (!orderId) {
      setDetailError("Sipariş ID sağlanmadı.")
      setDetailLoading(false)
      return
    }
    
    setDetailLoading(true)
    setDetailError(null)
    setSelectedOrderDetail(null)
    
    const url = `${API_BASE_URL}/order/details/${orderId}`
    console.log(selectedOrderDetail)
    try {
      
      const response = await AuthorizedRequest.getRequest(url)
      if (response.data) {
        setSelectedOrderDetail(response.data)
        
        setShowModal(true) // Show modal after fetching
        
      } else {
        setDetailError("Sipariş detayları bulunamadı.")
        setSelectedOrderDetail({ orderId })
      }
    } catch (err) {
      setDetailError(
        `Sipariş detayları yüklenirken hata: ${
          err.response?.data?.message || err.message || "Bilinmeyen Hata"
        }`
      )
      setSelectedOrderDetail({ orderId })
    } finally {
      setDetailLoading(false)
      
    }
  }

  // Handler to trigger modal
  const handleShowDetailsClick = () => {
    console.log(orderId)
    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      setDetailError("Sipariş ID URL'de bulunamadı.")
    }
  }

  // Handler to close modal
  const closeDetailModal = () => {
    setShowModal(false)
    setSelectedOrderDetail(null)
    setDetailLoading(false)
    setDetailError(null)
  }

  const validateRequiredRating = (value, fieldName) => {
    if (value === 0) return `${fieldName} derecelendirmesi gereklidir`
    return ""
  }

  const validateComment = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} alanı gereklidir`
    return ""
  }

  const validateField = (name, value) => {
    switch (name) {
      case "restaurantRating":
        return validateRequiredRating(value, "Restoran")
      case "courierRating":
        return validateRequiredRating(value, "Kurye")
      case "restaurantComment":
        return validateComment(value, "Restoran yorumu")
      case "courierComment":
        return validateComment(value, "Kurye yorumu")
      default:
        return ""
    }
  }

  const validateAllFields = (data) => {
    const newErrors = {}
    let isValid = true
    Object.keys(data).forEach((key) => {
      const error = validateField(key, data[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })
    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    if (touched[id]) {
      const error = validateField(id, value)
      setErrors((prev) => ({ ...prev, [id]: error }))
    }

    setSubmitStatus({ success: false, error: null })
  }

  const handleRatingChange = (field, rating) => {
    setFormData((prev) => ({ ...prev, [field]: rating }))

    if (touched[field]) {
      const error = validateField(field, rating)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }

    setSubmitStatus({ success: false, error: null })
  }

  const handleBlur = (e) => {
    const { id, value } = e.target
    setTouched((prev) => ({ ...prev, [id]: true }))

    const error = validateField(id, value)
    setErrors((prev) => ({ ...prev, [id]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ success: false, error: null })

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)

    const isValid = validateAllFields(formData)

    if (isValid) {
      const payload = {
        restaurantStarRating: formData.restaurantRating,
        restaurantId: orderIdInformation.restaurantId,
        restaurantComment: {
          content: formData.restaurantComment,
          userId: orderIdInformation.customerId
        },
        courierStarRating: formData.courierRating,
        courierId: orderIdInformation.courierId,
        courierComment: {
          content: formData.courierComment,
          userId: orderIdInformation.customerId
        },
        orderId: orderId,
        customerId: orderIdInformation.customerId
      }

      console.log(payload)

      try {
        await AuthorizedRequest.postRequest(`http://localhost:8080/api/order-review/post`, payload)
        setSubmitStatus({ success: true, error: null })
        alert("Yorumlarınız başarıyla gönderildi!")
        navigate("/");
      } catch (error) {
        console.error("Review submission error:", error)
        setSubmitStatus({
          success: false,
          error: "Yorumlar gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      const firstErrorField = Object.keys(errors).find((key) => errors[key])
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
          errorElement.focus({ preventScroll: true })
        }
      }
      setIsSubmitting(false)
    }
  }

  const getInputClassName = (darkMode) =>
    `${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-amber-50 border-amber-100 focus:border-amber-300"} focus:ring-amber-200 transition-all duration-200 group-hover:border-amber-300`
  const getLabelClassName = (darkMode) =>
    `${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-center gap-2`

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"} transition-colors duration-300`}>
      {/* --- Header --- */}
      <header
        className={`${darkMode ? "bg-gray-800" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md transition-colors duration-300`}
      >
        <div className="flex items-center">
          <Link to="/">
            <span className="font-bold text-xl hover:text-amber-200 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              <span>Doy!</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className={`${darkMode ? "data-[state=checked]:bg-gray-600" : "data-[state=checked]:bg-amber-200"} transition-colors duration-300`}
            />
            {darkMode ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-amber-200" />}
          </div>
          <Link to="/auth?tab=register">
            <button
              className={`${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-amber-200 text-amber-800 hover:bg-amber-300"} rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105`}
            >
              KAYIT
            </button>
          </Link>
          <Link to="/auth?tab=login">
            <button
              className={`${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-white text-amber-800 hover:bg-amber-50"} rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm`}
            >
              GİRİŞ
            </button>
          </Link>
        </div>
      </header>

      {/* --- Logo --- */}
      <div className={`flex justify-center py-8 ${mounted ? "animate-fadeIn" : "opacity-0"}`}>
        <div className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-36 h-36 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}>
          <div className="relative w-28 h-28">
            <img src="/image1.png" alt="DOY Logo" width={112} height={112} className="w-full h-full" />
            <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>FOOD DELIVERY</div>
          </div>
        </div>
      </div>

      {/* --- Review Form --- */}
      <div className="flex-grow flex justify-center items-start px-4 pb-12">
        <div className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-8 shadow-lg transition-all duration-300 ${mounted ? "animate-slideUp" : "opacity-0 translate-y-10"}`}>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-amber-800"} text-center mb-6`}>Sipariş Değerlendirme</h1>

          {/* Button to Trigger Modal */}
          <Button
            onClick={handleShowDetailsClick}
            disabled={detailLoading}
            className={`w-full mb-6 ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-amber-300 hover:bg-amber-400 text-amber-800"} font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 h-11 px-4 py-2`}
          >
            {detailLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                Sipariş Detaylarını Görüntüle
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Submission Feedback */}
          {submitStatus.error && (
            <div className={`mb-4 p-3 rounded-md ${darkMode ? "bg-red-900/50 border border-red-700" : "bg-red-100 border-red-300"}`}>
              <ErrorMessage message={submitStatus.error} darkMode={darkMode} />
            </div>
          )}
          {submitStatus.success && (
            <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${darkMode ? "bg-green-900/50 border border-green-700 text-green-300" : "bg-green-100 border border-green-300 text-green-700"}`}>
              <CheckCircle className="h-5 w-5" />
              <span>Yorumlarınız başarıyla gönderildi!</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* --- Restaurant Review Section --- */}
            <h2 className={`text-lg font-semibold border-b pb-2 mb-4 ${darkMode ? "border-gray-700 text-amber-400" : "border-gray-300 text-amber-700"}`}>Restoran Değerlendirmesi</h2>
            <div className="space-y-5">
              <div className="space-y-1 group">
                <Label className={getLabelClassName(darkMode)}>
                  <Star className="h-4 w-4" /> Restoran Puanı
                </Label>
                <StarRating
                  rating={formData.restaurantRating}
                  setRating={(rating) => handleRatingChange("restaurantRating", rating)}
                  error={touched.restaurantRating && errors.restaurantRating}
                  darkMode={darkMode}
                />
              </div>
              <div className="space-y-1 group">
                <Label htmlFor="restaurantComment" className={getLabelClassName(darkMode)}>
                  <MessageSquare className="h-4 w-4" /> Restoran Yorumu
                </Label>
                <div className="relative">
                  <Textarea
                    id="restaurantComment"
                    value={formData.restaurantComment}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Restoran hakkındaki yorumlarınızı yazın..."
                    className={getInputClassName(darkMode)}
                    error={!!errors.restaurantComment}
                    rows={4}
                  />
                  {touched.restaurantComment && !errors.restaurantComment && formData.restaurantComment && <SuccessIndicator darkMode={darkMode} />}
                </div>
                <ErrorMessage message={errors.restaurantComment} darkMode={darkMode} />
              </div>
            </div>

            {/* --- Courier Review Section --- */}
            <h2 className={`text-lg font-semibold border-b pb-2 mb-4 mt-6 ${darkMode ? "border-gray-700 text-amber-400" : "border-gray-300 text-amber-700"}`}>Kurye Değerlendirmesi</h2>
            <div className="space-y-5">
              <div className="space-y-1 group">
                <Label className={getLabelClassName(darkMode)}>
                  <Star className="h-4 w-4" /> Kurye Puanı
                </Label>
                <StarRating
                  rating={formData.courierRating}
                  setRating={(rating) => handleRatingChange("courierRating", rating)}
                  error={touched.courierRating && errors.courierRating}
                  darkMode={darkMode}
                />
              </div>
              <div className="space-y-1 group">
                <Label htmlFor="courierComment" className={getLabelClassName(darkMode)}>
                  <MessageSquare className="h-4 w-4" /> Kurye Yorumu
                </Label>
                <div className="relative">
                  <Textarea
                    id="courierComment"
                    value={formData.courierComment}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Kurye hakkındaki yorumlarınızı yazın..."
                    className={getInputClassName(darkMode)}
                    error={!!errors.courierComment}
                    rows={4}
                  />
                  {touched.courierComment && !errors.courierComment && formData.courierComment && <SuccessIndicator darkMode={darkMode} />}
                </div>
                <ErrorMessage message={errors.courierComment} darkMode={darkMode} />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || submitStatus.success}
              className={`w-full mt-8 ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-amber-300 hover:bg-amber-400 text-amber-800"} font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 h-11 px-4 py-2 disabled:bg-opacity-70 disabled:scale-100`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  Yorum Gönder
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* --- Order Detail Modal --- */}
      {showModal && (
        <OrderDetailModal
          orderDetails={selectedOrderDetail}
          onClose={closeDetailModal}
          isLoading={detailLoading}
          error={detailError}
          darkMode={darkMode}
        />
      )}

      {/* --- Footer --- */}
      <footer className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-200"} p-8 border-t transition-colors duration-300 mt-auto`}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <div className="mb-6 md:mb-0">
            <div className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-4 w-24 h-24 flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105`}>
              <div className="relative w-16 h-16">
                <img src="/image1.png" alt="DOY Logo" width={64} height={64} className="w-full h-full" />
                <div className={`text-center text-[8px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>FOOD DELIVERY</div>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="Twitter">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="Instagram">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="YouTube">
              <Youtube className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="LinkedIn">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}