import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, children, darkMode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(4px)", // ✨ blur efekti
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        padding: "1rem",
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                            color: darkMode ? "#ffffff" : "#000000",
                            borderRadius: "20px",
                            padding: "2rem",
                            width: "100%",
                            maxWidth: "600px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                            position: "relative",
                            overflowY: "auto", // ✨ çok içerikte scroll
                            maxHeight: "90vh",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "20px",
                                background: "transparent",
                                border: "none",
                                fontSize: "1.7rem",
                                color: darkMode ? "#fff" : "#000",
                                cursor: "pointer",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#FF6961")} // ✨ Hover efekti
                            onMouseLeave={(e) => (e.target.style.color = darkMode ? "#fff" : "#000")}
                        >
                            ×
                        </button>

                        {/* Modal İçeriği */}
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
