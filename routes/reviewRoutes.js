import express from "express";
import protect from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/restrictTo.js";
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getAllReviews,
} from "../src/review/review.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/:productId", getProductReviews);

/* USER */
router.post("/:productId", protect, createReview);
router.put("/:reviewId", protect, updateReview);

/* ADMIN */
router.get("/", protect, restrictTo("admin"), getAllReviews);
router.delete("/:reviewId", protect, restrictTo("admin"), deleteReview);

export default router;