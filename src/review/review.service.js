import Review from '../../models/review.model.js';
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import { NotFoundError, BadRequestError } from "../../utils/appError.js";
import mongoose from 'mongoose';

/* =========================
   Helper: Recalculate Rating
========================= */

const updateProductAverage = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats.length > 0 ? stats[0].avgRating : 0,
  });
};

/* =========================
   CREATE REVIEW
========================= */

export const createReviewService = async (
  userId,
  productId,
  rating,
  comment
) => {
  const product = await Product.findById(productId);
  if (!product) throw new NotFoundError("Product not found");

  const deliveredOrder = await Order.findOne({
    user: userId,
    status: "Delivered",
    "items.product": productId,
  });

  if (!deliveredOrder) {
    throw new BadRequestError(
      "You can review only delivered products"
    );
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  product.reviews.push(review._id);
await product.save();

  // update average rating logic here
  await updateProductAverage(productId);

  return review;
};

/* =========================
   UPDATE REVIEW (Owner Only)
========================= */

export const updateReviewService = async (
  userId,
  reviewId,
  rating,
  comment
) => {
  const review = await Review.findById(reviewId);

  if (!review) throw new NotFoundError("Review not found");

  if (review.user.toString() !== userId.toString()) {
    throw new BadRequestError("Not allowed to edit this review");
  }

  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;

  await review.save();

  await updateProductAverage(review.product);

  return review;
};

/* =========================
   DELETE REVIEW (Admin)
========================= */

export const deleteReviewService = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) throw new NotFoundError("Review not found");

  const productId = review.product;

  await review.deleteOne();

  await Product.findByIdAndUpdate(productId, {
    $pull: { reviews: reviewId },
  });



  await updateProductAverage(productId);

  return true;
};

/* =========================
   GET PRODUCT REVIEWS
========================= */

export const getProductReviewsService = async (productId) => {
  return await Review.find({ product: productId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

/* =========================
   ADMIN: GET ALL REVIEWS
========================= */

export const getAllReviewsService = async () => {
  return await Review.find()
    .populate("user", "name email")
    .populate("product", "name price");
};