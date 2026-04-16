// components/common/Spinner.jsx
// Component loading spinner dùng chung toàn app

import React from "react";

const Spinner = ({ size = 40, color = "#1dc071" }) => {
    const spinnerStyle = {
        width: size,
        height: size,
        border: `4px solid rgba(0, 0, 0, 0.1)`,
        borderTop: `4px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto",
    };

    return (
        <>
            <style>
                {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
            <div style={spinnerStyle} role="status" aria-label="Loading"></div>
        </>
    );
};

export default Spinner;
