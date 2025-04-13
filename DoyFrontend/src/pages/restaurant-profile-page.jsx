import { useState, useEffect } from "react"
import { Link, useLocation, useParams } from "wouter"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Badge } from "../components/ui/badge"
import { Moon, Clock, Phone, Mail, MapPin, Award, Clock3, TrendingUp, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { getRestaurantById } from "../services/profileData"

export default function RestaurantProfilePage() {
  const [location, setLocation] = useLocation()
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
    setLocation("/")
  }

  const handleManageMenu = () => {
    setLocation(`/restaurants/manage/${restaurantId}`)
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
            <motion.span whileHover={{ scale: 1.05 }} className="font-bold text-xl tracking-wide text-amber-300">
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
          <Link href={`/restaurants/manage/${restaurantId}`}>
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
          className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg transition-colors duration-300`}
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
          className={`w-full max-w-3xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-lg p-6 shadow-lg transition-colors duration-300`}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-amber-800"} text-center mb-2`}
          >
            Hesap Profilim - Restoran
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`text-xl ${darkMode ? "text-amber-400" : "text-amber-600"} text-center mb-6`}
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
                  value={editableData.name}
                  onChange={(e) => setEditableData({ ...editableData, name: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"
                  } border rounded-md py-2 px-3 text-sm transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Telefon</label>
              <div className="flex group">
                <div
                  className={`flex items-center ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"
                  } border rounded-l-md py-2 px-3`}
                >
                  <Phone className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"} mr-2`} />
                </div>
                <input
                  type="text"
                  value={editableData.phone}
                  onChange={(e) => setEditableData({ ...editableData, phone: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"
                  } border-y border-r py-2 px-3 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Email</label>
              <div className="flex group">
                <div
                  className={`flex items-center ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"
                  } border rounded-l-md py-2 px-3`}
                >
                  <Mail className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"} mr-2`} />
                </div>
                <input
                  type="email"
                  value={editableData.email}
                  onChange={(e) => setEditableData({ ...editableData, email: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"
                  } border-y border-r py-2 px-3 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Adres</label>
              <div className="flex group">
                <div
                  className={`flex items-center ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"
                  } border rounded-l-md py-2 px-3`}
                >
                  <MapPin className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"} mr-2`} />
                </div>
                <input
                  type="text"
                  value={editableData.address}
                  onChange={(e) => setEditableData({ ...editableData, address: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"
                  } border-y border-r py-2 px-3 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
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
          <motion.div variants={container} initial="hidden" animate={isLoaded ? "show" : "hidden"} className="mb-6">
            <motion.h3
              variants={item}
              className={`text-lg font-medium ${darkMode ? "text-amber-400" : "text-amber-800"} mb-3 flex items-center`}
            >
              <Clock className="h-5 w-5 mr-2" /> Çalışma Saatleri
            </motion.h3>
            <motion.div
              variants={item}
              className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {Object.entries(editableData.workingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-amber-100"} border rounded-md p-3 text-sm`}
                >
                  <div className="font-medium mb-1">{day}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Açılış</label>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => {
                          const updatedHours = { ...editableData.workingHours }
                          updatedHours[day] = { ...hours, open: e.target.value }
                          setEditableData({ ...editableData, workingHours: updatedHours })
                        }}
                        className={`w-full ${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-amber-100"
                        } border rounded-md py-1 px-1 text-xs transition-colors duration-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Kapanış</label>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => {
                          const updatedHours = { ...editableData.workingHours }
                          updatedHours[day] = { ...hours, close: e.target.value }
                          setEditableData({ ...editableData, workingHours: updatedHours })
                        }}
                        className={`w-full ${
                          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-amber-100"
                        } border rounded-md py-1 px-1 text-xs transition-colors duration-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500`}
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
            <div className="relative w-12 h-12 flex flex-col items-center">
              <img
                src={restaurant.profileImage || "/image1.png"}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover rounded-full"
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
