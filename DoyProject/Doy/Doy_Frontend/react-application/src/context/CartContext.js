import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [restaurantInfo, setRestaurantInfo] = useState(null);

    // Kullanıcı girdiğinde cart'ı backend'den çek
    useEffect(() => {
        axios.get("/api/cart")
            .then(res => {
                setCart(res.data.items || []);
                setRestaurantInfo(res.data.restaurant || null);
            })
            .catch(err => {
                console.error("Cart fetch failed:", err);
            });
    }, []);

    const addToCart = async (item) => {
        if (!restaurantInfo || restaurantInfo.id === item.restaurantId) {
            try {
                const res = await axios.post("/api/cart", item);
                setCart(res.data.items);
                setRestaurantInfo({
                    id: item.restaurantId,
                    name: item.restaurantName,
                });
                toast.success("Ürün sepete eklendi");
            } catch (err) {
                console.error("Add to cart failed:", err);
                toast.error("Sepete eklenemedi");
            }
        } else {
            toast.error("Sepette başka bir restorandan ürün var. Önce sepeti boşalt.");
        }
    };

    const removeFromCart = async (itemId) => {
        const itemToRemove = cart.find(item => item.id === itemId);
        if (!itemToRemove) return;

        try {
            const res = await axios.delete(`/api/cart/${itemId}`);
            const updatedCart = res.data.items || [];

            setCart(updatedCart);

            // Eğer artık hiç ürün kalmadıysa, restaurantInfo'yu da temizle
            if (updatedCart.length === 0) {
                setRestaurantInfo(null);
            }

            toast.info("Ürün sepetten çıkarıldı");
        } catch (err) {
            console.error("Remove failed:", err);
            toast.error("Ürün çıkarılamadı");
        }
    };



    const clearCart = async () => {
        try {
            await axios.delete("/api/cart");
            setCart([]);
            setRestaurantInfo(null);
            toast.info("Sepet temizlendi");
        } catch (err) {
            console.error("Clear failed:", err);
            toast.error("Sepet temizlenemedi");
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            addToCart,
            removeFromCart,
            clearCart,
            restaurantInfo,
            setRestaurantInfo
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
