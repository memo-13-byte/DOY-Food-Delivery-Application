"use client"

import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { FaCheckCircle, FaStar } from "react-icons/fa"
import doyLogo from "../assets/doylogo.jpeg"
import { BsMoon } from "react-icons/bs"
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6"
import restaurants from "../services/restaurants.js"

const statuses = [
  { label: "Hazırlanıyor 🧑‍🍳", delay: 0 },
  { label: "Yolda 🛵", delay: 15000 },
  { label: "Teslim Edildi ✅", delay: 30000 },
]

const iconLinkStyle = (darkMode) => ({
  color: darkMode ? "#fff" : "#000",
  textDecoration: "none",
  padding: "0.4rem",
  borderRadius: "50%",
  transition: "transform 0.3s",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const OrderConfirmation = () => {
  const location = useLocation()

  // Sipariş onay verilerini localStorage'dan alıyoruz
  const orderData = (() => {
    const data = localStorage.getItem("orderConfirmation")
    return data ? JSON.parse(data) : {}
  })()

  const deliveryAddress = orderData.address || "Adres belirtilmedi"
  const resId = orderData.res?.id
  const restaurant = restaurants.find((r) => r.id === resId)
  const cartItems = orderData.cartItems || []

  // DarkMode durumunu localStorage veya orderData'dan alıyoruz
  const [darkMode, setDarkMode] = useState(() => {
    // Önce localStorage'dan dene
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) return JSON.parse(savedDarkMode)
    // Yoksa orderData'dan al
    return orderData.darkMode || false
  })

  const [currentStatus, setCurrentStatus] = useState(statuses[0].label)
  const [orderId] = useState(() => Math.floor(100000 + Math.random() * 900000))
  const [orderTime] = useState(() => new Date().toLocaleString("tr-TR"))
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0)

  // darkMode değiştiğinde localStorage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    const timers = statuses.slice(1).map((status) =>
      setTimeout(() => {
        setCurrentStatus(status.label)
      }, status.delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleRating = (value) => {
    setRating(value)
  }

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1a1a1a" : "#F2E8D6",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Üst bar */}
      <div
        style={{
          backgroundColor: darkMode ? "#333" : "#47300A",
          padding: "0.6rem 1.5rem",
          color: darkMode ? "#fff" : "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }}>Doy!</div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
          <div style={{ fontWeight: "bold" }}>Customer A</div>
        </div>
      </div>

      {/* Sipariş Onayı */}
      <div
        style={{
          backgroundColor: darkMode ? "#2c2c2c" : "#fff",
          color: darkMode ? "#fff" : "#000",
          padding: "2rem",
          borderRadius: "20px",
          maxWidth: "700px",
          margin: "2rem auto",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <FaCheckCircle size={48} color="green" />
        <h2 style={{ marginTop: "1rem" }}>Siparişiniz Alındı!</h2>
        <p>Restoran siparişinizi aldı ve hazırlamaya başladı.</p>

        {/* HARİTA */}
        <div style={{ marginTop: "1.5rem" }}>
          <iframe
            title="Map"
            width="100%"
            height="250"
            style={{ borderRadius: "12px", border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(deliveryAddress)}&z=15&output=embed`}
          />
        </div>

        {/* Sipariş Bilgileri */}
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: darkMode ? "#444" : "#f8f8f8",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Sipariş Bilgileri</h3>
          <p>
            <strong>Sipariş ID:</strong> #{orderId}
          </p>
          <p>
            <strong>Sipariş Tarihi:</strong> {orderTime}
          </p>
          <p>
            <strong>Teslimat Adresi:</strong> {deliveryAddress}
          </p>
          <p>
            <strong>Tahmini Teslimat Süresi:</strong> {restaurant?.time ? `${restaurant.time} dakika` : "30-40 dakika"}
          </p>
          <p>
            <strong>Durum:</strong> {currentStatus}
          </p>
          <hr />
          <h4>Ürünler:</h4>
          <ul>
            {cartItems.map((item, i) => (
              <li key={i}>
                {item.name} - {item.price} TL
              </li>
            ))}
          </ul>
          <p style={{ fontWeight: "bold" }}>Toplam: {totalAmount} TL</p>
        </div>

        {/* Değerlendirme */}
        {currentStatus === "Teslim Edildi ✅" && !showRating && (
          <button
            onClick={() => setShowRating(true)}
            style={{
              marginTop: "2rem",
              backgroundColor: "#6c4c9c",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Siparişi Değerlendir
          </button>
        )}

        {showRating && (
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontWeight: "bold" }}>Memnuniyetinizi değerlendirin:</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  size={32}
                  color={num <= rating ? "#ffcc00" : "#ccc"}
                  onClick={() => handleRating(num)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    transform: num <= rating ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            {rating > 0 && <p style={{ marginTop: "0.5rem" }}>Teşekkürler! {rating} yıldız verdiniz ⭐</p>}
          </div>
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
        }}
      >
        {/* Sol: Logo */}
        <img
          src={doyLogo || "/placeholder.svg"}
          alt="Logo"
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {/* Sağ: Sosyal Medya */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaXTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaInstagram size={24} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaYoutube size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}>
            <FaLinkedin size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default OrderConfirmation
