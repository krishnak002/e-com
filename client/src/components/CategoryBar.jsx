import { categories } from "../data/products";
export default function CategoryBar({ category, setCategory }) {
  return (
    <section className="categories">
      {categories.map(([name, icon]) => (
        <button
          key={name}
          className={category === name ? "active" : ""}
          onClick={() => setCategory(category === name ? "All" : name)}
        >
          <span>{icon}</span>
          {name}
        </button>
      ))}
    </section>
  );
}
