import React from "react";
import { Button } from "./ui/button";

const ActionButtons = ({ selected, type, darkMode }) => {
    if (!selected) {
        return (
            <div style={{
                backgroundColor: darkMode ? "#2a2a2a" : "#f3f3f3",
                padding: "1rem",
                borderRadius: "20px",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <span style={{ color: "#888" }}>No {type} selected</span>
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
            alignItems: "center"
        }}>
            <Button onClick={() => alert(`Viewing ${type} profile: ${selected.name}`)} className="bg-purple-700 text-white">
                See {type === "user" ? "Profile" : "Restaurant"}
            </Button>
            <Button onClick={() => alert(`Suspended ${type}: ${selected.name}`)} className="bg-purple-500 text-white">
                Suspend {type === "user" ? "Account" : "Restaurant"}
            </Button>
            <Button onClick={() => alert(`Banned ${type}: ${selected.name}`)} className="bg-red-700 text-white">
                Ban {type === "user" ? "Account" : "Restaurant"}
            </Button>
        </div>
    );
};

export default ActionButtons;
