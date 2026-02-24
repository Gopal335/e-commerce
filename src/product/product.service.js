import Product from '../../models/Product.js';
import {
  NotFoundError,
  BadRequestError
} from '../../utils/appError.js';
import Image from '../../models/image.js';
import Review from '../../models/review.model.js';
import mongoose from "mongoose";
/* ======================================
   GET ALL PRODUCTS
====================================== */

export const getAllProductsService = async (queryParams) => {
  const {
    category,
    minPrice,
    maxPrice,
    rating,
    keyword,
    sort = "-createdAt",
    page = 1,
    limit = 10,
  } = queryParams;

  const matchStage = {};

  if (category) matchStage.category = category;

  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = Number(minPrice);
    if (maxPrice) matchStage.price.$lte = Number(maxPrice);
  }

  if (rating) matchStage.averageRating = { $gte: Number(rating) };

  if (keyword) {
    matchStage.$text = { $search: keyword };
  }

  const sortStage = {};
  sort.split(",").forEach((field) => {
    if (field.startsWith("-")) {
      sortStage[field.substring(1)] = -1;
    } else {
      sortStage[field] = 1;
    }
  });

  const skip = (page - 1) * limit;

  const result = await Product.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "images",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },

    {
      $project: {
        sold: 0,
        numReviews: 0,
      },
    },

    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: sortStage },
          { $skip: skip },
          { $limit: Number(limit) },
        ],
      },
    },
  ]);

  return {
    total: result[0].metadata[0]?.total || 0,
    products: result[0].data,
  };
};


/* ======================================
   GET PRODUCT BY ID
====================================== */



export const getProductByIdService = async (id) => {
  const result = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },

    // Images lookup
    {
      $lookup: {
        from: "images",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },

    {
      $addFields: {
        images: {
          $map: {
            input: "$images",
            as: "img",
            in: { url: "$$img.url" },
          },
        },
      },
    },

    // Reviews lookup (ONLY 1)
    {
      $lookup: {
        from: "reviews",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$product", "$$productId"] },
            },
          },
          { $sort: { createdAt: -1 } }, // latest first
          { $limit: 1 },

          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },

          {
            $project: {
              rating: 1,
              comment: 1,
              createdAt: 1,
              "user.name": 1,
            },
          },
        ],
        as: "reviews",
      },
    },

    {
      $project: {
        sold: 0,
        isActive: 0,
        ratings: 0,
      },
    },
  ]);

  if (!result.length) {
    throw new NotFoundError("Product not found");
  }

  return result[0];
};


/* ======================================
   CREATE PRODUCT
====================================== */

export const createProductService = async (adminId, data, files) => {

  if (!data.name || !data.price) {
    throw new BadRequestError("Name and price are required");
  }

  const product = await Product.create({
    ...data,
    createdBy: adminId,
  });

  if (files && files.length > 0) {

    const imageDocs = await Promise.all(files.map(file =>
        Image.create({
          url: file.path,
          public_id: file.filename,
          product: product._id,
          uploadedBy: adminId,
        })
      ));

    product.images = imageDocs.map(img => img._id);
    await product.save();
  }

  return product;
};



/* ======================================
   UPDATE PRODUCT
====================================== */

export const updateProductService = async (id, updateData) => {

  if (updateData.price || updateData.discountPercentage) {

    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const price = updateData.price ?? product.price;
    const discountPercentage =
      updateData.discountPercentage ?? product.discountPercentage;

    updateData.discountPrice =
      price - (price * discountPercentage) / 100;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  return updatedProduct;
};


/* ======================================
   DELETE PRODUCT (Soft Delete)
====================================== */

export const deleteProductService = async (id) => {

  const product = await Product.findById(id);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  
  await product.deleteOne();

  return true;
};


