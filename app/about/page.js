"use client";

import Link from "next/link";
import GlobeCanvas from "../components/GlobeCanvas";
import AboutAnimations from "./AboutAnimations";
import "./About.css";

const values = [
  {
    number: "01",
    title: "Language Expertise",
    text: "Language is more than words. We consider context, culture, terminology and purpose in every project.",
  },
  {
    number: "02",
    title: "Global Perspective",
    text: "We help businesses and individuals communicate naturally across languages, markets and cultures.",
  },
  {
    number: "03",
    title: "Quality & Trust",
    text: "Accuracy, consistency, confidentiality and careful review are part of every project we handle.",
  },
  {
    number: "04",
    title: "People First",
    text: "Behind every translation is a person, a business or an idea that deserves to be understood.",
  },
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We understand your requirements, language pair, audience and project goals.",
  },
  {
    number: "02",
    title: "Translate",
    text: "Your content is translated with attention to meaning, terminology and context.",
  },
  {
    number: "03",
    title: "Review",
    text: "The translated content goes through language and quality review.",
  },
  {
    number: "04",
    title: "Deliver",
    text: "The final content is prepared and delivered according to your requirements.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutAnimations />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">
        <div className="about-hero-bg-glow about-hero-bg-glow-one" />
        <div className="about-hero-bg-glow about-hero-bg-glow-two" />

        <div className="about-hero-grid">

          <div className="about-hero-content">

            <span className="about-eyebrow">
              ABOUT UNIVERSAL LANGUAGE TRANSLATIONS
            </span>

            <h1 className="about-hero-title">
              <span className="hero-line">
                CONNECTING PEOPLE
              </span>

              <span className="hero-line">
                BEYOND LANGUAGE.
              </span>
            </h1>

            <p className="about-hero-description">
              We help people and businesses communicate across languages
              with clarity, accuracy and cultural understanding.
            </p>

            <div className="about-hero-actions">

              <Link
                href="/contact"
                className="about-primary-btn"
              >
                Get in Touch
                <span>↗</span>
              </Link>

              <a
                href="#our-story"
                className="about-secondary-btn"
              >
                Our Story
              </a>

            </div>

          </div>


          {/* HERO GLOBE */}

          <div className="about-hero-visual">

            <div className="about-globe-wrap">

              <div className="about-globe-glow" />

              <div className="about-globe-canvas">
                <GlobeCanvas />
              </div>

              <div className="about-globe-label about-globe-label-one">
                <span>01</span>
                GLOBAL LANGUAGES
              </div>

              <div className="about-globe-label about-globe-label-two">
                <span>02</span>
                GLOBAL COMMUNICATION
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          WHO WE ARE / OUR STORY
      ===================================================== */}

      <section
        className="about-story"
        id="our-story"
      >

        <div className="about-story-reference-layout">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="about-story-left">

            <div className="about-story-image-wrap">

              <img
                src="/images/about-story.jpg"
                alt="People communicating and working together"
                className="about-story-image"
              />

            </div>


            <div className="about-story-headline-wrap">

              <h2 className="about-story-headline">

                <span className="story-headline-muted">
                  LANGUAGE SHOULD
                </span>

                <span className="story-headline-black">
                  CONNECT,
                </span>

                <span className="story-headline-teal">
                  NOT SEPARATE.
                </span>

              </h2>

            </div>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="about-story-right">

            <div className="about-story-right-top">

              <div className="about-story-eyebrow">
                <span />
                WHO WE ARE
              </div>


              <div className="about-story-copy">

                <p className="story-reveal">
                  Universal Language Translations helps businesses
                  communicate clearly across languages, cultures and
                  markets through professional language and
                  multilingual data services.
                </p>

                <p className="story-reveal">
                  Our core services include Translation, Transcription,
                  Subtitles, Voiceover, Data Annotation, Data Evolution
                  and Multilingual Data Creation.
                </p>

                <p className="story-reveal">
                  We focus on preserving meaning, context and consistency
                  so that content can move naturally between languages
                  and reach the people it is intended for.
                </p>

              </div>


              <Link
                href="/services"
                className="about-story-cta story-reveal"
              >
                <span>EXPLORE OUR SERVICES</span>
                <span className="about-story-cta-arrow">
                  ↗
                </span>
              </Link>

            </div>


            <div className="about-story-bottom">

              <span className="about-story-bottom-text">
                From language to meaning, clarity connects people.
              </span>

              <span className="about-story-bottom-line" />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section className="about-mission">

        <div className="about-container">

          <div className="mission-grid">

            {/* LEFT — eyebrow + title + description */}
            <div className="mission-intro">

              <span className="about-section-label">
                OUR MISSION
              </span>

              <h2 className="mission-title">

                <span className="mission-title-line">
                  Make every message
                </span>

                <span className="mission-title-line">
                  understood.
                </span>

              </h2>

              <p className="mission-description">
                We make communication easier across languages by combining
                language expertise, cultural understanding and multilingual
                data capabilities.
              </p>

            </div>

            {/* RIGHT — 4 mission pillars */}
            <ul className="mission-pillars" aria-label="Mission pillars">

              <li className="mission-pillar">
                <span className="mission-pillar-num">01</span>
                <h3 className="mission-pillar-title">Clarity</h3>
                <p className="mission-pillar-copy">
                  Translations that preserve meaning, tone and intent — never just literal word swaps.
                </p>
              </li>

              <li className="mission-pillar">
                <span className="mission-pillar-num">02</span>
                <h3 className="mission-pillar-title">Context</h3>
                <p className="mission-pillar-copy">
                  Subject-matter linguists who understand your industry, audience and brand.
                </p>
              </li>

              <li className="mission-pillar">
                <span className="mission-pillar-num">03</span>
                <h3 className="mission-pillar-title">Culture</h3>
                <p className="mission-pillar-copy">
                  Localisation that respects the people, place and nuance behind the language.
                </p>
              </li>

              <li className="mission-pillar">
                <span className="mission-pillar-num">04</span>
                <h3 className="mission-pillar-title">Connection</h3>
                <p className="mission-pillar-copy">
                  One accountable team, consistent quality, every project — from brief to delivery.
                </p>
              </li>

            </ul>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values">

        <div className="about-container">

          <div className="about-heading-row">

            <div>

              <span className="about-section-label">
                WHAT GUIDES US
              </span>

              <h2>
                Built around
                <br />
                <span>understanding.</span>
              </h2>

            </div>

            <p>
              Every project begins with understanding the people,
              purpose and context behind the content.
            </p>

          </div>


          <div className="about-values-grid">

            {values.map((value) => (
              <div
                className="about-value-card"
                key={value.number}
              >

                <span className="value-number">
                  {value.number}
                </span>

                <div className="value-line" />

                <h3>
                  {value.title}
                </h3>

                <p>
                  {value.text}
                </p>

                <span className="value-arrow">
                  ↗
                </span>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="about-process">

        <div className="about-container">

          <div className="about-process-heading">

            <span className="about-section-label">
              OUR PROCESS
            </span>

            <h2>
              Clear from
              <br />
              <span>start to finish.</span>
            </h2>

          </div>


          <div className="process-track">
            <div className="process-progress" />
          </div>


          <div className="about-process-grid">

            {process.map((item) => (
              <div
                className="about-process-item"
                key={item.number}
              >

                <span className="process-dot" />

                <span className="process-number">
                  {item.number}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div className="about-container">

          <div className="about-cta-inner">

            <span className="about-section-label">
              LET'S CONNECT
            </span>

            <h2 className="about-cta-heading">
              <span className="cta-heading-line">
                <span className="cta-word">Your</span>
                {" "}
                <span className="cta-word">message</span>
              </span>
              <span className="cta-heading-line cta-heading-line-accent">
                <span className="cta-word">deserves</span>
                {" "}
                <span className="cta-word">to</span>
                {" "}
                <span className="cta-word">be</span>
                {" "}
                <span className="cta-word">understood.</span>
              </span>
            </h2>

            <p>
              Talk to us about your translation, transcription,
              subtitle, voiceover or multilingual data requirements.
            </p>

            <Link
              href="/contact"
              className="about-primary-btn"
            >
              Get in Touch
              <span>↗</span>
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}