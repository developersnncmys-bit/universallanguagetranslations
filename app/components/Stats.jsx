import "./Stats.css";

const STATS = [
  { value: "100+", label: "Languages covered" },
  { value: "2,500+", label: "Projects delivered" },
  { value: "99.4%", label: "On-time delivery" },
  { value: "24/7", label: "Global availability" },
];

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats__bar reveal-stagger">
          {STATS.map((s) => (
            <div className="stats__item" key={s.label}>
              <div className="stats__value">{s.value}</div>
              <div className="stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
