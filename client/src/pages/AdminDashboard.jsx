import { useEffect, useMemo, useState } from "react";
import { money } from "../utils/currency";

const defaults = [
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home",
  "Appliances",
  "Beauty",
  "Grocery",
];
const emptyForm = {
  title: "",
  category: "Electronics",
  price: "",
  mrp: "",
  image: "",
  description: "",
  badge: "New",
  stock: 1,
  rating: 4,
  reviews: "0",
};

export default function AdminDashboard({
  user,
  products,
  orders,
  loadOrders,
  updateOrder,
  saveProduct,
  deleteProduct,
  logout,
  close,
}) {
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [customCategories, setCustomCategories] = useState([]);
  useEffect(() => {
    loadOrders().catch(() => {});
    // Orders are loaded once when the admin workspace opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const categories = useMemo(
    () => [
      ...new Set([
        ...defaults,
        ...products.map((p) => p.category),
        ...customCategories,
      ]),
    ],
    [products, customCategories],
  );
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.subtotal, 0);
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await saveProduct(editing, {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        rating: Number(form.rating),
      });
      setForm(emptyForm);
      setEditing(null);
    } catch (err) {
      setError(err.response?.data?.message || "Product could not be saved");
    }
  };
  const edit = (product) => {
    setEditing(product._id);
    setForm({ ...emptyForm, ...product });
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const nav = [
    ["overview", "▦", "Overview"],
    ["orders", "▤", "Orders"],
    ["products", "□", "Products"],
    ["categories", "◇", "Categories"],
  ];
  return (
    <main className="admin-shell">
      <aside className="pro-sidebar">
        <div className="pro-brand">
          <span>S</span>
          <div>
            ShopKart<small>COMMERCE ADMIN</small>
          </div>
        </div>
        <div className="admin-profile">
          <div>{user.name.charAt(0).toUpperCase()}</div>
          <span>
            <b>{user.name}</b>
            <small>Administrator</small>
          </span>
        </div>
        <nav>
          {nav.map(([id, icon, label]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <i>{icon}</i>
              {label}
              {id === "orders" && orders.length > 0 && <em>{orders.length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={close}>← View storefront</button>
          <button onClick={logout}>↪ Sign out</button>
        </div>
      </aside>
      <section className="admin-workspace">
        <header className="pro-topbar">
          <div>
            <small>SHOPKART / {tab.toUpperCase()}</small>
            <h1>
              {tab === "overview"
                ? "Good day, " + user.name.split(" ")[0]
                : tab[0].toUpperCase() + tab.slice(1)}
            </h1>
          </div>
          <div className="top-actions">
            <button
              onClick={() => {
                setTab("products");
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              ＋ Add product
            </button>
            <span>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </header>
        {tab === "overview" && (
          <>
            <div className="metric-grid">
              <Metric
                icon="₹"
                label="Total revenue"
                value={money(revenue)}
                note="All non-cancelled orders"
                tone="purple"
              />
              <Metric
                icon="▤"
                label="Total orders"
                value={orders.length}
                note={`${orders.filter((o) => o.status === "Placed").length} awaiting confirmation`}
                tone="blue"
              />
              <Metric
                icon="□"
                label="Active products"
                value={products.length}
                note={`${lowStock} low in stock`}
                tone="green"
              />
              <Metric
                icon="◉"
                label="Customers"
                value={new Set(orders.map((o) => o.customer?.email)).size}
                note="Unique order customers"
                tone="orange"
              />
            </div>
            <div className="dashboard-grid">
              <div className="panel">
                <PanelTitle
                  title="Recent orders"
                  action="View all"
                  onClick={() => setTab("orders")}
                />
                <OrderTable
                  orders={orders.slice(0, 6)}
                  updateOrder={updateOrder}
                />
              </div>
              <div className="panel inventory-panel">
                <PanelTitle
                  title="Inventory health"
                  action="Manage"
                  onClick={() => setTab("products")}
                />
                {products.slice(0, 6).map((p) => (
                  <div className="inventory-row" key={p._id || p.id}>
                    <img src={p.image} alt="" />
                    <span>
                      <b>{p.title}</b>
                      <small>{p.category}</small>
                    </span>
                    <strong className={Number(p.stock) <= 5 ? "low" : ""}>
                      {p.stock ?? 0} left
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab === "orders" && (
          <div className="panel page-panel">
            <PanelTitle
              title="All customer orders"
              subtitle="Track fulfilment, customer address and payment status"
            />
            <OrderTable orders={orders} updateOrder={updateOrder} detailed />
          </div>
        )}
        {tab === "products" && (
          <>
            <form className="panel pro-product-form" onSubmit={submit}>
              <PanelTitle
                title={editing ? "Edit product" : "Create a product"}
                subtitle="Complete catalogue information and inventory"
              />
              <div className="form-grid">
                <label>
                  Product title
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {categories.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Selling price
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </label>
                <label>
                  MRP
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  />
                </label>
                <label className="span-two">
                  Product image URL
                  <input
                    required
                    type="url"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </label>
                <label className="span-two">
                  Product description
                  <textarea
                    required
                    rows="4"
                    value={form.description}
                    placeholder="Describe features, quality and ideal use..."
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </label>
                <label>
                  Available stock
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </label>
                <label>
                  Promotional badge
                  <input
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                  />
                </label>
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="form-actions">
                <button>{editing ? "Save changes" : "Publish product"}</button>
                {editing && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setEditing(null);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <div className="panel page-panel">
              <PanelTitle
                title="Product catalogue"
                subtitle={`${products.length} products across ${categories.length} categories`}
              />
              <ProductTable
                products={products}
                edit={edit}
                deleteProduct={deleteProduct}
              />
            </div>
          </>
        )}
        {tab === "categories" && (
          <div className="category-layout">
            <div className="panel category-create">
              <PanelTitle
                title="Add category"
                subtitle="Use categories to organise your catalogue"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newCategory.trim()) {
                    setCustomCategories((x) => [...x, newCategory.trim()]);
                    setNewCategory("");
                  }
                }}
              >
                <label>
                  Category name
                  <input
                    required
                    placeholder="e.g. Books"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </label>
                <button>Add category</button>
              </form>
            </div>
            <div className="panel">
              <PanelTitle
                title="Catalogue categories"
                subtitle={`${categories.length} active categories`}
              />
              <div className="category-list">
                {categories.map((name) => (
                  <div key={name}>
                    <span>{name.charAt(0)}</span>
                    <b>
                      {name}
                      <small>
                        {products.filter((p) => p.category === name).length}{" "}
                        products
                      </small>
                    </b>
                    <em>Active</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ icon, label, value, note, tone }) {
  return (
    <div className="metric-card">
      <span className={tone}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
    </div>
  );
}
function PanelTitle({ title, subtitle, action, onClick }) {
  return (
    <div className="panel-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <button onClick={onClick}>{action} →</button>}
    </div>
  );
}
function OrderTable({ orders, updateOrder, detailed }) {
  return (
    <div className="pro-table-wrap">
      <table className="pro-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            {detailed && <th>Delivery address</th>}
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((o) => (
              <tr key={o._id}>
                <td>
                  <b>#{o._id.slice(-6).toUpperCase()}</b>
                  <small>
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </small>
                </td>
                <td>
                  <b>{o.customer?.name}</b>
                  <small>
                    {o.customer?.phone}
                    <br />
                    {o.customer?.email}
                  </small>
                </td>
                {detailed && (
                  <td className="address-cell">
                    {o.address?.line1}, {o.address?.line2}
                    <br />
                    {o.address?.city}, {o.address?.state} - {o.address?.pincode}
                  </td>
                )}
                <td>
                  <b>{o.payment?.method}</b>
                  <select
                    className={`payment-status ${o.payment?.status?.toLowerCase()}`}
                    value={o.payment?.status}
                    onChange={(e) =>
                      updateOrder(o._id, { paymentStatus: e.target.value })
                    }
                  >
                    {["Pending", "Paid", "Failed", "Refunded"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <b>{money(o.subtotal)}</b>
                  <small>{o.items?.length} items</small>
                </td>
                <td>
                  <select
                    className={`order-status ${o.status?.toLowerCase()}`}
                    value={o.status}
                    onChange={(e) =>
                      updateOrder(o._id, { status: e.target.value })
                    }
                  >
                    {[
                      "Placed",
                      "Confirmed",
                      "Packed",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-row">
                No orders yet. New customer orders will appear here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function ProductTable({ products, edit, deleteProduct }) {
  return (
    <div className="pro-table-wrap">
      <table className="pro-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Inventory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id || p.id}>
              <td>
                <div className="product-cell">
                  <img src={p.image} alt="" />
                  <span>
                    <b>{p.title}</b>
                    <small>{p.badge}</small>
                  </span>
                </div>
              </td>
              <td>{p.category}</td>
              <td>
                <b>{money(p.price)}</b>
                <small>
                  <del>{money(p.mrp)}</del>
                </small>
              </td>
              <td>
                <span
                  className={Number(p.stock) <= 5 ? "stock-low" : "stock-ok"}
                >
                  {p.stock ?? 0} in stock
                </span>
              </td>
              <td>
                <button
                  className="table-action"
                  disabled={!p._id}
                  onClick={() => edit(p)}
                >
                  Edit
                </button>
                <button
                  className="table-action danger"
                  disabled={!p._id}
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
