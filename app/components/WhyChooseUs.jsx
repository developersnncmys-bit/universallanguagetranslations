"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhyChooseUs.css";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: "Native linguists, vetted",
    desc: "Every project handled by in-country experts with subject-matter depth and a verifiable track record.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M4 20a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Quality you can measure",
    desc: "Multi-stage review, terminology memory, and LQA scoring on every delivery — not just a promise.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="m8.5 12 2.5 2.5L16 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "24/7 delivery, global SLAs",
    desc: "Follow-the-sun teams and clear turnaround guarantees keep your roadmap on schedule.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Enterprise-grade security",
    desc: "Signed NDAs, encrypted transfer, and role-scoped access — built for regulated industries.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="10"
          width="16"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8 10V7a4 4 0 0 1 8 0v3"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    title: "Transparent pricing",
    desc: "Clear per-word, per-minute, and project rates. No surprise fees, no hidden markups, ever.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3v18M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Human + AI, done right",
    desc: "Expert linguists paired with post-editing, TM, and LLM tooling to move faster without losing quality.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M10 3.5 11.6 8 16 9.6l-4.4 1.6L10 15.5l-1.6-4.3L4 9.6 8.4 8 10 3.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="m17 13.5.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6L13.5 17l2.6-.9.9-2.6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const featRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      featRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why" id="why" ref={sectionRef}>
      <div className="why__container">
        <div className="why__layout">
          {/* Left column — pins in place while the feature list scrolls past. */}
          <aside className="why__sticky">
            <span className="why__label">
              <span className="why__label-dot" />
              WHY US
            </span>
            <h2 className="why__title">
              <span className="why__title-accent">Translation that scales</span>{" "}
              <span className="why__title-bold">as fast as you do.</span>
            </h2>
            <p className="why__intro-desc">
              Six reasons global teams keep choosing us — quality, speed, and
              transparency that scale with your ambition.
            </p>
          </aside>

          {/* Right column — features reveal one at a time as they enter view. */}
          <div className="why__scroll">
            {FEATURES.map((f, i) => (
              <article
                className="why-feat"
                key={f.title}
                ref={(el) => (featRefs.current[i] = el)}
              >
                <div className="why-feat__head">
                  <span className="why-feat__num">
                    {String(i + 1).padStart(2, "0")}
                    <span className="why-feat__num-sep" aria-hidden="true" />
                  </span>
                  <span className="why-feat__icon" aria-hidden="true">
                    {f.icon}
                  </span>
                </div>
                <h3 className="why-feat__title">{f.title}</h3>
                <p className="why-feat__desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
