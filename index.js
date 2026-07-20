import express from "express";
import db from "./configs/db.js";
import userRouter from "./routers/user.router.js";
import productRouter from "./routers/product.router.js";
import orderRouter from "./routers/order.router.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      const isLocalFrontend =
        !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
      callback(
        isLocalFrontend ? null : new Error("Origin not allowed by CORS"),
        isLocalFrontend,
      );
    },
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "server start." });
});

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server start");
    console.log("https://localhost:" + port);
  }
});
