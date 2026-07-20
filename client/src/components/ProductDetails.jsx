import { useState } from "react";
import { money } from "../utils/currency";

export default function ProductDetails({
  product,
  user,
  close,
  addToCart,
  addReview,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (!product) return null;
  const reviews = product.customerReviews || [];
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addReview(product, { rating, comment });
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Review could not be added");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="product-detail-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <article className="product-detail-modal">
        <button className="detail-close" onClick={close}>
          ×
        </button>
        <div className="detail-main">
          <div className="detail-gallery">
            <span>{product.badge}</span>
            <img src={product.image} alt={product.title} />
            <small>✓ Genuine product · 7-day replacement</small>
          </div>
          <div className="detail-info">
            <p className="detail-category">{product.category}</p>
            <h1>{product.title}</h1>
            <div className="detail-rating">
              <b>{product.rating} ★</b>
              <span>{product.reviews || reviews.length} ratings & reviews</span>
            </div>
            <div className="detail-price">
              <strong>{money(product.price)}</strong>
              <del>{money(product.mrp)}</del>
              <em>
                {Math.round((1 - product.price / product.mrp) * 100)}% off
              </em>
            </div>
            <p className="tax-note">Inclusive of all taxes · Free delivery</p>
            <div className="detail-stock">
              <span
                className={
                  Number(product.stock) !== 0 ? "available" : "unavailable"
                }
              ></span>
              {Number(product.stock) !== 0
                ? `In stock${product.stock ? ` · ${product.stock} units available` : ""}`
                : "Currently unavailable"}
            </div>
            <div className="detail-actions">
              <button onClick={() => addToCart(product)}>🛒 Add to cart</button>
              <button
                onClick={() => {
                  addToCart(product);
                  close();
                }}
              >
                Buy now
              </button>
            </div>
            <div className="detail-benefits">
              <div>
                🚚
                <span>
                  <b>Free delivery</b>
                  <small>On this product</small>
                </span>
              </div>
              <div>
                ↩
                <span>
                  <b>Easy returns</b>
                  <small>7-day replacement</small>
                </span>
              </div>
              <div>
                🛡
                <span>
                  <b>Secure shopping</b>
                  <small>Protected checkout</small>
                </span>
              </div>
            </div>
          </div>
        </div>
        <section className="product-description">
          <h2>Product description</h2>
          <p>
            {product.description ||
              `${product.title} is a carefully selected ${product.category.toLowerCase()} product offering reliable quality, excellent value and dependable everyday performance.`}
          </p>
          <div className="spec-grid">
            <div>
              <span>Category</span>
              <b>{product.category}</b>
            </div>
            <div>
              <span>Offer</span>
              <b>{product.badge}</b>
            </div>
            <div>
              <span>Availability</span>
              <b>{Number(product.stock) !== 0 ? "In stock" : "Out of stock"}</b>
            </div>
            <div>
              <span>Rating</span>
              <b>{product.rating} / 5</b>
            </div>
          </div>
        </section>
        <section className="reviews-section">
          <div className="reviews-heading">
            <div>
              <h2>Ratings & reviews</h2>
              <p>Feedback from verified ShopKart customers</p>
            </div>
            <strong>
              {product.rating}
              <small>★ out of 5</small>
            </strong>
          </div>
          <div className="reviews-layout">
            <div className="review-list">
              {reviews.length ? (
                reviews.map((review, index) => (
                  <div className="customer-review" key={review._id || index}>
                    <div className="review-avatar">
                      {review.name?.charAt(0)}
                    </div>
                    <div>
                      <b>
                        {review.name}
                        <span>{review.rating} ★</span>
                      </b>
                      <p>{review.comment}</p>
                      <small>
                        Verified purchase ·{" "}
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                            )
                          : "Just now"}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <span>☆</span>
                  <b>No written reviews yet</b>
                  <p>Be the first customer to review this product.</p>
                </div>
              )}
            </div>
            <form className="review-form" onSubmit={submit}>
              <h3>Write a review</h3>
              {user ? (
                <>
                  <label>
                    Your rating
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((x) => (
                        <option key={x} value={x}>
                          {x} stars
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Your review
                    <textarea
                      required
                      minLength="10"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your product experience..."
                    />
                  </label>
                  {error && <p className="form-error">{error}</p>}
                  <button disabled={loading}>
                    {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                </>
              ) : (
                <p>Please login to share your product review.</p>
              )}
            </form>
          </div>
        </section>
      </article>
    </div>
  );
}
