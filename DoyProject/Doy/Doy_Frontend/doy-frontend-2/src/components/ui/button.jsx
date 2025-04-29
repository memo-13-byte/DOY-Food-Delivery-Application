import React from "react";

const Button = ({ children, onClick, className = "", type = "button" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`transition-all duration-300 font-semibold ${className}`}
            style={{
                padding: "0.6rem 1.4rem",
                borderRadius: "999px",
                backgroundColor: "#7A0000",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                minWidth: "120px",
                textAlign: "center",
                transition: "background-color 0.3s, transform 0.2s",
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#5a0000"; // Hover efekti
                e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#7A0000";
                e.currentTarget.style.transform = "scale(1)";
            }}
        >
            {children}
        </button>
    );
};

export { Button };
