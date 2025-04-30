import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [restaurantInfo, setRestaurantInfo] = useState(null);

    const addToCart = (item) => {
        if (!restaurantInfo || restaurantInfo.id === item.restaurantId) {
            setCart((prev) => [...prev, item]);
            setRestaurantInfo({
                id: item.restaurantId,
                name: item.restaurantName  // bunu ProductCard'dan geçir
            });
        } else {
            toast.error("Sepette zaten başka bir restorandan ürün var. Lütfen önce sepeti temizleyin.");
        }
    };

    const removeFromCart = (index) => {
        setCart((prev) => {
            const updatedCart = prev.filter((_, i) => i !== index);
            if (updatedCart.length === 0) {
                setRestaurantInfo(null); // ürün kalmayınca restoranı sıfırla
            }
            return updatedCart;
        });
    };


    const clearCart = () => {
        setCart([]);
        setRestaurantInfo(null);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            restaurantInfo
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
