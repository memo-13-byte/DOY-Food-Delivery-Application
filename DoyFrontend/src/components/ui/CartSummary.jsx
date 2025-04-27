import React from "react";
import { FaTrashAlt } from 'react-icons/fa'; // Import a trash icon

// Add 'onRemove' to the destructured props
const CartSummary = ({ cart = [], onConfirm, onRemove, darkMode }) => {
    // Ensure cart is always an array and items have prices
    const safeCart = Array.isArray(cart) ? cart : [];
    const total = safeCart.reduce((sum, item) => sum + (item?.price || 0), 0);

    // Style for each item row in the cart summary
    const itemRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem', // A bit more space
        fontSize: '0.9rem',     // Slightly smaller font
        borderBottom: `1px dashed ${darkMode ? '#444' : '#ddd'}`, // Separator line
        paddingBottom: '0.75rem'
    };

    // Style for the remove button itself
    const removeButtonStyle = {
        background: 'none',
        border: 'none',
        color: darkMode ? '#ff8a8a' : '#e53e3e', // Reddish color
        cursor: 'pointer',
        padding: '0 0.2rem', // Minimal padding around icon
        marginLeft: '0.8rem', // Space between item text and button
        display: 'flex',
        alignItems: 'center'
    };

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                color: darkMode ? "#fff" : "#000",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: darkMode ? "0 0 8px rgba(255,255,255,0.1)" : "0 0 8px rgba(0,0,0,0.1)",
                minWidth: "280px", // Slightly wider min-width
                maxHeight: "400px", // Increased max-height
                overflowY: "auto",  // Keep scroll enabled
                display: 'flex',    // Use flexbox for layout
                flexDirection: 'column' // Stack content vertically
            }}
        >
            <h4 style={{ marginBottom: "1rem", marginTop: 0, flexShrink: 0 /* Prevent shrinking */ }}>Sepet</h4>

            {/* Use a div for the list area to allow scrolling */}
            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                {safeCart.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: darkMode ? '#aaa' : '#666' }}>Sepetiniz boş</p>
                ) : (
                    // Using div instead of ul/li for easier flex layout with button
                    <div>
                        {safeCart.map((item, index) => (
                            // Ensure item has a unique ID for the key and removal
                            <div key={item.id ?? `cart-item-${index}`} style={itemRowStyle}>
                                {/* Item Name & Price */}
                                <span style={{ flexGrow: 1, marginRight: '0.5rem', wordBreak: 'break-word' }}>
                                    {item.name || 'İsimsiz Ürün'} - {item.price?.toFixed(2) || '0.00'}₺
                                </span>

                                {/* Remove Button */}
                                {/* Check if onRemove function is provided before rendering button */}
                                {onRemove && (
                                    <button
                                        type="button"
                                        onClick={() => onRemove(item.id)} // Call onRemove with item.id
                                        style={removeButtonStyle}
                                        aria-label={`Remove ${item.name || 'item'}`}
                                        title={`"${item.name || 'item'}" öğesini kaldır`}
                                    >
                                        <FaTrashAlt size={14} /> {/* Use trash icon */}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section of the summary (Total and Confirm button) */}
            {safeCart.length > 0 && (
                <div style={{ flexShrink: 0 /* Prevent shrinking */ }}>
                    <hr style={{ margin: "1rem 0", border: 'none', borderTop: `1px solid ${darkMode ? '#555' : '#ccc'}` }} />
                    <div style={{ fontWeight: "bold", marginBottom: "1rem", textAlign: 'right' }}>
                        Toplam: {total.toFixed(2)}₺
                    </div>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: "#7A0000", // Consider a less intense red or match theme
                            color: "#fff",
                            padding: "0.6rem 1rem", // Adjusted padding
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            width: "100%",
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Sepeti Onayla
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartSummary;