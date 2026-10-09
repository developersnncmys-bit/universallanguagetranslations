"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Partnership.css";

gsap.registerPlugin(ScrollTrigger);

// Four operating-model principles. Written as a partnership story,
// not a feature list — the voice is "how a serious buyer actually
// experiences working with us" rather than "look at our capabilities."
const PILLARS = [
  {
    num: "01",
    title: "A named account lead",
    text: "One person owns your account end to end — brief intake, team assignment, review, delivery, invoicing. You never explain the brief twice.",
  },
  {
    num: "02",
    title: "The same team, every project",
    text: "Consistent translator + reviewer pairs across every engagement, so your voice, terminology and product stay coherent instead of drifting with each vendor swap.",
  },
  {
    num: "03",
    title: "Terminology that compounds",
    text: "Per-client glossaries and translation memory grow with every batch — the second project is faster than the first, the tenth is tighter still.",
  },
  {
    num: "04",
    title: "An SLA you can plan around",
    text: "Scoped quotes within an hour, delivery dates you can stake a launch on, revision rounds included. No surprises on cost, scope or timing.",
  },
];

export default function Partnership() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const scope = sectionRef.current;
      if (!scope) return;

      // Head reveal — eyebrow → title → lede, triggered as the section
      // enters view. Short durations, no reverse, so content stays put
      // once revealed.
      gsap.from(scope.querySelectorAll(".partnership__eyebrow"), {
        y: 18,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(scope.querySelectorAll(".partnership__title"), {
        y: 32,
        opacity: 0,
        duration: 0.7,
        delay: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(scope.querySelectorAll(".partnership__lede"), {
        y: 24,
        opacity: 0,
        duration: 0.6,
        delay: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // Pillar grid — staggered reveal of each principle as the grid
      // crosses into view. Triggered off the grid itself so it fires
      // independently of the head.
      gsap.from(scope.querySelectorAll(".partnership__pillar"), {
        y: 36,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.querySelector(".partnership__grid"),
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Mobile only — fill each pillar's top hairline as it scrolls into
      // view. :hover is unreliable on touch, so we trigger the sweep from
      // the scroll position instead. Adds `.is-filled` which the mobile
      // CSS reads to animate `::before` width from 48px → 100%.
      if (window.innerWidth <= 900) {
        scope.querySelectorAll(".partnership__pillar").forEach((pillar) => {
          ScrollTrigger.create({
            trigger: pillar,
            start: "top 80%",
            once: true,
            onEnter: () => pillar.classList.add("is-filled"),
          });
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section className="partnership" ref={sectionRef}>
      <div className="partnership__container">

        <div className="partnership__head">
          <div className="partnership__head-left">
            <span className="partnership__eyebrow">
              How we partner
            </span>
            <h2 className="partnership__title">
              One accountable team.
              <br />
              <span>Project after project.</span>
            </h2>
          </div>
          <p className="partnership__lede">
            Working with a global agency often means swapping vendors each
            quarter and re-teaching the brand voice from scratch. We work
            the opposite way — a dedicated lead, a consistent team, and a
            single relationship that scales with your output.
          </p>
        </div>

        <ol className="partnership__grid">
          {PILLARS.map((p) => (
            <li className="partnership__pillar" key={p.num}>
              <span className="partnership__num">{p.num}</span>
              <h3 className="partnership__pillar-title">{p.title}</h3>
              <p className="partnership__pillar-text">{p.text}</p>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
