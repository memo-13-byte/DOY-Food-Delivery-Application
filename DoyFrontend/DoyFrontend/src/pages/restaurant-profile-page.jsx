import { useState, useEffect } from "react"
import { Link, useLocation } from "wouter"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Badge } from "../components/ui/badge"
import { Moon, Edit2, Clock, Phone, Mail, MapPin, Award, Clock3, TrendingUp, LogOut } from "lucide-react"
import { motion } from "framer-motion"

export default function RestaurantProfilePage() {
  const [location, setLocation] = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Mock restaurant data
  const [restaurant, setRestaurant] = useState({
    name: "Restoran Adı",
    phone: "Restoranın Telefon Numarası",
    email: "Restoranın Email Adresi",
    address: "Restoranın Adresi",
    cuisineTypes: ["Türk", "Kebap", "Izgara", "Yöre ete"],
    workingHours: {
      Pazartesi: { open: "10:00", close: "22:00" },
      Salı: { open: "10:00", close: "22:00" },
      Çarşamba: { open: "10:00", close: "22:00" },
      Perşembe: { open: "10:00", close: "22:00" },
      Cuma: { open: "10:00", close: "23:00" },
      Cumartesi: { open: "10:00", close: "23:00" },
      Pazar: { open: "12:00", close: "22:00" },
    },
    stats: {
      monthlyOrders: 152,
      avgPrepTime: "18dk",
      onTimeDelivery: "95%",
    },
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleLogout = () => {
    // Handle logout logic here
    setLocation("/")
  }

  const handleManageMenu = () => {
    setLocation("/restaurants/manage")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"} transition-colors duration-300`}
    >
      {/* Header section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? "bg-gray-800" : "bg-[#47300A] from-amber-800 to-amber-600"} text-white py-3 px-6 flex justify-between items-center shadow-md`}
      >
        <div className="flex items-center">
          <Link href="/">
            <motion.span whileHover={{ scale: 1.05 }} className="font-bold text-xl tracking-wide">
              Doy!
            </motion.span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className={`${darkMode ? "data-[state=checked]:bg-purple-400" : "data-[state=checked]:bg-amber-200"}`}
            />
            <Moon className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-amber-200"}`} />
          </div>
          <Link href="/auth?tab=register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${darkMode ? "bg-purple-500 text-white" : "bg-amber-200 text-amber-800"} rounded-full px-5 py-1.5 text-xs font-medium transition-colors duration-200`}
            >
              KAYIT
            </motion.button>
          </Link>
          <Link href="/auth?tab=login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-amber-800"} rounded-full px-5 py-1.5 text-xs font-medium transition-colors duration-200`}
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
          whileHover={{ scale: 1.05, rotate: 5 }}
          className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg transition-colors duration-300`}
        >
          <div className="relative w-24 h-24">
            <img
              src="/image1.png"
              alt="DOY Logo"
              width={96}
              height={96}
              className="w-full h-full"
            />
            <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              FOOD DELIVERY
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile Content */}
      <div className="flex-grow flex justify-center items-start px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`w-full max-w-3xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-lg p-6 shadow-lg transition-colors duration-300`}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-amber-800"} text-center mb-6`}
          >
            Hesap Profilim - Restoran
          </motion.h1>

          {/* Manage Menu Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleManageMenu}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Menüyü Yönet
            </Button>
          </motion.div>

          {/* Performance Statistics */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 mb-6 transition-colors duration-300`}
          >
            <motion.h2 variants={item} className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-200" : ""}`}>
              Performans İstatistikleri
            </motion.h2>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                variants={item}
                whileHover={{ y: -5 }}
                className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm transition-all duration-200`}
              >
                <Award className={`h-5 w-5 mb-2 ${darkMode ? "text-purple-400" : "text-amber-500"}`} />
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-amber-800"}`}>
                  {restaurant.stats.monthlyOrders}
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Aylık Sipariş</div>
              </motion.div>

              <motion.div
                variants={item}
                whileHover={{ y: -5 }}
                className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm transition-all duration-200`}
              >
                <TrendingUp className={`h-5 w-5 mb-2 ${darkMode ? "text-purple-400" : "text-amber-500"}`} />
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-amber-800"}`}>
                  {restaurant.stats.onTimeDelivery}
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Zamanında Teslimat</div>
              </motion.div>

              <motion.div
                variants={item}
                whileHover={{ y: -5 }}
                className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm transition-all duration-200`}
              >
                <Clock3 className={`h-5 w-5 mb-2 ${darkMode ? "text-purple-400" : "text-amber-500"}`} />
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-amber-800"}`}>
                  {restaurant.stats.avgPrepTime}
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Ort. Hazırlama Süresi</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Restaurant Information */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className="space-y-4 mb-6"
          >
            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                Restoran Adı
              </label>
              <div className="flex group">
                <input
                  type="text"
                  value={restaurant.name}
                  readOnly
                  className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-colors duration-200`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-amber-50 border-amber-100 hover:bg-amber-100"} border border-l-0 rounded-r-md px-3 transition-colors duration-200`}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Telefon</label>
              <div className="flex group">
                <div
                  className={`flex items-center ${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3`}
                >
                  <Phone className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"} mr-2`} />
                </div>
                <input
                  type="text"
                  value={restaurant.phone}
                  readOnly
                  className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border-y border-r-0 py-2 px-3 text-sm transition-colors duration-200`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-amber-50 border-amber-100 hover:bg-amber-100"} border border-l-0 rounded-r-md px-3 transition-colors duration-200`}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Email</label>
              <div className="flex group">
                <div
                  className={`flex items-center ${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3`}
                >
                  <Mail className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"} mr-2`} />
                </div>
                <input
                  type="email"
                  value={restaurant.email}
                  readOnly
                  className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border-y border-r-0 py-2 px-3 text-sm transition-colors duration-200`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-amber-50 border-amber-100 hover:bg-amber-100"} border border-l-0 rounded-r-md px-3 transition-colors duration-200`}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Adres</label>
              <div className="flex group">
                <div
                  className={`flex items-center ${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3`}
                >
                  <MapPin className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"} mr-2`} />
                </div>
                <input
                  type="text"
                  value={restaurant.address}
                  readOnly
                  className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border-y border-r-0 py-2 px-3 text-sm transition-colors duration-200`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-amber-50 border-amber-100 hover:bg-amber-100"} border border-l-0 rounded-r-md px-3 transition-colors duration-200`}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Cuisine Types */}
          <motion.div variants={container} initial="hidden" animate={isLoaded ? "show" : "hidden"} className="mb-6">
            <motion.label
              variants={item}
              className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              Mutfak Türleri
            </motion.label>
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {restaurant.cuisineTypes.map((cuisine, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                >
                  <Badge
                    variant="outline"
                    className={`${darkMode ? "bg-gray-700 text-purple-300 border-gray-600" : "bg-amber-100 text-amber-800 border-amber-200"} px-3 py-1 transition-colors duration-200`}
                  >
                    {cuisine}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Working Hours */}
          <motion.div variants={container} initial="hidden" animate={isLoaded ? "show" : "hidden"} className="mb-6">
            <motion.label
              variants={item}
              className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Çalışma Saatleri
              </div>
            </motion.label>
            <motion.div
              variants={item}
              className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 transition-colors duration-200`}
            >
              {Object.entries(restaurant.workingHours).map(([day, hours], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`flex justify-between py-2 ${darkMode ? "border-gray-600" : "border-amber-100"} border-b last:border-0`}
                >
                  <span className={`text-sm ${darkMode ? "text-gray-300" : ""}`}>{day}</span>
                  <div className="flex items-center">
                    <span className={`text-sm ${darkMode ? "text-gray-300" : ""}`}>{hours.open}</span>
                    <span className={`mx-2 ${darkMode ? "text-gray-500" : "text-amber-300"}`}>-</span>
                    <span className={`text-sm ${darkMode ? "text-gray-300" : ""}`}>{hours.close}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Update Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-4">
            <Button
              className={`w-full ${darkMode ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-amber-800"} font-medium py-6 shadow-md transition-all duration-200`}
            >
              Güncelle
            </Button>
          </motion.div>

          {/* Logout Link */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full text-center py-3 flex items-center justify-center gap-2 ${darkMode ? "border-gray-700 text-gray-400 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"} border rounded-md transition-colors duration-200`}
          >
            <LogOut className="h-4 w-4" />
            Hesabımdan Çıkış Yap
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-200"} p-6 border-t transition-colors duration-300`}
      >
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`rounded-full ${darkMode ? "bg-gray-700" : "bg-white"} p-2 w-16 h-16 flex items-center justify-center shadow-md transition-colors duration-200`}
          >
            <div className="relative w-12 h-12">
              <img
                src="/image1.png"
                alt="DOY Logo"
                width={48}
                height={48}
                className="w-full h-full"
              />
              <div className={`text-center text-[8px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                FOOD DELIVERY
              </div>
            </div>
          </motion.div>
        </div>
        <div className="flex justify-center gap-8">
          <motion.a
            whileHover={{ y: -5, scale: 1.2 }}
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-amber-600"} transition-colors duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </motion.a>
          <motion.a
            whileHover={{ y: -5, scale: 1.2 }}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-amber-600"} transition-colors duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            whileHover={{ y: -5, scale: 1.2 }}
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-amber-600"} transition-colors duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            whileHover={{ y: -5, scale: 1.2 }}
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-amber-600"} transition-colors duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
      </motion.footer>
    </div>
  )
}
