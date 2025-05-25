"use client"

import { useState, useEffect } from "react"
import { FaStar, FaRegStar, FaArrowLeft, FaArrowRight, FaSearch, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6"
import { BsMoon } from "react-icons/bs"
import doyLogo from "../assets/doylogo.jpeg"
import { useNavigate } from "react-router-dom"
import { FaLocationDot } from "react-icons/fa6"
import LocationModal from "../components/ui/LocationModal"
import AuthorizedRequest from "../services/AuthorizedRequest"
import Header from "../components/Header"
import Footer from "../components/Footer"
import DoyLogo from "../components/DoyLogo"

const renderStars = (rating) => {
    const stars = []
    const full = Math.floor(rating)
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f-${i}`} color="#ffcc00" />)
    const hasHalfStar = rating % 1 !== 0;
    if (hasHalfStar && full < 5) {
        if (rating % 1 >= 0.5) stars.push(<FaStar key="half" color="#ffcc00" style={{ opacity: 0.5 }} />)
    }
    while (stars.length < 5) stars.push(<FaRegStar key={`e-${stars.length}`} color="#ffcc00" />)
    return stars
}

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [searchText, setSearchText] = useState("")
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [minRating, setMinRating] = useState(0)

    const [selectedCity, setSelectedCity] = useState(""); // Stores the currently selected city (e.g., "ANKARA")
    const [cities, setCities] = useState([]); // Stores the list of available cities (e.g., ["ANKARA", "ISTANBUL"])

    const [selectedDistrict, setSelectedDistrict] = useState(""); // Stores the currently selected district name (e.g., "Çankaya")
    const [districts, setDistricts] = useState([]); // Stores the list of di

    // Filter states
    const [maxMinOrderPrice, setMaxMinOrderPrice] = useState("")
    const [cuisine, setCuisine] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [sortDirection, setSortDirection] = useState("ASC")
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [cuisineTypes, setCuisineTypes] = useState([]); // Add this line
    const [showCuisineDropdown, setShowCuisineDropdown] = useState(false);
    const [restaurants, setRestaurants] = useState([])
    const [touchStartX, setTouchStartX] = useState(null)
    const [touchEndX, setTouchEndX] = useState(null)
    const [groupedRestaurants, setGroupedRestaurants] = useState({});
    const [cuisineCurrentPages, setCuisineCurrentPages] = useState({});
    const [showSortByDropdown, setShowSortByDropdown] = useState(false);

    const restaurantsPerPage = 5;

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const itemsPerPage = 3


    const sortMap = {"Minimum Sepet Tutarı" : "minOrderPrice" , "Puan Ortalaması" : "rating" , "Alfabetik" : "restaurantName" }
    const iconLinkStyle = {
        color: "inherit",
        textDecoration: "none",
        padding: "0.4rem",
        borderRadius: "50%",
        transition: "background-color 0.3s",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
    useEffect(() => {
        const getRestaurantsFromBackend = async () => {
            // Start with an empty object for parameters
            const paramsForAPI = {};

            // Add other filters conditionally, as before
            // Note: Using `if` statements for clarity, equivalent to `...()` for single conditions
            if (searchText) {
                paramsForAPI.name = searchText;
            }
            if (minRating > 0) {
                paramsForAPI.minRating = parseFloat(minRating);
            }
            if (maxMinOrderPrice) { // Use truthiness check, backend can validate value
                paramsForAPI.maxMinOrderPrice = parseFloat(maxMinOrderPrice);
            }
            if (cuisine && cuisine !== "None") { // Ensure 'None' is not sent
                paramsForAPI.cuisine = cuisine;
            }
            if (sortBy) { // If sortBy is an empty string, it won't be added
                paramsForAPI.sortBy = sortBy;
            }
            if (sortDirection) {
                paramsForAPI.sortDirection = sortDirection;
            }

            const isCityDistrictValid =
                selectedCity && selectedCity !== "None" &&
                selectedDistrict && selectedDistrict !== "None";

            if (isCityDistrictValid) {
                paramsForAPI.city = selectedCity;
                paramsForAPI.districtName = selectedDistrict;
            } else if (selectedCity || selectedDistrict) {
                return;
            }

            // Pagination parameters (always include)
            paramsForAPI.page = 0;
            paramsForAPI.size = 9999; // Attempt to fetch all relevant for client-side grouping
        

            console.log("Fetching restaurants with params for API call:", paramsForAPI);
            try {
                const response = await AuthorizedRequest.getRequest(
                    "http://localhost:8080/api/restaurant/search",
                    { params: paramsForAPI }
                );
                if (response.data && response.data.content) {
                    const results = response.data.content.map((res) => ({
                        ...res,
                        image: res.imageId
                            ? `http://localhost:8080/api/upload/image/${res.imageId}`
                            : "/placeholder.svg",
                    }));
                    setRestaurants(results);
                } else {
                    setRestaurants([]);
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error.response || error.message);
                setRestaurants([]);
            }
        };

        // --- OPTIONAL BUT RECOMMENDED: ADD DEBOUNCE ---
        // If you haven't added this from the previous suggestion, it's highly recommended
        // to prevent excessive API calls when filters change rapidly.
        const debounceTimeout = setTimeout(() => {
            getRestaurantsFromBackend();
        }, 300); // Wait 300ms after last change before firing request

        // Cleanup function for setTimeout
        return () => clearTimeout(debounceTimeout);
        // --- END OPTIONAL DEBOUNCE ---

    }, [
        searchText,
        minRating,
        maxMinOrderPrice,
        cuisine,
        sortBy,
        sortDirection,
        selectedCity,
        selectedDistrict
    ]);
    useEffect(() => {
        // Only fetch if advanced filters are shown AND cities haven't been loaded yet
        if (showAdvancedFilters && cities.length === 0) {
            const fetchCities = async () => {
                try {
                    // Assuming this endpoint returns a List<CityEnum> as strings
                    const response = await AuthorizedRequest.getRequest("http://localhost:8080/api/district/cities");
                    if (response.data) {
                        setCities(["None", ...response.data]); // Prepend "None" for reset
                    }
                } catch (error) {
                    console.error("Error fetching cities:", error.response || error.message);
                }
            };
            fetchCities();
        }
    }, [showAdvancedFilters, cities.length]);


    useEffect(() => {
        if (selectedCity && selectedCity !== "None") { // Only fetch if a city is selected and it's not "None"
            const fetchDistricts = async () => {
                try {
                    // Assuming this endpoint returns a List<DistrictDTO> or List<String> of district names
                    const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/district/${selectedCity}`);
                    if (response.data) {
                        console.log("aşdşsaşfsa")
                        console.log(response.data)
                        // Assuming response.data is an array of district objects or just names
                        // If it's objects, you might need to map them: response.data.map(d => d.name)
                        setDistricts(["None", ...response.data]); // Prepend "None"
                    }
                } catch (error) {
                    console.error(`Error fetching districts for ${selectedCity}:`, error.response || error.message);
                    setDistricts(["None"]); // Reset districts if error or no districts found
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]); // Clear districts if no city or "None" is selected
            setSelectedDistrict(""); // Clear selected district
        }
    }, [selectedCity]); // Depend on selectedCity

    useEffect(() => {
        const group = {};
        const initialPages = {}; // Keep track of pages for newly appearing cuisines
        restaurants.forEach(res => {
            const cuisineType = res.restaurantCategory || 'Diğer';
            if (!group[cuisineType]) {
                group[cuisineType] = [];
            }
            group[cuisineType].push(res);
            // Initialize page for this cuisine if not already set
            if (cuisineCurrentPages[cuisineType] === undefined) {
                initialPages[cuisineType] = 0;
            }
        });
        setGroupedRestaurants(group);

        // Only update pages if new cuisines appeared
        if (Object.keys(initialPages).length > 0) {
            setCuisineCurrentPages(prevPages => ({
                ...prevPages,
                ...initialPages
            }));
        }

    }, [restaurants]); // Depend on restaurants state only


    useEffect(() => {
        if (showAdvancedFilters && cuisineTypes.length === 0) { // Only fetch if advanced filters are open and types haven't been loaded yet
            const fetchCuisineTypes = async () => {
                try {
                    const response = await AuthorizedRequest.getRequest("http://localhost:8080/api/restaurant/get-types");
                    if (response.data) {
                        setCuisineTypes(["None", ...response.data]);
                    }
                } catch (error) {
                    console.error("Error fetching cuisine types:", error.response || error.message);
                }
            };
            fetchCuisineTypes();
        }
    }, [showAdvancedFilters, cuisineTypes.length]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const cuisineInput = document.getElementById("cuisine");
            const cuisineDropdown = document.querySelector('.cuisine-dropdown-container');
            const sortByInput = document.getElementById("sortBy"); // Get sort by input
            const sortByDropdown = document.querySelector('.sort-by-dropdown-container'); // Get sort by dropdown

            // Close cuisine dropdown if click is outside
            if (cuisineInput && !cuisineInput.contains(event.target) &&
                cuisineDropdown && !cuisineDropdown.contains(event.target)) {
                setShowCuisineDropdown(false);
            }

            // Close sort by dropdown if click is outside
            if (sortByInput && !sortByInput.contains(event.target) &&
                sortByDropdown && !sortByDropdown.contains(event.target)) {
                setShowSortByDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // No dependencies needed if DOM elements are consistently present

    // Effect to load filters from localStorage
    useEffect(() => {
        console.log("Attempting to load filters from localStorage...")
        const savedFilters = localStorage.getItem("restaurantFilters")
        console.log("Raw data from localStorage:", savedFilters)
        if (savedFilters) {
            try {
                const parsedFilters = JSON.parse(savedFilters)
                console.log("Parsed filters from localStorage:", parsedFilters)
                setSearchText(parsedFilters.searchText || "")
                setMinRating(parseFloat(parsedFilters.minRating) || 0)
                setMaxMinOrderPrice(parsedFilters.maxMinOrderPrice || "")
                setCuisine(parsedFilters.cuisine || "")
                setSortBy(parsedFilters.sortBy || "")
                setSortDirection(parsedFilters.sortDirection || "ASC")
                setShowAdvancedFilters(parsedFilters.showAdvancedFilters || false)
                console.log("Filter states set from localStorage.")
            } catch (e) {
                console.error("Error parsing saved filters from localStorage. Removing item.", e)
                localStorage.removeItem("restaurantFilters")
            }
        } else {
            console.log("No filters found in localStorage.")
        }
    }, [])

    // Effect to save filters to localStorage
    useEffect(() => {
        const filtersToSave = {
            searchText,
            minRating,
            maxMinOrderPrice,
            cuisine,
            sortBy,
            sortDirection,
            showAdvancedFilters
        }
        console.log("Saving filters to localStorage:", filtersToSave)
        localStorage.setItem("restaurantFilters", JSON.stringify(filtersToSave))
    }, [searchText, minRating, maxMinOrderPrice, cuisine, sortBy, sortDirection, showAdvancedFilters])

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value)
        setCurrentPage(0)
    }

    const handleMinRatingChange = (e) => {
        setMinRating(Number.parseFloat(e.target.value))
        setCurrentPage(0)
    }

    const handleSwipe = () => {
        if (touchStartX !== null && touchEndX !== null) {
            const diff = touchStartX - touchEndX
            if (diff > 1000 && currentPage < totalPages - 1) {
                setCurrentPage((prev) => prev + 1)
            } else if (diff < -1000 && currentPage > 0) {
                setCurrentPage((prev) => prev - 1)
            }
        }
        setTouchStartX(null)
        setTouchEndX(null)
    }

    const filterGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.2rem',
        marginBottom: '0.4rem',
    }

    const filterInputStyle = {
        width: "100%",
        padding: "0.25rem",
        fontSize: "0.7rem",
        borderRadius: "6px",
        border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
        boxSizing: 'border-box'
    }

    const filterLabelStyle = {
        fontSize: '0.7rem',
        fontWeight: '500',
        color: darkMode ? '#ddd' : '#333',
        marginBottom: '0.1rem'
    }

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(prev => !prev)
    }

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
                color: darkMode ? "#fff" : "#000",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
           <Header darkMode={darkMode} setDarkMode={setDarkMode}></Header>


        


            {/* Location + Filter Section (horizontal layout) */}
            <div // PARENT CONTAINER (A)
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between", // MODIFIED: To space out logo, filter, and spacer
                    alignItems: "flex-start",
                    // gap: "3rem", // REMOVED: space-between will handle spacing. Add margin to filter if direct gap needed.
                    padding: "1.5rem 3rem",
                    backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
                    transition: "all 0.3s ease-in-out",
                    // This component would typically be inside a page wrapper that handles overall maxWidth and margin: 0 auto for page centering.
                }}
            >
                {/* Location Section - Stays on the Left */}
                <div style={{
                    display: "flex",
                    // gap: "1rem", // Removed, parent div (A) no longer uses gap directly for this type of layout.
                    alignItems: "center",
                    width: "180px", // Explicit width to match spacer. Adjust if logo size changes.
                    flexShrink: 0, // Prevent shrinking
                }}> {/* LOCATION (B) */}
                    <img src={doyLogo || "/placeholder.svg"} alt="logo"
                         style={{height: "180px", width: "180px", borderRadius: "50%", objectFit: "cover"}}/>
                    {/* Content intentionally kept minimal as per your last instruction */}
                </div>

                {/* Filter Section Wrapper (C) - Centered, Width Increased */}
                <div style={{
                    width: "600px", /* MODIFIED: Increased width */
                    minWidth: "300px",
                    boxSizing: "border-box",
                    // margin: "0 1.5rem" // Optional: if you want consistent space around the filter from logo and spacer
                    // This would be half of the original 3rem gap.
                }}>
                    {/* Filter Column (D) */}
                    <div
                        style={{
                            width: "100%",
                            flexShrink: 0,
                            position: "relative",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Filter Box (E) - Increased minHeight, sticky */}
                        <div
                            style={{
                                backgroundColor: darkMode ? "#2b2b2b" : "#FFFFFF",
                                padding: "0.8rem",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                position: "sticky",
                                top: "1rem",
                                minHeight: "150px", /* MODIFIED: Increased height */
                                width: "100%",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Search Text Input and its Dropdown */}
                            <div style={{position: "relative", marginBottom: "0.8rem"}}>
                                <div style={{position: "relative"}}>
                                    <label htmlFor="searchText" style={filterLabelStyle}>Restoran</label>
                                    <input id="searchText" type="text" placeholder="Restoran Ara" value={searchText}
                                           onChange={handleFilterChange(setSearchText)}
                                           style={{...filterInputStyle, paddingRight: "1.8rem"}}/>
                                    <FaSearch style={{
                                        position: "absolute",
                                        right: "6px",
                                        top: "calc(50% + 0.35rem)",
                                        color: darkMode ? "#aaa" : "#777",
                                        pointerEvents: "none",
                                        fontSize: "0.7rem"
                                    }}/>
                                </div>
                                {searchText && restaurants.length > 0 && (
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        width: "100%",
                                        backgroundColor: darkMode ? "#2b2b2b" : "#fff",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        padding: "0.3rem 0",
                                        zIndex: 20,
                                        maxHeight: "160px",
                                        overflowY: "auto",
                                        border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
                                        marginTop: "0.2rem"
                                    }}>
                                        {restaurants.slice(0, 5).map((r, index) => (
                                            <div key={r.id + "-search-dd"}
                                                 onClick={() => navigate(`/restaurant/${r.id}`, {
                                                     state: {
                                                         restaurant: r,
                                                         selectedAddress,
                                                         darkMode
                                                     }
                                                 })} style={{
                                                padding: "0.4rem 0.8rem",
                                                cursor: "pointer",
                                                borderBottom: index < restaurants.slice(0, 5).length - 1 ? `1px solid ${darkMode ? "#444" : "#eee"}` : "none",
                                                transition: "background 0.2s",
                                                textAlign: "left",
                                                color: darkMode ? "#eee" : "#333",
                                                fontSize: "0.7rem"
                                            }}
                                                 onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "#3b3b3b" : "#f5f5f5")}
                                                 onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                                {r.restaurantName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Toggle Button for Advanced Filters and its Dropdown */}
                            <div style={{position: "relative", marginBottom: "0.4rem"}}>
                                <button onClick={toggleAdvancedFilters} style={{
                                    background: darkMode ? "#444" : "#e0e0e0",
                                    color: darkMode ? "#fff" : "#333",
                                    border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    fontSize: "0.7rem",
                                    gap: "0.3rem"
                                }}>
                         <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                            <FaFilter size={10}/>
                             {showAdvancedFilters ? "Filtreleri Gizle" : "Filtreler"}
                        </span>
                                    {showAdvancedFilters ? (<FaChevronUp size={8}/>) : (<FaChevronDown size={8}/>)}
                                </button>
                                {showAdvancedFilters && (
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        right: "0",
                                        backgroundColor: darkMode ? "#2b2b2b" : "#FFFFFF",
                                        border: `1px dashed ${darkMode ? "#555" : "#ccc"}`,
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        zIndex: 10,
                                        padding: "0.6rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.4rem",
                                        animation: "fadeIn 0.5s ease-out",
                                        marginTop: "0.2rem"
                                    }}>
                                        <div style={filterGroupStyle}>
                                            <label htmlFor="city" style={filterLabelStyle}>Şehir</label>
                                            <select
                                                id="city"
                                                value={selectedCity}
                                                onChange={(e) => {
                                                    setSelectedCity(e.target.value);
                                                    setSelectedDistrict(""); // Reset district when city changes
                                                    setCurrentPage(0); // Reset page on filter change
                                                }}
                                                style={filterInputStyle}
                                            >
                                                <option value="">Şehir Seçiniz</option> {/* Default empty option */}
                                                {cities.map((cityOption) => (
                                                    <option key={cityOption} value={cityOption}>
                                                        {cityOption === "None" ? "Tüm Şehirler" : cityOption}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedCity && selectedCity !== "None" && districts.length > 0 && ( // Only show district dropdown if a city is selected
                                            <div style={filterGroupStyle}>
                                                <label htmlFor="district" style={filterLabelStyle}>İlçe</label>
                                                <select
                                                    id="district"
                                                    value={selectedDistrict}
                                                    onChange={(e) => {
                                                        setSelectedDistrict(e.target.value);
                                                        setCurrentPage(0); // Reset page on filter change
                                                    }}
                                                    style={filterInputStyle}
                                                >
                                                    <option value="">İlçe Seçiniz</option> {/* Default empty option */}
                                                    {districts.map((districtOption) => (
                                                        <option key={districtOption} value={districtOption}>
                                                            {districtOption === "None" ? "Tüm İlçeler" : districtOption}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <style>{`@keyframes fadeIn {from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }}`}</style>
                                        <div style={filterGroupStyle}>
                                            <label htmlFor="minRating" style={filterLabelStyle}>Min. Puan
                                                ({minRating.toFixed(1)})</label>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.3rem",
                                                width: "100%"
                                            }}>
                                                <input id="minRating" type="range" min="0" max="5" step="0.1"
                                                       value={minRating} onChange={handleMinRatingChange} style={{
                                                    width: "60%",
                                                    accentColor: darkMode ? "#FFD700" : "#47300A",
                                                    cursor: "pointer"
                                                }}/>
                                                <span style={{
                                                    color: darkMode ? "#FFD700" : "#47300A",
                                                    minWidth: "70px",
                                                    fontSize: "0.6rem"
                                                }}>{renderStars(minRating)}</span>
                                            </div>
                                        </div>
                                        <div style={filterGroupStyle}><label htmlFor="maxMinOrderPrice"
                                                                             style={filterLabelStyle}>Min. Sipariş
                                            (₺)</label><input id="maxMinOrderPrice" type="number" placeholder="Örn: 50"
                                                              value={maxMinOrderPrice}
                                                              onChange={handleFilterChange(setMaxMinOrderPrice)}
                                                              style={filterInputStyle} min="0"/></div>
                                        <div style={filterGroupStyle}>
                                            <label htmlFor="cuisine" style={filterLabelStyle}>Mutfak</label>
                                            <div style={{position: "relative", width: "100%"}}>
                                                <input
                                                    id="cuisine"
                                                    type="text"
                                                    placeholder="Örn: Kebap"
                                                    value={cuisine}
                                                    onChange={handleFilterChange(setCuisine)}
                                                    style={filterInputStyle}
                                                    onFocus={() => setShowCuisineDropdown(true)}
                                                    readOnly
                                                />
                                                {showCuisineDropdown && cuisineTypes.length > 0 && (
                                                    <div
                                                        className="cuisine-dropdown-container" // Added class for click outside
                                                        style={{
                                                            position: "absolute",
                                                            top: "100%",
                                                            left: "0",
                                                            width: "100%",
                                                            backgroundColor: darkMode ? "#2b2b2b" : "#fff",
                                                            borderRadius: "8px",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            zIndex: 20,
                                                            maxHeight: "150px",
                                                            overflowY: "auto",
                                                            border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
                                                            marginTop: "0.2rem",
                                                        }}>
                                                        {cuisineTypes.map((type, index) => (
                                                            <div
                                                                key={type}
                                                                onClick={() => {
                                                                    // If "None" is selected, set cuisine to an empty string
                                                                    setCuisine(type === "None" ? "" : type); // MODIFIED LINE
                                                                    setShowCuisineDropdown(false);
                                                                    setCurrentPage(0);
                                                                }}
                                                                style={{
                                                                    padding: "0.4rem 0.8rem", // Existing padding. The 0.8rem is already some horizontal padding.
                                                                    paddingLeft: "1.2rem", // ADD OR ADJUST THIS LINE TO MOVE RIGHT
                                                                    cursor: "pointer",
                                                                    borderBottom: index < cuisineTypes.length - 1 ? `1px solid ${darkMode ? "#444" : "#eee"}` : "none",
                                                                    transition: "background 0.2s",
                                                                    textAlign: "left",
                                                                    color: darkMode ? "#eee" : "#333",
                                                                    fontSize: "0.7rem"
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "#3b3b3b" : "#f5f5f5")}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                            >
                                                                {type}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={filterGroupStyle}>
                                            <label htmlFor="sortBy" style={filterLabelStyle}>Sırala</label>
                                            <div style={{
                                                position: "relative",
                                                width: "100%"
                                            }}> {/* Wrapper for dropdown positioning */}
                                                <input
                                                    id="sortBy"
                                                    type="text"
                                                    placeholder="Seçiniz..."
                                                    value={Object.keys(sortMap).find(key => sortMap[key] === sortBy) || ""} // Display user-friendly key
                                                    onChange={handleFilterChange(setSortBy)} // Keep onChange for programmatic updates
                                                    style={filterInputStyle}
                                                    onFocus={() => setShowSortByDropdown(true)} // Open dropdown on focus
                                                    readOnly // Make it read-only
                                                />
                                                {showSortByDropdown && (
                                                    <div
                                                        className="sort-by-dropdown-container" // Add a class for click outside logic
                                                        style={{
                                                            position: "absolute",
                                                            top: "100%",
                                                            left: "0",
                                                            width: "100%",
                                                            backgroundColor: darkMode ? "#2b2b2b" : "#fff",
                                                            borderRadius: "8px",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            zIndex: 20,
                                                            maxHeight: "150px",
                                                            overflowY: "auto",
                                                            border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
                                                            marginTop: "0.2rem",
                                                            fontSize: "0.7rem", // Ensure consistent font size
                                                        }}
                                                    >
                                                        {Object.keys(sortMap).map((key, index) => (
                                                            <div
                                                                key={key}
                                                                onClick={() => {
                                                                    setSortBy(sortMap[key]); // Set the actual value (e.g., "minOrderPrice")
                                                                    setShowSortByDropdown(false);
                                                                    setCurrentPage(0); // Reset page on filter change
                                                                }}
                                                                style={{
                                                                    padding: "0.4rem 0.8rem",
                                                                    paddingLeft: "1.2rem", // Consistent padding with cuisine dropdown
                                                                    cursor: "pointer",
                                                                    borderBottom: index < Object.keys(sortMap).length - 1 ? `1px solid ${darkMode ? "#444" : "#eee"}` : "none",
                                                                    transition: "background 0.2s",
                                                                    textAlign: "left",
                                                                    color: darkMode ? "#eee" : "#333",
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "#3b3b3b" : "#f5f5f5")}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                            >
                                                                {key} {/* Display the user-friendly key */}
                                                            </div>
                                                        ))}
                                                        {/* Option to clear sort filter, similar to "None" for cuisine */}
                                                        <div
                                                            onClick={() => {
                                                                setSortBy(""); // Clear the sort
                                                                setShowSortByDropdown(false);
                                                                setCurrentPage(0);
                                                            }}
                                                            style={{
                                                                padding: "0.4rem 0.8rem",
                                                                paddingLeft: "1.2rem",
                                                                cursor: "pointer",
                                                                transition: "background 0.2s",
                                                                textAlign: "left",
                                                                color: darkMode ? "#eee" : "#333",
                                                                borderTop: `1px solid ${darkMode ? "#444" : "#ddd"}`, // Separator
                                                            }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "#3b3b3b" : "#f5f5f5")}
                                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                        >
                                                            Hiçbiri (Sıralamayı Kaldır)
                                                        </div>
                                                    </div>

                                                )}
                                            </div>
                                        </div>
                                        <div style={filterGroupStyle}>
                                            <label htmlFor="sortDirection" style={filterLabelStyle}>Yön</label>
                                            <select
                                                id="sortDirection"
                                                value={sortDirection}
                                                onChange={handleFilterChange(setSortDirection)}
                                                style={filterInputStyle}
                                            >
                                                <option value="ASC">Artan</option>
                                                <option value="DESC">Azalan</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Invisible Spacer (D1) - Balances the Location Section for centering Filter */}
                <div style={{
                    width: "180px", // Should match the width of the Location Section (B)
                    flexShrink: 0, // Prevent shrinking
                    visibility: "hidden" // Takes up space but isn't visible
                }}>
                    {/* Content can be empty or a placeholder with same dimensions as logo if needed */}
                </div>
            </div>

            {/* Main Content: Restaurant List and Filters */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "2rem",
                    gap: "2.5rem",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                {/* REMOVE THE OLD GLOBAL PAGINATION CONTROLS (FaArrowLeft, FaArrowRight, currentPage/totalPages) HERE */}
                {/* <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
        }}
    >
        <h2 style={{margin: 0, fontSize: "1.5rem", textAlign: "center"}}>
            Sizin için önerilen restoranlar
        </h2>
        {totalPages > 0 && ( // This whole block can be removed
            // ... global pagination buttons ...
        )}
    </div> */}

                {Object.keys(groupedRestaurants).length > 0 ? (
                    Object.entries(groupedRestaurants).map(([cuisineType, restaurantList]) => {
                        const currentPageForCuisine = cuisineCurrentPages[cuisineType] || 0; // Default to 0
                        const totalPagesForCuisine = Math.ceil(restaurantList.length / restaurantsPerPage);
                        const startIndex = currentPageForCuisine * restaurantsPerPage;
                        const endIndex = startIndex + restaurantsPerPage;
                        const restaurantsToDisplay = restaurantList.slice(startIndex, endIndex);

                        const handlePrevClick = () => {
                            setCuisineCurrentPages(prev => ({
                                ...prev,
                                [cuisineType]: Math.max(prev[cuisineType] - 1, 0)
                            }));
                        };

                        const handleNextClick = () => {
                            setCuisineCurrentPages(prev => ({
                                ...prev,
                                [cuisineType]: Math.min(prev[cuisineType] + 1, totalPagesForCuisine - 1)
                            }));
                        };

                        return (
                            <div key={cuisineType} style={{marginBottom: "2rem"}}>
                                <h3 style={{
                                    fontSize: "1.2rem",
                                    color: darkMode ? "#eee" : "#333",
                                    marginBottom: "1rem",
                                    textAlign: "left",
                                    paddingLeft: "1rem",
                                    borderBottom: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                                    paddingBottom: '0.5rem',
                                    display: 'flex', // Use flex for title and pagination controls
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <span>{cuisineType} Mutfakları</span>
                                    {/* PAGINATION CONTROLS FOR THIS CUISINE */}
                                    {totalPagesForCuisine > 1 && (
                                        <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                                            <button
                                                onClick={handlePrevClick}
                                                disabled={currentPageForCuisine === 0}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: `1px solid ${darkMode ? "#fff" : "#000"}`,
                                                    borderRadius: "50%",
                                                    padding: "0.4rem",
                                                    cursor: currentPageForCuisine === 0 ? "not-allowed" : "pointer",
                                                    opacity: currentPageForCuisine === 0 ? 0.3 : 1,
                                                    transition: "all 0.3s ease",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "0.6rem", // Smaller icons for per-row pagination
                                                    minWidth: "24px",
                                                    minHeight: "24px",
                                                }}
                                            >
                                                <FaArrowLeft color={darkMode ? "#fff" : "#000"} size={10}/>
                                            </button>
                                            <span style={{color: darkMode ? "#fff" : "#000", fontSize: "0.8rem"}}>
                                    {currentPageForCuisine + 1} / {totalPagesForCuisine}
                                </span>
                                            <button
                                                onClick={handleNextClick}
                                                disabled={currentPageForCuisine >= totalPagesForCuisine - 1}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: `1px solid ${darkMode ? "#fff" : "#000"}`,
                                                    borderRadius: "50%",
                                                    padding: "0.4rem",
                                                    cursor: currentPageForCuisine >= totalPagesForCuisine - 1 ? "not-allowed" : "pointer",
                                                    opacity: currentPageForCuisine >= totalPagesForCuisine - 1 ? 0.3 : 1,
                                                    transition: "all 0.3s ease",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "0.6rem", // Smaller icons for per-row pagination
                                                    minWidth: "24px",
                                                    minHeight: "24px",
                                                }}
                                            >
                                                <FaArrowRight color={darkMode ? "#fff" : "#000"} size={10}/>
                                            </button>
                                        </div>
                                    )}
                                </h3>
                                <div
                                    style={{
                                        backgroundColor: darkMode ? "#2b2b2b" : "#FFFFFF",
                                        padding: "1.5rem",
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "all 0.3s ease-in-out",
                                        display: "flex",
                                        overflowX: "hidden", // Hide native scrollbar if you style it
                                        gap: "1rem",
                                        paddingBottom: "1.5rem",
                                        WebkitOverflowScrolling: "touch",
                                        // scrollbarWidth: "none", // Hide for Firefox
                                        // msOverflowStyle: "none", // Hide for IE/Edge
                                        // You might need a custom scrollbar component for a fully styled and hidden one.
                                    }}
                                >
                                    {restaurantsToDisplay.map((res) => ( // Use restaurantsToDisplay here
                                        <div
                                            key={res.id}
                                            style={{
                                                backgroundColor: darkMode ? "#3b3b3b" : "#ffffff",
                                                padding: "1rem",
                                                borderRadius: "15px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                boxShadow: "0 0 8px rgba(0,0,0,0.05)",
                                                transition: "all 0.3s ease-in-out",
                                                minWidth: "220px",
                                                flexShrink: 0,
                                                maxWidth: "250px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                navigate(`/restaurant/${res.id}`, {
                                                    state: {restaurant: res, selectedAddress, darkMode},
                                                })
                                            }
                                        >
                                            <img
                                                src={res.image}
                                                alt={res.restaurantName}
                                                style={{
                                                    width: "100%",
                                                    height: "120px",
                                                    borderRadius: "10px",
                                                    objectFit: "cover",
                                                    marginBottom: "0.8rem",
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = "/placeholder.svg?text=Error"
                                                }}
                                            />
                                            <h3 style={{
                                                margin: "0 0 0.5rem 0",
                                                fontSize: "1rem",
                                                textAlign: "center",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: "100%",
                                            }}>
                                                {res.restaurantName}
                                            </h3>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                marginBottom: "0.5rem"
                                            }}>
                                                {renderStars(res.rating)}
                                            </div>
                                            <p style={{
                                                fontSize: "0.8rem",
                                                color: darkMode ? "#ccc" : "#666",
                                                margin: "0",
                                                textAlign: "center"
                                            }}>
                                                Min. Sipariş: ₺{res.minOrderPrice?.toFixed(2) || 'N/A'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p style={{textAlign: "center", marginTop: "2rem", fontWeight: "bold"}}>
                        {(searchText || minRating > 0 || maxMinOrderPrice || cuisine || sortBy)
                            ? "Aramanızla eşleşen restoran bulunamadı."
                            : "Gösterilecek restoran bulunamadı."}
                    </p>
                )}
            </div>
            <Footer darkMode={darkMode}/>

            {modalOpen && (
                <LocationModal
                    onClose={() => setModalOpen(false)}
                    onLocationSelect={(addr) => {
                        setSelectedAddress(addr)
                        setModalOpen(false)
                    }}
                    darkMode={darkMode}
                />
            )}
        </div>
    )
}

export default Home