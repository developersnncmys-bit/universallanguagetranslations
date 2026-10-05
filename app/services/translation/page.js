"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Document translation",
  "Website localization",
  "Marketing transcreation",
  "Certified translation",
  "Glossary & TM management",
  "Multilingual DTP",
  "Native-speaker review",
  "Terminology QA",
];

const industries = [
  {
    slug: "medical",
    tag: "Industry 01",
    title: "Medical",
    text: "Regulatory-grade translation for clinical trials, IFUs, patient materials and life-sciences documentation.",
    iconPath: "M12 3v18M3 12h18",
  },
  {
    slug: "e-commerce",
    tag: "Industry 02",
    title: "E-commerce",
    text: "Product catalogs, PDPs and campaigns tuned to convert in every market — on-brand, in local voice.",
    iconPath: "M3 3h2l2 12h12l2-8H6M9 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z",
  },
  {
    slug: "e-learning",
    tag: "Industry 03",
    title: "E-learning",
    text: "Courseware, video scripts and assessments localized for global learners — integrated with your LMS.",
    iconPath: "M12 3 2 8l10 5 10-5-10-5zM6 10.6V15c0 1.1 2.7 3 6 3s6-1.9 6-3v-4.4",
  },
  {
    slug: "financial",
    tag: "Industry 04",
    title: "Financial",
    text: "Annual reports, filings, prospectuses and investor comms translated with numeric and regulatory precision.",
    iconPath: "M4 20V9m6 11V4m6 16v-7m6 7V11",
  },
  {
    slug: "business",
    tag: "Industry 05",
    title: "Business",
    text: "Contracts, pitches, HR policies and internal comms — clarity across every stakeholder and region.",
    iconPath: "M4 7h16v12H4zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
  },
  {
    slug: "marketing",
    tag: "Industry 06",
    title: "Marketing",
    text: "Transcreation for campaigns, slogans and brand copy — keeps tone, intent and emotion intact worldwide.",
    iconPath: "M3 10v4h4l5 5V5L7 10H3zM16 8a4 4 0 0 1 0 8",
  },
  {
    slug: "legal",
    tag: "Industry 07",
    title: "Legal",
    text: "Sworn and certified translation for contracts, filings, IP and compliance work — confidentiality assured.",
    iconPath: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z",
  },
  {
    slug: "technical",
    tag: "Industry 08",
    title: "Technical",
    text: "Engineering docs, manuals and API references translated with strict terminology control.",
    iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16",
  },
];

const deliverables = [
  "DOCX · PDF · InDesign",
  "HTML · XLIFF · JSON",
  "SRT · VTT · TTML",
  "Figma · XML · PO",
];

const processSteps = [
  { num: "01", title: "Scope & quote", text: "You share source files, language pair and audience; we quote with timeline and glossary approach." },
  { num: "02", title: "Translate", text: "A domain linguist translates — using your approved glossary and translation memory where available." },
  { num: "03", title: "Review", text: "A second native reviewer runs linguistic and terminology QA against your brand and compliance rules." },
  { num: "04", title: "Deliver", text: "Final files in your required format — plus updated glossary and TM for future projects." },
];

export default function TranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      {/* HERO */}
      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Translation Services</span>
            <h1 className="svc-hero-title">
              Translation that <span className="accent">preserves meaning.</span>
            </h1>
            <p className="svc-hero-lead">
              Human-first document translation across 100+ languages — handled
              by subject-matter linguists who understand your industry,
              audience and brand voice.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">
                Request a quote <span aria-hidden>↗</span>
              </Link>
              <a href="#industries" className="svc-btn-secondary">
                See industries
              </a>
            </div>
          </div>

          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one">
              <span className="dot" />
              100+ Languages
            </div>
            <div className="svc-hero-chip svc-hero-chip--two">
              <span className="dot" />
              Certified
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

      {/* OVERVIEW */}
      <section className="svc-section svc-overview">
        <div className="svc-container">
          <div className="svc-overview-grid">
            <div className="svc-overview-copy">
              <span className="svc-eyebrow">What we offer</span>
              <h2 className="svc-overview-title">
                End-to-end language work for teams that ship globally.
              </h2>
              <p>
                We translate your business-critical content — contracts,
                clinical files, product catalogs, courseware, financial
                reports and more — with the same linguists working across
                projects so your terminology, voice and tone stay consistent.
              </p>
              <p>
                Every project ships with a per-client glossary and translation
                memory, so your second project is faster than your first, and
                your tenth is tighter still.
              </p>
            </div>
            <div>
              <span className="svc-eyebrow">Capabilities</span>
              <ul className="svc-overview-list">
                {capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES — using landing's .svc-services design */}
      <section className="svc-services" id="industries">
        <div className="svc-services-container">

          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                INDUSTRIES WE SERVE
              </span>
              <h2 className="svc-services-heading">
                Translation for
                <br />
                <span>every industry.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Subject-matter linguists with real domain experience — so your
              content is accurate not only linguistically, but technically and
              commercially.
            </p>
          </div>

          <div className="svc-services-grid">
            {industries.map((ind, i) => (
              <Link
                key={ind.slug}
                href={`/services/translation/${ind.slug}`}
                className="svc-service-card"
              >
                <span className="svc-service-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="svc-service-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ind.iconPath} />
                  </svg>
                </span>
                <h4 className="svc-service-card-title">{ind.title}</h4>
                <p className="svc-service-card-detail">{ind.text}</p>
                <span className="svc-service-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* FORMATS */}
      <section className="svc-section svc-formats">
        <div className="svc-container">
          <div className="svc-section-head svc-formats-head">
            <div>
              <span className="svc-eyebrow">Formats we handle</span>
              <h2>
                Delivered in <span className="accent">the format you need.</span>
              </h2>
            </div>
            <p>
              We handle round-trip formatting for documents, web, apps and
              media — so your localized content lands where it needs to with
              layout and markup intact.
            </p>
          </div>
          <div className="svc-check-grid">
            {deliverables.map((d) => (
              <div className="svc-check-item" key={d}>
                <span className="tick">✓</span>
                {d}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="svc-section svc-section--tint svc-process">
        <div className="svc-container">
          <div className="svc-section-head svc-process-head">
            <div>
              <span className="svc-eyebrow">Our process</span>
              <h2>
                A clear path from <span className="accent">source to delivery.</span>
              </h2>
            </div>
            <p>
              Every translation runs through the same tight workflow — scope,
              translate, review, deliver — with glossary and TM feeding back
              into every future project.
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
            <span className="svc-eyebrow">Start a project</span>
            <h2>
              Have content to <span className="accent">translate?</span>
            </h2>
            <p>
              Share your files, language pair and timeline — we'll come back
              with a scoped quote and the right linguists for your domain.
            </p>
            <Link href="/contact" className="svc-btn-primary">
              Get a quote <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
