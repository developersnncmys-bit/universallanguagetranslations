"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Services.css";

gsap.registerPlugin(ScrollTrigger);

// Split a plain text into <span class="scrub-word"> spans, one per word.
// Rendered spaces are plain text between spans so the browser can still
// break lines at word boundaries.
function ScrubWords({ text }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="scrub-word">{word}</span>
    </Fragment>
  ));
}

const INTRO_STATS = [
  { value: "100+", label: "Languages covered" },
  { value: "2,500+", label: "Projects delivered" },
  { value: "99.4%", label: "On-time delivery rate" },
  { value: "24/7", label: "Team availability", highlight: true },
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
  const introRef = useRef(null);
  const statsRef = useRef(null);
  const introPinRef = useRef(null);
  const rowRefs = useRef([]);
  const splitRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Split-scroll active-row tracker: on every scroll frame find whichever
  // list row's vertical center is closest to the viewport's vertical center
  // and mark it active. Drives which preview image is shown in the sticky
  // left column and which row title reads bright vs muted on the right.
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

  // PINNED intro reveal — SEQUENTIAL, one element per scroll step.
  // The wrapper pins and a scrubbed timeline runs FOUR non-overlapping
  // phases so the user reveals headline → descriptions → button → stats
  // one at a time as they scroll. Scrolling back up reverses each phase.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const pinEl = introPinRef.current;
    const introEl = introRef.current;
    const statsEl = statsRef.current;
    if (!pinEl || !introEl || !statsEl) return;

    const titleEl = introEl.querySelector(".services__intro-title");
    const descParas = introEl.querySelectorAll(".services__intro-right p");
    const ctaEl = introEl.querySelector(".services__intro-cta");
    const stats = statsEl.querySelectorAll(".intro-stat");
    const titleWords = titleEl
      ? titleEl.querySelectorAll(".scrub-word")
      : [];
    const descWords = introEl.querySelectorAll(
      ".services__intro-right .scrub-word"
    );

    const ctx = gsap.context(() => {
      // Text words are fully opaque from the start so they read as
      // clean white-on-black during the dark phase — no grey/dim
      // scrub-in effect that made them hard to read on the black bg.
      // CTA + stats still start hidden and reveal on scroll.
      gsap.set(titleWords, { opacity: 1 });
      gsap.set(descWords, { opacity: 1 });
      if (ctaEl) gsap.set(ctaEl, { opacity: 0, y: 16 });
      if (stats.length) gsap.set(stats, { opacity: 0, y: 40 });

      // Timeline is 4 discrete phases (no overlap). End extended to
      // "+=180%" so each phase gets ~45% of the scroll for a clear
      // "reveals one per scroll" feel rather than everything at once.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: "+=220%",
          pin: true,
          pinSpacing: true,
          // refreshPriority: 10 forces this ScrollTrigger to refresh
          // BEFORE downstream pins (GlobalLanguageNetwork, TranslationSubservices).
          // Without this, GLN measures its "top top" position before this
          // pin's pinSpacer is inserted, so GLN's start fires at a stale
          // doc position — inside the offerings-panel's rendered area —
          // producing the "sections overlap" symptom.
          refreshPriority: 10,
          // Longer scrub = more inertia between scroll velocity and
          // timeline progress → the reveal glides instead of tracking
          // the wheel 1:1. Combined with the extended `+=220%` scroll
          // range each phase gets more room to breathe.
          scrub: 1.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Black → white flip triggers early — as soon as the headline
          // starts revealing (Phase 1 runs 0.00 → 0.22, so threshold
          // 0.05 fires just after the first words appear). The 0.6s CSS
          // fade to white then plays alongside the headline scrub.
          onUpdate: (self) => {
            if (self.progress >= 0.05) {
              pinEl.classList.add("services__intro-pin--released");
            } else {
              pinEl.classList.remove("services__intro-pin--released");
            }
          },
        },
      });

      // ── Phase 1 (0.00 → 0.22) — HEADLINE brightens word by word.
      if (titleWords.length) {
        tl.to(
          titleWords,
          {
            opacity: 1,
            stagger: 0.02,
            ease: "none",
            duration: 0.22,
          },
          0
        );
      }

      // ── Phase 2 (0.28 → 0.55) — DESCRIPTION paragraphs brighten.
      if (descWords.length) {
        tl.to(
          descWords,
          {
            opacity: 1,
            stagger: 0.012,
            ease: "none",
            duration: 0.27,
          },
          0.28
        );
      }

      // ── Phase 3 (0.60 → 0.72) — CTA button appears.
      if (ctaEl) {
        tl.to(
          ctaEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.12,
            ease: "power2.out",
          },
          0.60
        );
      }

      // ── Phase 4 (0.78 → 1.00) — STAT cards fade up one by one.
      if (stats.length) {
        tl.to(
          stats,
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            ease: "power2.out",
            duration: 0.16,
          },
          0.78
        );
      }

    }, pinEl);
    return () => ctx.revert();
  }, []);


  // Offerings panel slide-up: as the `.svc-split` panel enters the viewport,
  // the entire block slides up from below and fades in. Panel carries its
  // own rounded-top card styling so it reads as a card rising into place.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const el = splitRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 160, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="services section" id="services">
      {/* Pinned intro wrapper — the whole block (headline + description +
          stats) sticks to the viewport while a scrubbed GSAP timeline
          reveals words and stat cards in sequence. */}
      <div className="services__intro-pin" ref={introPinRef}>
        <div className="container">
          {/* Intro row — headline + description + CTA. Each word carries a
              `.scrub-word` class so a scroll-scrubbed GSAP tween can brighten
              them one-by-one as the block enters the viewport. */}
          <div className="services__intro reveal-stagger" ref={introRef}>
            <h2 className="services__intro-title">
              <span className="services__intro-title-thin">
                <ScrubWords text="Translation, transcription, subtitles," />
                <br />
                <ScrubWords text="voice, and multilingual data" />
                <span className="big-dot">.</span>
              </span>
              <span className="services__intro-title-bold">
                <ScrubWords text="Across 100+ languages" />
                <span className="big-dot">.</span>
              </span>
            </h2>

            <div className="services__intro-right">
              <p>
                <ScrubWords text="With every service under one roof and one accountable team, your content pipeline moves the way your business demands: predictably, transparently, and without excuses." />
              </p>
              <p>
                <ScrubWords text="That means no finger-pointing between vendors. No delays lost in handoffs. Just one team, accountable from brief to delivery." />
              </p>
              <Link href="/services" className="btn btn-outline services__intro-cta">
                Learn more about us
                <ArrowRight />
              </Link>
            </div>
          </div>

          <ul className="services__intro-stats" ref={statsRef}>
            {INTRO_STATS.map((s) => (
              <li
                className={`intro-stat ${s.highlight ? "intro-stat--live" : ""}`}
                key={s.label}
              >
                <span className="intro-stat__value">
                  {s.highlight && (
                    <span
                      className="intro-stat__pulse"
                      aria-label="Live"
                      title="Available now"
                    />
                  )}
                  {s.value}
                </span>
                <span className="intro-stat__label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full-width offerings panel: opaque, rounded top corners, z-index
          above the stats row. Sits with a negative margin-top so its
          natural resting position OVERLAPS the bottom of the stats — that
          overlap is the "slide-up over the services section" effect. GSAP
          then translates the whole panel up from below the viewport as
          the user scrolls into it. */}
      <div className="offerings-panel" ref={splitRef}>
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

