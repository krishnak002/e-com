import { money } from "../utils/currency";

export default function ProductCard({
  product,
  liked,
  toggleWish,
  addToCart,
  openProduct,
}) {
  const id = product._id || product.id;
  return (
    <article className="product-card" onClick={() => openProduct(product)}>
      <div className="image-wrap">
        <span className="badge">{product.badge}</span>
        <button
          className={`wish ${liked ? "liked" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleWish(id);
          }}
        >
          ♥
        </button>
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <small>{product.category}</small>
        <h3>{product.title}</h3>
        <div className="rating">
          <b>{product.rating} ★</b>
          <span>({product.reviews})</span>
        </div>
        <div className="pricing">
          <strong>{money(product.price)}</strong>
          <del>{money(product.mrp)}</del>
          <em>{Math.round((1 - product.price / product.mrp) * 100)}% off</em>
        </div>
        <p>Free delivery</p>
        <button
          onClick={(event) => {
            event.stopPropagation();
            addToCart(product);
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </article>
  );
}
