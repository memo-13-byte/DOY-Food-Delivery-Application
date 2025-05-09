"use client"

import { useState, useEffect, useCallback } from "react" // Added useCallback
import { Link, useNavigate, useParams } from "react-router-dom"
import AuthorizedRequest from "../services/AuthorizedRequest";
import {
    Moon, Sun, Utensils, User, Mail, Phone, MapPin, CheckCircle, XCircle, Send, CheckCheck,
    StickyNote, Package, ImageIcon, Loader2, AlertTriangle, Wifi, WifiOff, // Added Wifi icons for status
    LogOut, Check, ChevronRight, Instagram, Twitter, Youtube, Linkedin, Currency,
    Bike
} from "lucide-react"
import { motion } from "framer-motion"

// --- Custom UI components (Assume Button, Label, Switch are defined correctly) ---
const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
    return ( <button type={type} disabled={disabled} className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${className}`} {...props}> {children} </button> );
}
const Label = ({ className, htmlFor, ...props }) => { // Added htmlFor for accessibility
    return ( <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} /> );
}
const Switch = ({ checked, onCheckedChange, className, id, disabled = false }) => { // Added id and disabled prop
    return ( <button id={id} type="button" role="switch" aria-checked={checked} data-state={checked ? "checked" : "unchecked"} onClick={() => onCheckedChange(!checked)} disabled={disabled} className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${ checked ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600" } ${className}`} > <span data-state={checked ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${ checked ? "translate-x-5" : "translate-x-0" }`} /> </button> );
}
// --- End of UI components ---


export default function CourierOrdersPage() {
    const { id: courierId } = useParams();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [ordersData, setOrdersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading for initial data fetch
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // Loading for accept/reject actions

    // --- State for Courier Availability ---
    const [isAvailable, setIsAvailable] = useState(true); // Will be updated by fetch
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Loading for status update

    // Base URL for your API
    const API_BASE_URL = "http://localhost:8080";

    // --- Define fetchOrders using useCallback ---
    const fetchOrdersAndStatus = useCallback(async () => { // Renamed for clarity
        if (!courierId) {
            setError("Kurye ID URL'de belirtilmemiş.");
            setIsLoading(false);
            setIsLoaded(true);
            setOrdersData([]);
            return;
        }
        console.log(`Fetching orders and status for courier ID: ${courierId}`);
        setIsLoading(true);
        setError(null);
        try {
            const [ordersResponse, statusResponse] = await Promise.all([
                AuthorizedRequest.getRequest(`${API_BASE_URL}/order/courier/${courierId}/requests`),
                AuthorizedRequest.getRequest(`${API_BASE_URL}/order/courier/status/${courierId}`) // Fetch status
            ]);

            setOrdersData(ordersResponse.data.requestInfos || []);

            if (typeof statusResponse.data === 'boolean') {
                setIsAvailable(statusResponse.data);
                console.log(`Fetched courier status for ${courierId}: ${statusResponse.data}`);
            } else {
                console.warn("Fetched courier status was not a boolean:", statusResponse.data);
            }

        } catch (err) {
            console.error(`Failed to fetch courier data for ID ${courierId}:`, err);
            let fetchErrorMsg = "Veriler yüklenirken bir hata oluştu.";
            console.log(err)
            if(err.response.data.errors){
                fetchErrorMsg = (err.response.data.errors);
            }
            else if (err.response) {
                fetchErrorMsg = `Veriler yüklenemedi (${err.response.status}): ${err.response.data?.message || err.response.data || 'Bilinmeyen sunucu hatası'}`;
            }
            else if (err.request) { fetchErrorMsg = "Sunucuya ulaşılamadı."; }
            else { fetchErrorMsg = err.message || fetchErrorMsg; }
            setError(fetchErrorMsg);
            setOrdersData([]);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsLoaded(true), 100);
        }
    }, [courierId, API_BASE_URL]);


    // --- useEffect to call fetchOrdersAndStatus on mount and when courierId changes ---
    useEffect(() => {
        fetchOrdersAndStatus();
    }, [fetchOrdersAndStatus]); // Use the renamed function

    // --- Handler to Toggle Courier Availability Status ---
    const handleToggleAvailability = async (newStatus) => {
        if (!courierId) {
            alert("Kurye ID bulunamadı.");
            return;
        }
        console.log(`Attempting to set courier ${courierId} status to: ${newStatus}`);
        setIsUpdatingStatus(true);
        const previousStatus = isAvailable; // Store previous state for potential revert

        // Optimistically update UI
        setIsAvailable(newStatus);

        try {
            const url = `${API_BASE_URL}/order/courier/update/status/${courierId}-${newStatus}`;
            const response = await AuthorizedRequest.putRequest(url);
            console.log(url + " here is url")

            // Check if the status returned by the backend matches the intended new status
            if (response.data === newStatus) {
                // Success: Backend confirmed the status matches the optimistic update
                console.log(`Courier ${courierId} status updated successfully to ${newStatus}`);
                // UI is already updated, no need to call setIsAvailable again
            } else {
                // Unexpected: Backend returned a status different from what we sent,
                // even though the request might have succeeded (status 2xx).
                console.error(`Backend responded with unexpected status (${response.data}) after attempting to set to ${newStatus}.`);
                alert("Durum güncellenemedi (sunucu beklenmeyen bir durum bildirdi).");
                setIsAvailable(previousStatus); // Revert optimistic update
            }
        } catch (err) {
            console.error(`Failed to update status for courier ${courierId}:`, err);
            let errorMsg = "Durum güncellenirken bir hata oluştu.";
            if (err.response) { errorMsg = `Durum güncellenemedi (${err.response.status}): ${err.response.data?.message || err.response.data || 'Bilinmeyen sunucu hatası'}`; }
            else if (err.request) { errorMsg = "Sunucuya ulaşılamadı."; }
            else { errorMsg = err.message || errorMsg; }
            alert(errorMsg);
            // Revert UI optimistic update on API error
            setIsAvailable(previousStatus);
        } finally {
            setIsUpdatingStatus(false);
        }
    };


    // --- Courier Task Actions (Accept/Reject) ---

    const handleAcceptTask = async (requestId) => {
        console.log("Attempting to accept task (order request):", requestId);
        setActionLoading(requestId);
        try {
            const url = `${API_BASE_URL}/order/courier/request${requestId}-true`;
            const response = await AuthorizedRequest.putRequest(url);
            if (response.data === true) {
                console.log(`Task #${requestId} accepted successfully.`);
                alert(`Görev #${requestId} başarıyla kabul edildi.`);
                fetchOrdersAndStatus(); // Refresh data (including status just in case)
            } else {
                console.error(`Backend responded unexpectedly for accepting task #${requestId}:`, response.data);
                alert(`Görev #${requestId} kabul edilemedi (beklenmeyen sunucu yanıtı).`);
            }
        } catch (err) {
            console.error(`Failed to accept task #${requestId}:`, err);
            let errorMsg = `Görevi #${requestId} kabul ederken bir hata oluştu.`;
            if(err.response.data.errors){
                errorMsg = err.response.data.errors;
            }
            else if (err.response) { errorMsg = `Görev #${requestId} kabul edilemedi (${err.response.status}): ${err.response.data?.message || err.response.data || 'Bilinmeyen sunucu hatası'}`; }
            else if (err.request) { errorMsg = "Sunucuya ulaşılamadı."; }
            else { errorMsg = err.message || errorMsg; }
            alert(errorMsg);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectTask = async (requestId) => {
        console.log("Attempting to reject task (order request):", requestId);
        setActionLoading(requestId);
        try {
            const url = `${API_BASE_URL}/order/courier/request${requestId}-false`;
            const response = await AuthorizedRequest.putRequest(url);
            if (response.data === true) {
                console.log(`Task #${requestId} rejected successfully.`);
                alert(`Görev #${requestId} başarıyla reddedildi.`);
                fetchOrdersAndStatus(); // Refresh data (including status just in case)
            } else {
                console.error(`Backend responded unexpectedly for rejecting task #${requestId}:`, response.data);
                alert(`Görev #${requestId} reddedilemedi (beklenmeyen sunucu yanıtı).`);
            }
        } catch (err) {
            console.error(`Failed to reject task #${requestId}:`, err);
            let errorMsg = `Görevi #${requestId} reddederken bir hata oluştu.`;
            if(err.response.data.errors){
                errorMsg = err.response.data.errors;
            }
            else if (err.response) { errorMsg = `Görev #${requestId} reddedilemedi (${err.response.status}): ${err.response.data?.message || err.response.data || 'Bilinmeyen sunucu hatası'}`; }
            else if (err.request) { errorMsg = "Sunucuya ulaşılamadı."; }
            else { errorMsg = err.message || errorMsg; }
            alert(errorMsg);
        } finally {
            setActionLoading(null);
        }
    };


    // --- Other handlers ---
    const handlePickupOrder = (requestId, orderId) => { /* ... */ };
    const handleDeliverOrder = (requestId, orderId) => { /* ... */ };

    // --- UI Helpers ---
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const formatPrice = (price) => price ? `₺${Number(price).toFixed(2)}` : "₺0.00";
    const calculateTotal = (items) => items ? items.reduce((sum, item) => sum + (Number(item.price) || 0), 0) : 0;

    // Animation variants
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

    // Define background classes
    const cardSectionBg = darkMode ? "bg-gray-700" : "bg-gray-200";
    const mainCardBorder = darkMode ? "border-gray-600" : "border-gray-300";


    return (
        // --- JSX Structure Remains the Same ---
        <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-850 text-white" : "bg-gray-100"} transition-colors duration-300`} >
            {/* --- Header --- */}
            <header className={`${darkMode ? "bg-gray-900" : "bg-[#47300A]"} text-white py-3 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md`} >
                <div className="flex items-center"> <Link to="/"> <span className="font-bold text-xl tracking-wide hover:text-amber-200 transition-colors duration-200"> Doy! </span> </Link> </div>
                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center gap-2"> <button onClick={toggleDarkMode} className={`w-10 h-5 rounded-full flex items-center ${darkMode ? "bg-yellow-400 justify-end" : "bg-gray-300 justify-start"} p-1 transition-all duration-300`} > <div className="w-3 h-3 bg-white rounded-full"></div> </button> <Moon className="h-4 w-4 text-yellow-300" /> </div>
                </div>
            </header>

            {/* --- Logo --- */}
            <div className={`flex justify-center py-6 ${isLoaded ? "animate-fadeIn" : "opacity-0"}`}> <div className={`rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} p-6 w-32 h-32 flex items-center justify-center shadow-lg`} > <div className="relative w-24 h-24"> <img src="/image1.png" alt="DOY Logo" width={96} height={96} className="w-full h-full" /> <div className={`text-center text-[10px] font-bold mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>FOOD DELIVERY</div> </div> </div> </div>


            {/* Main Content Area */}
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {/* Title */}
                <h1 className={`text-2xl font-bold text-center mb-2 ${darkMode ? "text-yellow-400" : "text-amber-800"}`}>
                    Aktif Teslimat Görevleri {courierId ? `(Kurye #${courierId})` : ''}
                </h1>

                {/* --- Courier Status Toggle --- */}
                {courierId && ( // Only show if courierId is present
                    <div className={`flex items-center justify-center gap-3 mb-6 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-amber-50'} max-w-xs mx-auto`}>
                        <Label htmlFor="courier-status-toggle" className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Durum:
                        </Label>
                        <Switch
                            id="courier-status-toggle"
                            checked={isAvailable}
                            onCheckedChange={handleToggleAvailability}
                            // Disable switch if initial data is loading OR status is currently being updated
                            disabled={isLoading || isUpdatingStatus}
                        />
                        <span className={`text-sm font-semibold ${isAvailable ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                            {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin inline-block"/> : (isAvailable ? 'Aktif' : 'Pasif')}
                        </span>
                        {/* Show Wifi icons only when not loading status */}
                        {!isUpdatingStatus && (isAvailable ? <Wifi size={16} className="text-green-500"/> : <WifiOff size={16} className="text-red-500"/>)}
                    </div>
                )}

                <p className={`text-center text-sm mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Aşağıda size atanmış veya yakınınızdaki teslimat görevlerini görebilirsiniz.
                </p>

                {/* Loading, Error, Empty States */}
                {isLoading && ( <div className="flex justify-center items-center min-h-[300px]"> <Loader2 className={`h-12 w-12 animate-spin ${darkMode ? "text-yellow-400" : "text-amber-600"}`} /> </div> )}
                {error && !isLoading && ( <div className={`text-center py-10 px-4 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'} border ${darkMode ? 'border-red-700/50' : 'border-red-300'}`}> <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" /> <p className="font-semibold">Hata!</p> <p>{error}</p> </div> )}
                {!isLoading && !error && ordersData.length === 0 && ( <div className={`text-center py-10 px-4 rounded-lg ${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-amber-50 text-gray-500'}`}> <Package className="h-12 w-12 mx-auto mb-3 opacity-40" /> <p>Aktif teslimat görevi bulunmuyor.</p> </div> )}

                {/* Order List */}
                {!isLoading && !error && ordersData.length > 0 && (
                    <motion.div variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"} className="space-y-8">
                        {ordersData.map((order) => {
                            const total = calculateTotal(order.menuItems);
                            const isCurrentActionLoading = actionLoading === order.requestId;

                            return (
                                <motion.div
                                    key={order.requestId}
                                    variants={itemVariants}
                                    className={`${mainCardBorder} border rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row`}
                                >
                                    {/* Left Column: Menu Items */}
                                    <div className={`w-full md:w-3/5 p-6 ${cardSectionBg} md:border-r ${mainCardBorder}`}>
                                        {/* ... menu item details ... */}
                                        <h3 className={`text-base font-semibold mb-4 pb-2 border-b ${darkMode ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"}`}> {order.restaurantName} - İstek No: #{order.requestId} </h3>
                                        <div className="space-y-4">
                                            {(order.menuItems || []).map((item) => (
                                                <div key={item.id} className="flex items-start gap-4">
                                                    <div className={`flex-shrink-0 w-20 h-20 rounded-md flex items-center justify-center ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} border`}> <ImageIcon className={`h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} /> </div>
                                                    <div className="flex-grow">
                                                        <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.name}</p>
                                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{item.description}</p>
                                                        <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-500 text-gray-100' : 'bg-gray-300 text-gray-800'}`}> {formatPrice(item.price)} </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'} text-right`}> <span className={`text-lg font-bold ${darkMode ? 'text-yellow-400' : 'text-amber-700'}`}> Toplam: {formatPrice(total)} </span> </div>
                                    </div>

                                    {/* Right Column: Delivery Info & Actions */}
                                    <div className={`w-full md:w-2/5 p-6 ${cardSectionBg}`}>
                                        <h3 className={`text-base font-semibold mb-4 pb-2 border-b ${darkMode ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"}`}> Teslimat Bilgileri </h3>
                                        <div className="space-y-4">
                                            {/* ... customer/address details ... */}
                                            <div> <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Teslimat Adresi:</h4> <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}> {order.customerAddress ? `${order.customerAddress.street}, ${order.customerAddress.city}, ${order.customerAddress.country}` : <span className="italic opacity-60">Adres belirtilmemiş</span>} </p> </div>
                                            <div> <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Alıcı Bilgileri:</h4> <div className="space-y-1 text-sm"> <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium w-28 inline-block`}>Alıcı:</strong> {order.customerName || "-"}</p> <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium w-28 inline-block`}>Telefon No:</strong> {order.customerPhone || "-"}</p> <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium w-28 inline-block`}>E-Posta:</strong> {order.customerEmail || "-"}</p> </div> </div>
                                            <div> <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Alıcıdan Notlar:</h4> <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}> {order.note && order.note.toLowerCase() !== 'none' ? order.note : <span className="italic opacity-60">Not yok</span>} </p> </div>

                                            {/* --- Courier Action Buttons --- */}
                                            <div className="mt-6 flex flex-col space-y-2 items-stretch">
                                                {/* Accept Button: Disabled if action loading, initial loading, OR courier is unavailable */}
                                                <Button
                                                    onClick={() => handleAcceptTask(order.requestId)}
                                                    className={`w-full px-4 py-2 text-sm ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                                    disabled={isCurrentActionLoading || isLoading || !isAvailable}
                                                    title={!isAvailable ? "Görevi kabul etmek için durumunuzu AKTİF yapın" : ""} // Add tooltip
                                                >
                                                    {isCurrentActionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <CheckCircle className="h-4 w-4 mr-2"/>}
                                                    {isCurrentActionLoading ? 'İşleniyor...' : 'Görevi Kabul Et'}
                                                </Button>

                                                {/* Reject Button: Disabled if action loading, initial loading, OR courier is unavailable */}
                                                <Button
                                                    onClick={() => handleRejectTask(order.requestId)}
                                                    className={`w-full px-4 py-2 text-sm ${darkMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                                                    disabled={isCurrentActionLoading || isLoading || !isAvailable}
                                                    title={!isAvailable ? "Görevi reddetmek için durumunuzu AKTİF yapın" : ""} // Add tooltip
                                                >
                                                    {isCurrentActionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <XCircle className="h-4 w-4 mr-2"/>}
                                                    {isCurrentActionLoading ? 'İşleniyor...' : 'Görevi Reddet'}
                                                </Button>
                                            </div>

                                            {/* --- Empty Gray Rectangle --- */}
                                            <div className={`mt-6 h-10 w-full ${cardSectionBg} rounded-md border ${mainCardBorder}`}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </main>

            {/* --- Footer --- */}
            <footer className={`${darkMode ? "bg-gray-900" : "bg-white"} mt-8 p-8 flex justify-between items-center transition-colors duration-300 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} >
                <img src="/image1.png" alt="DOY Logo" className="h-[50px] w-[50px] rounded-full object-cover" />
                <div className="flex gap-6">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Twitter size={24} /> </a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Instagram size={24} /> </a> <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Youtube size={24} /> </a> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"> <Linkedin size={24} /> </a>
                </div>
            </footer>
        </div>
    )
}
