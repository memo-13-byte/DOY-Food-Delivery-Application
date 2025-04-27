"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Moon, Sun, Utensils, User, Mail, Phone, CreditCard, MapPin, ChevronRight, Instagram, Twitter, Youtube, Linkedin, AlertCircle, CheckCircle, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

// Custom UI components to avoid import issues
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

const Label = ({ className, ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  )
}

const Checkbox = ({ id, checked, onChange, className, ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 ${className}`}
        {...props}
      />
    </div>
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

// Error message component
const ErrorMessage = ({ message, darkMode }) => {
  if (!message) return null

  return (
    <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${darkMode ? "text-red-400" : "text-red-500"}`}>
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  )
}

// Success indicator component
const SuccessIndicator = ({ darkMode }) => {
  return (
    <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-green-400" : "text-green-500"}`}>
      <CheckCircle className="h-4 w-4" />
    </div>
  )
}

export default function RestaurantRegisterPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    ownerSurname: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // Validation errors state
  const [errors, setErrors] = useState({
    restaurantName: "",
    ownerName: "",
    ownerSurname: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  })

  // Touched fields tracking
  const [touched, setTouched] = useState({
    restaurantName: false,
    ownerName: false,
    ownerSurname: false,
    email: false,
    phone: false,
    idNumber: false,
    address: false,
    password: false,
    confirmPassword: false,
    acceptTerms: false,
  })

  // Animation on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "E-posta adresi gereklidir"
    if (!emailRegex.test(email)) return "Geçerli bir e-posta adresi giriniz"
    return ""
  }

  const validateName = (name, fieldName) => {
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
    if (!name) return `${fieldName} gereklidir`
    if (!nameRegex.test(name)) return `${fieldName} sadece harflerden oluşmalıdır`
    if (name.length < 2) return `${fieldName} en az 2 karakter olmalıdır`
    return ""
  }

  const validatePhone = (phone) => {
    // Turkish phone number format: 05XX XXX XXXX or 5XX XXX XXXX
    const phoneRegex = /^(0|90|\+90)?5\d{9}$/
    const digitsOnly = phone.replace(/\D/g, "")

    if (!phone) return "Telefon numarası gereklidir"
    if (digitsOnly.length !== 10 && digitsOnly.length !== 11) return "Telefon numarası 10 veya 11 haneli olmalıdır"
    if (!phoneRegex.test(digitsOnly)) return "Geçerli bir telefon numarası giriniz"
    return ""
  }

  const validateTCKN = (tckn) => {
    // TC Kimlik No validation rules
    if (!tckn) return "T.C. Kimlik Numarası gereklidir"
    if (!/^\d{11}$/.test(tckn)) return "T.C. Kimlik Numarası 11 haneli olmalıdır"

    // Additional TCKN validation algorithm
    if (tckn[0] === "0") return "T.C. Kimlik Numarası 0 ile başlayamaz"

    let oddSum = 0
    let evenSum = 0
    let total = 0

    for (let i = 0; i < 9; i++) {
      const digit = Number.parseInt(tckn[i])
      if (i % 2 === 0) {
        oddSum += digit
      } else {
        evenSum += digit
      }
      total += digit
    }

    const tenthDigit = (oddSum * 7 - evenSum) % 10
    if (Number.parseInt(tckn[9]) !== tenthDigit) return "Geçersiz T.C. Kimlik Numarası"

    const eleventhDigit = (total + tenthDigit) % 10
    if (Number.parseInt(tckn[10]) !== eleventhDigit) return "Geçersiz T.C. Kimlik Numarası"

    return ""
  }

  const validateAddress = (address) => {
    if (!address) return "Adres gereklidir"
    if (address.length < 10) return "Adres en az 10 karakter olmalıdır"
    return ""
  }

  const validateRestaurantName = (name) => {
    if (!name) return "Restoran adı gereklidir"
    if (name.length < 3) return "Restoran adı en az 3 karakter olmalıdır"
    return ""
  }

  const validatePassword = (password) => {
    if (!password) return "Şifre gereklidir"
    if (password.length < 8) return "Şifre en az 8 karakter olmalıdır"
    if (!/[A-Z]/.test(password)) return "Şifre en az bir büyük harf içermelidir"
    if (!/[a-z]/.test(password)) return "Şifre en az bir küçük harf içermelidir"
    if (!/[0-9]/.test(password)) return "Şifre en az bir rakam içermelidir"
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Şifre en az bir özel karakter içermelidir"
    return ""
  }

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Şifre tekrarı gereklidir"
    if (confirmPassword !== password) return "Şifreler eşleşmiyor"
    return ""
  }

  const validateTerms = (accepted) => {
    if (!accepted) return "Kullanım şartlarını kabul etmelisiniz"
    return ""
  }

  // Validate all fields
  const validateField = (name, value) => {
    switch (name) {
      case "restaurantName":
        return validateRestaurantName(value)
      case "ownerName":
        return validateName(value, "Ad")
      case "ownerSurname":
        return validateName(value, "Soyad")
      case "email":
        return validateEmail(value)
      case "phone":
        return validatePhone(value)
      case "idNumber":
        return validateTCKN(value)
      case "address":
        return validateAddress(value)
      case "password":
        return validatePassword(value)
      case "confirmPassword":
        return validateConfirmPassword(value, formData.password)
      case "acceptTerms":
        return validateTerms(value)
      default:
        return ""
    }
  }

  // Check if form is valid
  const isFormValid = () => {
    return Object.values(errors).every((error) => error === "")
  }

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target
    const inputValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({
      ...prev,
      [id]: inputValue,
    }))

    // Validate on change if field has been touched
    if (touched[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: validateField(id, inputValue),
      }))

      // If password changes, also validate confirmPassword
      if (id === "password" && touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(formData.confirmPassword, inputValue),
        }))
      }
    }
  }

  const handleBlur = (e) => {
    const { id, value, type, checked } = e.target
    const inputValue = type === "checkbox" ? checked : value

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }))

    // Validate on blur
    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, inputValue),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    // Validate all fields
    const newErrors = {}
    Object.entries(formData).forEach(([key, value]) => {
      newErrors[key] = validateField(key, value)
    })
    setErrors(newErrors)

    // Check if form is valid
    if (Object.values(newErrors).every((error) => error === "")) {
      // Form submission logic would go here
      console.log("Form submitted:", formData)
      alert("Form başarıyla gönderildi!")
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors).find((key) => newErrors[key] !== "")
      const errorElement = document.getElementById(firstErrorField)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        errorElement.focus()
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Add animations
  const animations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
  }
`

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c] text-gray-100" : "bg-[#F2E8D6]"} transition-colors duration-300`}
    >
      <style>{animations}</style>

      {/* Header section */}
      <header
        className={`${darkMode ? "bg-[#333]" : "bg-[#47300A]"} text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-colors duration-300`}
      >
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="font-bold text-white text-xl tracking-wide">DOY!</span>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              className={`${darkMode ? "bg-amber-500" : "bg-gray-300"} transition-colors duration-300`}
            />
            {darkMode ? <Sun className="h-4 w-4 text-white" /> : <Moon className="h-4 w-4 text-white" />}
          </div>
          <div className="flex">
            <Link to="/auth?tab=register">
              <button
                className={`px-4 py-1.5 text-sm font-medium rounded-l-full ${darkMode ? "bg-amber-600 text-white" : "bg-[#e8c886] text-[#6b4b10]"} transition-colors duration-300`}
              >
                KAYIT
              </button>
            </Link>
            <Link to="/auth?tab=login">
              <button
                className={`px-4 py-1.5 text-sm font-medium rounded-r-full ${darkMode ? "bg-amber-700 text-white" : "bg-[#d9b978] text-[#6b4b10]"} transition-colors duration-300`}
              >
                GİRİŞ
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Logo section */}
      <div className={`flex justify-center py-8 ${mounted ? "animate-fadeIn" : "opacity-0"}`}>
        <div
          className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-36 h-36 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <div className="relative w-28 h-28">
            <img src="/image1.png" alt="DOY Logo" width={112} height={112} className="w-full h-full" />
            <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              FOOD DELIVERY
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="flex-grow flex justify-center items-start px-4 pb-12">
        <div
          className={`w-full md:w-3/4 lg:w-2/3 xl:w-3/5 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-8 shadow-lg transition-colors duration-300 mx-auto ${mounted ? "animate-slideUp" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center mb-6">
            <Link to="/auth" className="mr-4">
              <Button
                className={`${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-amber-100 hover:bg-amber-200 text-amber-800"} rounded-full w-8 h-8 p-0 flex items-center justify-center`}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1
              className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-[#6b4b10]"} text-center flex-grow pr-8`}
            >
              Hesap Oluştur - Restoran
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex mb-8">
            <Link to="/auth?tab=login&type=restaurant" className="flex-1">
              <div
                className={`text-center py-2 border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"} hover:text-amber-500 transition-colors duration-200`}
              >
                Giriş
              </div>
            </Link>
            <div className="flex-1">
              <div
                className={`text-center py-2 border-b-2 ${darkMode ? "border-amber-400 text-amber-400" : "border-amber-500 text-[#6b4b10]"} font-medium`}
              >
                Kayıt Ol
              </div>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 group">
              <Label
                htmlFor="restaurantName"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <Utensils className="h-4 w-4" />
                Restoran Adınız
              </Label>
              <div className="relative">
                <Input
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Restoran adınızı girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.restaurantName}
                />
                {touched.restaurantName && !errors.restaurantName && formData.restaurantName && (
                  <SuccessIndicator darkMode={darkMode} />
                )}
              </div>
              <ErrorMessage message={errors.restaurantName} darkMode={darkMode} />
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="ownerName"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <User className="h-4 w-4" />
                Restoran Sahibinin Adı
              </Label>
              <div className="relative">
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Adınızı girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.ownerName}
                />
                {touched.ownerName && !errors.ownerName && formData.ownerName && (
                  <SuccessIndicator darkMode={darkMode} />
                )}
              </div>
              <ErrorMessage message={errors.ownerName} darkMode={darkMode} />
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="ownerSurname"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <User className="h-4 w-4" />
                Restoran Sahibinin Soyadı
              </Label>
              <div className="relative">
                <Input
                  id="ownerSurname"
                  value={formData.ownerSurname}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Soyadınızı girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.ownerSurname}
                />
                {touched.ownerSurname && !errors.ownerSurname && formData.ownerSurname && (
                  <SuccessIndicator darkMode={darkMode} />
                )}
              </div>
              <ErrorMessage message={errors.ownerSurname} darkMode={darkMode} />
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="email"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <Mail className="h-4 w-4" />
                Restoran E-Postası
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Restoran e-postanızı girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.email}
                />
                {touched.email && !errors.email && formData.email && <SuccessIndicator darkMode={darkMode} />}
              </div>
              <ErrorMessage message={errors.email} darkMode={darkMode} />
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="phone"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <Phone className="h-4 w-4" />
                Restoran Sahibinin Telefonu
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Telefonunuzu girin (5XX XXX XXXX)"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.phone}
                />
                {touched.phone && !errors.phone && formData.phone && <SuccessIndicator darkMode={darkMode} />}
              </div>
              <ErrorMessage message={errors.phone} darkMode={darkMode} />
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="idNumber"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <CreditCard className="h-4 w-4" />
                Restoran Sahibinin Kimlik Numarası
              </Label>
              <div className="relative">
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="T.C. Kimlik Numaranızı girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.idNumber}
                  maxLength={11}
                />
                {touched.idNumber && !errors.idNumber && formData.idNumber && <SuccessIndicator darkMode={darkMode} />}
              </div>
              <ErrorMessage message={errors.idNumber} darkMode={darkMode} />
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="address"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <MapPin className="h-4 w-4" />
                Restoran Adresi
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Restoran adresini girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base`}
                  error={errors.address}
                />
                {touched.address && !errors.address && formData.address && <SuccessIndicator darkMode={darkMode} />}
              </div>
              <ErrorMessage message={errors.address} darkMode={darkMode} />
            </div>

            {/* Password Field */}
            <div className="space-y-2 group">
              <Label
                htmlFor="password"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <Lock className="h-4 w-4" />
                Şifre
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Şifrenizi girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base pr-10`}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {touched.password && !errors.password && formData.password && <SuccessIndicator darkMode={darkMode} />}
              </div>
              <ErrorMessage message={errors.password} darkMode={darkMode} />
              {touched.password && formData.password && !errors.password && (
                <div className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"}`}>Güçlü şifre</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 group">
              <Label
                htmlFor="confirmPassword"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm flex items-center gap-2`}
              >
                <Lock className="h-4 w-4" />
                Şifre Tekrar
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Şifrenizi tekrar girin"
                  className={`${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} transition-all duration-200 py-3 px-4 text-base pr-10`}
                  error={errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                  <SuccessIndicator darkMode={darkMode} />
                )}
              </div>
              <ErrorMessage message={errors.confirmPassword} darkMode={darkMode} />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="space-y-2 group pt-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`mt-0.5 ${errors.acceptTerms ? "border-red-500" : ""}`}
                />
                <Label htmlFor="acceptTerms" className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}>
                  <span className="flex items-center gap-1">
                    Kullanım Şartlarını Kabul Ediyorum
                    <Link
                      to="/terms"
                      className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-[#5c4018] hover:text-amber-800"} underline underline-offset-2`}
                      target="_blank"
                    >
                      (Şartları Oku)
                    </Link>
                  </span>
                </Label>
              </div>
              <ErrorMessage message={errors.acceptTerms} darkMode={darkMode} />
            </div>

            <Button
              type="submit"
              className={`w-full mt-8 ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-[#e9c46a] hover:bg-[#e9b949] text-[#5c4018]"} font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 h-10 px-4 py-2 text-lg rounded-md`}
            >
              Kayıt Ol
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className={`text-center text-base ${darkMode ? "text-gray-400" : "text-gray-600"} mt-4`}>
              Zaten bir hesabınız var mı?{" "}
              <Link
                to="/auth?tab=login&type=restaurant"
                className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-[#5c4018] hover:text-amber-600"} hover:underline font-medium transition-colors duration-200`}
              >
                Giriş yap
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`mt-8 p-8 flex justify-between items-center ${darkMode ? "bg-[#1a1a1a]" : "bg-white"} transition-colors duration-300`}
      >
        <img
          src="/image1.png"
          alt="Logo alt"
          className="h-[50px] w-[50px] rounded-full object-cover"
        />

        <div className="flex gap-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Twitter className="h-6 w-6" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Youtube className="h-6 w-6" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </footer>
    </div>
  )
}
