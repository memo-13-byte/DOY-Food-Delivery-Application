import React from "react";
import { Button } from "./Button"; // Assuming Button component path is correct
import { FaUserCircle, FaExclamationTriangle } from "react-icons/fa"; // Assuming react-icons is installed

const CourierAssignModal = ({
                                isOpen,
                                onClose,
                                orderName,
                                darkMode,
                                requests, // Keyed by courierId, value is 'pending', 'failed', etc.
                                onAssign, // Expects the full courier object
                                availableCouriers = [], // Default to empty array
                                isLoadingCouriers,
                                courierError
                            }) => {
    if (!isOpen) return null;

    // Modified to send the whole courier object
    const handleSendRequest = (courier) => {
        // Prevent sending if pending or failed
        if (requests[courier.courierId] === "pending" || requests[courier.courierId] === "failed") return;
        onAssign(courier); // Send the whole courier object back
    };

    // Style variables for dark/light mode adaptation
    const contentBgColor = darkMode ? '#2a2a2a' : '#fff';
    const textColor = darkMode ? '#fff' : '#000';
    const itemBgColor = darkMode ? '#3a3a3a' : '#f9f9f9';
    const itemBorderColor = darkMode ? '#555' : '#ddd';
    const pendingBorderColor = darkMode ? '#777' : '#bbb';
    const pendingBgColor = darkMode ? '#555' : '#d3d3d3';
    const pendingTextColor = darkMode ? '#ccc' : '#555';


    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1000, padding: '1rem'
        }}>
            <div style={{
                backgroundColor: contentBgColor, color: textColor,
                borderRadius: "16px", padding: "2rem", width: '90%',
                maxWidth: "500px", maxHeight: "85vh", display: 'flex', flexDirection: 'column',
                textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}>
                {/* Header */}
                <h3 style={{ marginBottom: "0.5rem", flexShrink: 0 }}>{orderName} için Kurye Ata</h3>
                <p style={{ color: darkMode ? "#ccc" : "#555", marginBottom: "1.5rem", fontSize: '0.9em', flexShrink: 0 }}>
                    Uygun kuryelere teslimat isteği gönderebilirsiniz.
                </p>

                {/* Courier List Area (Scrollable) */}
                <div style={{
                    flexGrow: 1, overflowY: "auto", paddingRight: "0.5rem",
                    marginRight: "-0.5rem", display: "flex", flexDirection: "column", gap: "1rem",
                    borderTop: `1px solid ${itemBorderColor}`, borderBottom: `1px solid ${itemBorderColor}`,
                    paddingTop: '1rem', paddingBottom: '0.5rem', marginBottom: '1.5rem'
                }}>
                    {/* Loading State */}
                    {isLoadingCouriers && <p>Kuryeler yükleniyor...</p>}
                    {/* Error State */}
                    {courierError && !isLoadingCouriers && ( <p style={{ color: 'red' }}>Hata: {courierError}</p> )}
                    {/* No Couriers Available State */}
                    {!isLoadingCouriers && !courierError && availableCouriers.length === 0 && ( <p style={{ color: darkMode ? "#aaa" : "#666" }}>Uygun kurye bulunamadı.</p> )}

                    {/* Display Available Couriers */}
                    {!isLoadingCouriers && !courierError && availableCouriers.length > 0 && (
                        availableCouriers.map((courier) => {
                            const requestStatus = requests[courier.courierId];
                            const isPending = requestStatus === "pending";
                            const isFailed = requestStatus === "failed";

                            return (
                                <div
                                    key={courier.courierId}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        border: isPending ? `2px solid ${pendingBorderColor}` : `1px solid ${itemBorderColor}`,
                                        borderRadius: "12px", padding: "0.75rem 1rem",
                                        backgroundColor: itemBgColor, opacity: isPending ? 0.7 : 1,
                                        transition: 'opacity 0.2s ease-in-out'
                                    }}
                                >
                                    {/* Courier Info */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", textAlign: 'left' }}>
                                        <FaUserCircle size={28} color={darkMode ? '#aaa' : '#666'} />
                                        <div>
                                            <span style={{ fontWeight: "bold" }}>{courier.firstName} {courier.lastName}</span>
                                            <div style={{ fontSize: '0.8em', color: darkMode ? '#bbb' : '#777' }}>
                                                {courier.location || 'Konum Yok'}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Button or Status */}
                                    <div style={{flexShrink: 0, marginLeft: '1rem'}}>
                                        {isPending ? (
                                            <div style={{
                                                padding: "0.5rem 1rem", borderRadius: "999px",
                                                backgroundColor: pendingBgColor, color: pendingTextColor,
                                                fontWeight: "500", fontSize: "0.85rem", fontStyle: "italic",
                                                pointerEvents: "none", userSelect: "none"
                                            }}> Bekleniyor... </div>
                                        ) : isFailed ? (
                                            <div title="İstek gönderilemedi" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'red', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                <FaExclamationTriangle /> <span>Başarısız</span>
                                            </div>
                                        ) : (
                                            <Button onClick={() => handleSendRequest(courier)} size="small" >
                                                İstek Gönder
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div> {/* End Scrollable Area */}

                {/* Close Button */}
                <Button
                    onClick={onClose}
                    style={{ marginTop: "auto", paddingTop: '0.5rem', flexShrink: 0, backgroundColor: darkMode? '#555':'#aaa', color:'white' }}
                >
                    Kapat
                </Button>
            </div>
        </div>
    );
};

export default CourierAssignModal;