import { Router } from "express";
import {
    getBlogCategories,
    getBlogCategoryBySlug,
} from "../controllers/storefront/blogController.js";

const router = Router();

// GET /api/blog-categories - Danh sách danh mục
router.get("/", getBlogCategories);

// GET /api/blog-categories/:slug - Chi tiết danh mục
router.get("/:slug", getBlogCategoryBySlug);

export default router;
