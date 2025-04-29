"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  Moon,
  Clock,
  Phone,
  Mail,
  MapPin,
  Award,
  Clock3,
  TrendingUp,
  LogOut,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react"
import { motion } from "framer-motion"
import { getRestaurantById } from "../services/profileData"

export default function RestaurantProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const restaurantId = params.id || "1" // Default to ID 1 if no ID is provided
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Restoran verilerini ID'ye göre al
  const [restaurant, setRestaurant] = useState(() => getRestaurantById(restaurantId))
  const [editableData, setEditableData] = useState({
    name: restaurant.name,
    phone: restaurant.phone,
    email: restaurant.email,
    address: restaurant.address,
    workingHours: { ...restaurant.workingHours },
  })
  const [showAlert, setShowAlert] = useState(false)

  // ID değiştiğinde restoran verilerini güncelle
  useEffect(() => {
    if (restaurantId) {
      setRestaurant(getRestaurantById(restaurantId))
    }
  }, [restaurantId])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/")
  }

  const handleManageMenu = () => {
    navigate(`/restaurants/manage/${restaurantId}`)
  }

  const handleUpdateProfile = () => {
    // Check if any changes were made
    const hasChanges =
      editableData.name !== restaurant.name ||
      editableData.phone !== restaurant.phone ||
      editableData.email !== restaurant.email ||
      editableData.address !== restaurant.address ||
      JSON.stringify(editableData.workingHours) !== JSON.stringify(restaurant.workingHours)

    if (hasChanges) {
      // In a real application, this would send the updated data to an API
      setRestaurant({
        ...restaurant,
        name: editableData.name,
        phone: editableData.phone,
        email: editableData.email,
        address: editableData.address,
        workingHours: editableData.workingHours,
      })

      // Show alertify notification
      setShowAlert(true)

      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
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
      className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c] text-gray-100" : "bg-[#F2E8D6]"} transition-colors duration-300`}
    >
      {/* Header section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? "bg-[#333]" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center shadow-md`}
      >
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="flex items-center gap-2">
              <motion.img
                src="/image1.png"
                alt="Doy Logo"
                className="h-8 w-8 rounded-full bg-white p-1"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              Doy!
            </span>
          </motion.div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2 cursor-pointer">
              <div className="w-[34px] h-[18px] rounded-full bg-[#F8F5DE] relative">
                <div
                  className="w-[16px] h-[16px] rounded-full bg-[#000] absolute top-[1px]"
                  style={{
                    left: darkMode ? "17px" : "1px",
                    transition: "left 0.3s",
                  }}
                />
              </div>
              <Moon className={`h-4 w-4 ${darkMode ? "text-[#F8F5DE]" : "text-[#F8F5DE]"}`} />
            </div>
          </div>
          <Link to={`/restaurants/manage/${restaurantId}`}>
            <span
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-amber-600 hover:bg-amber-700"
              } transition-colors`}
            >
              Restoranı Yönet
            </span>
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
          className={`rounded-full ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg transition-colors duration-300`}
        >
          <div className="relative w-24 h-24 flex flex-col items-center">
            <img
              src={restaurant.profileImage || "/image1.png"}
              alt={`${restaurant.name} logo`}
              className="w-full h-full object-cover rounded-full"
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
          className={`w-full max-w-5xl ${darkMode ? "bg-[#2c2c2c] border border-gray-700" : "bg-white"} rounded-lg p-8 shadow-lg transition-colors duration-300`}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#6b4b10]"} text-center mb-2`}
          >
            Hesap Profilim - Restoran
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`text-xl ${darkMode ? "text-amber-400" : "text-[#6b4b10]"} text-center mb-6`}
          >
            {restaurant.name}
          </motion.h2>

          {/* Manage Menu Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleManageMenu}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Menüyü Yönet
            </Button>
          </motion.div>

          {/* Cuisine Types */}
          <motion.div variants={container} initial="hidden" animate={isLoaded ? "show" : "hidden"} className="mb-6">
            <motion.label
              variants={item}
              className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}
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
                    className={`${darkMode ? "bg-gray-700 text-purple-300 border-gray-600" : "bg-amber-100 text-[#6b4b10] border-amber-200"} px-3 py-1 transition-colors duration-200`}
                  >
                    {cuisine}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Performance Statistics */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className={`${darkMode ? "bg-[#333]" : "bg-[#F2E8D6]"} rounded-lg p-4 mb-6 transition-colors duration-300`}
          >
            <motion.h2
              variants={item}
              className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-200" : "text-[#6b4b10]"}`}
            >
              Performans İstatistikleri
            </motion.h2>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                variants={item}
                whileHover={{ y: -5 }}
                className={`${darkMode ? "bg-[#2c2c2c] border border-gray-700" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm transition-all duration-200`}
              >
                <Award className={`h-5 w-5 mb-2 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#6b4b10]"}`}>
                  {restaurant.stats.monthlyOrders}
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Aylık Sipariş</div>
              </motion.div>

              <motion.div
                variants={item}
                whileHover={{ y: -5 }}
                className={`${darkMode ? "bg-[#2c2c2c] border border-gray-700" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm transition-all duration-200`}
              >
                <TrendingUp className={`h-5 w-5 mb-2 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#6b4b10]"}`}>
                  {restaurant.stats.onTimeDelivery}
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Zamanında Teslimat</div>
              </motion.div>

              <motion.div
                variants={item}
                whileHover={{ y: -5 }}
                className={`${darkMode ? "bg-[#2c2c2c] border border-gray-700" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm transition-all duration-200`}
              >
                <Clock3 className={`h-5 w-5 mb-2 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#6b4b10]"}`}>
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
            className="space-y-5 mb-8 w-full max-w-4xl mx-auto"
          >
            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Restoran Adı
              </label>
              <div className="flex group">
                <input
                  type="text"
                  value={editableData.name}
                  onChange={(e) => setEditableData({ ...editableData, name: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border rounded-md py-3 px-4 text-sm transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Telefon
              </label>
              <div className="flex group">
                <div
                  className={`flex items-center ${
                    darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"
                  } border rounded-l-md py-3 px-4`}
                >
                  <Phone className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-[#6b4b10]"} mr-2`} />
                </div>
                <input
                  type="text"
                  value={editableData.phone}
                  onChange={(e) => setEditableData({ ...editableData, phone: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border-y border-r py-3 px-4 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Email
              </label>
              <div className="flex group">
                <div
                  className={`flex items-center ${
                    darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"
                  } border rounded-l-md py-3 px-4`}
                >
                  <Mail className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-[#6b4b10]"} mr-2`} />
                </div>
                <input
                  type="email"
                  value={editableData.email}
                  onChange={(e) => setEditableData({ ...editableData, email: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border-y border-r py-3 px-4 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Adres
              </label>
              <div className="flex group">
                <div
                  className={`flex items-center ${
                    darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"
                  } border rounded-l-md py-3 px-4`}
                >
                  <MapPin className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-[#6b4b10]"} mr-2`} />
                </div>
                <input
                  type="text"
                  value={editableData.address}
                  onChange={(e) => setEditableData({ ...editableData, address: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border-y border-r py-3 px-4 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            {/* Success message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`${
                  darkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
                } p-3 rounded-md text-sm text-center`}
              >
                Profil başarıyla güncellendi!
              </motion.div>
            )}
          </motion.div>

          {/* Working Hours */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className="mb-8 w-full max-w-4xl mx-auto"
          >
            <motion.h3
              variants={item}
              className={`text-lg font-medium ${darkMode ? "text-amber-400" : "text-[#6b4b10]"} mb-3 flex items-center`}
            >
              <Clock className="h-5 w-5 mr-2" /> Çalışma Saatleri
            </motion.h3>
            <motion.div
              variants={item}
              className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${darkMode ? "text-gray-300" : "text-[#6b4b10]"}`}
            >
              {Object.entries(editableData.workingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className={`${darkMode ? "bg-[#2c2c2c] border-gray-700" : "bg-white border-amber-100"} border rounded-md p-3 text-sm`}
                >
                  <div className="font-medium mb-1">{day}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-xs ${darkMode ? "text-gray-400" : "text-[#6b4b10]"}`}>Açılış</label>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => {
                          const updatedHours = { ...editableData.workingHours }
                          updatedHours[day] = { ...hours, open: e.target.value }
                          setEditableData({ ...editableData, workingHours: updatedHours })
                        }}
                        className={`w-full ${
                          darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-white border-amber-100"
                        } border rounded-md py-2 px-2 text-xs transition-colors duration-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${darkMode ? "text-gray-400" : "text-[#6b4b10]"}`}>Kapanış</label>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => {
                          const updatedHours = { ...editableData.workingHours }
                          updatedHours[day] = { ...hours, close: e.target.value }
                          setEditableData({ ...editableData, workingHours: updatedHours })
                        }}
                        className={`w-full ${
                          darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-white border-amber-100"
                        } border rounded-md py-2 px-2 text-xs transition-colors duration-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className="flex flex-col gap-4"
          >
            <motion.button
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateProfile}
              className={`py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                darkMode
                  ? "bg-amber-500 hover:bg-amber-600 text-gray-900"
                  : "bg-amber-400 hover:bg-amber-500 text-amber-900"
              }`}
            >
              Profili Güncelle
            </motion.button>

            <motion.button
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className={`py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                darkMode ? "border border-gray-600 text-gray-300" : "border border-gray-300 text-gray-600"
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        className={`mt-8 p-8 flex justify-between items-center ${darkMode ? "bg-[#1a1a1a]" : "bg-white"} transition-colors duration-300`}
      >
        <img src="/image1.png" alt="DOY Logo" className="h-[50px] w-[50px] rounded-full object-cover" />

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

      {/* Alertify notification */}
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50"
        >
          <div
            className={`${
              darkMode ? "bg-green-700 text-green-100" : "bg-green-500 text-white"
            } p-4 rounded-md shadow-lg flex items-center justify-between`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Profil başarıyla güncellendi!</span>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
