"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./TranslationSubservices.css";

gsap.registerPlugin(ScrollTrigger);

const SUB = [
  {
    title: "Medical",
    desc: "Regulatory-grade translation for clinical trials, IFUs, and patient materials.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    title: "E-commerce",
    desc: "Product catalogs, PDPs, and campaigns tuned to convert in every market.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 6h2l2 11h11l2-8H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="21" r="1.4" fill="currentColor"/>
        <circle cx="18" cy="21" r="1.4" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "E-learning",
    desc: "Courseware, video, and assessments localized for global learners.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M2 8l10-4 10 4-10 4L2 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M6 10v5c0 2 3 3 6 3s6-1 6-3v-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Financial",
    desc: "Reports, filings, and investor comms translated with numeric precision.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 16l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Business",
    desc: "Contracts, pitches, and internal comms — clarity across every stakeholder.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    title: "Marketing",
    desc: "Transcreation that keeps brand voice, tone, and intent intact worldwide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 11v2a2 2 0 0 0 2 2h2l7 4V5L7 9H5a2 2 0 0 0-2 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M18 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Legal",
    desc: "Sworn, certified translation for contracts, filings, IP, and compliance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M5 8h14M6 8l-2 6a4 4 0 0 0 8 0L10 8m4 0-2 6a4 4 0 0 0 8 0l-2-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Technical",
    desc: "Engineering docs, manuals, and API references — with terminology control.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function TranslationSubservices() {
  const hscrollRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop-only: pin the horizontal scroller and translate the track.
      mm.add(
        "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const scroller = hscrollRef.current;
          if (!track || !scroller) return;

          const distance = () =>
            Math.max(0, track.scrollWidth - scroller.offsetWidth);
          // Extra scroll distance to burn AT THE START before the cards
          // begin sliding — makes the section pin and read as a static
          // headline for a moment before the horizontal reveal starts.
          const HOLD_PX = 700;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scroller,
              start: "top top+=80",
              end: () => `+=${distance() + HOLD_PX}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
          // Hold phase — nothing moves; user scrolls but section stays pinned.
          tl.to({}, { duration: HOLD_PX });
          // Scroll phase — cards slide horizontally as scroll continues.
          tl.to(track, {
            x: () => -distance(),
            duration: () => distance(),
            ease: "none",
          });

          return () => tl.scrollTrigger?.kill();
        }
      );
    },
    { scope: hscrollRef }
  );

  return (
    <section className="subsvc section" id="translation">
      {/* Everything below is pinned to the viewport during horizontal scroll:
          header (meta + mega title) stays visible up top while the track
          (description + all 8 specialty cards) slides sideways beneath it.
          The pin releases only after every card has passed. */}
      <div ref={hscrollRef} className="subsvc__hscroll">
        <div className="container subsvc__hscroll-header">
          <div className="subsvc__meta">
            <span className="subsvc__meta-dot" />
            100+ LANGUAGES · 24/7 GLOBAL COVERAGE
          </div>

          <h2 className="subsvc__mega-title">
            <span className="subsvc__mega-title-bright">
              Every word. Every context.
            </span>
            <span className="subsvc__mega-title-muted">In every language.</span>
          </h2>
        </div>

        <div ref={trackRef} className="subsvc__hscroll-track">
          {/* Description sits at the START of the track — first thing to
              read, before Medical Translation slides in. */}
          <div className="subsvc__hscroll-intro">
            <p>
              From clinical trials to marketing campaigns, our subject-matter
              linguists translate <strong>meaning</strong> — not just words.
            </p>
            <p>
              Terminology memory, LQA scoring, and native reviewers keep
              quality consistent across every domain we serve.
            </p>
          </div>

          {SUB.map((s, i) => (
            <article className="spec-card" key={s.title}>
              <span className="spec-card__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="spec-card__icon">{s.icon}</span>
              <h3 className="spec-card__title">
                {s.title}
                <br />
                Translation
              </h3>
              <p className="spec-card__desc">{s.desc}</p>
            </article>
          ))}
        </div>

        {/* Sticky centered CTA — stays fixed in the middle of the section
            while cards slide horizontally behind it. */}
        <div className="subsvc__sticky-cta" aria-hidden="false">
          <Link
            href="/services"
            className="btn btn-outline btn-outline--on-dark subsvc__cta"
          >
            Our translations
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
