"use client";

import Link from "next/link";
import GlobeCanvas from "../components/GlobeCanvas";
import EnquirySection from "../components/EnquirySection";
import "./Contact.css";

const contactChannels = [
  {
    label: "Email",
    value: "hello@universaltranslations.com",
    href: "mailto:hello@universaltranslations.com",
    note: "Project briefs, quotes, partnerships",
  },
  {
    label: "WhatsApp",
    value: "+00 00000 00000",
    href: "https://wa.me/000000000000",
    note: "Fastest replies — chat with a human",
  },
  {
    label: "Phone",
    value: "+00 00000 00000",
    href: "tel:+000000000000",
    note: "Mon–Fri, 09:00 – 18:00 (IST)",
  },
];

export default function ContactPage() {
  return (
    <div className="contact-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero">
        <div className="contact-hero-bg-glow contact-hero-bg-glow-one" />
        <div className="contact-hero-bg-glow contact-hero-bg-glow-two" />

        <div className="contact-hero-grid">

          <div className="contact-hero-content">

            <span className="contact-eyebrow">
              CONTACT UNIVERSAL LANGUAGE TRANSLATIONS
            </span>

            <h1 className="contact-hero-title">
              <span className="contact-hero-line">LET&apos;S TALK</span>
              <span className="contact-hero-line">TRANSLATION.</span>
            </h1>

            <p className="contact-hero-description">
              Share a brief, ask for a quote, or just say hello.
              We reply to every enquiry within one business day.
            </p>

            <div className="contact-hero-actions">
              <Link
                href="#enquiry"
                className="contact-primary-btn"
              >
                Send an enquiry
                <span>↗</span>
              </Link>

              <a
                href="mailto:hello@universaltranslations.com"
                className="contact-secondary-btn"
              >
                Email us directly
              </a>
            </div>

          </div>


          <div className="contact-hero-visual" aria-hidden="true">
            <div className="contact-globe-wrap">
              <div className="contact-globe-glow" />
              <div className="contact-globe-canvas">
                <GlobeCanvas />
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT DETAILS
      ===================================================== */}

      <section className="contact-details">

        <div className="contact-container">

          <div className="contact-details-head">
            <span className="contact-section-label">
              <span />
              REACH US DIRECTLY
            </span>

            <h2 className="contact-details-heading">
              Pick the channel that
              <br />
              <span>works for you.</span>
            </h2>
          </div>


          <div className="contact-channels">
            {contactChannels.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                className="contact-channel-card reveal"
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <span className="contact-channel-num">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="contact-channel-label">{c.label}</span>

                <span className="contact-channel-value">{c.value}</span>

                <span className="contact-channel-note">{c.note}</span>

                <span className="contact-channel-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

        </div>

      </section>


      {/* =====================================================
          ENQUIRY FORM (reuses the shared EnquirySection)
      ===================================================== */}

      <EnquirySection />

    </div>
  );
}
