import express from "express";
import { getAdminSummary } from "../controllers/adminController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getAdminSummary);

export default router;
