"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./LanguageStory.css";

// R3F Canvas can't SSR (needs window/WebGL). Load client-only.
const Scene = dynamic(() => import("./language-story/Scene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

// DOM copy overlays keyed to progress ranges. Each stage's headline + lede
// fades in/out declaratively based on `activeStage` state, which is updated
// by ScrollTrigger onUpdate at bucket boundaries (not every frame).
const STAGES = [
  {
    key: "source",
    range: [0.00, 0.22],
    eyebrow: "01 · Source",
    title: "Every kind of content.",
    lede: "Documents, audio, video, transcripts — the raw material of global communication arrives from every channel.",
  },
  {
    key: "core",
    range: [0.22, 0.55],
    eyebrow: "02 · Language Core",
    title: "Meets one processing core.",
    lede: "Native linguists, review pipelines, and terminology systems translate meaning — not just words.",
  },
  {
    key: "services",
    range: [0.55, 0.82],
    eyebrow: "03 · Seven Services",
    title: "Branching into every service you need.",
    lede: "Translation, transcription, subtitles, voiceover, and multilingual AI data — one accountable team, one workflow.",
  },
  {
    key: "globe",
    range: [0.82, 1.0],
    eyebrow: "04 · Global Delivery",
    title: "Language connects the world.",
    lede: "From translation and transcription to multilingual data solutions, we help content move across languages, industries, and borders.",
  },
];

export default function LanguageStory() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const progressRef = useRef(0); // Shared with R3F children via useFrame
  const [activeStage, setActiveStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  // Detect reduced motion + mounted for SSR-safe dynamic loading.
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause the R3F renderer when the section is off-screen so we don't run
  // two always-on WebGL contexts (this section + the hero globe) at once.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px 20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, reducedMotion]);

  useEffect(() => {
    if (!mounted || reducedMotion) return;
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`, // 500vh of scroll drives the animation
      pin: pin,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        // Switch active stage bucket when progress crosses a boundary.
        for (let i = STAGES.length - 1; i >= 0; i--) {
          if (self.progress >= STAGES[i].range[0]) {
            setActiveStage((prev) => (prev === i ? prev : i));
            break;
          }
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [mounted, reducedMotion]);

  // Reduced-motion fallback: static composition + full copy.
  if (reducedMotion) {
    return (
      <section className="lstory lstory--static" ref={sectionRef}>
        <div className="lstory__inner">
          <div className="lstory__static-copy">
            <span className="lstory__eyebrow">The universal language pipeline</span>
            <h2 className="lstory__title">Language connects the world.</h2>
            <p className="lstory__lede">
              From translation and transcription to multilingual data solutions,
              we help content move across languages, industries, and borders —
              through one accountable team and one continuous workflow.
            </p>
            <ul className="lstory__static-list">
              <li>Source content → language processing core</li>
              <li>Seven interlocking services, one workflow</li>
              <li>Multilingual delivery across every region</li>
            </ul>
            <Link href="#services" className="lstory__cta">
              Explore our services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lstory" ref={sectionRef} aria-label="How Universal Language Translations works">
      <div className="lstory__pin" ref={pinRef}>
        <div className="lstory__canvas">
          {mounted && <Scene progressRef={progressRef} active={inView} />}
        </div>

        <div className="lstory__overlay">
          <div className="lstory__stages">
            {STAGES.map((stage, i) => (
              <div
                key={stage.key}
                className={`lstory__stage ${
                  activeStage === i ? "lstory__stage--active" : ""
                }`}
                aria-hidden={activeStage !== i}
              >
                <span className="lstory__eyebrow">{stage.eyebrow}</span>
                <h2 className="lstory__title">{stage.title}</h2>
                <p className="lstory__lede">{stage.lede}</p>
              </div>
            ))}
          </div>

          <div className="lstory__cta-wrap">
            <Link href="#services" className="lstory__cta">
              Explore our services
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="lstory__scroll-hint" aria-hidden="true">
            <span>Scroll to explore</span>
            <div className="lstory__scroll-track">
              <div
                className="lstory__scroll-fill"
                style={{ width: `${(activeStage + 1) * 25}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sr-only summary so the story is legible without JS/WebGL. */}
      <div className="visually-hidden">
        <h2>How Universal Language Translations works</h2>
        <p>
          Content of every kind enters our language core, transforms across
          seven interlocking services — translation, transcription, subtitles,
          voiceover, data annotation, data evolution, and multilingual data
          creation — and ships across a global delivery network.
        </p>
      </div>
    </section>
  );
}
