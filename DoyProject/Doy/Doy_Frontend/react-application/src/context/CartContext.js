import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [restaurantInfo, setRestaurantInfo] = useState(null);

    // Local olarak sepete ekleme
    const addToCart = (item) => {
        if (!restaurantInfo || restaurantInfo.id === item.restaurantId) {
            setCart((prev) => [...prev, item]);
            setRestaurantInfo({
                id: item.restaurantId,
                name: item.restaurantName
            });
        } else {
            toast.error("Sepette başka bir restorandan ürün var. Önce sepeti temizleyin.");
        }
    };

    // Backend ile birlikte sepete ekleme
    const addToCartWithBackend = async (item) => {
        try {
            const response = await axios.get(`http://localhost:8080/order/add?itemId=${item.id}`);
            if (response.data === true) {
                addToCart(item);
            } else {
                toast.error("Ürün sepete eklenemedi (backend reddetti).");
            }
        } catch (error) {
            console.error("addToCartWithBackend error:", error);
            toast.error("Sunucu hatası: ürün sepete eklenemedi.");
        }
    };

    // Local olarak çıkarma
    const removeFromCart = (index) => {
        setCart((prev) => {
            const updatedCart = prev.filter((_, i) => i !== index);
            if (updatedCart.length === 0) {
                setRestaurantInfo(null);
            }
            return updatedCart;
        });
    };

    // Backend ile birlikte çıkarma
    const removeFromCartWithBackend = async (index, itemId) => {
        try {
            const response = await axios.get(`http://localhost:8080/order/remove?itemId=${itemId}`);
            if (response.data === true) {
                removeFromCart(index);
            } else {
                toast.error("Ürün kaldırılamadı (backend reddetti).");
            }
        } catch (error) {
            console.error("removeFromCartWithBackend error:", error);
            toast.error("Sunucu hatası: ürün kaldırılamadı.");
        }
    };

    // Backend'e siparişi onaylat
    const confirmOrderWithBackend = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/order/confirm`);
            if (response.data === true) {
                toast.success("Sipariş başarıyla onaylandı!");
                return true;
            } else {
                toast.error("Sipariş onaylanamadı.");
                return false;
            }
        } catch (error) {
            console.error("confirmOrderWithBackend error:", error);
            toast.error("Sipariş onaylanırken bir hata oluştu.");
            return false;
        }
    };

    const clearCart = () => {
        setCart([]);
        setRestaurantInfo(null);
    };

    return (
        <CartContext.Provider value={{
            cart,
            restaurantInfo,
            addToCart,
            removeFromCart,
            clearCart,
            addToCartWithBackend,
            removeFromCartWithBackend,
            confirmOrderWithBackend
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
