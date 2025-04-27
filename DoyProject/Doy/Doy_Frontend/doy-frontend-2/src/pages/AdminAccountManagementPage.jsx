import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import UserList from "../components/UserList"; // birazdan yazacağız
import RestaurantList from "../components/RestaurantList"; // birazdan yazacağız
import SelectedItem from "../components/SelectedItem"; // birazdan yazacağız
import ActionButtons from "../components/ActionButtons"; // birazdan yazacağız

export default function AdminAccountManagementPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
                {/* Manage Users */}
                <div>
                    <h2 style={{ marginBottom: "2rem" }}>Manage Users</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "2rem",
                        alignItems: "flex-start"
                    }}>
                        <UserList setSelectedUser={setSelectedUser} selectedUser={selectedUser} darkMode={darkMode} />
                        <SelectedItem selected={selectedUser} type="user" darkMode={darkMode} />
                        <ActionButtons selected={selectedUser} type="user" darkMode={darkMode} />
                    </div>
                </div>

                {/* Manage Restaurants */}
                <div>
                    <h2 style={{ marginBottom: "2rem" }}>Manage Restaurants</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "2rem",
                        alignItems: "flex-start"
                    }}>
                        <RestaurantList setSelectedRestaurant={setSelectedRestaurant} selectedRestaurant={selectedRestaurant} darkMode={darkMode} />
                        <SelectedItem selected={selectedRestaurant} type="restaurant" darkMode={darkMode} />
                        <ActionButtons selected={selectedRestaurant} type="restaurant" darkMode={darkMode} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer darkMode={darkMode} />
        </div>
    );
}
