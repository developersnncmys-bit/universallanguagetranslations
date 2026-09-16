"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./Services.css";

const INTRO_STATS = [
  { value: "100+", label: "Languages covered" },
  { value: "2,500+", label: "Projects delivered" },
  { value: "99.4%", label: "On-time delivery rate" },
  { value: "24/7", label: "Global availability" },
];

const SERVICES = [
  {
    key: "translation",
    title: "Translation",
    subtitle:
      "Certified, context-aware translation across 100+ languages by native linguists in every major domain.",
    img: "/images/translation.png",
  },
  {
    key: "transcription",
    title: "Transcription",
    subtitle:
      "Verbatim and clean-read transcription with precise timestamps and speaker labels, tuned for broadcast, legal, and research.",
    img: "/images/transcription.png",
  },
  {
    key: "subtitles",
    title: "Subtitles",
    subtitle:
      "Broadcast-quality SDH, closed captions, and burned-in subtitles — formatted for every platform and locale.",
    img: "/images/subtitiles.png",
  },
  {
    key: "voiceover",
    title: "Voiceover",
    subtitle:
      "Studio-grade voice talent, dubbing, and lip-sync in a rich library of voices and accents worldwide.",
    img: "/images/voiceover.png",
  },
  {
    key: "annotation",
    title: "Data Annotation",
    subtitle:
      "High-fidelity labeling for NLP, vision, and speech — engineered for AI training pipelines at scale.",
    img: "/images/data-annotation.png",
  },
  {
    key: "evolution",
    title: "Data Evolution",
    subtitle:
      "Cleanse, enrich, and evolve multilingual datasets so your models keep improving with every release cycle.",
    img: "/images/data-evolution.png",
  },
  {
    key: "multilingual",
    title: "Multilingual Data",
    subtitle:
      "Bespoke prompts, dialogue, and corpora crafted for LLMs, safety benchmarks, and enterprise AI.",
    img: "/images/multilingual-data.png",
  },
];

export default function Services() {
  const [activeIdx, setActiveIdx] = useState(0);
  const rowRefs = useRef([]);

  // On every scroll frame, find whichever list row's vertical center is
  // closest to the viewport's vertical center and mark it active. Uses
  // requestAnimationFrame throttling. This is more reliable than an
  // IntersectionObserver with a narrow center band, which can skip rows
  // when they don't happen to cross the band on a fast scroll.
  useEffect(() => {
    let rafId = 0;

    const compute = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIdx = 0;
      let closestDist = Infinity;
      rowRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });
      setActiveIdx(closestIdx);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="services section" id="services">
      <div className="container">
        {/* Intro row — sticky headline left, description + CTA + stats right */}
        <div className="services__intro reveal-stagger">
          <h2 className="services__intro-title">
            <span className="services__intro-title-thin">Translation, transcription, subtitles, voice, and multilingual data.</span>
            <span className="services__intro-title-bold">Across 100+ languages.</span>
          </h2>

          <div className="services__intro-right">
            <p>
              With every service under one roof and one accountable team,
              your content pipeline moves the way your business demands:
              predictably, transparently, and without excuses.
            </p>
            <p>
              That means no finger-pointing between vendors. No delays lost
              in handoffs. Just one team, accountable from brief to delivery.
            </p>
            <Link href="/services" className="btn btn-outline services__intro-cta">
              Learn more about us
              <ArrowRight />
            </Link>

            <ul className="services__intro-stats">
              {INTRO_STATS.map((s) => (
                <li className="intro-stat" key={s.label}>
                  <span className="intro-stat__value">{s.value}</span>
                  <span className="intro-stat__label">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Split-scroll pattern: left column has the sticky section header
          (eyebrow + title + lede) stacked ABOVE the preview image, so
          both the framing text and the active photo stay pinned as the
          right-hand list of services scrolls past. Active row driven by
          the IntersectionObserver above. */}
      <div className="container">
        <div className="svc-split">
          <div className="svc-split__preview">
            <div className="svc-split__head">
              <span className="svc-grid-eyebrow">Our offerings</span>
              <h3 className="svc-grid-title">Seven interlocking services.</h3>
              <p className="svc-grid-lede">
                Run one standalone or combine them into a unified multilingual
                pipeline — same team, same quality bar, one point of contact.
              </p>
            </div>
            <div className="svc-split__stage">
              {SERVICES.map((s, i) => (
                <div
                  key={s.key}
                  className={`svc-split__panel ${
                    activeIdx === i ? "is-active" : ""
                  }`}
                  aria-hidden={activeIdx !== i}
                >
                  <img
                    src={s.img}
                    alt=""
                    className="svc-split__img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <ol className="svc-split__list">
            {SERVICES.map((s, i) => (
              <li
                key={s.key}
                data-idx={i}
                ref={(el) => (rowRefs.current[i] = el)}
                className={`svc-split__row ${
                  activeIdx === i ? "is-active" : ""
                }`}
              >
                <span className="svc-split__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="svc-split__body">
                  <h4 className="svc-split__title">{s.title}</h4>
                  <p className="svc-split__desc">{s.subtitle}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
