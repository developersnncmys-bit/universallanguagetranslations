"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Dataset audit & profiling",
  "Label noise correction",
  "Class rebalancing",
  "Guideline migration",
  "Re-labeling at scale",
  "Data augmentation",
  "Bias & fairness review",
  "Versioning & lineage",
];

const types = [
  { tag: "Workstream 01", title: "Audit & profile", text: "Review your existing dataset — label distribution, agreement, drift, duplicates and known failure modes.", iconPath: "M4 4h16v16H4zM4 10h16M10 4v16" },
  { tag: "Workstream 02", title: "Clean & correct", text: "Identify and fix mislabels, remove duplicates, repair edge cases and flag ambiguous examples.", iconPath: "M3 12l5 5L21 4" },
  { tag: "Workstream 03", title: "Rebalance", text: "Resample, upsample or weight class distributions to match real-world traffic and model objectives.", iconPath: "M4 20V9m6 11V4m6 16v-7m6 7V11" },
  { tag: "Workstream 04", title: "Re-label", text: "Migrate your dataset to new guidelines, schema or label taxonomy — with QA coverage end-to-end.", iconPath: "M4 7h16M4 12h10M4 17h6M20 12l-4 5M16 12l4 5" },
  { tag: "Workstream 05", title: "Augment", text: "Generate variations — back-translations, paraphrases, image transforms, synthetic edge cases.", iconPath: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" },
  { tag: "Workstream 06", title: "Bias review", text: "Review datasets for demographic, cultural or linguistic bias — with mitigation plans and audit trail.", iconPath: "M12 2a10 10 0 1 0 10 10M12 2v10h10M12 2a10 10 0 0 1 10 10" },
];

const outcomes = [
  "+Accuracy on hard classes",
  "Fewer labeling disputes",
  "Lower retrain cost",
  "Audit-ready lineage",
];

const processSteps = [
  { num: "01", title: "Diagnose", text: "We profile your dataset — distribution, agreement, duplicates, drift and known model failure modes." },
  { num: "02", title: "Plan", text: "We propose a specific intervention — cleaning, rebalancing, re-labeling, augmentation or a mix." },
  { num: "03", title: "Execute", text: "Our linguists and QA leads run the intervention — with versioning and lineage captured throughout." },
  { num: "04", title: "Verify", text: "You get a new dataset version with change logs, agreement metrics and before/after benchmarks." },
];

export default function DataEvolutionPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Data Evolution</span>
            <h1 className="svc-hero-title">
              Keep your training data <span className="accent">as sharp as your model.</span>
            </h1>
            <p className="svc-hero-lead">
              Audit, clean, re-balance, re-label and augment your existing ML
              datasets — so model performance keeps climbing without
              rebuilding from scratch.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#workstreams" className="svc-btn-secondary">See workstreams</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Versioned</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Audit-ready</div>
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
              <h2 className="svc-overview-title">Datasets that evolve with your model.</h2>
              <p>
                Most teams spend 80% of their effort on new data, and 20% on
                the data they already have. We flip that ratio — profiling
                your existing dataset, finding the labels that actually hurt
                your model, and fixing them with calibrated interventions.
              </p>
              <p>
                Every change is versioned, with before/after metrics and full
                lineage — so you can prove the lift and audit how the dataset
                got here.
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

      <section className="svc-services" id="workstreams">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                WORKSTREAMS
              </span>
              <h2 className="svc-services-heading">
                Six ways to
                <br />
                <span>evolve a dataset.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Pick one or run them together — we scope each workstream to
              your dataset, model and the lift you're chasing.
            </p>
          </div>
          <div className="svc-services-grid">
            {types.map((t, i) => (
              <div className="svc-service-card" key={t.title}>
                <span className="svc-service-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
              <span className="svc-eyebrow">Outcomes you can expect</span>
              <h2>Measurable lift, <span className="accent">verifiable change.</span></h2>
            </div>
            <p>
              Every dataset intervention ships with before/after benchmarks,
              so the value is on the page — not just on the invoice.
            </p>
          </div>
          <div className="svc-check-grid">
            {outcomes.map((d) => (
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
              <h2>Diagnose, plan, execute, <span className="accent">verify.</span></h2>
            </div>
            <p>
              A tight four-step loop — every change is tracked, scored and
              version-stamped against the dataset you started from.
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
            <h2>Model stuck? <span className="accent">Let's look at the data.</span></h2>
            <p>
              Share your dataset specs and failure modes — we'll return with
              an audit plan and a scoped quote.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
