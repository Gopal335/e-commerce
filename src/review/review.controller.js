import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js";

import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getProductReviewsService,
  getAllReviewsService,
} from "./review.service.js";

 const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService( req.user._id, req.params.productId, req.body.rating, req.body.comment );
  return successResponse( 201, res, "Review created successfully", review );
});


 const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewService( req.user._id, req.params.reviewId, req.body.rating, req.body.comment );
  return successResponse( 200, res, "Review updated successfully", review );
});

 const deleteReview = asyncHandler(async (req, res) => {
  await deleteReviewService( req.params.reviewId );
  return successResponse( 200, res, "Review deleted successfully", null );
});

 const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await getProductReviewsService( req.params.productId );
  return successResponse( 200, res, "Product reviews fetched successfully", reviews );
});


 const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await getAllReviewsService();
  return successResponse( 200, res, "All reviews fetched successfully", reviews );
});

export {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getAllReviews,
};