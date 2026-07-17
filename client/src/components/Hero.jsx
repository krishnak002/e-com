export default function Hero() {
  return (
    <section className="hero">
      <div>
        <p>BIG SAVING DAYS</p>
        <h1>
          Up to 70% off
          <br />
          on top products
        </h1>
        <span>Best deals. Best prices. Every day.</span>
        <button
          onClick={() =>
            document
              .getElementById("products")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Shop Now →
        </button>
      </div>
      <div className="hero-art">
        <span>🎧</span>
        <span>⌚</span>
        <span>📱</span>
      </div>
    </section>
  );
}
