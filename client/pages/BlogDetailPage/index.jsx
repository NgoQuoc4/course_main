import useDebounce from "@/hooks/useDebounce";
import { blogsService } from "@/features/blog/services/blogsService";
import { useParams } from "react-router-dom";
import BlogDetailTitle from "./BlogDetailTitle";
import BlogDetailContent from "./BlogDetailContent";
import BlogDetailRelated from "./BlogDetailRelated";
import useQuery from "@/hooks/useQuery";
import PageLoading from "@/components/PageLoading";

export const BlogDetailPage = () => {
  const { blogSlug } = useParams();

  const {
    data: dataBlogDetail,
    error: errorBlogDetail,
    loading: loadingBlogDetail,
  } = useQuery({
    queryKey: ["blog", blogSlug],
    queryFn: () => blogsService.getBlogBySlug(blogSlug || ""),
    enabled: !!blogSlug, // Chỉ chạy khi có slug
  });
  console.log("errorBlogDetail", errorBlogDetail);
  const blogDetail = dataBlogDetail || {};
  const categoryId = dataBlogDetail?.category?._id || "";
  const query = categoryId ? `?limit=3&category=${categoryId}` : "?limit=3";

  const {
    data: dataBlogRelated,
    error: errorBlogRelated,
    loading: loadingBlogRelated,
  } = useQuery({
    queryKey: ["blogs", "related", query], // Khi query thay đổi, tự fetch lại danh sách liên quan
    queryFn: () => blogsService.getBlog(query),
  });
  const loadingApi = loadingBlogDetail || loadingBlogRelated;
  const loadingPage = useDebounce(loadingApi, 300);

  return (
    <main className="mainwrapper blogdetail --ptop">
      <div className="container">
        {errorBlogDetail ? (
          <div
            className="error-api"
            style={{ textAlign: "center", margin: "50px 0" }}
          >
            <p className="title --t3" style={{ color: "red" }}>
              Đã có lỗi xảy ra!
            </p>
            <span className="message">
              {errorBlogDetail?.response?.data?.message ||
                errorBlogDetail?.message}
            </span>
          </div>
        ) : loadingBlogDetail ? (
          <PageLoading fixed={true} />
        ) : (
          <div className="wrapper">
            <BlogDetailTitle {...blogDetail} />
            <BlogDetailContent {...blogDetail} loading={loadingPage} />
          </div>
        )}

        <BlogDetailRelated
          blogs={dataBlogRelated?.blogs}
          loading={loadingPage}
          error={errorBlogRelated}
        />
      </div>
    </main>
  );
};

export default BlogDetailPage;
