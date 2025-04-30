import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import doyLogo from "../assets/doylogo.jpeg";
import {BsMoon} from "react-icons/bs";
import { useCart } from "../context/CartContext";


const iconLinkStyle = (darkMode) => ({
    color: darkMode ? "#ffffff" : "inherit",
    textDecoration: "none",
    padding: "0.4rem",
    borderRadius: "50%",
    transition: "transform 0.3s",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
});


const Cart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(location.state?.darkMode || false);


    const { cart, removeFromCart } = useCart();

    const [tip, setTip] = useState(0);


    const restaurant = cart.length > 0
        ? { name: "Restoran", ...cart[0] }
        : { name: "Restoran" };

    const selectedAddress = location.state?.selectedAddress;

    const [form, setForm] = useState({
        address: selectedAddress || "",
        phone: "",
        name: "",
        surname: "",
        email: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: ""
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isFormComplete = Object.values(form).every((val) => val.trim() !== "");

    const total = cart.reduce((acc, item) => acc + item.price, 0) + tip;


    const handleSubmit = () => {
        if (isFormComplete) {
            navigate("/checkout", {
                state: {
                    address: form.address,
                    total,
                    darkMode,
                    res: restaurant
                }
            });
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        removeFromCart(indexToRemove);
    };




    return (
        <div style={{ backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6", minHeight: "100vh", display: "flex", flexDirection: "column", color: darkMode ? "#fff" : "#000" }}>
        {/* ÜST BAR */}
            <div style={{
                backgroundColor: darkMode ? "#333" : "#47300A",
                padding: "0.6rem 1.5rem",
                color: darkMode ? "#fff" : "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                {/* Sol: Doy! yazısı */}
                <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Doy!</div>

                {/* Sağ: Toggle + Kayıt/Giriş */}
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

                    {/* Kayıt / Giriş */}
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



            {/* Logo bar altı */}
            <div style={{ backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB", padding: "1.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <img src={doyLogo} alt="doylogo" style={{ height: "180px", borderRadius: "50%" }} />
            </div>

            {/* Alt geçiş şeridi */}
            <div style={{ height: "2px", backgroundColor: "#47300A", width: "100%" }} />

            {/* Ana içerik */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "2rem" }}>
                {/* Sol Form */}
                <div style={{flex: 2, paddingRight: "2rem"}}>
                    <h3>Teslimat Bilgileri</h3>
                    <input name="address" value={form.address} onChange={handleChange}
                           placeholder="Teslimat Adresi Giriniz" style={getInputStyle(darkMode)}/>

                    <div style={{display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.5rem"}}>
                        <input type="checkbox" id="useSavedAddress"/>
                        <label htmlFor="useSavedAddress">Profilimdeki teslimat adresini kullan</label>
                    </div>


                    <h3 style={{marginTop: "2rem"}}>Kişisel Bilgiler</h3>
                    <input name="phone" value={form.phone} onChange={handleChange}
                           placeholder="Cep Telefon Numaranızı Giriniz" style={getInputStyle(darkMode)}/>

                    <div style={{display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.5rem"}}>
                        <input type="checkbox" id="useSavedPhone"/>
                        <label htmlFor="useSavedPhone">Profilimdeki numarayı kullan</label>
                    </div>


                    <div style={{display: "flex", gap: "1rem"}}>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Adınız"
                               style={{...getInputStyle(darkMode), flex: 1}}/>
                        <input name="surname" value={form.surname} onChange={handleChange} placeholder="Soyadınız"
                               style={{...getInputStyle(darkMode), flex: 1}}/>
                    </div>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="E-posta adresiniz"
                           style={getInputStyle(darkMode)}/>

                    <div style={{display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.5rem"}}>
                        <input type="checkbox" id="useSavedInfo"/>
                        <label htmlFor="useSavedInfo">Profilimdeki bilgileri kullan</label>
                    </div>


                    <textarea placeholder="Kuryenize not ekleyebilirsiniz." style={{...getInputStyle(darkMode), height: "80px"}}/>

                    <h3 style={{marginTop: "2rem"}}>Kuryenize Bahşiş Ekleyebilirsiniz</h3>
                    <div style={{display: "flex", gap: "1rem"}}>
                        {[15, 20, 25, 30].map(t => (
                            <button
                                key={t}
                                onClick={() => setTip(prev => prev === t ? 0 : t)}
                                style={{
                                    backgroundColor: tip === t ? "#4c2c84" : "#6c4c9c",
                                    color: "white",
                                    borderRadius: "20px",
                                    padding: "0.5rem 1rem",
                                    border: "none",
                                    fontWeight: tip === t ? "bold" : "normal"
                                }}
                            >
                                {t} TL
                            </button>
                        ))}

                    </div>

                    <h3 style={{marginTop: "2rem"}}>Ödeme Bilgileri</h3>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Kart No"
                           style={getInputStyle(darkMode)}/>
                    <input name="cardName" value={form.cardName} onChange={handleChange}
                           placeholder="Kart Üzerindeki İsim" style={getInputStyle(darkMode)}/>
                    <div style={{display: "flex", gap: "1rem"}}>
                        <input name="expiry" value={form.expiry} onChange={handleChange}
                               placeholder="Son Kullanma Tarihi" style={{...getInputStyle(darkMode), flex: 1}}/>
                        <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="Güvenlik Kodu"
                               style={{...getInputStyle(darkMode), flex: 1}}/>
                    </div>

                    <div style={{display: "flex", alignItems: "center", marginTop: "0.5rem", gap: "0.5rem"}}>
                        <input type="checkbox" id="useSavedCard"/>
                        <label htmlFor="useSavedCard">Profilimdeki kart bilgilerini kullan</label>
                    </div>


                    <button
                        onClick={handleSubmit}
                        disabled={!isFormComplete}
                        style={{
                            backgroundColor: isFormComplete ? "#6c4c9c" : "#ccc",
                            marginTop: "1rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "10px",
                            border: "none",
                            color: "white",
                            cursor: isFormComplete ? "pointer" : "not-allowed"
                        }}
                    >
                        Ödemeyi Tamamla
                    </button>
                </div>

                {/* Sağ Özet */}
                <div style={{
                    flex: 1,
                    backgroundColor: darkMode ? "#2c2c2c" : "#fff",
                    borderRadius: "20px",
                    padding: "1.5rem",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    color: darkMode ? "#fff" : "#000",
                }}>
                    <h3>Siparişinizi Görüntüleyin</h3>
                    <p>{restaurant.name}</p>
                    {cart.map((item,index) => (
                        <div key={index}
                             style={{display: "flex", alignItems: "center", marginBottom: "1rem", gap: "1rem"}}>
                            <img src={item.image} alt={item.name}
                                 style={{width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover"}}/>
                            <div style={{flex: 1}}>
                                <strong>{item.name}</strong>
                                <p style={{margin: 0, fontSize: "0.8rem"}}>{item.description}</p>
                                <p style={{fontWeight: "bold", margin: 0}}>{item.price} TL</p>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(index)}
                                style={{
                                    backgroundColor: "#7A0000",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "0.3rem 0.7rem",
                                    cursor: "pointer"
                                }}
                            >
                                Kaldır
                            </button>


                        </div>
                    ))}
                    <hr/>
                    <p style={{textAlign: "right", fontWeight: "bold"}}>
                        Toplam: {total} TL {tip > 0 && `(Bahşiş: ${tip} TL)`}
                    </p>

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
            }}>
                <img src={doyLogo} alt="Logo alt" style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    objectFit: "cover"
                }} />
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaXTwitter size={24} /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaInstagram size={24} /></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaYoutube size={24} /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaLinkedin size={24} /></a>
                </div>
            </footer>
        </div>
    );
};

const getInputStyle = (darkMode) => ({
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
    backgroundColor: darkMode ? "#2a2a2a" : "#fff",
    color: darkMode ? "#fff" : "#000"
});


export default Cart;

