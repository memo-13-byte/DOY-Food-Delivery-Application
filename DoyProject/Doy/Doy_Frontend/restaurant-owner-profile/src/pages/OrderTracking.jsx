import React, { useState } from "react";
import RestaurantNavbar from "../components/RestaurantNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/Button";
import CourierAssignModal from "../components/CourierAssignModal";

export default function OrderTrackingPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [showCourierModal, setShowCourierModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState("");
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    const [courierRequests, setCourierRequests] = useState({});

    const initialStatuses = [
        {
            title: "Onay Bekleyenler",
            color: "#EECED0",
            buttons: ["Sipariş Detay", "Sipariş Alındı"],
        },
        {
            title: "Onaylanmış",
            color: "#E7D3C6",
            buttons: ["Sipariş Detay", "Hazırlanıyor"],
        },
        {
            title: "Hazırlanıyor",
            color: "#E7F0D8",
            buttons: ["Sipariş Detay", "Hazır"],
        },
        {
            title: "Hazır Siparişler",
            color: "#D1E8D4",
            buttons: ["Sipariş Detay", "Kurye Atanabilir"],
        },
    ];

    const [orderLists, setOrderLists] = useState([
        ["Menü A", "Menü B", "Menü C", "Menü D"],
        ["Menü E", "Menü F"],
        ["Menü G"],
        ["Menü H"],
    ]);

    const moveOrderToNextStatus = (currentStatusIndex, orderIndex) => {
        if (currentStatusIndex >= orderLists.length - 1) return;
        const updatedOrderLists = [...orderLists];
        const [order] = updatedOrderLists[currentStatusIndex].splice(orderIndex, 1);
        updatedOrderLists[currentStatusIndex + 1].push(order);
        setOrderLists(updatedOrderLists);
    };

    const rejectOrder = (statusIdx, orderIdx) => {
        const updatedOrderLists = [...orderLists];
        updatedOrderLists[statusIdx].splice(orderIdx, 1);
        setOrderLists(updatedOrderLists);
    };

    const openCourierModal = (orderName, orderIdx) => {
        setSelectedOrder(orderName);
        setSelectedOrderIndex(orderIdx);
        setShowCourierModal(true);
        setCourierRequests({}); // her sipariş için sıfırla
    };

    const closeCourierModal = () => {
        setShowCourierModal(false);
        setSelectedOrder("");
        setSelectedOrderIndex(null);
    };

    const handleCourierAssign = (courierName) => {
        // UI'da butonu pasifleştir
        setCourierRequests(prev => ({
            ...prev,
            [courierName]: "pending"
        }));

        // Simülasyon: Kurye 3.5 saniyede kabul ediyor
        setTimeout(() => {
            const updatedOrders = [...orderLists];
            const index = 3; // Hazır Siparişler
            updatedOrders[index] = updatedOrders[index].filter(o => o !== selectedOrder);
            setOrderLists(updatedOrders);
            setShowCourierModal(false);
        }, 3500);
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#f9f5ed",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}>
            <RestaurantNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ padding: "2rem 2rem" }}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Sipariş Yönetimi</h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "1.5rem"
                }}>
                    {initialStatuses.map((status, idx) => (
                        <div key={idx} style={{
                            backgroundColor: status.color,
                            borderRadius: "20px",
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            alignItems: "center"
                        }}>
                            <h4>{status.title}</h4>
                            {orderLists[idx].map((menu, mIdx) => (
                                <div key={mIdx} style={{
                                    backgroundColor: darkMode ? "#333" : "#fff",
                                    borderRadius: "20px",
                                    padding: "1rem",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                                        alt="food"
                                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                    />
                                    <div style={{ fontWeight: "bold" }}>{menu}</div>

                                    <Button onClick={() => alert(`${menu} detayları gösterilecek`)}>
                                        {status.buttons[0]}
                                    </Button>

                                    {status.buttons[1] && (
                                        <Button
                                            onClick={() => {
                                                if (idx < initialStatuses.length - 1) {
                                                    moveOrderToNextStatus(idx, mIdx);
                                                } else {
                                                    openCourierModal(menu, mIdx);
                                                }
                                            }}
                                        >
                                            {status.buttons[1]}
                                        </Button>
                                    )}

                                    {idx === 0 && (
                                        <Button
                                            onClick={() => rejectOrder(idx, mIdx)}
                                            className="bg-red-700"
                                        >
                                            Siparişi Reddet
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <Footer darkMode={darkMode} />

            <CourierAssignModal
                isOpen={showCourierModal}
                orderName={selectedOrder}
                onClose={closeCourierModal}
                onAssign={handleCourierAssign}
                requests={courierRequests}
                darkMode={darkMode}
            />
        </div>
    );
}
