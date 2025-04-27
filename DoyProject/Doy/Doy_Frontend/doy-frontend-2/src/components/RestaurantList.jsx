import React, { useState } from "react";

const mockRestaurants = [
    { id: 1, name: "Restaurant A", type: "Restaurant" },
    { id: 2, name: "Restaurant B", type: "Restaurant" },
    { id: 3, name: "Restaurant C", type: "Restaurant" },
    { id: 4, name: "Restaurant D", type: "Restaurant" },
];

const RestaurantList = ({ setSelectedRestaurant, selectedRestaurant, darkMode }) => {
    const [search, setSearch] = useState("");

    const filteredRestaurants = mockRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(search.toLowerCase())
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
                placeholder="Search Restaurant"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "0.6rem",
                    maxWidth: "382px",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                }}
            />

            {/* Restaurant Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {filteredRestaurants.map(restaurant => (
                    <div
                        key={restaurant.id}
                        onClick={() => {
                            if (selectedRestaurant?.id === restaurant.id) {
                                setSelectedRestaurant(null); // ✨ Aynı restorana basınca iptal et
                            } else {
                                setSelectedRestaurant(restaurant); // ✨ Başka restorana basınca onu seç
                            }
                        }}
                        style={{
                            padding: "0.8rem",
                            backgroundColor: selectedRestaurant?.id === restaurant.id
                                ? (darkMode ? "#555" : "#D4BFAA") // ✨ Seçili restorantı vurgula
                                : (darkMode ? "#3a3a3a" : "#eee"),
                            borderRadius: "12px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <div style={{ fontWeight: "bold" }}>{restaurant.name}</div>
                        <small>{restaurant.type}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
