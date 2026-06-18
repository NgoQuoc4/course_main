import { Router } from "express";
import {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../controllers/admin/roleController.js";
import {
  getNotifications,
  markAllRead,
  markRead,
  clearAll,
} from "../controllers/admin/notificationController.js";

const router = Router();

// Route Thống kê: Admin và Teacher đều được xem
router.get("/stats", protect, restrictTo("admin", "teacher"), getAdminStats);

// --- User Management: CHỈ Admin được phép ---
router.use(protect);
router.use(restrictTo("admin"));

router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
//role
router.get("/roles", getAllRoles);
router.get("/roles/:id", getRoleById);
router.post("/roles", createRole);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

// --- Notification Management ---
router.get("/notifications", getNotifications);
router.put("/notifications/read-all", markAllRead);
router.put("/notifications/:id/read", markRead);
router.delete("/notifications", clearAll);

export default router;
