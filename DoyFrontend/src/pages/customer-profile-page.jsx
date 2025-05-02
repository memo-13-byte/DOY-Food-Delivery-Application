"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { Moon, Edit2, AlertTriangle, User, Phone, Mail, MapPin, LogOut, Check, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { getCustomerById, getUserById } from "../services/profileData"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import axios from "axios"
import { getResponseErrors } from "../services/exceptionUtils"
import { DISTRICT_DATA, TURKISH_CITIES } from "../services/address"
import { Button } from "../components/Button"

const Input = ({ className, ...props }) => (
  <input className={`w-full px-3 py-2 border rounded-lg ${className}`} {...props} />
)

const Label = ({ className, htmlFor, children }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`} htmlFor={htmlFor}>
    {children}
  </label>
)

export default function CustomerProfilePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const customerId = params.id
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoaded, setIsLoaded] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [districts, setDistricts] = useState(DISTRICT_DATA["ISTANBUL"])
  const [addressInfo, setAddressInfo] = useState({
    city: "ISTANBUL",
    district: "Adalar",
    neighborhood: "",
    avenue: "",
    street: "",
    buildingNumber: 0,
    apartmentNumber: 0,
  })

  // Fetch customer data by ID
  const [user, setUser] = useState({
    id: 0,
    firstname: " ",
    lastname: " ",
    email: " ",
    phoneNumber: " ",
    role: " ",
    addresses: " ",
    name: " "
  }) 

  // Form state for profile update
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber,
  })

  // State for allergens
  const [allergens, setAllergens] = useState(
    user.allergens || {
      1: false, // Süt
      2: false, // Yumurta
      3: true, // Fıstık
      4: false, // Kabuklu Deniz Ürünleri
      5: false, // Buğday
      6: false, // Soya
      7: false, // Balık
      8: false, // Kereviz
      9: true, // Kuruyemiş
    },
  )

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserById(customerId)
        userData.name = userData.firstname + " " + userData.lastname
        setUser(userData)
        setFormData({
          ...formData,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        })
        console.log(userData)
        if (userData.current_address) {
          setAddressInfo({
            city: userData.current_address.district.city,
            district: userData.current_address.district.name,
            neighborhood: userData.current_address.neighborhood || "",
            avenue: userData.current_address.avenue || "",
            street: userData.current_address.street || "",
            buildingNumber: userData.current_address.buildingNumber || 0,
            apartmentNumber: userData.current_address.apartment_number || 0,
          })
          setDistricts(DISTRICT_DATA[userData.current_address.district.city] || DISTRICT_DATA["ISTANBUL"])
        }
      } catch (error) {
        console.error("Error: " + error)
      }
    }

    loadUser()
  }, [customerId])

  const onCityDropdownValueChanged = (event) => {
    const value = event.target.value
    setAddressInfo(prev => ({
      ...prev,
      city: value,
      district: DISTRICT_DATA[value][0] // Set first district as default
    }))
    setDistricts(DISTRICT_DATA[value])
  }
  
  const onDistrictDropdownValueChanged = (event) => {
    const value = event.target.value
    setAddressInfo(prev => ({
      ...prev,
      district: value
    }))
  }

  // Animation effect when page loads
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileUpdate = async(e) => {
    e.preventDefault()
    setErrorMessages([])

    try {
      const putData = {
        ...formData,
        current_address: addressInfo,
        role: "CUSTOMER"
      }
      console.log("updated: ")
      console.log(putData)
      const response = await axios.put(`http://localhost:8080/api/users/customers/update/${user.email}`, putData)
      
      setUser({
        ...user,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        current_address: addressInfo,
      })
  
      // Animation for success notification
      const notification = document.getElementById("success-notification")
      notification.classList.remove("translate-y-20", "opacity-0")
      notification.classList.add("translate-y-0", "opacity-100")
  
      setTimeout(() => {
        notification.classList.add("translate-y-20", "opacity-0")
        notification.classList.remove("translate-y-0", "opacity-100")
      }, 3000)
    } catch (error) {
      setErrorMessages(getResponseErrors(error))
      console.error("Error: " + error)
    }
  }

  const handleAllergenChange = (id) => {
    setAllergens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddressInfoChange = (e) => {
    const { id, value } = e.target
    setAddressInfo(prev => ({
      ...prev,
      [id]: id === 'buildingNumber' || id === 'apartmentNumber' ? Number(value) : value
    }))
  }

  const selectedAllergens = Object.entries(allergens)
    .filter(([_, selected]) => selected)
    .map(([id]) => Number.parseInt(id))

  const handleLogout = () => {
    navigate("/")
  }

  const pastOrders = user.orders || [
    { id: "ORD-1234", date: "10.04.2025", restaurantName: "Kebapçı Mehmet", status: "delivered", amount: "120" },
    { id: "ORD-1233", date: "08.04.2025", restaurantName: "Pizza Evi", status: "delivered", amount: "95" },
    { id: "ORD-1232", date: "05.04.2025", restaurantName: "Çiğköfteci Ali", status: "processing", amount: "45" },
  ]

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c] text-white" : "bg-[#F2E8D6]"} transition-colors duration-300`}
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
        className={`${darkMode ? "bg-[#333]" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center shadow-md`}
      >
        <div className="flex items-center">
          <Link to="/">
            <span className="font-bold text-xl tracking-wide hover:text-amber-200 transition-colors duration-200">
              Doy!
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
              {user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()}
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
            {user.profileImage ? (
              <img
                src={user.profileImage || "/placeholder.svg"}
                alt={user?.firstname}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img src="/image1.png" alt="DOY Logo" width={96} height={96} className="w-full h-full" />
            )}
            <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-amber-400" : "text-amber-800"}`}>
              {user.profileImage ? user.firstname : "FOOD DELIVERY"}
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
          className={`w-full md:w-4/5 max-w-5xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-6 shadow-xl`}
        >
          <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}>
            Hesap Profilim - Müşteri {customerId ? `(ID: ${customerId})` : ""}
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
                disabled
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

<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {navigate("/restaurants/browse")}}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9]"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Browse Restaurants
            </Button>
          </motion.div>

              {activeTab === "profile" && (
                <motion.div variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"}>
                  {/* Personal Information */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
                      >
                        <User className="h-4 w-4 mr-2" /> Ad
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
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
                        className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
                      >
                        <User className="h-4 w-4 mr-2" /> Soyad
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
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
                        className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
                      >
                        <Phone className="h-4 w-4 mr-2" /> Telefon
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
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
                        className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
                      >
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </label>
                      <div className="flex">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-l-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                        />
                        <button
                          className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2 hover:bg-amber-100 transition-colors duration-200`}
                        >
                          <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} />
                        </button>
                      </div>
                    </div>

                    <div className="m-2">
                      <label htmlFor="cityDropdown" className="block text-base text-gray-800 mb-1">
                        İl
                      </label>
                      <div className="relative">
                        <select
                          id="cityDropdown"
                          name="city"
                          value={addressInfo.city}
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
                          name="district"
                          value={addressInfo.district}
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
                    
                    <div className="space-y-3">
                      <Label htmlFor="neighborhood" className="text-gray-700 dark:text-gray-300 font-medium">
                        Mahalle
                      </Label>
                      <Input
                        id="neighborhood"
                        placeholder="Mahalle"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={addressInfo.neighborhood}
                        onChange={handleAddressInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="avenue" className="text-gray-700 dark:text-gray-300 font-medium">
                        Cadde
                      </Label>
                      <Input
                        id="avenue"
                        placeholder="Cadde"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={addressInfo.avenue}
                        onChange={handleAddressInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="street" className="text-gray-700 dark:text-gray-300 font-medium">
                        Sokak
                      </Label>
                      <Input
                        id="street"
                        placeholder="Sokak"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={addressInfo.street}
                        onChange={handleAddressInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="buildingNumber" className="text-gray-700 dark:text-gray-300 font-medium">
                        Bina No
                      </Label>
                      <Input
                        id="buildingNumber"
                        placeholder="Bina No"
                        type="number"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={addressInfo.buildingNumber}
                        onChange={handleAddressInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="apartmentNumber" className="text-gray-700 dark:text-gray-300 font-medium">
                        Daire No
                      </Label>
                      <Input
                        id="apartmentNumber"
                        placeholder="Apartman No"
                        type="number"
                        className="bg-[#f5f0e1] border-[#e8e0d0] focus:border-[#5c4018] focus:ring-[#5c4018] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={addressInfo.apartmentNumber}
                        onChange={handleAddressInfoChange}
                        required
                      />
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
                  className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4`}
                >
                  <h2 className={`text-lg font-semibold ${darkMode ? "text-amber-400" : "text-amber-800"} mb-4`}>
                    Sipariş Geçmişim
                  </h2>

                  {pastOrders.length > 0 ? (
                    <div className="space-y-4">
                      {pastOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          variants={itemVariants}
                          className={`border ${darkMode ? "border-gray-700" : "border-gray-200"} rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                              <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                                {order.restaurantName}
                              </h3>
                              <div className="flex items-center mt-1">
                                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {order.date}
                                </span>
                                <span
                                  className={`ml-3 px-2 py-0.5 rounded-full text-xs ${
                                    order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "processing"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {order.status === "delivered"
                                    ? "Teslim Edildi"
                                    : order.status === "processing"
                                      ? "Hazırlanıyor"
                                      : "Sipariş Alındı"}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center justify-between w-full md:w-auto">
                              <span className={`font-bold ${darkMode ? "text-amber-400" : "text-amber-600"} md:mr-6`}>
                                ₺{order.amount}
                              </span>
                              <button
                                className={`flex items-center ${
                                  darkMode
                                    ? "text-amber-400 hover:text-amber-300"
                                    : "text-amber-600 hover:text-amber-700"
                                } transition-colors duration-200`}
                              >
                                <span className="mr-1 text-sm">Detaylar</span>
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                      <p>Henüz bir sipariş geçmişiniz bulunmuyor.</p>
                      <p className="mt-2 text-sm">
                        Yemek siparişi vermek için{" "}
                        <Link to="/restaurants/browse">
                          <span
                            className={`${
                              darkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-700"
                            } font-medium`}
                          >
                            restoranları keşfedin
                          </span>
                        </Link>
                        .
                      </p>
                    </motion.div>
                  )}

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