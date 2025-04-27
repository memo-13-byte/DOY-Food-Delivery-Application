import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import PendingUserList from "../components/PendingUserList";
import PendingSelectedUser from "../components/PendingSelectedUser";
import PendingActionButtons from "../components/PendingActionButtons";

export default function PendingRegistrationsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedPendingUser, setSelectedPendingUser] = useState(null);

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
                display: "flex",
                flexDirection: "column",
                padding: "2rem 4rem",
                gap: "4rem"
            }}>
                <h2 style={{ marginBottom: "2rem" }}>Pending Registrations</h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "2rem",
                    alignItems: "flex-start"
                }}>
                    {/* Sol Liste */}
                    <PendingUserList
                        setSelectedPendingUser={setSelectedPendingUser}
                        selectedPendingUser={selectedPendingUser}
                        darkMode={darkMode}
                    />

                    {/* Orta Seçilen Kullanıcı */}
                    <PendingSelectedUser
                        selected={selectedPendingUser}
                        darkMode={darkMode}
                    />

                    {/* Sağ Action Butonları */}
                    <PendingActionButtons
                        selected={selectedPendingUser}
                        darkMode={darkMode}
                    />
                </div>
            </div>

            {/* Footer */}
            <Footer darkMode={darkMode} />
        </div>
    );
}
