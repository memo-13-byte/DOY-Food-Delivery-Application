import React from "react";
import { BsMoon } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import doyLogo from "../assets/doylogo.jpeg";
import DoyLogo from "./DoyLogo";

const RestaurantNavbar = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            backgroundColor: darkMode ? "#333" : "#47300A",
            color: darkMode ? "#fff" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.6rem 1.5rem",
            transition: "all 0.3s ease-in-out"
        }}>
            <DoyLogo></DoyLogo>

            {/* Sağ Kısım */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Dark mode toggle */}
                <div
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
                >
                    <div style={{
                        width: "34px",
                        height: "18px",
                        borderRadius: "20px",
                        backgroundColor: "#F8F5DE",
                        position: "relative",
                        transition: "background-color 0.3s"
                    }}>
                        <div style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#000",
                            position: "absolute",
                            top: "1px",
                            left: darkMode ? "17px" : "1px",
                            transition: "left 0.3s"
                        }} />
                    </div>
                    <BsMoon color={darkMode ? "#fff" : "#000"} size={18} />
                </div>
                {/* Kayıt ve Giriş Butonları */}
                <div style={{
                    display: "flex",
                    borderRadius: "999px",
                    overflow: "hidden",
                    border: `1px solid ${darkMode ? "#444" : "#ccc"}`,
                    backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                }}>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            padding: "0.4rem 1.2rem",
                            backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                            color: darkMode ? "#fff" : "#000",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#3a3a3a" : "#f0f0f0"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#2a2a2a" : "#fff"}
                    >
                        KAYIT
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "0.4rem 1.2rem",
                            backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                            color: darkMode ? "#fff" : "#000",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#3a3a3a" : "#f0f0f0"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#2a2a2a" : "#fff"}
                    >
                        GİRİŞ
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RestaurantNavbar;
