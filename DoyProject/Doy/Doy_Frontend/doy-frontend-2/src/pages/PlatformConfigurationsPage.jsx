import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import PolicyList from "../components/PolicyList";
import PromotionList from "../components/PromotionList";
import OrderSettings from "../components/OrderSettings";
import AutomaticApprovals from "../components/AutomaticApprovals";

export default function PlatformConfigurationsPage({ darkMode, setDarkMode }) {


    const handleApplyChanges = () => {
        alert("Changes Applied!");
    };

    const handleApplyChangesAndNotify = () => {
        alert("Changes Applied and Users Notified!");
    };

    const handleDiscardChanges = () => {
        alert("Changes Discarded!");
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F8F5DE",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Navbar */}
            <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Main Content */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                padding: "2rem 4rem",
            }}>
                {/* Configure Policies */}
                <div>
                    <h2 style={{ marginBottom: "1rem" }}>Configure Policies</h2>
                    <PolicyList darkMode={darkMode} />
                </div>

                {/* Configure Order Settings */}
                <div>
                    <h2 style={{ marginBottom: "1rem" }}>Configure Order Settings</h2>
                    <OrderSettings darkMode={darkMode} />
                </div>

                {/* Configure Promotions */}
                <div>
                    <h2 style={{ marginBottom: "1rem" }}>Configure Promotions</h2>
                    <PromotionList darkMode={darkMode} />
                </div>

                {/* Configure Automatic Approvals */}
                <div>
                    <h2 style={{ marginBottom: "1rem" }}>Configure Automatic Approvals</h2>
                    <AutomaticApprovals darkMode={darkMode} />
                </div>
            </div>

            {/* Apply Buttons */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                marginTop: "2rem",
                marginBottom: "2rem",
                flexWrap: "wrap"
            }}>
                <button
                    onClick={handleApplyChanges}
                    style={{
                        backgroundColor: darkMode ? "#555" : "#D6CDEA",
                        color: darkMode ? "#fff" : "#000",
                        padding: "0.8rem 1.5rem",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                >
                    Apply Changes
                </button>
                <button
                    onClick={handleApplyChangesAndNotify}
                    style={{
                        backgroundColor: darkMode ? "#555" : "#D6CDEA",
                        color: darkMode ? "#000" : "#000",
                        padding: "0.8rem 1.5rem",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                >
                    Apply Changes and Notify Users
                </button>
                <button
                    onClick={handleDiscardChanges}
                    style={{
                        backgroundColor: darkMode ? "#555" : "#D6CDEA",
                        color: darkMode ? "#000" : "#000",
                        padding: "0.8rem 1.5rem",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                >
                    Discard Changes
                </button>
            </div>

            {/* Footer */}
            <Footer darkMode={darkMode} />
        </div>
    );
}
