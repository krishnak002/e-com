import { useState } from "react";
import { money } from "../utils/currency";

export default function CheckoutModal({ open, close, user, cart, placeOrder }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    method: "COD",
    reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await placeOrder(form);
    } catch (err) {
      setError(err.response?.data?.message || "Order could not be placed");
      setLoading(false);
    }
  };
  return (
    <div className="checkout-overlay">
      <form className="checkout-modal" onSubmit={submit}>
        <div className="checkout-head">
          <div>
            <small>SECURE CHECKOUT</small>
            <h2>Delivery & payment</h2>
          </div>
          <button type="button" onClick={close}>
            ×
          </button>
        </div>
        <div className="checkout-body">
          <section>
            <h3>
              <span>1</span> Contact details
            </h3>
            <div className="checkout-grid">
              <label>
                Full name
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={change}
                />
              </label>
              <label>
                Phone number
                <input
                  required
                  name="phone"
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={change}
                />
              </label>
            </div>
            <h3>
              <span>2</span> Delivery address
            </h3>
            <div className="checkout-grid">
              <label className="wide">
                Address line 1
                <input
                  required
                  name="line1"
                  value={form.line1}
                  onChange={change}
                />
              </label>
              <label className="wide">
                Address line 2 (optional)
                <input name="line2" value={form.line2} onChange={change} />
              </label>
              <label>
                City
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={change}
                />
              </label>
              <label>
                State
                <input
                  required
                  name="state"
                  value={form.state}
                  onChange={change}
                />
              </label>
              <label>
                Pincode
                <input
                  required
                  name="pincode"
                  pattern="[0-9]{6}"
                  value={form.pincode}
                  onChange={change}
                />
              </label>
            </div>
            <h3>
              <span>3</span> Payment method
            </h3>
            <div className="payment-options">
              {[
                ["COD", "Cash on delivery"],
                ["UPI", "UPI payment"],
                ["CARD", "Credit / debit card"],
              ].map(([value, label]) => (
                <label
                  className={form.method === value ? "selected" : ""}
                  key={value}
                >
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={form.method === value}
                    onChange={change}
                  />
                  <span>
                    <b>{label}</b>
                    <small>
                      {value === "COD"
                        ? "Pay on delivery"
                        : "Demo payment · no card data stored"}
                    </small>
                  </span>
                </label>
              ))}
            </div>
            {form.method !== "COD" && (
              <label className="payment-reference">
                Transaction reference
                <input
                  required
                  name="reference"
                  value={form.reference}
                  onChange={change}
                />
              </label>
            )}
            {error && <p className="form-error">{error}</p>}
          </section>
          <aside className="order-review">
            <h3>Order summary</h3>
            {cart.map((item) => (
              <div className="review-item" key={item._id || item.id}>
                <img src={item.image} alt="" />
                <span>
                  {item.title}
                  <small>Qty: {item.qty}</small>
                </span>
                <b>{money(item.price * item.qty)}</b>
              </div>
            ))}
            <div className="review-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
            <p>🔒 Payment information is protected.</p>
            <button disabled={loading}>
              {loading ? "PLACING ORDER..." : `PLACE ORDER · ${money(total)}`}
            </button>
          </aside>
        </div>
      </form>
    </div>
  );
}
