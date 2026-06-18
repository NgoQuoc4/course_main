import { Empty, message } from "antd";

const BlogDetailContent = ({
  _id,
  thumbnail,
  content,
  loading = true,
  excerpt,
}) => {
  const _onCopyLink = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    message.success("Đã copy đường dẫn khóa học này");
  };
  return (
    <>
      {!!_id && (
        <div
          className={`blogdetail__content ${loading ? "is-loading" : "is-loaded"}`}
        >
          <img src={thumbnail || ""} alt="Post thumnail" />
          <div
            className="blogdetail__content-entry"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <div className="blogdetail__line" />
          <div className="blogdetail__content-social btngroup">
            <a href="" onClick={_onCopyLink} className="btn btn-fb">
              <img src="/img/icon-fb-share.svg" alt="" />
              <span>Share</span>
            </a>
            <a href="" onClick={_onCopyLink} className="btn btn-linkedin">
              <img src="/img/icon-in-share.svg" alt="" />
              <span>Share</span>
            </a>
          </div>
        </div>
      )}
      {!loading && !_id && (
        <Empty description="Không tìm thấy nội dung bài viết!" />
      )}
    </>
  );
};

export default BlogDetailContent;
