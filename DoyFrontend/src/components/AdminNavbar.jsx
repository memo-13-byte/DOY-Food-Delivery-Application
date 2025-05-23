import React, { useState, useRef, useEffect } from "react";
import { BsMoon } from "react-icons/bs";
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
        backgroundColor: location.pathname === path ? "#C8A97E" : "transparent",
        color: location.pathname === path ? "#000" : "#fff",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
        fontSize: "0.9rem",
        borderRadius: "6px",
        padding: "0.3rem 0.6rem",
        transition: "all 0.3s ease"
    });

    return (
        <div style={{
            backgroundColor: darkMode ? "#333" : "#47300A",
            color: darkMode ? "#fff" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.6rem 1.5rem",
            transition: "all 0.3s ease-in-out",
            position: "relative"
        }}>
            {/* Sol Logo */}
            <div style={{ fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }}
                 onClick={() => navigate("/")}>
                DOY!
            </div>

            {/* Menü */}
            <div style={{ display: "flex", gap: "1rem" }}>
                <button style={getButtonStyle("/admin/account-management")}
                        onClick={() => navigate("/admin/account-management")}
                >
                    Account Management
                </button>
                <button style={getButtonStyle("/admin/pending-registrations")}
                        onClick={() => navigate("/admin/pending-registrations")}
                >
                    Pending Registrations
                </button>
                <button style={getButtonStyle("/admin/complaints")}
                        onClick={() => navigate("/admin/complaints")}
                >
                    User Complaints
                </button>
                <button style={getButtonStyle("/admin/platform-configurations")}
                        onClick={() => navigate("/admin/platform-configurations")}
                >
                    Platform Configurations
                </button>
            </div>

            {/* Sağ taraf - Dark Mode + Admin */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }} ref={dropdownRef}>
                {/* Toggle */}
                <div
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
                >
                    <div style={{
                        width: "34px",
                        height: "18px",
                        borderRadius: "20px",
                        backgroundColor: "#F8F5DE",
                        position: "relative",
                        transition: "background-color 0.3s"
                    }}>
                        <div style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#000",
                            position: "absolute",
                            top: "1px",
                            left: darkMode ? "17px" : "1px",
                            transition: "left 0.3s"
                        }} />
                    </div>
                    <BsMoon color={darkMode ? "#000" : "#fff"} size={18} />
                </div>

                {/* Admin Buton */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                        backgroundColor: "#F8F5DE",
                        color: "#000",
                        fontWeight: "bold",
                        border: "none",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        position: "relative"
                    }}
                >
                    👤 ADMIN
                </button>

                {/* Dropdown Menü */}
                {isDropdownOpen && (
                    <div style={{
                        position: "absolute",
                        top: "2.5rem",
                        right: "-1rem",
                        backgroundColor: darkMode ? "#444" : "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        minWidth: "150px",
                        overflow: "hidden",
                        zIndex: 1000,
                    }}>
                        <div
                            onClick={handleViewProfile}
                            style={{
                                padding: "0.8rem",
                                cursor: "pointer",
                                borderBottom: "1px solid #ccc",
                                backgroundColor: "transparent",
                                textAlign: "center",
                                fontWeight: "bold",
                                transition: "background 0.2s",
                                color: darkMode ? "#fff" : "#000"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#555" : "#f5f5f5"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            View Profile
                        </div>
                        <div
                            onClick={handleLogout}
                            style={{
                                padding: "0.8rem",
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                textAlign: "center",
                                fontWeight: "bold",
                                transition: "background 0.2s",
                                color: darkMode ? "#fff" : "#000"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#555" : "#f5f5f5"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            Sign Out
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNavbar;
