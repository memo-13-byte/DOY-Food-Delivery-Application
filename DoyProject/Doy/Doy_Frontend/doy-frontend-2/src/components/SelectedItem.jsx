import React from "react";
import { HiOutlineUser } from "react-icons/hi";

const SelectedItem = ({ selected, type, darkMode }) => {
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
                <span style={{ color: "#888" }}>Select a {type}</span>
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
        }}>
            <HiOutlineUser size={40} style={{ marginBottom: "1rem", color: darkMode ? "#fff" : "#000" }} />
            <h3>{selected.name}</h3>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{selected.type}</p>
        </div>
    );
};

export default SelectedItem;
