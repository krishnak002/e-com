import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import CheckoutModal from "./components/CheckoutModal";
import ProductDetails from "./components/ProductDetails";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import api from "./api/apiInstance";
import { products as demoProducts } from "./data/products";
import "./styles.css";
import "./admin.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [products, setProducts] = useState(demoProducts);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("shopkart-cart") || "[]"),
  );
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("shopkart-wishlist") || "[]"),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => {
        if (data.length) setProducts(data);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("shopkart-token");
    if (!token) return;
    api
      .get("/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("shopkart-token"));
  }, []);
  useEffect(
    () => localStorage.setItem("shopkart-cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("shopkart-wishlist", JSON.stringify(wishlist)),
    [wishlist],
  );
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.title.toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : b.rating - a.rating,
    );
  }, [products, query, category, sort]);
  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("shopkart-token")}`,
  });
  const authenticate = async (mode, credentials) => {
    const { data } = await api.post(`/user/${mode}`, credentials);
    localStorage.setItem("shopkart-token", data.token);
    setUser(data.user);
    setLoginOpen(false);
    setAdminOpen(data.user.role === "admin");
    setToast(`Welcome, ${data.user.name}!`);
  };
  const logout = () => {
    localStorage.removeItem("shopkart-token");
    setUser(null);
    setAdminOpen(false);
    setToast("Logged out successfully");
  };
  const saveProduct = async (id, payload) => {
    const { data } = id
      ? await api.patch(`/products/${id}`, payload, { headers: authHeaders() })
      : await api.post("/products", payload, { headers: authHeaders() });
    setProducts((items) =>
      id ? items.map((x) => (x._id === id ? data : x)) : [data, ...items],
    );
    setToast(id ? "Product updated" : "Product added");
  };
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`, { headers: authHeaders() });
    setProducts((items) => items.filter((x) => x._id !== id));
    setToast("Product deleted");
  };
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const addToCart = (product) => {
    if (!user) {
      setLoginOpen(true);
      setToast("Please login to add products to your cart");
      return;
    }

    setCart((items) =>
      items.some((i) => (i._id || i.id) === (product._id || product.id))
        ? items.map((i) =>
            (i._id || i.id) === (product._id || product.id)
              ? { ...i, qty: i.qty + 1 }
              : i,
          )
        : [...items, { ...product, qty: 1 }],
    );
    setToast("Item added to your cart");
  };
  const updateQty = (id, change) =>
    setCart((items) =>
      items
        .map((i) =>
          (i._id || i.id) === id ? { ...i, qty: i.qty + change } : i,
        )
        .filter((i) => i.qty > 0),
    );
  const toggleWish = (id) =>
    setWishlist((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id],
    );
  const loadOrders = async () => {
    const { data } = await api.get("/orders", { headers: authHeaders() });
    setOrders(data);
  };
  const placeOrder = async (form) => {
    const { data } = await api.post(
      "/orders",
      {
        customer: { name: form.name, phone: form.phone },
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        payment: { method: form.method, reference: form.reference },
        items: cart,
      },
      { headers: authHeaders() },
    );
    setOrders((items) => [data, ...items]);
    setCart([]);
    setCheckoutOpen(false);
    setToast("Order placed successfully!");
  };
  const updateOrder = async (id, payload) => {
    const { data } = await api.patch(`/orders/${id}`, payload, {
      headers: authHeaders(),
    });
    setOrders((items) => items.map((item) => (item._id === id ? data : item)));
    setToast("Order updated");
  };
  const addReview = async (product, review) => {
    if (!user) {
      setLoginOpen(true);
      throw new Error("Please login to add a review");
    }
    let updated;
    if (product._id) {
      const response = await api.post(
        `/products/${product._id}/reviews`,
        review,
        { headers: authHeaders() },
      );
      updated = response.data;
    } else {
      const customerReviews = [
        { ...review, name: user.name, createdAt: new Date().toISOString() },
        ...(product.customerReviews || []),
      ];
      updated = {
        ...product,
        customerReviews,
        reviews: String(customerReviews.length),
        rating: Number(
          (
            customerReviews.reduce(
              (sum, item) => sum + Number(item.rating),
              0,
            ) / customerReviews.length
          ).toFixed(1),
        ),
      };
    }
    setProducts((items) =>
      items.map((item) =>
        (item._id || item.id) === (updated._id || updated.id) ? updated : item,
      ),
    );
    setSelectedProduct(updated);
    setToast("Thank you for your review");
  };
  const checkout = () => {
    if (!user) {
      setCartOpen(false);
      setLoginOpen(true);
      setToast("Please login to continue");
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
    setToast("Complete your delivery and payment details");
  };

  if (user?.role === "admin" && adminOpen)
    return (
      <>
        <AdminDashboard
          user={user}
          products={products}
          orders={orders}
          loadOrders={loadOrders}
          updateOrder={updateOrder}
          saveProduct={saveProduct}
          deleteProduct={deleteProduct}
          logout={logout}
          close={() => setAdminOpen(false)}
        />
        <Toast message={toast} />
      </>
    );
  return (
    <div className="app">
      <Header
        query={query}
        setQuery={setQuery}
        user={user}
        count={count}
        openLogin={() => setLoginOpen(true)}
        openCart={() => setCartOpen(true)}
        openAdmin={() => setAdminOpen(true)}
        logout={logout}
      />
      <HomePage
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        products={visibleProducts}
        wishlist={wishlist}
        toggleWish={toggleWish}
        addToCart={addToCart}
        openProduct={setSelectedProduct}
      />
      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        count={count}
        updateQty={updateQty}
        removeItem={(id) =>
          setCart((x) => x.filter((i) => (i._id || i.id) !== id))
        }
        checkout={checkout}
      />
      <LoginModal
        open={loginOpen}
        close={() => setLoginOpen(false)}
        authenticate={authenticate}
      />
      <Toast message={toast} />
      <CheckoutModal
        open={checkoutOpen}
        close={() => setCheckoutOpen(false)}
        user={user}
        cart={cart}
        placeOrder={placeOrder}
      />
      <ProductDetails
        product={selectedProduct}
        user={user}
        close={() => setSelectedProduct(null)}
        addToCart={addToCart}
        addReview={addReview}
      />
    </div>
  );
}
