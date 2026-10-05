"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Multilingual narration",
  "Character voices",
  "E-learning voiceover",
  "Commercial / ad spots",
  "IVR & phone systems",
  "Documentary narration",
  "Dubbing (lip-sync)",
  "Audiobook recording",
];

const types = [
  { tag: "Style 01", title: "Corporate narration", text: "Clear, confident reads for explainers, brand films, investor videos and internal comms.", iconPath: "M4 7h16v12H4zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" },
  { tag: "Style 02", title: "E-learning", text: "Instructor-style voices with pacing designed for comprehension and long-form attention.", iconPath: "M12 3 2 8l10 5 10-5-10-5zM6 10.6V15c0 1.1 2.7 3 6 3s6-1.9 6-3v-4.4" },
  { tag: "Style 03", title: "Commercial & ads", text: "High-energy, warm or playful reads for TV, radio and digital ad campaigns.", iconPath: "M3 10v4h4l5 5V5L7 10H3zM16 8a4 4 0 0 1 0 8" },
  { tag: "Style 04", title: "Character & games", text: "Characterful voice acting for animation, games, apps and audio-first experiences.", iconPath: "M12 2a4 4 0 1 1-4 4 4 4 0 0 1 4-4zM4 22a8 8 0 0 1 16 0" },
  { tag: "Style 05", title: "IVR & phone", text: "Prompts, menus and on-hold recordings — on-brand and professional at every touchpoint.", iconPath: "M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.7-3.1 19.8 19.8 0 0 1-6-6A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.5 1.9L7.9 9.6a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 1.9-.5l2.8.5A2 2 0 0 1 22 17z" },
  { tag: "Style 06", title: "Dubbing", text: "Lip-synced dubbing for film, TV and OTT — matched to original emotion, timing and intent.", iconPath: "M12 2a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v4" },
];

const deliverables = [
  "WAV · 48kHz 24-bit",
  "MP3 · AAC · OGG",
  "Split stems per voice",
  "Timed to video / SRT",
];

const processSteps = [
  { num: "01", title: "Casting", text: "You hear curated voice samples per language, gender and tone — approve the voice before we record." },
  { num: "02", title: "Record", text: "Studio-grade recording with a director for pacing, emotion and brand alignment." },
  { num: "03", title: "Edit & sync", text: "Clean editing, de-noising, mastering and sync to picture when video is in scope." },
  { num: "04", title: "Deliver", text: "Final broadcast-ready audio in your target format — plus revision rounds included." },
];

export default function VoiceoverPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Voiceover Services</span>
            <h1 className="svc-hero-title">
              Voices that <span className="accent">carry your message.</span>
            </h1>
            <p className="svc-hero-lead">
              Professional multilingual voiceover for e-learning, commercials,
              corporate video, IVR, games and dubbing — studio-recorded,
              timed to picture and ready to publish.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#styles" className="svc-btn-secondary">See voice styles</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Studio-grade</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Curated voices</div>
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
              <h2 className="svc-overview-title">Human voices, in every language you serve.</h2>
              <p>
                A curated roster of professional voice artists across 60+
                languages and accents — matched to your brand, audience and
                content type. Every session is directed for pacing, emotion
                and brand voice, not just read-aloud delivery.
              </p>
              <p>
                We handle casting, recording, editing, mastering and sync to
                picture — delivering broadcast-ready audio in whatever format
                your platform or editor needs.
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

      <section className="svc-services" id="styles">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                VOICE STYLES
              </span>
              <h2 className="svc-services-heading">
                The right voice
                <br />
                <span>for every brief.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From a warm corporate narrator to a lip-synced dubbing cast —
              we match the style, tone and energy to your content.
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
              <span className="svc-eyebrow">Deliverables</span>
              <h2>Broadcast-ready <span className="accent">audio.</span></h2>
            </div>
            <p>
              Clean, mastered audio in the format your pipeline needs — ready
              for broadcast, encoder or edit suite.
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
              <h2>From script to <span className="accent">final mix.</span></h2>
            </div>
            <p>
              Casting through delivery — predictable, well-directed and
              production-ready at every step.
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
            <h2>Need the right <span className="accent">voice?</span></h2>
            <p>
              Share your script, languages and tone — we'll send sample
              voices and a scoped recording quote within 24 hours.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
