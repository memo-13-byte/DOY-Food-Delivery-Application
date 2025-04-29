import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ messages, darkMode }) => {
    return (
        <div style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
        }}>
            <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: 300 }}
                        transition={{
                            x: { type: "spring", stiffness: 100, damping: 15 },
                        }}
                        style={{
                            backgroundColor: darkMode ? "#333" : "#fff",
                            color: darkMode ? "#fff" : "#000",
                            padding: "1rem 1.5rem",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            fontWeight: "bold",
                            fontSize: "0.95rem",
                            minWidth: "250px",
                            textAlign: "center",
                        }}
                    >
                        {msg}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
