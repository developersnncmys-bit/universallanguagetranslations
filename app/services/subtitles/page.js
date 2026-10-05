"use client";

import Link from "next/link";
import Image from "next/image";
import GlobeCanvas from "../../components/GlobeCanvas";
import ServicesAnimations from "../ServicesAnimations";
import "../services.css";

const capabilities = [
  "Closed captions (CC)",
  "SDH captions",
  "Open subtitles",
  "Forced narratives",
  "Multilingual subtitles",
  "Spotting & timing",
  "Burned-in (hardsub)",
  "Platform-ready delivery",
];

const types = [
  { tag: "Format 01", title: "Closed captions", text: "User-toggleable captions with full dialogue, speaker IDs and sound cues — meets accessibility standards.", iconPath: "M4 5h16v14H4z M8 11h3M8 14h5M13 11h3M13 14h3" },
  { tag: "Format 02", title: "SDH subtitles", text: "Subtitles for the deaf and hard-of-hearing — dialogue, music, sound effects and speaker identification.", iconPath: "M4 7h16v12H4zM8 11h8M8 15h6M18 2a3 3 0 0 1 0 6" },
  { tag: "Format 03", title: "Open subtitles", text: "Always-on subtitles, burned into video or exported for your encoder — localized for every target market.", iconPath: "M3 4h18v14H3zM7 10h10M7 14h8" },
  { tag: "Format 04", title: "Localized subs", text: "Full translation and cultural adaptation — not literal word-for-word, but true to tone, humour and pacing.", iconPath: "M4 7h16M4 12h10M4 17h6M20 12l-4 5M16 12l4 5" },
  { tag: "Format 05", title: "Forced narratives", text: "On-screen text, signage and foreign-language passages — displayed only when needed, matched to the frame.", iconPath: "M4 5h16v14H4zM8 10h8M8 14h6" },
  { tag: "Format 06", title: "Live & near-live", text: "Fast-turnaround subtitling for news, events, webinars and streaming — delivered within your broadcast window.", iconPath: "M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" },
];

const deliverables = [
  "SRT · VTT · WebVTT",
  "STL · EBU · PAC",
  "TTML · DFXP · IMSC",
  "Burned-in MP4 / MOV",
];

const processSteps = [
  { num: "01", title: "Spot the video", text: "Linguist spots and times every caption cue to the frame — reading speed respected per language." },
  { num: "02", title: "Translate / caption", text: "Subtitles written or translated with character limits, cultural nuance and on-screen context in mind." },
  { num: "03", title: "QC pass", text: "Second pass checks timing, reading rate, line breaks, speaker IDs and sync against picture." },
  { num: "04", title: "Deliver", text: "Final subtitle files in your required format — or hardsubbed into video, ready for your platform." },
];

export default function SubtitlesPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Subtitling Services</span>
            <h1 className="svc-hero-title">
              Subtitles that <span className="accent">keep the story moving.</span>
            </h1>
            <p className="svc-hero-lead">
              Spotting, captioning, SDH and multilingual subtitles for film,
              TV, OTT, e-learning and corporate video — timed to the frame
              and ready for any platform.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#formats" className="svc-btn-secondary">See formats</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Frame-accurate</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Any platform</div>
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
              <h2 className="svc-overview-title">Subtitling that respects pacing, meaning and the viewer.</h2>
              <p>
                Good subtitles disappear — the viewer stays with the story,
                never fighting the text. We spot every cue to the frame,
                respect per-language reading speed, and preserve tone, humour
                and intent in every line.
              </p>
              <p>
                From single-video shorts to full OTT libraries, we handle
                spotting, captioning, translation, SDH and burn-in — delivered
                in every subtitle format your pipeline uses.
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

      <section className="svc-services" id="formats">
        <div className="svc-services-container">
          <div className="svc-services-head">
            <div>
              <span className="svc-services-label">
                <span />
                SUBTITLE TYPES
              </span>
              <h2 className="svc-services-heading">
                The right format
                <br />
                <span>for every screen.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From accessibility compliance to localized OTT releases — we
              match the subtitle style to the audience, platform and use case.
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
              <h2>Encoder-ready <span className="accent">file formats.</span></h2>
            </div>
            <p>
              We ship in the subtitle formats your platform, encoder or edit
              suite expects — standards compliant and ready to deploy.
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
              <h2>From video to <span className="accent">deliverable subs.</span></h2>
            </div>
            <p>
              Every subtitle project runs through the same spotting, writing,
              QC and delivery flow — scaled from single videos to full
              catalogues.
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
            <h2>Video that needs <span className="accent">subtitles?</span></h2>
            <p>
              Tell us the runtime, source and target languages, and your
              platform's subtitle spec — we'll quote with turnaround.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
