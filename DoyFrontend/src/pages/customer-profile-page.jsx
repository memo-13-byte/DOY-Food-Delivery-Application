"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { Moon, Edit2, AlertTriangle, User, Phone, Mail, MapPin, LogOut, Check, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { getCustomerById, getUserById } from "../services/profileData"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import axios from "axios"

export default function CustomerProfilePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const customerId = params.id
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch customer data by ID
  const [user, setUser] = useState(
    {
      id: 0,
      firstname: " ",
      lastname: " ",
      email: " ",
      phoneNumber: " ",
      role: " ",
      address: "",
    }) 

  // Form state for profile update
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
    let userData
    const loadUser = async () => {
      try {
        userData = await getUserById(customerId)
        userData.name = userData.firstname + " " + userData.lastname
        setUser(userData)
        setFormData(userData)
      } catch (error) {
        console.error("Error: " + error)
      }
    }

    loadUser()
    
    
  }, []);

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
    // Here you would normally send a request to the API

    try {
      const response = await axios.put(`http://localhost:8080/api/users/customers/update/${user.email}`, formData)
      console.log(formData)
      setUser({
        ...user,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
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
    } catch (error) {
      console.error("Error: " + error)
    }
    
    
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
    // Logout operations - token clearing etc.
    navigate("/")
  }

  // Get user's order history
  const pastOrders = user.orders || [
    { id: "ORD-1234", date: "10.04.2025", restaurantName: "Kebapçı Mehmet", status: "delivered", amount: "120" },
    { id: "ORD-1233", date: "08.04.2025", restaurantName: "Pizza Evi", status: "delivered", amount: "95" },
    { id: "ORD-1232", date: "05.04.2025", restaurantName: "Çiğköfteci Ali", status: "processing", amount: "45" },
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
            {/* Dark mode toggle button */}
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

                    <div>
                      <label
                        className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 flex items-center font-medium`}
                      >
                        <MapPin className="h-4 w-4 mr-2" /> Adres
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="address"
                          value={"user.address"}
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
                  </motion.div>

                  {/* Delivery Preference */}
                  {/*<motion.div variants={itemVariants} className="mb-6">
                    <label
                      className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-2 font-medium`}
                    >
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
                  </motion.div>*/}

                  {/* Allergens */}
                  {/*<motion.div variants={itemVariants} className="mb-6">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-500"} mr-2`} />
                      <label className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} font-medium`}>
                        Alerjenler (Lütfen alerjik olduğunuz besinleri seçin)
                      </label>
                    </div>

                    <div
                      className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 transition-colors duration-200`}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-1"
                            checked={allergens[1]}
                            onChange={() => handleAllergenChange(1)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-1" className="text-sm">
                            Süt ve Süt Ürünleri
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-2"
                            checked={allergens[2]}
                            onChange={() => handleAllergenChange(2)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-2" className="text-sm">
                            Yumurta
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-3"
                            checked={allergens[3]}
                            onChange={() => handleAllergenChange(3)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-3" className="text-sm">
                            Fıstık
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-4"
                            checked={allergens[4]}
                            onChange={() => handleAllergenChange(4)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-4" className="text-sm">
                            Kabuklu Deniz Ürünleri
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-5"
                            checked={allergens[5]}
                            onChange={() => handleAllergenChange(5)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-5" className="text-sm">
                            Buğday/Gluten
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-6"
                            checked={allergens[6]}
                            onChange={() => handleAllergenChange(6)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-6" className="text-sm">
                            Soya
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-7"
                            checked={allergens[7]}
                            onChange={() => handleAllergenChange(7)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-7" className="text-sm">
                            Balık
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-8"
                            checked={allergens[8]}
                            onChange={() => handleAllergenChange(8)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-8" className="text-sm">
                            Kereviz
                          </label>
                        </motion.div>
                        <motion.div
                          className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "hover:bg-gray-600" : "hover:bg-amber-100"} transition-colors duration-200`}
                          whileHover={{ x: 5 }}
                        >
                          <input
                            type="checkbox"
                            id="allergen-9"
                            checked={allergens[9]}
                            onChange={() => handleAllergenChange(9)}
                            className={`rounded ${darkMode ? "bg-gray-600 border-gray-500" : "bg-amber-50 border-amber-200"} text-amber-500 focus:ring-amber-500`}
                          />
                          <label htmlFor="allergen-9" className="text-sm">
                            Kuruyemiş
                          </label>
                        </motion.div>
                      </div>
                    </div>*/}

                    {/* Selected Allergens */}
                    
                    {/*<div className="flex flex-wrap gap-2 mt-4">
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
                            {id === 1 && "Süt ve Süt Ürünleri"}
                            {id === 2 && "Yumurta"}
                            {id === 3 && "Fıstık"}
                            {id === 4 && "Kabuklu Deniz Ürünleri"}
                            {id === 5 && "Buğday/Gluten"}
                            {id === 6 && "Soya"}
                            {id === 7 && "Balık"}
                            {id === 8 && "Kereviz"}
                            {id === 9 && "Kuruyemiş"}
                          </span>
                        </motion.div>
                      ))}
                    </div>}
                  </motion.div>*/}

                  {/* Password Change */}
                  
                  {/*<motion.div variants={itemVariants} className="mb-6">
                    <div className="border-t pt-4 mb-4">
                      <h2 className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                        Şifre Değiştir
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 font-medium`}
                        >
                          Mevcut Şifre
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={"formData.currentPassword"}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                          placeholder="Mevcut şifreniz"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 font-medium`}
                        >
                          Yeni Şifre
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={"formData.newPassword"}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                          placeholder="Yeni şifreniz"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-1 font-medium`}
                        >
                          Şifre Onayı
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={"formData.confirmPassword"}
                          onChange={handleInputChange}
                          className={`w-full ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-50 border-amber-100"} border rounded-md py-3.5 px-5 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none transition-all duration-200`}
                          placeholder="Yeni şifrenizi tekrar girin"
                        />
                      </div>
                    </div>
                  </motion.div>*/}

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
