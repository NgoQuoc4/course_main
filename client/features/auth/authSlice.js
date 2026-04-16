// features/auth/authSlice.js
// Redux Slice quản lý trạng thái Authentication
// ======================================================================
// Đây là nơi chứa STATE + ACTIONS liên quan đến đăng nhập/đăng ký.
// Nếu sau này dự án chuyển từ Context sang Redux, em sẽ dùng file này.
// ======================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import tokenMethod from "@/utils/token";

// ============================================================
// Async Thunks - Các hành động bất đồng bộ (gọi API)
// ============================================================

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const res = await authService.login(loginData);
            const { token: accessToken, refreshToken } = res?.data?.data || {};
            tokenMethod.set({ accessToken, refreshToken });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Đăng nhập thất bại"
            );
        }
    }
);

export const getProfileThunk = createAsyncThunk(
    "auth/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authService.getProfiles();
            return res.data.data;
        } catch (error) {
            tokenMethod.remove();
            return rejectWithValue(
                error.response?.data?.message || "Lấy thông tin thất bại"
            );
        }
    }
);

// ============================================================
// Slice - State + Reducers
// ============================================================

const initialState = {
    profile: null,
    loading: false,
    error: null,
    showedModal: "", // "login" | "register" | ""
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Đồng bộ: mở/đóng modal
        showModal(state, action) {
            if (!tokenMethod.get()) {
                state.showedModal = action.payload || "";
            }
        },
        closeModal(state) {
            state.showedModal = "";
        },
        // Đăng xuất
        logout(state) {
            tokenMethod.remove();
            state.profile = null;
            state.showedModal = "";
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state) => {
                state.loading = false;
                state.showedModal = "";
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Profile
            .addCase(getProfileThunk.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(getProfileThunk.rejected, (state) => {
                state.profile = null;
            });
    },
});

export const { showModal, closeModal, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
