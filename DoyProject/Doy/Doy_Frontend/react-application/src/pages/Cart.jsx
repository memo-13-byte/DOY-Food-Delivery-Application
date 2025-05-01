import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import doyLogo from "../assets/doylogo.jpeg"; // Assuming path is correct
import { BsMoon } from "react-icons/bs";
import axios from "axios"; // <-- Import Axios

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

// Input style function
const getInputStyle = (darkMode) => ({
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: `1px solid ${darkMode ? '#555' : '#ccc'}`, // Adjusted border color
    marginBottom: "1rem",
    backgroundColor: darkMode ? "#3a3a3a" : "#fff", // Slightly adjusted dark bg
    color: darkMode ? "#fff" : "#000",
    boxSizing: 'border-box' // Important for layout consistency
});


const Cart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(location.state?.darkMode || false);
    const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
    const [tip, setTip] = useState(0);
    const restaurant = location.state?.restaurant || { name: "Restoran", restaurantName: "Restoran", restaurantId: null }; // Include ID if available
    const selectedAddress = location.state?.selectedAddress;
    const [isProcessing, setIsProcessing] = useState(false); // State for submit button loading

    const [form, setForm] = useState({
        address: selectedAddress || "",
        phone: "",
        name: "",
        surname: "",
        email: "",
        cardNumber: "",
        cardName: "",
        expiry: "", // Stored visually as MM/YY
        cvv: "",
        notes: ""
    });

    // Handles input changes, including visual formatting for card/expiry
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

    // handleRemoveItem is not used because the button was removed
    // const handleRemoveItem = (indexToRemove) => { ... };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6", minHeight: "100vh", display: "flex", flexDirection: "column", color: darkMode ? "#fff" : "#000" }}>
            {/* ÜST BAR */}
            <div style={{ backgroundColor: darkMode ? "#333" : "#47300A", padding: "0.6rem 1.5rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", cursor: 'pointer' }} onClick={() => navigate('/')}>Doy!</div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div onClick={() => setDarkMode(!darkMode)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                        <div style={{ width: "34px", height: "18px", borderRadius: "20px", backgroundColor: "#F8F5DE", position: "relative" }}>
                            <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#000", position: "absolute", top: "1px", left: darkMode ? "17px" : "1px", transition: "left 0.3s" }} />
                        </div>
                        <BsMoon color={darkMode ? "#ccc" : "#fff"} size={18} />
                    </div>
                    <div style={{ display: "flex", backgroundColor: "#F8F5DE", borderRadius: "10px", overflow: "hidden" }}>
                        <button type="button" onClick={() => navigate("/register")} style={{ padding: "0.3rem 0.8rem", backgroundColor: "transparent", color: "#47300A", fontWeight: "bold", border: "none", borderRight: "1px solid #ccc", cursor: "pointer" }}>KAYIT</button>
                        <button type="button" onClick={() => navigate("/login")} style={{ padding: "0.3rem 0.8rem", backgroundColor: "transparent", color: "#47300A", fontWeight: "bold", border: "none", cursor: "pointer" }}>GİRİŞ</button>
                    </div>
                </div>
            </div>

            {/* Logo bar altı */}
            <div style={{ backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB", padding: "1.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <img src={doyLogo} alt="doylogo" style={{ height: "120px", borderRadius: "50%" }} />
                <h2 style={{ marginLeft: '2rem', color: darkMode ? '#eee' : '#47300A' }}>Sipariş Tamamlama</h2>
            </div>

            {/* Alt geçiş şeridi */}
            <div style={{ height: "2px", backgroundColor: "#47300A", width: "100%" }} />

            {/* Ana içerik */}
            <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: "space-between", padding: "2rem", flexGrow: 1, gap: '2rem' }}>
                {/* Sol Form */}
                <div style={{ flex: '2 1 500px', paddingRight: "1rem" }}>
                    <section>
                        <h3>Teslimat Bilgileri *</h3>
                        <input name="address" value={form.address} onChange={handleChange} placeholder="Teslimat Adresi Giriniz" required style={getInputStyle(darkMode)} />
                    </section>

                    <section style={{marginTop: "1.5rem"}}>
                        <h3>Kişisel Bilgiler *</h3>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Cep Telefon Numaranız (5xxxxxxxxx)" required pattern="[5]{1}[0-9]{9}" title="5xxxxxxxxxx formatında girin" style={getInputStyle(darkMode)} />
                        <div style={{display: "flex", gap: "1rem", flexWrap: 'wrap'}}>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Adınız" required style={{...getInputStyle(darkMode), flex: 1, minWidth: '150px'}}/>
                            <input name="surname" value={form.surname} onChange={handleChange} placeholder="Soyadınız" required style={{...getInputStyle(darkMode), flex: 1, minWidth: '150px'}}/>
                        </div>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="E-posta adresiniz" required style={getInputStyle(darkMode)}/>
                    </section>

                    <section style={{marginTop: "1.5rem"}}>
                        <h3>Ek Notlar ve Bahşiş</h3>
                        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Kuryenize not ekleyebilirsiniz (isteğe bağlı)." style={{...getInputStyle(darkMode), height: "80px"}}/>
                        <h4 style={{marginTop: "1rem", marginBottom: '0.5rem'}}>Kurye Bahşişi (isteğe bağlı)</h4>
                        <div style={{display: "flex", gap: "0.8rem", flexWrap: 'wrap'}}>
                            {[15, 20, 25, 30].map(t => (
                                <button type="button" key={t} onClick={() => setTip(prev => prev === t ? 0 : t)}
                                        style={{ backgroundColor: tip === t ? (darkMode ? '#8a63d2' : '#4c2c84') : (darkMode ? '#5a4a7c' : '#6c4c9c'), color: "white", borderRadius: "20px", padding: "0.5rem 1rem", border: tip === t ? `2px solid ${darkMode ? '#c5aef1' : '#3a1a5c'}` : 'none', cursor: 'pointer', transition: 'background-color 0.2s, border 0.2s' }}
                                >{t} TL</button>
                            ))}
                        </div>
                    </section>

                    <section style={{marginTop: "1.5rem"}}>
                        <h3>Ödeme Bilgileri *</h3>
                        <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Kart No (xxxx xxxx xxxx xxxx)" required pattern="^\d{4}\s\d{4}\s\d{4}\s\d{4}$" title="16 haneli kart numarası (aralarda boşluk)" style={getInputStyle(darkMode)}/>
                        <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Kart Üzerindeki İsim Soyisim" required style={getInputStyle(darkMode)}/>
                        <div style={{display: "flex", gap: "1rem", flexWrap: 'wrap'}}>
                            <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="Son Kul. Tarihi (AA/YY)" required pattern="(0[1-9]|1[0-2])\/?([0-9]{2})" title="AA/YY formatında (örn: 12/28)" style={{...getInputStyle(darkMode), flex: 1, minWidth: '120px'}}/>
                            <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="Güvenlik Kodu (CVV)" required pattern="\d{3}" title="Kartın arkasındaki 3 haneli kod" style={{...getInputStyle(darkMode), flex: 1, minWidth: '120px'}}/>
                        </div>
                    </section>

                    {/* Submit button */}
                    <button type="submit" disabled={!isFormComplete() || isProcessing || cartItems.length === 0}
                            style={{ backgroundColor: (!isFormComplete() || cartItems.length === 0) ? "#aaa" : (isProcessing ? "#a886d3" : (darkMode ? '#8a63d2' : '#6c4c9c')), marginTop: "2rem", padding: "0.8rem 1.5rem", width: '100%', borderRadius: "10px", border: "none", color: "white", cursor: (!isFormComplete() || isProcessing || cartItems.length === 0) ? "not-allowed" : "pointer", fontSize: '1.1rem', fontWeight: 'bold', opacity: isProcessing ? 0.7 : 1 }}
                    > {isProcessing ? "İşleniyor..." : `Ödemeyi Tamamla ve Siparişi Ver (₺${total.toFixed(2)})`}
                    </button>
                    {!isFormComplete() && cartItems.length > 0 && <p style={{color: 'red', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem'}}>Lütfen * ile işaretli tüm alanları doğru formatta doldurun.</p>}
                </div>

                {/* Sağ Özet (Kaldır Button Removed) */}
                <div style={{ flex: '1 1 300px', backgroundColor: darkMode ? "#2c2c2c" : "#fff", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", color: darkMode ? "#fff" : "#000", height: 'fit-content' }}>
                    <h3 style={{ marginTop: 0, borderBottom: `1px solid ${darkMode ? '#555':'#eee'}`, paddingBottom: '0.5rem' }}>Sipariş Özeti</h3>
                    <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{restaurant?.restaurantName || restaurant?.name}</p>
                    {cartItems.length === 0 ? ( <p style={{ fontStyle: 'italic', color: darkMode ? '#aaa' : '#666' }}>Sepetiniz boş.</p> )
                        : ( cartItems.map((item, index) => (
                                <div key={item.id || index} style={{display: "flex", alignItems: "center", marginBottom: "1rem", gap: "1rem", borderBottom: `1px dashed ${darkMode ? '#444' : '#eee'}`, paddingBottom: '1rem'}}>
                                    {item.image ? (<img src={item.image} alt={item.name || ''} style={{width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover", flexShrink: 0}}/>)
                                        : (<div style={{width: "60px", height: "60px", borderRadius: "10px", backgroundColor: darkMode ? '#555' : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkMode ? '#aaa' : '#555', fontSize: '0.8rem', textAlign: 'center', flexShrink: 0}}>Resim Yok</div>)}
                                    <div style={{flex: 1, overflow: 'hidden'}}>
                                        <strong>{item.name || "İsimsiz Ürün"}</strong>
                                        <p style={{margin: 0, fontSize: "0.8rem", color: darkMode ? '#bbb' : '#555'}}>{item.description || ''}</p>
                                        <p style={{fontWeight: "bold", margin: 0}}>₺{(Number(item.price) || 0).toFixed(2)}</p>
                                    </div>
                                    {/* Kaldır Button was here */}
                                </div>
                            ))
                        )}
                    <hr style={{ border: 'none', borderTop: `1px solid ${darkMode ? '#555':'#eee'}`, margin: '1rem 0' }}/>
                    <div style={{ textAlign: "right", fontWeight: "bold", fontSize: '1.1rem' }}>
                        Toplam: ₺{total.toFixed(2)} {tip > 0 && <span style={{fontSize: '0.9rem', fontWeight: 'normal'}}>(Bahşiş: ₺{tip.toFixed(2)})</span>}
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer style={{ marginTop: "auto", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: darkMode ? "#1a1a1a" : "#ffffff", borderTop: `1px solid ${darkMode ? '#444' : '#ddd'}` }}>
                <img src={doyLogo} alt="Logo alt" style={{ height: "50px", width: "50px", borderRadius: "50%", objectFit: "cover" }} />
                <div style={{ display: "flex", gap: "1rem" }}>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaXTwitter size={20} /></a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaInstagram size={20} /></a> <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaYoutube size={20} /></a> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaLinkedin size={20} /></a>
                </div>
            </footer>
        </form>
    );
};

export default Cart;