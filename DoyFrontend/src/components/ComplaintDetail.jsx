import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Modal from "./Modal";
import orderHistoryMockData from "../data/orderHistoryMockData";
import Toast from "./Toast";


const ComplaintDetails = ({ data, darkMode, addToast }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("view");



    if (!data) return null;

    const openModal = (contentType) => {
        setModalContent(contentType);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };


    const orderHistory = orderHistoryMockData[data.id] || [];

    const totalPrice = orderHistory.reduce((acc, item) => {
        const priceNumber = parseFloat(item.price.replace("$", ""));
        return acc + priceNumber * item.quantity;
    }, 0);

    const handleAction = (action) => {
        if (action === "refund" || action === "warn" || action === "other") {
            data.status = "Resolved";
            addToast(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} completed!`);
        } else if (action === "save") {
            if (data.status !== "Resolved") {
                data.status = "Resolved";
                addToast("✅ Resolution saved!");
            } else {
                addToast("⚠️ Already resolved.");
            }
        } else if (action === "request") {
            addToast("ℹ️ Requested more information from customer.");
        } else if (action === "escalate") {
            data.escalated = true;
            addToast("🚀 Complaint escalated!");
        }
    };



    return (
        <>
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
                        ? (darkMode ? "#2e4d2e" : "#D4EDDA")
                        : (darkMode ? "#3a2c2c" : "#FADADD"),
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

                    {/* Customer Info */}
                    <p><b>Customer:</b> {data.customer}</p>
                    <p><b>Restaurant:</b> {data.restaurant}</p>
                    <p><b>Date Filed:</b> {data.filedDate}</p>
                    <p><b>Type:</b> {data.type}</p>
                    <p><b>Description:</b> {data.description}</p>

                    {/* View / Chat Log */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button
                            onClick={() => openModal("view")}
                            style={{
                                backgroundColor: "#F4AFA6",
                                border: "none",
                                padding: "0.5rem 1.2rem",
                                borderRadius: "20px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                color: "#000"
                            }}
                        >
                            View
                        </button>
                        <button
                            onClick={() => openModal("chatlog")}
                            style={{
                                backgroundColor: "#F4AFA6",
                                border: "none",
                                padding: "0.5rem 1.2rem",
                                borderRadius: "20px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                color: "#000"
                            }}
                        >
                            Chat Log
                        </button>
                    </div>

                    {/* Status */}
                    <div style={{ marginTop: "1rem" }}>
                        <p><b>Status:</b></p>
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

                    {/* Action Buttons */}
                    <div style={{ marginTop: "1.5rem", fontWeight: "bold" }}>Action:</div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                        <Button className="bg-[#FF6961] text-white" onClick={() => handleAction("refund")}>Refund</Button>
                        <Button className="bg-[#77DD77] text-white" onClick={() => handleAction("warn")}>Warn</Button>
                        <Button className="bg-[#FFA500] text-white" onClick={() => handleAction("other")}>Other</Button>
                    </div>

                    {/* Notify Parties */}
                    <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input type="checkbox" id="notify" defaultChecked />
                        <label htmlFor="notify">Notify Parties</label>
                    </div>

                    {/* Save, Request Info, Escalate */}
                    <div style={{
                        marginTop: "2rem",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap"
                    }}>
                        <Button className="bg-[#3E1F16] text-white" onClick={() => handleAction("save")}>Save Resolution</Button>
                        <Button className="bg-[#3E1F16] text-white" onClick={() => handleAction("request")}>Request Info</Button>
                        <Button className="bg-[#3E1F16] text-white" onClick={() => handleAction("escalate")}>Escalate</Button>
                    </div>
                </div>
            </motion.div>

            {/* MODAL */}
            <Modal isOpen={modalOpen} onClose={closeModal} darkMode={darkMode}>
                {modalContent === "view" ? (
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Order History</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            {orderHistory.map((item, index) => (
                                <div key={index} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: darkMode ? "#444" : "#f0f0f0",
                                    padding: "0.6rem 1rem",
                                    borderRadius: "12px",
                                    fontSize: "0.95rem"
                                }}>
                                    <span>{item.item}</span>
                                    <span>x{item.quantity}</span>
                                    <span>{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: "1.5rem", textAlign: "right", fontWeight: "bold" }}>
                            Total: ${totalPrice.toFixed(2)}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Chat Log</h2>
                        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{
                                alignSelf: "flex-start",
                                backgroundColor: darkMode ? "#5A5A5A" : "#e0e0e0",
                                padding: "0.8rem",
                                borderRadius: "20px",
                                maxWidth: "70%",
                            }}>
                                <b>{data.customer}:</b> I had an issue with my order.
                            </div>
                            <div style={{
                                alignSelf: "flex-end",
                                backgroundColor: darkMode ? "#4CAF50" : "#D4EDDA",
                                padding: "0.8rem",
                                borderRadius: "20px",
                                maxWidth: "70%",
                            }}>
                                <b>{data.restaurant}:</b> We apologize for the inconvenience!
                            </div>
                            <div style={{
                                alignSelf: "flex-start",
                                backgroundColor: darkMode ? "#5A5A5A" : "#e0e0e0",
                                padding: "0.8rem",
                                borderRadius: "20px",
                                maxWidth: "70%",
                            }}>
                                <b>{data.customer}:</b> The delivery was late and cold.
                            </div>
                            <div style={{
                                alignSelf: "flex-end",
                                backgroundColor: darkMode ? "#4CAF50" : "#D4EDDA",
                                padding: "0.8rem",
                                borderRadius: "20px",
                                maxWidth: "70%",
                            }}>
                                <b>{data.restaurant}:</b> We'll offer a full refund immediately.
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default ComplaintDetails;
