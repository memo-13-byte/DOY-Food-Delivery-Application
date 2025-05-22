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
        // justifyContent: 'space-between', // Adjusted for image
        alignItems: 'center',
        marginBottom: '0.75rem',
        fontSize: '0.9rem',
        borderBottom: `1px dashed ${darkMode ? '#444' : '#ddd'}`,
        paddingBottom: '0.75rem'
    };

    // Style for the remove button itself
    const removeButtonStyle = {
        background: 'none',
        border: 'none',
        color: darkMode ? '#ff8a8a' : '#e53e3e',
        cursor: 'pointer',
        padding: '0 0.2rem',
        marginLeft: '0.5rem', // Adjusted margin
        display: 'flex',
        alignItems: 'center'
    };

    // Style for the item image
    const itemImageStyle = {
        width: '40px', // Or your desired size
        height: '40px',
        borderRadius: '4px', // Optional: rounded corners
        objectFit: 'cover', // Ensures the image covers the area without distortion
        marginRight: '0.75rem', // Space between image and text
        flexShrink: 0 // Prevent image from shrinking
    };

    // Style for item details (name and price)
    const itemDetailsStyle = {
        flexGrow: 1,
        marginRight: '0.5rem',
        wordBreak: 'break-word' // Keep this for long names
    };


    return (
        <div
            style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                color: darkMode ? "#fff" : "#000",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: darkMode ? "0 0 8px rgba(255,255,255,0.1)" : "0 0 8px rgba(0,0,0,0.1)",
                minWidth: "280px",
                maxHeight: "400px",
                overflowY: "auto",
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <h4 style={{ marginBottom: "1rem", marginTop: 0, flexShrink: 0 }}>Sepet</h4>

            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                {safeCart.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: darkMode ? '#aaa' : '#666' }}>Sepetiniz boş</p>
                ) : (
                    <div>
                        {safeCart.map((item, index) => (
                            // Corrected key to ensure uniqueness
                            <div key={`cart-summary-item-${item.id}-${index}`} style={itemRowStyle}>
                                {/* Item Image */}
                                <img
                                    src={item.image || "/placeholder.svg?text=No+Image"} // Use item.image, fallback to placeholder
                                    alt={item.name || 'Ürün resmi'}
                                    style={itemImageStyle}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevents looping if placeholder also fails
                                        e.target.src = "/placeholder.svg?text=Hata"; // Fallback image on error
                                    }}
                                />

                                {/* Item Name & Price */}
                                <div style={itemDetailsStyle}>
                                    {item.name || 'İsimsiz Ürün'}
                                    <div style={{ fontSize: '0.8em', color: darkMode ? '#bbb' : '#555' }}>
                                        {item.price?.toFixed(2) || '0.00'}₺
                                    </div>
                                </div>

                                {/* Remove Button */}
                                {onRemove && (
                                    <button
                                        type="button"
                                        onClick={() => onRemove(item.id)}
                                        style={removeButtonStyle}
                                        aria-label={`Remove ${item.name || 'item'}`}
                                        title={`"${item.name || 'item'}" öğesini kaldır`}
                                    >
                                        <FaTrashAlt size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {safeCart.length > 0 && (
                <div style={{ flexShrink: 0 }}>
                    <hr style={{ margin: "1rem 0", border: 'none', borderTop: `1px solid ${darkMode ? '#555' : '#ccc'}` }} />
                    <div style={{ fontWeight: "bold", marginBottom: "1rem", textAlign: 'right' }}>
                        Toplam: {total.toFixed(2)}₺
                    </div>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: "#7A0000",
                            color: "#fff",
                            padding: "0.6rem 1rem",
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
