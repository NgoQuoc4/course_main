// routes/generalRoutes.js
// Khai báo các route cho Gallery, Team, Question, Subscribe

const express = require("express");
const router = express.Router();
const {
    getGalleries,
    getTeams,
    getQuestions,
    createSubscribe,
} = require("../controllers/generalController");
const { validateSubscribe } = require("../middlewares/validateMiddleware");

// GET /galleries - Danh sách ảnh gallery
router.get("/galleries", getGalleries);

// GET /teams - Danh sách đội ngũ giảng viên
router.get("/teams", getTeams);

// GET /questions - Danh sách câu hỏi thường gặp
router.get("/questions", getQuestions);

// POST /subscribes - Đăng ký nhận tin tức
router.post("/subscribes", validateSubscribe, createSubscribe);

module.exports = router;

