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
        const fetchCart = async () => {
            try {
                const response = await axios.get("http://localhost:8080/order/cart");
                setCart(response.data.items || []);
                setRestaurantInfo(response.data.restaurant || null);
            } catch (err) {
                console.error("Cart fetch failed:", err);
            }
        };

        fetchCart();
    }, []);


    const addToCart = async (item) => {
        if (!restaurantInfo || restaurantInfo.id === item.restaurantId) {
            try {
                const res = await axios.post(`http://localhost:8080/order/add?itemId=${item.id}`);
                if (res.data === true) {
                    const cartRes = await axios.get("http://localhost:8080/order/cart");
                    setCart(cartRes.data.items || []);
                    setRestaurantInfo({id: cartRes.data.restaurant.id || null,
                                             name: cartRes.data.restaurant.restaurantName || null,});
                    toast.success("Ürün sepete eklendi");
                }
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
            const res = await axios.delete(`http://localhost:8080/order/remove?itemId=${itemId}`);

            if (res.data === true) {
                const cartRes = await axios.get("http://localhost:8080/order/cart");
                const updatedCart = cartRes.data.items || [];
                setCart(updatedCart);

                if (updatedCart.length === 0) {
                    setRestaurantInfo(null);
                }
                toast.info("Ürün sepetten çıkarıldı");
            }

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
