import CategoryBar from "../components/CategoryBar";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export default function HomePage({
  category,
  setCategory,
  sort,
  setSort,
  products,
  wishlist,
  toggleWish,
  addToCart,
  openProduct,
}) {
  return (
    <>
      <main id="top">
        <CategoryBar category={category} setCategory={setCategory} />
        <Hero />
        <Benefits />
        <section className="products-section" id="products">
          <div className="section-head">
            <div>
              <p>HANDPICKED FOR YOU</p>
              <h2>
                {category === "All"
                  ? "Best Deals on Top Products"
                  : `Top ${category} Deals`}
              </h2>
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Sort: Popular</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
          <ProductGrid
            products={products}
            wishlist={wishlist}
            toggleWish={toggleWish}
            addToCart={addToCart}
            openProduct={openProduct}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
