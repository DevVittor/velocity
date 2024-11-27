import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
      required: [true, "O nome do produto é obrigatório"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "O preço do produto é obrigatório"],
      min: [0, "O preço não pode ser negativo"],
    },
    category: {
      type: String,
      required: [true, "A categoria é obrigatória"],
      enum: ["electronics", "clothing", "food", "furniture", "others"],
      default: "others",
    },
    stock: {
      type: Number,
      required: [true, "A quantidade em estoque é obrigatória"],
      min: [0, "O estoque não pode ser negativo"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

export default productModel;
