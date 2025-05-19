import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import complaintsMockData from '../data/Complaints';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintDetails from '../components/ComplaintDetail';
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import doyLogo from "../assets/doylogo.jpeg";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Toast from '../components/Toast'; // 📢 Toast componentini import et

export default function AdminComplaintsPage({ darkMode, setDarkMode }) {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const navigate = useNavigate();
    const detailRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [dateSort, setDateSort] = useState("newest"); // newest or oldest
    const [statusFilter, setStatusFilter] = useState("all"); // all, open, resolved
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [toastMessages, setToastMessages] = useState([]); // 🔥 Toast array


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

      const addToast = (newMessage) => {
          setToastMessages(prev => [...prev, newMessage]);
          setTimeout(() => {setToastMessages(prev => prev.slice(1));}, 2500);
      };



    const filteredComplaints = complaintsMockData
        .filter(c =>
            (c.customer.toLowerCase().includes(searchText.toLowerCase()) ||
                c.restaurant.toLowerCase().includes(searchText.toLowerCase()) ||
                c.description.toLowerCase().includes(searchText.toLowerCase()))
        )
        .filter(c =>
            statusFilter === "all" || c.status.toLowerCase() === statusFilter
        )
        .sort((a, b) => {
            if (dateSort === "newest") {
                return new Date(b.filedDate) - new Date(a.filedDate);
            } else if (dateSort === "oldest") {
                return new Date(a.filedDate) - new Date(b.filedDate);
            } else {
                return 0; // Normal order, hiç dokunma
            }
        });


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
                {/* Search and Dropdown Filters */}
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Filter complaints"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                            padding: "0.75rem 1rem",
                            fontSize: "1rem",
                            borderRadius: "20px",
                            border: "1px solid #ccc",
                        }}
                    />

                    {/* Date Sort Dropdown */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                            style={{
                                padding: "0.6rem 1rem",
                                borderRadius: "20px",
                                border: "1px solid #ccc",
                                backgroundColor: darkMode ? "#333" : "#fff",
                                color: darkMode ? "#fff" : "#000",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            📅 {dateSort === "normal" ? "Normal Order" : dateSort === "newest" ? "Newest First" : "Oldest First"} {isDateDropdownOpen ? "▲" : "▼"}
                        </button>

                        {isDateDropdownOpen && (
                            <div style={{
                                position: "absolute",
                                top: "110%",
                                left: "0",
                                backgroundColor: darkMode ? "#444" : "#fff",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                overflow: "hidden",
                                zIndex: 10
                            }}>
                                <div
                                    onClick={() => { setDateSort("normal"); setIsDateDropdownOpen(false); }}
                                    style={{
                                        padding: "0.6rem 1rem",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #ccc",
                                        backgroundColor: darkMode ? "#555" : "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Normal Order
                                </div>
                                <div
                                    onClick={() => { setDateSort("newest"); setIsDateDropdownOpen(false); }}
                                    style={{
                                        padding: "0.6rem 1rem",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #ccc",
                                        backgroundColor: darkMode ? "#555" : "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Newest First
                                </div>
                                <div
                                    onClick={() => { setDateSort("oldest"); setIsDateDropdownOpen(false); }}
                                    style={{
                                        padding: "0.6rem 1rem",
                                        cursor: "pointer",
                                        backgroundColor: darkMode ? "#555" : "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Oldest First
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Sort Dropdown */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            style={{
                                padding: "0.6rem 1rem",
                                borderRadius: "20px",
                                border: "1px solid #ccc",
                                backgroundColor: darkMode ? "#333" : "#fff",
                                color: darkMode ? "#fff" : "#000",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            🔵 {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} {isStatusDropdownOpen ? "▲" : "▼"}
                        </button>

                        {isStatusDropdownOpen && (
                            <div style={{
                                position: "absolute",
                                top: "110%",
                                left: "0",
                                backgroundColor: darkMode ? "#444" : "#fff",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                overflow: "hidden",
                                zIndex: 10
                            }}>
                                <div
                                    onClick={() => { setStatusFilter("all"); setIsStatusDropdownOpen(false); }}
                                    style={{
                                        padding: "0.6rem 1rem",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #ccc",
                                        backgroundColor: darkMode ? "#555" : "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    All
                                </div>
                                <div
                                    onClick={() => { setStatusFilter("open"); setIsStatusDropdownOpen(false); }}
                                    style={{
                                        padding: "0.6rem 1rem",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #ccc",
                                        backgroundColor: darkMode ? "#555" : "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Open
                                </div>
                                <div
                                    onClick={() => { setStatusFilter("resolved"); setIsStatusDropdownOpen(false); }}
                                    style={{
                                        padding: "0.6rem 1rem",
                                        cursor: "pointer",
                                        backgroundColor: darkMode ? "#555" : "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Resolved
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Complaint Cardlar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                    {filteredComplaints.slice(0, visibleCount).map((c) => (
                        <ComplaintCard
                            key={c.id}
                            complaint={c}
                            onClick={handleComplaintClick}
                            darkMode={darkMode}
                            isSelected={selectedComplaint && selectedComplaint.id === c.id}
                        />
                    ))}
                    {filteredComplaints.length > visibleCount && (
                        <button
                            onClick={() => setVisibleCount(prev => prev + 4)}
                            style={{
                                marginTop: "1.5rem",
                                padding: "0.8rem 2rem",
                                backgroundColor: darkMode ? "#333" : "#7A0000",
                                color: "#fff",
                                border: "none",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                transition: "background 0.3s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#555" : "#990000"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#333" : "#7A0000"}
                        >
                            Load More
                        </button>
                    )}

                </div>

                {/* Complaint Details */}
                <div ref={detailRef}>
                    <AnimatePresence mode="wait">
                        {selectedComplaint && (
                            <ComplaintDetails
                            data={selectedComplaint}
                        darkMode={darkMode}
                        addToast={addToast} // 📢 EKLİYORSUN BURAYI
                    />

                    )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <Footer darkMode={darkMode} />

                {/* Toasts */}
                {toastMessages.length > 0 && (
                    <Toast messages={toastMessages} darkMode={darkMode} />
                )}

            </div>
        </div>
    );
}

