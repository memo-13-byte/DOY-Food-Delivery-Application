import { useState, useEffect } from "react"
import { Link, useLocation, useParams } from "wouter"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Checkbox } from "../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Moon, Edit2, Upload, TrendingUp, Star, Package, Clock } from "lucide-react"
import { getCourierById } from "../services/profileData"
import { useToast } from "../hooks/use-toast"

// Mock function for updating courier data (replace with your actual API call)
const updateCourier = (courierData) => {
  // Simulate an API call delay
  // await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...courierData }
}

export default function CourierProfilePage() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const courierId = params.id
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const { toast } = useToast()
  const [originalCourier, setOriginalCourier] = useState(null)

  // Kurye verilerini ID'ye göre al
  const [courier, setCourier] = useState(() => getCourierById(courierId))

  // ID değiştiğinde kurye verilerini güncelle
  useEffect(() => {
    if (courierId) {
      const courierData = getCourierById(courierId)
      setCourier(courierData)
      setOriginalCourier(JSON.parse(JSON.stringify(courierData)))
    }
  }, [courierId])

  // If there's no courierId, set the default courier
  useEffect(() => {
    if (!courierId) {
      const defaultCourierData = getCourierById()
      setCourier(defaultCourierData)
      setOriginalCourier(JSON.parse(JSON.stringify(defaultCourierData)))
    }
  }, [])

  // Simulate loading state
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Add this handler function to update courier state
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourier((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add this handler function to update nested properties
  const handleNestedChange = (category, field, value) => {
    setCourier((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  // Add this handler function to update working days
  const handleWorkingDayChange = (day) => {
    setCourier((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }))
  }

  const handleUpdate = () => {
    if (!originalCourier) return

    // Check if there are any changes by comparing the current courier with the original
    const hasChanges = JSON.stringify(courier) !== JSON.stringify(originalCourier)

    if (hasChanges) {
      // Update the courier data (in a real app, this would call an API)
      const updatedCourier = updateCourier(courier)

      // Update the original courier data with the new data
      setOriginalCourier(JSON.parse(JSON.stringify(updatedCourier)))

      // Show success toast
      toast({
        title: "Profil güncellendi!",
        description: "Kurye bilgileriniz başarıyla güncellendi.",
        variant: "default",
        duration: 3000,
      })
    } else {
      // Show info toast that no changes were made
      toast({
        title: "Değişiklik yok",
        description: "Herhangi bir değişiklik yapmadınız.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleLogout = () => {
    // Handle logout logic here
    setLocation("/")
  }

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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const statsIcons = {
    onTimeDelivery: <TrendingUp className="h-6 w-6 text-amber-600 mb-2" />,
    customerRating: <Star className="h-6 w-6 text-amber-600 mb-2" />,
    weeklyOrders: <Package className="h-6 w-6 text-amber-600 mb-2" />,
    avgDeliveryTime: <Clock className="h-6 w-6 text-amber-600 mb-2" />,
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-amber-50"} transition-colors duration-300`}
    >
      {/* Header section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`${darkMode ? "bg-gray-800" : "bg-[#47300A]"} text-white py-2 px-4 flex justify-between items-center sticky top-0 z-10 shadow-md`}
      >
        <div className="flex items-center">
          <Link href="/">
            <motion.span className="font-bold text-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Doy!
            </motion.span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className={`data-[state=checked]:${darkMode ? "bg-amber-400" : "bg-amber-200"}`}
            />
            <Moon className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-200"}`} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center rounded-full w-10 h-10 ${darkMode ? "bg-amber-400" : "bg-amber-500"}`}
          >
            <span className="text-white text-sm font-medium">
              {courier.firstName && courier.lastName ? courier.firstName[0] + courier.lastName[0] : "K"}
            </span>
          </motion.div>
        </div>
      </motion.header>

      {/* Logo section */}
      <motion.div
        className="flex justify-center py-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <motion.div
          className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg`}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="relative w-24 h-24">
            <img
              src="/image1.png"
              alt="DOY Logo"
              width={96}
              height={96}
              className="w-full h-full"
            />
            <motion.div
              className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              FOOD DELIVERY
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile Content */}
      <div className="flex-grow flex justify-center items-start px-4 pb-8">
        <motion.div
          className={`w-full max-w-3xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-md`}
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.h1
            className={`text-xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}
            variants={itemVariants}
          >
            Hesap Profilim - Kurye
            <span className="ml-2 text-sm font-normal text-gray-500">(ID: {courierId || "Varsayılan"})</span>
          </motion.h1>

          {/* Performance Statistics */}
          <motion.div
            className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 mb-6 shadow-inner`}
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <motion.div
                className="w-3 h-3 bg-amber-500 rounded-full mr-2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              ></motion.div>
              <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : ""}`}>
                Performans İstatistikleri
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(courier.stats).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-md flex flex-col items-center justify-center shadow-sm`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {statsIcons[key]}
                  <motion.div
                    className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 + 0.1 * index }}
                  >
                    {value}
                  </motion.div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} text-center`}>
                    {key === "onTimeDelivery" && "Zamanında Teslimat"}
                    {key === "customerRating" && "Müşteri Puanı"}
                    {key === "weeklyOrders" && "Haftalık Sipariş"}
                    {key === "avgDeliveryTime" && "Ort. Teslimat Süresi"}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Courier Information */}
          <motion.div className="space-y-4 mb-6" variants={itemVariants}>
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                Kullanıcı Adı
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="fullName"
                  value={courier.fullName}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-2 gap-4" variants={fadeInVariants}>
              <div>
                <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Ad</label>
                <div className="flex">
                  <input
                    type="text"
                    name="firstName"
                    value={courier.firstName}
                    onChange={handleInputChange}
                    className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                  <motion.button
                    className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                    whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                  </motion.button>
                </div>
              </div>

              <div>
                <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Soyad</label>
                <div className="flex">
                  <input
                    type="text"
                    name="lastName"
                    value={courier.lastName}
                    onChange={handleInputChange}
                    className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                  <motion.button
                    className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                    whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Email field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Email</label>
              <div className="flex">
                <input
                  type="email"
                  name="email"
                  value={courier.email}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Phone field (from second file) */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Telefon</label>
              <div className="flex">
                <input
                  type="tel"
                  name="phone"
                  value={courier.phone || ""}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Address field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Adres</label>
              <div className="flex">
                <input
                  type="text"
                  name="address"
                  value={courier.address}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* ID Number field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                T.C. Kimlik No
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="idNumber"
                  value={courier.idNumber}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Vehicle Type select */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Araç Tipi</label>
              <Select
                value={courier.vehicleType}
                onValueChange={(value) => setCourier((prev) => ({ ...prev, vehicleType: value }))}
              >
                <SelectTrigger
                  className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}>
                  <SelectItem value="Motorsiklet">Motorsiklet</SelectItem>
                  <SelectItem value="Araba">Araba</SelectItem>
                  <SelectItem value="Bisiklet">Bisiklet</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                  <SelectItem value="Elektrikli Bisiklet">Elektrikli Bisiklet</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* License Plate field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                Plaka (Bağımsız Kurye için)
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="licensePlate"
                  value={courier.licensePlate}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Work Schedule select */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                Çalışma Şekli
              </label>
              <Select
                value={courier.workSchedule}
                onValueChange={(value) => setCourier((prev) => ({ ...prev, workSchedule: value }))}
              >
                <SelectTrigger
                  className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}>
                  <SelectItem value="Tam Zamanlı">Tam Zamanlı</SelectItem>
                  <SelectItem value="Yarı Zamanlı">Yarı Zamanlı</SelectItem>
                  <SelectItem value="Hafta Sonu">Hafta Sonu</SelectItem>
                  <SelectItem value="Esnek Çalışma">Esnek Çalışma</SelectItem>
                  <SelectItem value="Serbest Zamanlı">Serbest Zamanlı</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Experience field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                Deneyim (Yıl)
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="experience"
                  value={courier.experience}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-l-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Document Upload */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}>Ehliyet</label>
            <motion.div
              className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-100"} border rounded-md p-8 flex flex-col items-center justify-center`}
              whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
            >
              <motion.div
                className={`w-16 h-20 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-600" : "border-gray-200"} rounded-md flex items-center justify-center mb-2`}
                whileHover={{ y: -5 }}
                animate={{
                  boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 8px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                }}
              >
                <Upload className={`h-8 w-8 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
              </motion.div>
              <p className={`text-sm font-medium text-center ${darkMode ? "text-gray-300" : ""}`}>Kuryenin Ehliyeti</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} text-center mt-1`}>
                PDF, JPG veya PNG formatında
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`mt-4 ${darkMode ? "bg-gray-800 border-amber-400 text-amber-400 hover:bg-gray-700" : "bg-white border-amber-200 text-amber-800 hover:bg-amber-100"}`}
                >
                  Dosya Seç
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Working Days and Hours */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}>
              Çalışma Saatleri
            </label>
            <motion.div
              className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4`}
              whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(courier.workingDays).map(([day, isWorking], index) => (
                  <motion.div
                    key={day}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Checkbox
                      id={`day-${day}`}
                      checked={isWorking}
                      onCheckedChange={() => handleWorkingDayChange(day)}
                    />
                    <label htmlFor={`day-${day}`} className={`text-sm ${darkMode ? "text-gray-300" : ""}`}>
                      {day}
                    </label>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                    Başlangıç Saati
                  </label>
                  <input
                    type="time"
                    value={courier.workingHours.start}
                    onChange={(e) => handleNestedChange("workingHours", "start", e.target.value)}
                    className={`w-full ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-amber-100"} border rounded-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    value={courier.workingHours.end}
                    onChange={(e) => handleNestedChange("workingHours", "end", e.target.value)}
                    className={`w-full ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-amber-100"} border rounded-md py-2 px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Update Button */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleUpdate}
              className={`w-full ${darkMode ? "bg-amber-500 hover:bg-amber-600" : "bg-amber-300 hover:bg-amber-400"} text-amber-800 font-medium mb-4 shadow-md hover:shadow-lg transition-all duration-200`}
            >
              Güncelle
            </Button>
          </motion.div>

          {/* Logout Link */}
          <motion.button
            onClick={handleLogout}
            className={`w-full text-center py-2 border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"} rounded-md transition-colors duration-200`}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: darkMode ? "#374151" : "#f9fafb" }}
            whileTap={{ scale: 0.98 }}
          >
            Hesabımdan Çıkış Yap
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-200"} p-6 border-t`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            className="mb-4 md:mb-0"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`rounded-full ${darkMode ? "bg-gray-700" : "bg-white"} p-4 w-20 h-20 flex items-center justify-center`}
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
                  DOY
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-6">
            {[
              {
                href: "https://twitter.com",
                path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
              },
              {
                href: "https://instagram.com",
                path: ["M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", "M17.5 6.5h.01"],
                rect: { width: 20, height: 20, x: 2, y: 2, rx: 5, ry: 5 },
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
                className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"}`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
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
                  {social.rect && <rect {...social.rect} />}
                  {social.circle && <circle {...social.circle} />}
                  {Array.isArray(social.path) ? (
                    social.path.map((p, i) => <path key={i} d={p} />)
                  ) : (
                    <path d={social.path} />
                  )}
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
