"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Moon, Sun, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"

// Simplified UI components (Button, Input, Label)
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

// Social media icons
const Twitter = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
)
const Instagram = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
)
const Youtube = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
)
const Linkedin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
)

export default function ForgotPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type") || "customer"

  const [userType, setUserType] = useState(type)
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [step, setStep] = useState("request")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setUserType(type)
  }, [type])

  const formatApiError = (errorData) => {
    if (!errorData) return "";
    if (typeof errorData.message === 'string' && errorData.message.trim() !== '') {
      return errorData.message.trim();
    }
    if (errorData.errors) {
      if (typeof errorData.errors === 'string') {
        return errorData.errors.trim();
      }
      if (Array.isArray(errorData.errors)) {
        return errorData.errors
            .map(err => (typeof err === 'object' ? Object.values(err).join(' ') : String(err)))
            .filter(s => s.trim() !== '')
            .join(", ");
      }
      if (typeof errorData.errors === 'object') {
        return Object.values(errorData.errors)
            .map(val => String(val))
            .filter(s => s.trim() !== '')
            .join(", ");
      }
    }
    // Fallback for non-standard error structures if errorData itself might be a string
    if (typeof errorData === 'string') return errorData.trim();
    return ""; // Return empty string if no suitable message found
  };


  const handleRequestResetLink = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true)

    if (!email) {
      setErrorMessage("Lütfen e-posta adresinizi girin.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/users/forget-password/${email}`)
      if (response.status === 200 || response.status === 204) {
        setSuccessMessage(
            response.data?.message || "Şifre sıfırlama talimatları e-posta adresinize gönderildi. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol edin. Ardından aşağıdaki alana token'ı ve yeni şifrenizi girin."
        )
        setStep("confirm")
      } else {
        // This path is less likely with axios as it throws on non-2xx
        const apiErrorString = formatApiError(response.data);
        setErrorMessage(apiErrorString || "Şifre sıfırlama bağlantısı gönderilemedi.");
      }
    } catch (error) {
      let finalErrorMessage = "Bir ağ hatası oluştu veya sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.";
      if (axios.isAxiosError(error) && error.response) {
        const apiErrorString = formatApiError(error.response.data);
        finalErrorMessage = apiErrorString || "Şifre sıfırlama isteği sırasında bir hata oluştu. Lütfen e-postanızı kontrol edin veya sunucuyla ilgili bir sorun olabilir.";
      }
      setErrorMessage(finalErrorMessage);
      console.error("Forget password error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true)

    if (!token || !newPassword || !confirmPassword) {
      setErrorMessage("Lütfen tüm alanları doldurun.")
      setIsLoading(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Yeni şifreler eşleşmiyor.")
      setIsLoading(false)
      return
    }
    if (token.length !== 6) {
      setErrorMessage("Token 6 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Yeni şifre en az 8 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }

    try {
      const requestBody = {
        token: token,
        password: newPassword,
      };
      const response = await axios.put(`http://localhost:8080/api/users/reset-password`, requestBody)

      if (response.status === 200 || response.status === 204) {
        setSuccessMessage(response.data?.message || "Şifreniz başarıyla sıfırlandı! Şimdi giriş yapabilirsiniz.")
        setStep("success")
        setToken("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const apiErrorString = formatApiError(response.data);
        setErrorMessage(apiErrorString || "Şifre sıfırlanamadı.");
      }
    } catch (error) {
      let finalErrorMessage = "Bir ağ hatası oluştu veya sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.";
      if (axios.isAxiosError(error) && error.response) {
        const apiErrorString = formatApiError(error.response.data);
        finalErrorMessage = apiErrorString || "Şifre sıfırlanamadı. Token geçersiz olabilir veya bir sunucu hatası oluştu.";
      }
      setErrorMessage(finalErrorMessage);
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
`
  // ... Rest of the component (JSX) remains the same
  return (
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-[#f5f0e1] text-gray-800"}`}>
        <style>{fadeInAnimation}</style>
        {/* Header section */}
        <header className={`py-3 px-6 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-[#5c4018]"}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <span className="font-bold text-white text-xl tracking-wide">DOY!</span>
            </Link>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center bg-white/20 rounded-full p-1">
              <button onClick={toggleDarkMode} className="flex items-center justify-center w-6 h-6 rounded-full">
                {darkMode ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-gray-700" />}
              </button>
            </div>
            <div className="flex">
              <button
                  className={`px-4 py-1.5 text-sm font-medium rounded-l-full ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-[#f5f0e1] hover:bg-opacity-80 text-[#5c4018]"}`}
                  onClick={() => navigate(`/auth?tab=register&type=${userType}`)}
              >
                KAYIT
              </button>
              <button
                  className={`px-4 py-1.5 text-sm font-medium rounded-r-full ${darkMode ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-white hover:bg-opacity-80 text-[#5c4018]"}`}
                  onClick={() => navigate(`/auth?tab=login&type=${userType}`)}
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

        {/* Forgot Password Form */}
        <div className="flex-grow flex justify-center items-start p-4">
          <div className={`w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-md`}>
            <h2 className={`text-center text-xl font-semibold ${darkMode ? "text-yellow-400" : "text-[#5c4018]"} mb-6`}>Şifremi Unuttum</h2>

            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg shadow-sm mb-4"
                >
                  <div className="flex">
                    <div className="py-1">
                      <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 mr-4" />
                    </div>
                    <div>
                      <p className="font-medium">{errorMessage}</p>
                    </div>
                  </div>
                </motion.div>
            )}

            {successMessage && (step === "confirm" || step === "request" && !errorMessage) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-lg shadow-sm mb-4"
                >
                  <div className="flex">
                    <div className="py-1">
                      <CheckCircle className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-4" />
                    </div>
                    <div>
                      <p className="font-medium">{successMessage}</p>
                    </div>
                  </div>
                </motion.div>
            )}


            {step === "request" && (
                <motion.form
                    onSubmit={handleRequestResetLink}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                    Şifrenizi sıfırlamak için hesabınızla ilişkili e-posta adresinizi girin. Size şifrenizi sıfırlamanız
                    için bir bağlantı ve token göndereceğiz.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="email" className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                      Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email adresiniz"
                        className={`${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} rounded-md`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Button
                        type="submit"
                        className={`w-full ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-[#e9c46a] hover:bg-[#e9b949] text-[#5c4018]"} font-medium py-2 rounded-md flex items-center justify-center gap-2`}
                        disabled={isLoading}
                    >
                      {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg
                                className={`animate-spin -ml-1 mr-3 h-5 w-5 ${darkMode ? "text-gray-800" : "text-[#5c4018]"}`}
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
                            İşleniyor...
                          </div>
                      ) : (
                          <>
                            Sıfırlama Bağlantısı Gönder
                            <ArrowRight className="h-4 w-4" />
                          </>
                      )}
                    </Button>
                  </div>

                  <div className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} pt-2`}>
                    <Link
                        to={`/auth?tab=login&type=${userType}`}
                        className={`${darkMode ? "text-yellow-400 hover:underline" : "text-[#5c4018] hover:underline"} font-medium flex items-center justify-center gap-1`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Giriş sayfasına dön
                    </Link>
                  </div>
                </motion.form>
            )}

            {step === "confirm" && (
                <motion.form
                    onSubmit={handleResetPassword}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                    E-postanıza gönderilen token'ı ve yeni şifrenizi girin.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="token" className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                      Onay Token'ı (6 karakter)
                    </Label>
                    <Input
                        id="token"
                        type="text"
                        placeholder="E-postanızdaki token"
                        className={`${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} rounded-md`}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        maxLength={6}
                        required
                        disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                      Yeni Şifre (en az 8 karakter, özel koşullar)
                    </Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="Yeni şifreniz"
                        className={`${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} rounded-md`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                      Yeni Şifre (Tekrar)
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Yeni şifrenizi doğrulayın"
                        className={`${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400" : "bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018]"} rounded-md`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Button
                        type="submit"
                        className={`w-full ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-[#e9c46a] hover:bg-[#e9b949] text-[#5c4018]"} font-medium py-2 rounded-md flex items-center justify-center gap-2`}
                        disabled={isLoading}
                    >
                      {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg
                                className={`animate-spin -ml-1 mr-3 h-5 w-5 ${darkMode ? "text-gray-800" : "text-[#5c4018]"}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sıfırlanıyor...
                          </div>
                      ) : (
                          <>
                            Şifreyi Sıfırla
                            <ArrowRight className="h-4 w-4" />
                          </>
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm pt-2">
                    <button
                        type="button"
                        onClick={() => {
                          setStep("request");
                          setErrorMessage("");
                          setSuccessMessage("");
                          setToken("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className={`${darkMode ? "text-yellow-400 hover:underline" : "text-[#5c4018] hover:underline"} font-medium flex items-center justify-center gap-1 mx-auto`}
                        disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      E-posta adımına dön
                    </button>
                  </div>
                </motion.form>
            )}


            {step === "success" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                  <div className={`bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg shadow-sm`}>
                    <div className="flex">
                      <div className="py-1">
                        <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400 mr-4" />
                      </div>
                      <div>
                        <p className="font-medium">{successMessage}</p>
                      </div>
                    </div>
                  </div>

                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
                  </p>

                  <div className="flex flex-col space-y-3">
                    <Button
                        onClick={() => navigate(`/auth?tab=login&type=${userType}`)}
                        className={`w-full ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-[#e9c46a] hover:bg-[#e9b949] text-[#5c4018]"} font-medium py-2 rounded-md flex items-center justify-center gap-2`}
                    >
                      Giriş Sayfasına Dön
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
            )}
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
            <p className={`text-center text-xs ${darkMode ? "text-gray-500" : "text-gray-500"} mt-6`}>
              © {new Date().getFullYear()} DOY! Food Delivery. Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </div>
  )
}