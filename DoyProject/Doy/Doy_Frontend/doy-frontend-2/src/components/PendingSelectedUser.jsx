import React from "react";
import { HiOutlineUser } from "react-icons/hi";

const PendingSelectedUser = ({ selected, darkMode }) => {
    if (!selected) {
        return (
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#f3f3f3",
                padding: "1rem",
                borderRadius: "20px",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <span style={{ color: "#888" }}>No Pending User Selected</span>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#f3f3f3",
            padding: "1.5rem",
            borderRadius: "20px",
            minHeight: "300px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <HiOutlineUser size={48} style={{ marginBottom: "1rem", color: darkMode ? "#fff" : "#000" }} />
            <h3 style={{ margin: "0" }}>{selected.name}</h3>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: darkMode ? "#ccc" : "#555" }}>{selected.role}</p> {/* ✨ Düzeltildi */}
        </div>
    );
};

export default PendingSelectedUser;
