"use client"

import { useState,useEffect } from "react"
import { Link, useLocation, useNavigate,useParams } from "react-router-dom"
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
import AuthorizedRequest from "../services/AuthorizedRequest"
import { getResponseErrors } from "../services/exceptionUtils"
import Header from "../components/Header"
import Footer from "../components/Footer"
import DoyLogo from "../components/DoyLogo"


export default function RestaurantProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {id:restaurantId} = useParams()
  const [restaurantEmail, setRestaurantEmail] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [governmentId, setGovernmentId] = useState("")
  const [ownersRestaurant, setOwnersRestaurant] = useState("")
  const [errorMessages, setErrorMessages] = useState([])
  const fromAdmin = restaurantId !== undefined;

  // Restoran verilerini ID'ye göre al
  const [restaurant, setRestaurant] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    governmentId: "",
    restaurantId: "",
  })
  const [editableData, setEditableData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
  })
  const [showAlert, setShowAlert] = useState(false)


  useEffect(() => {

    const loadRestaurantOwnerById = async () => {
      let loadedEmail = "";
      if (restaurantId !== undefined) {
      const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/get-by-id/${restaurantId}`)
      console.log(response.data);
      setRestaurantEmail(response.data.email);
      loadedEmail = response.data.email;
    }else{
      setRestaurantEmail(localStorage.getItem("email"));
      loadedEmail = localStorage.getItem("email");
    }

      const response = (await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/restaurant-owners/get-by-email/${loadedEmail}`)).data

      const data = {
        firstname: response.firstname,
        lastname: response.lastname,
        phoneNumber: response.phoneNumber,
        email: response.email
      }
      console.log(data)
      setRestaurant(data)
      setEditableData(data)
      setGovernmentId(response.governmentId)
      
      const response2 = await AuthorizedRequest.getRequest(`http://localhost:8080/api/restaurant/get/${response.restaurantId}`)
      setOwnersRestaurant(response2.data.restaurantName)
    }

    loadRestaurantOwnerById()

  }, [restaurantEmail])


  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/")
  }

  const handleManageMenu = () => {
    navigate(`/restaurants/manage`)
  }

  const handleUpdateProfile = async() => {
    setErrorMessages([])
    try {
      console.log(editableData)
      await AuthorizedRequest.putRequest(`http://localhost:8080/api/users/restaurant-owners/update/${restaurantEmail}`, {
        ...editableData,
        governmentId: governmentId,
        role: "RESTAURANT_OWNER"
      })
    } catch (error) {
      setErrorMessages(getResponseErrors(error))
    }
    if (true) {
      // In a real application, this would send the updated data to an API

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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

      <DoyLogo></DoyLogo>

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
            {ownersRestaurant}
          </motion.h2>

          {/* Manage Menu Button */}
          {!fromAdmin && <div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
                onClick={handleManageMenu}
                className={`w-full ${darkMode ? "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9] !text-white"  : "bg-gradient-to-r from-[#fbbe24] to-[#fbbe24] hover:from-[#d49a08] hover:to-[#d49a08] !text-amber-900"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Menüyü Yönet
            </Button>
          </motion.div>

          <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
            <Button
                onClick={() => {
                  navigate(`/restaurant/profile/${restaurantId}/orders`)
                }}
                className={`w-full ${darkMode ? "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9] !text-white"  : "bg-gradient-to-r from-[#fbbe24] to-[#fbbe24] hover:from-[#d49a08] hover:to-[#d49a08] !text-amber-900"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Gelen Siparişleri Gör
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {navigate(`/restaurant/profile/${restaurantId}/orders-status`)}}
              className={`w-full ${darkMode ? "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9] !text-white"  : "bg-gradient-to-r from-[#fbbe24] to-[#fbbe24] hover:from-[#d49a08] hover:to-[#d49a08] !text-amber-900"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Hazırlanmış Siparişleri Gör
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {navigate(`/restaurant/profile/${restaurantId}/comments`)}}
              className={`w-full ${darkMode ? "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9] !text-white"  : "bg-gradient-to-r from-[#fbbe24] to-[#fbbe24] hover:from-[#d49a08] hover:to-[#d49a08] !text-amber-900"} text-white font-medium mb-6 py-6 text-base shadow-md transition-all duration-200`}
            >
              Puanlandırma ve Değerlendirmeleri Gör
            </Button>
          </motion.div>  </div>}



          {/* Restaurant Information */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className="space-y-5 mb-8 w-full max-w-4xl mx-auto"
          >
            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Restoran Sahibinin Adı
              </label>
              <div className="flex group">
                <input
                  type="text"
                  value={editableData.firstname}
                  onChange={(e) => setEditableData({ ...editableData, firstname: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border rounded-md py-3 px-4 text-sm transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Restoran Sahibinin Soyadı
              </label>
              <div className="flex group">
                <input
                  type="text"
                  value={editableData.lastname}
                  onChange={(e) => setEditableData({ ...editableData, lastname: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border rounded-md py-3 px-4 text-sm transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Restoran Sahibinin Telefonu
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
                  value={editableData.phoneNumber}
                  onChange={(e) => setEditableData({ ...editableData, phoneNumber: e.target.value })}
                  className={`w-full ${
                    darkMode ? "bg-[#333] border-gray-600 text-white" : "bg-[#F2E8D6] border-amber-100"
                  } border-y border-r py-3 px-4 text-sm rounded-r-md transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-[#6b4b10]"} mb-1 font-medium`}>
                Restoran Sahibinin Email Adresi
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
                  disabled
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
                Restoran Sahibinin TC Kimlik Numarası
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
                  readOnly
                  value={governmentId}
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


          {/* Buttons */}
          {
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
              className={`py-2 px-4 rounded-md font-medium transition-all duration-200 ${darkMode ? "bg-gradient-to-r from-[#6c5ce7] to-[#5b4bc9] hover:from-[#5b4bc9] hover:to-[#4a3ab9] !text-white"  : "bg-gradient-to-r from-[#fbbe24] to-[#fbbe24] hover:from-[#d49a08] hover:to-[#d49a08] !text-amber-900"}`}
            >
              Profili Güncelle
            </motion.button>
{
  !fromAdmin && <motion.button
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
}

          </motion.div>
          }

        </motion.div>
      </div>

      <Footer darkMode={darkMode}></Footer>

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
              <span>{errorMessages.length === 0? "Profil başarıyla güncellendi!" : "Hata!"} </span>
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
