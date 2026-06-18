import BlogItem from "@/features/blog/components/BlogItem";
import { Empty } from "antd";

const BlogDetailRelated = ({ blogs, loading = true, error }) => {
  return (
    <div className="blogdetail__related">
      <h2 className="blogdetail__related-title title --t2">
        Bài viết liên quan
      </h2>
      {error && (
        <div style={{ textAlign: "center", color: "red", margin: "20px 0" }}>
          Không thể tải danh sách bài viết liên quan lúc này.
        </div>
      )}

      {!error && !!blogs?.length && (
        <div className={`blog__list ${loading ? "is-loading" : "is-loaded"}`}>
          {blogs.map((blog) => (
            <BlogItem key={blog?._id} {...blog} />
          ))}
        </div>
      )}

      {!error && !loading && !blogs?.length && (
        <Empty description="Không tìm thấy bài viết nào liên quan" />
      )}
    </div>
  );
};

export default BlogDetailRelated;
