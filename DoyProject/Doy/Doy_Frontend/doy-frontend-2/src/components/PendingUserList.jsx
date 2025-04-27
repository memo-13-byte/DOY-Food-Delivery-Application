import React, { useState } from "react";

const mockPendingUsers = [
    { id: 1, name: "Courier X", type: "Courier" },
    { id: 2, name: "Restaurant Owner Y", type: "Restaurant Owner" },
    { id: 3, name: "Courier Z", type: "Courier" },
];

const PendingUserList = ({ setSelectedPendingUser, selectedPendingUser, darkMode }) => {
    const [search, setSearch] = useState("");

    const filteredUsers = mockPendingUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
            padding: "1rem",
            borderRadius: "20px",
            minHeight: "300px",
        }}>
            {/* Arama Kutusu */}
            <input
                type="text"
                placeholder="Search Pending User"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    maxWidth: "382px",
                    padding: "0.6rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                }}
            />

            {/* Pending User Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        onClick={() => {
                            if (selectedPendingUser?.id === user.id) {
                                setSelectedPendingUser(null); // ✨ Aynı kullanıcıya tıklarsa seçimi iptal et
                            } else {
                                setSelectedPendingUser(user); // ✨ Farklı kullanıcıya tıklarsa onu seç
                            }
                        }}
                        style={{
                            padding: "0.8rem",
                            backgroundColor: selectedPendingUser?.id === user.id
                                ? (darkMode ? "#555" : "#D4BFAA") // ✨ Seçili kullanıcıyı vurgula
                                : (darkMode ? "#3a3a3a" : "#eee"),
                            borderRadius: "12px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <div style={{ fontWeight: "bold" }}>{user.name}</div>
                        <small>{user.type}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingUserList;
