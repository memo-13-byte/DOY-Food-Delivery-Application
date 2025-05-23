"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Moon, Edit2, TrendingUp, Star, Package, Clock, LogOut } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import AuthorizedRequest from "../services/AuthorizedRequest"
import { getResponseErrors } from "../services/exceptionUtils"
import { DISTRICT_DATA, TURKISH_CITIES } from "../services/address"
import Header from "../components/Header"
import Footer from "../components/Footer"
import DoyLogo from "../components/DoyLogo"

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
  const {id:courierId} = params
  const fromAdmin = courierId !== undefined
  const [courierEmail, setCourierEmail] = useState("")
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

  const [districts, setDistricts] = useState(courier.districtCity ? DISTRICT_DATA[courier.districtCity] || [] : DISTRICT_DATA["ISTANBUL"])

  // Load courier data
  useEffect(() => {
    const getCourier = async () => {
      try {
        let loadedEmail = "";
              if (courierId !== undefined) {
              const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/get-by-id/${courierId}`)
              console.log(response.data);
              setCourierEmail(response.data.email);
              loadedEmail = response.data.email;
            }else{
              setCourierEmail(localStorage.getItem("email"));
              loadedEmail = localStorage.getItem("email");
            }

        const response = (await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/couriers/get-by-email/${loadedEmail}`)).data
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
  }, [courierEmail])

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
      let data = {
        governmentId: courier.governmentId,
  district: {city: courier.districtCity, district: courier.districtName},
  firstname: courier.firstname,
  lastname: courier.lastname,
  email: courier.email,
  phoneNumber: courier.phoneNumber,
  role: "COURIER"
      }
      const response = await AuthorizedRequest.putRequest(`http://localhost:8080/api/users/couriers/update/${courier.email}`, data)
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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

      <DoyLogo></DoyLogo>

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
          </motion.h1>

          <motion.div className="w-full max-w-4xl mx-auto space-y-5 mb-8" variants={itemVariants}>

          {
            !fromAdmin && <div><motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {navigate(`/courier/requests`)}}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Manage Status
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {navigate(`/courier/profile/comments`)}}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              See Ratings and Comments
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {navigate(`/courier/profile/${courier.id}/orders`)}}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              See All Assigned Orders
            </Button>
          </motion.div> </div>
          }

          

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
                disabled
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
              <div className="m-2">
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
              <div className="m-2">
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
                disabled
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

          

          {
              !fromAdmin && <motion.button
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
            }
        </motion.div>
      </div>

      <Footer darkMode={darkMode}></Footer>
    </div>
  )
}