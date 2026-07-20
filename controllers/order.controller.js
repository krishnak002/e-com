import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { customer, address, items, payment } = req.body;
    if (!items?.length)
      return res.status(400).json({ message: "Cart is empty" });
    const safeItems = items.map((item) => ({
      product: item._id || undefined,
      title: item.title,
      image: item.image,
      price: Number(item.price),
      quantity: Number(item.qty),
    }));
    const subtotal = safeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const order = await Order.create({
      customer: { ...customer, user: req.user.id, email: req.user.email },
      address,
      items: safeItems,
      subtotal,
      payment: {
        method: payment.method,
        status: payment.method === "COD" ? "Pending" : "Paid",
        reference: payment.reference || "",
      },
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const myOrders = async (req, res) => {
  res.json(
    await Order.find({ "customer.user": req.user.id }).sort({ createdAt: -1 }),
  );
};

export const allOrders = async (_req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
};

export const updateOrder = async (req, res) => {
  try {
    const allowed = {};
    if (req.body.status) allowed.status = req.body.status;
    if (req.body.paymentStatus)
      allowed["payment.status"] = req.body.paymentStatus;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: allowed },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
