"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Process.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    title: "Share your brief",
    desc: "Send us the content, target languages, tone, and deadline. Use the form or WhatsApp.",
  },
  {
    n: "02",
    title: "Scoped quote in hours",
    desc: "We match your project to specialist linguists and reply with a clear, itemized quote.",
  },
  {
    n: "03",
    title: "Translate, review, QA",
    desc: "A translator, editor, and reviewer work through your content with terminology memory in place.",
  },
  {
    n: "04",
    title: "Delivered, on time",
    desc: "Final assets delivered in your format of choice, plus a QA report on request.",
  },
];

export default function Process() {
  const rootRef = useRef(null);
  const trackFillRef = useRef(null);
  const stepsRef = useRef(null);
  const numRefs = useRef([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Static, fully-revealed final state
      if (trackFillRef.current) trackFillRef.current.style.width = "100%";
      numRefs.current.forEach((el) => el?.classList.add("is-active"));
      return;
    }

    const root = rootRef.current;
    const steps = stepsRef.current;
    if (!root || !steps) return;

    const ctx = gsap.context(() => {
      // 1) Number circles pop in with a rotate + scale bounce when the steps
      //    row first enters the viewport.
      numRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0, rotate: -140, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.12,
            ease: "back.out(1.8)",
            scrollTrigger: {
              trigger: steps,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 2) Cards fade + slide up in stagger from below.
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: steps,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 3) The horizontal track fills left-to-right as the user scrolls
      //    through the section. As the fill reaches each step's threshold,
      //    that step's circle activates (glow + color shift).
      ScrollTrigger.create({
        trigger: steps,
        start: "top 68%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (trackFillRef.current) {
            trackFillRef.current.style.width = `${p * 100}%`;
          }
          const n = numRefs.current.length;
          numRefs.current.forEach((el, i) => {
            if (!el) return;
            // Each step activates when the fill reaches its column midpoint.
            const threshold = n <= 1 ? 0 : (i + 0.5) / n;
            if (p >= threshold - 0.04) {
              el.classList.add("is-active");
            } else {
              el.classList.remove("is-active");
            }
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="process section" id="process" ref={rootRef}>
      <div className="process__bg parallax-y-slow" aria-hidden="true" />
      <div className="container">
        <div className="section-head reveal">
          <span className="process__eyebrow">How it works</span>
          <h2 className="section-title">
            A simple, transparent path from brief to delivery
          </h2>
          <p className="section-lede">
            Four calm steps — no back-and-forth, no surprises. Most projects
            start within the same business day.
          </p>
        </div>

        <div className="process__timeline">
          <div className="process__track" aria-hidden="true">
            <div className="process__track-fill" ref={trackFillRef} />
          </div>

          <ol className="process__steps" ref={stepsRef}>
            {STEPS.map((s, i) => (
              <li
                className="process-step"
                key={s.n}
                ref={(el) => (cardRefs.current[i] = el)}
              >
                <span
                  className="process-step__num"
                  ref={(el) => (numRefs.current[i] = el)}
                >
                  {s.n}
                </span>
                <h3 className="process-step__title">{s.title}</h3>
                <p className="process-step__desc">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
