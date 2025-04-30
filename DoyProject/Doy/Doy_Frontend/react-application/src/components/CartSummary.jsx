import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartSummary = ({ onConfirm, darkMode }) => {
    const { cart, removeFromCart, restaurantInfo } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const goToRestaurant = () => {
        if (restaurantInfo?.id) {
            navigate(`/restaurant/${restaurantInfo.id}`);
        }
    };

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                color: darkMode ? "#fff" : "#000",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: darkMode
                    ? "0 0 8px rgba(255,255,255,0.1)"
                    : "0 0 8px rgba(0,0,0,0.1)",
                minWidth: "250px",
                maxHeight: "360px",
                overflowY: "auto",
            }}
        >
            <h4 style={{ marginBottom: "1rem" }}>Sepet</h4>

            {restaurantInfo?.name && (
                <p
                    onClick={goToRestaurant}
                    style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                    }}
                >
                    {restaurantInfo.name}
                </p>
            )}

            {cart.length === 0 ? (
                <p>Sepetiniz boş</p>
            ) : (
                <>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {cart.map((item, index) => (
                            <li
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <span>{item.name} - {item.price}₺</span>
                                <button
                                    onClick={() => removeFromCart(index)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "red",
                                        cursor: "pointer",
                                        marginLeft: "0.5rem",
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>

                    <hr
                        style={{
                            margin: "1rem 0",
                            borderColor: darkMode ? "#444" : "#ccc",
                        }}
                    />
                    <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                        Toplam: {total}₺
                    </div>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: "#7A0000",
                            color: "#fff",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        Sepeti Onayla
                    </button>
                </>
            )}
        </div>
    );
};

export default CartSummary;
