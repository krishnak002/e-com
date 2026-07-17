const benefits = [
  { icon: "🚚", title: "Free Delivery", description: "On orders above ₹499" },
  { icon: "↩️", title: "7 Days Return", description: "Hassle-free returns" },
  { icon: "🛡️", title: "Secure Payment", description: "100% protected" },
  { icon: "🎧", title: "24/7 Support", description: "We are here to help" },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Shopping benefits">
      {benefits.map(({ icon, title, description }) => (
        <div key={title}>
          <b aria-hidden="true">{icon}</b>
          <span>
            <strong>{title}</strong>
            <small>{description}</small>
          </span>
        </div>
      ))}
    </section>
  );
}
