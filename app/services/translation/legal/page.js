"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Contracts & agreements",
  "Court filings",
  "IP & patents",
  "Compliance documents",
  "Sworn / certified translation",
  "Corporate & M&A",
  "Litigation support",
  "Immigration documents",
];

const documentTypes = [
  { title: "Contracts", text: "Commercial agreements, MSAs, NDAs and partnership contracts — translated with legal-grade precision.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "Court filings", text: "Pleadings, motions, affidavits and court orders — translated for admission into foreign jurisdictions.", iconPath: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" },
  { title: "IP & patents", text: "Patent applications, prior art, trademark filings and IP agreements — technical and legal terminology aligned.", iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 2v20M2 12h20" },
  { title: "Compliance", text: "GDPR docs, policy frameworks, AML/KYC materials and regulatory responses — audit-ready in every language.", iconPath: "M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  { title: "Sworn translation", text: "Sworn, certified or notarized translations accepted by courts, embassies and government bodies.", iconPath: "M12 2 15 9h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" },
  { title: "Corporate & M&A", text: "Due diligence documents, SPAs, articles of association and corporate records for cross-border deals.", iconPath: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7" },
  { title: "Litigation support", text: "Discovery documents, witness statements and expert reports — translated at litigation volume and pace.", iconPath: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
  { title: "Immigration", text: "Birth certificates, academic records and civil documents translated for immigration and visa processes.", iconPath: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0" },
];

const deliverables = [
  "DOCX · PDF · signed PDF",
  "Sworn / stamped translations",
  "Notarized bundles",
  "Bates-numbered deliveries",
];

const processSteps = [
  { num: "01", title: "Scope & NDA", text: "Share files under NDA — we scope the project with legally-trained linguists and confirm any sworn / certification requirements." },
  { num: "02", title: "Translate", text: "A native linguist with legal background translates — using jurisdiction-specific terminology and precedent." },
  { num: "03", title: "Legal QA", text: "A second legal reviewer verifies accuracy, terminology and any required certifications before sign-off." },
  { num: "04", title: "Certify & deliver", text: "Final translation delivered with sworn / certified / notarized stamps where needed — ready for filing." },
];

export default function LegalTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Legal Translation Services</span>
            <h1 className="svc-hero-title">
              Legal translation with <span className="accent">certified accuracy.</span>
            </h1>
            <p className="svc-hero-lead">
              Sworn and certified translation of contracts, court filings, IP
              and compliance documents — handled by legally-trained
              linguists, with confidentiality assured.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Sworn · Certified</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />NDA-safe</div>
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
              <h2 className="svc-overview-title">Legal translation that holds up in court and in front of regulators.</h2>
              <p>
                We translate the full range of legal content — contracts,
                court filings, IP, M&A documents and compliance material —
                for law firms, in-house teams, government agencies and
                private clients.
              </p>
              <p>
                Every project is handled by a native linguist with a legal
                background in the relevant jurisdiction, double-reviewed, and
                delivered with sworn or certified translation certificates
                where the end use requires them.
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
                Every legal
                <br />
                <span>document type.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From contracts to court filings — the full spectrum of legal
              content, handled with legal-grade precision and confidentiality.
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
              <h2>Delivered <span className="accent">court-ready and filing-ready.</span></h2>
            </div>
            <p>
              Translations delivered in whatever certification format the end
              use requires — sworn stamp, notarization, Bates numbering or
              bundled discovery packs.
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
              <h2>A workflow built for <span className="accent">legal admissibility.</span></h2>
            </div>
            <p>
              A tight 4-step workflow that keeps accuracy, confidentiality and
              jurisdictional validity predictable across every project.
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
            <h2>Have legal content to <span className="accent">translate?</span></h2>
            <p>
              Share your files, jurisdiction and certification requirement —
              we'll come back under NDA with a scoped quote and the right
              legal linguists for your matter.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
