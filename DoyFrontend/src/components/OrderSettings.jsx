import React, { useState } from "react";

const OrderSettings = ({ darkMode }) => {
    const [maxOrderRange, setMaxOrderRange] = useState(10);
    const [sendNotifications, setSendNotifications] = useState(true);
    const [settingC, setSettingC] = useState("");
    const [settingD, setSettingD] = useState("");

    return (
        <div style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
            padding: "1rem",
            borderRadius: "20px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
        }}>
            {/* Maximum Order Range */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label>Maximum Order Range (KM)</label>
                <input
                    type="number"
                    value={maxOrderRange}
                    onChange={(e) => setMaxOrderRange(e.target.value)}
                    style={{
                        padding: "0.6rem",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        width: "100%",
                        maxWidth: "250px",
                        textAlign: "center"
                    }}
                />
            </div>

            {/* Send Automatic Notifications */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label>Send Automatic Notifications</label>
                <select
                    value={sendNotifications ? "on" : "off"}
                    onChange={(e) => setSendNotifications(e.target.value === "on")}
                    style={{
                        padding: "0.6rem",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        width: "100%",
                        maxWidth: "250px",
                        textAlign: "center",
                        cursor: "pointer"
                    }}
                >
                    <option value="on">ON</option>
                    <option value="off">OFF</option>
                </select>
            </div>

            {/* Setting C */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label>Setting C</label>
                <input
                    type="text"
                    value={settingC}
                    onChange={(e) => setSettingC(e.target.value)}
                    style={{
                        padding: "0.6rem",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        width: "100%",
                        maxWidth: "250px",
                        textAlign: "center"
                    }}
                />
            </div>

            {/* Setting D */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label>Setting D</label>
                <input
                    type="text"
                    value={settingD}
                    onChange={(e) => setSettingD(e.target.value)}
                    style={{
                        padding: "0.6rem",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        width: "100%",
                        maxWidth: "250px",
                        textAlign: "center"
                    }}
                />
            </div>
        </div>
    );
};

export default OrderSettings;
