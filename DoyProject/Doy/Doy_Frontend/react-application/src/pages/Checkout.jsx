import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsMoon } from "react-icons/bs";
import { useCart } from "../context/CartContext";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState("");

    const address = location.state?.address;
    const total = location.state?.total;
    const [darkMode, setDarkMode] = useState(location.state?.darkMode || false);

    const { cart, confirmOrderWithBackend } = useCart(); // ✅ eklendi
    const restaurant = location.state?.res;

    const handleAccept = async () => {
        if (code.trim() === "") return alert("Lütfen kodu girin");

        const hasNumber = /\d/.test(code);

        if (hasNumber) {
            const success = await confirmOrderWithBackend(); // ✅ Backend sipariş onayı
            if (!success) return alert("Sipariş backend'e gönderilemedi.");
        }

        navigate("/payment-result", {
            state: {
                success: hasNumber,
                address,
                total,
                darkMode,
                restaurant
            }
        });
    };

    const handleReject = () => {
        navigate("/payment-result", {
            state: {
                success: false,
                address,
                total,
                darkMode
            }
        });
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: darkMode ? "#fff" : "#000"
        }}>
            {/* Üst bar */}
            <div style={{
                backgroundColor: darkMode ? "#333" : "#47300A",
                padding: "0.6rem 1.5rem",
                color: darkMode ? "#fff" : "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Doy!</div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                        onClick={() => setDarkMode(!darkMode)}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
                    >
                        <div style={{
                            width: "34px",
                            height: "18px",
                            borderRadius: "20px",
                            backgroundColor: "#F8F5DE",
                            position: "relative"
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
                        <BsMoon color={darkMode ? "#000" : "#fff"} size={18} />
                    </div>
                    <div style={{ fontWeight: "bold" }}>Customer A</div>
                </div>
            </div>

            {/* Kod giriş kutusu */}
            <div style={{
                padding: "3rem",
                maxWidth: "600px",
                margin: "auto",
                backgroundColor: darkMode ? "#2c2c2c" : "#fff",
                borderRadius: "20px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}>
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
        </div>
    );
};

export default Checkout;
