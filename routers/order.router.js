import { Router } from "express";
import { authenticate, adminOnly } from "../middlewares/auth.js";
import {
  allOrders,
  createOrder,
  myOrders,
  updateOrder,
} from "../controllers/order.controller.js";

const router = Router();
router.post("/", authenticate, createOrder);
router.get("/mine", authenticate, myOrders);
router.get("/", authenticate, adminOnly, allOrders);
router.patch("/:id", authenticate, adminOnly, updateOrder);
export default router;
