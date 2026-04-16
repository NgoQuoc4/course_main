// components/common/EmptyState.jsx
// Component hiển thị khi không có dữ liệu

import React from "react";

const EmptyState = ({
    title = "Không có dữ liệu",
    description = "Chưa có thông tin nào để hiển thị.",
    icon = "📭",
}) => {
    return (
        <div
            style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#999",
            }}
        >
            <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#333", marginBottom: 8 }}>
                {title}
            </h3>
            <p style={{ fontSize: 14 }}>{description}</p>
        </div>
    );
};

export default EmptyState;
