import React from "react";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { Button } from "./ui/button";

const ComplaintCard = ({ complaint, onClick, darkMode, selectedComplaint }) => {
    const isResolved = complaint.status === "Resolved";
    const isSelected = selectedComplaint?.id === complaint.id;

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: darkMode ? "#2c2c2c" : "#FDF1C7",
            padding: "1rem",
            borderRadius: "20px",
            width: "100%", // Takes full width of parent container
            boxShadow: darkMode ? "0 2px 6px rgba(255,255,255,0.1)" : "0 2px 6px rgba(0,0,0,0.1)",
            color: darkMode ? "#fff" : "#000",
            transition: "all 0.3s ease-in-out",
            border: isSelected ? 
                (darkMode ? "2px solid rgba(255,255,255,0.3)" : "2px solid rgba(122, 0, 0, 0.5)") : 
                "2px solid transparent",
        }}>
            {/* Left Icon */}
            <div style={{ fontSize: "2rem", color: isResolved ? "green" : "red" }}>
                {isResolved ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>

            {/* Middle Information */}
            <div style={{ flexGrow: 1, marginLeft: "1.5rem", textAlign: "left" }}>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                        <p><b>ID:</b> {complaint.id}</p>
                        <p><b>Name:</b> {complaint.name}</p>
                    </div>
                    <div>
                        <p><b>Date:</b> {complaint.date}</p>
                        <p><b>Status:</b> {complaint.status}</p>
                    </div>
                </div>
            </div>

            {/* Right - Button */}
            <Button
                onClick={() => onClick(complaint)}
                className={`${isResolved ? 'bg-green-600' : 'bg-red-500'} text-white`}
            >
                Complaint Details
            </Button>
        </div>
    );
};

export default ComplaintCard;