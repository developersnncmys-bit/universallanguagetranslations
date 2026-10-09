"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Annual & interim reports",
  "Prospectuses & filings",
  "Investor presentations",
  "Audit documentation",
  "Regulatory submissions",
  "Fund documents (KIID / PRIIP)",
  "Policy & governance docs",
  "Financial statements",
];

const documentTypes = [
  { title: "Annual reports", text: "Full annual reports, MD&A, chair letters and sustainability sections — print-ready in every language.", iconPath: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
  { title: "Prospectuses", text: "IPO prospectuses, offering documents and shareholder circulars — regulator-ready precision.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "Investor relations", text: "Earnings releases, investor decks, roadshow materials and quarterly updates — on-brand voice.", iconPath: "M4 20V9m6 11V4m6 16v-7m6 7V11" },
  { title: "Audit documents", text: "Audit reports, financial statements and notes to the accounts translated with numeric precision.", iconPath: "M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  { title: "Regulatory filings", text: "SEC, FCA, ESMA and local-regulator submissions in the exact terminology each regulator expects.", iconPath: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" },
  { title: "Fund documents", text: "KIIDs, PRIIPs KIDs, fund factsheets and marketing materials — compliant with cross-border rules.", iconPath: "M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" },
  { title: "Policy & governance", text: "Board policies, governance charters and ESG disclosures — translated to the standard your board expects.", iconPath: "M3 3h18v4H3zM5 7v14h14V7M9 13h6M9 17h4" },
  { title: "Financial statements", text: "Balance sheets, income statements and cash flow — localized for local GAAP or IFRS presentation.", iconPath: "M4 4h4v16H4zM10 10h4v10h-4zM16 7h4v13h-4z" },
];

const deliverables = [
  "DOCX · PDF · InDesign",
  "XBRL · iXBRL-aware",
  "XML · XLIFF",
  "Print-ready print PDFs",
];

const processSteps = [
  { num: "01", title: "Scope & NDA", text: "Share source files under NDA — we scope the project with finance-trained linguists and align on terminology." },
  { num: "02", title: "Translate", text: "A native linguist with finance background translates — using IFRS / local GAAP terminology and your house style." },
  { num: "03", title: "Numeric QA", text: "A second reviewer runs linguistic AND numeric QA — figures, dates, tables, charts — against the source." },
  { num: "04", title: "Deliver", text: "Print-ready files in required format, with glossary and translation memory updates for the next reporting cycle." },
];

export default function FinancialTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Financial Translation Services</span>
            <h1 className="svc-hero-title">
              Financial translation with <span className="accent">numeric precision.</span>
            </h1>
            <p className="svc-hero-lead">
              Annual reports, prospectuses, investor materials and regulatory
              filings translated with the precision finance teams, regulators
              and investors expect.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />IFRS · US GAAP</div>
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
              <h2 className="svc-overview-title">Finance translation that stands up to audit and investor scrutiny.</h2>
              <p>
                We translate reporting, investor and regulatory content for
                listed companies, fund managers, banks and insurers — annual
                reports, prospectuses, earnings releases, fund docs and
                regulator submissions.
              </p>
              <p>
                Every project is handled by a native linguist with a finance
                or accounting background, double-reviewed for numeric
                accuracy, and shipped on tight reporting deadlines with
                print-ready layout intact.
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
                Every financial
                <br />
                <span>document type.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From annual reports to fund KIIDs — the full spectrum of
              corporate finance, investor and regulatory content.
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
              Print-ready layout preserved — tables, charts, figures and
              typographic style match the source master, in every language.
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
              <h2>Built for <span className="accent">reporting-cycle deadlines.</span></h2>
            </div>
            <p>
              A tight 4-step workflow that keeps numeric accuracy, confidentiality
              and print-ready quality predictable — including under reporting
              crunch.
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
            <h2>Reporting season <span className="accent">around the corner?</span></h2>
            <p>
              Share your source files, target languages and filing deadline —
              we'll come back with a scoped quote and the right finance
              linguists for your sector.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
