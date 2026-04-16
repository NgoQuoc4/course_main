// store/index.js
// Cấu hình Redux Store tập trung
// ======================================================================
// Đây là nơi DUY NHẤT khởi tạo Redux Store.
// Khi cần thêm feature mới (ví dụ: cart), em chỉ cần:
// 1. Tạo file features/cart/cartSlice.js
// 2. Import và thêm vào reducer ở đây
// ======================================================================

import { configureStore } from "@reduxjs/toolkit";
// Import các slice khi cần
// import authReducer from "@/features/auth/authSlice";
// import productsReducer from "@/features/products/productsSlice";

const store = configureStore({
    reducer: {
        // auth: authReducer,
        // products: productsReducer,
    },
    // Bật Redux DevTools chỉ trong development
    devTools: import.meta.env.DEV,
});

export default store;
