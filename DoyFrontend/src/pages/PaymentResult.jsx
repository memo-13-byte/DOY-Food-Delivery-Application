import React, { useEffect, useState } from "react";
// Changed from wouter to react-router-dom
import { useNavigate } from "react-router-dom";
import doyLogo from "../assets/doylogo.jpeg";
import { BsMoon } from "react-icons/bs";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    // Replace wouter's useLocation with react-router-dom's useNavigate
    const navigate = useNavigate();
    
    // Ödeme sonuç verilerini localStorage'dan alıyoruz
    const paymentResult = (() => {
        const result = localStorage.getItem("paymentResult");
        return result ? JSON.parse(result) : {};
    })();
    
    const success = paymentResult.success;
    const address = paymentResult.address;
    const total = paymentResult.total;
    const darkFromCart = paymentResult.darkMode;
    const cartItems = paymentResult.cartItems || [];
    const restaurant = paymentResult.restaurant;

    const [darkMode, setDarkMode] = useState(darkFromCart || false);
    
    // darkMode değiştiğinde localStorage'a kaydediyoruz
    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (success) {
            // Sipariş onayı verilerini localStorage'a kaydediyoruz
            localStorage.setItem("orderConfirmation", JSON.stringify({
                address,
                total,
                darkMode,
                cartItems,
                res: restaurant
            }));
            
            // react-router-dom ile sipariş onay sayfasına yönlendirme
            navigate("/order-confirmation");
        } else {
            // Başarısız olursa, sepet bilgilerini localStorage'a kaydediyoruz
            localStorage.setItem("cartItems", JSON.stringify(cartItems || []));
            localStorage.setItem("selectedAddress", JSON.stringify(address || ""));
            localStorage.setItem("darkMode", JSON.stringify(darkMode));
            
            const timer = setTimeout(() => {
                // react-router-dom ile sepet sayfasına geri dönme
                navigate("/cart");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [success, navigate, address, total, darkMode, cartItems, restaurant]);

    return (
        <div style={{ backgroundColor: darkMode ? "#1a1a1a" : "#F2E8D6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

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

            <Footer darkMode={darkMode}></Footer>
        </div>
    );
};

export default PaymentResult;