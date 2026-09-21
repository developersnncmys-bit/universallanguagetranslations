"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlobeCanvas from "./GlobeCanvas";
import "./Hero.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// TODO: Replace WHATSAPP_NUMBER with the real business number.
const WHATSAPP_HREF =
  "https://wa.me/0000000000?text=" +
  encodeURIComponent("Hi! I would like a quote for translation services.");

export default function Hero() {
  const root = useRef(null);

  // Scroll-driven cinematic hero transformation. Base CSS defines the
  // INITIAL composition (planet dome centered in upper area, copy centered
  // in lower area). GSAP interpolates from that CSS default toward an
  // explicit FINAL composition (planet larger + right-cropped, copy
  // left-aligned + vertically centered).
  //
  //   INITIAL  →  transition  →  FINAL
  //   centered dome              right-cropped large sphere
  //   centered copy              left-aligned copy
  //
  // A user with reduced-motion or JS disabled sees the INITIAL composition
  // (a self-contained centered dome hero) and never triggers the timeline —
  // that's a valid resting state.
  //
  // The lower-hemisphere dark fade is entirely SHADER-driven inside
  // GlobeCanvas (uLowerFade uniform, keyed off scrollY) — no CSS clip-path,
  // no rectangular container.
  useEffect(() => {
  const rootEl = root.current;
  if (!rootEl) return;

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const inner = rootEl.querySelector(".hero__inner");
  const copy = rootEl.querySelector(".hero__copy");
  const planet = rootEl.querySelector(".hero__planet");
  // IMPORTANT: the visible sunrise lives OUTSIDE the hero section (in
  // page.js, between .hero-scroll-stage and <Services />). It must be
  // selected from the document — not from rootEl — otherwise GSAP silently
  // animates the wrong element and the real sunrise renders at CSS
  // default opacity (which is why it appeared "too early" before).
  const sunrise = document.querySelector(".hero-sunrise");


  const flexChildren = copy
    ? copy.querySelectorAll(".hero__cta, .hero__badges")
    : [];

  if (!inner || !copy || !planet) return;
  

  const ctx = gsap.context(() => {
    // PEAK zoom — globe fills the viewport (still centered) mid-transition
    const peakPlanet = () => ({
      x: 0,
      y: window.innerHeight * 0.05,
      scale: 1.6,
    });

    // FINAL globe position — right-cropped, still large
    const finalPlanet = () => ({
      x: window.innerWidth * 0.28,
      y: -window.innerHeight * 0.28,
      scale: 1.1,
    });

    // FINAL text position
    const finalInner = () => ({
      x: -window.innerWidth * 0.2,
      y: window.innerHeight * 0.02,
    });

    // Sunrise reveals via NATURAL SCROLL (vercel behavior) — the div sits
    // at doc position 230→340vh (via margin-top: -110vh) and enters the
    // viewport from the bottom as user scrolls past 130vh. The sticky hero
    // stays pinned, so the sunrise reads as sliding UP over the hero.
    // NO GSAP transforms on sunrise. NO opacity animation. Pure CSS + scroll.

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootEl,
        start: "top top",
        end: "+=180%",
        // Moderate scrub — enough inertia to feel cinematic without
        // making the globe feel like it's lagging behind the scroll.
        scrub: 1.0,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      defaults: {
        // Force GPU-composited transforms for every tween on this
        // timeline. Prevents per-frame layout thrash during the big
        // scale + translate animations on the globe.
        force3D: true,
      },
    });

    // ----------------------------------------
    // STAGE 1 — DISABLED
    // Previously faded the centered copy out during the globe zoom, which
    // left the user staring at a text-less hero for the whole 0.36→0.60
    // progress window. Copy now stays visible throughout the intro (it
    // gets repositioned to the left in Stage 3, then Stage 4 keeps it at
    // opacity 1 which is a no-op since we never fade it out).

    // ----------------------------------------
    // STAGE 2a
    // Globe zooms in dramatically (stays centered) — flying toward Earth.
    // Uses fromTo so the initial y offset (+12vh push-down from the CSS
    // position) is applied immediately on mount, before ScrollTrigger
    // fires — otherwise the first frame renders at the raw CSS position
    // and jumps to the offset once the ScrollTrigger initialises.
    // ----------------------------------------
    tl.fromTo(
      planet,
      {
        y: () => window.innerHeight * 0.12,
      },
      {
        x: () => peakPlanet().x,
        y: () => peakPlanet().y,
        scale: () => peakPlanet().scale,
        // Gentler curve than power2.inOut — the shallower acceleration
        // reduces the visible "catch up" step when the browser has to
        // repaint a large scale change on a scrubbed timeline.
        ease: "sine.inOut",
        duration: 0.34,
        immediateRender: true,
      },
      0.14
    );

    // ----------------------------------------
    // STAGE 2b
    // Globe pulls back and settles at the right edge.
    // Starts exactly where STAGE 2a ends (0.48) — no overlap window so
    // GSAP doesn't have two competing tweens on the same target, which
    // was the source of the mid-transition jerk.
    // ----------------------------------------
    tl.to(
      planet,
      {
        x: () => finalPlanet().x,
        y: () => finalPlanet().y,
        scale: () => finalPlanet().scale,
        ease: "sine.inOut",
        duration: 0.32,
      },
      0.48
    );

    // ----------------------------------------
    // STAGE 3 — SMOOTH center→left transition of the copy container.
    // The categorical snaps (textAlign, justifyContent, marginLeft) happen
    // together at the start of the slide, then the container smoothly
    // translates to its final left-side position. Doing all snaps at the
    // same moment reads as a single alignment decision, not a series of
    // hard cuts scattered across the scroll range.
    // ----------------------------------------
    const lede = copy.querySelector(".hero__lede");

    // All alignment snaps fire in one moment (0.50), then the container
    // interpolates smoothly to its final position over the next 20% of
    // the timeline.
    tl.set(
      copy,
      {
        textAlign: "left",
        y: 24,
      },
      0.50
    );

    tl.set(
      flexChildren,
      {
        justifyContent: "flex-start",
      },
      0.50
    );

    if (lede) {
      tl.set(
        lede,
        {
          marginLeft: 0,
          marginRight: 0,
        },
        0.50
      );
    }

    // Container smoothly translates to left/final position.
    tl.to(
      inner,
      {
        x: () => finalInner().x,
        y: () => finalInner().y,
        ease: "power3.inOut",
        duration: 0.20,
      },
      0.50
    );

    // ----------------------------------------
    // STAGE 4
    // Copy slides up from y: 24 (set in Stage 3) back to y: 0. Starts at
    // the SAME moment as Stage 3's container translation so the whole
    // "text moves to its new home" motion is one coordinated sweep
    // instead of container-slide-then-text-rise.
    // ----------------------------------------
    tl.to(
      copy,
      {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        duration: 0.32,
      },
      0.52
    );

    // ----------------------------------------
    // STAGE 5
    // CTAs + badges reveal after copy settles — longer duration + slower
    // stagger so each element eases in instead of popping.
    // ----------------------------------------
    tl.to(
      flexChildren,
      {
        opacity: 1,
        ease: "power2.out",
        duration: 0.18,
        stagger: 0.08,
      },
      0.72
    );

    // Sunrise-time copy fade DISABLED — the user wants the hero copy to
    // remain visible throughout, including once the sunrise starts rising.
    // The sunrise gradient's top 60% is transparent so the copy stays
    // legible over it. Keeping this variable so the ScrollTrigger below
    // continues to work as a no-op trigger (dropping it entirely would
    // require removing the surrounding block).
    gsap.to(inner, {
      // opacity: 0,   // ← intentionally disabled per user feedback
      ease: "power2.in",
      scrollTrigger: {
        trigger: rootEl,
        start: "top+=140% top",
        end: "top+=180% top",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

  }, rootEl);

  return () => ctx.revert();
}, []);

  useGSAP(
    () => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".hero__letter", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(".hero__copy .eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      })
        // Letters reveal in from BLUE and settle to their final WHITE color,
        // staggered left-to-right so it reads as a wipe-in reveal.
        .fromTo(
          ".hero__letter",
          {
            opacity: 0,
            y: 30,
            rotateX: -60,
            color: "#3b82f6",
            webkitTextStrokeColor: "#3b82f6",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            color: "#ffffff",
            webkitTextStrokeColor: "#ffffff",
            transformOrigin: "50% 100%",
            duration: 1.1,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          ".hero__lede",
          {
            opacity: 0,
            y: 22,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.2"
        );
    },
    { scope: root }
  );

  return (
    <section className="hero" ref={root}>
      {/* Revolving globe — real continent shapes on a rotating 3D projection */}
      <div className="hero__planet" aria-hidden="true">
      
        <div className="hero__atmo hero__atmo--rim" />
        <div className="hero__atmo hero__atmo--flare" />
        <div className="hero__globe">
          <GlobeCanvas />
        </div>
      </div>

      {/* Foreground copy */}
      <div className="container hero__inner">
        <div className="hero__copy">
          {/* <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__dot" /> 100+ Languages · Certified Experts
          </span> */}

          <h1
            className="hero__title"
            aria-label="Speak to the world in every language"
          >
            <span aria-hidden="true">
              <span className="hero__title-line">
                <SplitText text="Speak to the world in every" />
              </span>
              <span className="hero__title-line hero__title-accent">
                <SplitText text="language" />
              </span>
            </span>
          </h1>

          <p className="hero__lede">
            Premium translation, transcription, subtitles, voiceover, and
            multilingual data services — engineered for global brands who care
            about precision, tone, and time-to-market.
          </p>

          <div className="hero__cta">
            <a
              className="btn btn-whatsapp"
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
            <Link href="#enquiry" className="btn btn-outline btn-outline--on-dark">
              Request a Quote
              <ArrowRight />
            </Link>
          </div>

          <ul className="hero__badges" aria-label="Highlights">
            <li>
              <CheckIcon /> ISO-aligned quality workflow
            </li>
            <li>
              <CheckIcon /> Native linguists · 24/7 turnaround
            </li>
            <li>
              <CheckIcon /> NDA-protected, secure delivery
            </li>
          </ul>
        </div>
      </div>

    </section>
  );
}

// Split each text into per-letter spans wrapped in per-word  groups,
// with plain-text spaces between words. Per-letter spans stay the GSAP target;
// plain-text spaces let the browser break lines at word boundaries instead of
// chopping mid-word — which is what the previous nbsp-inside-inline-block did.
function SplitText({ text }) {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <Fragment key={wi}>
      {wi > 0 && " "}
      <span className="hero__word">
        {word.split("").map((c, i) => (
          <span key={i} className="hero__letter">
            {c}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.36-1.67a11.86 11.86 0 0 0 5.69 1.45h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.4-8.44Zm-8.47 18.24h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.77.99 1.01-3.67-.23-.38a9.86 9.86 0 0 1-1.51-5.2c0-5.44 4.43-9.86 9.87-9.86 2.64 0 5.11 1.03 6.98 2.9a9.8 9.8 0 0 1 2.89 6.97c0 5.44-4.43 9.85-9.84 9.85Zm5.4-7.38c-.29-.14-1.75-.86-2.02-.96-.27-.1-.47-.14-.66.14-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.14-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.44.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.36-.02-.51-.07-.14-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5l-.56-.01c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.44 0 1.44 1.04 2.83 1.19 3.02.14.2 2.06 3.15 5 4.41.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.75-.71 2-1.4.25-.7.25-1.29.17-1.4-.07-.11-.26-.19-.55-.34Z" />
    </svg>
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
