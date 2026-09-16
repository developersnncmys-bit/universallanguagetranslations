import "./TrustedBy.css";

const LOGOS = [
  "Northwind",
  "Contoso",
  "Fabrikam",
  "Globex",
  "Initech",
  "Umbrella",
  "Stark Industries",
];

export default function TrustedBy() {
  return (
    <section className="trusted">
      <div className="container">
        <p className="trusted__label">Trusted by teams shipping globally</p>
        <div className="trusted__marquee" aria-hidden="true">
          <ul className="trusted__track">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
