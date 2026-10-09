"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Courseware & modules",
  "Video script translation",
  "Assessments & quizzes",
  "LMS strings & UI",
  "Course descriptions",
  "Instructor materials",
  "Certificates & badges",
  "Interactive content (SCORM)",
];

const documentTypes = [
  { title: "Course modules", text: "Full module content, learning objectives and in-course text translated to pedagogical standard.", iconPath: "M12 3 2 8l10 5 10-5-10-5zM6 10.6V15c0 1.1 2.7 3 6 3s6-1.9 6-3v-4.4" },
  { title: "Video scripts", text: "Lecture scripts, narration and voiceover copy localized — ready for subtitling or dubbing.", iconPath: "M15 10l4-2v8l-4-2M5 6h10v12H5z" },
  { title: "Assessments", text: "Quizzes, exams and formative assessments translated with care for question logic and distractors.", iconPath: "M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  { title: "LMS strings", text: "Learner-facing UI text and system messages in your LMS — Moodle, Canvas, Articulate, custom.", iconPath: "M3 3h18v14H3zM8 21h8M12 17v4" },
  { title: "Course descriptions", text: "Marketing-grade course descriptions, syllabi and promo copy for your catalog.", iconPath: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
  { title: "Instructor materials", text: "Teaching guides, lesson plans and facilitator notes translated for native-speaker instructors.", iconPath: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0" },
  { title: "Certificates", text: "Certificate templates, badge metadata and completion documents — localized and signed.", iconPath: "M12 2 15 9h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" },
  { title: "SCORM / xAPI", text: "Interactive content exported from Articulate, Captivate or Storyline — strings extracted, translated, reimported.", iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" },
];

const deliverables = [
  "SCORM · xAPI · AICC",
  "DOCX · PPTX · PDF",
  "SRT · VTT (for video)",
  "XLIFF · JSON · CSV",
];

const processSteps = [
  { num: "01", title: "Scope & extract", text: "We assess your course package — PPTX, SCORM, video — and extract translatable strings while preserving structure." },
  { num: "02", title: "Translate", text: "A native linguist with e-learning / instructional-design background translates — pedagogically tuned, not just literal." },
  { num: "03", title: "In-context review", text: "A second reviewer previews the course in the LMS or player to catch any UI/overflow issues before sign-off." },
  { num: "04", title: "Deliver & deploy", text: "Final package reimported and ready to publish — SCORM, LMS or video platform of your choice." },
];

export default function ElearningTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">E-learning Translation Services</span>
            <h1 className="svc-hero-title">
              E-learning translation for <span className="accent">global learners.</span>
            </h1>
            <p className="svc-hero-lead">
              Courseware, video scripts and assessments localized for global
              learners — delivered in your LMS format, ready to roll out to
              every market on your training roadmap.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />SCORM · xAPI</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />LMS-ready</div>
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
              <h2 className="svc-overview-title">Training content that resonates with learners in every language.</h2>
              <p>
                We localize corporate training, academic courseware and
                customer-education content for e-learning platforms — SCORM,
                xAPI, Articulate, Captivate and custom LMS stacks. Every
                string, slide and voiceover handled under one project.
              </p>
              <p>
                Linguists are chosen for both language fluency and
                instructional-design familiarity — so questions make sense,
                examples translate culturally, and the finished course feels
                native, not translated.
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
                Every piece of
                <br />
                <span>training content.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              Course modules, video scripts, assessments, LMS strings and
              everything in between — localized end-to-end.
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
              We extract from and reimport back into your authoring tool so
              interactivity, triggers and scoring survive the round-trip.
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
              <h2>From source course to <span className="accent">live LMS.</span></h2>
            </div>
            <p>
              A 4-step pipeline that keeps structure, interactivity and
              pedagogical quality intact across every target language.
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
            <h2>Have courseware to <span className="accent">localize?</span></h2>
            <p>
              Share your course package, target languages and target LMS —
              we'll come back with a scoped quote and the right instructional
              linguists for your subject matter.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
