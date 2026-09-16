"use client";

import { useState } from "react";
import "./FAQ.css";

const FAQS = [
  {
    q: "What does Universal Language Translations do?",
    a: "We're an end-to-end language services partner delivering premium translation, transcription, subtitles, voiceover and multilingual data services across 100+ language pairs — engineered for global brands who care about precision, tone, and time-to-market.",
  },
  {
    q: "What industries do you specialise in?",
    a: "Medical, legal, financial, e-commerce, e-learning, marketing, business and technical translation. Every project is handled by native linguists with subject-matter depth in the relevant vertical.",
  },
  {
    q: "How fast is your turnaround?",
    a: "Most standard-length projects are quoted with a same-day or next-business-day start. We commit to a delivery date on the quote and hit it — 24/7 coverage means we can chase deadlines across time zones without losing quality.",
  },
  {
    q: "Do you offer certified or sworn translation?",
    a: "Yes. Sworn and certified translations are available for legal, immigration, regulatory and academic use cases in the jurisdictions we serve. Every certified delivery includes the translator's declaration and any required apostille handling.",
  },
  {
    q: "How is pricing calculated?",
    a: "Pricing is quoted per source word (translation), per audio minute (transcription/subtitles/voiceover) or per hour (data annotation) depending on the service. Volume discounts, TM leverage and terminology reuse are applied transparently on the quote.",
  },
  {
    q: "Do you handle voiceover and subtitles?",
    a: "Yes. Native-tone voiceover, dubbing, timed subtitles (SRT/VTT/burned-in) and forced narratives — with engineering that plugs directly into your CMS, LMS or video pipeline.",
  },
  {
    q: "Can you work with our terminology and style guides?",
    a: "Absolutely — that's expected. We ingest your glossaries, style guides and past bilingual assets, build translation memory, and run LQA scorecards so quality stays consistent across every domain and market you serve.",
  },
  {
    q: "How do we get started?",
    a: "Send us the source files (or a description of the project), your target languages and deadline. We reply within one business day with a scoped quote, timeline and named account contact — no obligation, no spam.",
  },
];

function FAQItem({ num, q, a, isOpen, onToggle }) {
  return (
    <div className={`faq__item ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="faq__q"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq__num">{String(num).padStart(2, "0")}</span>
        <span className="faq__q-text">{q}</span>
        <span className="faq__icon" aria-hidden="true">
          <span className="faq__icon-dot" />
        </span>
      </button>
      <div className="faq__a-wrap">
        <div className="faq__a">
          <div className="faq__a-num" aria-hidden="true" />
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="faq" id="faq">
      <div className="faq__container">
        {/* LEFT — big title + intro */}
        <div className="faq__intro">
          <h2 className="faq__title">F.A.Q</h2>
          <p className="faq__desc">
            Straightforward answers, so you can move forward with confidence.
          </p>
        </div>

        {/* MIDDLE — accordion list */}
        <div className="faq__list">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              num={i + 1}
              q={item.q}
              a={item.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

        {/* RIGHT — small help sidebar */}
        <aside className="faq__help">
          <p className="faq__help-text">
            Still have questions? Our team is here to help.
          </p>
          <a href="mailto:hello@example.com" className="faq__help-link">
            Email us
          </a>
        </aside>
      </div>
    </section>
  );
}
