// OrderStatusRestaurant.js (Simplified + Pagination + Card Alignment Fix)

import React, { useState, useEffect } from "react";
import AuthorizedRequest from "../services/AuthorizedRequest";
import { useParams } from 'react-router-dom';

// Assuming these components exist in the specified paths
import RestaurantNavbar from "../components/RestaurantNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/Button"; // Assuming Button can handle disabled state
import { getUserByEmail } from "../services/profileData";

// Define ONLY the necessary OrderStatus enum values
const OrderStatus = {
    AWAITING_PICKUP: "AWAITING_PICKUP",
    UNDER_WAY: "UNDER_WAY",
    DELIVERED: "DELIVERED",
};

// How many items to show per page within a column
const ITEMS_PER_PAGE = 5;

// --- Order Detail Modal Component ---
// (Defined directly within OrderTrackingPage.js) - Should ideally be moved to its own file
function OrderDetailModal({ orderDetails, onClose, isLoading, error, darkMode }) {
    if (!orderDetails && !isLoading && !error) return null;
    //console.log(orderDetails);
    const contentBgColor = darkMode ? '#333' : '#fff';
    const textColor = darkMode ? '#eee' : '#333';
    const borderColor = darkMode ? '#555' : '#ddd';

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
                display: 'flex', flexDirection: 'column', // Use flex for internal layout
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
                                <p><strong>Adres:</strong> {
                                    orderDetails.customerAddress
                                        ? [
                                            orderDetails.customerAddress.street,
                                            orderDetails.customerAddress.buildingNumber,
                                            `Daire ${orderDetails.customerAddress.apartmentNumber}`,
                                            orderDetails.customerAddress.avenue,
                                            orderDetails.customerAddress.neighborhood,
                                            orderDetails.customerAddress.district,
                                            orderDetails.customerAddress.city
                                        ].filter(Boolean).join(', ')
                                        : 'N/A'
                                }</p>

                                <p><strong>Not:</strong> {orderDetails.note || 'Yok'}</p>
                            </div>
                            {/* Restaurant Info */}
                            <div style={{
                                marginBottom: '1.5rem',
                                borderBottom: `1px solid ${borderColor}`,
                                paddingBottom: '1rem'
                            }}>
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


// --- Main Order Tracking Page Component (Simplified + Pagination + Alignment Fix) ---
export default function OrderStatusRestaurant() {
    // --- State Variables ---
    const [darkMode, setDarkMode] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const [columnPages, setColumnPages] = useState({
        [OrderStatus.AWAITING_PICKUP]: 1,
        [OrderStatus.UNDER_WAY]: 1,
        [OrderStatus.DELIVERED]: 1,
    });

    // --- Get Restaurant ID from URL ---
    const restaurantEmail = localStorage.getItem("email");
    const [restaurantId, setRestaurantId] = useState(0);

    // --- Column Definitions ---
    const initialStatuses = [
        { title: "Alınması Beklenenler", color: "#D2B48C", status: OrderStatus.AWAITING_PICKUP }, // Tan
        { title: "Yolda", color: "#CD853F", status: OrderStatus.UNDER_WAY }, // Peru
        { title: "Teslim edilmiş", color: "#A0522D", status: OrderStatus.DELIVERED }, // Sienna
    ];
    const displayableStatuses = [OrderStatus.AWAITING_PICKUP, OrderStatus.UNDER_WAY, OrderStatus.DELIVERED];

    // --- API Calls ---

    // Fetch orders for the specific restaurant
    const fetchOrders = async () => {
        const restaurantOwner = await getUserByEmail(restaurantEmail);
        console.log(restaurantOwner);
        setRestaurantId(restaurantOwner.id);

        if (!restaurantOwner.id) {
            setError("Restoran ID URL'de bulunamadı veya geçerli değil.");
            setLoading(false); setAllOrders([]); return;
        }
        setLoading(true); setError(null);
        setColumnPages({ // Reset pages on fetch
            [OrderStatus.AWAITING_PICKUP]: 1,
            [OrderStatus.UNDER_WAY]: 1,
            [OrderStatus.DELIVERED]: 1,
        });
        const url = `http://localhost:8080/order/restaurant/${restaurantOwner.id}/order`;
        try {
            const response = await AuthorizedRequest.getRequest(url);
            if (response.data && Array.isArray(response.data.orderInfoList)) {
                const relevantOrders = response.data.orderInfoList.filter(
                    order => displayableStatuses.includes(order.status)
                );
                setAllOrders(relevantOrders);
            } else {
                setError("Siparişler yüklenirken beklenmedik bir formatla karşılaşıldı.");
                setAllOrders([]);
            }
        } catch (err) {
            if(err.response.data.errors){
                setError(err.response.data.errors);
            }
            else{
                setError(`Siparişler yüklenirken bir hata oluştu: ${err.message || 'Bilinmeyen Hata'}`);
            }

            setAllOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch order details
    const fetchOrderDetails = async (orderId) => {
        if (!orderId) return;
        setDetailLoading(true); setDetailError(null); setSelectedOrderDetail(null);
        const url = `http://localhost:8080/order/details/${orderId}`;
        try {
            const response = await AuthorizedRequest.getRequest(url);
            if (response.data) { setSelectedOrderDetail(response.data); }
            else { setDetailError("Sipariş detayları bulunamadı."); setSelectedOrderDetail({ orderId }); }
        } catch (err) {
            setDetailError(`Sipariş detayları yüklenirken bir hata oluştu (${err.message || 'Bilinmeyen Hata'}).`);
            setSelectedOrderDetail({ orderId });
        } finally {
            setDetailLoading(false);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchOrders();
    }, []);


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
            backgroundColor: darkMode ? "#1c1c1c" : "#f9f5ed",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh", display: "flex", flexDirection: "column",
        }}>
            <RestaurantNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <div style={{ padding: "1rem 2rem 2rem 2rem", flexGrow: 1 }}>
                <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Sipariş Takibi</h2>
                <p style={{ textAlign: "center", marginBottom: "1.5rem", color: darkMode ? '#ccc' : '#555', fontSize: '0.9em' }}>
                    Restoran ID: {restaurantId || 'Yükleniyor...'}
                </p>
                {loading && <p style={{ textAlign: 'center', padding: '2rem 0' }}>Siparişler yükleniyor...</p>}
                {error && !loading && (
                    <p style={{
                        textAlign: 'center', color: 'white', fontWeight: 'bold',
                        backgroundColor: '#dc3545', padding: '0.75rem', borderRadius: '8px',
                        margin: '1rem auto', maxWidth: '800px'
                    }}> Hata: {error} </p>
                )}

                {/* Order Columns Grid - Always Rendered after load/no error */}
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
                                <div key={statusInfo.status} style={{
                                    backgroundColor: statusInfo.color, borderRadius: "20px",
                                    padding: "1rem", display: "flex", flexDirection: "column",
                                    gap: "1rem", alignItems: "center", minHeight: "200px"
                                }}>
                                    <h4 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{statusInfo.title}</h4>

                                    {/* Render Order Cards for Current Page */}
                                    {paginatedOrders.map((order) => (
                                        <div key={order.orderId} style={{
                                            backgroundColor: darkMode ? "#333" : "#fff",
                                            color: darkMode ? "#eee" : "#333",
                                            borderRadius: "15px",
                                            padding: "1rem",
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                            marginBottom: "1rem"
                                        }}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                                                 alt="Order Icon"
                                                 style={{width: "45px", height: "45px", objectFit: "contain"}}/>
                                            <div style={{
                                                textAlign: 'center',
                                                fontWeight: "bold",
                                                fontSize: "0.9em"
                                            }}>ID: {order.orderId}</div>
                                            <div style={{
                                                textAlign: 'center',
                                                fontSize: "0.85em",
                                                color: darkMode ? '#ccc' : '#555'
                                            }}>{order.customerName}</div>
                                            <div style={{
                                                textAlign: 'center',
                                                fontSize: "0.9em",
                                                fontWeight: 'bold'
                                            }}>{order.price?.toFixed(2)} TL
                                            </div>

                                            {/* Move button here with same styling */}
                                            <Button onClick={() => handleShowDetailsClick(order)} size="small"
                                                    style={{marginTop: '0.75rem', width: '100%'}}>
                                                Sipariş Detay
                                            </Button>
                                        </div>

                                    ))}

                                    {/* Message if THIS Column has No Orders */}
                                    {totalItems === 0 && (
                                        <p style={{
                                            fontSize: '0.85em',
                                            color: darkMode ? '#aaa' : '#666',
                                            marginTop: '1rem',
                                            textAlign: 'center'
                                        }}>Bu durumda sipariş yok.</p>
                                    )}

                                    {/* Pagination Controls for THIS column */}
                                    {totalPages > 1 && (
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            width: '90%', marginTop: 'auto', // Push pagination to bottom
                                            paddingTop: '1rem',
                                            borderTop: `1px solid ${darkMode ? '#555' : '#ddd'}`
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