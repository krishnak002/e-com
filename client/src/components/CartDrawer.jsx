import { money } from "../utils/currency";
export default function CartDrawer({
  open,
  close,
  cart,
  count,
  updateQty,
  removeItem,
  checkout,
}) {
  if (!open) return null;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = cart.reduce(
    (sum, item) => sum + (item.mrp - item.price) * item.qty,
    0,
  );
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <aside className="cart-drawer">
        <div className="drawer-head">
          <h2>
            My Cart <span>({count})</span>
          </h2>
          <button onClick={close}>×</button>
        </div>
        {cart.length ? (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>
                      <strong>{money(item.price)}</strong>{" "}
                      <del>{money(item.mrp)}</del>
                    </p>
                    <div className="quantity">
                      <button onClick={() => updateQty(item.id, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>+</button>
                      <button
                        className="remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary">
              <h3>Price Details</h3>
              <p>
                <span>Price ({count} items)</span>
                <b>{money(subtotal)}</b>
              </p>
              <p className="green">
                <span>You save</span>
                <b>{money(savings)}</b>
              </p>
              <p>
                <span>Delivery Charges</span>
                <b className="green">FREE</b>
              </p>
              <div>
                <span>Total Amount</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <button onClick={checkout}>PLACE ORDER</button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <span>🛒</span>
            <h3>Your cart is empty!</h3>
            <p>Add items to it now.</p>
            <button onClick={close}>Shop now</button>
          </div>
        )}
      </aside>
    </div>
  );
}
