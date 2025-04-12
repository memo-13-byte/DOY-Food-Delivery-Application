import React from "react";

const CartSummary = ({ cart, onConfirm, darkMode }) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                color: darkMode ? "#fff" : "#000",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: darkMode ? "0 0 8px rgba(255,255,255,0.1)" : "0 0 8px rgba(0,0,0,0.1)",
                minWidth: "250px",
                maxHeight: "320px",
                overflowY: "auto"
            }}
        >
            <h4 style={{ marginBottom: "1rem" }}>Sepet</h4>
            {cart.length === 0 ? (
                <p>Sepetiniz boş</p>
            ) : (
                <>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {cart.map((item, index) => (
                            <li key={index} style={{ marginBottom: "0.5rem" }}>
                                {item.name} - {item.price}₺
                            </li>
                        ))}
                    </ul>
                    <hr style={{ margin: "1rem 0", borderColor: darkMode ? "#444" : "#ccc" }} />
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
                            width: "100%"
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

