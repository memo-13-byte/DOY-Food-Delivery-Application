import React, { useState } from "react";

const PendingUserList = ({ pendingUsers, setSelectedPendingUser, selectedPendingUser, filterStatus, setFilterStatus, darkMode }) => {
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(3); // ✨ Başlangıçta sadece 3 kullanıcı gösterelim

    const filteredUsers = pendingUsers
        .filter(user => (filterStatus === "all" || user.status === filterStatus))
        .filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

    const usersToShow = filteredUsers.slice(0, visibleCount); // ✨ Şu an görünmesi gerekenler

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
            padding: "1rem",
            borderRadius: "20px",
            minHeight: "300px",
        }}>
            {/* Search Kutusu */}
            <input
                type="text"
                placeholder="Search Pending Users"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(3); // ✨ Arama yapınca yine baştan başlasın
                }}
                style={{
                    width: "95%",
                    padding: "0.6rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                }}
            />

            {/* Filter Dropdown */}
            <select
                value={filterStatus}
                onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setVisibleCount(3); // ✨ Filtre değişince baştan göster
                }}
                style={{
                    width: "100%",
                    padding: "0.6rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
            >
                <option value="pending">Pending Users</option>
                <option value="approved">Approved Users</option>
                <option value="declined">Declined Users</option>
                <option value="all">All Users</option>
            </select>

            {/* Kullanıcı Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {usersToShow.length === 0 ? (
                    <div style={{ textAlign: "center", marginTop: "1rem", color: "#888" }}>
                        No users found
                    </div>
                ) : (
                    usersToShow.map(user => (
                        <div
                            key={user.id}
                            onClick={() => {
                                if (selectedPendingUser?.id === user.id) {
                                    setSelectedPendingUser(null);
                                } else {
                                    setSelectedPendingUser(user);
                                }
                            }}
                            style={{
                                padding: "0.8rem",
                                backgroundColor: selectedPendingUser?.id === user.id
                                    ? (darkMode ? "#555" : "#D4BFAA")
                                    : (darkMode ? "#3a3a3a" : "#eee"),
                                borderRadius: "12px",
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <div style={{ fontWeight: "bold" }}>{user.name}</div>
                            <small>{user.role}</small>
                        </div>
                    ))
                )}
            </div>

            {/* Load More Butonu */}
            {visibleCount < filteredUsers.length && (
                <button
                    onClick={() => setVisibleCount(prev => prev + 3)}
                    style={{
                        marginTop: "1rem",
                        width: "100%",
                        padding: "0.6rem",
                        borderRadius: "20px",
                        backgroundColor: darkMode ? "#555" : "#7A0000",
                        color: "#fff",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default PendingUserList;
