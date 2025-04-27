"use client"

import { useState } from "react"
import { FaStar, FaRegStar } from "react-icons/fa"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6"
import { BsMoon } from "react-icons/bs"
// Changed from wouter to react-router-dom
import { useNavigate, useLocation } from "react-router-dom"
import { FaLocationDot } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa"
import { HiOutlineHome } from "react-icons/hi"
import LocationModal from "../components/ui/LocationModal"
import { useEffect } from "react"
import axios from "axios"

const renderStars = (rating) => {
  const stars = []
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  for (let i = 0; i < full; i++) stars.push(<FaStar key={`f-${i}`} color="#ffcc00" />)
  if (half) stars.push(<FaStar key="half" color="#ffcc00" style={{ opacity: 0.5 }} />)
  while (stars.length < 5) stars.push(<FaRegStar key={`e-${stars.length}`} color="#ffcc00" />)
  return stars
}

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  // Replace wouter's useLocation with react-router-dom's useNavigate
  const navigate = useNavigate()
  const location = useLocation() // This is now react-router-dom's useLocation
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [searchText, setSearchText] = useState("")
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [minRating, setMinRating] = useState(0)

  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3

  const paginatedRestaurants = filteredRestaurants.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const iconLinkStyle = {
    color: "inherit",
    textDecoration: "none",
    padding: "0.4rem",
    borderRadius: "50%",
    transition: "background-color 0.3s",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  useEffect(() => {
    const getRestaurantsFromBackend = async () => {
      console.log(minRating.toString())
      const response = await axios.get("http://localhost:8080/api/restaurant/search", {
        params: {
          key1: searchText,
          key2: minRating.toString(),
        },
      })

      const data = response.data.content

      setFilteredRestaurants(data)
      if (data != null) {
        const results = data
          .filter(
            (res) => res.restaurantName.toLowerCase().includes(searchText.toLowerCase()) && res.rating >= minRating,
          )
          .sort((a, b) => b.rating - a.rating) // ⭐️ büyükten küçüğe sırala
        console.log("results" + results)
        setFilteredRestaurants(results)
        setCurrentPage(0)
      }
    }

    getRestaurantsFromBackend()
  }, [searchText, minRating])

  const handleSwipe = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX

      if (diff > 1000 && (currentPage + 1) * itemsPerPage < filteredRestaurants.length) {
        setCurrentPage((prev) => prev + 1)
      } else if (diff < -1000 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
      }
    }

    setTouchStartX(null)
    setTouchEndX(null)
  }

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ÜST BAR */}
      <div
        style={{
          backgroundColor: darkMode ? "#333" : "#47300A",
          color: darkMode ? "#fff" : "white",
          padding: "0.6rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Sol - Doy! yazısı */}
        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Doy!</div>

        {/* Sağ - Toggle + simge + Kayıt/Giriş */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Toggle + BsMoon */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
          >
            <div
              style={{
                width: "34px",
                height: "18px",
                borderRadius: "20px",
                backgroundColor: "#F8F5DE",
                position: "relative",
                transition: "background-color 0.3s",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#000",
                  position: "absolute",
                  top: "1px",
                  left: darkMode ? "17px" : "1px",
                  transition: "left 0.3s",
                }}
              />
            </div>
            <BsMoon color={darkMode ? "#000" : "#fff"} size={18} />
          </div>

          {/* Kayıt / Giriş birlikte kutu */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#F8F5DE",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => navigate("/auth")} // Changed from setLocation to navigate
              style={{
                padding: "0.3rem 0.8rem",
                backgroundColor: "#F8F5DE",
                color: "#000",
                fontWeight: "bold",
                border: "none",
                borderRight: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              KAYIT
            </button>
            <button
              onClick={() => navigate("/auth")} // Changed from setLocation to navigate
              style={{
                padding: "0.3rem 0.8rem",
                backgroundColor: "#F8F5DE",
                color: "#000",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              GİRİŞ
            </button>
          </div>
        </div>
      </div>

      {/* ALT BAR - Konum seç alanı */}
      <div
        style={{
          backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
          padding: "1.5rem 3rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Logo */}
        <img src={"/image1.png" || "/placeholder.svg"} alt="logo" style={{ height: "180px", borderRadius: "50%" }} />

        {/* Kutu ve yazıyı saran div */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
          {/* Konumunu seç yazısı */}
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <span
              style={{
                fontWeight: "800",
                fontSize: "1.1rem",
              }}
            >
              Konumunu seç, karnın doysun!
            </span>
          </div>

          {/* Adres kutusu */}
          <div
            onClick={() => setModalOpen(true)}
            style={{
              backgroundColor: darkMode ? "#444" : "#E8C58C",
              color: darkMode ? "#fff" : "#000",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderTopRightRadius: "30px",
              borderBottomRightRadius: "30px",
              padding: "0.6rem 1.5rem",
              marginTop: "0.5rem",
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              justifyContent: "flex-start",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>➔</span>
            <FaLocationDot size={18} color={darkMode ? "#fff" : "#000"} /> {/* ikonu da güncelledik */}
            <span style={{ fontWeight: "400", fontSize: "1rem" }}>
              {selectedAddress || "Adresini Belirle veya Seç"}
            </span>
          </div>
        </div>
      </div>

      {/* ALT GEÇİŞ ŞERİDİ */}
      <div
        style={{
          height: "2px",
          backgroundColor: "#47300A",
          width: "100%",
        }}
      />

      <div style={{ padding: "2rem 1rem", textAlign: "center", position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: "60%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
              style={{
                width: "200px",
                accentColor: darkMode ? "#FFD700" : "#47300A",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: darkMode ? "#FFD700" : "#47300A",
                minWidth: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {minRating.toFixed(1)} {renderStars(minRating)}
            </span>
          </div>

          <input
            type="text"
            placeholder="Restoran Ara"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 2.2rem 0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "20px",
              border: "1px solid #ccc",
              textAlign: "center",
              fontWeight: "300",
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "6px",
              top: "65%",
              transform: "translateY(-50%)",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />

          {/* Arama Sonuçları */}
          {searchText && filteredRestaurants.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "105%",
                left: 0,
                right: 0,
                backgroundColor: darkMode ? "#2b2b2b" : "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "0.5rem 1rem",
                zIndex: 10,
                animation: "fadeSlideDown 0.6s ease-in-out",
                animationFillMode: "forwards",
                maxHeight: "300px",
                overflowY: "auto",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {filteredRestaurants.slice(0, 3).map((r, index) => (
                <div
                  key={r.id}
                  onClick={() =>
                    // Changed from setLocation to navigate with state
                    navigate(`/restaurant/${r.id}`, {
                      state: { restaurant: r, selectedAddress, darkMode },
                    })
                  }
                  style={{
                    padding: "0.6rem 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc",
                    transition: "background 0.2s",
                    animation: "fadeInItem 0.5s ease forwards",
                    animationDelay: `${index * 0.2}s`, // sırayla gelsin
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "#3b3b3b" : "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {r.restaurantName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Sizin için önerilen restoranlar</h2>

      {/* Sayfalama Butonları (modern oklar) */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          style={{
            backgroundColor: "transparent",
            border: `2px solid ${darkMode ? "#fff" : "#000"}`,
            borderRadius: "50%",
            padding: "0.6rem",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            opacity: currentPage === 0 ? 0.3 : 1,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <FaArrowLeft color={darkMode ? "#fff" : "#000"} size={18} />
        </button>

        <span
          style={{
            color: darkMode ? "#fff" : "#000",
            fontWeight: "bold",
            fontSize: "1rem",
            alignSelf: "center",
          }}
        >
          {currentPage + 1} / {Math.ceil(filteredRestaurants.length / itemsPerPage)}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => ((prev + 1) * itemsPerPage < filteredRestaurants.length ? prev + 1 : prev))
          }
          disabled={(currentPage + 1) * itemsPerPage >= filteredRestaurants.length}
          style={{
            backgroundColor: "transparent",
            border: `2px solid ${darkMode ? "#fff" : "#000"}`,
            borderRadius: "50%",
            padding: "0.6rem",
            cursor: (currentPage + 1) * itemsPerPage >= filteredRestaurants.length ? "not-allowed" : "pointer",
            opacity: (currentPage + 1) * itemsPerPage >= filteredRestaurants.length ? 0.3 : 1,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <FaArrowRight color={darkMode ? "#fff" : "#000"} size={18} />
        </button>
      </div>

      {/* Restoran Kartları */}
      <div
        style={{
          backgroundColor: darkMode ? "#2b2b2b" : "#FFFFFF",
          margin: "0 2rem",
          padding: "2rem",
          borderRadius: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div
          onTouchStart={(e) => setTouchStartX(e.changedTouches[0].clientX)}
          onTouchEnd={(e) => {
            setTouchEndX(e.changedTouches[0].clientX)
            handleSwipe()
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {paginatedRestaurants.map((res) => (
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
              <HiOutlineHome size={48} style={{ opacity: 0.4 }} />
              <div style={{ flexGrow: 1, marginLeft: "1rem" }}>
                <h3 style={{ margin: 0 }}>{res.restaurantName}</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {renderStars(res.rating)}
                </div>
              </div>
              <button
                onClick={() =>
                  // Changed from setLocation to navigate with state
                  navigate(`/restaurant/${res.id}`, {
                    state: { restaurant: res, selectedAddress, darkMode },
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
        {filteredRestaurants.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "2rem", fontWeight: "bold" }}>Uygun restoran bulunamadı.</p>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "2rem",
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <img
          src={"image1.png" || "/placeholder.svg"}
          alt="Logo alt"
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLinkStyle}
            className="icon-link"
          >
            <FaXTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLinkStyle}
            className="icon-link"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLinkStyle}
            className="icon-link"
          >
            <FaYoutube size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={iconLinkStyle}
            className="icon-link"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </footer>

      {modalOpen && (
        <LocationModal
          onClose={() => setModalOpen(false)}
          onLocationSelect={(addr) => setSelectedAddress(addr)}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default Home
