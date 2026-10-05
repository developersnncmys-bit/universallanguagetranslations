"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Verbatim transcription",
  "Clean-read transcription",
  "Time-stamped output",
  "Speaker identification",
  "Multilingual transcription",
  "Translated transcripts",
  "SDH / caption-ready",
  "ASR training-grade",
];

const types = [
  { tag: "Type 01", title: "Verbatim", text: "Every word, filler and non-verbal sound captured — for legal, research and compliance work.", iconPath: "M4 6h16M4 12h16M4 18h10" },
  { tag: "Type 02", title: "Clean read", text: "Fillers and false starts removed for a readable transcript — perfect for publishing and media.", iconPath: "M4 6h16M4 12h12M4 18h8" },
  { tag: "Type 03", title: "Time-stamped", text: "Per-sentence or per-speaker timecodes for search, captioning and media production workflows.", iconPath: "M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" },
  { tag: "Type 04", title: "Speaker-labeled", text: "Clear speaker IDs — for interviews, panels, meetings and multi-voice podcast recordings.", iconPath: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0" },
  { tag: "Type 05", title: "Translated", text: "Transcription + translation in one pass — source speech to target-language text.", iconPath: "m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" },
  { tag: "Type 06", title: "ASR-grade", text: "High-accuracy annotated transcripts for training automatic speech recognition models.", iconPath: "M12 2a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v4" },
];

const deliverables = [
  "TXT · DOCX · PDF",
  "SRT · VTT · TTML",
  "JSON · CSV",
  "Timecoded Excel",
];

const processSteps = [
  { num: "01", title: "Receive audio", text: "Share your recordings via secure upload — we handle any common audio or video format." },
  { num: "02", title: "Transcribe", text: "A linguist transcribes to your chosen style — verbatim, clean read, time-stamped or speaker-labeled." },
  { num: "03", title: "QA", text: "A second linguist verifies accuracy, speaker IDs, timecodes and terminology." },
  { num: "04", title: "Deliver", text: "Final transcript in your required format — on time, with revisions included." },
];

export default function TranscriptionPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Transcription Services</span>
            <h1 className="svc-hero-title">
              Every word, <span className="accent">captured accurately.</span>
            </h1>
            <p className="svc-hero-lead">
              Human transcription of interviews, podcasts, meetings, legal
              proceedings and media — delivered in the exact style and format
              your workflow needs.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#types" className="svc-btn-secondary">See transcription types</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />99%+ accuracy</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Any audio format</div>
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
              <h2 className="svc-overview-title">Human transcription that reads clean and holds up to review.</h2>
              <p>
                Our transcription team handles audio and video from any domain
                — legal depositions, medical dictation, academic interviews,
                corporate meetings, podcasts and film. Every transcript is
                produced by a trained linguist, not an unsupervised ASR dump.
              </p>
              <p>
                We match your preferred style — verbatim, clean read,
                time-stamped or speaker-labeled — and deliver in the exact
                file format your workflow or editor expects.
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

      <section className="svc-services" id="types">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                TRANSCRIPTION TYPES
              </span>
              <h2 className="svc-services-heading">
                Match the style
                <br />
                <span>to the use case.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Different content needs different transcription styles — we
              handle all of them, often side-by-side on the same project.
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
              <span className="svc-eyebrow">Formats we deliver</span>
              <h2>Delivered in the <span className="accent">format you need.</span></h2>
            </div>
            <p>
              Final transcripts shipped in your working format — ready to
              edit, publish, caption or feed into downstream tooling.
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
              <h2>From recording to <span className="accent">reviewed transcript.</span></h2>
            </div>
            <p>
              A tight 4-step workflow that keeps accuracy, consistency and
              turnaround predictable on every project.
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
            <h2>Audio or video to <span className="accent">transcribe?</span></h2>
            <p>
              Tell us the recording length, language, style and format you
              need — we'll quote with turnaround times.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
