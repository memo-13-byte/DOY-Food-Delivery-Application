"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import AuthorizedRequest from "../services/AuthorizedRequest"
import {
    Moon, Edit2, AlertTriangle, User, Phone, Mail, MapPin, LogOut, Check,
    ChevronRight, Utensils, Tag, DollarSign, BookText, Building, Home, Navigation,
    CreditCard, // Keep for TC icon
    ListChecks, // Keep for error list icon
    Sun, Loader2, CheckCircle, AlertCircle // Keep Sun icon
} from "lucide-react"
import { motion } from "framer-motion"
// Assume a service function exists to get combined owner/restaurant data
// import { getRestaurantProfileData } from "../services/profileData"
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react"

// --- Custom UI components (Button, Input, Label, Switch, Select, Textarea) ---
// Assume Button, Label, Switch, Select, Textarea are defined as before
const Button = ({ className, children, type = "button", disabled = false, ...props }) => { return ( <button type={type} disabled={disabled} className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${className}`} {...props}> {children} </button> ); }
const Input = ({ className, error, readOnly = false, ...props }) => { return ( <input readOnly={readOnly} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${readOnly ? 'bg-opacity-50 cursor-not-allowed' : ''} ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props} /> ); } // Keep readOnly prop
const Textarea = ({ className, error, ...props }) => { return ( <textarea className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props} /> ); }
const Select = ({ id, value, onChange, onBlur, error, className, children, ...props }) => { return ( <select id={id} value={value} onChange={onChange} onBlur={onBlur} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props}> {children} </select> ); }
const Label = ({ className, ...props }) => { return ( <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} /> ); }
const Switch = ({ checked, onCheckedChange, className }) => { return ( <button role="switch" aria-checked={checked} data-state={checked ? "checked" : "unchecked"} onClick={() => onCheckedChange(!checked)} className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${ checked ? "bg-primary" : "bg-input" } ${className}`} > <span data-state={checked ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${ checked ? "translate-x-5" : "translate-x-0" }`} /> </button> ); }
// --- End of assumed UI components ---

// --- Error message component (unchanged) ---
const ErrorMessage = ({ message, darkMode }) => { if (!message) return null; return ( <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${darkMode ? "text-red-400" : "text-red-500"}`}> <AlertCircle className="h-3.5 w-3.5" /> <span>{message}</span> </div> ); }
// --- End of Error message component ---

// --- Success indicator component (unchanged) ---
const SuccessIndicator = ({ darkMode }) => { return ( <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-green-400" : "text-green-500"}`}> <CheckCircle className="h-4 w-4" /> </div> ); }
// --- End of Success indicator component ---

// --- Constants ---
const RESTAURANT_CATEGORIES = [ { value: "", label: "Kategori Seçin" }, { value: "KEBAP", label: "Kebap" }, { value: "BURGER", label: "Burger" }, { value: "PIZZA", label: "Pizza" }, { value: "EV_YEMEKLERI", label: "Ev Yemekleri" }, { value: "DENIZ_URUNLERI", label: "Deniz Ürünleri" }, { value: "TATLI", label: "Tatlı" }, { value: "CAFE", label: "Kafe" }, { value: "OTHER", label: "Diğer" } ];
// No longer need TURKISH_CITIES or DISTRICT_DATA

// --- Hypothetical Service Function (adapted for single address) ---
const getRestaurantProfileData = async (ownerId) => {
    console.log(`Workspaceing profile data for owner ID: ${ownerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate fetching data - MUST return a single 'address' string now
    return {
        ownerId: ownerId || 1,
        firstName: "Ali",
        lastName: "Veli",
        email: "ali.veli@example.com",
        phoneNumber: "05551234567",
        governmentId: "12345678901", // TCKN
        restaurantId: 101,
        restaurantName: "Ali's Döner",
        description: "Lezzetli döner kebaplar ve güler yüzlü hizmet!",
        restaurantPhone: "05557654321",
        restaurantCategory: "KEBAP",
        minOrderPrice: 50,
        address: "Kızılay Mahallesi, Gazi Sokak No: 10/5, Çankaya, Ankara", // Single Address String
        restaurantLogo: "/image1.png",
    };
}

export default function RestaurantOwnerProfilePage() {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const ownerId = params.id
    const [darkMode, setDarkMode] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")
    const [isLoaded, setIsLoaded] = useState(false)

    // --- Combined State for Restaurant Profile ---
    const [restaurantProfile, setRestaurantProfile] = useState(null);

    // --- Form State (address is single string, city/district etc. removed) ---
    const [formData, setFormData] = useState({
        // Owner fields
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "", // Owner's phone
        // Restaurant fields
        restaurantName: "", // Will be displayed in owner section but updated with restaurant info
        description: "",
        restaurantPhone: "",
        restaurantCategory: "",
        minOrderPrice: "",
        address: "", // Single address field (read-only, so mainly for display)
        // Password fields
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Removed availableDistricts state

    // --- Fetch Restaurant Profile Data (adapted for single address) ---
    useEffect(() => {
        const loadProfile = async () => {
            if (!ownerId) { console.error("Owner ID is missing!"); return; }
            try {
                const profileData = await getRestaurantProfileData(ownerId);
                setRestaurantProfile(profileData);

                // Initialize form data
                setFormData({
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: profileData.email || "",
                    phoneNumber: profileData.phoneNumber || "",
                    restaurantName: profileData.restaurantName || "",
                    description: profileData.description || "",
                    restaurantPhone: profileData.restaurantPhone || "",
                    restaurantCategory: profileData.restaurantCategory || "",
                    minOrderPrice: profileData.minOrderPrice !== undefined ? String(profileData.minOrderPrice) : "",
                    address: profileData.address || "", // Initialize single address
                    currentPassword: "", newPassword: "", confirmPassword: "",
                });

                // Removed district logic

                setIsLoaded(true);

            } catch (error) {
                console.error("Error loading restaurant profile: ", error);
                setIsLoaded(true);
            }
        };

        loadProfile();
    }, [ownerId]);

    // --- Input Change Handler (Simplified) ---
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Use name attribute now
        setFormData(prev => ({ ...prev, [name]: value }));
        // No need for city/district logic
    };

    // --- Profile Update Handler (address removed from payload) ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!restaurantProfile?.ownerId && !restaurantProfile?.restaurantId) { console.error("Cannot update profile without ID."); return; }
        const identifier = restaurantProfile.ownerId || restaurantProfile.restaurantId;
        const apiUrl = `http://localhost:8080/api/restaurants/profile/update/${identifier}`; // Replace with your endpoint

        // Prepare payload - EXCLUDE ADDRESS
        const updatePayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
            restaurantName: formData.restaurantName, // Include restaurantName here
            description: formData.description,
            restaurantPhone: formData.restaurantPhone.replace(/\D/g, ''),
            restaurantCategory: formData.restaurantCategory,
            minOrderPrice: parseFloat(formData.minOrderPrice) || 0,
            // DO NOT SEND address as it's unmodifiable
        };
        // Password logic remains the same...
        if (formData.newPassword && formData.currentPassword) {
            updatePayload.currentPassword = formData.currentPassword;
            updatePayload.newPassword = formData.newPassword;
            if(formData.newPassword !== formData.confirmPassword){ alert("Yeni şifreler eşleşmiyor!"); return; }
        }

        console.log("Sending Update Payload:", updatePayload);
        //setIsSubmitting(true); // Consider adding submitting state handling

        try {
            const response = await AuthorizedRequest.putRequest(apiUrl, updatePayload, {
                headers: { 'Content-Type': 'application/json' /*, Auth header? */ }
            });
            console.log("Update successful:", response.data);

            // Update local state (excluding address as it wasn't sent)
            setRestaurantProfile(prev => ({
                ...prev,
                ...updatePayload,
                // Keep original address
                address: prev.address,
                // Re-format numbers/clean data if necessary based on response
                phoneNumber: formData.phoneNumber,
                restaurantPhone: formData.restaurantPhone,
                minOrderPrice: parseFloat(formData.minOrderPrice) || 0,
            }));
            // Also update formData to reflect potential backend formatting, except address
            setFormData(prev => ({
                ...prev,
                ...updatePayload,
                address: prev.address, // Keep existing address in form too
                phoneNumber: formData.phoneNumber, // Keep display format
                restaurantPhone: formData.restaurantPhone, // Keep display format
                minOrderPrice: String(parseFloat(formData.minOrderPrice) || 0), // Ensure string
                currentPassword: "", newPassword: "", confirmPassword: "" // Clear password fields
            }));


            // Show success notification logic...
            const notification = document.getElementById("success-notification");
            if (notification) { /* ... notification logic ... */ notification.classList.remove("translate-y-20", "opacity-0"); notification.classList.add("translate-y-0", "opacity-100"); setTimeout(() => { notification.classList.add("translate-y-20", "opacity-0"); notification.classList.remove("translate-y-0", "opacity-100"); }, 3000); }

        } catch (error) { // --- Error handling (keep or adapt as needed) ---
            console.error("Error updating profile:", error); if (error.response) { const { data, status } = error.response; alert(`Profil güncellenemedi: ${data?.message || data || `Sunucu Hatası (${status})`}`); } else { alert("Profil güncellenemedi: Bir ağ hatası oluştu."); }
        } finally {
            //setIsSubmitting(false);
        }
    }

    // --- Logout Handler (Unchanged) ---
    const handleLogout = () => { console.log("Logging out..."); navigate("/"); }

    // Animation variants (Unchanged)
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2, }, }, };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 }, }, };

    // Toggle dark mode function
    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Helper class generators
    const getInputClassName = (darkMode, readOnly = false) => `${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-amber-50 border-amber-100 focus:border-amber-300"} ${readOnly ? 'bg-opacity-50 cursor-not-allowed' : ''} focus:ring-amber-200 transition-all duration-200 group-hover:border-amber-300`;
    const getLabelClassName = (darkMode) => `${darkMode ? "text-amber-300" : "text-[#6b4b10]"} text-sm flex items-center font-medium mb-1`;

    // Loading State (Unchanged)
    if (!isLoaded || !restaurantProfile) { return ( <div className={`flex justify-center items-center min-h-screen ${darkMode ? "bg-[#1c1c1c]" : "bg-[#F2E8D6]"}`}> <Loader2 className={`h-12 w-12 animate-spin ${darkMode ? "text-amber-400" : "text-amber-600"}`} /> </div> ); }

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c] text-white" : "bg-[#F2E8D6]"} transition-colors duration-300`} >
            {/* Success Notification (Unchanged) */}
            <div id="success-notification" className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg transform translate-y-20 opacity-0 transition-all duration-500 z-50" > <div className="flex items-center"> <div className="py-1"> <Check className="h-6 w-6 text-green-500 mr-3" /> </div> <div> <p className="font-bold">Başarılı!</p> <p className="text-sm">Profil bilgileriniz güncellendi.</p> </div> </div> </div>

            {/* --- Header (Unchanged) --- */}
            <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className={`${darkMode ? "bg-[#333]" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center shadow-md`} > <div className="flex items-center"> <Link to="/"> <span className="font-bold text-xl tracking-wide hover:text-amber-200 transition-colors duration-200"> Doy! </span> </Link> </div> <div className="flex items-center gap-4"> <div className="flex items-center gap-2"> <button onClick={toggleDarkMode} className={`w-10 h-5 rounded-full flex items-center ${darkMode ? "bg-amber-400 justify-end" : "bg-gray-300 justify-start"} p-1 transition-all duration-300`} > <div className="w-3 h-3 bg-white rounded-full"></div> </button> <Moon className="h-4 w-4 text-amber-200" /> </div> <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`rounded-full w-10 h-10 ${darkMode ? "bg-amber-400" : "bg-amber-500"} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`} > <span className="text-white text-sm font-medium"> {restaurantProfile.firstName?.[0]?.toUpperCase()}{restaurantProfile.lastName?.[0]?.toUpperCase()} </span> </motion.button> </div> </motion.header>

            {/* --- Logo/Restaurant Image Section (Unchanged) --- */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-center py-8" > <motion.div whileHover={{ rotate: 5, scale: 1.05 }} className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg`} > <div className="relative w-24 h-24"> <img src={restaurantProfile.restaurantLogo || "/image1.png"} alt={restaurantProfile.restaurantName || "Logo"} className="w-full h-full rounded-full object-cover" /> <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-amber-400" : "text-amber-800"}`}> {restaurantProfile.restaurantName} </div> </div> </motion.div> </motion.div>

            {/* Profile Content */}
            <div className="flex-grow flex justify-center items-start px-4 pb-8">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className={`w-full md:w-4/5 max-w-5xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-6 shadow-xl`} >
                    <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}> Restoran Sahibi Profili </h1>

                    {/* Tabs (Only Profile active) */}
                    <div className="mb-6">
                        <div className={`grid w-full grid-cols-2 rounded-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-amber-100"}`} > <button onClick={() => setActiveTab("profile")} className={`py-2 px-4 text-center font-medium transition-colors duration-200 ${ activeTab === "profile" ? (darkMode ? "bg-gray-600 text-amber-400" : "bg-amber-300 text-amber-900") : (darkMode ? "text-gray-400 hover:bg-gray-600" : "text-gray-600 hover:bg-amber-200") }`} > Profil </button> <button disabled onClick={() => setActiveTab("orders")} className={`py-2 px-4 text-center font-medium transition-colors duration-200 ${ activeTab === "orders" ? (darkMode ? "bg-gray-600 text-amber-400" : "bg-amber-300 text-amber-900") : (darkMode ? "text-gray-500 cursor-not-allowed" : "text-gray-400 cursor-not-allowed") }`} > Siparişler (Pasif) </button> </div>

                        <div className="mt-4">
                            {activeTab === "profile" && (
                                <motion.form onSubmit={handleProfileUpdate} variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"}>

                                    {/* --- Owner Information (TC First, Restaurant Name Last) --- */}
                                    <motion.div variants={itemVariants} className="mb-6 border-b pb-4">
                                        <h2 className={`text-lg font-semibold ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-3`}>Sahip & Restoran Temel Bilgileri</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* TC (Read Only - First Slot) */}
                                            <div>
                                                <Label htmlFor="governmentId" className={getLabelClassName(darkMode)}><CreditCard className="h-4 w-4 mr-2" /> TC (Değiştirilemez)</Label>
                                                <Input type="text" id="governmentId" name="governmentId" value={restaurantProfile.governmentId || ""} readOnly className={`w-full ${getInputClassName(darkMode, true)} rounded-md`} />
                                            </div>
                                            {/* First Name */}
                                            <div>
                                                <Label htmlFor="firstName" className={getLabelClassName(darkMode)}><User className="h-4 w-4 mr-2" /> Ad</Label>
                                                <div className="flex"> <Input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                            {/* Last Name */}
                                            <div>
                                                <Label htmlFor="lastName" className={getLabelClassName(darkMode)}><User className="h-4 w-4 mr-2" /> Soyad</Label>
                                                <div className="flex"> <Input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                            {/* Phone */}
                                            <div>
                                                <Label htmlFor="phoneNumber" className={getLabelClassName(darkMode)}><Phone className="h-4 w-4 mr-2" /> Telefon</Label>
                                                <div className="flex"> <Input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="5XX XXX XXXX" className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                            {/* Email */}
                                            <div>
                                                <Label htmlFor="email" className={getLabelClassName(darkMode)}><Mail className="h-4 w-4 mr-2" /> Email</Label>
                                                <div className="flex"> <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                            {/* Restaurant Name (Editable - Last Slot) */}
                                            <div>
                                                <Label htmlFor="restaurantName" className={getLabelClassName(darkMode)}><Utensils className="h-4 w-4 mr-2" /> Restoran Adı</Label>
                                                <div className="flex"> <Input type="text" id="restaurantName" name="restaurantName" value={formData.restaurantName} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* --- Restaurant Details (No Address Section, Address Display Added Here) --- */}
                                    <motion.div variants={itemVariants} className="mb-6 border-b pb-4">
                                        <h2 className={`text-lg font-semibold ${darkMode ? "text-amber-300" : "text-[#6b4b10]"} mb-3`}>Restoran Detayları</h2>
                                        {/* Address (Read Only - No Label) */}
                                        <div className="mb-4">
                                            {/* No Label */}
                                            <Input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address} // Or restaurantProfile.address
                                                readOnly
                                                placeholder="Adres (Değiştirilemez)"
                                                className={`w-full ${getInputClassName(darkMode, true)} rounded-md`}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Restaurant Phone */}
                                            <div>
                                                <Label htmlFor="restaurantPhone" className={getLabelClassName(darkMode)}><Phone className="h-4 w-4 mr-2" /> Restoran Telefonu</Label>
                                                <div className="flex"> <Input type="tel" id="restaurantPhone" name="restaurantPhone" value={formData.restaurantPhone} onChange={handleInputChange} placeholder="5XX XXX XXXX" className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                            {/* Restaurant Category */}
                                            <div>
                                                <Label htmlFor="restaurantCategory" className={getLabelClassName(darkMode)}><Tag className="h-4 w-4 mr-2" /> Kategori</Label>
                                                <Select id="restaurantCategory" name="restaurantCategory" value={formData.restaurantCategory} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-md`} > {RESTAURANT_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value} disabled={cat.value === ""}>{cat.label}</option>))} </Select>
                                            </div>
                                            {/* Minimum Order Price */}
                                            <div>
                                                <Label htmlFor="minOrderPrice" className={getLabelClassName(darkMode)}><DollarSign className="h-4 w-4 mr-2" /> Minimum Sipariş Tutarı (₺)</Label>
                                                <div className="flex"> <Input type="number" id="minOrderPrice" name="minOrderPrice" value={formData.minOrderPrice} onChange={handleInputChange} min="0" step="0.01" placeholder="Örn: 50" className={`w-full ${getInputClassName(darkMode)} rounded-l-md rounded-r-none`} /> <button type="button" tabIndex={-1} className={`${darkMode ? "bg-gray-600 border-gray-600" : "bg-amber-50 border-amber-100"} border border-l-0 rounded-r-md px-2`}> <Edit2 className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-800"}`} /> </button> </div>
                                            </div>
                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <Label htmlFor="description" className={getLabelClassName(darkMode)}><BookText className="h-4 w-4 mr-2" /> Açıklama</Label>
                                                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Restoranınız hakkında..." className={`w-full ${getInputClassName(darkMode)} rounded-md`} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* --- Address Section Removed --- */}

                                    {/* --- Password Change (Unchanged) --- */}
                                    <motion.div variants={itemVariants} className="mb-6 border-b pb-4"> <div className="mb-4"> <h2 className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}> Şifre Değiştir (İsteğe Bağlı) </h2> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div> <Label htmlFor="currentPassword" className={getLabelClassName(darkMode)}>Mevcut Şifre</Label> <Input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-md`} placeholder="Mevcut şifreniz" /> </div> <div> <Label htmlFor="newPassword" className={getLabelClassName(darkMode)}>Yeni Şifre</Label> <Input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-md`} placeholder="Yeni şifreniz" /> </div> <div> <Label htmlFor="confirmPassword" className={getLabelClassName(darkMode)}>Şifre Onayı</Label> <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full ${getInputClassName(darkMode)} rounded-md`} placeholder="Yeni şifrenizi tekrar girin" /> </div> </div> </motion.div>

                                    {/* --- Update Button (Unchanged) --- */}
                                    <motion.div variants={itemVariants} className="mb-4"> <Button type="submit" /* disabled={isSubmitting} */ className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${ darkMode ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-amber-400 hover:bg-amber-500 text-amber-900" } disabled:opacity-70 disabled:scale-100`} > { /* {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Bilgileri Güncelle"} */ "Bilgileri Güncelle"} </Button> </motion.div>

                                    {/* --- Logout Link (Unchanged) --- */}
                                    <motion.div variants={itemVariants}> <button type="button" onClick={handleLogout} className={`w-full text-center py-2 border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"} rounded-md transition-colors duration-200 flex items-center justify-center gap-2`} > <LogOut className="h-4 w-4" /> Hesabımdan Çıkış Yap </button> </motion.div>
                                </motion.form>
                            )}

                            {/* Orders Tab Content (Placeholder - Unchanged) */}
                            {activeTab === "orders" && ( <motion.div variants={containerVariants} initial="hidden" animate="visible" className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4`} > <h2 className={`text-lg font-semibold ${darkMode ? "text-amber-400" : "text-amber-800"} mb-4`}> Gelen Siparişler </h2> <motion.div variants={itemVariants} className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`} > <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" /> <p>Siparişler bölümü henüz aktif değil.</p> </motion.div> </motion.div> )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- Footer (Unchanged) --- */}
            <footer className={`mt-8 p-8 flex justify-between items-center ${darkMode ? "bg-[#1a1a1a]" : "bg-white"} transition-colors duration-300`} > <img src="/image1.png" alt="DOY Logo" className="h-[50px] w-[50px] rounded-full object-cover" /> <div className="flex gap-6"> <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Twitter size={24} /> </a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Instagram size={24} /> </a> <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Youtube size={24} /> </a> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Linkedin size={24} /> </a> </div> </footer>
        </div>
    )
}