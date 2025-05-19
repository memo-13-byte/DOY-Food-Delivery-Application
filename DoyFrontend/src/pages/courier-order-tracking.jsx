// OrderStatusRestaurant.js (Simplified + Pagination + Card Alignment Fix + Update Buttons)

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Assuming these components exist in the specified paths
import RestaurantNavbar from "../components/RestaurantNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/Button"; // Assuming Button can handle disabled state

// Define ONLY the necessary OrderStatus enum values
const OrderStatus = {
    AWAITING_PICKUP: "AWAITING_PICKUP",
    UNDER_WAY: "UNDER_WAY",
    DELIVERED: "DELIVERED",
};

// How many items to show per page within a column
const ITEMS_PER_PAGE = 5;

// --- Order Detail Modal Component ---
// (Assume this is defined correctly as in the previous version)
function OrderDetailModal({ orderDetails, onClose, isLoading, error, darkMode }) {
    if (!orderDetails && !isLoading && !error) return null;

    const contentBgColor = darkMode ? '#333' : '#fff';
    const textColor = darkMode ? '#eee' : '#333';
    const borderColor = darkMode ? '#555' : '#ddd';

    // Function to safely format the address
    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return [
            address.street,
            address.buildingNumber,
            address.apartmentNumber ? `Daire ${address.apartmentNumber}` : null,
            address.avenue,
            address.neighborhood,
            address.district,
            address.city
        ].filter(part => part !== null && part !== undefined && part !== '').join(', ');
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
            <div style={{
                backgroundColor: contentBgColor, color: textColor, padding: '2rem',
                borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                maxWidth: '600px', width: '90%', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
            }}>
                {/* Close Button ('X') */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '10px', right: '15px', background: 'none',
                        border: 'none', fontSize: '1.8rem', cursor: 'pointer',
                        color: darkMode ? '#aaa' : '#888', lineHeight: '1', flexShrink: 0
                    }}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Modal Title */}
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.5rem', flexShrink: 0 }}>
                    Sipariş Detayları (ID: {orderDetails?.orderId || '...'})
                </h3>

                {/* Scrollable Content Area */}
                <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px', marginRight: '-10px' }}>
                    {/* Loading/Error States */}
                    {isLoading && <p style={{ textAlign: 'center' }}>Detaylar yükleniyor...</p>}
                    {error && <p style={{ textAlign: 'center', color: 'red' }}>Hata: {error}</p>}

                    {/* Order Details Content */}
                    {orderDetails && !isLoading && !error && (
                        <div>
                            {/* Customer Info */}
                            <div style={{ marginBottom: '1.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '1rem' }}>
                                <h4 style={{ marginBottom: '0.75rem', color: darkMode ? '#bbb' : '#555' }}>Müşteri Bilgileri</h4>
                                <p><strong>İsim:</strong> {orderDetails.customerName || 'N/A'}</p>
                                <p><strong>Telefon:</strong> {orderDetails.customerPhone || 'N/A'}</p>
                                <p><strong>Email:</strong> {orderDetails.customerEmail || 'N/A'}</p>
                                <p><strong>Adres:</strong> {formatAddress(orderDetails.customerAddress)}</p>
                                <p><strong>Not:</strong> {orderDetails.note || 'Yok'}</p>
                            </div>
                            {/* Restaurant Info */}
                            <div style={{ marginBottom: '1.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '1rem' }}>
                                <h4 style={{marginBottom: '0.75rem', color: darkMode ? '#bbb' : '#555' }}>Restoran</h4>
                                <p><strong>Adı:</strong> {orderDetails.restaurantName || 'N/A'}</p>
                            </div>
                            {/* Menu Items */}
                            <div>
                                <h4 style={{ marginBottom: '0.75rem', color: darkMode ? '#bbb' : '#555' }}>Sipariş İçeriği</h4>
                                {orderDetails.menuItems && orderDetails.menuItems.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {orderDetails.menuItems.map(item => (
                                            <li key={item.id} style={{
                                                border: `1px solid ${borderColor}`, borderRadius: '8px',
                                                padding: '0.75rem', marginBottom: '0.75rem',
                                                backgroundColor: darkMode ? '#444' : '#f9f9f9'
                                            }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.name} ({item.menuItemType})</div>
                                                <div style={{ fontSize: '0.9em', color: darkMode ? '#ccc' : '#666', margin: '0.25rem 0' }}>{item.description}</div>
                                                <div style={{ fontWeight: 'bold', textAlign: 'right' }}>{item.price?.toFixed(2)} TL</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : ( <p>Siparişte ürün bulunmamaktadır.</p> )}
                            </div>
                        </div>
                    )}
                </div> {/* End Scrollable Area */}

                {/* Close Button (Bottom) */}
                <Button onClick={onClose} style={{ marginTop: '1.5rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', flexShrink: 0 }}>
                    Kapat
                </Button>
            </div>
        </div>
    );
}


// --- Main Order Tracking Page Component ---
export default function OrderStatusCourier() {
    // --- State Variables ---
    const [darkMode, setDarkMode] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true); // For initial fetch
    const [error, setError] = useState(null);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState(null); // Track which order's status is being updated
    const [columnPages, setColumnPages] = useState({
        [OrderStatus.AWAITING_PICKUP]: 1,
        [OrderStatus.UNDER_WAY]: 1,
        [OrderStatus.DELIVERED]: 1,
    });

    // --- Get Restaurant ID from URL ---
    const { id: restaurantId } = useParams();

    // --- Column Definitions ---
    const initialStatuses = [
        { title: "Alınması Beklenenler", color: "#D2B48C", status: OrderStatus.AWAITING_PICKUP, nextStatus: OrderStatus.UNDER_WAY, actionText: "Alındı" },
        { title: "Yolda", color: "#CD853F", status: OrderStatus.UNDER_WAY, nextStatus: OrderStatus.DELIVERED, actionText: "Teslim Edildi" },
        { title: "Teslim edilmiş", color: "#A0522D", status: OrderStatus.DELIVERED, nextStatus: null, actionText: null }, // No action for delivered
    ];
    const displayableStatuses = [OrderStatus.AWAITING_PICKUP, OrderStatus.UNDER_WAY, OrderStatus.DELIVERED];

    // Base URL
    const API_BASE_URL = "http://localhost:8080";

    // --- API Calls ---

    // Fetch orders for the specific restaurant
    const fetchOrders = useCallback(async () => { // Use useCallback
        if (!restaurantId) {
            setError("Restoran ID URL'de bulunamadı veya geçerli değil.");
            setLoading(false); setAllOrders([]); return;
        }
        setLoading(true); setError(null);
        // Reset pages only if it's not a status update refresh
        if (!updatingStatusOrderId) {
            setColumnPages({
                [OrderStatus.AWAITING_PICKUP]: 1,
                [OrderStatus.UNDER_WAY]: 1,
                [OrderStatus.DELIVERED]: 1,
            });
        }
        const url = `${API_BASE_URL}/order/courier/${restaurantId}/order`;
        try {
            const response = await axios.get(url);
            if (response.data && Array.isArray(response.data.orderInfoList)) {
                const relevantOrders = response.data.orderInfoList.filter(
                    order => displayableStatuses.includes(order.status)
                );
                setAllOrders(relevantOrders);
            } else {
                console.warn("Unexpected API response format:", response.data);
                setError("Siparişler yüklenirken beklenmedik bir formatla karşılaşıldı.");
                setAllOrders([]);
            }
        } catch (err) {
            if(err.response.data.errors){
                setError(err.response.data.errors);
            }
            else{
                setError(`Siparişler yüklenirken bir hata oluştu: ${err.data?.errors || err.response?.data?.message || err.message || 'Bilinmeyen Hata'}`);
            }
            console.error("Error fetching orders:", err);

            setAllOrders([]);
        } finally {
            setLoading(false);
        }
    }, [restaurantId, updatingStatusOrderId]); // Add updatingStatusOrderId to dependencies to control page reset

    // Fetch order details
    const fetchOrderDetails = async (orderId) => {
        if (!orderId) return;
        setDetailLoading(true); setDetailError(null); setSelectedOrderDetail(null);
        const url = `${API_BASE_URL}/order/details/${orderId}`;
        try {
            const response = await axios.get(url);
            if (response.data) { setSelectedOrderDetail(response.data); }
            else {
                console.warn(`No details found for order ID: ${orderId}`);
                setDetailError("Sipariş detayları bulunamadı.");
                setSelectedOrderDetail({ orderId });
            }
        } catch (err) {
            if(err.response.data.errors){
                setError(err.response.data.errors);
            }

            console.error(`Error fetching details for order ${orderId}:`, err);
            setDetailError(`Sipariş detayları yüklenirken bir hata oluştu (${err.response?.data?.message || err.message || 'Bilinmeyen Hata'}).`);
            setSelectedOrderDetail({ orderId });
        } finally {
            setDetailLoading(false);
        }
    };

    // --- NEW: Update order status ---
    const updateOrderStatus = async (orderId, newStatus) => {
        if (!orderId || !newStatus) return;

        setUpdatingStatusOrderId(orderId); // Set loading state for this specific order
        setError(null); // Clear previous errors
        console.log(`updateOrderStatus: Attempting update for Order ID: ${orderId}, New Status: ${newStatus}`);
        const url = `${API_BASE_URL}/order/${orderId}/state`;
        // Assuming the backend expects the new status in the payload,
        // and 'accept: true' is implied or handled by the endpoint logic for these transitions.
        const payload = { status: newStatus, accept: true };
        console.log(`updateOrderStatus: Sending PATCH to ${url} with payload:`, payload);

        try {
            const patchResponse = await axios.patch(url, payload);
            console.log(`updateOrderStatus: PATCH successful for Order ID: ${orderId}. Status: ${patchResponse.status}`);

            // Re-fetch orders to reflect the change accurately
            console.log(`updateOrderStatus: Re-fetching orders after successful update for Order ID: ${orderId}...`);
            // fetchOrders will run due to state change if updatingStatusOrderId is in its deps,
            // or call it explicitly if not. Let's call it explicitly for clarity.
            await fetchOrders(); // Re-fetch the list
            console.log(`updateOrderStatus: Re-fetch complete after update for Order ID: ${orderId}.`);

        } catch (err) {
            console.error(`updateOrderStatus: Error during PATCH for Order ID ${orderId}:`, err.response || err.message || err);
            setError(`Sipariş durumu güncellenirken bir hata oluştu (ID: ${orderId}). Sunucu yanıtı: ${err.response?.data?.message || err.message || 'Bilinmeyen hata'}`);
            // Optionally show a more specific error message to the user
        } finally {
            setUpdatingStatusOrderId(null); // Clear loading state for this order
        }
    };


    // --- Effects ---
    useEffect(() => {
        if (restaurantId) { fetchOrders(); }
        else { setError("Restoran ID URL'de bulunamadı."); setLoading(false); }
    }, [restaurantId, fetchOrders]); // Add fetchOrders dependency


    // --- Event Handlers ---
    const handleShowDetailsClick = (order) => {
        if (order && order.orderId) {
            fetchOrderDetails(order.orderId);
        } else {
            console.error("handleShowDetailsClick: Invalid order object received:", order);
        }
    };

    const closeDetailModal = () => {
        setSelectedOrderDetail(null); setDetailLoading(false); setDetailError(null);
    };

    // --- NEW: Handler for status update buttons ---
    const handleStatusUpdateClick = (order, nextStatus) => {
        if (order && order.orderId && nextStatus) {
            updateOrderStatus(order.orderId, nextStatus);
        } else {
            console.error("handleStatusUpdateClick: Invalid order or nextStatus:", order, nextStatus);
        }
    };

    // Handler for Column Pagination
    const handlePageChange = (status, direction) => {
        setColumnPages(prevPages => {
            const currentPage = prevPages[status];
            const nextPage = currentPage + direction;
            const totalItems = allOrders.filter(order => order.status === status).length;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            if (nextPage < 1 || nextPage > totalPages) {
                return prevPages; // Prevent going out of bounds
            }
            return { ...prevPages, [status]: nextPage };
        });
    };


    // --- Rendering ---
    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#f2e8d6",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh", display: "flex", flexDirection: "column",
        }}>
            <RestaurantNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <div style={{ padding: "1rem 2rem 2rem 2rem", flexGrow: 1 }}>
                <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Sipariş Takibi</h2>
                <p style={{ textAlign: "center", marginBottom: "1.5rem", color: darkMode ? '#ccc' : '#555', fontSize: '0.9em' }}>
                    Courier ID: {restaurantId || 'Yükleniyor...'}
                </p>
                {loading && <p style={{ textAlign: 'center', padding: '2rem 0' }}>Siparişler yükleniyor...</p>}
                {error && !loading && (
                    <p style={{
                        textAlign: 'center', color: 'white', fontWeight: 'bold',
                        backgroundColor: '#dc3545', padding: '0.75rem', borderRadius: '8px',
                        margin: '1rem auto', maxWidth: '800px'
                    }}> Hata: {error} </p>
                )}

                {/* Order Columns Grid */}
                {!loading && !error && restaurantId && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1.5rem", alignItems: "start"
                    }}>
                        {initialStatuses.map((statusInfo) => {
                            // Filter, Calculate Pagination, Slice
                            const ordersInColumn = allOrders.filter(order => order.status === statusInfo.status);
                            const totalItems = ordersInColumn.length;
                            const currentPage = columnPages[statusInfo.status] || 1;
                            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
                            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                            const endIndex = startIndex + ITEMS_PER_PAGE;
                            const paginatedOrders = ordersInColumn.slice(startIndex, endIndex);

                            return (
                                // Column Container
                                <div key={statusInfo.status} style={{
                                    backgroundColor: statusInfo.color, borderRadius: "20px",
                                    padding: "1rem", display: "flex", flexDirection: "column",
                                    gap: "1rem", minHeight: "200px",
                                }}>
                                    {/* Column Title */}
                                    <h4 style={{ marginTop: '0.5rem', marginBottom: '0.5rem', textAlign: 'center', flexShrink: 0 }}>
                                        {statusInfo.title}
                                    </h4>

                                    {/* Order Cards Container */}
                                    <div style={{ flexGrow: 1 }}>
                                        {paginatedOrders.map((order) => {
                                            const isUpdating = updatingStatusOrderId === order.orderId;
                                            return (
                                                // Order Card
                                                <div key={order.orderId} style={{
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                    color: darkMode ? "#eee" : "#333",
                                                    borderRadius: "15px", padding: "1rem", width: "100%",
                                                    boxSizing: 'border-box', display: "flex", flexDirection: "column",
                                                    alignItems: "center", gap: "0.5rem",
                                                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)", marginBottom: "1rem"
                                                }}>
                                                    <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                                                         alt="Order Icon" style={{width: "45px", height: "45px", objectFit: "contain"}}/>
                                                    <div style={{ textAlign: 'center', fontWeight: "bold", fontSize: "0.9em" }}>
                                                        ID: {order.orderId}
                                                    </div>
                                                    <div style={{ textAlign: 'center', fontSize: "0.85em", color: darkMode ? '#ccc' : '#555' }}>
                                                        {order.customerName}
                                                    </div>
                                                    <div style={{ textAlign: 'center', fontSize: "0.9em", fontWeight: 'bold' }}>
                                                        {order.price?.toFixed(2)} TL
                                                    </div>

                                                    {/* --- Buttons Section --- */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '90%', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                        {/* Sipariş Detay Button (Always shown except maybe for DELIVERED) */}
                                                        {(
                                                            <Button
                                                                onClick={() => handleShowDetailsClick(order)}
                                                                size="small"
                                                                disabled={isUpdating} // Disable if status update is in progress
                                                            >
                                                                Sipariş Detay
                                                            </Button>
                                                        )}

                                                        {/* Status Update Button (if applicable) */}
                                                        {statusInfo.actionText && statusInfo.nextStatus && (
                                                            <Button
                                                                onClick={() => handleStatusUpdateClick(order, statusInfo.nextStatus)}
                                                                size="small"
                                                                disabled={isUpdating} // Disable if status update is in progress
                                                                style={{ backgroundColor: '#5cb85c', color: 'white', border: 'none' }} // Example styling
                                                            >
                                                                {isUpdating ? "İşleniyor..." : statusInfo.actionText}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div> // End Order Card
                                            );
                                        })}
                                        {/* Message if THIS Column has No Orders */}
                                        {totalItems === 0 && (
                                            <p style={{ fontSize: '0.85em', color: darkMode ? '#aaa' : '#666', marginTop: '1rem', textAlign: 'center' }}>
                                                Bu durumda sipariş yok.
                                            </p>
                                        )}
                                    </div>

                                    {/* Pagination Controls for THIS column */}
                                    {totalPages > 1 && (
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            width: '90%', margin: '0 auto', paddingTop: '1rem',
                                            flexShrink: 0, borderTop: `1px solid ${darkMode ? '#555' : '#ddd'}`
                                        }}>
                                            <Button onClick={() => handlePageChange(statusInfo.status, -1)} disabled={currentPage === 1} size="small"> &lt; Önceki </Button>
                                            <span style={{ fontSize: '0.85em', color: darkMode ? '#ccc' : '#555' }}> Sayfa {currentPage} / {totalPages} </span>
                                            <Button onClick={() => handlePageChange(statusInfo.status, 1)} disabled={currentPage === totalPages} size="small"> Sonraki &gt; </Button>
                                        </div>
                                    )}
                                </div> // End Column Div
                            );
                        })}
                    </div> // End Grid Div
                )}
            </div> {/* End Main Content Area */}
            <Footer darkMode={darkMode} />
            <OrderDetailModal
                orderDetails={selectedOrderDetail}
                onClose={closeDetailModal}
                isLoading={detailLoading}
                error={detailError}
                darkMode={darkMode}
            />
        </div> // End Outer Div
    );
}
