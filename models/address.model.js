import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
  type: String,
  enum: ["home", "office", "other", "Home", "Office"],
  default: "home",
  required: true
},
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
    fullName: {type: String},
    phone: {type: Number}
  },
  { timestamps: true }
);

// Optional: Ensure only one default address per user (stronger DB-level rule)
addressSchema.index({ user: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true } });

const Address = mongoose.model("Address", addressSchema);

export default Address;
