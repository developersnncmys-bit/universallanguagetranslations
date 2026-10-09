"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Campaign transcreation",
  "Taglines & slogans",
  "Landing pages",
  "Social media copy",
  "Press releases",
  "Ad copy & scripts",
  "Brand guidelines",
  "Email marketing",
];

const documentTypes = [
  { title: "Campaign copy", text: "Transcreated campaign headlines, body copy and CTAs — keeping intent, tone and emotion intact.", iconPath: "M3 10v4h4l5 5V5L7 10H3zM16 8a4 4 0 0 1 0 8" },
  { title: "Taglines", text: "Taglines, slogans and brand lines rewritten in the target language — not literally, but equivalently.", iconPath: "M4 6h16M4 12h16M4 18h10" },
  { title: "Landing pages", text: "Marketing landing pages, product pages and funnel copy — tuned for conversion in each market.", iconPath: "M4 4h16v16H4zM4 10h16M8 15h8" },
  { title: "Social media", text: "Native-feeling social copy for IG, LinkedIn, TikTok and more — length, voice and local idiom respected.", iconPath: "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-7-3L3 21l4.1-2a8.5 8.5 0 1 1 13.9-7.5z" },
  { title: "Press releases", text: "PR and media releases translated to editorial standard — ready for distribution in the local press.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "Ad copy", text: "Google, Meta and display ad copy, plus video and radio ad scripts — localized for engagement.", iconPath: "M15 10l4-2v8l-4-2M5 6h10v12H5z" },
  { title: "Brand guidelines", text: "Brand books, voice guides and style docs — translated so local teams produce on-brand content.", iconPath: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
  { title: "Email marketing", text: "Lifecycle emails, newsletters and automated flows — subject lines included, A/B-ready.", iconPath: "M4 6h16v12H4zM4 6l8 7 8-7" },
];

const deliverables = [
  "DOCX · PDF · Google Docs",
  "HTML · XLIFF · PO",
  "Figma · InDesign",
  "CSV for CMS / ESP",
];

const processSteps = [
  { num: "01", title: "Brand brief", text: "Share your brand book, campaign brief and target markets — we agree the tone, voice and non-negotiables." },
  { num: "02", title: "Transcreate", text: "A native copywriter rewrites — not just translates — your campaign so it lands with local emotion and context." },
  { num: "03", title: "Back-translation", text: "A second linguist back-translates key lines so you can see exactly what the new copy says in English before approval." },
  { num: "04", title: "Deliver", text: "Final campaign assets in your working format — ready to brief into your in-market media or production team." },
];

export default function MarketingTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">Marketing Translation Services</span>
            <h1 className="svc-hero-title">
              Marketing transcreation that <span className="accent">keeps your brand voice.</span>
            </h1>
            <p className="svc-hero-lead">
              Taglines, campaign copy and brand content transcreated for each
              market — written by native copywriters who get your brand and
              write for the local audience.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Transcreation</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />On-brand voice</div>
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
              <h2 className="svc-overview-title">Transcreation that writes for the market, not just across it.</h2>
              <p>
                Marketing content isn't translated — it's transcreated.
                Taglines, campaign headlines and brand copy are rewritten by
                native copywriters so the local audience feels the same
                emotion the source audience feels.
              </p>
              <p>
                We pair each project with a native-speaker copywriter who
                knows your category — plus back-translation and local-reviewer
                sign-off so you can approve the final tone with confidence
                before launch.
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
                <span>brand content.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From taglines to full campaigns — the marketing content that
              carries your brand into each new market.
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
              Clean deliverables in whatever your design, CMS or ad platform
              expects — ready for your in-market team to brief into production.
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
              <h2>Transcreation built on <span className="accent">creative review.</span></h2>
            </div>
            <p>
              A 4-step workflow built around native copywriting + back-translation
              review so you can approve with full confidence before launch.
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
            <h2>Launching a <span className="accent">global campaign?</span></h2>
            <p>
              Share your brief, brand guidelines and target markets — we'll
              match you with native copywriters for every language and come
              back with a scoped quote.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
