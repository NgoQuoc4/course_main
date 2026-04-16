const express = require("express");
const router = express.Router();
const {
    getBlogCategories,
    getBlogCategoryBySlug,
} = require("../controllers/blogController");

// GET /api/blog-categories - Danh sách danh mục
router.get("/", getBlogCategories);

// GET /api/blog-categories/:slug - Chi tiết danh mục
router.get("/:slug", getBlogCategoryBySlug);

module.exports = router;
