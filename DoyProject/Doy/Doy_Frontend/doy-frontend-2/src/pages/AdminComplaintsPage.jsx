import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import complaintsMockData from '../data/Complaints';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintDetails from '../components/ComplaintDetail';
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer"
import doyLogo from "../assets/doylogo.jpeg";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function AdminComplaintsPage() {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const detailRef = useRef(null);

    const handleComplaintClick = (complaint) => {
        if (selectedComplaint && selectedComplaint.id === complaint.id) {
            setSelectedComplaint(null);
        } else {
            setSelectedComplaint(complaint);
            setTimeout(() => {
                if (detailRef.current) {
                    detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 300);
        }
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F8F5DE",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* ÜST NAVBAR */}
            <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* ALT BAR */}
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
                padding: "1.5rem 3rem",
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                transition: "all 0.3s ease-in-out"
            }}>
                <img src={doyLogo} alt="logo" style={{ height: "180px", borderRadius: "50%" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <div style={{ width: "100%", maxWidth: "500px" }}>
                        <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>
                            Complaints & Disputes Dashboard
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
                <input
                    type="text"
                    placeholder="Filter complaints"
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        padding: "0.75rem 1rem",
                        fontSize: "1rem",
                        borderRadius: "20px",
                        border: "1px solid #ccc",
                        marginBottom: "1.5rem"
                    }}
                />

                {/* Complaint Cardlar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                    {complaintsMockData.map((c) => (
                        <ComplaintCard
                            key={c.id}
                            complaint={c}
                            onClick={() => handleComplaintClick(c)}
                            darkMode={darkMode}
                            selectedComplaint={selectedComplaint}
                        />
                    ))}
                </div>

                {/* Complaint Details */}
                <div ref={detailRef}>
                    <AnimatePresence mode="wait">
                        {selectedComplaint && (
                            <ComplaintDetails data={selectedComplaint} darkMode={darkMode} />
                        )}
                    </AnimatePresence>
                </div>

                <Footer darkMode={darkMode} />


            </div>
        </div>
    );
}
