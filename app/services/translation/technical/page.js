"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Engineering documentation",
  "API references",
  "User manuals",
  "Hardware specifications",
  "Safety data sheets (SDS)",
  "Patents & technical IP",
  "Technical whitepapers",
  "Installation guides",
];

const documentTypes = [
  { title: "Engineering docs", text: "CAD annotations, design specs, engineering drawings and spec sheets — terminology-controlled throughout.", iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 2v20M2 12h20" },
  { title: "API references", text: "Developer-facing API docs, SDK guides and code comments — written for engineers in each language.", iconPath: "m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" },
  { title: "User manuals", text: "End-user manuals, quick-start guides and reference manuals — localized for clarity and task completion.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "Hardware specs", text: "Hardware specifications, datasheets and component docs — exact numeric and unit integrity preserved.", iconPath: "M4 7h16v10H4zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v3M10 13h4" },
  { title: "Safety data sheets", text: "SDS/MSDS documents translated for compliance with GHS, REACH and local chemical safety regulations.", iconPath: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" },
  { title: "Patents", text: "Patent applications, claims and specifications translated with technical and legal precision in parallel.", iconPath: "M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  { title: "Whitepapers", text: "Technical whitepapers, research reports and architectural overviews — engineer-to-engineer tone.", iconPath: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
  { title: "Installation guides", text: "Step-by-step installation, deployment and configuration guides — screenshots, callouts and all.", iconPath: "M4 6h16v12H4zM4 6l8 7 8-7" },
];

const deliverables = [
  "DOCX · PDF · InDesign",
  "DITA · DocBook · XML",
  "HTML · Markdown · reST",
  "XLIFF · JSON · PO",
];

const processSteps = [
  { num: "01", title: "Terminology scope", text: "We extract and lock terminology from your source — glossary, product names, acronyms — before a single sentence is translated." },
  { num: "02", title: "Translate", text: "A native linguist with engineering or SME background translates — against the locked terminology list." },
  { num: "03", title: "Technical QA", text: "A second subject-matter reviewer runs linguistic AND technical QA — code snippets, units, part numbers, screenshots." },
  { num: "04", title: "Deliver", text: "Final files in your required docs format — DITA, DocBook or Markdown — with updated glossary and TM." },
];

export default function TechnicalTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Technical Translation Services</span>
            <h1 className="svc-hero-title">
              Technical translation with <span className="accent">terminology control.</span>
            </h1>
            <p className="svc-hero-lead">
              Engineering docs, API references, manuals and technical IP
              translated with strict terminology control — handled by linguists
              who read your source as well as your end user does.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />DITA · DocBook</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Terminology-locked</div>
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
              <h2 className="svc-overview-title">Technical translation where terminology is non-negotiable.</h2>
              <p>
                We translate the technical content that teams use to build,
                operate and maintain products — engineering specs, API
                references, user manuals, SDS/MSDS, patents and installation
                guides.
              </p>
              <p>
                Every project starts with a terminology lock — product names,
                part numbers, acronyms and controlled vocabulary — and runs
                through a double-review by subject-matter linguists so your
                technical content stays precise in every language.
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
                Every technical
                <br />
                <span>document type.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From API references to safety data sheets — the full spectrum
              of technical and engineering content.
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
              <h2>Delivered in <span className="accent">the format you need.</span></h2>
            </div>
            <p>
              We work in your docs toolchain — single-sourced DITA, DocBook
              XML, Markdown or structured JSON — round-tripping back into
              your publishing pipeline.
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
              <h2>A workflow built around <span className="accent">terminology discipline.</span></h2>
            </div>
            <p>
              A tight 4-step workflow that keeps technical accuracy,
              terminology integrity and docs-toolchain compatibility
              predictable across every project.
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
            <h2>Have technical docs to <span className="accent">translate?</span></h2>
            <p>
              Share your source files, docs format and target languages —
              we'll come back with a scoped quote and the right technical
              linguists for your domain.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
