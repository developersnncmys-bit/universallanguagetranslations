"use client";

import Link from "next/link";
import GlobeCanvas from "../../../components/GlobeCanvas";
import ServicesAnimations from "../../ServicesAnimations";
import "../../services.css";

const capabilities = [
  "Product listings & PDPs",
  "Category & navigation",
  "Checkout flow strings",
  "Email marketing",
  "Customer reviews & UGC",
  "SEO & meta content",
  "Legal & policy pages",
  "Support & help centre",
];

const documentTypes = [
  { title: "Product pages", text: "PDPs with titles, bullet features, descriptions and attributes — tuned for conversion in the local market.", iconPath: "M4 4h16v16H4zM8 10h8M8 14h4" },
  { title: "Category pages", text: "Category copy, filters and merch content that reads native and matches local search intent.", iconPath: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" },
  { title: "Checkout UX", text: "Cart, shipping, payment and confirmation strings — localized for trust and completion.", iconPath: "M3 3h2l2 12h12l2-8H6M9 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" },
  { title: "Email marketing", text: "Transactional, lifecycle and promotional emails — subject lines included, tested for local resonance.", iconPath: "M4 6h16v12H4zM4 6l8 7 8-7" },
  { title: "Reviews & UGC", text: "Translate customer reviews, Q&A and user content at scale while preserving tone and intent.", iconPath: "M12 2 15 9h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" },
  { title: "SEO & meta", text: "Keyword research, meta titles, descriptions and alt text — tuned for each market's search behaviour.", iconPath: "M11 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM21 21l-6-6" },
  { title: "Legal & policy", text: "Terms, privacy, returns and shipping policies — localized for compliance with local consumer law.", iconPath: "M6 2h9l5 5v15H6zM10 11h8M10 15h8M10 19h5" },
  { title: "Support content", text: "Help-centre articles, FAQ and chat scripts — ready for self-serve support in every language.", iconPath: "M9 10h.01M12 10h.01M15 10h.01M4 4h16v12H5l-1 4z" },
];

const deliverables = [
  "CSV · XLSX · JSON",
  "XML · XLIFF · PO",
  "Shopify / WooCommerce / Magento",
  "Headless CMS payloads",
];

const processSteps = [
  { num: "01", title: "Discovery", text: "We review your catalog, brand guidelines and target markets — plus any existing glossary or style guide." },
  { num: "02", title: "Translate", text: "A native e-commerce copywriter translates — writing for conversion, not just literal fidelity." },
  { num: "03", title: "Review", text: "A second in-market reviewer checks tone, trust triggers and local idiom before sign-off." },
  { num: "04", title: "Deliver", text: "Clean payloads back in your platform format — ready to push live via API or import." },
];

export default function EcommerceTranslationPage() {
  return (
    <div className="svc-page">
      <ServicesAnimations />

      <section className="svc-hero">
        <div className="svc-hero-grid">
          <div>
            <span className="svc-eyebrow">E-commerce Translation Services</span>
            <h1 className="svc-hero-title">
              E-commerce translation that <span className="accent">converts in every market.</span>
            </h1>
            <p className="svc-hero-lead">
              Product catalogs, PDPs, checkout flows and campaigns tuned to
              convert in every market — on-brand, in local voice, and
              platform-ready for your stack.
            </p>
            <div className="svc-hero-actions">
              <Link href="/contact" className="svc-btn-primary">Request a quote <span aria-hidden>↗</span></Link>
              <a href="#document-types" className="svc-btn-secondary">See what we translate</a>
            </div>
          </div>
          <div className="svc-hero-visual svc-hero-visual--globe" aria-hidden="true">
            <div className="svc-hero-chip svc-hero-chip--one"><span className="dot" />Shopify · Woo · Magento</div>
            <div className="svc-hero-chip svc-hero-chip--two"><span className="dot" />Conversion-tuned</div>
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
              <h2 className="svc-overview-title">E-commerce translation built around conversion, not just language.</h2>
              <p>
                We translate the full storefront experience — product
                listings, category pages, checkout flow, email campaigns and
                support content — written for shoppers in each market the
                same way a local copywriter would write it.
              </p>
              <p>
                Every project ships with a per-brand glossary and translation
                memory so your catalog grows cheaper and tighter over time,
                and plugs directly into Shopify, Woo, Magento or your
                headless CMS of choice.
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
                Every storefront
                <br />
                <span>touchpoint.</span>
              </h2>
            </div>
            <p className="svc-services-lead">
              From product pages to post-purchase emails — we localize every
              touchpoint in the shopper journey, in a voice that converts.
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
              <h2>Platform-ready in <span className="accent">the format you need.</span></h2>
            </div>
            <p>
              We ship back in whatever your stack expects — CSV catalog
              exports, platform payloads or direct API push.
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
              <h2>From catalog to <span className="accent">live storefront.</span></h2>
            </div>
            <p>
              A tight 4-step workflow that keeps brand voice, SEO signals and
              platform integrity intact at scale.
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
            <h2>Ready to sell <span className="accent">in a new market?</span></h2>
            <p>
              Share your catalog, target markets and platform — we'll come
              back with a scoped quote and a plan to launch native-feeling
              storefronts in every language.
            </p>
            <Link href="/contact" className="svc-btn-primary">Get a quote <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
