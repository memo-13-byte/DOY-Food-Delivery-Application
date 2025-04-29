import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = ({ users, setUsers, setSelectedUser, selectedUser, darkMode }) => { // 📌 Artık props'tan users alıyoruz
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState("all");
    const [usersToDisplay, setUsersToDisplay] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect( () => {
            const getAllUsers = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/get-all`)
                    const data = response.data.map((value) => ({
                        id: value.id,
                        name: value.firstname + " " + value.lastname,
                        type: value.role,
                        banned: false,
                        suspended: false,
                        suspendedUntil: null,
                    }));
                    console.log(data)

                    const filtered = data
                    .filter(user => {
                        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
                        const matchesFilter =
                            filter === "all" ||
                            (filter === "active" && !user.banned && !user.suspended) ||
                            (filter === "banned" && user.banned) ||
                            (filter === "suspended" && user.suspended);
                        return matchesSearch && matchesFilter;
                    });
                    setUsers(data)
                    setFilteredUsers(filtered)

                        setUsersToDisplay(showAll ? filtered : filtered.slice(0, 4));
                } catch (error) {
                    console.error("No users found: " + error)
                }
            }
    
            getAllUsers()
            
        }, [search, filter, showAll, setUsers])

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

            {/* Filtre Dropdown */}
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                    width: "100%",
                    maxWidth: "382px",
                    padding: "0.6rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: darkMode ? "#555" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                    fontWeight: "bold",
                    textAlign: "center",
                    cursor: "pointer",
                }}
            >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="banned">Banned Users</option>
                <option value="suspended">Suspended Users</option>
            </select>

            {/* Kullanıcı Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {usersToDisplay.map(user => (
                    <div
                        key={user.id}
                        onClick={() => {
                            if (selectedUser?.id === user.id) {
                                setSelectedUser(null);
                            } else {
                                setSelectedUser(user);
                            }
                        }}
                        style={{
                            padding: "0.8rem",
                            backgroundColor: selectedUser?.id === user.id
                                ? (darkMode ? "#555" : "#D4BFAA")
                                : (darkMode ? "#3a3a3a" : "#eee"),
                            borderRadius: "12px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.3s ease",
                            position: "relative",
                        }}
                    >
                        <div style={{ fontWeight: "bold" }}>{user.name}</div>
                        <small>{user.type}</small>

                        {/* BAN veya SUSPEND Badge */}
                        {user.banned && (
                            <span style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                backgroundColor: "#FF4C4C",
                                color: "white",
                                fontSize: "0.7rem",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                fontWeight: "bold",
                            }}>BANNED</span>
                        )}
                        {user.suspended && !user.banned && (
                            <span style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                backgroundColor: "#FFC107",
                                color: "black",
                                fontSize: "0.7rem",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                fontWeight: "bold",
                            }}>SUSPENDED</span>
                        )}
                        {user.suspended && user.suspendUntil && (
                            <small style={{ fontSize: "0.7rem", display: "block", marginTop: "2px" }}>
                                Until: {new Date(user.suspendUntil).toLocaleDateString()}
                            </small>
                        )}

                    </div>
                ))}
            </div>

            {/* Load More / Show Less */}
            {filteredUsers.length > 4 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    style={{
                        marginTop: "1rem",
                        padding: "0.6rem 1rem",
                        borderRadius: "20px",
                        backgroundColor: darkMode ? "#555" : "#7A0000",
                        color: "#fff",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "100%",
                        maxWidth: "382px"
                    }}
                >
                    {showAll ? "Show Less" : "Load More"}
                </button>
            )}
        </div>
    );
};

export default UserList;
