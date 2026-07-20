import Product from "../models/product.model.js";

export const listProducts = async (_req, res) => {
  try {
    res.json(await Product.find().sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (rating < 1 || rating > 5 || !comment)
      return res
        .status(400)
        .json({ message: "Rating and review are required" });
    product.customerReviews.unshift({
      user: req.user.id,
      name: req.user.name,
      rating,
      comment,
    });
    const total = product.customerReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    product.rating = Number(
      (total / product.customerReviews.length).toFixed(1),
    );
    product.reviews = String(product.customerReviews.length);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
