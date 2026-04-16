// features/blog/hooks/useBlog.js
// Custom hook cho Blog feature

import useQuery from "@/hooks/useQuery";
import { blogsService } from "@/services/blogsService";

/**
 * Hook lấy danh sách blog
 * @param {string} query - Query string
 */
const useBlogs = (query = "") => {
    const { data, loading, error, refetch } = useQuery(() =>
        blogsService.getBlogs(query)
    );

    return {
        blogs: data?.data?.data?.blogs || [],
        pagination: data?.data?.data?.pagination || {},
        loading,
        error,
        refetch,
    };
};

export default useBlogs;
