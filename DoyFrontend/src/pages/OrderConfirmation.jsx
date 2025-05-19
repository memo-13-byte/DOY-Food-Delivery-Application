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
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "column",
        position: "relative", // Added for footer positioning
      }}
    >
      {/* Üst bar - Full width at the top */}
      <div
        style={{
          backgroundColor: darkMode ? "#333" : "#47300A",
          padding: "0.6rem 1.5rem",
          color: darkMode ? "#fff" : "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
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

      {/* Main content area with 75% width */}
      <div style={{ width: "75%", margin: "0 auto", padding: "2rem 0", paddingBottom: "100px" }}>
        {" "}
        {/* Added padding bottom for footer space */}
        {/* Sipariş Onayı */}
        <div
          style={{
            backgroundColor: darkMode ? "#2c2c2c" : "#fff",
            color: darkMode ? "#fff" : "#000",
            padding: "2rem",
            borderRadius: "20px",
            width: "100%",
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
              <strong>Tahmini Teslimat Süresi:</strong>{" "}
              {restaurant?.time ? `${restaurant.time} dakika` : "30-40 dakika"}
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
      </div>

      {/* Footer - Sticky at the bottom */}
      <footer
        style={{
          width: "100%",
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          position: "fixed",
          bottom: 0,
          left: 0,
          borderTop: darkMode ? "1px solid #333" : "1px solid #eaeaea",
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



// "use client"

// import { useEffect, useState } from "react"
// import { useLocation, Link } from "react-router-dom"
// import { FaCheckCircle, FaStar } from "react-icons/fa"
// import doyLogo from "../assets/doylogo.jpeg"
// import { BsMoon, BsSun } from "react-icons/bs"
// import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6"
// import restaurants from "../services/restaurants.js"

// const statuses = [
//   { label: "Hazırlanıyor 🧑‍🍳", delay: 0 },
//   { label: "Yolda 🛵", delay: 15000 },
//   { label: "Teslim Edildi ✅", delay: 30000 },
// ]

// const iconLinkStyle = (darkMode) => ({
//   color: darkMode ? "#e0e0e0" : "#333",
//   textDecoration: "none",
//   padding: "0.4rem",
//   borderRadius: "50%",
//   transition: "all 0.3s ease",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   transform: "scale(1)",
// })

// const OrderConfirmation = () => {
//   const location = useLocation()

//   // Sipariş onay verilerini localStorage'dan alıyoruz
//   const orderData = (() => {
//     const data = localStorage.getItem("orderConfirmation")
//     return data ? JSON.parse(data) : {}
//   })()

//   const deliveryAddress = orderData.address || "Adres belirtilmedi"
//   const resId = orderData.res?.id
//   const restaurant = restaurants.find((r) => r.id === resId)
//   const cartItems = orderData.cartItems || []

//   // DarkMode durumunu localStorage veya orderData'dan alıyoruz
//   const [darkMode, setDarkMode] = useState(() => {
//     // Önce localStorage'dan dene
//     const savedDarkMode = localStorage.getItem("darkMode")
//     if (savedDarkMode) return JSON.parse(savedDarkMode)
//     // Yoksa orderData'dan al
//     return orderData.darkMode || false
//   })

//   const [currentStatus, setCurrentStatus] = useState(statuses[0].label)
//   const [orderId] = useState(() => Math.floor(100000 + Math.random() * 900000))
//   const [orderTime] = useState(() => new Date().toLocaleString("tr-TR"))
//   const [showRating, setShowRating] = useState(false)
//   const [rating, setRating] = useState(0)

//   const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0)

//   // darkMode değiştiğinde localStorage'a kaydediyoruz
//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode))
//   }, [darkMode])

//   useEffect(() => {
//     const timers = statuses.slice(1).map((status) =>
//       setTimeout(() => {
//         setCurrentStatus(status.label)
//       }, status.delay),
//     )
//     return () => timers.forEach(clearTimeout)
//   }, [])

//   const handleRating = (value) => {
//     setRating(value)
//   }

//   return (
//     <div
//       style={{
//         backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         transition: "all 0.3s ease-in-out",
//       }}
//     >
//       {/* Üst bar */}
//       <div
//         style={{
//           backgroundColor: darkMode ? "#333" : "#47300A",
//           padding: "0.8rem 2rem",
//           color: darkMode ? "#fff" : "white",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           transition: "all 0.3s ease-in-out",
//           width: "100%",
//         }}
//       >
//         <Link to="/" style={{ 
//           textDecoration: "none", 
//           color: "inherit",
//           display: "flex",
//           alignItems: "center",
//           gap: "0.5rem"
//         }}>
//           <div style={{ 
//             fontWeight: "bold", 
//             fontSize: "1.5rem", 
//             cursor: "pointer",
//             transition: "color 0.3s ease",
//             textShadow: "0 1px 2px rgba(0,0,0,0.2)"
//           }}>
//             Doy!
//           </div>
//         </Link>
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <div
//             onClick={() => setDarkMode(!darkMode)}
//             style={{ 
//               display: "flex", 
//               alignItems: "center", 
//               gap: "0.4rem", 
//               cursor: "pointer",
//               padding: "0.3rem",
//               borderRadius: "20px",
//               transition: "background-color 0.3s"
//             }}
//             onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
//             onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
//           >
//             <div
//               style={{
//                 width: "34px",
//                 height: "18px",
//                 borderRadius: "20px",
//                 backgroundColor: "#F8F5DE",
//                 position: "relative",
//                 transition: "background-color 0.3s",
//                 boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "50%",
//                   backgroundColor: darkMode ? "#e8c886" : "#47300A",
//                   position: "absolute",
//                   top: "1px",
//                   left: darkMode ? "17px" : "1px",
//                   transition: "all 0.3s ease",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
//                 }}
//               />
//             </div>
//             {darkMode ? 
//               <BsSun color="#e8c886" size={18} /> : 
//               <BsMoon color="#fff" size={18} />
//             }
//           </div>
//           <div style={{ 
//             fontWeight: "bold",
//             backgroundColor: darkMode ? "rgba(232, 200, 134, 0.2)" : "rgba(255, 255, 255, 0.2)",
//             padding: "0.4rem 0.8rem",
//             borderRadius: "8px",
//             transition: "all 0.3s ease"
//           }}>
//             Customer A
//           </div>
//         </div>
//       </div>

//       {/* Ana İçerik */}
//       <div style={{ 
//         padding: "2rem",
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center"
//       }}>
//         {/* Sipariş Onayı */}
//         <div
//           style={{
//             backgroundColor: darkMode ? "rgba(44, 44, 44, 0.8)" : "#fff",
//             color: darkMode ? "#e0e0e0" : "#000",
//             padding: "2.5rem",
//             borderRadius: "16px",
//             maxWidth: "800px",
//             width: "100%",
//             margin: "1rem auto",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//             textAlign: "center",
//             transition: "all 0.3s ease-in-out",
//             border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "none",
//           }}
//         >
//           <FaCheckCircle size={64} color={darkMode ? "#4CAF50" : "green"} style={{
//             filter: darkMode ? "drop-shadow(0 0 8px rgba(76, 175, 80, 0.5))" : "none",
//             transition: "all 0.3s ease"
//           }} />
//           <h2 style={{ 
//             marginTop: "1.5rem", 
//             fontSize: "2rem",
//             color: darkMode ? "#e8c886" : "#47300A",
//             letterSpacing: "0.5px"
//           }}>
//             Siparişiniz Alındı!
//           </h2>
//           <p style={{ 
//             fontSize: "1.1rem", 
//             marginTop: "0.5rem",
//             color: darkMode ? "#bbb" : "#666"
//           }}>
//             Restoran siparişinizi aldı ve hazırlamaya başladı.
//           </p>

//           {/* Durum Göstergesi */}
//           <div style={{ 
//             marginTop: "2rem",
//             backgroundColor: darkMode ? "rgba(60, 60, 60, 0.5)" : "rgba(240, 240, 240, 0.8)",
//             padding: "1rem",
//             borderRadius: "12px",
//             transition: "all 0.3s ease"
//           }}>
//             <div style={{ 
//               display: "flex", 
//               justifyContent: "space-between",
//               position: "relative",
//               marginBottom: "0.5rem"
//             }}>
//               {statuses.map((status, index) => (
//                 <div key={index} style={{ 
//                   textAlign: "center",
//                   position: "relative",
//                   zIndex: 2,
//                   flex: 1
//                 }}>
//                   <div style={{ 
//                     width: "30px",
//                     height: "30px",
//                     borderRadius: "50%",
//                     backgroundColor: currentStatus === status.label || 
//                       statuses.indexOf(statuses.find(s => s.label === currentStatus)) >= index
//                       ? (darkMode ? "#e8c886" : "#47300A") 
//                       : (darkMode ? "#555" : "#ccc"),
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     margin: "0 auto",
//                     color: "#fff",
//                     fontWeight: "bold",
//                     transition: "all 0.5s ease",
//                     boxShadow: currentStatus === status.label 
//                       ? "0 0 10px rgba(232, 200, 134, 0.5)" 
//                       : "none"
//                   }}>
//                     {index + 1}
//                   </div>
//                   <div style={{ 
//                     marginTop: "0.5rem",
//                     fontSize: "0.8rem",
//                     fontWeight: currentStatus === status.label ? "bold" : "normal",
//                     color: currentStatus === status.label 
//                       ? (darkMode ? "#e8c886" : "#47300A") 
//                       : (darkMode ? "#aaa" : "#777"),
//                     transition: "all 0.3s ease"
//                   }}>
//                     {status.label.split(" ")[0]}
//                   </div>
//                 </div>
//               ))}
              
//               {/* Progress Bar */}
//               <div style={{ 
//                 position: "absolute",
//                 top: "15px",
//                 left: "15px",
//                 right: "15px",
//                 height: "2px",
//                 backgroundColor: darkMode ? "#444" : "#ddd",
//                 zIndex: 1
//               }}>
//                 <div style={{ 
//                   height: "100%",
//                   width: currentStatus === statuses[0].label 
//                     ? "0%" 
//                     : currentStatus === statuses[1].label 
//                       ? "50%" 
//                       : "100%",
//                   backgroundColor: darkMode ? "#e8c886" : "#47300A",
//                   transition: "width 1s ease-in-out"
//                 }} />
//               </div>
//             </div>
//           </div>

//           {/* HARİTA */}
//           <div style={{ 
//             marginTop: "2rem",
//             borderRadius: "12px",
//             overflow: "hidden",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "none",
//           }}>
//             <iframe
//               title="Map"
//               width="100%"
//               height="250"
//               style={{ 
//                 borderRadius: "12px", 
//                 border: 0,
//                 display: "block"
//               }}
//               loading="lazy"
//               allowFullScreen
//               src={`https://maps.google.com/maps?q=${encodeURIComponent(deliveryAddress)}&z=15&output=embed`}
//             />
//           </div>

//           {/* Sipariş Bilgileri */}
//           <div
//             style={{
//               marginTop: "2rem",
//               backgroundColor: darkMode ? "rgba(68, 68, 68, 0.5)" : "rgba(248, 248, 248, 0.8)",
//               borderRadius: "12px",
//               padding: "1.5rem",
//               textAlign: "left",
//               transition: "all 0.3s ease",
//               border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "none",
//             }}
//           >
//             <h3 style={{ 
//               marginBottom: "1rem",
//               color: darkMode ? "#e8c886" : "#47300A",
//               borderBottom: darkMode ? "1px solid #555" : "1px solid #ddd",
//               paddingBottom: "0.5rem"
//             }}>
//               Sipariş Bilgileri
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
//               <p>
//                 <strong>Sipariş ID:</strong> #{orderId}
//               </p>
//               <p>
//                 <strong>Sipariş Tarihi:</strong> {orderTime}
//               </p>
//               <p style={{ gridColumn: "1 / -1" }}>
//                 <strong>Teslimat Adresi:</strong> {deliveryAddress}
//               </p>
//               <p>
//                 <strong>Tahmini Teslimat Süresi:</strong> {restaurant?.time ? `${restaurant.time} dakika` : "30-40 dakika"}
//               </p>
//               <p>
//                 <strong>Durum:</strong> <span style={{ 
//                   color: currentStatus === "Teslim Edildi ✅" 
//                     ? "#4CAF50" 
//                     : currentStatus === "Yolda 🛵" 
//                       ? "#2196F3" 
//                       : "#FF9800",
//                   fontWeight: "bold"
//                 }}>{currentStatus}</span>
//               </p>
//             </div>
//             <hr style={{ 
//               margin: "1rem 0", 
//               border: "none", 
//               borderTop: darkMode ? "1px solid #555" : "1px solid #ddd" 
//             }} />
//             <h4 style={{ 
//               marginBottom: "0.5rem",
//               color: darkMode ? "#e0e0e0" : "#333" 
//             }}>
//               Ürünler:
//             </h4>
//             <ul style={{ 
//               listStyleType: "none", 
//               padding: 0,
//               margin: 0 
//             }}>
//               {cartItems.map((item, i) => (
//                 <li key={i} style={{ 
//                   padding: "0.5rem 0",
//                   borderBottom: i < cartItems.length - 1 
//                     ? (darkMode ? "1px solid #444" : "1px solid #eee") 
//                     : "none",
//                   display: "flex",
//                   justifyContent: "space-between"
//                 }}>
//                   <span>{item.name}</span>
//                   <span style={{ fontWeight: "bold" }}>{item.price} TL</span>
//                 </li>
//               ))}
//             </ul>
//             <p style={{ 
//               fontWeight: "bold", 
//               textAlign: "right", 
//               marginTop: "1rem",
//               fontSize: "1.1rem",
//               color: darkMode ? "#e8c886" : "#47300A"
//             }}>
//               Toplam: {totalAmount} TL
//             </p>
//           </div>

//           {/* Değerlendirme */}
//           {currentStatus === "Teslim Edildi ✅" && !showRating && (
//             <button
//               onClick={() => setShowRating(true)}
//               style={{
//                 marginTop: "2rem",
//                 backgroundColor: darkMode ? "rgba(108, 76, 156, 0.8)" : "#6c4c9c",
//                 color: "white",
//                 padding: "0.75rem 1.5rem",
//                 border: "none",
//                 borderRadius: "12px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 transform: "translateY(0)",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.transform = "translateY(-3px)";
//                 e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
//                 e.target.style.backgroundColor = darkMode ? "rgba(128, 90, 180, 0.8)" : "#805ab4";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.transform = "translateY(0)";
//                 e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
//                 e.target.style.backgroundColor = darkMode ? "rgba(108, 76, 156, 0.8)" : "#6c4c9c";
//               }}
//             >
//               Siparişi Değerlendir
//             </button>
//           )}

//           {showRating && (
//             <div style={{ 
//               marginTop: "2rem",
//               backgroundColor: darkMode ? "rgba(60, 60, 60, 0.5)" : "rgba(240, 240, 240, 0.8)",
//               padding: "1.5rem",
//               borderRadius: "12px",
//               transition: "all 0.3s ease",
//               animation: "fadeIn 0.5s ease-out"
//             }}>
//               <p style={{ 
//                 fontWeight: "bold",
//                 marginBottom: "1rem",
//                 fontSize: "1.1rem",
//                 color: darkMode ? "#e0e0e0" : "#333"
//               }}>
//                 Memnuniyetinizi değerlendirin:
//               </p>
//               <div style={{ 
//                 display: "flex", 
//                 justifyContent: "center", 
//                 gap: "0.8rem",
//                 marginBottom: "1rem"
//               }}>
//                 {[1, 2, 3, 4, 5].map((num) => (
//                   <FaStar
//                     key={num}
//                     size={36}
//                     color={num <= rating ? "#ffcc00" : darkMode ? "#555" : "#ccc"}
//                     onClick={() => handleRating(num)}
//                     style={{
//                       cursor: "pointer",
//                       transition: "all 0.3s ease",
//                       transform: num <= rating ? "scale(1.2)" : "scale(1)",
//                       filter: num <= rating ? "drop-shadow(0 0 3px rgba(255, 204, 0, 0.5))" : "none"
//                     }}
//                     onMouseEnter={(e) => {
//                       if (num > rating) {
//                         e.target.style.color = "#ffdd55";
//                         e.target.style.transform = "scale(1.1)";
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (num > rating) {
//                         e.target.style.color = darkMode ? "#555" : "#ccc";
//                         e.target.style.transform = "scale(1)";
//                       }
//                     }}
//                   />
//                 ))}
//               </div>
//               {rating > 0 && (
//                 <p style={{ 
//                   marginTop: "1rem",
//                   color: darkMode ? "#e8c886" : "#47300A",
//                   fontWeight: "bold",
//                   animation: "fadeIn 0.5s ease-out"
//                 }}>
//                   Teşekkürler! {rating} yıldız verdiniz ⭐
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer
//         style={{
//           marginTop: "auto",
//           padding: "1.5rem 2rem",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
//           transition: "all 0.3s ease-in-out",
//           borderTop: darkMode ? "1px solid #333" : "1px solid #e0e0e0",
//           width: "100%",
//         }}
//       >
//         {/* Sol: Logo */}
//         <img
//           src={doyLogo || "/placeholder.svg"}
//           alt="Logo"
//           style={{
//             height: "50px",
//             width: "50px",
//             borderRadius: "50%",
//             objectFit: "cover",
//             transition: "transform 0.3s ease",
//           }}
//           onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
//           onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
//         />

//         {/* Sağ: Sosyal Medya */}
//         <div style={{ display: "flex", gap: "1.5rem" }}>
//           <a 
//             href="https://twitter.com" 
//             target="_blank" 
//             rel="noopener noreferrer" 
//             style={iconLinkStyle(darkMode)}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
//               e.target.style.transform = "scale(1.15)";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = "transparent";
//               e.target.style.transform = "scale(1)";
//             }}
//           >
//             <FaXTwitter size={24} />
//           </a>
//           <a 
//             href="https://instagram.com" 
//             target="_blank" 
//             rel="noopener noreferrer" 
//             style={iconLinkStyle(darkMode)}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
//               e.target.style.transform = "scale(1.15)";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = "transparent";
//               e.target.style.transform = "scale(1)";
//             }}
//           >
//             <FaInstagram size={24} />
//           </a>
//           <a 
//             href="https://youtube.com" 
//             target="_blank" 
//             rel="noopener noreferrer" 
//             style={iconLinkStyle(darkMode)}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
//               e.target.style.transform = "scale(1.15)";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = "transparent";
//               e.target.style.transform = "scale(1)";
//             }}
//           >
//             <FaYoutube size={24} />
//           </a>
//           <a 
//             href="https://linkedin.com" 
//             target="_blank" 
//             rel="noopener noreferrer" 
//             style={iconLinkStyle(darkMode)}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
//               e.target.style.transform = "scale(1.15)";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = "transparent";
//               e.target.style.transform = "scale(1)";
//             }}
//           >
//             <FaLinkedin size={24} />
//           </a>
//         </div>
//       </footer>
//     </div>
//   )
// }

// export default OrderConfirmation