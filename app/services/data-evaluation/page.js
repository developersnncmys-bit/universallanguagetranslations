"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Dataset audit & profiling",
  "Label quality scoring",
  "Inter-annotator agreement",
  "Bias & fairness review",
  "Benchmark comparison",
  "Edge-case discovery",
  "Error-mode taxonomy",
  "Reporting & dashboards",
];

const types = [
  { tag: "Workstream 01", title: "Audit & profile", text: "Full dataset profile — label distribution, class balance, duplicates, drift, provenance and schema conformance.", iconPath: "M4 4h16v16H4zM4 10h16M10 4v16" },
  { tag: "Workstream 02", title: "Score label quality", text: "Sampled gold-set scoring — precision, recall, confusion patterns and per-label quality so you know what's trustworthy.", iconPath: "M3 12l5 5L21 4" },
  { tag: "Workstream 03", title: "Agreement analysis", text: "Inter-annotator agreement (Cohen's κ / Fleiss' κ), disagreement hotspots and guideline-interpretation gaps.", iconPath: "M4 20V9m6 11V4m6 16v-7m6 7V11" },
  { tag: "Workstream 04", title: "Bias & fairness", text: "Demographic, cultural and linguistic bias checks — slice-level performance and mitigation recommendations.", iconPath: "M12 2a10 10 0 1 0 10 10M12 2v10h10M12 2a10 10 0 0 1 10 10" },
  { tag: "Workstream 05", title: "Benchmark", text: "Compare your dataset against public baselines or your prior versions — before/after deltas on the metrics that matter.", iconPath: "M4 7h16M4 12h10M4 17h6M20 12l-4 5M16 12l4 5" },
  { tag: "Workstream 06", title: "Report & recommend", text: "Executive-ready report with findings, risk flags, prioritised recommendations and a scoped remediation plan.", iconPath: "M4 4h12l4 4v12H4zM8 12h8M8 16h5M8 8h4" },
];

const outcomes = [
  "Quantified label quality",
  "Identified bias & risk",
  "Baseline benchmark report",
  "Audit-ready evidence",
];

const processSteps = [
  { num: "01", title: "Scope", text: "We align on your dataset, model use-case, risk thresholds and the questions the evaluation needs to answer." },
  { num: "02", title: "Measure", text: "Our linguists and QA leads score samples, run agreement passes and compute distribution + bias metrics." },
  { num: "03", title: "Analyse", text: "We cluster findings — error modes, slice-level gaps, guideline ambiguity and the hotspots driving model failure." },
  { num: "04", title: "Report", text: "You get a written report, raw metrics, a slice-level dashboard and a prioritised remediation roadmap." },
];

export default function DataEvaluationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Data Evaluation</span>
            <h1 className="svc-hero-title">
              Know exactly <span className="accent">what&apos;s in your data.</span>
            </h1>
            <p className="svc-hero-lead">
              Rigorous quality audits, inter-annotator agreement, bias reviews
              and benchmark reports — so you ship models on datasets you can
              actually defend.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#workstreams" className="svc-btn-secondary">See workstreams</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Measured</div>
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
              <h2 className="svc-overview-title">See what&apos;s really in your dataset.</h2>
              <p>
                Model performance plateaus and surprise failures almost always
                trace back to the data. We profile your dataset end-to-end,
                score label quality against a gold set, measure annotator
                agreement and surface the slices where your model is quietly
                losing.
              </p>
              <p>
                Every finding is quantified, scoped and prioritised — so you
                know what&apos;s worth fixing and what&apos;s already strong
                enough to ship on.
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
                <span>measure data quality.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Pick one or run them together — we scope each workstream to your
              dataset, model and the risk you&apos;re trying to retire.
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
              <h2>Clear numbers, <span className="accent">defensible evidence.</span></h2>
            </div>
            <p>
              Every evaluation ships with raw metrics, a written report and a
              slice-level dashboard — so the state of your data is on the page,
              not just in a feeling.
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
              <h2>Scope, measure, analyse, <span className="accent">report.</span></h2>
            </div>
            <p>
              A tight four-step loop — every metric is tied back to a defined
              question, and every recommendation is traceable to the evidence
              that supports it.
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
            <h2>Not sure if your data is good enough? <span className="accent">Let&apos;s measure it.</span></h2>
            <p>
              Share your dataset specs and the questions you need answered —
              we&apos;ll return with an evaluation plan and a scoped quote.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
