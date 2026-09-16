"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import GlobeCanvas from "./GlobeCanvas";
import "./Hero.css";

gsap.registerPlugin(useGSAP);

// TODO: Replace WHATSAPP_NUMBER with the real business number.
const WHATSAPP_HREF =
  "https://wa.me/0000000000?text=" +
  encodeURIComponent("Hi! I would like a quote for translation services.");

export default function Hero() {
  const root = useRef(null);

  // Fade + slide the hero copy out as the sunrise starts rising over the hero.
  // Starts at ~5% viewport scroll, fully faded by ~45% — well before the
  // sunrise gradient fully covers the hero.
  useEffect(() => {
    const copy = root.current?.querySelector(".hero__copy");
    if (!copy) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, (y - h * 0.25) / (h * 0.6)));
      copy.style.opacity = String(1 - p);
      copy.style.transform = `translateY(${p * -30}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
          [".hero__lede", ".hero__cta", ".hero__badges"],
          {
            opacity: 0,
            y: 22,
            duration: 0.9,
            stagger: 0.18,
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
                <SplitText text="Speak to the world" />
              </span>
              <span className="hero__title-line hero__title-accent">
                <SplitText text="in every language" />
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
