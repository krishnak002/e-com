import { Router } from "express";
import {
  register,
  login,
  me,
  getAllUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import validation from "../middlewares/validation.js";
import { adminOnly, authenticate } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", validation, register);
userRouter.post("/login", login);
userRouter.get("/me", authenticate, me);
userRouter.get("/get-all-user", authenticate, adminOnly, getAllUser);
userRouter.delete("/delete-user/:id", authenticate, adminOnly, deleteUser);
userRouter.patch("/update-user/:id", authenticate, adminOnly, updateUser);

export default userRouter;
