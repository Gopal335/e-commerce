import Product from '../../models/Product.js';
import AppError from '../utils/appError.js';

/* ======================================
   GET ALL PRODUCTS (Filter + Sort + Pagination)
====================================== */

export const getAllProductsService = async (queryParams) => {
  const {
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10,
    keyword
  } = queryParams;

  const filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (keyword) {
    filter.$text = { $search: keyword };
  }

  let sortOption = {};

  if (sort) {
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    sortOption[sortField] = sort.startsWith('-') ? -1 : 1;
  } else {
    sortOption.createdAt = -1;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products
  };
};


/* ======================================
   GET SINGLE PRODUCT
====================================== */

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id);

  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  return product;
};


/* ======================================
   CREATE PRODUCT (Admin)
====================================== */

export const createProductService = async (adminId, data) => {
  const product = await Product.create({
    ...data,
    createdBy: adminId
  });

  return product;
};


/* ======================================
   UPDATE PRODUCT (Admin)
====================================== */

export const updateProductService = async (id, updateData) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  Object.keys(updateData).forEach((key) => {
    product[key] = updateData[key];
  });

  await product.save();

  return product;
};


/* ======================================
   DELETE PRODUCT (Soft Delete)
====================================== */

export const deleteProductService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  product.isActive = false;
  await product.save();

  return true;
};