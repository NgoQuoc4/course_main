import BlogItem from "@/features/blog/components/BlogItem";
import { Empty } from "antd";
import Pagination from "./Pagination";

const BlogList = ({ blogs, loading }) => {
  return (
    <>
      {!!blogs?.length && (
        <>
          <div className={`blog__list ${loading ? "is-loading" : "is-loaded"}`}>
            {blogs.map((blog) => (
              <BlogItem key={blog?._id} {...blog} />
            ))}
          </div>
          {loading || <Pagination />}
        </>
      )}
      {!loading && !blogs?.length && (
        <Empty description="Không tìm thấy dữ liệu" />
      )}
    </>
  );
};

export default BlogList;
