import React from "react";
import { BsMoon } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            backgroundColor: darkMode ? "#333" : "#47300A",
            color: darkMode ? "#fff" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.6rem 1.5rem",
            transition: "all 0.3s ease-in-out",
        }}>
            {/* Sol Logo */}
            <div style={{ fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }}
                 onClick={() => navigate("/")}>
                Doy!
            </div>

            {/* Menü */}
            <div style={{ display: "flex", gap: "1rem" }}>
                <button style={{
                    backgroundColor: "transparent",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                }}
                        onClick={() => navigate("/admin/account-management")}
                >
                    Account Management
                </button>
                <button style={{
                    backgroundColor: "transparent",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                }}
                        onClick={() => navigate("/admin/pending-registrations")}
                >
                    Pending Registrations
                </button>
                <button style={{
                    backgroundColor: "#C8A97E",
                    color: "#000",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "6px",
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.9rem"
                }}
                        onClick={() => navigate("/admin/complaints")}
                >
                    User Complaints
                </button>
                <button style={{
                    backgroundColor: "transparent",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                }}
                        onClick={() => navigate("/admin/platform-configurations")}
                >
                    Platform Configurations
                </button>
            </div>

            {/* Sağ taraf - Dark Mode + Admin */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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

                {/* Admin */}
                <button style={{
                    backgroundColor: "#F8F5DE",
                    color: "#000",
                    fontWeight: "bold",
                    border: "none",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "10px",
                    cursor: "default",
                    fontSize: "0.9rem"
                }}>
                    👤 ADMIN
                </button>
            </div>
        </div>
    );
};

export default AdminNavbar;
