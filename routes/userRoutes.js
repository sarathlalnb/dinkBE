import express from "express";
import {
  deleteUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/").get(protect, getUsers);
router.route("/:id").delete(protect, deleteUser);

export default router;
