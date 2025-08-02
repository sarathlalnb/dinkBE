import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, getAllOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/status").put(protect, updateOrderStatus);

export default router;
