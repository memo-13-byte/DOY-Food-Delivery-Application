import React, { useEffect, useState } from "react";
import axios from "axios" 


const RestaurantList = ({ restaurants, setRestaurants, setSelectedRestaurant, selectedRestaurant, darkMode }) => {
    const [search, setSearch] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState("all");
    const [restaurantsToDisplay, setRestaurantsToDisplay] = useState([])


    useEffect( () => {
        const getAllRestaurants = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/restaurant/get-all`)
                let data = []
                response.data.forEach((value) => {data.push(
                    {
                        id: value.id,
                        name: value.restaurantName,
                        type: "Restaurant",
                        banned: false,
                        suspended: false,
                        suspendedUntil: null
                    }
                )})
                setRestaurants(data)
                setFilteredRestaurants(restaurants
                    .filter(restaurant => {
                        const matchesSearch = restaurant.name.toLowerCase().includes(search.toLowerCase());
                        const matchesFilter =
                            filter === "all" ||
                            (filter === "active" && !restaurant.banned && !restaurant.suspended) ||
                            (filter === "banned" && restaurant.banned) ||
                            (filter === "suspended" && restaurant.suspended);
                        return matchesSearch && matchesFilter;
                    }))
                setRestaurantsToDisplay(showAll ? filteredRestaurants : filteredRestaurants.slice(0, 4))
            } catch (error) {
                console.error("No restaurants found: " + error)
            }
        }

        getAllRestaurants()
        
    }, [restaurants,search])

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
                <option value="all">All Restaurants</option>
                <option value="active">Active Restaurants</option>
                <option value="banned">Banned Restaurants</option>
                <option value="suspended">Suspended Restaurants</option>
            </select>

            {/* Restaurant Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {restaurantsToDisplay.map(restaurant => (
                    <div
                        key={restaurant.id}
                        onClick={() => {
                            if (selectedRestaurant?.id === restaurant.id) {
                                setSelectedRestaurant(null);
                            } else {
                                setSelectedRestaurant(restaurant);
                            }
                        }}
                        style={{
                            padding: "0.8rem",
                            backgroundColor: selectedRestaurant?.id === restaurant.id
                                ? (darkMode ? "#555" : "#D4BFAA")
                                : (darkMode ? "#3a3a3a" : "#eee"),
                            borderRadius: "12px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.3s ease",
                            position: "relative",
                        }}
                    >
                        <div style={{ fontWeight: "bold" }}>{restaurant.name}</div>
                        <small>{restaurant.type}</small>

                        {/* BAN veya SUSPEND Badge */}
                        {restaurant.banned && (
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
                        {restaurant.suspended && !restaurant.banned && (
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
                        {restaurant.suspended && restaurant.suspendUntil && (
                            <small style={{ fontSize: "0.7rem", display: "block", marginTop: "2px" }}>
                                Until: {new Date(restaurant.suspendUntil).toLocaleDateString()}
                            </small>
                        )}

                    </div>
                ))}
            </div>

            {/* Load More / Show Less */}
            {filteredRestaurants.length > 4 && (
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

export default RestaurantList;
