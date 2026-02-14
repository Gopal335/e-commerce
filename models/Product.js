import mongoose from 'mongoose';
import slugify from 'slugify';

/* ==============================
   PRODUCT SCHEMA
============================== */

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters']
    },

    slug: {
      type: String,
      unique: true
    },

    description: {
      type: String,
      required: [true, 'Product description is required']
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },

    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount price must be less than regular price'
      }
    },

    category: {
  type: String,
  required: true
},

    brand: {
      type: String,
      trim: true
    },

    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },

    sold: {
      type: Number,
      default: 0
    },

    images: [
      {
        type: String
      }
    ],

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    numReviews: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);




/* ==============================
   INDEXES (Important for Production)
============================== */

// Text search index
productSchema.index({ name: 'text', description: 'text' });

// Price index for faster filtering
productSchema.index({ price: 1 });

// Category index
productSchema.index({ category: 1 });



/* ==============================
   MIDDLEWARE
============================== */

// Generate slug before saving
productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
});



/* ==============================
   VIRTUAL: inStock
============================== */

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});



/* ==============================
   EXPORT MODEL
============================== */

const Product = mongoose.model('Product', productSchema);

export default Product;