import { useState, useEffect } from "react"
import { Link, useLocation } from "wouter"
import { Moon, Edit2, AlertTriangle, User, Phone, Mail, MapPin, LogOut, Check, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function CustomerProfilePage() {
  const [location, setLocation] = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoaded, setIsLoaded] = useState(false)

  // Mock kullanıcı bilgileri - normalde bu API'den veya başka bir state yönetim aracından gelir
  const [user, setUser] = useState({
    name: "Ahmet Yılmaz",
    email: "test@example.com",
    phone: "+90 555 123 4567",
    address: "Cumhuriyet Mah. Atatürk Cad. No:123 Daire:4, İstanbul",
  })

  // Form state for profile update
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // State for allergens
  const [allergens, setAllergens] = useState({
    1: false,
    2: false,
    3: true,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: true,
  })

  // Animation effect when page loads
  useEffect(() => {
    console.log(localStorage.getItem("token")) //display token
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Burada normalde API'ye istek gönderirsiniz
    setUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    })

    // Animation for success notification
    const notification = document.getElementById("success-notification")
    notification.classList.remove("translate-y-20", "opacity-0")
    notification.classList.add("translate-y-0", "opacity-100")

    setTimeout(() => {
      notification.classList.add("translate-y-20", "opacity-0")
      notification.classList.remove("translate-y-0", "opacity-100")
    }, 3000)
  }

  const handleAllergenChange = (id) => {
    setAllergens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const selectedAllergens = Object.entries(allergens)
    .filter(([_, selected]) => selected)
    .map(([id]) => Number.parseInt(id))

  const handleLogout = () => {
    // Çıkış işlemleri - token temizleme vs.
    setLocation("/")
  }

  // Mock sipariş geçmişi - normalde API'den gelir
  const pastOrders = [
    { id: "ORD-1234", date: "10.04.2025", restaurant: "Kebapçı Mehmet", status: "Teslim Edildi", total: "₺120" },
    { id: "ORD-1233", date: "08.04.2025", restaurant: "Pizza Evi", status: "Teslim Edildi", total: "₺95" },
    { id: "ORD-1232", date: "05.04.2025", restaurant: "Çiğköfteci Ali", status: "Teslim Edildi", total: "₺45" },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100"} transition-colors duration-300`}
    >
      {/* Success Notification */}
      <div
        id="success-notification"
        className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg transform translate-y-20 opacity-0 transition-all duration-500 z-50"
      >
        <div className="flex items-center">
          <div className="py-1">
            <Check className="h-6 w-6 text-green-500 mr-3" />
          </div>
          <div>
            <p className="font-bold">Başarılı!</p>
            <p className="text-sm">Profil bilgileriniz güncellendi.</p>
          </div>
        </div>
      </div>

      {/* Header section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? "bg-gray-800" : "bg-[#47300A] from-amber-700 to-amber-600"} text-white py-3 px-6 flex justify-between items-center shadow-md`}
      >
        <div className="flex items-center">
          <Link href="/">
            <span className="font-bold text-xl tracking-wide hover:text-amber-200 transition-colors duration-200">
              Doy!
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Replace Switch component with a simple button for dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-5 rounded-full flex items-center ${darkMode ? "bg-amber-400 justify-end" : "bg-gray-300 justify-start"} p-1 transition-all duration-300`}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </button>
            <Moon className="h-4 w-4 text-amber-200" />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full w-10 h-10 ${darkMode ? "bg-amber-400" : "bg-amber-500"} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`}
          >
            <span className="text-white text-sm font-medium">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </motion.button>
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
            <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-amber-400" : "text-amber-800"}`}>
              FOOD DELIVERY
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile Content */}
      <div className="flex-grow flex justify-center items-start px-4 pb-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`w-full max-w-3xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-6 shadow-xl`}
        >
          <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}>
            Hesap Profilim - Müşteri
          </h1>

          {/* Tabs */}
          <div className="mb-6">
            <div
              className={`grid w-full grid-cols-2 rounded-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-amber-100"}`}
            >
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-4 text-center transition-colors duration-200 ${
                  activeTab === "profile"
                    ? darkMode
                      ? "bg-gray-600 text-amber-400"
                      : "bg-amber-300 text-amber-900"
                    : ""
                }`}
              >
                Profil Bilgileri
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-2 px-4 text-center transition-colors duration-200 ${
                  activeTab === "orders"
                    ? darkMode
                      ? "bg-gray-600 text-amber-400"
                      : "bg-amber-300 text-amber-900"
                    : ""
                }`}
              >
                Siparişlerim
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "profile" && (
                <motion.div variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"}>
                  {/* Personal Information */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1 flex items-center`}
                      >
                        <User className="h-4 w-4 mr-2" /> Ad Soyad
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                        />
                        <button
                          className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
                        >
                          <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1 flex items-center`}
                      >
                        <Phone className="h-4 w-4 mr-2" /> Telefon
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                        />
                        <button
                          className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
                        >
                          <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1 flex items-center`}
                      >
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </label>
                      <div className="flex">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                        />
                        <button
                          className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
                        >
                          <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1 flex items-center`}
                      >
                        <MapPin className="h-4 w-4 mr-2" /> Adres
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                        />
                        <button
                          className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
                        >
                          <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Delivery Preference */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}>
                      Beslenme Tercihi
                    </label>
                    <div className="flex gap-4">
                      <div
                        className={`flex items-center space-x-2 p-3 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-amber-50"} transition-colors duration-200`}
                      >
                        <input
                          type="radio"
                          id="normal"
                          name="diet"
                          value="normal"
                          defaultChecked
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <label htmlFor="normal" className="text-sm">
                          Normal
                        </label>
                      </div>
                      <div
                        className={`flex items-center space-x-2 p-3 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-amber-50"} transition-colors duration-200`}
                      >
                        <input
                          type="radio"
                          id="yasam"
                          name="diet"
                          value="yasam"
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <label htmlFor="yasam" className="text-sm">
                          Vegan
                        </label>
                      </div>
                    </div>
                  </motion.div>

                  {/* Allergens */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-500"} mr-2`} />
                      <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Alerjenler
                      </label>
                    </div>

                    <div
                      className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 transition-colors duration-200`}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((id) => (
                            <motion.div
                              key={id}
                              className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                              whileHover={{ x: 5 }}
                            >
                              <input
                                type="checkbox"
                                id={`allergen-${id}`}
                                checked={allergens[id]}
                                onChange={() => handleAllergenChange(id)}
                                className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                              />
                              <label htmlFor={`allergen-${id}`} className="text-sm">
                                Alerjen {id}
                              </label>
                            </motion.div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          {[6, 7, 8, 9].map((id) => (
                            <motion.div
                              key={id}
                              className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                              whileHover={{ x: 5 }}
                            >
                              <input
                                type="checkbox"
                                id={`allergen-${id}`}
                                checked={allergens[id]}
                                onChange={() => handleAllergenChange(id)}
                                className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                              />
                              <label htmlFor={`allergen-${id}`} className="text-sm">
                                Alerjen {id}
                              </label>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Selected Allergens */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedAllergens.map((id) => (
                        <motion.div
                          key={id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              darkMode
                                ? "bg-red-900 text-red-100 border border-red-800"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            Alerjen {id}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Update Button */}
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleProfileUpdate}
                      className={`w-full py-2 px-4 rounded-md font-medium mb-4 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        darkMode
                          ? "bg-amber-500 hover:bg-amber-600 text-gray-900"
                          : "bg-amber-400 hover:bg-amber-500 text-amber-900"
                      }`}
                    >
                      Güncelle
                    </button>
                  </motion.div>

                  {/* Logout Link */}
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-center py-2 border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"} rounded-md transition-colors duration-200 flex items-center justify-center gap-2`}
                    >
                      <LogOut className="h-4 w-4" />
                      Hesabımdan Çıkış Yap
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 ${darkMode ? "bg-amber-400" : "bg-red-500"} rounded-full mr-2`}></div>
                    <span className={`text-sm font-medium ${darkMode ? "text-amber-300" : ""}`}>
                      Son Siparişleriniz
                    </span>
                  </div>

                  {pastOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className={`border-b ${darkMode ? "border-gray-600" : "border-amber-100"} py-4 flex justify-between items-center`}
                    >
                      <div>
                        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Restoran Adı</div>
                        <div className="text-sm font-medium">{order.restaurant}</div>
                        <div className={`text-xs ${darkMode ? "text-amber-400" : "text-amber-600"} mt-1`}>
                          {order.total}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>
                          {order.date}
                        </span>
                        <div
                          className={`flex items-center px-3 py-1 rounded-full ${darkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800"}`}
                        >
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="text-xs">{order.status}</span>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-amber-400"}`} />
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants} className="mt-4">
                    <button
                      className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-600 hover:bg-gray-500 text-white"
                          : "bg-amber-200 hover:bg-amber-300 text-amber-900"
                      }`}
                    >
                      Tüm Siparişleri Görüntüle
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
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
                  className={`text-center text-[8px] font-bold mt-1 ${darkMode ? "text-amber-400" : "text-gray-600"}`}
                >
                  FOOD DELIVERY
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex gap-6">
            {[
              {
                href: "https://twitter.com",
                path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
              },
              {
                href: "https://instagram.com",
                path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
                rect: { width: 20, height: 20, x: 2, y: 2, rx: 5, ry: 5 },
                line: { x1: 17.5, x2: 17.51, y1: 6.5, y2: 6.5 },
              },
              {
                href: "https://youtube.com",
                path: [
                  "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
                  "m10 15 5-3-5-3z",
                ],
              },
              {
                href: "https://linkedin.com",
                path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                rect: { width: 4, height: 12, x: 2, y: 9 },
                circle: { cx: 4, cy: 4, r: 2 },
              },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${darkMode ? "text-gray-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-800"} transition-colors duration-200`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
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
                  {social.rect && (
                    <rect
                      width={social.rect.width}
                      height={social.rect.height}
                      x={social.rect.x}
                      y={social.rect.y}
                      rx={social.rect.rx}
                      ry={social.rect.ry}
                    />
                  )}
                  {social.circle && <circle cx={social.circle.cx} cy={social.circle.cy} r={social.circle.r} />}
                  {Array.isArray(social.path) ? (
                    social.path.map((p, i) => <path key={i} d={p} />)
                  ) : (
                    <path d={social.path} />
                  )}
                  {social.line && (
                    <line x1={social.line.x1} x2={social.line.x2} y1={social.line.y1} y2={social.line.y2} />
                  )}
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
        <div className={`text-center mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          © 2025 Doy! Food Delivery. Tüm hakları saklıdır.
        </div>
      </motion.footer>
    </div>
  )
}
