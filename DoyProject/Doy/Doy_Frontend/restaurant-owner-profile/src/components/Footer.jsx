import React from "react";
import doyLogo from "../assets/doylogo.jpeg";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa6";

const Footer = ({ darkMode }) => {
    return (
        <footer style={{
            marginTop: "2rem",
            padding: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
            transition: "all 0.3s ease-in-out"
        }}>
            {/* Sol - Doy Logo */}
            <img
                src={doyLogo}
                alt="Doy Logo"
                style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    objectFit: "cover"
                }}
            />

            {/* Orta - X */}
            <div style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: darkMode ? "#fff" : "#000"
            }}>

            </div>

            {/* Sağ - Sosyal Medya İkonları */}
            <div style={{ display: "flex", gap: "1.5rem" }}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                    <FaXTwitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                    <FaInstagram size={24} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                    <FaYoutube size={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                    <FaLinkedin size={24} />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
