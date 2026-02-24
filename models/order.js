import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,      
    price: Number,     
    quantity: Number,
    image: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },

    items: [orderItemSchema],

    totalItems: {
      type: Number,
      required: true
    },

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Paid',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Refunded'
      ],
      default: 'Pending'
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: Date
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
