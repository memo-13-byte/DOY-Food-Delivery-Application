import React from "react";
import { Button } from "./ui/button"; // Eğer özel bir button component'in yoksa, normal <button> da yazabilirim istersen

const PendingActionButtons = ({ selected, darkMode }) => {
    if (!selected) {
        return (
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#f3f3f3",
                padding: "1rem",
                borderRadius: "20px",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}>
                <span style={{ color: "#888" }}>No Pending User Selected</span>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#f3f3f3",
            padding: "1.5rem",
            borderRadius: "20px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => alert(`Reviewing profile for ${selected.name}`)}
            >
                Review
            </Button>
            <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => alert(`Approved ${selected.name}`)}
            >
                Approve
            </Button>
            <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => alert(`Declined ${selected.name}`)}
            >
                Decline
            </Button>
        </div>
    );
};

export default PendingActionButtons;
