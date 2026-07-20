import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  addReview,
} from "../controllers/product.controller.js";
import { adminOnly, authenticate } from "../middlewares/auth.js";

const productRouter = Router();
productRouter.get("/", listProducts);
productRouter.post("/", authenticate, adminOnly, createProduct);
productRouter.patch("/:id", authenticate, adminOnly, updateProduct);
productRouter.post("/:id/reviews", authenticate, addReview);
productRouter.delete("/:id", authenticate, adminOnly, deleteProduct);

export default productRouter;
