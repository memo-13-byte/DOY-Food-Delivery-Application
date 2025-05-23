import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsMoon } from "react-icons/bs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");

  const address = location.state?.address;
  const total = location.state?.total;
  const [darkMode, setDarkMode] = useState(location.state?.darkMode || false);

  const cartItems = location.state?.cartItems || [];
  const restaurant = location.state?.res;

  const handleAccept = () => {
    if (code.trim() === "") return alert("Lütfen kodu girin");

    const hasNumber = /\d/.test(code);

    navigate("/payment-result", {
      state: {
        success: hasNumber,
        address: address,
        total: total,
        cartItems: cartItems,
        darkMode: darkMode,
        restaurant : restaurant
      }
    });
  };

  const handleReject = () => {
    navigate("/payment-result", {
      state: {
        success: false,
        address: address,
        total: total,
        darkMode: darkMode
      }
    });
  };

  return (
      <div style={{ backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6", minHeight: "100vh", display: "flex", flexDirection: "column", color: darkMode ? "#fff" : "#000" }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

        {/* Kod giriş kutusu */}
        <div style={{ padding: "3rem", maxWidth: "600px", margin: "auto", backgroundColor: darkMode ? "#2c2c2c" : "#fff", borderRadius: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Ödeme Kodunu Girin</h2>
          <p style={{ textAlign: "center" }}>Telefonunuza gelen 6 haneli kodu girerek işlemi onaylayın.</p>
          <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örnek: 123456"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1.1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginTop: "1rem",
                marginBottom: "2rem",
                backgroundColor: darkMode ? "#1c1c1c" : "#fff",
                color: darkMode ? "#fff" : "#000"
              }}
          />
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
                onClick={handleAccept}
                style={{
                  backgroundColor: "#6c4c9c",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
            >
              Kabul Et
            </button>
            <button
                onClick={handleReject}
                style={{
                  backgroundColor: "#7A0000",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
            >
              Reddet
            </button>
          </div>
        </div>
        <Footer darkMode={darkMode}></Footer>
      </div>
  );
};

export default Checkout;