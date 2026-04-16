import { Router } from "express";
import { getAdminStats, getUsers, updateUserRole, deleteUser } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// Route Thống kê: Admin và Teacher đều được xem
router.get("/stats", protect, restrictTo("admin", "teacher"), getAdminStats);

// --- User Management: CHỈ Admin được phép ---
router.use(protect);
router.use(restrictTo("admin"));

router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
