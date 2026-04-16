// contexts/ThemeContext.jsx
// Context quản lý Theme (Light/Dark mode) toàn app
// ======================================================================
// Ví dụ mẫu: Em có thể mở rộng thêm ngôn ngữ (i18n) tương tự.
// ======================================================================

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({});

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Đọc từ localStorage nếu có
        return localStorage.getItem("app-theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("app-theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
export const useTheme = () => useContext(ThemeContext);
