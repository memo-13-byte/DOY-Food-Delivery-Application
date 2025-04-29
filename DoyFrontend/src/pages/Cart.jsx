import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import doyLogo from "../assets/doylogo.jpeg";
import { BsMoon } from "react-icons/bs";
import axios from "axios";

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
    // Replace wouter's useLocation with react-router-dom's useNavigate
    const navigate = useNavigate();
    
    // Kayıtlı verileri localStorage'dan alıyoruz
    const [darkMode, setDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem("darkMode");
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });

    // CartItems'ı localStorage'dan alıyoruz
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [tip, setTip] = useState(0);
    // Add missing isProcessing state
    const [isProcessing, setIsProcessing] = useState(false);

    // Restaurant bilgisini localStorage'dan alıyoruz
    const restaurant = (() => {
        const savedRestaurant = localStorage.getItem("restaurant");
        return savedRestaurant ? JSON.parse(savedRestaurant) : { name: "Restoran" };
    })();

    // Seçili adresi localStorage'dan alıyoruz
    const selectedAddress = (() => {
        const savedAddress = localStorage.getItem("selectedAddress");
        return savedAddress ? JSON.parse(savedAddress) : "";
    })();

    // DarkMode değişikliklerini localStorage'a kaydediyoruz
    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    // CartItems değişikliklerini localStorage'a kaydediyoruz
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const [form, setForm] = useState({
        address: selectedAddress || "",
        phone: "",
        name: "",
        surname: "",
        email: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
        notes: "" // Add missing notes field
    });

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'cardNumber') {
            value = value.replace(/\D/g, '').substring(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            value = value.replace(/\D/g, '').substring(0, 4);
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2); // Visual slash
            }
        } else if (name === 'cvv') {
            value = value.replace(/\D/g, '').substring(0, 3);
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Checks if required fields are filled and basic format validation
    const isFormComplete = () => {
        const requiredFields = ['address', 'phone', 'name', 'surname', 'email', 'cardNumber', 'cardName', 'expiry', 'cvv'];
        const cardNumberValid = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(form.cardNumber);
        const expiryValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(form.expiry); // Checks MM/YY visual format
        const cvvValid = /^\d{3}$/.test(form.cvv);

        return requiredFields.every(field => form[field]?.trim() !== "") && cardNumberValid && expiryValid && cvvValid;
    };

    // Calculates total
    const total = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0) + tip;

    // Handles form submission, API call, and navigation
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormComplete()) {
            alert("Lütfen tüm gerekli alanları doğru formatta doldurun (Kart No: 16 Hane, Tarih: AA/YY, CVV: 3 Hane).");
            return;
        }
        if (cartItems.length === 0) {
            alert("Ödeme yapmak için sepetinizde ürün olmalıdır.");
            return;
        }

        setIsProcessing(true);
        console.log("Submitting payment...");

        // --- Construct FLAT payload matching DtoPaymentInformationIU ---
        const payload = {
            // Match field names EXACTLY with your Java DTO
            address: form.address,
            phoneNumber: form.phone,      // DTO uses phoneNumber
            firstName: form.name,
            lastName: form.surname,       // DTO uses lastName
            email: form.email,
            notesForCourier: form.notes,  // DTO uses notesForCourier
            tip: tip,                     // DTO uses tip

            cardNumber: form.cardNumber.replace(/\s/g, ''), // Remove spaces
            cvv: form.cvv,
            expiryDate: form.expiry.replace('/', '-'), // Convert "MM/YY" to "MM-YY"
            nameOnCard: form.cardName,
            lastFourDigits: form.cardNumber.slice(1).slice(-4)// DTO uses nameOnCard

            // Assuming backend calculates/retrieves lastFourDigits if needed
            // lastFourDigits: form.cardNumber.slice(-4)
        };
        // --- End Payload Construction ---

        console.log("FLAT Payload for /order/payment:", payload);

        try {
            // *** Ensure Axios sends authentication headers (JWT etc.) ***
            const response = await axios.post('http://localhost:8080/order/payment', payload); // Send flat payload

            console.log("Payment API Response:", response.data);

            if (response.data === true) {
                console.log("Payment successful. Navigating to /checkout...");
                // Changed from setLocation to navigate with state
                navigate("/checkout", {
                    // Pass minimal state needed for checkout confirmation page
                    state: { paymentSuccess: true, totalPaid: total, darkMode }
                });
            } else {
                console.warn("Payment failed (backend returned false).");
                alert("Ödeme başarısız oldu. Lütfen kart bilgilerinizi veya bakiyenizi kontrol edip tekrar deneyin.");
            }
        } catch (error) {
            console.error("Error during payment API call:", error);
            let errorMsg = "Ödeme sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
            if (error.response?.data?.message) { errorMsg = error.response.data.message; }
            else if (error.response?.status === 400) { errorMsg = "Geçersiz veya eksik bilgi gönderildi."; }
            else if (error.response?.status === 401) { errorMsg = "Yetkilendirme hatası."; }
            alert(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        setCartItems(prev => prev.filter((_, index) => index !== indexToRemove));
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
                            onClick={() => navigate("/auth")} // Changed from setLocation to navigate
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
                            onClick={() => navigate("/auth")} // Changed from setLocation to navigate
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
                <img src={doyLogo || "/placeholder.svg"} alt="doylogo" style={{ height: "180px", borderRadius: "50%" }} />
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

                    {/* Fixed textarea to properly bind to form state */}
                    <textarea 
                        name="notes" 
                        value={form.notes} 
                        onChange={handleChange}
                        placeholder="Kuryenize not ekleyebilirsiniz." 
                        style={{...getInputStyle(darkMode), height: "80px"}}
                    />

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
                        disabled={!isFormComplete() || isProcessing}
                        style={{
                            backgroundColor: isFormComplete() && !isProcessing ? "#6c4c9c" : "#ccc",
                            marginTop: "1rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "10px",
                            border: "none",
                            color: "white",
                            cursor: isFormComplete() && !isProcessing ? "pointer" : "not-allowed"
                        }}
                    >
                        {isProcessing ? "İşleniyor..." : "Ödemeyi Tamamla"}
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
                    {cartItems.map((item,index) => (
                        <div key={index}
                             style={{display: "flex", alignItems: "center", marginBottom: "1rem", gap: "1rem"}}>
                            <img src={item.image || "/placeholder.svg"} alt={item.name}
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
                <img src={doyLogo || "/placeholder.svg"} alt="Logo alt" style={{
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