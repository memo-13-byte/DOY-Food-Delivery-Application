import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const ComplaintDetails = ({ data, darkMode }) => {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
            style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
                marginBottom: "2rem",
            }}
        >
            <div style={{
                backgroundColor: data.status === "Resolved"
                    ? (darkMode ? "#2e4d2e" : "#D4EDDA")   // Resolved: yeşilimsi
                    : (darkMode ? "#3a2c2c" : "#FADADD"),   // Open: pembe
                padding: "2rem",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "700px",
                textAlign: "left",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                color: darkMode ? "#fff" : "#000",
            }}>
                {/* ID */}
                <h3 style={{ textAlign: "center", marginBottom: "1rem", fontWeight: "bold" }}>
                    ID: {data.id}
                </h3>

                {/* Customer info */}
                <p><b>Customer:</b> {data.customer}</p>
                <p><b>Restaurant:</b> {data.restaurant}</p>
                <p><b>Date Filed:</b> {data.filedDate}</p>
                <p><b>Type:</b> {data.type}</p>
                <p><b>Description:</b> {data.description}</p>

                {/* View / Chat Log */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                        onClick={() => alert(`Viewing order history for Complaint ID: ${data.id}`)}
                        style={{
                            backgroundColor: "#F4AFA6",
                            border: "none",
                            padding: "0.5rem 1.2rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: darkMode ? "#000" : "#000"
                        }}
                    >
                        View
                    </button>
                    <button
                        onClick={() => alert(`Opening chat log for Complaint ID: ${data.id}`)}
                        style={{
                            backgroundColor: "#F4AFA6",
                            border: "none",
                            padding: "0.5rem 1.2rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: darkMode ? "#000" : "#000"
                        }}
                    >
                        Chat Log
                    </button>
                </div>

                {/* Status */}
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ marginBottom: "0.3rem" }}><b>Status:</b></p>
                    <span style={{
                        backgroundColor: data.status === "Resolved" ? "#28a745" : "#FF0000",
                        color: "#fff",
                        fontWeight: "bold",
                        padding: "0.3rem 1rem",
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                    }}>
                        {data.status}
                    </span>
                </div>

                {/* Action Label */}
                <div style={{ marginTop: "1.5rem", fontWeight: "bold" }}>Action:</div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <button
                        onClick={() => alert(`Refund initiated for Complaint ID: ${data.id}`)}
                        style={{
                            backgroundColor: "#FF6961",
                            border: "none",
                            padding: "0.5rem 1.2rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: "#fff"
                        }}
                    >
                        Refund
                    </button>
                    <button
                        onClick={() => alert(`Warning issued for Complaint ID: ${data.id}`)}
                        style={{
                            backgroundColor: "#77DD77",
                            border: "none",
                            padding: "0.5rem 1.2rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: "#fff"
                        }}
                    >
                        Warn
                    </button>
                    <button
                        onClick={() => alert(`Other action selected for Complaint ID: ${data.id}`)}
                        style={{
                            backgroundColor: "#FFA500",
                            border: "none",
                            padding: "0.5rem 1.2rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: "#fff"
                        }}
                    >
                        Other
                    </button>
                </div>

                {/* Notify Parties */}
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="notify" defaultChecked />
                    <label htmlFor="notify" style={{ fontSize: "0.95rem" }}>
                        Notify Parties
                    </label>
                </div>

                {/* Save / Request / Escalate */}
                <div style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap"
                }}>
                    <Button
                        onClick={() => alert(`Resolution saved for Complaint ID: ${data.id}`)}
                        className="bg-[#3E1F16] text-white"
                    >
                        Save Resolution
                    </Button>
                    <Button
                        onClick={() => alert(`Information requested for Complaint ID: ${data.id}`)}
                        className="bg-[#3E1F16] text-white"
                    >
                        Request Info
                    </Button>
                    <Button
                        onClick={() => alert(`Complaint escalated for Complaint ID: ${data.id}`)}
                        className="bg-[#3E1F16] text-white"
                    >
                        Escalate
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ComplaintDetails;
