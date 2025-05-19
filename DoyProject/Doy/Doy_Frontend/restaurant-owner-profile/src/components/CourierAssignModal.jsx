import React from "react";
import { Button } from "./Button";
import { FaUserCircle } from "react-icons/fa";

const mockCouriers = [
    "Kurye A", "Kurye B", "Kurye C", "Kurye D", "Kurye E", "Kurye F", "Kurye G", "Kurye H", "Kurye I"
];

const CourierAssignModal = ({
                                isOpen,
                                onClose,
                                orderName,
                                darkMode,
                                requests,
                                onAssign
                            }) => {
    if (!isOpen) return null;

    const handleSendRequest = (courierName) => {
        if (requests[courierName] === "pending") return;
        onAssign(courierName);
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                color: darkMode ? "#fff" : "#000",
                borderRadius: "16px",
                padding: "2rem",
                minWidth: "420px",
                maxHeight: "80vh", // ✨ Dikey sınır
                overflowY: "auto",  // ✨ Kaydırma aktif
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}>
                <h3 style={{ marginBottom: "1rem" }}>{orderName} için Kurye Ata</h3>
                <p style={{ color: darkMode ? "#ccc" : "#444", marginBottom: "1.5rem" }}>
                    Birden fazla kuryeye istek gönderebilirsiniz.
                </p>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    paddingRight: "0.5rem"
                }}>
                    {mockCouriers.map((courier, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: requests[courier] === "pending" ? "2px solid #bbb" : "1px solid #aaa",
                                borderRadius: "12px",
                                padding: "0.75rem 1rem",
                                backgroundColor: darkMode ? "#3a3a3a" : "#f9f9f9"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <FaUserCircle size={28} />
                                <span style={{ fontWeight: "bold" }}>{courier}</span>
                            </div>

                            {requests[courier] === "pending" ? (
                                <div style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "999px",
                                    backgroundColor: "#d3d3d3",
                                    color: "#555",
                                    fontWeight: "500",
                                    fontSize: "0.85rem",
                                    fontStyle: "italic",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                    transition: "all 0.3s ease"
                                }}>
                                    Bekleniyor...
                                </div>
                            ) : (
                                <Button
                                    onClick={() => handleSendRequest(courier)}
                                    style={{ minWidth: "120px" }}
                                >
                                    İstek Gönder
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    onClick={onClose}
                    className="bg-gray-400 hover:bg-gray-500 text-white"
                    style={{ marginTop: "2rem" }}
                >
                    Kapat
                </Button>
            </div>
        </div>
    );
};

export default CourierAssignModal;
