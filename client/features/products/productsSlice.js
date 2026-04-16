// features/products/productsSlice.js
// Redux Slice quản lý trạng thái Products (Khóa học)
// ======================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseServices } from "@/services/courseServices";

// ============================================================
// Async Thunks
// ============================================================

export const fetchCoursesThunk = createAsyncThunk(
    "products/fetchCourses",
    async (query = "", { rejectWithValue }) => {
        try {
            const res = await courseServices.getCourses(query);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lấy danh sách khóa học thất bại"
            );
        }
    }
);

export const fetchCourseDetailThunk = createAsyncThunk(
    "products/fetchCourseDetail",
    async (slug, { rejectWithValue }) => {
        try {
            const res = await courseServices.getCourseBySlug(slug);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lấy chi tiết khóa học thất bại"
            );
        }
    }
);

// ============================================================
// Slice
// ============================================================

const initialState = {
    courses: [],
    courseDetail: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearCourseDetail(state) {
            state.courseDetail = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Courses
            .addCase(fetchCoursesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload?.courses || action.payload || [];
            })
            .addCase(fetchCoursesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Course Detail
            .addCase(fetchCourseDetailThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCourseDetailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.courseDetail = action.payload;
            })
            .addCase(fetchCourseDetailThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCourseDetail, clearError } = productsSlice.actions;
export default productsSlice.reducer;
