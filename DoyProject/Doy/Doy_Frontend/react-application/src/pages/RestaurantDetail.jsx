import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";        // Assuming path is correct
import CartSummary from "../components/CartSummary";      // Assuming path is correct
import { FaStar, FaRegStar } from "react-icons/fa";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { BsMoon } from "react-icons/bs";
import doyLogo from "../assets/doylogo.jpeg";               // Assuming path is correct
import { FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import axios from "axios";

// Helper function to render star ratings
const renderStars = (rating) => {
    const numericRating = typeof rating === 'number' ? rating : 0;
    const full = Math.floor(numericRating);
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`fs-${i}`} color="#ffcc00" />); // Unique keys
    while (stars.length < 5) stars.push(<FaRegStar key={`es-${stars.length}`} color="#ccc" />); // Unique keys
    return stars;
};

// Style for footer icons
const iconLinkStyle = (darkMode) => ({
    color: darkMode ? "#ccc" : "#555",
    textDecoration: "none",
    padding: "0.4rem",
    borderRadius: "50%",
    transition: "transform 0.3s",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
});

const RestaurantDetail = () => {
    // --- State ---
    const [cart, setCart] = useState([]); // Local frontend cart state
    const location = useLocation();
    const navigate = useNavigate();
    const { id: restaurantIdParam } = useParams(); // Get restaurant ID string from URL
    const [currentRestaurantId, setCurrentRestaurantId] = useState(null); // Parsed ID state

    const [restaurant, setRestaurant] = useState(null); // Restaurant details
    const [menu, setMenu] = useState({ categories: [] }); // Menu structure
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [loadingRestaurant, setLoadingRestaurant] = useState(true);
    const [loadingCart, setLoadingCart] = useState(true); // <<-- ADDED Cart loading state

    // Category mapping (remains same)
    const categoryMap = new Map([
        ["COMBO", 0], ["MAIN_DISH", 1], ["DRINK", 2], ["EXTRA", 3]
    ]);

    const [darkMode, setDarkMode] = useState(location.state?.darkMode || false);
    const selectedAddress = location.state?.selectedAddress;

    // --- Effects ---

    // Effect to parse and validate restaurant ID from URL param
    useEffect(() => {
        let parsedId = null;
        if (restaurantIdParam) {
            parsedId = parseInt(restaurantIdParam, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                console.error(`Invalid restaurantIdParam from URL: ${restaurantIdParam}`);
                parsedId = null; // Treat invalid as null
            }
        }
        setCurrentRestaurantId(parsedId);
        console.log(`Parsed currentRestaurantId: ${parsedId}`);
    }, [restaurantIdParam]);


    // Effect to fetch restaurant details (Kept as provided by user)
    useEffect(() => {
        const getRestaurant = async () => {
            // Use the parsed state ID
            if (!currentRestaurantId) {
                setLoadingRestaurant(false); // Stop loading if no valid ID
                setRestaurant(null); // Ensure null if ID invalid
                return;
            }
            setLoadingRestaurant(true);
            setRestaurant(null); // Reset
            try {
                // Use the exact endpoint structure from user's code
                const response = await axios.get(`http://localhost:8080/api/restaurant/get/${currentRestaurantId}`);
                setRestaurant(response.data);
            } catch (error) {
                console.error("Error fetching restaurant details:", error);
                setRestaurant(null); // Reset on error
            } finally {
                setLoadingRestaurant(false);
            }
        };
        // Only run if currentRestaurantId has a valid value
        if (currentRestaurantId !== null) {
            getRestaurant();
        } else {
            setLoadingRestaurant(false); // Ensure loading stops if ID was initially invalid
            setRestaurant(null);
        }
    }, [currentRestaurantId]); // Depend on the parsed state variable

    // Effect to fetch menu items (Kept as provided by user)
    useEffect(() => {
        const getRestaurantMenus = async () => {
            // Use the parsed state ID
            if (!currentRestaurantId) {
                setLoadingMenu(false);
                setMenu({ categories: [] });
                return;
            }
            setLoadingMenu(true);
            setMenu({ categories: [] }); // Reset
            try {
                // Use the exact endpoint structure from user's code
                const response = await axios.get(`http://localhost:8080/api/item/get-items/${currentRestaurantId}`);
                const responseItems = response.data || [];

                let itemData = [ { title: "Menüler", items: [] }, { title: "Yiyecek Seçenekleri", items: [] }, { title: "İçecek Seçenekleri", items: [] }, { title: "Ek Seçenekleri", items: [] } ];

                responseItems.forEach(item => {
                    if (!item || typeof item.menuItemType === 'undefined' || item.id === undefined) { console.warn('Skipping invalid item data:', item); return; }
                    const categoryIndex = categoryMap.get(item.menuItemType);
                    if (categoryIndex !== undefined && itemData[categoryIndex]) {
                        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
                        itemData[categoryIndex].items.push({ id: item.id, name: item.name || "İsimsiz Ürün", description: item.description || "", price: isNaN(price) ? 0 : price, });
                    } else { console.warn(`Unknown menu item type: ${item.menuItemType} for item ID: ${item.id}`); }
                });
                setMenu({ categories: itemData });
            } catch (error) {
                console.error("Error fetching restaurant menu:", error);
                setMenu({ categories: [] }); // Reset on error
            } finally {
                setLoadingMenu(false);
            }
        };
        // Only run if currentRestaurantId has a valid value
        if (currentRestaurantId !== null) {
            getRestaurantMenus();
        } else {
            setLoadingMenu(false); // Ensure loading stops if ID was initially invalid
            setMenu({ categories: [] });
        }
    }, [currentRestaurantId]); // Depend on the parsed state variable


    // --- ADDED: Effect to load USER's cart and check restaurant match ---
    useEffect(() => {
        const fetchUserCart = async () => {
            // Don't fetch if the current restaurant ID isn't valid yet
            if (currentRestaurantId === null) {
                console.log("Skipping user cart fetch: Invalid currentRestaurantId.");
                setCart([]);
                setLoadingCart(false); // Stop loading if ID is invalid
                return;
            }

            console.log("Fetching user's cart from /order/cart...");
            setLoadingCart(true);
            setCart([]); // Clear local cart while fetching

            try {
                // *** Ensure Axios sends authentication (e.g., JWT token via interceptors) ***
                const response = await axios.get(`http://localhost:8080/order/cart`); // Your single endpoint
                const userCartDto = response.data; // Expecting UserCartDTO format defined before

                console.log("Received UserCartDTO:", userCartDto);

                // Check if the fetched cart belongs to the CURRENT restaurant being viewed
                if (userCartDto && userCartDto.restaurantId === currentRestaurantId) {
                    console.log(`Cart matches current restaurant (${currentRestaurantId}). Populating frontend cart.`);

                    // --- Process UserCartDTO ---
                    const formattedCartItems = [];
                    if (Array.isArray(userCartDto.items)) {
                        userCartDto.items.forEach(itemInfo => { // itemInfo is UserCartDTO.ItemInfo
                            if (itemInfo && typeof itemInfo.quantity === 'number' && itemInfo.quantity > 0 && itemInfo.menuItemId != null) {
                                for (let i = 0; i < itemInfo.quantity; i++) {
                                    const price = typeof itemInfo.price === 'number' ? itemInfo.price : parseFloat(itemInfo.price || 0);
                                    formattedCartItems.push({
                                        id: itemInfo.menuItemId, // Use menuItemId from DTO
                                        name: itemInfo.name || "İsimsiz Ürün",
                                        price: isNaN(price) ? 0 : price,
                                        description: itemInfo.description || "",
                                        // image: itemInfo.imageUrl // If available in DTO
                                    });
                                }
                            }
                        });
                    }
                    setCart(formattedCartItems);
                    console.log("Frontend cart populated:", formattedCartItems);
                    // --- End Processing ---

                } else {
                    // Cart doesn't match or doesn't exist
                    if (userCartDto && userCartDto.restaurantId) {
                        console.log(`User cart is for restaurant ${userCartDto.restaurantId}, not the current one (${currentRestaurantId}). Keeping cart empty.`);
                    } else {
                        console.log("User has no active cart or cart is not linked to any restaurant. Keeping cart empty.");
                    }
                    setCart([]); // Ensure local cart is empty if no match
                }
            } catch (error) {
                console.error("Error fetching user cart:", error);
                if (error.response?.status === 401) { console.error("Unauthorized: Cannot fetch user cart."); /* Handle */ }
                setCart([]); // Reset cart on error
            } finally {
                setLoadingCart(false); // Stop cart loading indicator
            }
        };

        fetchUserCart();

        // Re-run this effect if the restaurant ID from the URL changes
    }, [currentRestaurantId]);
    // --- END ADDED Effect ---


    // --- Event Handlers (Kept as provided by user) ---

    // Handler to add item to cart via API
    const handleAddToCart = async (item) => {
        if (!item || item.id === undefined) {
            console.error("Attempted to add invalid item:", item);
            alert("Bu öğe sepete eklenemedi (geçersiz ürün).");
            return;
        }
        console.log("Attempting to add item:", item); // Calls user's existing endpoint
        try {
            // *** This uses the endpoint structure from YOUR provided code ***
            const url = `http://localhost:8080/order/add?itemId=${item.id}`;
            const response = await axios.get(url); // Assumes GET is correct for your endpoint

            if (response.data === true) {
                // NOTE: This simple update might cause inconsistencies if multiple
                // users modify the same backend cart. Re-fetching after add is safer.
                setCart(prevCart => [...prevCart, item]);
                console.log("Item added to cart state (optimistic):", item.id);
            } else {
                console.warn("Backend did not approve adding the item:", item.id);
                alert(`${item.name} şu anda sepete eklenemiyor (backend).`);
            }
        } catch (error) {
            console.error("Error adding item ID via API:", item.id, error);
            alert("Sepete eklerken bir sunucu hatası oluştu.");
        }
    };

    // Handler to remove item from cart via API
    const handleRemoveFromCart = async (itemIdToRemove) => {
        if (itemIdToRemove === undefined) {
            console.error("Attempted to remove item with invalid ID.");
            return;
        }
        console.log("Attempting to remove item ID:", itemIdToRemove); // Calls user's existing endpoint
        try {
            // *** This uses the endpoint structure from YOUR provided code ***
            const url = `http://localhost:8080/order/remove?itemId=${itemIdToRemove}`;
            const response = await axios.get(url); // Assumes GET is correct for your endpoint

            if (response.data === true) {
                // NOTE: This simple update might cause inconsistencies. Re-fetching is safer.
                setCart(prevCart => {
                    const itemIndex = prevCart.findIndex(cartItem => cartItem.id === itemIdToRemove);
                    if (itemIndex > -1) {
                        console.log("Removing item from cart state (optimistic):", itemIdToRemove);
                        return [
                            ...prevCart.slice(0, itemIndex),
                            ...prevCart.slice(itemIndex + 1)
                        ];
                    }
                    return prevCart;
                });
            } else {
                console.warn("Backend did not approve removing the item ID:", itemIdToRemove);
                alert("Bu öğe sepetten çıkarılamadı (backend).");
            }
        } catch (error) {
            console.error("Error removing item ID via API:", itemIdToRemove, error);
            alert("Sepetten çıkarırken bir sunucu hatası oluştu.");
        }
    };

    // Handler to confirm order via API and proceed to cart page
    const handleConfirm = async () => { // Calls user's existing endpoint
        if (cart.length === 0) {
            alert("Devam etmek için sepetinize ürün eklemelisiniz.");
            return;
        }
        console.log("Confirming order via API...");
        try {
            // *** This uses the endpoint structure from YOUR provided code ***
            const response = await axios.get('http://localhost:8080/order/confirm');

            console.log("Order confirmation response:", response.data);
            if (response.data === true) {
                console.log("Order confirmed by backend. Navigating to /cart page...");
                navigate("/cart", {
                    state: { cartItems: cart, restaurant, selectedAddress, darkMode }
                });
            } else {
                console.warn("Backend confirmation failed.");
                alert("Siparişiniz onaylanamadı.");
            }
        } catch (error) {
            console.error("Error during order confirmation API call:", error);
            alert("Sipariş onaylanırken bir hata oluştu.");
        }
    };

    // --- Render Logic ---
    // Includes loadingCart now
    if (loadingRestaurant || loadingMenu || loadingCart) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6", color: darkMode ? "#fff" : "#000" }}>Yükleniyor...</div>;
    }

    // Updated checks for invalid ID or missing restaurant *after* loading
    if (currentRestaurantId === null) {
        return <div style={{ padding: "2rem", textAlign: "center", color: darkMode ? '#fff' : '#000' }}>Geçersiz Restoran ID.</div>;
    }
    if (!restaurant) {
        // This message now appears if fetching failed after loading finished for a valid ID
        return <div style={{ padding: "2rem", textAlign: "center", color: darkMode ? '#fff' : '#000' }}>Restoran bulunamadı (ID: {currentRestaurantId}).</div>;
    }

    // --- JSX Structure (Remains the same) ---
    return (
        <div style={{ backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6", color: darkMode ? "#fff" : "#000", minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
            {/* ... Top Bar ... */}
            <div style={{ backgroundColor: darkMode ? "#333" : "#47300A", padding: "0.6rem 1.5rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }} onClick={() => navigate('/')}>Doy!</div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div onClick={() => setDarkMode(!darkMode)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                        <div style={{ width: "34px", height: "18px", borderRadius: "20px", backgroundColor: "#F8F5DE", position: "relative" }}>
                            <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#000", position: "absolute", top: "1px", left: darkMode ? "17px" : "1px", transition: "left 0.3s" }} />
                        </div>
                        <BsMoon color={darkMode ? "#ccc" : "#fff"} size={18} />
                    </div>
                    <div style={{ display: "flex", backgroundColor: "#F8F5DE", borderRadius: "10px", overflow: "hidden" }}>
                        <button onClick={() => navigate("/register")} style={{ padding: "0.3rem 0.8rem", backgroundColor: "transparent", color: "#47300A", fontWeight: "bold", border: "none", borderRight: "1px solid #ccc", cursor: "pointer" }}>KAYIT</button>
                        <button onClick={() => navigate("/login")} style={{ padding: "0.3rem 0.8rem", backgroundColor: "transparent", color: "#47300A", fontWeight: "bold", border: "none", cursor: "pointer" }}>GİRİŞ</button>
                    </div>
                </div>
            </div>
            {/* ... Logo Bar ... */}
            <div style={{ backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB", padding: "1rem 3rem", display: "flex", alignItems: "center", justifyContent: "flex-start", flexShrink: 0 }}>
                <img src={doyLogo} alt="doylogo" style={{ height: "100px", borderRadius: "50%" }} />
                <h1 style={{marginLeft: '2rem', color: darkMode ? '#eee': '#47300A'}}>{restaurant.restaurantName || "Restoran"}</h1>
            </div>
            {/* ... Divider ... */}
            <div style={{ height: "2px", backgroundColor: "#47300A", width: "100%", flexShrink: 0 }} />


            {/* ... Main Content Area ... */}
            <div style={{ padding: "2rem", flexGrow: 1 }}>
                {/* Restaurant Info & Cart Summary Row */}
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem", gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Left Side: Restaurant Details */}
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexGrow: 1, minWidth: '300px' }}>
                        {restaurant.imageUrl ? (<img src={restaurant.imageUrl} alt={restaurant.restaurantName} style={{ width: "160px", height: "160px", borderRadius: "16px", objectFit: "cover", flexShrink: 0 }}/>)
                            : (<div style={{ width: "160px", height: "160px", borderRadius: "16px", backgroundColor: darkMode ? '#555' : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkMode ? '#aaa' : '#555', fontSize: '0.9rem', textAlign: 'center', flexShrink: 0 }}>Resim Yok</div>)}
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>{renderStars(restaurant.rating)} {typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : 'N/A'}/5</div>
                            <p style={{ margin: '0.5rem 0', color: darkMode ? '#ccc' : '#333' }}>{restaurant.description || "Açıklama bulunamadı."}</p>
                            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: darkMode ? '#bbb' : '#555' }}>
                                {restaurant.time ? `Teslimat: ~${restaurant.time} dk` : ""} {restaurant.time && restaurant.minPrice ? " | " : ""} {restaurant.minPrice ? `Min. Sepet: ₺${restaurant.minPrice}` : ""}
                            </p>
                        </div>
                    </div>
                    {/* Right Side: Cart Summary */}
                    <div style={{ minWidth: '280px', flexShrink: 0, flexBasis: '300px' }}>
                        {/* CartSummary now displays the 'cart' state potentially populated by the new useEffect */}
                        <CartSummary cart={cart} onConfirm={handleConfirm} onRemove={handleRemoveFromCart} darkMode={darkMode} />
                    </div>
                </div>
                {/* Menu Sections */}
                {loadingMenu ? (<div style={{ textAlign: 'center', padding: '2rem' }}>Menü yükleniyor...</div>)
                    : menu.categories.length > 0 ? ( menu.categories.map((category, i) => ( category.items.length > 0 && (
                            <div key={`cat-${i}-${currentRestaurantId}`} style={{ marginBottom: "3rem" }}>
                                <h3 style={{ marginBottom: "1.5rem", color: darkMode ? "#fff" : "#000", borderBottom: `2px solid ${darkMode ? '#555' : '#ccc'}`, paddingBottom: '0.5rem' }}>{category.title}</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                    {category.items.map((item) => (<ProductCard key={item.id} item={item} onAdd={handleAddToCart} darkMode={darkMode} />))}
                                </div>
                            </div>
                        )))
                    ) : ( <div style={{ textAlign: 'center', padding: '2rem' }}>Menü bilgisi bulunamadı.</div> )}
            </div>
            {/* ... Footer ... */}
            <footer style={{ marginTop: "auto", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: darkMode ? "#1a1a1a" : "#ffffff", borderTop: `1px solid ${darkMode ? '#444':'#ddd'}`, flexShrink: 0 }}>
                <img src={doyLogo} alt="Logo alt" style={{ height: "50px", width: "50px", borderRadius: "50%", objectFit: "cover" }} />
                <div style={{ display: "flex", gap: "1rem" }}>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaXTwitter size={20} /></a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaInstagram size={20} /></a> <a href="https://googleusercontent.com/youtube.com/3" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaYoutube size={20} /></a> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle(darkMode)}><FaLinkedin size={20} /></a>
                </div>
            </footer>
        </div>
    );
};

export default RestaurantDetail;