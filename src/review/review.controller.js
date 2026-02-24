import asyncHandler from "../../middleware/asyncHandler.js";
import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getProductReviewsService,
  getAllReviewsService,
} from "./review.service.js";

/* =========================
   CREATE REVIEW
========================= */

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService(
    req.user._id,
    req.params.productId,
    req.body.rating,
    req.body.comment
  );

  res.status(201).json({
    success: true,
    review,
  });
});

/* =========================
   UPDATE REVIEW
========================= */

export const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewService(
    req.user._id,
    req.params.reviewId,
    req.body.rating,
    req.body.comment
  );

  res.status(200).json({
    success: true,
    review,
  });
});

/* =========================
   DELETE REVIEW (Admin)
========================= */

export const deleteReview = asyncHandler(async (req, res) => {
  await deleteReviewService(req.params.reviewId);

  res.status(200).json({
    success: true,
    message: "Review deleted",
  });
});

/* =========================
   GET PRODUCT REVIEWS
========================= */

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await getProductReviewsService(req.params.productId);

  res.status(200).json({
    success: true,
    reviews,
  });
});

/* =========================
   ADMIN GET ALL REVIEWS
========================= */

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await getAllReviewsService();

  res.status(200).json({
    success: true,
    reviews,
  });
});