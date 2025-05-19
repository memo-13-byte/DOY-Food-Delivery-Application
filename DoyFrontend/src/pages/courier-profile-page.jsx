"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Moon, Edit2, TrendingUp, Star, Package, Clock, LogOut } from "lucide-react"
import { getUserById } from "../services/profileData"
import { useToast } from "../hooks/use-toast"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import axios from "axios"
import { getResponseErrors } from "../services/exceptionUtils"
import { DISTRICT_DATA, TURKISH_CITIES } from "../services/address"

const Input = ({ className, ...props }) => (
  <input className={`w-full px-3 py-2 border rounded-lg ${className}`} {...props} />
)

const Label = ({ className, htmlFor, children }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`} htmlFor={htmlFor}>
    {children}
  </label>
)

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

  const [districts, setDistricts] = useState(
    courier.districtCity ? DISTRICT_DATA[courier.districtCity] || [] : DISTRICT_DATA["ISTANBUL"],
  )

  // Load courier data
  useEffect(() => {
    const getCourier = async () => {
      try {
        const response = await getUserById(courierId)
        setCourier(response)
        setOriginalCourier(response)
        // Set districts based on the loaded city
        if (response.districtCity && DISTRICT_DATA[response.districtCity]) {
          setDistricts(DISTRICT_DATA[response.districtCity])
        }
      } catch (error) {
        console.error("Error fetching courier:", error)
      }
    }
    getCourier()
  }, [courierId])

  // Update districts when districtCity changes
  useEffect(() => {
    if (courier.districtCity && DISTRICT_DATA[courier.districtCity]) {
      setDistricts(DISTRICT_DATA[courier.districtCity])
      // Ensure districtName is valid for the new city
      if (!DISTRICT_DATA[courier.districtCity].includes(courier.districtName)) {
        setCourier((prev) => ({
          ...prev,
          districtName: DISTRICT_DATA[courier.districtCity][0] || "",
        }))
      }
    }
  }, [courier.districtCity])

  const onCityDropdownValueChanged = (e) => {
    const value = e.target.value
    setCourier((prev) => ({
      ...prev,
      districtCity: value,
      districtName: DISTRICT_DATA[value]?.[0] || "", // Reset district to first available
    }))
    setDistricts(DISTRICT_DATA[value] || [])
  }

  const onDistrictDropdownValueChanged = (e) => {
    const value = e.target.value
    setCourier((prev) => ({
      ...prev,
      districtName: value,
    }))
  }

  // Simulate loading state
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourier((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNestedChange = (category, field, value) => {
    setCourier((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  const handleWorkingDayChange = (day) => {
    setCourier((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }))
  }

  const handleUpdate = async () => {
    setErrorMessages([])
    try {
      const data = {
        governmentId: courier.governmentId,
        district: { city: courier.districtCity, district: courier.districtName },
        firstname: courier.firstname,
        lastname: courier.lastname,
        email: courier.email,
        phoneNumber: courier.phoneNumber,
        role: "COURIER",
      }
      const response = await axios.put(`http://localhost:8080/api/users/couriers/update/${courier.email}`, data)
      setOriginalCourier(response.data)
      console.log(response)
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
    navigate("/")
  }

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
        <motion.div
          key={i}
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

      <div className="flex-grow flex justify-center items-start px-4 pb-8">
        <motion.div
          className={`w-full max-w-[75%] ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} rounded-lg p-8 shadow-md`}
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

          <motion.div className="w-full space-y-5 mb-8" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  navigate(`/courier/requests/${courierId}`)
                }}
                className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
              >
                Manage Status
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  navigate(`/courier/profile/${courierId}/orders`)
                }}
                className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
              >
                See All Assigned Orders
              </Button>
            </motion.div>

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

            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                Telefon
              </label>
              <div className="flex">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={courier.phoneNumber}
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

            <motion.div variants={fadeInVariants} className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="cityDropdown" className="block text-base text-gray-800 mb-1">
                  İl
                </label>
                <div className="relative">
                  <select
                    id="cityDropdown"
                    name="districtCity"
                    value={courier.districtCity}
                    onChange={onCityDropdownValueChanged}
                    className="w-full p-2 text-base border border-gray-300 rounded-lg bg-[#f5f2e9] text-gray-800 appearance-none focus:outline-none focus:border-gray-500"
                  >
                    {TURKISH_CITIES.map((option) => (
                      <option key={option.value} value={option.value} disabled={option.value === ""}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <div>
                <label htmlFor="districtDropdown" className="block text-base text-gray-800 mb-1">
                  İlçe
                </label>
                <div className="relative">
                  <select
                    id="districtDropdown"
                    name="districtName"
                    value={courier.districtName}
                    onChange={onDistrictDropdownValueChanged}
                    className="w-full p-2 text-base border border-gray-300 rounded-lg bg-[#f5f2e9] text-gray-800 appearance-none focus:outline-none focus:border-gray-500"
                  >
                    {districts.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInVariants}>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-2`}>
                T.C. Kimlik No
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="governmentId"
                  value={courier.governmentId}
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

          <motion.div
            className="w-full"
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

          <motion.button
            onClick={handleLogout}
            className={`w-full block text-center py-3 border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-[#333]" : "border-gray-300 text-gray-600 hover:bg-gray-50"} rounded-md transition-colors duration-200`}
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
