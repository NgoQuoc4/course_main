import { Link } from "react-router-dom";

const BlogMenu = ({ categories, selectedCategory, setSelectedCategory }) => {
  const _onChangeCategory = (e, id) => {
    e.preventDefault();
    setSelectedCategory(id);
  };

  return (
    <div className="blog__menu">
      <Link
        onClick={(e) => _onChangeCategory(e, "")}
        className={`blog__menu-item ${selectedCategory === "" ? "active" : ""}`}
      >
        Tất cả
      </Link>
      {!!categories?.length &&
        categories.map((category) => {
          if (!category || typeof category !== "object") return null;
          const { _id, slug, name } = category;
          return (
            <Link
              key={_id}
              onClick={(e) => _onChangeCategory(e, slug)}
              className={`blog__menu-item ${slug === selectedCategory ? "active" : ""}`}
            >
              {name}
            </Link>
          );
        })}
    </div>
  );
};

export default BlogMenu;
