import ProductCard from "./ProductCard";
export default function ProductGrid({
  products,
  wishlist,
  toggleWish,
  addToCart,
  openProduct,
}) {
  if (!products.length)
    return (
      <div className="empty-search">
        🔎<h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    );
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          liked={wishlist.includes(product._id || product.id)}
          toggleWish={toggleWish}
          addToCart={addToCart}
          openProduct={openProduct}
        />
      ))}
    </div>
  );
}
