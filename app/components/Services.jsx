"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    key: "evaluation",
    title: "Data Evaluation",
    subtitle:
      "Dataset audits, label quality scoring, inter-annotator agreement and bias reviews — a defensible read on what your training data is really worth.",
    img: "/images/data-evaluation.png",
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
  //
  // SEQUENTIAL CATCH-UP WITH DWELL — the active state advances by at most
  // one row at a time toward the target, AND each row is held for a
  // minimum dwell period before the next transition fires. On fast
  // scrolls (or Lenis's eased scroll overshooting) the raw
  // "closest-to-center" row can jump from 0 → 3 in one frame, skipping
  // rows 1 and 2 entirely so those services never get activated. Just
  // advancing one-per-frame (~16ms each) is still imperceptible — the
  // user sees the final target without ever registering the intermediates.
  // The dwell gate forces each row to be visibly active for at least
  // DWELL_MS before the next step is allowed, so a fast flick visibly
  // walks through every service on both forward and reverse scroll.
  useEffect(() => {
    let rafId = 0;
    // Mirror of activeIdx held outside React so the compute loop can read
    // + step it without racing with the async setState cycle.
    let localActive = 0;
    // Timestamp of the last state change; the dwell gate below compares
    // against `performance.now()` to decide whether another step is
    // allowed yet.
    let lastChangeTime = 0;
    // Minimum visible-active time per row during a catch-up walk.
    // Tuned to be long enough to read as a distinct activation (not a
    // flicker) but short enough that a user scrolling past the entire
    // list to reach the next section doesn't feel the lag.
    //   7 services × 140ms ≈ 1s to walk the full list after a flick.
    const DWELL_MS = 140;

    const compute = () => {
      const now = typeof performance !== "undefined"
        ? performance.now()
        : Date.now();

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

      // Already at the target — nothing to do, stop the loop.
      if (closestIdx === localActive) {
        rafId = 0;
        return;
      }

      // Dwell gate — too soon since the last transition. Keep the RAF
      // loop alive so we re-check on the next frame; don't change state.
      if (now - lastChangeTime < DWELL_MS) {
        rafId = requestAnimationFrame(compute);
        return;
      }

      // Advance exactly one row toward the target. Direction follows
      // the sign of the gap, so forward and reverse scroll both get
      // the same step-by-step walk-through.
      const next = closestIdx > localActive
        ? localActive + 1
        : localActive - 1;
      localActive = next;
      lastChangeTime = now;
      setActiveIdx(next);

      // Still catching up — keep the loop alive. Once localActive ===
      // closestIdx, the early-return at the top of the next tick will
      // park the loop (rafId = 0) until the next scroll event.
      rafId = requestAnimationFrame(compute);
    };

    const onScroll = () => {
      // Don't stack frames — if a compute is already queued (either
      // from a prior scroll event or from the self-driven catch-up),
      // let it run; it will read the latest scroll position on its own.
      if (!rafId) {
        rafId = requestAnimationFrame(compute);
      }
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
    // Mobile guard: pin + scrubbed-timeline reveals break on narrow
    // viewports (cramped layout, janky scroll). Skip the pin entirely
    // below 900px — intro content renders naturally with no pin.
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
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

      // Three distinct scroll "beats": (1) texts reveal, (2) stats reveal,
      // (3) pin releases to the next section. Timeline length is tuned so
      // each beat takes roughly one wheel/trackpad flick of scroll, and
      // `snap` locks the pin to beat boundaries so a half-scroll always
      // settles cleanly on the previous or next phase instead of mid-fade.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          // Longer pin (was +=75%) so beats 1 and 2 each get a proper
          // scroll window instead of being crammed into one short burst.
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          refreshPriority: 10,
          // Slightly higher scrub (0.6 → 0.8) so progress eases smoothly
          // into the snap target instead of snapping harshly on release.
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Snap to each beat so the user feels discrete clicks:
          //   0.00 = pin start (texts hidden)
          //   0.42 = beat 1 complete (texts visible)
          //   0.85 = beat 2 complete (stats visible)
          //   1.00 = pin release → next section
          snap: {
            snapTo: [0, 0.42, 0.85, 1],
            duration: { min: 0.15, max: 0.4 },
            delay: 0.08,
            ease: "power1.inOut",
          },
        },
      });

      // ── BEAT 1 (0.00 → 0.42) — all text reveals (title + description
      //    + CTA) land in the first scroll. Words brighten word-by-word
      //    for the lead-in; CTA fades in at the tail of the beat.
      if (titleWords.length) {
        tl.to(
          titleWords,
          {
            opacity: 1,
            stagger: 0.012,
            ease: "none",
            duration: 0.22,
          },
          0
        );
      }

      if (descWords.length) {
        tl.to(
          descWords,
          {
            opacity: 1,
            stagger: 0.008,
            ease: "none",
            duration: 0.22,
          },
          0.14
        );
      }

      if (ctaEl) {
        tl.to(
          ctaEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: "power2.out",
          },
          0.32
        );
      }

      // ── BEAT 2 (0.52 → 0.85) — stat cards fade up one by one on the
      //    second scroll. Starts after a short hold so beat 1's final
      //    frame has a moment to breathe before stats appear.
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
          0.52
        );
      }

      // ── BEAT 3 (0.85 → 1.00) — intentional hold. No new tweens.
      //    The pin stays locked, stats stay fully visible, and the next
      //    scroll flick snaps to progress 1.0 which releases the pin
      //    and reveals the next section.

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
      {/* `services__intro-pin--released` is applied statically here so the
          section stays in its light/white palette. The scroll-driven
          black→white transition is disabled — see commented onUpdate above. */}
      <div className="services__intro-pin services__intro-pin--released" ref={introPinRef}>
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
                  {/* Next.js <Image> auto-serves WebP/AVIF + responsive
                      sizes, slashes the original 2.5MB PNGs by 70-85%.
                      First panel gets priority so it paints without a
                      network wait; the rest lazy-load behind the scenes. */}
                  <Image
                    src={s.img}
                    alt=""
                    className="svc-split__img"
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    quality={78}
                    priority={i === 0}
                    loading={i === 0 ? undefined : "lazy"}
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

