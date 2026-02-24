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
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    
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
     averageRating: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
  type: Number,
  min: [0, "Discount cannot be negative"],
  max: [100, "Discount cannot exceed 100"],
  default: 0
},

discountPrice: {
  type: Number,
  min: 0
},


    category: {
  type: String,
  enum: ['skincare', 'accessories', 'electronics', 'clothing', 'shoes'],
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

    

    images: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  }
]
,
reviews: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
],

    
   
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
productSchema.pre("save", function (next) {
  if (this.discountPercentage > 0) {
    this.discountPrice =
      this.price - (this.price * this.discountPercentage) / 100;
  } else {
    this.discountPrice = this.price;
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