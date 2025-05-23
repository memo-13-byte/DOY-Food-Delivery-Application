"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthorizedRequest from "../services/AuthorizedRequest";
import {
  Moon, Sun, Utensils, User, Mail, Phone, CreditCard, MapPin, ChevronRight,
  Instagram, Twitter, Youtube, Linkedin, AlertCircle, CheckCircle, Lock, Eye,
  EyeOff, Loader2, ListChecks // Removed Bike, kept MapPin
} from "lucide-react"
import { getResponseErrors } from "../services/exceptionUtils";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- Custom UI components (Button, Input, Label, Checkbox, Switch, Select) ---
// Assume these components are defined as in the previous examples
const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
  return ( <button type={type} disabled={disabled} className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${className}`} {...props}> {children} </button> );
}
const Input = ({ className, error, ...props }) => {
  return ( <input className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${ error ? "border-red-500 focus-visible:ring-red-500" : "border-input" } ${className}`} {...props} /> );
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
  "ADANA": ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan", "Kozan", "İmamoğlu", "Karataş", "Karaisalı", "Pozantı", "Yumurtalık", "Tufanbeyli", "Feke", "Aladağ", "Saimbeyli"], // Added Adana districts
  "BURSA": ["Osmangazi", "Nilüfer", "Yıldırım", "Gürsu", "Kestel", /* ... */ ],
  "ANTALYA": ["Muratpaşa", "Kepez", "Konyaaltı", "Aksu", "Döşemealtı", /* ... */ ],
  // ... add other cities and their districts
};


// --- Constants ---
const TURKISH_CITIES = [
  { value: "", label: "Şehir Seçin" },
  { value: "ISTANBUL", label: "İstanbul" },
  { value: "ANKARA", label: "Ankara" },
  { value: "IZMIR", label: "İzmir" },
  { value: "BURSA", label: "Bursa" },
  { value: "ANTALYA", label: "Antalya" },
  { value: "ADANA", label: "Adana" }, // Added Adana
  // ... add other cities
];


export default function CourierRegisterPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null }) // For general errors
  const navigate = useNavigate()

  // --- State for Courier Form (name changed to district) ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    governmentId: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    district: "", // <-- Renamed from 'name'
    city: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState({}) // For client-side validation errors
  const [touched, setTouched] = useState({})
  const [backendErrors, setBackendErrors] = useState(null); // For backend validation errors
  const [availableDistricts, setAvailableDistricts] = useState([]); // For dependent dropdown

  useEffect(() => {
    setMounted(true)
  }, [])

  // --- Validation Functions (Unchanged) ---
  const validateRequired = (value, fieldName) => { if (!value || (typeof value === 'string' && value.trim() === "")) return `${fieldName} gereklidir`; return ""; };
  const validateEmail = (email) => { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!email) return "E-posta adresi gereklidir"; if (!emailRegex.test(email)) return "Geçerli bir e-posta adresi giriniz"; return ""; };
  const validatePhone = (phone, fieldName = "Telefon") => { const phoneRegex = /^(0|90|\+90)?(5\d{9})$/; const digitsOnly = phone.replace(/\D/g, ""); if (!phone) return `${fieldName} numarası gereklidir`; let coreNumber = digitsOnly; if (digitsOnly.startsWith("90")) coreNumber = digitsOnly.substring(2); else if (digitsOnly.startsWith("0")) coreNumber = digitsOnly.substring(1); if (coreNumber.length !== 10 || !coreNumber.startsWith("5")) { return `Geçerli bir ${fieldName} numarası giriniz (Örn: 5XX XXX XXXX)`; } if (!phoneRegex.test(phone.replace(/\s/g, ''))) { return `Geçerli bir ${fieldName} formatı giriniz (Örn: 05xx xxx xxxx)`; } return ""; };
  const validateTCKN = (tckn) => { if (!tckn) return "T.C. Kimlik Numarası gereklidir"; if (!/^\d{11}$/.test(tckn)) return "T.C. Kimlik Numarası 11 rakamdan oluşmalıdır"; return ""; };
  const validatePassword = (password) => { return ""; };
  const validateConfirmPassword = (confirmPassword, password) => { if (!confirmPassword) return "Şifre tekrarı gereklidir"; if (password && confirmPassword !== password) return "Şifreler eşleşmiyor"; return ""; };
  const validateTerms = (accepted) => { if (!accepted) return "Kullanım şartlarını kabul etmelisiniz"; return ""; };

  // --- Field Validation Logic (Adapted for district) ---
  const validateField = (name, value, currentFormData) => {
    switch (name) {
        // Required fields
      case "firstName": return validateRequired(value, "Ad");
      case "lastName": return validateRequired(value, "Soyad");
      case "district": return validateRequired(value, "İlçe"); // <-- Now validating district
      case "city": return validateRequired(value, "Şehir");
      case "password": return validateRequired(value, "Şifre");

        // Specific format/logic checks
      case "email": return validateEmail(value);
      case "phoneNumber": return validatePhone(value, "Telefon");
      case "governmentId": return validateTCKN(value);
      case "confirmPassword": return validateConfirmPassword(value, currentFormData.password);
      case "acceptTerms": return validateTerms(value);

        // Removed 'name' case, add others if needed
      default: return "";
    }
  }

  // --- Validate All Fields (Unchanged structure) ---
  const validateAllFields = (data) => { /* ... same as before ... */
    const newErrors = {}; let isValid = true;
    Object.keys(data).forEach((key) => {
      if (key !== 'confirmPassword') { const error = validateField(key, data[key], data); if (error) { newErrors[key] = error; isValid = false; } }
    });
    if (!newErrors.password && data.password) { const confirmError = validateConfirmPassword(data.confirmPassword, data.password); if (confirmError) { newErrors.confirmPassword = confirmError; isValid = false; } }
    setErrors(newErrors); return isValid;
  };

  // --- Input Change Handler (With City->District Logic) ---
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    let newFormData = { ...formData, [id]: inputValue };

    // --- Logic for City -> District dependency ---
    if (id === 'city') {
      const selectedCity = inputValue;
      const districts = DISTRICT_DATA[selectedCity] || [];
      setAvailableDistricts(districts);
      // Reset district when city changes
      newFormData = { ...newFormData, district: "" };
      // Also clear touched/error state for district if city changes
      setTouched(prev => ({ ...prev, district: false }));
      setErrors(prev => ({ ...prev, district: "" }));
    }
    // --- End of City -> District logic ---

    setFormData(newFormData); // Update form data state

    // Client-side validation on change if touched
    if (touched[id] || (id === 'city' && touched.district) ) {
      const error = validateField(id, inputValue, newFormData);
      let confirmPasswordError = errors.confirmPassword;
      if (id === "password" && touched.confirmPassword) { confirmPasswordError = validateConfirmPassword(newFormData.confirmPassword, inputValue); }
      else if (id === "confirmPassword") { confirmPasswordError = validateConfirmPassword(inputValue, newFormData.password); }

      setErrors((prevErrors) => ({ ...prevErrors, [id]: error, confirmPassword: confirmPasswordError, ...(id === 'city' && { district: "" }) }));
    }

    // Clear submission status and backend errors on any input change
    setSubmitStatus({ success: false, error: null });
    setBackendErrors(null);
  }

  // --- Input Blur Handler (Unchanged) ---
  const handleBlur = (e) => { /* ... same as before ... */
    const { id, value } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [id]: true, }));
    const error = validateField(id, value, formData);
    let confirmPasswordError = errors.confirmPassword;
    if (id === "password" && touched.confirmPassword) { confirmPasswordError = validateConfirmPassword(formData.confirmPassword, value); }
    else if (id === "confirmPassword") { confirmPasswordError = validateConfirmPassword(value, formData.password); }
    setErrors((prevErrors) => ({ ...prevErrors, [id]: error, confirmPassword: confirmPasswordError }));
  };


  // --- Form Submission Handler (Payload adapted) ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ success: false, error: null })
    setBackendErrors(null);

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched)

    const isValid = validateAllFields(formData)

    if (isValid) {
      // --- Construct Payload: Map formData.district to API's 'name' field ---
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        governmentId: formData.governmentId,
        password: formData.password,
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        name: formData.district, // <-- Sending district value as 'name'
        city: formData.city,
      };

      // --- API Call ---
      try {
        const response = await AuthorizedRequest.postRequest("http://localhost:8080/api/registration/courier", payload, {
          headers: { "Content-Type": "application/json", }
        });

        console.log("Courier registration successful:", response.data);
        setSubmitStatus({ success: true, error: null });
        setBackendErrors(null);
        alert("Kurye kaydı başarıyla oluşturuldu!");
        // navigate('/login?type=courier'); // Optional redirect

      } catch (error) {
        console.error("Registration error details:", error);
        setSubmitStatus({ success: false, error: null }); // Clear general errors first

        if (error.response) { // --- Error handling logic (same as before) ---
          const { data, status } = error.response;
          console.error("API Error Response Data:", data); console.error("API Error Status:", status);
          setBackendErrors(getResponseErrors(error))
          /*
          if (data && typeof data === 'object' && data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) { setBackendErrors(data.errors); }
          else if (data && typeof data === 'string' && data.trim() !== '') { setBackendErrors([data]); }
          else if (data && typeof data === 'object' && data.message) { setBackendErrors([data.message]); }
          else { setSubmitStatus({ success: false, error: `Sunucu hatası (${status}). Lütfen tekrar deneyin.` }); setBackendErrors(null); }*/
        } else if (error.request) { setSubmitStatus({ success: false, error: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin." }); setBackendErrors(null);
        } else { setSubmitStatus({ success: false, error: `Bir hata oluştu: ${error.message}` }); setBackendErrors(null); }
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Client-side validation failed handling
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) { /* ... scroll logic ... */
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) { errorElement.scrollIntoView({ behavior: "smooth", block: "center" }); errorElement.focus({ preventScroll: true }); }
      }
      console.log("Client-side validation failed", errors);
      setBackendErrors(null);
      setIsSubmitting(false);
    }
  }


  // Toggle visibility functions
  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  // Helper class generators
  const getInputClassName = (darkMode) => `${darkMode ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white" : "bg-amber-50 border-amber-100 focus:border-amber-300"} focus:ring-amber-200 transition-all duration-200 group-hover:border-amber-300`
  const getLabelClassName = (darkMode) => `${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-center gap-2`


  return (
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"} transition-colors duration-300`} >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

        {/* --- Logo --- */}
        <div className={`flex justify-center py-8 ${mounted ? "animate-fadeIn" : "opacity-0"}`}> <div className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-36 h-36 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}> <div className="relative w-28 h-28"> <img src="/image1.png" alt="DOY Logo" width={112} height={112} className="w-full h-full" /> <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>FOOD DELIVERY</div> </div> </div> </div>

        {/* Courier Registration Form */}
        <div className="flex-grow flex justify-center items-start px-4 pb-12">
          <div className={`w-full max-w-xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-8 shadow-lg transition-all duration-300 ${mounted ? "animate-slideUp" : "opacity-0 translate-y-10"}`} >
            <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-amber-800"} text-center mb-6`}> Kurye Kayıt Formu </h1>

            {/* Tabs */}
            <div className="flex mb-8"> <Link to="/auth?tab=login&type=courier" className="flex-1"> <div className={`text-center py-2 border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"} hover:text-amber-500 transition-colors duration-200`}>Giriş</div> </Link> <div className="flex-1"> <div className={`text-center py-2 border-b-2 ${darkMode ? "border-amber-400 text-amber-300" : "border-amber-500 text-amber-800"} font-medium`}>Kayıt Ol</div> </div> </div>

            {/* General Submission Feedback Area */}
            {submitStatus.error && ( <div className={`mb-4 p-3 rounded-md ${darkMode ? 'bg-red-900/50 border border-red-700' : 'bg-red-100 border-red-300'}`}><ErrorMessage message={submitStatus.error} darkMode={darkMode} /></div> )}
            {submitStatus.success && ( <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${darkMode ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-green-100 border border-green-300 text-green-700'}`}><CheckCircle className="h-5 w-5" /><span>Kayıt başarıyla tamamlandı!</span></div> )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                {/* First Name */} <div className="space-y-1 group"> <Label htmlFor="firstName" className={getLabelClassName(darkMode)}><User className="h-4 w-4" /> Adınız</Label> <div className="relative"> <Input id="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Adınız" className={getInputClassName(darkMode)} error={!!errors.firstName} /> {touched.firstName && !errors.firstName && formData.firstName && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.firstName} darkMode={darkMode} /> </div>
                {/* Last Name */} <div className="space-y-1 group"> <Label htmlFor="lastName" className={getLabelClassName(darkMode)}><User className="h-4 w-4" /> Soyadınız</Label> <div className="relative"> <Input id="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Soyadınız" className={getInputClassName(darkMode)} error={!!errors.lastName}/> {touched.lastName && !errors.lastName && formData.lastName && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.lastName} darkMode={darkMode} /> </div>
                {/* Email */} <div className="space-y-1 group"> <Label htmlFor="email" className={getLabelClassName(darkMode)}><Mail className="h-4 w-4" /> E-posta Adresiniz</Label> <div className="relative"> <Input id="email" type="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} placeholder="ornek@eposta.com" className={getInputClassName(darkMode)} error={!!errors.email}/> {touched.email && !errors.email && formData.email && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.email} darkMode={darkMode} /> </div>
                {/* Phone Number */} <div className="space-y-1 group"> <Label htmlFor="phoneNumber" className={getLabelClassName(darkMode)}><Phone className="h-4 w-4" /> Telefon Numaranız</Label> <div className="relative"> <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="5XX XXX XXXX" className={getInputClassName(darkMode)} error={!!errors.phoneNumber} /> {touched.phoneNumber && !errors.phoneNumber && formData.phoneNumber && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.phoneNumber} darkMode={darkMode} /> </div>
                {/* Government ID */} <div className="space-y-1 group md:col-span-2"> <Label htmlFor="governmentId" className={getLabelClassName(darkMode)}><CreditCard className="h-4 w-4" /> T.C. Kimlik Numaranız</Label> <div className="relative"> <Input id="governmentId" value={formData.governmentId} onChange={handleInputChange} onBlur={handleBlur} placeholder="11 haneli kimlik numaranız" className={getInputClassName(darkMode)} error={!!errors.governmentId} maxLength={11} inputMode="numeric" /> {touched.governmentId && !errors.governmentId && formData.governmentId && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.governmentId} darkMode={darkMode} /> </div>
                {/* City */}
                <div className="space-y-1 group">
                  <Label htmlFor="city" className={getLabelClassName(darkMode)}><MapPin className="h-4 w-4" /> Çalışma Şehri</Label>
                  <Select id="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={getInputClassName(darkMode)} error={!!errors.city}>
                    {TURKISH_CITIES.map(city => (<option key={city.value} value={city.value} disabled={city.value === ""}>{city.label}</option>))}
                  </Select>
                  <ErrorMessage message={errors.city} darkMode={darkMode} />
                </div>
                {/* District (Replaces 'name' field) */}
                <div className="space-y-1 group">
                  <Label htmlFor="district" className={getLabelClassName(darkMode)}><MapPin className="h-4 w-4" /> Çalışma İlçesi</Label>
                  <Select
                      id="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClassName(darkMode)}
                      error={!!errors.district}
                      disabled={!formData.city || availableDistricts.length === 0} // Disable if no city or districts
                  >
                    <option value="" disabled>
                      {formData.city ? "İlçe Seçin" : "Önce Şehir Seçin"}
                    </option>
                    {availableDistricts.map(district => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                    ))}
                  </Select>
                  <ErrorMessage message={errors.district} darkMode={darkMode} />
                </div>
                {/* Password */} <div className="space-y-1 group"> <Label htmlFor="password" className={getLabelClassName(darkMode)}><Lock className="h-4 w-4" /> Şifre</Label> <div className="relative"> <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} onBlur={handleBlur} placeholder="••••••••" className={`${getInputClassName(darkMode)} pr-10`} error={!!errors.password} aria-describedby="password-hint"/> <button type="button" onClick={togglePasswordVisibility} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`} aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}> {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </button> </div> <ErrorMessage message={errors.password} darkMode={darkMode} /> <p id="password-hint" className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> Şifre en az 8 karakterden oluşup en az bir küçük, bir büyük harf ve bir tane de özel karakter içermelidir. </p> </div>
                {/* Confirm Password */} <div className="space-y-1 group"> <Label htmlFor="confirmPassword" className={getLabelClassName(darkMode)}><Lock className="h-4 w-4" /> Şifre Tekrar</Label> <div className="relative"> <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} onBlur={handleBlur} placeholder="••••••••" className={`${getInputClassName(darkMode)} pr-10`} error={!!errors.confirmPassword}/> <button type="button" onClick={toggleConfirmPasswordVisibility} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`} aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}> {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </button> {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && <SuccessIndicator darkMode={darkMode} />} </div> <ErrorMessage message={errors.confirmPassword} darkMode={darkMode} /> </div>
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
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2"> <ListChecks className="h-4 w-4" /> Lütfen aşağıdaki hataları düzeltin: </h3>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {typeof backendErrors === 'object' && !Array.isArray(backendErrors) && Object.entries(backendErrors).map(([field, message]) => ( <li key={field}>{message}</li> ))}
                      {Array.isArray(backendErrors) && backendErrors.map((message, index) => ( <li key={index}>{message}</li> ))}
                    </ul>
                  </div>
              )}

              {/* Link to Login */}
              <div className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-4`}> Zaten bir hesabınız var mı?{" "} <Link to="/auth?tab=login&type=courier" className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-800 hover:text-amber-600"} hover:underline transition-colors duration-200`}>Giriş yap</Link> </div>
            </form>
          </div>
        </div>

       <Footer darkMode={darkMode}></Footer>
      </div>
  )
}