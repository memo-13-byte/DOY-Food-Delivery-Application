import React, { useState } from "react";

const SuspendModal = ({ onConfirm, onCancel, darkMode }) => {
    const [days, setDays] = useState("");

    const handleSubmit = () => {
        if (days && !isNaN(days) && parseInt(days) > 0) {
            onConfirm(parseInt(days));
        } else {
            alert("Please enter a valid number of days!");
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000
        }}>
            <div style={{
                backgroundColor: darkMode ? "#333" : "#fff",
                padding: "2rem",
                borderRadius: "20px",
                width: "90%",
                maxWidth: "400px",
                textAlign: "center",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}>
                <h2 style={{ marginBottom: "1rem" }}>🚫 Suspend User/Restaurant</h2>
                <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Enter suspend days"
                    style={{
                        width: "100%",
                        padding: "0.8rem",
                        marginBottom: "1.5rem",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        textAlign: "center",
                        backgroundColor: darkMode ? "#555" : "#f8f8f8",
                        color: darkMode ? "#fff" : "#000",
                    }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            flex: 1,
                            padding: "0.8rem",
                            backgroundColor: "#ff9900",
                            color: "#000",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Suspend
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: "0.8rem",
                            backgroundColor: "#999",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuspendModal;
