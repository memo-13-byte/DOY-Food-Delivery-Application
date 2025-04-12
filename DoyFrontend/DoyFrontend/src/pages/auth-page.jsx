"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Moon, Sun } from "lucide-react"
import axios from "axios"

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

// Social media icons
const Twitter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const Instagram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Youtube = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const Linkedin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

// Link component to match wouter's Link
const Link = ({ href, className, children, onClick }) => (
  <a
    href={href}
    className={className}
    onClick={(e) => {
      e.preventDefault()
      if (onClick) onClick(e)
    }}
  >
    {children}
  </a>
)

export default function AuthPage() {
  // Custom hook to match wouter's useLocation
  const useLocation = () => {
    const [location, setLocationState] = useState(window.location.pathname + window.location.search)

    const setLocation = (to) => {
      window.history.pushState(null, "", to)
      setLocationState(to)
    }

    useEffect(() => {
      const handlePopState = () => {
        setLocationState(window.location.pathname + window.location.search)
      }
      window.addEventListener("popstate", handlePopState)
      return () => window.removeEventListener("popstate", handlePopState)
    }, [])

    return [location, setLocation]
  }

  // Replace Next.js searchParams with URL search params
  const [location, setLocation] = useLocation()
  const searchParams = new URLSearchParams(window.location.search)
  const tab = searchParams.get("tab") || "login"
  const type = searchParams.get("type") || "customer"

  const [activeTab, setActiveTab] = useState(tab)
  const [userType, setUserType] = useState(type)
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state for login
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Update state when URL parameters change
  useEffect(() => {
    setActiveTab(tab)
    setUserType(type)
  }, [tab, type])

  // Update URL when tabs change
  const handleTabChange = (value) => {
    setActiveTab(value)
    const newParams = new URLSearchParams(window.location.search)
    newParams.set("tab", value)
    setLocation(`/auth?${newParams.toString()}`)
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
      const response = await axios.post("http://localhost:8080/api/login/auth", {
        username: email,
        password: password
      });

      try {
        if (userType === "restaurant") {
          setLocation("/restaurant/profile")
        } else if (userType === "courier") {
          setLocation("/courier/profile")
        } else {
          setLocation("/customer/profile")
        }
      } catch (error) {
        console.error("Navigation error:", error)
        // Fallback - if navigation fails, try direct location change
        const basePath =
            userType === "restaurant"
                ? "/restaurant/profile"
                : userType === "courier"
                    ? "/courier/profile"
                    : "/customer/profile"
        window.location.href = basePath
      }
    } catch (error) {
      setErrorMessage("Hatalı kullanıcı adı veya şifre")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to change user type
  const changeUserType = (newType) => {
    const newParams = new URLSearchParams(window.location.search)
    newParams.set("type", newType)
    setLocation(`/auth?${newParams.toString()}`)
    setUserType(newType)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Add this to the component to define the animation
  const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
`

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900" : "bg-[#f5f0e1]"}`}>
      <style>{fadeInAnimation}</style>
      {/* Header section */}
      <header className={`py-3 px-6 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-[#5c4018]"}`}>
        <div className="flex items-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              setLocation("/")
            }}
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span className="font-bold text-white text-xl tracking-wide">DOY!</span>
          </a>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center bg-white/20 rounded-full p-1">
            <button onClick={toggleDarkMode} className="flex items-center justify-center w-6 h-6 rounded-full">
              {darkMode ? <Sun className="h-4 w-4 text-white" /> : <Moon className="h-4 w-4 text-white" />}
            </button>
          </div>
          <div className="flex">
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-l-full ${darkMode ? "bg-gray-700 text-white" : "bg-[#f5f0e1] text-[#5c4018]"}`}
              onClick={() => setLocation("/auth?tab=register&type=" + userType)}
            >
              KAYIT
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-r-full ${darkMode ? "bg-gray-600 text-white" : "bg-white text-[#5c4018]"}`}
              onClick={() => setLocation("/auth?tab=login&type=" + userType)}
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
      <div className="flex-grow flex justify-center items-start p-4">
        <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-center text-xl font-semibold text-[#5c4018] mb-6">Kullanıcı Girişi</h2>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 border rounded-lg overflow-hidden">
              <TabsTrigger
                value="login"
                className={`py-2 px-4 transition-all duration-300 ${activeTab === "login" ? "bg-white" : "bg-gray-100"}`}
                onClick={handleTabChange}
              >
                Giriş
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={`py-2 px-4 transition-all duration-300 ${activeTab === "register" ? "bg-white" : "bg-gray-100"}`}
                onClick={(value) => {
                  // Check the user type and redirect accordingly
                  if (getTitle() === "Restoran") {
                    setLocation("/restaurants/register")
                  } else if (getTitle() === "Kurye") {
                    setLocation("/couriers/register")
                  } else {
                    // Default behavior for other user types
                    handleTabChange(value)
                  }
                }}
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
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Email adresiniz"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-700 font-medium">
                        Şifre
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Şifreniz"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
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
                          className="h-4 w-4 text-[#5c4018] focus:ring-[#5c4018] border-gray-300 rounded"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Beni hatırla
                        </label>
                      </div>
                      <div className="text-sm">
                        <Link
                          href="/forgot-password"
                          className="text-[#5c4018] hover:underline"
                          onClick={() => setLocation("/forgot-password")}
                        >
                          Şifremi unuttum
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-[#e9c46a] hover:bg-[#e9b949] text-[#5c4018] font-medium py-2 rounded-md flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#5c4018]"
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
                    <div className="text-center text-sm text-gray-600 pt-2">
                      Hesabınız yok mu?{" "}
                      <a
                        href={`/auth?tab=register&type=${userType}`}
                        className="text-[#5c4018] hover:underline font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          setLocation(`/auth?tab=register&type=${userType}`)
                        }}
                      >
                        Kayıt ol
                      </a>
                    </div>
                  </motion.form>
                </TabsContent>
              )}

              {activeTab === "register" && (
                <TabsContent value="register" activeTab={activeTab} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Ad Soyad
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ad Soyad"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        E-posta
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="E-posta"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Telefon"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        Şifre
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Şifre"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                        Şifre Tekrar
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Şifre Tekrar"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="rounded text-[#5c4018]" />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        Kullanım şartlarını ve gizlilik politikasını kabul ediyorum
                      </label>
                    </div>
                    <div>
                      <Button className="w-full bg-[#e9c46a] hover:bg-[#e9b949] text-[#5c4018] font-medium py-2 rounded-md flex items-center justify-center gap-2">
                        Kayıt Ol
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center text-sm text-gray-600 pt-2">
                      Zaten hesabınız var mı?{" "}
                      <a
                        href={`/auth?tab=login&type=${userType}`}
                        className="text-[#5c4018] hover:underline font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          setLocation(`/auth?tab=login&type=${userType}`)
                        }}
                      >
                        Giriş Yap
                      </a>
                    </div>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 mt-auto">
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-4 w-24 h-24 flex items-center justify-center shadow-md transition-all duration-300`}
          >
            <div className="relative w-16 h-16">
              <img src="/image1.png" alt="DOY Logo" width={64} height={64} className="w-full h-full" />
              <div className={`text-center text-[8px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                FOOD DELIVERY
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#5c4018]"} transition-colors`}
            >
              <Twitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#5c4018]"} transition-colors`}
            >
              <Instagram />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#5c4018]"} transition-colors`}
            >
              <Youtube />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#5c4018]"} transition-colors`}
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
