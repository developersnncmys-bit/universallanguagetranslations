"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Parallel corpora",
  "Instruction / chat datasets",
  "Prompt-response pairs",
  "Speech corpora (ASR / TTS)",
  "Multimodal pairs",
  "Synthetic data design",
  "Red-team adversarial sets",
  "Locale-specific coverage",
];

const types = [
  { tag: "Dataset 01", title: "Parallel corpora", text: "Sentence-aligned source/target corpora for MT training, built from scratch in 60+ language pairs.", iconPath: "M4 4h7v16H4zM13 4h7v16h-7z" },
  { tag: "Dataset 02", title: "Instruction datasets", text: "Human-written instruction-response pairs for LLM fine-tuning — diverse tasks, locales and difficulty.", iconPath: "M4 6h16M4 12h16M4 18h10" },
  { tag: "Dataset 03", title: "Chat / dialogue", text: "Multi-turn conversational data with persona, intent and tool-use coverage — in every target language.", iconPath: "M4 6h12l4 4v8H8l-4 4z" },
  { tag: "Dataset 04", title: "Speech corpora", text: "Scripted and spontaneous speech recordings for ASR and TTS — with transcripts, demographics and QA.", iconPath: "M12 2a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v4" },
  { tag: "Dataset 05", title: "Multimodal pairs", text: "Image–caption, video–description and audio–text pairs for vision-language and audio-language models.", iconPath: "M3 3h18v18H3zM3 15l5-5 4 4 3-3 6 6" },
  { tag: "Dataset 06", title: "Red-team / safety", text: "Adversarial prompts, jailbreak attempts and safety-classified responses — for model evaluation and alignment.", iconPath: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" },
];

const languages = [
  "60+ languages",
  "Native speakers only",
  "Locale-level coverage",
  "Low-resource specialists",
];

const processSteps = [
  { num: "01", title: "Design", text: "We co-design the dataset — task mix, taxonomy, locales, difficulty curve and quality rubric." },
  { num: "02", title: "Recruit", text: "Native-speaker contributors are sourced per locale, with calibration and screening before any production work." },
  { num: "03", title: "Produce", text: "Content is written, recorded or captured at scale — with live QA and inter-rater agreement tracking." },
  { num: "04", title: "Deliver", text: "Final dataset in your target schema — with per-item metadata, provenance and quality metrics." },
];

export default function MultilingualDataCreationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Multilingual Data Creation</span>
            <h1 className="svc-hero-title">
              Training data, <span className="accent">built from scratch.</span>
            </h1>
            <p className="svc-hero-lead">
              Human-authored ML datasets across 60+ languages — parallel
              corpora, instruction data, speech, multimodal pairs and
              safety sets, produced by native-speaker contributors.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#datasets" className="svc-btn-secondary">See dataset types</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />60+ languages</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Native-written</div>
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
              <h2 className="svc-overview-title">Datasets that start where your model will actually live.</h2>
              <p>
                A model trained on scraped-and-translated English data won't
                serve a global audience well. We produce ML training data
                written, recorded and reviewed by native speakers — reflecting
                how people in each locale actually talk, write and ask.
              </p>
              <p>
                From parallel MT corpora to instruction datasets for LLM
                fine-tuning, speech data for ASR, multimodal pairs and
                safety-focused red-team sets — all built to your schema,
                taxonomy and quality rubric.
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

      <section className="svc-services" id="datasets">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                DATASET TYPES
              </span>
              <h2 className="svc-services-heading">
                Built for every
                <br />
                <span>model stage.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Pretraining, fine-tuning, RLHF, evaluation and safety — we
              produce the dataset type your pipeline needs, at the scale
              you need it.
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
              <span className="svc-eyebrow">Language coverage</span>
              <h2>Real coverage, <span className="accent">at locale level.</span></h2>
            </div>
            <p>
              Not just language codes on a slide — real native-speaker
              coverage across major and low-resource locales.
            </p>
          </div>
          <div className="svc-check-grid">
            {languages.map((l) => (
              <div className="svc-check-item" key={l}><span className="tick">✓</span>{l}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--tint svc-process">
        <div className="svc-container">
          <div className="svc-section-head svc-process-head">
            <div>
              <span className="svc-eyebrow">Our process</span>
              <h2>From schema to <span className="accent">shipped dataset.</span></h2>
            </div>
            <p>
              A disciplined workflow — co-designed with your team, run by
              native speakers, QA'd at every step.
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
            <h2>Need a dataset <span className="accent">built from scratch?</span></h2>
            <p>
              Share the task, locales, volume and schema — we'll scope a
              pilot and send a full plan within 48 hours.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get in touch <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
