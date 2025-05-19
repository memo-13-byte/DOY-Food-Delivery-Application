import React, { useState, useRef, useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        alert("Logged out! (future: redirect to login)");
        setIsDropdownOpen(false);
    };

    const handleViewProfile = () => {
        alert("View Profile! (future: redirect to profile page)");
        setIsDropdownOpen(false);
    };

    // Dışarı tıklanınca dropdown'ı kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getButtonStyle = (path) => ({
        backgroundColor: location.pathname === path 
            ? darkMode ? "rgba(200, 169, 126, 0.8)" : "#C8A97E" 
            : "transparent",
        color: location.pathname === path 
            ? darkMode ? "#000" : "#000" 
            : "#fff",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
        fontSize: "0.95rem",
        borderRadius: "8px",
        padding: "0.5rem 1rem",
        transition: "all 0.3s ease",
        boxShadow: location.pathname === path 
            ? "0 2px 8px rgba(0,0,0,0.15)" 
            : "none",
        transform: "translateY(0)",
        letterSpacing: "0.3px"
    });

    const getButtonHoverStyle = (path) => {
        if (location.pathname !== path) {
            return {
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: "translateY(-2px)"
            };
        }
        return {};
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#333" : "#47300A",
            color: darkMode ? "#fff" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.8rem 2rem",
            transition: "all 0.3s ease-in-out",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            width: "100%"
        }}>
            {/* Sol Logo */}
            <div 
                style={{ 
                    fontWeight: "bold", 
                    fontSize: "1.5rem", 
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                }}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => e.target.style.color = "#e8c886"}
                onMouseLeave={(e) => e.target.style.color = "#fff"}
            >
                Doy!
            </div>

            {/* Menü */}
            <div style={{ 
                display: "flex", 
                gap: "0.8rem",
                justifyContent: "center",
                flex: 1
            }}>
                <button 
                    style={getButtonStyle("/admin/account-management")}
                    onClick={() => navigate("/admin/account-management")}
                    onMouseEnter={(e) => {
                        const hoverStyle = getButtonHoverStyle("/admin/account-management");
                        Object.assign(e.target.style, hoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = location.pathname === "/admin/account-management" 
                            ? (darkMode ? "rgba(200, 169, 126, 0.8)" : "#C8A97E") 
                            : "transparent";
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    Account Management
                </button>
                <button 
                    style={getButtonStyle("/admin/pending-registrations")}
                    onClick={() => navigate("/admin/pending-registrations")}
                    onMouseEnter={(e) => {
                        const hoverStyle = getButtonHoverStyle("/admin/pending-registrations");
                        Object.assign(e.target.style, hoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = location.pathname === "/admin/pending-registrations" 
                            ? (darkMode ? "rgba(200, 169, 126, 0.8)" : "#C8A97E") 
                            : "transparent";
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    Pending Registrations
                </button>
                <button 
                    style={getButtonStyle("/admin/complaints")}
                    onClick={() => navigate("/admin/complaints")}
                    onMouseEnter={(e) => {
                        const hoverStyle = getButtonHoverStyle("/admin/complaints");
                        Object.assign(e.target.style, hoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = location.pathname === "/admin/complaints" 
                            ? (darkMode ? "rgba(200, 169, 126, 0.8)" : "#C8A97E") 
                            : "transparent";
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    User Complaints
                </button>
                <button 
                    style={getButtonStyle("/admin/platform-configurations")}
                    onClick={() => navigate("/admin/platform-configurations")}
                    onMouseEnter={(e) => {
                        const hoverStyle = getButtonHoverStyle("/admin/platform-configurations");
                        Object.assign(e.target.style, hoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = location.pathname === "/admin/platform-configurations" 
                            ? (darkMode ? "rgba(200, 169, 126, 0.8)" : "#C8A97E") 
                            : "transparent";
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    Platform Configurations
                </button>
            </div>

            {/* Sağ taraf - Dark Mode + Admin */}
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem", 
                position: "relative" 
            }} ref={dropdownRef}>
                {/* Toggle */}
                <div
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.4rem", 
                        cursor: "pointer",
                        padding: "0.3rem",
                        borderRadius: "20px",
                        transition: "background-color 0.3s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                    <div style={{
                        width: "34px",
                        height: "18px",
                        borderRadius: "20px",
                        backgroundColor: "#F8F5DE",
                        position: "relative",
                        transition: "background-color 0.3s",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
                    }}>
                        <div style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: darkMode ? "#e8c886" : "#47300A",
                            position: "absolute",
                            top: "1px",
                            left: darkMode ? "17px" : "1px",
                            transition: "all 0.3s ease",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                        }} />
                    </div>
                    {darkMode ? 
                        <BsSun color="#e8c886" size={18} /> : 
                        <BsMoon color="#fff" size={18} />
                    }
                </div>

                {/* Admin Buton */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                        backgroundColor: darkMode ? "#e8c886" : "#F8F5DE",
                        color: "#47300A",
                        fontWeight: "bold",
                        border: "none",
                        padding: "0.4rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        transform: "translateY(0)"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    }}
                >
                    👤 ADMIN {isDropdownOpen ? "▲" : "▼"}
                </button>

                {/* Dropdown Menü */}
                {isDropdownOpen && (
                    <div style={{
                        position: "absolute",
                        top: "2.8rem",
                        right: "0",
                        backgroundColor: darkMode ? "rgba(60, 60, 60, 0.95)" : "rgba(255, 255, 255, 0.95)",
                        border: darkMode ? "1px solid #555" : "1px solid #ddd",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        minWidth: "180px",
                        overflow: "hidden",
                        zIndex: 1000,
                        animation: "fadeIn 0.2s ease-out",
                        backdropFilter: "blur(10px)"
                    }}>
                        <div
                            onClick={handleViewProfile}
                            style={{
                                padding: "1rem",
                                cursor: "pointer",
                                borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                                backgroundColor: "transparent",
                                textAlign: "center",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                                color: darkMode ? "#e0e0e0" : "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = darkMode ? "rgba(80, 80, 80, 0.5)" : "rgba(240, 240, 240, 0.8)";
                                e.target.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.transform = "translateY(0)";
                            }}
                        >
                            👤 View Profile
                        </div>
                        <div
                            onClick={handleLogout}
                            style={{
                                padding: "1rem",
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                textAlign: "center",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                                color: darkMode ? "#e0e0e0" : "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = darkMode ? "rgba(80, 80, 80, 0.5)" : "rgba(240, 240, 240, 0.8)";
                                e.target.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.transform = "translateY(0)";
                            }}
                        >
                            🚪 Sign Out
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNavbar;