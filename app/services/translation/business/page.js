"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Commercial contracts",
  "HR policies & handbooks",
  "Internal communications",
  "Investor & pitch decks",
  "Vendor & procurement docs",
  "Training materials",
  "Strategy documents",
  "Compliance & SOPs",
];

const documentTypes = [
  { title: "Contracts", text: "MSAs, NDAs, commercial agreements and SOWs translated with legal-grade precision and standard terminology.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "HR & policies", text: "Employee handbooks, policies, codes of conduct and benefits docs — localized for every workforce.", iconPath: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0" },
  { title: "Internal comms", text: "All-hands slides, town-hall scripts, CEO letters and intranet content — in the voice of your organisation.", iconPath: "M4 6h16v12H4zM4 6l8 7 8-7" },
  { title: "Pitch & investor decks", text: "Sales decks, pitch presentations and investor materials — translated to convert, not just explain.", iconPath: "M3 3h18v14H3zM8 21h8M12 17v4" },
  { title: "Vendor docs", text: "RFPs, RFIs, procurement policies and supplier agreements — ready for cross-border sourcing.", iconPath: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7" },
  { title: "Training", text: "Internal training materials, onboarding packs and process docs — for a globally consistent workforce.", iconPath: "M12 3 2 8l10 5 10-5-10-5zM6 10.6V15c0 1.1 2.7 3 6 3s6-1.9 6-3v-4.4" },
  { title: "Strategy docs", text: "Board decks, OKRs, strategy memos and planning documents — confidential and tightly reviewed.", iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" },
  { title: "Compliance & SOPs", text: "Standard operating procedures, compliance manuals and risk documentation — audit-ready in every language.", iconPath: "M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
];

const deliverables = [
  "DOCX · PDF · PPTX",
  "Google Docs · Slides",
  "InDesign · Figma",
  "HTML · XLIFF",
];

const processSteps = [
  { num: "01", title: "Scope & NDA", text: "Share source files under NDA — we scope the project, agree on tone and set up a per-company glossary." },
  { num: "02", title: "Translate", text: "A native business linguist translates — matching your corporate voice, acronyms and in-house terminology." },
  { num: "03", title: "Review", text: "A second reviewer runs linguistic, tone and consistency QA — against your style guide and prior projects." },
  { num: "04", title: "Deliver", text: "Final files in the format your team works in, with glossary + TM updates for future translation work." },
];

export default function BusinessTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Business Translation Services</span>
            <h1 className="svc-hero-title">
              Business translation that <span className="accent">keeps clarity across borders.</span>
            </h1>
            <p className="svc-hero-lead">
              Contracts, policies, pitch decks and internal comms translated
              with the clarity, voice and consistency your teams and
              stakeholders expect — in every region you operate.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />NDA-safe</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />On-brand voice</div>
            <div className="svc-hero-globe-wrap">
              <div className="svc-hero-globe-glow" />
              <div className="svc-hero-globe-canvas">
                <GlobeCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section svc-overview">
        <div className="svc-container">
          <div className="svc-overview-grid">
            <div className="svc-overview-copy">
              <span className="svc-eyebrow">What we offer</span>
              <h2 className="svc-overview-title">Corporate translation that respects your voice and your risk posture.</h2>
              <p>
                We handle translation for everything that moves a business
                across borders — contracts, HR docs, pitch decks, internal
                comms and strategy documents. Confidential, consistent and
                in your organisation's voice.
              </p>
              <p>
                Dedicated linguists work across your projects over time,
                building a per-client glossary and TM so your fifth
                translation uses the same terminology as your first — and
                costs less to produce.
              </p>
            </div>
            <div>
              <span className="svc-eyebrow">Capabilities</span>
              <ul className="svc-overview-list">
                {capabilities.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-services" id="document-types">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                WHAT WE TRANSLATE
              </span>
              <h2 className="svc-services-heading">
                Every business
                <br />
                <span>document type.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From commercial contracts to all-hands scripts — the full
              spectrum of corporate content, handled under one project.
            </p>
          </div>
          <div className="svc-services-grid">
            {documentTypes.map((t, i) => (
              <div className="svc-service-card" key={t.title}>
                <span className="svc-service-card-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="svc-service-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.iconPath} />
                  </svg>
                </span>
                <h4 className="svc-service-card-title">{t.title}</h4>
                <p className="svc-service-card-detail">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-formats">
        <div className="svc-container">
          <div className="svc-section-head svc-formats-head">
            <div>
              <span className="svc-eyebrow">Formats we deliver</span>
              <h2>Delivered in <span className="accent">the format you work in.</span></h2>
            </div>
            <p>
              We mirror your source file format — layouts, master slides,
              styled docs and shared drives — ready to drop into your team's
              working folders.
            </p>
          </div>
          <div className="svc-check-grid">
            {deliverables.map((d) => (
              <div className="svc-check-item" key={d}><span className="tick">✓</span>{d}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--tint svc-process">
        <div className="svc-container">
          <div className="svc-section-head svc-process-head">
            <div>
              <span className="svc-eyebrow">Our process</span>
              <h2>A workflow built for <span className="accent">corporate standards.</span></h2>
            </div>
            <p>
              A tight 4-step process that keeps confidentiality, consistency
              and corporate tone intact across every project you send us.
            </p>
          </div>
          <div className="svc-process-grid">
            {processSteps.map((s) => (
              <div className="svc-process-step" key={s.num}>
                <span className="svc-process-num">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-cta">
        <div className="svc-container">
          <div className="svc-cta-inner">
            <span className="svc-eyebrow">Start a project</span>
            <h2>Have business content to <span className="accent">translate?</span></h2>
            <p>
              Share your files, target languages and audience — we'll come
              back with a scoped quote and the right business linguists for
              your organisation.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
