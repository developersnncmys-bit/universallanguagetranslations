"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared animations for /services and all /services/* sub-pages.
 *
 * Mirrors the mechanics in `app/about/AboutAnimations.jsx`:
 * - `useLayoutEffect` with reduced-motion short-circuit.
 * - Direct `document.querySelector[All]` (not gsap.context with strings)
 *   so string selectors resolve against the real DOM, not an empty root.
 * - All tweens tracked; cleanup uses `.revert()` so `.from()` tweens
 *   restore natural CSS state under React strict mode double-invoke.
 *
 * Intentionally does NOT use pinned/scrubbed sections — the project memory
 * flagged pin-stage experiments as high risk. These are plain entrance
 * animations with a light scroll-scrub on the hero visual.
 */
export default function ServicesAnimations() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Mobile guard — pinned/scrubbed timelines (Overview, Why, Process)
    // are desktop-only. On narrow viewports those sections render
    // naturally with normal scroll + lightweight entrance animations.
    const isMobile = window.innerWidth <= 900;

    const tweens = [];

    const el = (sel) => document.querySelector(sel);
    const els = (sel) => Array.from(document.querySelectorAll(sel));

    /* ─── HERO entrance timeline ─── */

    const heroEyebrow = el(".svc-hero .svc-eyebrow");
    const heroTitle = el(".svc-hero-title");
    const heroLead = el(".svc-hero-lead");
    const heroActions = els(".svc-hero-actions > *");
    const heroVisual = el(".svc-hero-visual");
    const heroChips = els(".svc-hero-chip");

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroEyebrow)
      heroTl.from(heroEyebrow, { y: 20, opacity: 0, duration: 0.6 });
    if (heroTitle)
      heroTl.from(
        heroTitle,
        { y: 36, opacity: 0, duration: 0.75 },
        "-=0.3"
      );
    if (heroLead)
      heroTl.from(heroLead, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
    if (heroActions.length)
      heroTl.from(
        heroActions,
        { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 },
        "-=0.35"
      );
    if (heroVisual)
      heroTl.from(
        heroVisual,
        { scale: 0.88, opacity: 0, duration: 1.1, ease: "power3.out" },
        0
      );
    if (heroChips.length)
      heroTl.from(
        heroChips,
        { y: -12, opacity: 0, stagger: 0.1, duration: 0.5 },
        0.4
      );

    tweens.push(heroTl);

    /* ─── HERO parallax — visual + title drift on scroll ─── */

    const heroSection = el(".svc-hero");
    if (heroSection) {
      if (heroVisual) {
        tweens.push(
          gsap.to(heroVisual, {
            y: -50,
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
        );
      }
      if (heroTitle) {
        tweens.push(
          gsap.to(heroTitle, {
            y: -30,
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
        );
      }
    }

    /* ─── SECTION HEADINGS — fade/rise on enter.
       Skip the `.svc-why` section — it owns its own pinned timeline
       below and running two reveals on the same elements fights. ─── */

    els(".svc-section-head").forEach((head) => {
      // Skip the Why heading on DESKTOP because its pinned timeline
      // handles it. On mobile the pin is off, so let this reveal fire.
      if (head.closest(".svc-why") && !isMobile) return;
      const bits = Array.from(head.querySelectorAll(":scope > div > *"));
      const para = head.querySelector(":scope > p");

      if (bits.length) {
        tweens.push(
          gsap.from(bits, {
            y: 22,
            opacity: 0,
            stagger: 0.08,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: head,
              start: "top 82%",
              once: true,
            },
          })
        );
      }
      if (para) {
        tweens.push(
          gsap.from(para, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: head,
              start: "top 80%",
              once: true,
            },
          })
        );
      }
    });

    /* ─── OVERVIEW ─── pinned scrubbed reveal when the section carries
       the `.svc-overview` class (sub-service pages). Mirrors the Why
       mechanic: pin for ~1200px, copy children reveal first, capability
       list items reveal one-by-one across their own slice of the pin.
       Falls back to a simple one-shot reveal when `.svc-overview` is
       absent, so legacy call-sites still animate. */

    const overviewSection = el(".svc-overview");

    // On mobile, treat `.svc-overview` the same as the no-overview
    // fallback branch — simple on-enter reveals, no pin.
    if (overviewSection && !isMobile) {
      const overviewList = els(".svc-overview .svc-overview-list li");

      // Left-column copy (eyebrow / h2 / paragraphs) is intentionally
      // NOT animated — any `.from({ opacity: 0 })` on it was leaving the
      // text invisible BEFORE the pin trigger fired, so the user saw
      // only the right-column "CAPABILITIES" eyebrow during approach.
      // Only the capability list items scrub in during the pin.

      const overviewTl = gsap.timeline({
        scrollTrigger: {
          trigger: overviewSection,
          start: "top top",
          end: "+=1200",
          pin: overviewSection,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      overviewList.forEach((item, i) => {
        overviewTl.from(
          item,
          { y: 20, opacity: 0, duration: 0.14, ease: "power2.out" },
          0.1 + i * 0.08
        );
      });

      tweens.push(overviewTl);
    } else {
      const overviewCopy = els(".svc-overview-copy > *");
      const overviewList = els(".svc-overview-list li");

      if (overviewCopy.length) {
        tweens.push(
          gsap.from(overviewCopy, {
            y: 24,
            opacity: 0,
            stagger: 0.08,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el(".svc-overview-grid"),
              start: "top 78%",
              once: true,
            },
          })
        );
      }
      if (overviewList.length) {
        tweens.push(
          gsap.from(overviewList, {
            y: 18,
            opacity: 0,
            stagger: 0.05,
            duration: 0.45,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el(".svc-overview-list"),
              start: "top 82%",
              once: true,
            },
          })
        );
      }
    }

    /* ─── CARD GRIDS — stagger-up per grid.
       On desktop the `.svc-why` grid is skipped because its pinned
       timeline below reveals the cards one-by-one in sync with the
       scrub. On mobile that pin is disabled, so the Why cards still
       need this general stagger-up or they render with no entrance. */

    els(".svc-card-grid").forEach((grid) => {
      if (grid.closest(".svc-why") && !isMobile) return;
      const cards = Array.from(grid.querySelectorAll(".svc-card"));
      if (!cards.length) return;
      tweens.push(
        gsap.from(cards, {
          y: 32,
          opacity: 0,
          stagger: 0.06,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 82%",
            once: true,
          },
        })
      );
    });

    /* ─── SVC-SERVICES — heading + 4-column card grid.
       Head bits (label + heading + lead) rise and fade in, then
       cards stagger up when the grid enters view. Mirrors About's
       industry-grid reveal. */

    const servicesHeadBits = els(
      ".svc-services-head > div > *, .svc-services-lead"
    );
    if (servicesHeadBits.length) {
      tweens.push(
        gsap.from(servicesHeadBits, {
          y: 22,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".svc-services-head",
            start: "top 82%",
            once: true,
          },
        })
      );
    }

    const servicesCards = els(".svc-service-card");
    if (servicesCards.length) {
      tweens.push(
        gsap.from(servicesCards, {
          y: 28,
          opacity: 0,
          stagger: 0.06,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".svc-services-grid",
            start: "top 82%",
            once: true,
          },
        })
      );

      /* MOBILE hover-flash — on touch devices there's no cursor to
         trigger the `:hover` navy flip, so simulate it on scroll:
         each card briefly toggles the `.is-hover-flash` class as it
         crosses into view, then reverts. Reads as "the card lights
         up as you reach it", not a dead static grid. */
      if (isMobile) {
        servicesCards.forEach((card, i) => {
          const st = ScrollTrigger.create({
            trigger: card,
            start: "top 75%",
            once: true,
            onEnter: () => {
              setTimeout(() => {
                card.classList.add("is-hover-flash");
                setTimeout(() => {
                  card.classList.remove("is-hover-flash");
                }, 650);
              }, i * 90);
            },
          });
          tweens.push({ scrollTrigger: st });
        });
      }
    }

    /* ─── WHY US — pinned scrubbed reveal.
       Mirrors `.about-values` in AboutAnimations: the section pins at
       top:top, timeline scrubs for ~1200px of scroll, heading parts
       reveal first, then each card reveals one by one across its own
       slice of the pin. ─── */

    const whySection = el(".svc-why");
    if (whySection && !isMobile) {
      const whyHeadBits = els(".svc-why-head > div > *");
      const whyHeadPara = el(".svc-why-head > p");
      const whyCards = els(".svc-why-card");

      const whyTl = gsap.timeline({
        scrollTrigger: {
          trigger: whySection,
          start: "top top",
          end: "+=1200",
          pin: whySection,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (whyHeadBits.length)
        whyTl.from(
          whyHeadBits,
          {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.16,
            ease: "power3.out",
          },
          0
        );
      if (whyHeadPara)
        whyTl.from(
          whyHeadPara,
          { y: 24, opacity: 0, duration: 0.15, ease: "power2.out" },
          0.18
        );

      whyCards.forEach((card, i) => {
        whyTl.from(
          card,
          { y: 48, opacity: 0, duration: 0.16, ease: "power2.out" },
          0.35 + i * 0.14
        );
      });

      tweens.push(whyTl);
    }

    /* ─── CHECK GRIDS — tick/format rows ─── */

    els(".svc-check-grid").forEach((grid) => {
      const items = Array.from(grid.querySelectorAll(".svc-check-item"));
      if (!items.length) return;
      tweens.push(
        gsap.from(items, {
          y: 18,
          opacity: 0,
          stagger: 0.05,
          duration: 0.45,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            once: true,
          },
        })
      );
    });

    /* ─── PROCESS — pinned scrubbed reveal.
       Mirrors `.svc-why` and `.svc-overview`: pin for ~1200px of scroll,
       heading parts reveal first, then each step card + number reveal
       sequentially across its own slice of the pin. Falls back to a
       plain one-shot entrance if `.svc-process` isn't present. */

    const processSection = el(".svc-process");

    if (processSection && !isMobile) {
      const processSteps = els(".svc-process-step");
      const processNums = els(".svc-process-num");

      // Heading is intentionally NOT animated — any `.from({ opacity: 0 })`
      // was leaving the eyebrow / h2 / description stuck invisible when
      // combined with the pin, which read as "where's the heading?"
      // during the pinned card scrub. Static heading, only cards scrub.

      // Pin + scrub only the step cards + numbers — heading stays put.
      const processTl = gsap.timeline({
        scrollTrigger: {
          trigger: processSection,
          start: "top top",
          end: "+=1200",
          pin: processSection,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      processSteps.forEach((step, i) => {
        processTl.from(
          step,
          { y: 48, opacity: 0, duration: 0.16, ease: "power2.out" },
          0.1 + i * 0.18
        );
      });

      processNums.forEach((num, i) => {
        processTl.from(
          num,
          { scale: 0.4, duration: 0.12, ease: "back.out(2)" },
          0.14 + i * 0.18
        );
      });

      tweens.push(processTl);
    } else {
      const processGrid = el(".svc-process-grid");
      if (processGrid) {
        const steps = Array.from(processGrid.querySelectorAll(".svc-process-step"));
        const nums = Array.from(processGrid.querySelectorAll(".svc-process-num"));

        const processTl = gsap.timeline({
          scrollTrigger: {
            trigger: processGrid,
            start: "top 78%",
            once: true,
          },
        });

        if (steps.length)
          processTl.from(steps, {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "power3.out",
          });
        if (nums.length)
          processTl.from(
            nums,
            {
              scale: 0.4,
              opacity: 0,
              stagger: 0.12,
              duration: 0.45,
              ease: "back.out(2)",
            },
            "-=0.75"
          );

        tweens.push(processTl);
      }
    }

    /* ─── CTA — pinned scrubbed reveal.
       Section pins at top:top for ~1000px of scroll; eyebrow, heading,
       lead and button reveal sequentially across the pin. Same mechanic
       as `.svc-why` above, just scoped to a single centered card. ─── */

    /* CTA — scrubbed reveal as the section passes through the viewport.
       Each child (eyebrow → heading → lead → button) scrubs in on a
       small timeline offset so they stagger during the scrub. */

    const ctaSection = el(".svc-cta");
    const ctaInner = el(".svc-cta-inner");
    if (ctaSection && ctaInner) {
      const ctaKids = Array.from(ctaInner.children);

      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaSection,
          start: "top 85%",
          end: "bottom 70%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      ctaKids.forEach((kid, i) => {
        ctaTl.from(
          kid,
          { y: 48, opacity: 0, duration: 0.2, ease: "power2.out" },
          0.1 + i * 0.18
        );
      });

      tweens.push(ctaTl);
    }

    // Let layout settle before ScrollTrigger refreshes positions —
    // important when images / fonts are still arriving.
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      tweens.forEach((t) => {
        if (!t) return;
        if (t.scrollTrigger) t.scrollTrigger.kill();
        if (typeof t.revert === "function") t.revert();
        else if (typeof t.kill === "function") t.kill();
      });
    };
  }, []);

  return null;
}
