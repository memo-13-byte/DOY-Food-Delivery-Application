import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { BsMoon } from "react-icons/bs";
import doyLogo from "../assets/doylogo.jpeg";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import LocationModal from "../components/LocationModal";
import { useEffect } from "react";
import axios from "axios";


import restaurants from "../data/restaurants";


const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f-${i}`} color="#ffcc00" />);
    if (half) stars.push(<FaStar key="half" color="#ffcc00" style={{ opacity: 0.5 }} />);
    while (stars.length < 5) stars.push(<FaRegStar key={`e-${stars.length}`} color="#ffcc00" />);
    return stars;
};

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    const iconLinkStyle = {
        color: "inherit",
        textDecoration: "none",
        padding: "0.4rem",
        borderRadius: "50%",
        transition: "background-color 0.3s",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };


    useEffect(() => {
        const getRestaurantsFromBackend = async () => {
            const response = await axios.get("http://localhost:8080/api/restaurant/search",
                {params:{
                    key1:searchText
                    }})
            const data = response.data.content
            console.log(data)
            if (searchText.trim() === "") {
                setFilteredRestaurants([]);
            } else if (data !== null){
                const results = data.filter(res =>
                    res.restaurantName.toLowerCase().includes(searchText.toLowerCase())
                );
                setFilteredRestaurants(results);
            }
        }

        getRestaurantsFromBackend()

    }, [searchText]);

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>

            {/* ÜST BAR */}
            <div style={{
                backgroundColor: darkMode ? "#333" : "#47300A",
                color: darkMode ? "#fff" : "white",
                padding: "0.6rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.3s ease-in-out"

            }}>
                {/* Sol - Doy! yazısı */}
                <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>Doy!</div>

                {/* Sağ - Toggle + simge + Kayıt/Giriş */}
                <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                    {/* Toggle + BsMoon */}
                    <div
                        onClick={() => setDarkMode(!darkMode)}
                        style={{display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer"}}
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
                            }}/>
                        </div>
                        <BsMoon color={darkMode ? "#000" : "#fff"} size={18}/>
                    </div>

                    {/* Kayıt / Giriş birlikte kutu */}
                    <div style={{
                        display: "flex",
                        backgroundColor: "#F8F5DE",
                        borderRadius: "10px",
                        overflow: "hidden"
                    }}>
                        <button
                            onClick={() => navigate("/register")}
                            style={{
                                padding: "0.3rem 0.8rem",
                                backgroundColor: "#F8F5DE",
                                color: "#000",
                                fontWeight: "bold",
                                border: "none",
                                borderRight: "1px solid #ccc",
                                cursor: "pointer"
                            }}
                        >
                            KAYIT
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                padding: "0.3rem 0.8rem",
                                backgroundColor: "#F8F5DE",
                                color: "#000",
                                fontWeight: "bold",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            GİRİŞ
                        </button>
                    </div>
                </div>
            </div>

            {/* ALT BAR - Konum seç alanı */}
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
                padding: "1.5rem 3rem",
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                transition: "all 0.3s ease-in-out"
            }}>
                {/* Logo */}
                <img src={doyLogo} alt="logo" style={{height: "180px", borderRadius: "50%"}}/>

                {/* Kutu ve yazıyı saran div */}
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
                    {/* Konumunu seç yazısı */}
                    <div style={{width: "100%", maxWidth: "500px"}}>
            <span style={{
                fontWeight: "800",
                fontSize: "1.1rem"
            }}>
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
                            transition: "all 0.3s ease-in-out"
                        }}>
                        <span style={{fontSize: "1.1rem"}}>➔</span>
                        <FaLocationDot size={18} color={darkMode ? "#fff" : "#000"
                        }/> {/* ikonu da güncelledik */}
                        <span style={{fontWeight: "400", fontSize: "1rem"}}>
        {selectedAddress || "Adresini Belirle veya Seç"}
    </span>
                    </div>
                </div>
            </div>

            {/* ALT GEÇİŞ ŞERİDİ */}
            <div style={{
                height: "2px",
                backgroundColor: "#47300A",
                width: "100%"
            }}/>

            <div style={{padding: "2rem 1rem", textAlign: "center", position: "relative"}}>
                <div style={{
                    position: "relative",
                    width: "60%",
                    margin: "0 auto"
                }}>
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
                            fontWeight: "300"
                        }}
                    />
                    <FaSearch style={{
                        position: "absolute",
                        right: "6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        opacity: 0.6,
                        pointerEvents: "none"
                    }}/>

                    {/* Arama Sonuçları */}
                    {searchText && filteredRestaurants.length > 0 && (
                        <div style={{
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
                            overflow: "hidden",
                            transition: "all 0.3s ease-in-out"
                        }}>
                            {filteredRestaurants.slice(0, 3).map((r, index) => (
                                <div
                                    key={r.id}
                                    onClick={() => navigate(`/restaurant/${r.id}`, {
                                        state: { restaurant: r, selectedAddress, darkMode }
                                    })}

                                    style={{
                                        padding: "0.6rem 0",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #ccc",
                                        transition: "background 0.2s",
                                        animation: "fadeInItem 0.5s ease forwards",
                                        animationDelay: `${index * 0.2}s` // sırayla gelsin
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                    {r.restaurantName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            <h2 style={{textAlign: "center", marginBottom: "1rem"}}>Sizin için önerilen restoranlar</h2>

            {/* Restoran Kartları */}
            <div style={{
                backgroundColor: darkMode ? "#2b2b2b" : "#FFFFFF",
                margin: "0 2rem",
                padding: "2rem",
                borderRadius: "30px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease-in-out"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem"
                }}>
                    {restaurants.map((res) => (
                        <div key={res.id} style={{
                            backgroundColor: darkMode ? "#3b3b3b" : "#ffffff",
                            padding: "1rem",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: "0 0 8px rgba(0,0,0,0.05)",
                            transition: "all 0.3s ease-in-out"

                        }}>
                            <HiOutlineHome size={48} style={{opacity: 0.4}}/>
                            <div style={{flexGrow: 1, marginLeft: "1rem"}}>
                                <h3 style={{margin: 0}}>{res.name}</h3>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px"
                                }}>{renderStars(res.rating)}</div>
                            </div>
                            <button
                                onClick={() => navigate(`/restaurant/${res.id}`, {
                                    state: { restaurant: res, selectedAddress, darkMode }
                                })}
                                style={{
                                    backgroundColor: "#7A0000",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Sipariş Ver
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                marginTop: "2rem",
                padding: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                transition: "all 0.3s ease-in-out"
            }}>
                <img
                    src={doyLogo}
                    alt="Logo alt"
                    style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                />

                <div style={{display: "flex", gap: "1.5rem"}}>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={iconLinkStyle}
                        className="icon-link"
                    >
                        <FaXTwitter size={24}/>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle} className="icon-link">
                        <FaInstagram size={24}/>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle} className="icon-link">
                        <FaYoutube size={24}/>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle} className="icon-link">
                        <FaLinkedin size={24}/>
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
    );
};

export default Home;
