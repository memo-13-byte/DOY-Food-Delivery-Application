"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Moon, Sun, CheckCircle } from "lucide-react"
import axios from "axios"
import CustomerService from "../services/CustomerService"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"

// Since we're having issues with the UI component imports, let's create simplified versions
const Button = ({ className, children, ...props }) => (
  <button className={`px-4 py-2 rounded-lg font-medium ${className}`} {...props}>
    {children}
  </button>
)

const Input = ({ className, ...props }) => (
  <input className={`w-full px-3 py-2 border rounded-lg ${className}`} {...props} />
)

const Label = ({ className, htmlFor, children }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`} htmlFor={htmlFor}>
    {children}
  </label>
)

// Simplified Tabs components
const Tabs = ({ value, onValueChange, className, children }) => <div className={className}>{children}</div>

const TabsList = ({ className, children }) => <div className={className}>{children}</div>

const TabsTrigger = ({ value, className, children, onClick }) => (
  <button className={className} onClick={() => onClick && onClick(value)}>
    {children}
  </button>
)

const TabsContent = ({ value, activeTab, className, children }) => (
  <div className={`${className} ${value === activeTab ? "block" : "hidden"}`}>{children}</div>
)

// Simple Alertify component
const Alertify = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg ${
          type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 mr-2" />
        ) : (
          <svg
            className="h-5 w-5 mr-2"
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
        )}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700" aria-label="Close">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Add Switch component
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

export default function AuthPage() {
  // Use react-router-dom hooks instead of custom useLocation
  const location = useLocation()
  const navigate = useNavigate()

  // Parse search params using URLSearchParams
  const searchParams = new URLSearchParams(location.search)
  const tab = searchParams.get("tab") || "login"
  const type = searchParams.get("type") || "customer"

  const [activeTab, setActiveTab] = useState(tab)
  const [userType, setUserType] = useState(type)
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)

    // URL parametrelerine göre yönlendirme
    if (tab === "register" && type === "restaurant") {
      navigate("/restaurant/register")
      return
    }

    if (tab === "register" && type === "courier") {
      navigate("/courier/register")
      return
    }
  }, [])

  // Form state for login
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Form state for registration
  const [registerFirstName, setRegisterFirstName] = useState("")
  const [registerLastName, setRegisterLastName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)

  // Alertify state
  const [alertify, setAlertify] = useState({ show: false, message: "", type: "success" })

  // Update state when URL parameters change
  useEffect(() => {
    setActiveTab(tab)
    setUserType(type)
  }, [tab, type])

  // Update URL when tabs change
  const handleTabChange = (value) => {
    setActiveTab(value)
    const newParams = new URLSearchParams(location.search)
    newParams.set("tab", value)

    // Eğer register sekmesine geçiliyorsa ve kullanıcı tipi restaurant veya courier ise, ilgili sayfaya yönlendir
    if (value === "register" && (userType === "restaurant" || userType === "courier")) {
      if (userType === "restaurant") {
        navigate("/restaurant/register")
        return
      } else if (userType === "courier") {
        navigate("/courier/register")
        return
      }
    }

    navigate(`/auth?${newParams.toString()}`)
  }

  const getTitle = () => {
    if (userType === "restaurant") return "Restoran"
    if (userType === "courier") return "Kurye"
    return "Müşteri"
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    try {
      // Mock API call - in a real app, you would validate credentials with an API
      // For this demo, we'll just check if email and password are provided
      if (email && password) {

          console.log(email)
          console.log(password)
        const loginInfo = {
          username: email,
          password: password
        }
        console.log(loginInfo)
        const response = await axios.post('http://localhost:8080/api/login/auth',
            loginInfo);

        const profileId = 1;
        // Redirect to the appropriate dashboard based on user type
        try {
          if (userType === "restaurant") {
            navigate(`/restaurant/profile/${profileId}`)
          } else if (userType === "courier") { 
            navigate(`/courier/profile/${profileId}`)
          } else {
            navigate(`/customer/profile/${profileId}`)
          }
        } catch (error) {
          console.error("Navigation error:", error)
          // Fallback - if navigation fails, try direct location change
          const basePath =
            userType === "restaurant"
              ? `/restaurant/profile/${profileId}`
              : userType === "courier"
                ? `/courier/profile/${profileId}`
                : `/customer/profile/${profileId}`
          window.location.href = basePath
        }
      } else {
        setErrorMessage("Lütfen e-posta ve şifre girin")
      }
    } catch (error) {
      setErrorMessage("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show alertify message
  const showAlertify = (message, type = "success") => {
    setAlertify({ show: true, message, type })
  }

  // Hide alertify message
  const hideAlertify = () => {
    setAlertify({ ...alertify, show: false })
  }

  // Add a new handleRegister function after the handleLogin function
  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setIsRegisterLoading(true)

    try {
      // Validate passwords match
      if (registerPassword !== confirmPassword) {
        setErrorMessage("Şifreler eşleşmiyor")
        setIsRegisterLoading(false)
        return
      }

      const registrationInfo = {
        firstName: registerFirstName,
        lastName: registerLastName,
        email: registerEmail,
        password: registerPassword,
        phoneNumber: registerPhone
      }

      
      await CustomerService.RegisterCustomer(registrationInfo);

      const profileId = 0;

      // Mock API call - in a real app, you would send registration data to an API
      // For this demo, we'll just simulate a successful registration
      setTimeout(() => {
        // Show success message
        showAlertify("Kayıt işlemi başarıyla tamamlandı!", "success")

        // Wait for the alertify to be visible before redirecting
        setTimeout(() => {
          // Redirect to the appropriate dashboard based on user type
          try {
            if (userType === "restaurant") {
              navigate(`/restaurant/profile/${profileId}`)
            } else if (userType === "courier") {
              navigate(`/courier/profile/${profileId}`)
            } else {
              navigate(`/customer/profile/${profileId}`)
            }
          } catch (error) {
            console.error("Navigation error:", error)
            // Fallback - if navigation fails, try direct location change
            const basePath =
              userType === "restaurant"
                ? `/restaurant/profile/${profileId}`
                : userType === "courier"
                  ? `/courier/profile/${profileId}`
                  : `/customer/profile/${profileId}`
            window.location.href = basePath
          }
        }, 2000) // Wait 2 seconds before redirecting so the user can see the message
      }, 1000) // Simulate network delay
    } catch (error) {
      setErrorMessage("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.")
      console.error("Registration error:", error)
    } finally {
      setIsRegisterLoading(false)
    }
  }

  // Helper function to change user type
  const changeUserType = (newType) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set("type", newType)

    // Eğer aktif sekme register ise ve yeni tip restaurant veya courier ise, ilgili sayfaya yönlendir
    if (activeTab === "register" && (newType === "restaurant" || newType === "courier")) {
      if (newType === "restaurant") {
        navigate("/restaurant/register")
        return
      } else if (newType === "courier") {
        navigate("/courier/register")
        return
      }
    }

    navigate(`/auth?${newParams.toString()}`)
    setUserType(newType)
  }

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

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Add this to the component to define the animation
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
`

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c]" : "bg-[#F2E8D6]"} transition-colors duration-300`}
    >
      <style>{animations}</style>

      {/* Alertify notification */}
      {alertify.show && <Alertify message={alertify.message} type={alertify.type} onClose={hideAlertify} />}

      {/* Header section */}
      <header
        className={`${darkMode ? "bg-[#333]" : "bg-[#47300A]"} text-white py-4 px-6 flex justify-between items-center shadow-lg transition-colors duration-300`}
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
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-l-full ${darkMode ? "bg-amber-600 text-white" : "bg-[#e8c886] text-[#6b4b10]"} transition-colors duration-300`}
              onClick={() => navigate("/auth?tab=register&type=" + userType)}
            >
              KAYIT
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-r-full ${darkMode ? "bg-amber-700 text-white" : "bg-[#d9b978] text-[#6b4b10]"} transition-colors duration-300`}
              onClick={() => navigate("/auth?tab=login&type=" + userType)}
            >
              GİRİŞ
            </button>
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

      {/* Auth Form */}
      <div className="flex-grow flex justify-center items-start p-4 w-full">
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-3/5 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg transition-colors duration-300 mx-auto">
          <h2 className="text-center text-2xl font-semibold text-[#6b4b10] dark:text-amber-400 mb-8 transition-colors duration-300">
            {getTitle()} Girişi
          </h2>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 border rounded-lg overflow-hidden">
              <TabsTrigger
                value="login"
                className={`py-2 px-4 transition-all duration-300 ${activeTab === "login" ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}`}
                onClick={handleTabChange}
              >
                Giriş
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={`py-2 px-4 transition-all duration-300 ${activeTab === "register" ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}`}
                onClick={(value) => handleTabChange(value)}
              >
                Kayıt Ol
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {activeTab === "login" && (
                <TabsContent value="login" activeTab={activeTab} className="space-y-4">
                  <motion.form
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex">
                          <div className="py-1">
                            <svg
                              className="h-6 w-6 text-red-500 mr-4"
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
                            <p className="font-medium">{errorMessage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-gray-700 dark:text-gray-300 font-medium">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Email adresiniz"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white py-3 px-4 text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-700 dark:text-gray-300 font-medium">
                        Şifre
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Şifreniz"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-[#5c4018] focus:ring-[#5c4018] border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Beni hatırla
                        </label>
                      </div>
                      <div className="text-sm">
                        <Link to="/forgot-password" className="text-[#5c4018] dark:text-amber-400 hover:underline">
                          Şifremi unuttum
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-[#e9c46a] hover:bg-[#e9b949] dark:bg-amber-600 dark:hover:bg-amber-500 text-[#5c4018] dark:text-white font-medium py-3 text-lg rounded-md flex items-center justify-center gap-2 transition-colors duration-300 mt-6"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#5c4018] dark:text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Giriş Yapılıyor...
                          </div>
                        ) : (
                          <>
                            Giriş Yap
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-center text-base text-gray-600 dark:text-gray-400 pt-4">
                      Hesabınız yok mu?{" "}
                      <Link
                        to={`/auth?tab=register&type=${userType}`}
                        className="text-[#5c4018] dark:text-amber-400 hover:underline font-medium"
                      >
                        Kayıt ol
                      </Link>
                    </div>
                  </motion.form>
                </TabsContent>
              )}

              {activeTab === "register" && (
                <TabsContent value="register" activeTab={activeTab} className="space-y-4">
                  <motion.form
                    onSubmit={handleRegister}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {errorMessage && (
                      <motion.div
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
                            <p className="font-medium">{errorMessage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">
                        Ad
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Ad"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                        value={registerFirstName}
                        onChange={(e) => setRegisterFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">
                        Soyad
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Soyad"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                        value={registerLastName}
                        onChange={(e) => setRegisterLastName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                        E-posta
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="E-posta"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Telefon"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                        Şifre
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Şifre"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">
                        Şifre Tekrar
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Şifre Tekrar"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="rounded text-[#5c4018] dark:text-amber-500 dark:bg-gray-700 dark:border-gray-600"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                        Kullanım şartlarını ve gizlilik politikasını kabul ediyorum
                      </label>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-[#e9c46a] hover:bg-[#e9b949] dark:bg-amber-600 dark:hover:bg-amber-500 text-[#5c4018] dark:text-white font-medium py-3 text-lg rounded-md flex items-center justify-center gap-2 transition-colors duration-300 mt-6"
                        disabled={isRegisterLoading}
                      >
                        {isRegisterLoading ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#5c4018] dark:text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Kayıt Yapılıyor...
                          </div>
                        ) : (
                          <>
                            Kayıt Ol
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-center text-base text-gray-600 dark:text-gray-400 pt-4">
                      Zaten hesabınız var mı?{" "}
                      <Link
                        to={`/auth?tab=login&type=${userType}`}
                        className="text-[#5c4018] dark:text-amber-400 hover:underline font-medium"
                      >
                        Giriş Yap
                      </Link>
                    </div>
                  </motion.form>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
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
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}
