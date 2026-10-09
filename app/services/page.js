"use client";

import Link from "next/link";
import GlobeCanvas from "../components/GlobeCanvas";
import ServicesAnimations from "./ServicesAnimations";
import "./services.css";

const services = [
  {
    slug: "translation",
    image: "/images/translation.png",
    title: "Translation",
    blurb:
      "Document translation across 100+ languages — medical, legal, financial, marketing, technical, and more.",
    tag: "Core service",
    iconPath: "M4 6h10M4 12h7M4 18h12M15 4l5 5-5 5M20 9H9",
  },
  {
    slug: "transcription",
    image: "/images/transcription.png",
    title: "Transcription",
    blurb:
      "Accurate audio and video transcription — verbatim, clean read, time-stamped, speaker-labeled.",
    tag: "Audio to text",
    iconPath:
      "M9 2a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
  },
  {
    slug: "subtitles",
    image: "/images/subtitiles.png",
    title: "Subtitles",
    blurb:
      "Closed captions, SDH, open subtitles and localized subs for film, TV, OTT and e-learning.",
    tag: "SRT · VTT · TTML",
    iconPath: "M3 5h18v14H3zM7 14h3M12 14h5M7 10h2M11 10h6",
  },
  {
    slug: "voiceover",
    image: "/images/voiceover.png",
    title: "Voiceover",
    blurb:
      "Multilingual narration, character work, dubbing and e-learning voices — studio-grade delivery.",
    tag: "Studio-grade",
    iconPath:
      "M11 5L6 9H2v6h4l5 4zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14",
  },
  {
    slug: "data-annotation",
    image: "/images/data-annotation.png",
    title: "Data Annotation",
    blurb:
      "Text, audio, image and video annotation for machine learning — with multi-rater QA.",
    tag: "ML training data",
    iconPath:
      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  },
  {
    slug: "data-evolution",
    image: "/images/data-evolution.png",
    title: "Data Evolution",
    blurb:
      "Audit, clean, re-balance, re-label and augment existing ML datasets to lift model performance.",
    tag: "Dataset lifecycle",
    iconPath: "M3 3v18h18M7 15l4-4 4 4 5-5M18 10h3v3",
  },
  {
    slug: "multilingual-data-creation",
    image: "/images/multilingual-data.png",
    title: "Multilingual Data Creation",
    blurb:
      "Build parallel corpora, instruction datasets, speech data and multimodal pairs across locales.",
    tag: "From scratch",
    iconPath:
      "M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4-3.58 4-8 4-8-1.79-8-4zM4 7v5c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 12v5c0 2.21 3.58 4 8 4s8-1.79 8-4v-5",
  },
];

const differentiators = [
  {
    title: "Human-first linguists",
    text: "Subject-matter translators and native reviewers — not just MT output with a polish pass.",
  },
  {
    title: "Terminology memory",
    text: "Per-client glossaries and translation memory so language, tone and products stay consistent.",
  },
  {
    title: "Confidentiality by default",
    text: "NDAs, access control and secure handoffs for sensitive legal, medical and financial content.",
  },
  {
    title: "Scales with your pipeline",
    text: "From single documents to continuous multilingual data streams for ML and localisation at scale.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Scope",
    text: "Share your content, language pair, audience and timeline — we quote within hours.",
  },
  {
    num: "02",
    title: "Assign",
    text: "A subject-matter linguist (and reviewer) is assigned — matched to your domain.",
  },
  {
    num: "03",
    title: "Deliver",
    text: "Translation, QA pass and delivery in your required format — on schedule.",
  },
  {
    num: "04",
    title: "Iterate",
    text: "Feedback captured into glossary + TM so every future project is faster and tighter.",
  },
];

export default function ServicesPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      {/* HERO */}
      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div className="svc-hero-content">
            <span className="svc-eyebrow">What we do</span>
            <h1 className="svc-hero-title">
              Language services that connect your world.
            </h1>
            <p className="svc-hero-lead">
              From a single contract to a multilingual AI training set — we handle
              translation, transcription, subtitling, voiceover and multilingual
              data work with the same care for meaning, context and quality.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">
                Get a quote <span aria-hidden>↗</span>
              </Link>
              <a href="#all-services" className="svc-btn-secondary">
                See all services
              </a>
            </div>
          </div>

          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one">
              <span className="dot" />
              7 Core services
            </div>
            <div className="svc-hero-chip svc-hero-chip--two">
              <span className="dot" />
              AI-ready data
            </div>
            <div className="svc-hero-globe-wrap">
              <div className="svc-hero-globe-glow" />
              <div className="svc-hero-globe-canvas">
                <GlobeCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US — pinned scrubbed reveal */}
      <section className="svc-section svc-section--tint svc-why">
        <div className="svc-container">
          <div className="svc-section-head svc-why-head">
            <div>
              <span className="svc-eyebrow">Why clients choose us</span>
              <h2>
                Quality that <span className="accent">travels well.</span>
              </h2>
            </div>
            <p>
              Translation is more than word swap — it's about preserving intent,
              context and voice across every market you serve.
            </p>
          </div>

          <div className="svc-card-grid svc-why-grid">
            {differentiators.map((d, i) => (
              <div className="svc-card svc-why-card" key={d.title}>
                <span className="svc-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL SERVICES — industry-card style grid on dark hero palette */}
      <section className="svc-services" id="all-services">
        <div className="svc-services-container">

          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                OUR SERVICES
              </span>
              <h2 className="svc-services-heading">
                Seven services.
                <br />
                <span>One accountable team.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Each service is run by linguists and project leads with real
              industry depth — so your content moves between languages
              without losing meaning, tone, or compliance edges.
            </p>
          </div>

          <div className="svc-services-grid">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="svc-service-card"
              >
                <span className="svc-service-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="svc-service-card-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={s.iconPath} />
                  </svg>
                </span>

                <h4 className="svc-service-card-title">{s.title}</h4>

                <p className="svc-service-card-detail">{s.blurb}</p>

                <span className="svc-service-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* PROCESS */}
      <section className="svc-section svc-section--tint svc-process">
        <div className="svc-container">
          <div className="svc-section-head svc-process-head">
            <div>
              <span className="svc-eyebrow">How we work</span>
              <h2>
                Clear from <span className="accent">brief to delivery.</span>
              </h2>
            </div>
            <p>
              A tight, well-run process that keeps your project predictable —
              with the right linguists, QA pass and formats, every time.
            </p>
          </div>

          <div className="svc-process-grid">
            {processSteps.map((step) => (
              <div className="svc-process-step" key={step.num}>
                <span className="svc-process-num">{step.num}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <div className="svc-container">
          <div className="svc-cta-inner">
            <span className="svc-eyebrow">Let's connect</span>
            <h2>
              Ready to move your content <span className="accent">across languages?</span>
            </h2>
            <p>
              Share your brief — we'll come back with a scoped quote,
              timeline and the right linguists for your domain.
            </p>
            <Link href="/contact" className="svc-btn-primary">
              Get in touch <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
