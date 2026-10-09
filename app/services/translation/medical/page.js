"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Clinical trial documentation",
  "Patient information leaflets",
  "IFU & SmPC translation",
  "Regulatory submissions",
  "Pharmaceutical marketing",
  "Medical device labelling",
  "Scientific publications",
  "EMR & health records",
];

const documentTypes = [
  { title: "Clinical trials", text: "Protocols, informed-consent forms, case report forms and investigator brochures translated to regulatory standard.", iconPath: "M9 12h6M12 9v6M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  { title: "Patient leaflets", text: "Patient information, dosage instructions and leaflets written and translated in reader-friendly health literacy.", iconPath: "M4 4h12l4 4v12H4zM4 4v16h16" },
  { title: "IFU & SmPC", text: "Instructions-for-use and summary-of-product-characteristics localized for every target market.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "Regulatory filings", text: "Submissions to EMA, FDA, MHRA and local regulators — translated with the exact terminology they expect.", iconPath: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" },
  { title: "Pharmaceutical marketing", text: "Promotional materials, HCP comms and congress collateral — compliant with industry-code language.", iconPath: "M3 3h18v4H3zM5 7v14h14V7M9 13h6M9 17h4" },
  { title: "Medical devices", text: "Device labelling, UDI content and user guides compliant with EU MDR / IVDR requirements.", iconPath: "M4 7h16v10H4zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v3M10 13h4" },
  { title: "Scientific publications", text: "Peer-reviewed papers, case studies and conference abstracts translated with technical precision.", iconPath: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
  { title: "Health records", text: "EMR exports, discharge summaries and medical reports translated with confidentiality assured.", iconPath: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
];

const deliverables = [
  "DOCX · PDF · InDesign",
  "XML · XLIFF · DITA",
  "HTML · JSON",
  "Signed PDF certificates",
];

const processSteps = [
  { num: "01", title: "Scope & NDA", text: "Share source files under NDA — we scope the project with the right subject-matter linguists and set terminology baselines." },
  { num: "02", title: "Translate", text: "A medically-trained native linguist translates — using approved glossaries, MedDRA / SNOMED where relevant." },
  { num: "03", title: "QA & review", text: "A second medical reviewer runs linguistic, terminology and regulatory QA — plus in-country review when required." },
  { num: "04", title: "Deliver", text: "Final files in required format — with certification, translation memory and glossary updates for future projects." },
];

export default function MedicalTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Medical Translation Services</span>
            <h1 className="svc-hero-title">
              Medical translation <span className="accent">patients can trust.</span>
            </h1>
            <p className="svc-hero-lead">
              Regulatory-grade translation for clinical trials, medical
              devices, patient materials and pharmaceutical documentation —
              handled by medically-trained linguists.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />ISO 13485</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />GDPR-safe</div>
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
              <h2 className="svc-overview-title">Life-sciences translation that holds up to regulatory review.</h2>
              <p>
                We translate business-critical medical content for pharma,
                biotech, CROs, hospitals and medical-device manufacturers —
                clinical trial protocols, IFUs, patient leaflets, regulatory
                submissions and scientific publications.
              </p>
              <p>
                Every project is handled by a native linguist with a medical
                or life-sciences background, double-reviewed, and shipped with
                a per-client glossary + translation memory so your terminology
                stays consistent across years of filings.
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
                Every medical
                <br />
                <span>document type.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From trial protocols to patient leaflets — we handle the full
              spectrum of medical and life-sciences content under one roof.
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
              We handle round-trip formatting for all common medical document
              formats — ready for regulatory submission, print or digital
              distribution.
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
              <h2>A clear path from <span className="accent">source to submission.</span></h2>
            </div>
            <p>
              A tight 4-step workflow that keeps accuracy, confidentiality and
              regulatory-grade quality predictable on every project.
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
            <h2>Have medical content to <span className="accent">translate?</span></h2>
            <p>
              Share your files, target languages and submission timeline —
              we'll come back with a scoped quote and the right medical
              linguists for your domain.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
