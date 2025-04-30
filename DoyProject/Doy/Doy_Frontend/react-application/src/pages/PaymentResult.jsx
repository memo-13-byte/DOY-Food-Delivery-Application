import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doyLogo from "../assets/doylogo.jpeg";
import { BsMoon } from "react-icons/bs";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { useCart } from "../context/CartContext";


const iconLinkStyle = {
    color: "inherit",
    textDecoration: "none",
    padding: "0.4rem",
    borderRadius: "50%",
    transition: "transform 0.3s",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const PaymentResult = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const success = state?.success;
    const address = state?.address;
    const total = state?.total;
    const darkFromCart = state?.darkMode;
    const { cart } = useCart();
    const restaurant = state?.restaurant;

    const [darkMode, setDarkMode] = useState(darkFromCart || false);

    useEffect(() => {
        if (success) {
            navigate("/order-confirmation", {
                state: {
                    address,
                    total,
                    darkMode,
                    res: restaurant
                }
            });

        } else {
            const timer = setTimeout(() => {
                navigate("/cart", {
                    state: {
                        address,
                        total,
                        darkMode
                    }
                });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [success, navigate, address, total, darkMode, restaurant]);

    return (
        <div style={{ backgroundColor: darkMode ? "#1a1a1a" : "#F2E8D6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* ÜST BAR */}
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
                    {/* Dark Mode Toggle */}
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
                </div>
            </div>

            <div style={{ margin: "auto", textAlign: "center", padding: "3rem", color: darkMode ? "#fff" : "#000" }}>
                {success ? (
                    <>
                        <h2 style={{ color: "green" }}>✅ Ödeme Onaylandı</h2>
                        <p>Siparişiniz işleniyor, yönlendiriliyorsunuz...</p>
                    </>
                ) : (
                    <>
                        <h2 style={{ color: "#7A0000" }}>❌ Ödeme Reddedildi</h2>
                        <p>Ödeme işlemi başarısız oldu. Sepete geri yönlendiriliyorsunuz...</p>
                    </>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{
                marginTop: "auto",
                padding: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff"
            }}>
                <img src={doyLogo} alt="Logo alt" style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    objectFit: "cover"
                }} />
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}><FaXTwitter size={24} /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}><FaInstagram size={24} /></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}><FaYoutube size={24} /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}><FaLinkedin size={24} /></a>
                </div>
            </footer>
        </div>
    );
};

export default PaymentResult;
