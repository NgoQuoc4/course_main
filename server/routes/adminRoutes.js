const express = require("express");
const router = express.Router();
const { getAdminStats, getUsers, updateUserRole, deleteUser } = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Route Thống kê: Admin và Teacher đều được xem
router.get("/stats", protect, restrictTo("admin", "teacher"), getAdminStats);

// --- User Management: CHỈ Admin được phép ---
router.use(protect);
router.use(restrictTo("admin"));

router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
