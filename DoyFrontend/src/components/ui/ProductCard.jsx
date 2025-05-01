import React from "react";

const ProductCard = ({ item, onAdd }) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
            {/* Ürün Görseli */}
            <img
                src={item.image}
                alt={item.name}
                style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    marginRight: "1rem"
                }}
            />

            {/* Ürün Bilgileri */}
            <div style={{flexGrow: 1}}>
                <h4 style={{color: "#000"}}>{item.name}</h4>
                <p style={{margin: "0.5rem 0", fontSize: "0.9rem", color: "#555"}}>{item.description}</p>
                <div style={{
                    backgroundColor: "#5b5b5b",
                    color: "#fff",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "8px",
                    display: "inline-block",
                    fontSize: "0.85rem"
                }}>
                    {item.price} TL
                </div>
            </div>

            {/* Sepete Ekle Butonu */}
            <button
                onClick={() => onAdd(item)}
                style={{
                    marginLeft: "1rem",
                    backgroundColor: "#1D7D43",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Sepetine Ekle
            </button>
        </div>
    );
};

export default ProductCard;
