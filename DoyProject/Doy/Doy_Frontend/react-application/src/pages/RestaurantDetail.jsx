import React, { useState } from "react";
import restaurants from "../data/restaurants";
import restaurantMenu from "../data/restaurantMenu";
import ProductCard from "../components/ProductCard";
import CartSummary from "../components/CartSummary";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { BsMoon } from "react-icons/bs";
import doyLogo from "../assets/doylogo.jpeg";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";


const renderStars = (rating) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<FaStar key={i} color="#ffcc00" />);
    while (stars.length < 5) stars.push(<FaRegStar key={`e-${stars.length}`} color="#ccc" />);
    return stars;
};

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

const RestaurantDetail = () => {
    const [cart, setCart] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const menu = restaurantMenu[id];

    const [darkMode, setDarkMode] = useState(location.state?.darkMode || false);
    const selectedAddress = location.state?.selectedAddress;

    const restaurant = restaurants.find((r) => r.id === parseInt(id));

    const handleAddToCart = (item) => setCart([...cart, item]);

    const handleConfirm = () => {
        if (cart.length > 0) {
            navigate("/cart", {
                state: {
                    cartItems: cart,
                    restaurant,
                    selectedAddress,
                    darkMode
                }
            });
        } else {
            alert("Sepetiniz boş.");
        }
    };


    return (
        <div style={{ backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6", color: darkMode ? "#fff" : "#000" }}>

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

                <div
                    style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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

                    {/* Kayıt / Giriş Butonları */}
                    <div style={{
                        display: "flex",
                        backgroundColor: "#F8F5DE",
                        borderRadius: "10px",
                        overflow: "hidden"
                    }}>
                        <button onClick={() => navigate("/register")} style={{ padding: "0.3rem 0.8rem", backgroundColor: "#F8F5DE", color: "#000", fontWeight: "bold", border: "none", borderRight: "1px solid #ccc", cursor: "pointer" }}>KAYIT</button>
                        <button onClick={() => navigate("/login")} style={{ padding: "0.3rem 0.8rem", backgroundColor: "#F8F5DE", color: "#000", fontWeight: "bold", border: "none", cursor: "pointer" }}>GİRİŞ</button>
                    </div>
                </div>
            </div>

            {/* LOGO BAR (DOY! logosu) */}
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
                padding: "1.5rem 3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start"
            }}>
                <img src={doyLogo} alt="doylogo" style={{ height: "180px", borderRadius: "50%" }} />
            </div>

            {/* ALT GEÇİŞ ŞERİDİ */}
            <div style={{ height: "2px", backgroundColor: "#47300A", width: "100%" }} />

            {/* Restoran Bilgisi ve Sepet */}
            <div style={{ padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                        {restaurant?.image && (
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                style={{ width: "160px", height: "160px", borderRadius: "16px", objectFit: "cover" }}
                            />
                        )}
                        <div>
                            <h2 style={{color: darkMode ? "#fff" : "#000"}}>{restaurant?.name}</h2>
                            <div>{renderStars(restaurant?.rating)} {restaurant?.rating}/5</div>
                            <p>{restaurant?.description || "Lezzetli yemekler burada!"}</p>
                            <p>Teslim Süresi: {restaurant?.time} dk | Min. Sipariş: ₺{restaurant?.minPrice}</p>
                        </div>
                    </div>

                    <CartSummary cart={cart} onConfirm={handleConfirm} />
                </div>

                {/* Menü Grupları */}
                {menu && menu.categories.map((category, i) => (
                    <div key={i} style={{ marginBottom: "3rem" }}>
                        <h3 style={{
                            marginBottom: "1rem",
                            color: darkMode ? "#fff" : "#000",
                        }}>
                            {category.title}
                        </h3>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                            gap: "1.5rem"
                        }}>
                            {category.items.map((item) => (
                                <ProductCard key={item.id} item={item} onAdd={handleAddToCart} />
                            ))}
                        </div>
                    </div>
                ))}

            </div>

            {/* Footer */}
            <footer style={{
                marginTop: "2rem",
                padding: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
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

export default RestaurantDetail;
