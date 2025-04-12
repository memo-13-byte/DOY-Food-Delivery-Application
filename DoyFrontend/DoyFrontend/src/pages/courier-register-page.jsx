import React from "react"
import { useState, useEffect } from "react"
import { Link } from "wouter"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Moon, Upload, Sun, ChevronDown, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function CourierRegisterPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formComplete, setFormComplete] = useState(false)
  const [fileSelected, setFileSelected] = useState(false)

  // Toggle body class for dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileSelected(e.target.files && e.target.files.length > 0)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setFormComplete(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"}`}
    >
      {/* Header section */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? "bg-gray-800" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center shadow-md`}
      >
        <div className="flex items-center">
          <Link href="/">
            <motion.span whileHover={{ scale: 1.05 }} className="font-bold text-xl tracking-tight">
              Doy!
            </motion.span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className={`${darkMode ? "data-[state=checked]:bg-amber-400" : "data-[state=checked]:bg-amber-200"}`}
            />
            {darkMode ? <Sun className="h-4 w-4 text-amber-200" /> : <Moon className="h-4 w-4 text-amber-200" />}
          </div>
          <Link href="/auth?tab=register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${darkMode ? "bg-amber-400" : "bg-amber-200"} text-amber-800 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 hover:shadow-md`}
            >
              KAYIT
            </motion.button>
          </Link>
          <Link href="/auth?tab=login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${darkMode ? "bg-gray-700" : "bg-white"} text-amber-800 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 hover:shadow-md`}
            >
              GİRİŞ
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Logo section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center py-8"
      >
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg`}
        >
          <div className="relative w-24 h-24">
            <img
              src="/image1.png"
              alt="DOY Logo"
              width={96}
              height={96}
              className="w-full h-full"
            />
            <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              FOOD DELIVERY
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      {!formComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center w-full max-w-md px-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 relative">
                <div className={`w-full flex items-center ${step < 3 ? "justify-between" : "justify-start"}`}>
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep >= step ? 1.1 : 1,
                      backgroundColor:
                        currentStep >= step
                          ? darkMode
                            ? "rgb(251 191 36)"
                            : "rgb(217 119 6)"
                          : darkMode
                            ? "rgb(75 85 99)"
                            : "rgb(243 244 246)",
                    }}
                    className={`rounded-full h-8 w-8 flex items-center justify-center z-10 
                      ${
                        currentStep >= step
                          ? darkMode
                            ? "bg-amber-400 text-gray-900"
                            : "bg-amber-600 text-white"
                          : darkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </motion.div>
                  {step < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded ${
                        currentStep > step
                          ? darkMode
                            ? "bg-amber-400"
                            : "bg-amber-600"
                          : darkMode
                            ? "bg-gray-600"
                            : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`text-xs mt-1 text-center ${
                    currentStep === step
                      ? darkMode
                        ? "text-amber-400 font-medium"
                        : "text-amber-700 font-medium"
                      : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}
                >
                  {step === 1 ? "Kişisel Bilgiler" : step === 2 ? "İletişim Bilgileri" : "Kurye Bilgileri"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Registration Form */}
      <div className="flex-grow flex justify-center items-start px-4 pb-12">
        {formComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-8 shadow-lg text-center`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className={`mx-auto w-20 h-20 rounded-full ${darkMode ? "bg-gray-700" : "bg-green-50"} flex items-center justify-center mb-6`}
            >
              <CheckCircle2 className={`h-12 w-12 ${darkMode ? "text-green-400" : "text-green-500"}`} />
            </motion.div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-amber-800"}`}>Kayıt Başarılı!</h2>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Kurye başvurunuz alınmıştır. Başvurunuz incelendikten sonra sizinle iletişime geçeceğiz.
            </p>
            <Link href="/">
              <Button
                className={`${darkMode ? "bg-amber-500 hover:bg-amber-600" : "bg-amber-600 hover:bg-amber-700"} text-white font-medium`}
              >
                Ana Sayfaya Dön
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-md ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-lg p-6 shadow-lg`}
          >
            <h1 className={`text-xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}>
              Hesap Oluştur - Kurye
            </h1>

            <form className="space-y-4">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="username" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                        Kullanıcı Adı
                      </Label>
                      <Input
                        id="username"
                        placeholder="Kullanıcı Adı"
                        className={`${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                            : "bg-amber-50 border-amber-100 focus:border-amber-300"
                        } focus:ring-amber-200`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                        Ad
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Ad"
                        className={`${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                            : "bg-amber-50 border-amber-100 focus:border-amber-300"
                        } focus:ring-amber-200`}
                      />
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="lastName" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Soyad
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Soyad"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="email" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email adresiniz"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="password" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Şifre
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Şifreniz"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}
                    >
                      Şifre Tekrar
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Şifrenizi tekrar girin"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                  className="space-y-4"
                >
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="phone" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Telefon numaranız"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="address" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Adres
                    </Label>
                    <Input
                      id="address"
                      placeholder="Adresiniz"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="idNumber" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      T.C. Kimlik No
                    </Label>
                    <Input
                      id="idNumber"
                      placeholder="T.C. Kimlik Numaranız"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                  className="space-y-4"
                >
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="vehicleType" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Araç Tipi
                    </Label>
                    <Select>
                      <SelectTrigger
                        className={`${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                            : "bg-amber-50 border-amber-100 focus:border-amber-300"
                        } focus:ring-amber-200`}
                      >
                        <SelectValue placeholder="Motorsiklet" />
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
                        <SelectItem value="motorcycle">Motorsiklet</SelectItem>
                        <SelectItem value="car">Araba</SelectItem>
                        <SelectItem value="bicycle">Bisiklet</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="licensePlate" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Plaka (Bağımsız Kurye için)
                    </Label>
                    <Input
                      id="licensePlate"
                      placeholder="Araç Plakası"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                          : "bg-amber-50 border-amber-100 focus:border-amber-300"
                      } focus:ring-amber-200`}
                    />
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="license" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Ehliyet
                    </Label>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} 
                        ${fileSelected ? (darkMode ? "border-green-500" : "border-green-500") : ""} 
                        border rounded-md p-8 flex flex-col items-center justify-center transition-colors duration-300`}
                    >
                      <Upload className={`h-10 w-10 ${darkMode ? "text-gray-400" : "text-gray-400"} mb-2`} />
                      <p className={`text-sm font-medium text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {fileSelected ? "Dosya Seçildi" : "Ehliyet Yükle"}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} text-center mt-1`}>
                        PDF, JPG veya PNG formatında
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="license"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`mt-4 ${
                          darkMode
                            ? "bg-gray-800 border-amber-500 text-amber-400 hover:bg-gray-700"
                            : "bg-white border-amber-200 text-amber-800 hover:bg-amber-100"
                        }`}
                        onClick={() => document.getElementById("license")?.click()}
                      >
                        Dosya Seç
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="workSchedule" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Çalışma Şekli
                    </Label>
                    <Select>
                      <SelectTrigger
                        className={`${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                            : "bg-amber-50 border-amber-100 focus:border-amber-300"
                        } focus:ring-amber-200`}
                      >
                        <SelectValue placeholder="Tam Zamanlı" />
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
                        <SelectItem value="fulltime">Tam Zamanlı</SelectItem>
                        <SelectItem value="parttime">Yarı Zamanlı</SelectItem>
                        <SelectItem value="weekend">Hafta Sonu</SelectItem>
                        <SelectItem value="flexible">Esnek Çalışma</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                    <Label htmlFor="experience" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Deneyim (Yıl)
                    </Label>
                    <div className="flex">
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        defaultValue="0"
                        className={`${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-amber-500 text-white"
                            : "bg-amber-50 border-amber-100 focus:border-amber-300"
                        } focus:ring-amber-200`}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                        : "bg-white border-amber-200 text-amber-800 hover:bg-amber-50"
                    }`}
                  >
                    Geri
                  </Button>
                ) : (
                  <div></div>
                )}

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`${
                      darkMode
                        ? "bg-amber-500 hover:bg-amber-600 text-amber-950"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    } font-medium`}
                  >
                    {currentStep < 3 ? "Devam Et" : "Kayıt Ol"}
                  </Button>
                </motion.div>
              </div>

              {currentStep === 1 && (
                <div className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-4`}>
                  Zaten bir hesabınız var mı?{" "}
                  <Link
                    href="/auth?tab=login&type=courier"
                    className={`${darkMode ? "text-amber-400" : "text-amber-800"} hover:underline`}
                  >
                    Giriş yap
                  </Link>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`${darkMode ? "bg-gray-800 border-t border-gray-700" : "bg-amber-50 border-t border-amber-200"} p-6`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <motion.div
              whileHover={{ rotate: 5 }}
              className={`rounded-full ${darkMode ? "bg-gray-700" : "bg-white"} p-4 w-20 h-20 flex items-center justify-center shadow-md`}
            >
              <div className="relative w-16 h-16">
                <img
                  src="/image1.png"
                  alt="DOY Logo"
                  width={64}
                  height={64}
                  className="w-full h-full"
                />
                <div
                  className={`text-center text-[8px] font-bold mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  FOOD DELIVERY
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex gap-6">
            <motion.a
              whileHover={{ y: -3, scale: 1.1 }}
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-800"} transition-colors duration-300`}
            >
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
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </motion.a>
            <motion.a
              whileHover={{ y: -3, scale: 1.1 }}
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-800"} transition-colors duration-300`}
            >
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
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </motion.a>
            <motion.a
              whileHover={{ y: -3, scale: 1.1 }}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${darkMode ? "text-gray-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-800"} transition-colors duration-300`}
            >
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
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </motion.a>
          </div>
        </div>
        <div className={`text-center mt-4 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
          © {new Date().getFullYear()} Doy! Food Delivery. Tüm hakları saklıdır.
        </div>
      </motion.footer>
    </div>
  )
}
