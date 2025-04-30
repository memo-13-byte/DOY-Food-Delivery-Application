"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Moon, Edit2, Upload, TrendingUp, Star, Package, Clock, LogOut, Axis3D } from "lucide-react"
import { getCourierById, getUserById } from "../services/profileData"
import { useToast } from "../hooks/use-toast"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import axios from "axios"
import { getResponseErrors } from "../services/exceptionUtils"


export default function CourierProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const courierId = params.id
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  const { toast } = useToast()
  const [originalCourier, setOriginalCourier] = useState({
    id: 1,
  firstname: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  role: "",
  governmentId: "",
  districtCity: "",
  districtName: "",
  })

  // Kurye verilerini ID'ye göre al
  const [courier, setCourier] = useState({
    id: 1,
  firstname: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  role: "",
  governmentId: "",
  districtCity: "",
  districtName: "",
  })

  // If there's no courierId, set the default courier
  useEffect(() => {
    const getCourier = async () => {
      const response = await getUserById(courierId)

      setCourier(response)
      setOriginalCourier(response)
    }
    getCourier()
  }, [courierId])

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

  const handleUpdate = async() => {
    setErrorMessages([])
    try {
        
      const response = await axios.put(`http://localhost:8080/api/users/couriers/update/${courier.email}`, courier)
      setOriginalCourier(response.data)

      toast({
        title: "Profil güncellendi!",
        description: "Kurye bilgileriniz başarıyla güncellendi.",
        variant: "default",
        duration: 3000,
      })
    } catch (error) {
      setErrorMessages(getResponseErrors(error))
      toast({
        title: "Değişiklik yok",
        description: "Herhangi bir değişiklik yapılamadı.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/")
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
    onTimeDelivery: <TrendingUp className={`h-6 w-6 ${darkMode ? "text-purple-400" : "text-amber-600"} mb-2`} />,
    customerRating: <Star className={`h-6 w-6 ${darkMode ? "text-purple-400" : "text-amber-600"} mb-2`} />,
    weeklyOrders: <Package className={`h-6 w-6 ${darkMode ? "text-purple-400" : "text-amber-600"} mb-2`} />,
    avgDeliveryTime: <Clock className={`h-6 w-6 ${darkMode ? "text-purple-400" : "text-amber-600"} mb-2`} />,
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c] text-gray-100" : "bg-[#F2E8D6]"} transition-colors duration-300`}
    >
      {/* Header section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`${darkMode ? "bg-[#333]" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md`}
      >
        <div className="flex items-center">
          <Link to="/">
            <motion.span className="font-bold text-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Doy!
            </motion.span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2 cursor-pointer">
              <div className="w-[34px] h-[18px] bg-[#F8F5DE] rounded-full relative">
                <div
                  className="w-[16px] h-[16px] bg-black rounded-full absolute top-[1px]"
                  style={{
                    left: darkMode ? "17px" : "1px",
                    transition: "left 0.3s",
                  }}
                />
              </div>
              <Moon className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-amber-200"}`} />
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center rounded-full w-10 h-10 ${darkMode ? "bg-purple-400" : "bg-amber-500"}`}
          >
            <span className="text-white text-sm font-medium">
              {courier.firstname && courier.lastname ? courier.firstname[0] + courier.lastname[0] : "K"}
            </span>
          </motion.div>
        </div>
      </motion.header>

      {/* Logo section */}
      <motion.div
        className="flex justify-center py-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <motion.div
          className={`rounded-full ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg`}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="relative w-24 h-24">
            <img src="/image1.png" alt="DOY Logo" width={96} height={96} className="w-full h-full" />
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

      {errorMessages.map((message, i) => (
                        
                        <motion.div key={i}
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
                              <p className="font-medium">{message}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
      {/* Profile Content */}
      <div className="flex-grow flex justify-center items-start px-4 pb-8">
        <motion.div
          className={`w-full max-w-5xl ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} rounded-lg p-8 shadow-md`}
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.h1
            className={`text-xl font-bold ${darkMode ? "text-purple-400" : "text-[#6b4b10]"} text-center mb-8`}
            variants={itemVariants}
          >
            Hesap Profilim - Kurye
            <span className="ml-2 text-sm font-normal text-gray-500">(ID: {courierId || "Varsayılan"})</span>
          </motion.h1>

          {/* Performance Statistics */}
          {/*<motion.div
            className={`${darkMode ? "bg-[#333]" : "bg-[#F2E8D6]"} rounded-lg p-6 mb-8 shadow-inner`}
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <motion.div
                className="w-3 h-3 bg-amber-500 rounded-full mr-2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              ></motion.div>
              <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-[#6b4b10]"}`}>
                Performans İstatistikleri
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {Object.entries(courier.stats).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className={`${darkMode ? "bg-[#2c2c2c]" : "bg-white"} p-6 rounded-md flex flex-col items-center justify-center shadow-sm`}
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
                    className={`text-2xl font-bold ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`}
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
          <motion.div className="w-full max-w-4xl mx-auto space-y-5 mb-8" variants={itemVariants}>

            <motion.div className="grid grid-cols-2 gap-6" variants={fadeInVariants}>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                  Ad
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="firstname"
                    value={courier.firstname}
                    onChange={handleInputChange}
                    className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                  <motion.button
                    className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                    whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                  </motion.button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                  Soyad
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="lastname"
                    value={courier.lastname}
                    onChange={handleInputChange}
                    className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                  <motion.button
                    className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                    whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Email field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Email
              </label>
              <div className="flex">
                <input
                  type="email"
                  name="email"
                  value={courier.email}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Phone field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Telefon
              </label>
              <div className="flex">
                <input
                  type="tel"
                  name="phone"
                  value={courier.phoneNumber || ""}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Address field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                İl
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="address"
                  value={courier.districtCity}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                İlçe
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="address"
                  value={courier.districtName}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* ID Number field */}
            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                T.C. Kimlik No
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="idNumber"
                  value={courier.governmentId}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Vehicle Type select */}
            {/*<motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Araç Tipi
              </label>
              <Select
                value={courier.vehicleType}
                onValueChange={(value) => setCourier((prev) => ({ ...prev, vehicleType: value }))}
              >
                <SelectTrigger
                  className={`${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} py-3 px-4 transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-[#2c2c2c] text-white border-gray-600" : ""}>
                  <SelectItem value="Motorsiklet">Motorsiklet</SelectItem>
                  <SelectItem value="Araba">Araba</SelectItem>
                  <SelectItem value="Bisiklet">Bisiklet</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                  <SelectItem value="Elektrikli Bisiklet">Elektrikli Bisiklet</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>*/}

            {/* License Plate field */}
            {/*<motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Plaka (Bağımsız Kurye için)
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="licensePlate"
                  value={courier.licensePlate}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Work Schedule select */}
            {/*<motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Çalışma Şekli
              </label>
              <Select
                value={courier.workSchedule}
                onValueChange={(value) => setCourier((prev) => ({ ...prev, workSchedule: value }))}
              >
                <SelectTrigger
                  className={`${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} py-3 px-4 transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-[#2c2c2c] text-white border-gray-600" : ""}>
                  <SelectItem value="Tam Zamanlı">Tam Zamanlı</SelectItem>
                  <SelectItem value="Yarı Zamanlı">Yarı Zamanlı</SelectItem>
                  <SelectItem value="Hafta Sonu">Hafta Sonu</SelectItem>
                  <SelectItem value="Esnek Çalışma">Esnek Çalışma</SelectItem>
                  <SelectItem value="Serbest Zamanlı">Serbest Zamanlı</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Experience field */}
            {/*<motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Deneyim (Yıl)
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="experience"
                  value={courier.experience}
                  onChange={handleInputChange}
                  className={`w-full ${darkMode ? "bg-[#333] text-white border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-l-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                />
                <motion.button
                  className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border border-l-0 rounded-r-md px-3`}
                  whileHover={{ backgroundColor: darkMode ? "#4b5563" : "#fef3c7" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className={`h-4 w-4 ${darkMode ? "text-purple-400" : "text-[#6b4b10]"}`} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Document Upload */}
          {/*<motion.div className="w-full max-w-4xl mx-auto mb-8" variants={itemVariants}>
            <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
              Ehliyet
            </label>
            <motion.div
              className={`${darkMode ? "bg-[#333] border-gray-600" : "bg-[#F2E8D6] border-amber-100"} border rounded-md p-10 flex flex-col items-center justify-center`}
              whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
            >
              <motion.div
                className={`w-20 h-24 ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} border ${darkMode ? "border-gray-600" : "border-gray-200"} rounded-md flex items-center justify-center mb-3`}
                whileHover={{ y: -5 }}
                animate={{
                  boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 8px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                }}
              >
                <Upload className={`h-10 w-10 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
              </motion.div>
              <p className={`text-sm font-medium text-center ${darkMode ? "text-gray-300" : "text-[#6b4b10]"}`}>
                Kuryenin Ehliyeti
              </p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} text-center mt-1`}>
                PDF, JPG veya PNG formatında
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`mt-4 ${darkMode ? "bg-[#2c2c2c] border-purple-400 text-purple-400 hover:bg-[#333]" : "bg-white border-amber-200 text-[#6b4b10] hover:bg-amber-100"}`}
                >
                  Dosya Seç
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Working Days and Hours */}
          {/*<motion.div className="w-full max-w-4xl mx-auto mb-8" variants={itemVariants}>
            <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
              Çalışma Saatleri
            </label>
            <motion.div
              className={`${darkMode ? "bg-[#333]" : "bg-[#F2E8D6]"} rounded-lg p-6`}
              whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                    <label
                      htmlFor={`day-${day}`}
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"}`}
                    >
                      {day}
                    </label>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                    Başlangıç Saati
                  </label>
                  <input
                    type="time"
                    value={courier.workingHours.start}
                    onChange={(e) => handleNestedChange("workingHours", "start", e.target.value)}
                    className={`w-full ${darkMode ? "bg-[#2c2c2c] text-white border-gray-600" : "bg-white border-amber-100"} border rounded-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    value={courier.workingHours.end}
                    onChange={(e) => handleNestedChange("workingHours", "end", e.target.value)}
                    className={`w-full ${darkMode ? "bg-[#2c2c2c] text-white border-gray-600" : "bg-white border-amber-100"} border rounded-md py-3 px-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-300 focus:outline-none`}
                  />
                </div>
              </div>
            </motion.div>*/}
          </motion.div>

          {/* Update Button */}
          <motion.div
            className="w-full max-w-4xl mx-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleUpdate}
              className={`w-full py-3 ${darkMode ? "bg-purple-500 hover:bg-purple-600" : "bg-amber-400 hover:bg-amber-500"} text-white font-medium mb-4 shadow-md hover:shadow-lg transition-all duration-200`}
            >
              Güncelle
            </Button>
          </motion.div>

          {/* Logout Link */}
          <motion.button
            onClick={handleLogout}
            className={`w-full max-w-4xl mx-auto block text-center py-3 border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-[#333]" : "border-gray-300 text-gray-600 hover:bg-gray-50"} rounded-md transition-colors duration-200`}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: darkMode ? "#374151" : "#f9fafb" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" />
              Hesabımdan Çıkış Yap
            </div>
          </motion.button>
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
    </div>
  )
}
