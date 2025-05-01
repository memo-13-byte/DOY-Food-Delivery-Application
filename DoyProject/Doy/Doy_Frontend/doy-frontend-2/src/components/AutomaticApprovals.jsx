import React, { useState } from "react";

const AutomaticApprovals = ({ darkMode }) => {
    const [autoApproveRestaurants, setAutoApproveRestaurants] = useState(false);
    const [autoApproveCouriers, setAutoApproveCouriers] = useState(false);

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
            padding: "1rem",
            borderRadius: "20px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
        }}>
            {/* Auto Approve Restaurants */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label>Auto Approve New Restaurants</label>
                <input
                    type="checkbox"
                    checked={autoApproveRestaurants}
                    onChange={(e) => setAutoApproveRestaurants(e.target.checked)}
                    style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer"
                    }}
                />
            </div>

            {/* Auto Approve Couriers */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label>Auto Approve New Couriers</label>
                <input
                    type="checkbox"
                    checked={autoApproveCouriers}
                    onChange={(e) => setAutoApproveCouriers(e.target.checked)}
                    style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer"
                    }}
                />
            </div>
        </div>
    );
};

export default AutomaticApprovals;
