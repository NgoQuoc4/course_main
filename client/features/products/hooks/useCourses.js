// features/products/hooks/useCourses.js
// Custom hook đóng gói logic lấy danh sách khóa học

import useQuery from "@/hooks/useQuery";
import { courseServices } from "@/services/courseServices";

/**
 * Hook lấy danh sách khóa học
 * @param {string} query - Query string (vd: "?limit=10&page=1")
 * @returns {{ data: array, loading: boolean, error: any, refetch: function }}
 */
const useCourses = (query = "") => {
    const { data, loading, error, refetch } = useQuery(() =>
        courseServices.getCourses(query)
    );

    return {
        courses: data?.data?.data?.courses || data?.data?.data || [],
        loading,
        error,
        refetch,
    };
};

export default useCourses;
