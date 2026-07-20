import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    reviews: { type: String, default: "0" },
    image: { type: String, required: true },
    badge: { type: String, default: "New" },
    stock: { type: Number, default: 1, min: 0 },
    description: {
      type: String,
      default: "A quality product selected for dependable everyday use.",
      trim: true,
    },
    customerReviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("product", productSchema);
