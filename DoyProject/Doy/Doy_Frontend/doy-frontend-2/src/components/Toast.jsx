import React from "react";
import { motion } from "framer-motion";

const Toast = ({ message, darkMode }) => {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                backgroundColor: darkMode ? "#333" : "#f0f0f0",
                color: darkMode ? "#fff" : "#000",
                padding: "1rem 2rem",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                zIndex: 1000,
                fontWeight: "bold",
            }}
        >
            {message}
        </motion.div>
    );
};

export default Toast;
