"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import {
  Moon, Sun, Utensils, User, Mail, Phone, CreditCard, MapPin, ChevronRight,
  Instagram, Twitter, Youtube, Linkedin, AlertCircle, CheckCircle, Lock, Eye,
  EyeOff, Building, Home, BookText, Tag, DollarSign, Navigation, Loader2,
  ListChecks // Icon for backend errors list
} from "lucide-react"

// --- Custom UI components (Button, Input, Label, Checkbox, Switch, Textarea, Select) ---
// Assume these components are defined as in the previous examples
const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
  return ( <button type={type} disabled={disabled} className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${className}`} {...props}> {children} </button> );
}
const Input = ({ className, error, ...props }) => {
  return ( <input className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props} /> );
}
const Textarea = ({ className, error, ...props }) => {
  return ( <textarea className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props} /> );
}
const Select = ({ id, value, onChange, onBlur, error, className, children, ...props }) => {
  return ( <select id={id} value={value} onChange={onChange} onBlur={onBlur} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props}> {children} </select> );
}
const Label = ({ className, ...props }) => {
  return ( <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} /> );
}
const Checkbox = ({ id, checked, onChange, className, ...props }) => {
  return ( <div className="flex items-center space-x-2"> <input type="checkbox" id={id} checked={checked} onChange={onChange} className={`h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 ${className}`} {...props} /> </div> );
}
const Switch = ({ checked, onCheckedChange, className }) => {
  return ( <button role="switch" aria-checked={checked} data-state={checked ? "checked" : "unchecked"} onClick={() => onCheckedChange(!checked)} className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${ checked ? "bg-primary" : "bg-input" } ${className}`} > <span data-state={checked ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${ checked ? "translate-x-5" : "translate-x-0" }`} /> </button> );
}
// --- End of assumed UI components ---


// --- Error message component (unchanged) ---
const ErrorMessage = ({ message, darkMode }) => {
  if (!message) return null
  return ( <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${darkMode ? "text-red-400" : "text-red-500"}`}> <AlertCircle className="h-3.5 w-3.5" /> <span>{message}</span> </div> );
}
// --- End of Error message component ---

// --- Success indicator component (unchanged) ---
const SuccessIndicator = ({ darkMode }) => {
  return ( <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-green-400" : "text-green-500"}`}> <CheckCircle className="h-4 w-4" /> </div> );
}
// --- End of Success indicator component ---

// --- Data for Dependent Dropdowns ---
// NOTE: Populate this with more comprehensive data or fetch from an API
const DISTRICT_DATA = {
  "ANKARA": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı", "Kahramankazan", "Beypazarı", "Elmadağ", "Nallıhan", "Akyurt", "Şereflikoçhisar", "Haymana", "Çubuk", "Kızılcahamam", "Bala", "Kalecik", "Ayaş", "Güdül", "Çamlıdere", "Evren"],
  "ISTANBUL": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  "IZMIR": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  "BURSA": ["Osmangazi", "Nilüfer", "Yıldırım", "Gürsu", "Kestel", /* ... other Bursa districts */],
  "ANTALYA": ["Muratpaşa", "Kepez", "Konyaaltı", "Aksu", "Döşemealtı", /* ... other Antalya districts */],
  // ... add other cities and their districts
};


// --- Constants (Categories, Cities) remain the same ---
const RESTAURANT_CATEGORIES = [ /* ...categories */ { value: "", label: "Kategori Seçin" }, { value: "KEBAB", label: "Kebap" }, { value: "BURGER", label: "Burger" }, { value: "PIZZA", label: "Pizza" }, { value: "HOME_COOKING", label: "Ev Yemekleri" }, { value: "SEA_FOOD", label: "Deniz Ürünleri" }, { value: "DESERT", label: "Tatlı" }, { value: "COFFEE", label: "Kafe" }, { value: "OTHER", label: "Diğer" } ];
const TURKISH_CITIES = [ /* ...cities */ { value: "", label: "Şehir Seçin" }, { value: "ISTANBUL", label: "İstanbul" }, { value: "ANKARA", label: "Ankara" }, { value: "IZMIR", label: "İzmir" }, { value: "BURSA", label: "Bursa" }, { value: "ANTALYA", label: "Antalya" } ];


export default function RestaurantRegisterPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null }) // For general errors
  const navigate = useNavigate()

  // State for form data remains the same
  const [formData, setFormData] = useState({
    ownerName: "", ownerSurname: "", email: "", ownerPhone: "", idNumber: "",
    password: "", confirmPassword: "", restaurantName: "", description: "",
    restaurantPhone: "", restaurantCategory: "", minOrderPrice: "", city: "",
    district: "", neighborhood: "", avenue: "", street: "", buildingNumber: "",
    apartmentNumber: "", acceptTerms: false,
  })

  const [errors, setErrors] = useState({}) // For client-side validation errors
  const [touched, setTouched] = useState({})
  const [backendErrors, setBackendErrors] = useState(null); // <-- State for backend validation errors (object OR array)
  const [availableDistricts, setAvailableDistricts] = useState([]); // <-- State for available districts

  useEffect(() => {
    setMounted(true)
  }, [])

  // --- Simplified Validation Functions (remain the same) ---
  const validateRequired = (value, fieldName) => { /* ... */ if (!value || (typeof value === 'string' && value.trim() === "")) return `${fieldName} gereklidir`; return ""; };
  const validateEmail = (email) => { /* ... */ const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!email) return "E-posta adresi gereklidir"; if (!emailRegex.test(email)) return "Geçerli bir e-posta adresi giriniz"; return ""; };
  const validatePhone = (phone, fieldName = "Telefon") => { /* ... */ const phoneRegex = /^(0|90|\+90)?(5\d{9})$/; const digitsOnly = phone.replace(/\D/g, ""); if (!phone) return `${fieldName} numarası gereklidir`; let coreNumber = digitsOnly; if (digitsOnly.startsWith("90")) coreNumber = digitsOnly.substring(2); else if (digitsOnly.startsWith("0")) coreNumber = digitsOnly.substring(1); if (coreNumber.length !== 10 || !coreNumber.startsWith("5")) { return `Geçerli bir ${fieldName} numarası giriniz (Örn: 5XX XXX XXXX)`; } if (!phoneRegex.test(phone.replace(/\s/g, ''))) { return `Geçerli bir ${fieldName} formatı giriniz (Örn: 05xx xxx xxxx)`; } return ""; };
  const validateTCKN = (tckn) => { /* ... */ if (!tckn) return "T.C. Kimlik Numarası gereklidir"; if (!/^\d{11}$/.test(tckn)) return "T.C. Kimlik Numarası 11 rakamdan oluşmalıdır"; return ""; };
  const validateNumber = (value, fieldName, allowZero = false, allowNegative = false) => { /* ... */ if (value === "" || value === null || value === undefined) return `${fieldName} gereklidir`; const num = Number(value); if (isNaN(num)) return `${fieldName} sayısal bir değer olmalıdır`; if (!allowZero && num === 0) return `${fieldName} 0 olamaz`; if (!allowNegative && num < 0) return `${fieldName} negatif olamaz`; return ""; };
  const validatePassword = (password) => { /* ... */ return ""; }; // No client-side complexity check
  const validateConfirmPassword = (confirmPassword, password) => { /* ... */ if (!confirmPassword) return "Şifre tekrarı gereklidir"; if (password && confirmPassword !== password) return "Şifreler eşleşmiyor"; return ""; };
  const validateTerms = (accepted) => { /* ... */ if (!accepted) return "Kullanım şartlarını kabul etmelisiniz"; return ""; };

  // --- Updated validateField Function (remains the same structure) ---
  const validateField = (name, value, currentFormData) => { /* ... same as before ... */
    switch (name) { case "ownerName": return validateRequired(value, "Ad");
      case "ownerSurname": return validateRequired(value, "Soyad");
      case "restaurantName": return validateRequired(value, "Restoran adı");
      case "district": return validateRequired(value, "İlçe");
      case "neighborhood": return validateRequired(value, "Mahalle");
      case "street": return validateRequired(value, "Sokak");
        // --- UPDATED CASES ---
      case "buildingNumber":
        // Must be required AND digits only
        return validateDigitsOnly(value, "Bina Numarası", true);
      case "apartmentNumber":
        // Optional, but if present, must be digits only
        return validateDigitsOnly(value, "Daire Numarası", false);
      case "restaurantCategory": return validateRequired(value, "Restoran kategorisi");
      case "city": return validateRequired(value, "Şehir");
      case "password": return validateRequired(value, "Şifre");
      case "email": return validateEmail(value);
      case "ownerPhone": return validatePhone(value, "Sahip Telefon");
      case "restaurantPhone": return validatePhone(value, "Restoran Telefon");
      case "idNumber": return validateTCKN(value);
      case "minOrderPrice": return validateNumber(value, "Minimum sipariş tutarı", true, false);
      case "confirmPassword": return validateConfirmPassword(value, currentFormData.password);
      case "acceptTerms": return validateTerms(value);
      case "description": case "avenue":

       }
  };

  // validateAllFields function remains structurally the same
  const validateAllFields = (data) => { /* ... same as before ... */
    const newErrors = {}; let isValid = true;
    Object.keys(data).forEach((key) => {
      const error = validateField(key, data[key], data);
      if (error) { newErrors[key] = error; isValid = false; }
    });
    if (!newErrors.password && data.password) {
      const confirmError = validateConfirmPassword(data.confirmPassword, data.password);
      if (confirmError) { newErrors.confirmPassword = confirmError; isValid = false; }
    }
    setErrors(newErrors);
    return isValid;
  };
  const validateDigitsOnly = (value, fieldName, isRequired = true) => {
    // Check if required first
    if (!value) {
      return isRequired ? `${fieldName} gereklidir` : ""; // Empty is ok if not required
    }
    // Check if value contains only digits
    if (!/^\d+$/.test(value)) {
      return `${fieldName} sadece rakamlardan oluşmalıdır`;
    }
    return ""; // Valid
  };


  // --- Updated handleInputChange for Dependent Dropdowns & Clearing Errors ---
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    const previousCity = formData.city;
    let newFormData = { ...formData, [id]: inputValue };

    // City -> District dependency logic
    if (id === 'city') {
      const selectedCity = inputValue;
      const districts = DISTRICT_DATA[selectedCity] || [];
      setAvailableDistricts(districts);
      newFormData = { ...newFormData, district: "" }; // Reset district
      setTouched(prev => ({ ...prev, district: false })); // Reset touched state for district
      setErrors(prev => ({ ...prev, district: "" })); // Clear client error for district
    }

    setFormData(newFormData); // Update form data state

    // Client-side validation on change if touched
    if (touched[id] || (id === 'city' && touched.district) ) {
      const error = validateField(id, inputValue, newFormData);
      let confirmPasswordError = errors.confirmPassword; // Keep existing error unless changed
      if (id === "password" && touched.confirmPassword) { confirmPasswordError = validateConfirmPassword(newFormData.confirmPassword, inputValue); }
      else if (id === "confirmPassword") { confirmPasswordError = validateConfirmPassword(inputValue, newFormData.password); }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: error,
        confirmPassword: confirmPasswordError, // Update confirm password error
        ...(id === 'city' && { district: "" }) // Ensure district error is cleared visually when city changes
      }));
    }

    // Clear submission status and backend errors on any input change
    setSubmitStatus({ success: false, error: null });
    setBackendErrors(null); // <-- Clear backend errors too
  }

  // handleBlur remains the same structure
  const handleBlur = (e) => { /* ... same as before ... */
    const { id, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setTouched((prevTouched) => ({ ...prevTouched, [id]: true, }));

    const error = validateField(id, inputValue, formData);
    let confirmPasswordError = errors.confirmPassword; // Keep existing
    if (id === "password" && touched.confirmPassword) { confirmPasswordError = validateConfirmPassword(formData.confirmPassword, inputValue); }
    else if (id === "confirmPassword") { confirmPasswordError = validateConfirmPassword(inputValue, formData.password); }

    setErrors((prevErrors) => ({ ...prevErrors, [id]: error, confirmPassword: confirmPasswordError }));
  };


  // --- Updated handleSubmit with Modified Backend Error Handling ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ success: false, error: null })
    setBackendErrors(null); // Clear previous backend errors

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched)

    // Client-side validation
    const isValid = validateAllFields(formData)

    if (isValid) {
      const payload = { /* ... payload construction ... */
        userInfo: { firstName: formData.ownerName, lastName: formData.ownerSurname, email: formData.email, governmentId: formData.idNumber, password: formData.password, phoneNumber: formData.ownerPhone.replace(/\D/g, ''), },
        restaurantInfo: { restaurantName: formData.restaurantName, description: formData.description, restaurantPhone: formData.restaurantPhone.replace(/\D/g, ''), restaurantCategory: formData.restaurantCategory, minOrderPrice: parseFloat(formData.minOrderPrice) || 0, },
        addressInfo: { city: formData.city, neighborhood: formData.neighborhood, district: formData.district, avenue: formData.avenue, street: formData.street, buildingNumber: formData.buildingNumber, apartmentNumber: formData.apartmentNumber, },
      };

      // --- API Call ---
      try {
        const response = await axios.post("http://localhost:8080/api/registration/restaurant", payload, {
          headers: { "Content-Type": "application/json", }
        });
        setSubmitStatus({ success: true, error: null });
        setBackendErrors(null); // Clear backend errors on success
        alert("Restoran kaydı başarıyla oluşturuldu!");
        // navigate('/login'); // Optional redirect

      } catch (error) {
        console.error("Registration error details:", error);
        setSubmitStatus({ success: false, error: null }); // Clear general errors first

        if (error.response) {
          const { data, status } = error.response;
          console.error("API Error Response Data:", data);
          console.error("API Error Status:", status);

          // 1. Check for SPECIFIC field errors object
          if (data && typeof data === 'object' && data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
            console.log("Setting backend field errors (object):", data.errors);
            setBackendErrors(data.errors); // Populates errors below button
          }
          // 2. Check if data is a non-empty STRING (treat as error to show below button)
          else if (data && typeof data === 'string' && data.trim() !== '') {
            console.log("Setting backend error from string data:", data);
            // Treat the string as a list with one item for display below button
            setBackendErrors([data]); // <--- MODIFIED: Put string into backendErrors array
          }
          // 3. Check if data is an OBJECT with a 'message' property (treat as error below button)
          else if (data && typeof data === 'object' && data.message) {
            console.log("Setting backend error from data.message:", data.message);
            // Treat the message as a list with one item for display below button
            setBackendErrors([data.message]); // <--- MODIFIED: Put message into backendErrors array
          }
          // 4. Fallback generic message (will show ABOVE form now, as backendErrors is null)
          else {
            console.log("Setting fallback GENERAL error message for status:", status);
            setSubmitStatus({ success: false, error: `Sunucu hatası (${status}). Lütfen tekrar deneyin.` });
            setBackendErrors(null); // Ensure backendErrors is null for fallback
          }
        } else if (error.request) {
          // Network error (Shows ABOVE form)
          console.error("Network Error (No Response):", error.request);
          setSubmitStatus({ success: false, error: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin." });
          setBackendErrors(null);
        } else {
          // Setup error (Shows ABOVE form)
          console.error("Request Setup Error:", error.message);
          setSubmitStatus({ success: false, error: `Bir hata oluştu: ${error.message}` });
          setBackendErrors(null);
        }
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Client-side validation failed handling (scroll to error)
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) { /* ... scroll logic ... */
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) { errorElement.scrollIntoView({ behavior: "smooth", block: "center" }); errorElement.focus({ preventScroll: true }); }
      }
      console.log("Client-side validation failed", errors);
      setBackendErrors(null); // Clear backend errors if client validation fails
      setIsSubmitting(false);
    }
  }


  // Toggle visibility functions remain the same
  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  // Helper class generators remain the same
  const getInputClassName = (darkMode) => `${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-amber-50 border-amber-100 focus:border-amber-300"} focus:ring-amber-200 transition-all duration-200 group-hover:border-amber-300`
  const getLabelClassName = (darkMode) => `${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-center gap-2`


  return (
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"} transition-colors duration-300`} >
        {/* --- Header --- */}
        <header className={`${darkMode ? "bg-gray-800" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md transition-colors duration-300`} > <div className="flex items-center"> <Link to="/"> <span className="font-bold text-xl hover:text-amber-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"> <Utensils className="h-5 w-5" /> <span>Doy!</span> </span> </Link> </div> <div className="flex items-center gap-4"> <div className="flex items-center gap-2"> <Switch checked={darkMode} onCheckedChange={setDarkMode} className={`${darkMode ? "data-[state=checked]:bg-gray-600" : "data-[state=checked]:bg-amber-200"} transition-colors duration-300`} /> {darkMode ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-amber-200" />} </div> <Link to="/auth?tab=register"> <button className={`${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-amber-200 text-amber-800 hover:bg-amber-300"} rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105`}>KAYIT</button> </Link> <Link to="/auth?tab=login"> <button className={`${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-white text-amber-800 hover:bg-amber-50"} rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm`}>GİRİŞ</button> </Link> </div> </header>

        {/* --- Logo --- */}
        <div className={`flex justify-center py-8 ${mounted ? "animate-fadeIn" : "opacity-0"}`}> <div className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-36 h-36 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}> <div className="relative w-28 h-28"> <img src="/image1.png" alt="DOY Logo" width={112} height={112} className="w-full h-full" /> <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>FOOD DELIVERY</div> </div> </div> </div>

        {/* Registration Form */}
        <div className="flex-grow flex justify-center items-start px-4 pb-12">
          <div className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-8 shadow-lg transition-all duration-300 ${mounted ? "animate-slideUp" : "opacity-0 translate-y-10"}`} >
            <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-amber-800"} text-center mb-6`}> Restoran Kayıt Formu </h1>

            {/* Tabs */}
            <div className="flex mb-8"> <Link to="/auth?tab=login&type=restaurant" className="flex-1"> <div className={`text-center py-2 border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"} hover:text-amber-500 transition-colors duration-200`}>Giriş</div> </Link> <div className="flex-1"> <div className={`text-center py-2 border-b-2 ${darkMode ? "border-amber-400 text-amber-300" : "border-amber-500 text-amber-800"} font-medium`}>Kayıt Ol</div> </div> </div>

            {/* General Submission Feedback Area (Only shows fallback/network errors now) */}
            {submitStatus.error && (
                <div className={`mb-4 p-3 rounded-md ${darkMode ? 'bg-red-900/50 border border-red-700' : 'bg-red-100 border-red-300'}`}>
                  <ErrorMessage message={submitStatus.error} darkMode={darkMode} />
                </div>
            )}
            {submitStatus.success && ( <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${darkMode ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-green-100 border border-green-300 text-green-700'}`}><CheckCircle className="h-5 w-5" /><span>Kayıt başarıyla tamamlandı!</span></div> )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* --- User Info Section --- */}
              <h2 className={`text-lg font-semibold border-b pb-2 mb-4 ${darkMode ? 'border-gray-700 text-amber-400' : 'border-gray-300 text-amber-700'}`}> Sahip Bilgileri </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                {/* Input Fields... */}
                <div className="space-y-1 group"> <Label htmlFor="ownerName" className={getLabelClassName(darkMode)}><User className="h-4 w-4" /> Adınız</Label> <div className="relative"> <Input id="ownerName" value={formData.ownerName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Adınız" className={getInputClassName(darkMode)} error={!!errors.ownerName} /> {touched.ownerName && !errors.ownerName && formData.ownerName && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.ownerName} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="ownerSurname" className={getLabelClassName(darkMode)}><User className="h-4 w-4" /> Soyadınız</Label> <div className="relative"> <Input id="ownerSurname" value={formData.ownerSurname} onChange={handleInputChange} onBlur={handleBlur} placeholder="Soyadınız" className={getInputClassName(darkMode)} error={!!errors.ownerSurname}/> {touched.ownerSurname && !errors.ownerSurname && formData.ownerSurname && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.ownerSurname} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="email" className={getLabelClassName(darkMode)}><Mail className="h-4 w-4" /> E-posta Adresiniz</Label> <div className="relative"> <Input id="email" type="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} placeholder="sahip@ornek.com" className={getInputClassName(darkMode)} error={!!errors.email}/> {touched.email && !errors.email && formData.email && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.email} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="ownerPhone" className={getLabelClassName(darkMode)}><Phone className="h-4 w-4" /> Telefon Numaranız</Label> <div className="relative"> <Input id="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} onBlur={handleBlur} placeholder="5XX XXX XXXX" className={getInputClassName(darkMode)} error={!!errors.ownerPhone} /> {touched.ownerPhone && !errors.ownerPhone && formData.ownerPhone && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.ownerPhone} darkMode={darkMode} /> </div>
                <div className="space-y-1 group md:col-span-2"> <Label htmlFor="idNumber" className={getLabelClassName(darkMode)}><CreditCard className="h-4 w-4" /> T.C. Kimlik Numaranız</Label> <div className="relative"> <Input id="idNumber" value={formData.idNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="11 haneli kimlik numaranız" className={getInputClassName(darkMode)} error={!!errors.idNumber} maxLength={11} inputMode="numeric" /> {touched.idNumber && !errors.idNumber && formData.idNumber && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.idNumber} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="password" className={getLabelClassName(darkMode)}><Lock className="h-4 w-4" /> Şifre</Label> <div className="relative"> <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} onBlur={handleBlur} placeholder="••••••••" className={`${getInputClassName(darkMode)} pr-10`} error={!!errors.password} aria-describedby="password-hint"/> <button type="button" onClick={togglePasswordVisibility} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`} aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}> {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </button> </div> <ErrorMessage message={errors.password} darkMode={darkMode} /> <p id="password-hint" className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> Şifre en az 8 karakterden oluşup en az bir küçük, bir büyük harf ve bir tane de özel karakter içermelidir. </p> </div>
                <div className="space-y-1 group"> <Label htmlFor="confirmPassword" className={getLabelClassName(darkMode)}><Lock className="h-4 w-4" /> Şifre Tekrar</Label> <div className="relative"> <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} onBlur={handleBlur} placeholder="••••••••" className={`${getInputClassName(darkMode)} pr-10`} error={!!errors.confirmPassword}/> <button type="button" onClick={toggleConfirmPasswordVisibility} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`} aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}> {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </button> {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.confirmPassword} darkMode={darkMode} /> </div>
              </div>

              {/* --- Restaurant Info Section --- */}
              <h2 className={`text-lg font-semibold border-b pb-2 mb-4 mt-6 ${darkMode ? 'border-gray-700 text-amber-400' : 'border-gray-300 text-amber-700'}`}> Restoran Bilgileri </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                {/* Input Fields... */}
                <div className="space-y-1 group"> <Label htmlFor="restaurantName" className={getLabelClassName(darkMode)}><Utensils className="h-4 w-4" /> Restoran Adı</Label> <div className="relative"> <Input id="restaurantName" value={formData.restaurantName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Restoranınızın adı" className={getInputClassName(darkMode)} error={!!errors.restaurantName} /> {touched.restaurantName && !errors.restaurantName && formData.restaurantName && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.restaurantName} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="restaurantPhone" className={getLabelClassName(darkMode)}><Phone className="h-4 w-4" /> Restoran Telefonu</Label> <div className="relative"> <Input id="restaurantPhone" value={formData.restaurantPhone} onChange={handleInputChange} onBlur={handleBlur} placeholder="Restoran iletişim numarası" className={getInputClassName(darkMode)} error={!!errors.restaurantPhone} /> {touched.restaurantPhone && !errors.restaurantPhone && formData.restaurantPhone && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.restaurantPhone} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="restaurantCategory" className={getLabelClassName(darkMode)}><Tag className="h-4 w-4" /> Restoran Kategorisi</Label> <Select id="restaurantCategory" value={formData.restaurantCategory} onChange={handleInputChange} onBlur={handleBlur} className={getInputClassName(darkMode)} error={!!errors.restaurantCategory} > {RESTAURANT_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value} disabled={cat.value === ""}>{cat.label}</option>))} </Select> <ErrorMessage message={errors.restaurantCategory} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="minOrderPrice" className={getLabelClassName(darkMode)}><DollarSign className="h-4 w-4" /> Minimum Sipariş Tutarı (₺)</Label> <div className="relative"> <Input id="minOrderPrice" type="number" value={formData.minOrderPrice} onChange={handleInputChange} onBlur={handleBlur} placeholder="Örn: 50" className={getInputClassName(darkMode)} error={!!errors.minOrderPrice} min="0" step="0.01"/> {touched.minOrderPrice && !errors.minOrderPrice && formData.minOrderPrice !== "" && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.minOrderPrice} darkMode={darkMode} /> </div>
                <div className="space-y-1 group md:col-span-2"> <Label htmlFor="description" className={getLabelClassName(darkMode)}><BookText className="h-4 w-4" /> Restoran Açıklaması (Opsiyonel)</Label> <Textarea id="description" value={formData.description} onChange={handleInputChange} onBlur={handleBlur} placeholder="Restoranınız hakkında kısa bir açıklama..." className={getInputClassName(darkMode)} error={!!errors.description} rows={3} /> <ErrorMessage message={errors.description} darkMode={darkMode} /> </div>
              </div>


              {/* --- Address Info Section --- */}
              <h2 className={`text-lg font-semibold border-b pb-2 mb-4 mt-6 ${darkMode ? 'border-gray-700 text-amber-400' : 'border-gray-300 text-amber-700'}`}> Restoran Adresi </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                <div className="space-y-1 group"> <Label htmlFor="city" className={getLabelClassName(darkMode)}><MapPin className="h-4 w-4" /> Şehir</Label> <Select id="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={getInputClassName(darkMode)} error={!!errors.city}> {TURKISH_CITIES.map(city => (<option key={city.value} value={city.value} disabled={city.value === ""}>{city.label}</option>))} </Select> <ErrorMessage message={errors.city} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="district" className={getLabelClassName(darkMode)}><MapPin className="h-4 w-4" /> İlçe</Label> <Select id="district" value={formData.district} onChange={handleInputChange} onBlur={handleBlur} className={getInputClassName(darkMode)} error={!!errors.district} disabled={!formData.city || availableDistricts.length === 0} > <option value="" disabled> {formData.city ? "İlçe Seçin" : "Önce Şehir Seçin"} </option> {availableDistricts.map(district => ( <option key={district} value={district}> {district} </option> ))} </Select> <ErrorMessage message={errors.district} darkMode={darkMode} /> </div>
                <div className="space-y-1 group md:col-span-2"> <Label htmlFor="neighborhood" className={getLabelClassName(darkMode)}><MapPin className="h-4 w-4" /> Mahalle</Label> <div className="relative"> <Input id="neighborhood" value={formData.neighborhood} onChange={handleInputChange} onBlur={handleBlur} placeholder="Örn: Kızılay Mahallesi" className={getInputClassName(darkMode)} error={!!errors.neighborhood}/> {touched.neighborhood && !errors.neighborhood && formData.neighborhood && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.neighborhood} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="avenue" className={getLabelClassName(darkMode)}><Navigation className="h-4 w-4" /> Cadde/Bulvar (Opsiyonel)</Label> <div className="relative"> <Input id="avenue" value={formData.avenue} onChange={handleInputChange} onBlur={handleBlur} placeholder="Örn: Atatürk Bulvarı" className={getInputClassName(darkMode)} error={!!errors.avenue}/> {touched.avenue && !errors.avenue && formData.avenue && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.avenue} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="street" className={getLabelClassName(darkMode)}><Navigation className="h-4 w-4" /> Sokak</Label> <div className="relative"> <Input id="street" value={formData.street} onChange={handleInputChange} onBlur={handleBlur} placeholder="Örn: Gazi Sokak" className={getInputClassName(darkMode)} error={!!errors.street}/> {touched.street && !errors.street && formData.street && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.street} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="buildingNumber" className={getLabelClassName(darkMode)}><Building className="h-4 w-4" /> Bina No</Label> <div className="relative"> <Input id="buildingNumber" value={formData.buildingNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="Örn: 10" className={getInputClassName(darkMode)} error={!!errors.buildingNumber}/> {touched.buildingNumber && !errors.buildingNumber && formData.buildingNumber && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.buildingNumber} darkMode={darkMode} /> </div>
                <div className="space-y-1 group"> <Label htmlFor="apartmentNumber" className={getLabelClassName(darkMode)}><Home className="h-4 w-4" /> Daire No (Opsiyonel)</Label> <div className="relative"> <Input id="apartmentNumber" value={formData.apartmentNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="Örn: 5" className={getInputClassName(darkMode)} error={!!errors.apartmentNumber}/> {touched.apartmentNumber && !errors.apartmentNumber && formData.apartmentNumber && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.apartmentNumber} darkMode={darkMode} /> </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="space-y-2 group pt-4">
                <div className="flex items-start gap-2"> <Checkbox id="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} onBlur={handleBlur} className={`mt-0.5 ${errors.acceptTerms ? "border-red-500" : ""}`} aria-invalid={!!errors.acceptTerms} aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined} /> <Label htmlFor="acceptTerms" className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}> <span className="flex items-center gap-1"> Kullanım Şartlarını Kabul Ediyorum <Link to="/terms" className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-800"} underline underline-offset-2`} target="_blank">(Şartları Oku)</Link> </span> </Label> </div> <ErrorMessage message={errors.acceptTerms} darkMode={darkMode} id="acceptTerms-error"/>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting || submitStatus.success} className={`w-full mt-8 ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-amber-300 hover:bg-amber-400 text-amber-800"} font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 h-11 px-4 py-2 disabled:bg-opacity-70 disabled:scale-100`} > {isSubmitting ? ( <><Loader2 className="h-5 w-5 animate-spin" /> Kaydediliyor...</> ) : ( <> Kayıt Ol <ChevronRight className="h-4 w-4" /></> )} </Button>

              {/* --- Display Backend Errors Below Button (Handles Object OR Array) --- */}
              {backendErrors && (
                  <div className={`mt-4 p-3 rounded-md border ${darkMode ? 'bg-red-900/20 border-red-700/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <ListChecks className="h-4 w-4" /> Lütfen aşağıdaki hataları düzeltin:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {/* Handles backendErrors if it's an object {field: message} */}
                      {typeof backendErrors === 'object' && !Array.isArray(backendErrors) && Object.entries(backendErrors).map(([field, message]) => (
                          <li key={field}>{message}</li>
                      ))}
                      {/* Handles backendErrors if it's an array of strings */}
                      {Array.isArray(backendErrors) && backendErrors.map((message, index) => (
                          <li key={index}>{message}</li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Link to Login */}
              <div className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-4`}> Zaten bir hesabınız var mı?{" "} <Link to="/auth?tab=login&type=restaurant" className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-800 hover:text-amber-600"} hover:underline transition-colors duration-200`}>Giriş yap</Link> </div>
            </form>
          </div>
        </div>

        {/* --- Footer --- */}
        <footer className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-200"} p-8 border-t transition-colors duration-300 mt-auto`}> <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto"> <div className="mb-6 md:mb-0"> <div className={`rounded-full ${darkMode ? "bg-gray-700" : "bg-white"} p-4 w-24 h-24 flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105`}> <div className="relative w-16 h-16"> <img src="/image1.png" alt="DOY Logo" width={64} height={64} className="w-full h-full" /> <div className={`text-center text-[8px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>FOOD DELIVERY</div> </div> </div> </div> <div className="flex gap-8"> {/* Social Links */} <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="Twitter"><Twitter className="w-6 h-6" /></a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="Instagram"><Instagram className="w-6 h-6" /></a> <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="YouTube"><Youtube className="w-6 h-6" /></a> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"} transition-all duration-200 transform hover:scale-110`} aria-label="LinkedIn"><Linkedin className="w-6 h-6" /></a> </div> </div> </footer>
      </div>
  )
}