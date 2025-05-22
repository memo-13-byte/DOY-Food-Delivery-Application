import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import PendingUserList from "../components/PendingUserList";
import PendingSelectedUser from "../components/PendingSelectedUser";
import PendingActionButtons from "../components/PendingActionButtons";
import Toast from "../components/Toast";
import AuthorizedRequest from "../services/AuthorizedRequest";

const initialUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "pending" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Courier", status: "pending" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
    { id: 4, name: "Samo Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
    { id: 5, name: "Baris Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
    { id: 6, name: "Muzo Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
    { id: 7, name: "Said Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
];

export default function PendingRegistrationsPage({ darkMode, setDarkMode }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterStatus, setFilterStatus] = useState("pending"); // ✨ artık burada
    const [toasts, setToasts] = useState([]);

    const getRegistrationRequests = async () => {
        try {
            const response = await AuthorizedRequest.getRequest("http://localhost:8080/api/users/pendings")   
            let data = response.data.pendingUsers 
            data.forEach((value) => {value.status = "pending"})
            setUsers(data)
        } catch (error) {
            alert(error)
        }
    }

    useEffect( () => {getRegistrationRequests()}, [selectedUser])

    const addToast = (message) => {
        setToasts(prev => [...prev, message]);
        setTimeout(() => setToasts(prev => prev.slice(1)), 2500);
    };

    const putPendingRequest = async(id, state) => {
        try {
            await AuthorizedRequest.putRequest(`http://localhost:8080/api/registration/pending/${id}-${state}`)
            return true
        } catch (error) {
            console.log("Error: " + error)
            return false
        }
    }
    const approveUser = (id) => {
        
        putPendingRequest(id, true).then((response) => {
            if (response) {
                setSelectedUser(null)
                addToast("✅ User approved successfully!")
            }
        })
        
    };

    const declineUser = (id) => {
        putPendingRequest(id, false).then((response) => {
            if (response) {
                setSelectedUser(null)
                addToast("❌ User declined.");
            }
        })
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F8F5DE",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

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
                    <PendingUserList
                        pendingUsers={users}
                        setSelectedPendingUser={setSelectedUser}
                        selectedPendingUser={selectedUser}
                        filterStatus={filterStatus}        // ✨ props geçiyoruz
                        setFilterStatus={setFilterStatus}  // ✨ dropdownu yönetmesi için veriyoruz
                        darkMode={darkMode}
                    />

                    <PendingSelectedUser
                        selected={selectedUser}
                        darkMode={darkMode}
                    />

                    {filterStatus === "pending" ? (
                        <PendingActionButtons
                            selected={selectedUser}
                            approveUser={approveUser}
                            declineUser={declineUser}
                            addToast={addToast}
                            darkMode={darkMode}
                        />
                    ) : (
                        <div style={{
                            backgroundColor: darkMode ? "#2a2a2a" : "#f3f3f3",
                            padding: "1.5rem",
                            borderRadius: "20px",
                            minHeight: "300px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <span style={{ color: "#888" }}>Actions available only for Pending users</span>
                        </div>
                    )}
                </div>
            </div>

            <Footer darkMode={darkMode} />

            {toasts.length > 0 && <Toast messages={toasts} darkMode={darkMode} />}
        </div>
    );
}
