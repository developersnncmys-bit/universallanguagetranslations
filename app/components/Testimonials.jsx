import "./Testimonials.css";

const QUOTES = [
  {
    quote:
      "They translated 40,000 SKUs into six languages in three weeks — with zero regressions in our SEO. Genuinely a category-of-one partner. From the first briefing through delivery, terminology stayed consistent across regions and the QA scorecards came in ahead of every target we set.",
    name: "Priya Menon",
    role: "Head of Localization at Retail Group",
  },
  {
    quote:
      "Our clinical documentation team stopped worrying about regulatory reviews. Terminology is consistent, and turnarounds are honest. Every IFU, patient-facing summary and study report we pushed through them came back review-ready — no re-work cycles, no missed deadlines, no back-and-forth over glossary drift.",
    name: "Dr. Marcus Bauer",
    role: "Director of Regulatory Affairs at MedTech",
  },
  {
    quote:
      "Voiceover, subtitles, and multilingual training data — all under one contract. It made our launch calendar dramatically simpler. Their linguists locked scripts to native-tone quickly and their engineering team plugged directly into our CMS, so what used to be a three-vendor scramble became a single accountable partner.",
    name: "Ana Rodrigues",
    role: "VP Product at EdTech Platform",
  },
  {
    quote:
      "We shifted from patchwork freelancers to a single accountable partner and immediately saw quality lift across every market. Their subject-matter reviewers catch context our previous vendors quietly guessed at, and the delivery cadence has been the most reliable operating rhythm in our marketing stack.",
    name: "Sofia Almeida",
    role: "Global Marketing Lead at SaaS Platform",
  },
];

export default function Testimonials() {
  return (
    <section className="tst" id="testimonials">
      <div className="tst__container">
        {/* LEFT COLUMN — sticky headline block that stays visible while the
            right column scrolls through every testimonial. */}
        <div className="tst__sticky">
          {/* <span className="tst__eyebrow">
            <span className="tst__eyebrow-dot" />
            WHAT CLIENTS SAY
          </span> */}
          <h2 className="tst__mega">
            Trusted
            <br />
            by teams
            <br />
            that ship in
            <br />
            <span className="tst__mega--muted">every market</span>
          </h2>
        </div>

        {/* RIGHT COLUMN — testimonials stack vertically and scroll past the
            sticky headline. No photos, only name + role + quote. */}
        <div className="tst__scroller">
          {QUOTES.map((q, i) => (
            <article className="tst__item" key={q.name}>
              <div className="tst__author">
                <div className="tst__num">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="tst__name">{q.name}</div>
                <div className="tst__role">{q.role}</div>
              </div>
              <blockquote className="tst__quote">{q.quote}</blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
