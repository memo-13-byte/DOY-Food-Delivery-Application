import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { IoClose } from "react-icons/io5";
import axios from "axios";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationPicker = ({ onLocationChange }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);

            try {
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const address = res?.data?.display_name || "Adres bulunamadı";
                onLocationChange({ lat, lng, address });
            } catch (err) {
                console.error("Adres alınamadı:", err);
                onLocationChange({ lat, lng, address: "Adres alınamadı" });
            }
        },
    });

    return position ? <Marker position={position} /> : null;
};

const LocationModal = ({ onClose, onLocationSelect, darkMode }) => {
    const [selected, setSelected] = useState(null);
    const mapRef = useRef(null);

    return (
        <div style={overlayStyle}>
            <div style={getModalStyle(darkMode)}>
                {/* Kapatma ikonu */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: darkMode ? "#fff" : "#333",
                    }}
                >
                    <IoClose />
                </button>

                <h2 style={{ marginBottom: "1rem", fontWeight: "bold" }}>Adres Seç</h2>

                <div style={getMapContainerStyle(darkMode)}>
                    <MapContainer
                        center={[39.9255, 32.8664]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker onLocationChange={setSelected} />
                    </MapContainer>
                </div>

                <p style={{ marginTop: "1rem", fontStyle: "italic", fontSize: "0.95rem" }}>
                    {selected ? selected.address : "Lütfen haritadan adres seçin."}
                </p>

                <div style={{ textAlign: "right" }}>
                    <button
                        onClick={() => {
                            if (selected) onLocationSelect(selected.address);
                            onClose();
                        }}
                        disabled={!selected}
                        style={{
                            backgroundColor: "#7A0000",
                            color: "white",
                            padding: "0.5rem 1.2rem",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: selected ? "pointer" : "not-allowed",
                            marginTop: "1rem",
                        }}
                    >
                        Tamam
                    </button>
                </div>
            </div>
        </div>
    );
};


const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const getModalStyle = (darkMode) => ({
    backgroundColor: darkMode ? "#2a2a2a" : "#fff",
    color: darkMode ? "#fff" : "#000",
    padding: "2rem",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "600px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    position: "relative",
});

const getMapContainerStyle = (darkMode) => ({
    height: "300px",
    width: "100%",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: darkMode ? "0 0 8px rgba(255,255,255,0.1)" : "0 2px 5px rgba(0,0,0,0.1)",
});

export default LocationModal;
