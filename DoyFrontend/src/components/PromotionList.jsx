import React, { useState } from "react";

const mockPromotions = [
    { id: 1, name: "Promotion A", description: "First Time Customers get %10 discount for..." },
    { id: 2, name: "Promotion B", description: "Customers that has ordering for each day..." },
    { id: 3, name: "Promotion C", description: "Promotion C ..." },
    { id: 4, name: "Promotion D", description: "Promotion D ..." },
];

const PromotionList = ({ darkMode }) => {
    const [search, setSearch] = useState("");

    const filteredPromotions = mockPromotions.filter(promotion =>
        promotion.name.toLowerCase().includes(search.toLowerCase())
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
                placeholder="Search Promotion"
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

            {/* Promosyon Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {filteredPromotions.map(promotion => (
                    <div key={promotion.id} style={{
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
                            <div style={{ fontWeight: "bold" }}>{promotion.name}</div>
                            <small>{promotion.description}</small>
                        </div>
                        <div style={{ fontSize: "1.5rem" }}>➔</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionList;
