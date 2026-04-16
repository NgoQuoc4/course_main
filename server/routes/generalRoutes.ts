import { Router } from "express";
import {
    getGalleries,
    getTeams,
    getQuestions,
    createSubscribe,
} from "../controllers/generalController.js";
import { validateSubscribe } from "../middlewares/validateMiddleware.js";

const router = Router();

// GET /galleries - Danh sách ảnh gallery
router.get("/galleries", getGalleries);

// GET /teams - Danh sách đội ngũ giảng viên
router.get("/teams", getTeams);

// GET /questions - Danh sách câu hỏi thường gặp
router.get("/questions", getQuestions);

// POST /subscribes - Đăng ký nhận tin tức
router.post("/subscribes", validateSubscribe, createSubscribe);

export default router;
