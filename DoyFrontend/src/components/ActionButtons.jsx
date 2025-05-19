import React, { useState } from "react";
import { Button } from "./ui/button";
import SuspendModal from "./SuspendModal"; // 📌 Yeni modalı import et
import {useNavigate} from "react-router-dom";
const ActionButtons = ({ selected, type, darkMode, setToast, updateUserOrRestaurant }) => {
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const navigate = useNavigate();
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

    const handleAction = (actionType) => {
        if (actionType === "see") {
            setToast(`👀 Viewing ${type === "user" ? "profile" : "restaurant"}: ${selected.name}`);
            console.log(selected);
            if (selected && selected.type) {
                if (selected.type === "COURIER") {
                    navigate(`/courier/profile/${selected.id}`);
                } else if (selected.type === "RESTAURANT_OWNER") {
                    navigate(`/restaurant/profile/${selected.id}`);
                }
                else if(selected.type === "Restaurant"){
                    navigate(`/restaurants/manage/${selected.id}`);
                }
                else {
                    console.warn(`Unhandled role for navigation: ${selected.role}`);
                }
            } else if (type === "restaurant") {
                console.warn(`"see" action triggered for a restaurant or item without a role.`);
            } else {
                // Handle cases where selected or selected.role is missing
                console.error("Cannot navigate: 'selected' object or its 'role' is missing.");
                setToast("⚠️ Could not determine navigation target."); // Update toast for error
            }
        } else if (actionType === "ban") {
            console.log(selected)
            updateUserOrRestaurant(selected.id, "banned", true, type);
            setToast(`❌ ${type === "user" ? "User" : "Restaurant"} banned: ${selected.name}`);
        } else if (actionType === "unban") {
            updateUserOrRestaurant(selected.id, "unban", false, type);
            setToast(`✅ ${type === "user" ? "User" : "Restaurant"} unbanned: ${selected.name}`);
        } else if (actionType === "suspend") {
            setShowSuspendModal(true);
        } else if (actionType === "unsuspend") {
            updateUserOrRestaurant(selected.id, "unsuspended", false, type);
            //updateUserOrRestaurant(selected.id, "suspended", false, type);
            //updateUserOrRestaurant(selected.id, "suspendUntil", null, type);
            setToast(`✅ ${type === "user" ? "User" : "Restaurant"} unsuspended: ${selected.name}`);
        }
    };

    const handleSuspendConfirm = async(days) => {
        //const now = new Date();
        //const suspendUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        console.log("zazzaaaaaaa")
        updateUserOrRestaurant(selected.id, "suspended", days, type);
        //updateUserOrRestaurant(selected.id, "suspendUntil", suspendUntil.toISOString(), type);
        setToast(`⚠️ ${type === "user" ? "User" : "Restaurant"} suspended for ${days} days: ${selected.name}`);
        setShowSuspendModal(false);
    };

    const handleSuspendCancel = () => {
        setShowSuspendModal(false);
    };
    const isUserButRestaurant = selected.type === "Restaurant";
    console.log(selected);

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
            {/* See Profile */}
            <Button onClick={() => handleAction("see")} className="bg-purple-700 text-white">
                See {type === "user" ? "Profile" : "Restaurant"}
            </Button>

            {/* Only show these if NOT a restaurant object */}
            {!isUserButRestaurant && (
                <>
                    {/* Ban/Unban */}
                    {!selected.banned ? (
                        <Button onClick={() => handleAction("ban")} className="bg-red-700 text-white">
                            Ban {type === "user" ? "Account" : "Restaurant"}
                        </Button>
                    ) : (
                        <Button onClick={() => handleAction("unban")} className="bg-green-700 text-white">
                            Unban {type === "user" ? "Account" : "Restaurant"}
                        </Button>
                    )}

                    {/* Suspend/Unsuspend */}
                    {!selected.suspended ? (
                        <Button onClick={() => handleAction("suspend")} className="bg-yellow-600 text-black">
                            Suspend {type === "user" ? "Account" : "Restaurant"}
                        </Button>
                    ) : (
                        <Button onClick={() => handleAction("unsuspend")} className="bg-green-500 text-white">
                            Unsuspend {type === "user" ? "Account" : "Restaurant"}
                        </Button>
                    )}
                </>
            )}

            {/* Suspend Modal Açık mı? */}
            {showSuspendModal && (
                <SuspendModal
                    onConfirm={handleSuspendConfirm}
                    onCancel={handleSuspendCancel}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
};

export default ActionButtons;
