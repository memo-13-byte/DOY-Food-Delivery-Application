"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { Moon, Edit2, AlertTriangle, User, Phone, Mail, MapPin, LogOut, Check, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import {getUserByToken} from "../services/profileData"
import { FaStar, FaRegStar } from "react-icons/fa"
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

export default function FavoriteRestaurantPage() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([])
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
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserByToken()
        userData.name = userData.firstname + " " + userData.lastname
        setUser(userData)
        console.log(userData)
      } catch (error) {
        console.error("Error: " + error)
      }
    }
    loadUser()
  },[])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Optional: persist the theme in localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const renderStars = (rating) => {
    const stars = []
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f-${i}`} color="#ffcc00" />)
    if (half) stars.push(<FaStar key="half" color="#ffcc00" style={{ opacity: 0.5 }} />)
    while (stars.length < 5) stars.push(<FaRegStar key={`e-${stars.length}`} color="#ffcc00" />)
    return stars
  }

  useEffect(() => {
    const fetchFavoriteRestaurants = async () => {
        const token = localStorage.getItem("token")
        const userResponse = await axios.get(`http://localhost:8080/api/restaurant/favorite`, 
          { headers: { Authorization: `Bearer ${token}` } })
        setFavoriteRestaurants(userResponse.data)
    }
    fetchFavoriteRestaurants()
  },[user])



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
              <div className="flex justify-center py-10">
          <div className="w-40 h-40 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-xl p-2 transform hover:scale-105 transition-transform duration-300">
            <img src="/image1.png" alt="DOY Logo" className="w-36 h-36 rounded-full object-cover" />
          </div>
        </div>

      {/* Profile Content */}
      <div className="flex-grow flex justify-center items-start px-4 pb-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`w-full md:w-4/5 max-w-5xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-6 shadow-xl max-h-[70vh] flex flex-col`}
        >
          <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}>
            Favori Restoranlarım
          </h1>
          <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 4rem)" }}>
            {favoriteRestaurants.map((res) => (
              <div
                key={res.id}
                style={{
                  backgroundColor: darkMode ? "#3b3b3b" : "#ffffff",
                  padding: "1rem",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 0 8px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <img
                  src={res.imageId ? `http://localhost:8080/api/upload/image/${res.imageId}` : "/placeholder.svg"}
                  alt={res.restaurantName}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    marginRight: "1rem",
                  }}
                />
                <div style={{ flexGrow: 1, marginLeft: "1rem" }}>
                  <h3 style={{ margin: 0 }}>{res.restaurantName}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {renderStars(res.rating)}
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/restaurant/${res.id}`, {
                      state: { restaurant: res, darkMode },
                    })
                  }
                  style={{
                    backgroundColor: "#7A0000",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Sipariş Ver
                </button>
              </div>

            ))}
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