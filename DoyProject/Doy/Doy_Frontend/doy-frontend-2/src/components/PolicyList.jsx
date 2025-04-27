import React, { useState } from "react";

const mockPolicies = [
    { id: 1, name: "Policy A", description: "Policy A defines delivery fees..." },
    { id: 2, name: "Policy B", description: "Policy B defines user rights..." },
    { id: 3, name: "Policy C", description: "Policy C defines ..." },
    { id: 4, name: "Policy D", description: "Policy D defines ..." },
];

const PolicyList = ({ darkMode }) => {
    const [search, setSearch] = useState("");

    const filteredPolicies = mockPolicies.filter(policy =>
        policy.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
            padding: "1rem",
            borderRadius: "20px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
        }}>
            {/* Arama Barı */}
            <input
                type="text"
                placeholder="Search Policy"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    maxWidth: "615px",
                    padding: "0.6rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    textAlign: "center"
                }}
            />

            {/* Politika Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {filteredPolicies.map(policy => (
                    <div key={policy.id} style={{
                        backgroundColor: darkMode ? "#3a3a3a" : "#f3f3f3",
                        padding: "0.8rem",
                        borderRadius: "12px",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}>
                        <div>
                            <div style={{ fontWeight: "bold" }}>{policy.name}</div>
                            <small>{policy.description}</small>
                        </div>
                        <div style={{ fontSize: "1.5rem" }}>➔</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PolicyList;
