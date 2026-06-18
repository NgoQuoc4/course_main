import useQuery from "@/hooks/useQuery";
import { blogsService } from "@/features/blog/services/blogsService";
import { useState } from "react";
import BlogMenu from "./BlogMenu";
import BlogList from "./BlogList";
import useDebounce from "@/hooks/useDebounce";

export const BlogPage = () => {
  // 1. Fetch danh mục blog
  const {
    data: dataBlogCategories,
    error: errorBlogCategories,
    isLoading: loadingBlogCategories,
  } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: () => blogsService.getBlogCategories(),
  });
  const dataBlogByCategories = dataBlogCategories || [];
  const [selectedCategory, setSelectedCategory] = useState("");

  const query = selectedCategory ? `?category=${selectedCategory}` : "";

  // 2. Fetch danh sách blog theo danh mục (Tự động chạy lại khi chọn danh mục khác)
  const {
    data: dataBlogs,
    error: errorBlogs,
    isLoading: loadingBlogs,
  } = useQuery({
    queryKey: ["blogs", query],
    queryFn: () => blogsService.getBlog(query),
  });

  const loadingDebounce = useDebounce(loadingBlogs, 300);

  // Xử lý fallback trả về mảng rỗng nếu API lỗi 404 (Không có bài viết trong danh mục)
  const blogs =
    errorBlogs?.response?.status === 404 ? [] : dataBlogs?.blogs || [];

  return (
    <main className="mainwrapper blog --ptop">
      <div className="container">
        <div className="textbox">
          <div className="container">
            <h2 className="title --t2">Blog</h2>
          </div>
        </div>
        <BlogMenu
          categories={dataBlogByCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <BlogList blogs={blogs} loading={loadingDebounce} />
      </div>
    </main>
  );
};

export default BlogPage;
