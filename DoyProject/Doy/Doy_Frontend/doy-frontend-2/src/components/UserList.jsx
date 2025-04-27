import React, { useState } from "react";

const mockUsers = [
    { id: 1, name: "Customer A", type: "Customer Account" },
    { id: 2, name: "Customer B", type: "Customer Account" },
    { id: 3, name: "Courier A", type: "Courier Account" },
    { id: 4, name: "Restaurant Owner A", type: "Restaurant Owner Account" },
];

const UserList = ({ setSelectedUser, selectedUser, darkMode }) => {
    const [search, setSearch] = useState("");

    const filteredUsers = mockUsers.filter(user =>
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
                placeholder="Search User"
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

            {/* Kullanıcı Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        onClick={() => {
                            if (selectedUser?.id === user.id) {
                                setSelectedUser(null); // ✨ Aynı kullanıcıya basınca seçimi kaldır
                            } else {
                                setSelectedUser(user); // ✨ Farklı kullanıcıya basınca onu seç
                            }
                        }}
                        style={{
                            padding: "0.8rem",
                            backgroundColor: selectedUser?.id === user.id
                                ? (darkMode ? "#555" : "#D4BFAA") // ✨ Seçili kullanıcıyı hafif vurgula
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

export default UserList;
