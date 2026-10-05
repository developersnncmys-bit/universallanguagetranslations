"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Text annotation (NER, intent)",
  "Sentiment & stance labeling",
  "Image bounding boxes",
  "Polygon & semantic masks",
  "Audio event tagging",
  "Speech transcription (ASR)",
  "Video frame labeling",
  "Multi-rater QA",
];

const types = [
  { tag: "Modality 01", title: "Text annotation", text: "Named-entity recognition, intent classification, entity linking and relation extraction — in 60+ languages.", iconPath: "M4 6h16M4 12h12M4 18h8" },
  { tag: "Modality 02", title: "Image annotation", text: "Bounding boxes, polygons, semantic segmentation and keypoints — for CV, retail, autonomous and medical use.", iconPath: "M3 3h18v18H3zM7 7h4v4H7zM13 13h4v4h-4z" },
  { tag: "Modality 03", title: "Audio annotation", text: "ASR transcription, speaker diarization, event tagging and emotion labeling for voice and audio ML.", iconPath: "M12 2a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v4" },
  { tag: "Modality 04", title: "Video annotation", text: "Per-frame object tracking, action labels and timeline events for video ML and content moderation.", iconPath: "M3 5h18v14H3zM10 9l6 3-6 3z" },
  { tag: "Modality 05", title: "LLM evaluation", text: "Prompt-response rating, preference pairs, red-team adversarial prompts and safety classification.", iconPath: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5" },
  { tag: "Modality 06", title: "Multilingual labels", text: "Any annotation pipeline run across many locales with native-speaker annotators and locale-aware guidelines.", iconPath: "M4 7h16M4 12h10M4 17h6M20 12l-4 5M16 12l4 5" },
];

const deliverables = [
  "JSON · JSONL · CSV",
  "COCO · Pascal VOC",
  "CoNLL · spaCy format",
  "Parquet · HF Datasets",
];

const processSteps = [
  { num: "01", title: "Guidelines", text: "We work with your team to lock labeling guidelines, edge cases and inter-annotator agreement targets." },
  { num: "02", title: "Pilot", text: "A small pilot batch runs — we calibrate guidelines, platform setup and quality thresholds together." },
  { num: "03", title: "Scale", text: "Full annotation runs with multi-rater coverage, live quality dashboards and regular calibration passes." },
  { num: "04", title: "Deliver", text: "Final labeled dataset in your target schema — with inter-rater agreement reports and metadata." },
];

export default function DataAnnotationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Data Annotation</span>
            <h1 className="svc-hero-title">
              Training data your model <span className="accent">can actually learn from.</span>
            </h1>
            <p className="svc-hero-lead">
              Human-labeled text, audio, image and video data for machine
              learning — with multi-rater QA, calibrated guidelines and
              native-speaker annotators across 60+ languages.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#modalities" className="svc-btn-secondary">See modalities</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Multi-rater QA</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Any schema</div>
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
              <h2 className="svc-overview-title">High-quality labels, calibrated to your guidelines.</h2>
              <p>
                Model performance lives or dies by label quality. We run
                annotation projects with locked guidelines, multi-rater
                coverage, inter-annotator agreement tracking and ongoing
                calibration — not just raw click-through labeling.
              </p>
              <p>
                We work across every major ML modality — text, image, audio,
                video, LLM evaluation — and deliver in the exact schema your
                training pipeline expects.
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

      <section className="svc-services" id="modalities">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                MODALITIES WE COVER
              </span>
              <h2 className="svc-services-heading">
                Labels for every
                <br />
                <span>model type.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Text, image, audio, video or LLM evaluation — we design the
              annotation workflow around your model, not the other way around.
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
              <span className="svc-eyebrow">Output formats</span>
              <h2>Delivered <span className="accent">pipeline-ready.</span></h2>
            </div>
            <p>
              Final datasets export in the exact schema and format your
              training pipeline expects — no reshaping required.
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
              <h2>From guidelines to <span className="accent">training set.</span></h2>
            </div>
            <p>
              Every annotation project runs on calibrated guidelines, live QA
              and multi-rater coverage — not just volume.
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
            <h2>Have an annotation <span className="accent">pipeline to run?</span></h2>
            <p>
              Tell us the modality, languages, volume and schema — we'll
              scope a pilot and quote within 48 hours.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
