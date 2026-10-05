"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * About page animations.
 *
 * NOTE: this component does NOT use `gsap.context(fn, root)` with string
 * selectors. gsap.context scopes selector strings to the given element,
 * and this component only renders an empty root — so string selectors
 * like ".about-story" would resolve to nothing INSIDE our root and fail
 * silently. Instead we use `document.querySelector[All]` to get the
 * actual DOM nodes and pass them to GSAP directly.
 */
export default function AboutAnimations() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) return;

    // Mobile guard — pinned/scrubbed timelines (Story, Mission, Values)
    // are desktop-only. On narrow viewports those sections render
    // naturally with normal scroll + lightweight entrance animations.
    const isMobile = window.innerWidth <= 900;

    const triggers = [];
    const tweens = [];

    const el = (sel) => document.querySelector(sel);
    const els = (sel) => Array.from(document.querySelectorAll(sel));

    /* =====================================================
       HERO — entrance + globe parallax + title parallax
    ===================================================== */

    const heroEyebrow = el(".about-eyebrow");
    const heroLines = els(".about-hero-title .hero-line");
    const heroDesc = el(".about-hero-description");
    const heroActions = els(".about-hero-actions > *");

    if (heroEyebrow || heroLines.length || heroDesc) {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (heroEyebrow)
        heroTl.from(heroEyebrow, { y: 20, opacity: 0, duration: 0.6 });
      if (heroLines.length)
        heroTl.from(
          heroLines,
          { y: 32, opacity: 0, stagger: 0.08, duration: 0.7 },
          "-=0.3"
        );
      if (heroDesc)
        heroTl.from(
          heroDesc,
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.35"
        );
      if (heroActions.length)
        heroTl.from(
          heroActions,
          { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 },
          "-=0.35"
        );
      tweens.push(heroTl);
    }

    const globeWrap = el(".about-globe-wrap");
    const heroSection = el(".about-hero");

    if (globeWrap) {
      tweens.push(
        gsap.from(globeWrap, {
          scale: 0.86,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.15,
        })
      );
      if (heroSection) {
        tweens.push(
          gsap.to(globeWrap, {
            y: -40,
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

    const heroTitle = el(".about-hero-title");
    if (heroTitle && heroSection) {
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

    /* =====================================================
       STORY — PINNED section with scrubbed sequential reveal
       Uses actual DOM elements, not string selectors.
    ===================================================== */

    const storySection = el(".about-story");

    if (storySection && !isMobile) {
      const storyImage = el(".about-story-image-wrap");
      const storyMuted = el(".story-headline-muted");
      const storyBlack = el(".story-headline-black");
      const storyTeal = el(".story-headline-teal");
      const storyEyebrow = el(".about-story-eyebrow");
      const storyParas = els(".about-story-copy .story-reveal");
      const storyCta = el(".about-story-cta");
      const storyBottom = el(".about-story-bottom");

      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: storySection,
          start: "top top",
          end: "+=1500",
          pin: storySection,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (storyImage)
        storyTl.from(
          storyImage,
          { y: 80, opacity: 0, scale: 0.94, duration: 0.3, ease: "power2.out" },
          0
        );
      if (storyMuted)
        storyTl.from(
          storyMuted,
          { y: 50, opacity: 0, duration: 0.18, ease: "power3.out" },
          0.08
        );
      if (storyBlack)
        storyTl.from(
          storyBlack,
          { y: 50, opacity: 0, duration: 0.18, ease: "power3.out" },
          0.16
        );
      if (storyTeal)
        storyTl.from(
          storyTeal,
          { y: 50, opacity: 0, duration: 0.18, ease: "power3.out" },
          0.24
        );
      if (storyEyebrow)
        storyTl.from(
          storyEyebrow,
          { y: 25, opacity: 0, duration: 0.14, ease: "power2.out" },
          0.12
        );

      storyParas.forEach((p, i) => {
        storyTl.from(
          p,
          { y: 40, opacity: 0, duration: 0.18, ease: "power2.out" },
          0.3 + i * 0.15
        );
      });

      if (storyCta)
        storyTl.from(
          storyCta,
          { y: 25, opacity: 0, duration: 0.14, ease: "power2.out" },
          0.78
        );
      if (storyBottom)
        storyTl.from(
          storyBottom,
          { y: 18, opacity: 0, duration: 0.12, ease: "power2.out" },
          0.88
        );

      tweens.push(storyTl);
    }

    /* MOBILE Story reveal — no pin, just scroll-triggered fade+rise
       entrances for each element as the section enters view. Mirrors
       the sequence of the desktop pinned timeline but driven by scroll
       position, not scrub. */
    if (storySection && isMobile) {
      const addMobileReveal = (target, offset = 0) => {
        if (!target) return;
        const nodes = Array.isArray(target) ? target : [target];
        if (!nodes.length) return;
        tweens.push(
          gsap.from(nodes, {
            y: 32,
            opacity: 0,
            stagger: nodes.length > 1 ? 0.1 : 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: nodes[0],
              start: "top 88%",
              once: true,
            },
            delay: offset,
          })
        );
      };

      addMobileReveal(el(".about-story-image-wrap"));
      addMobileReveal([
        el(".story-headline-muted"),
        el(".story-headline-black"),
        el(".story-headline-teal"),
      ].filter(Boolean));
      addMobileReveal(el(".about-story-eyebrow"));
      addMobileReveal(els(".about-story-copy .story-reveal"));
      addMobileReveal(el(".about-story-cta"));
      addMobileReveal(el(".about-story-bottom"));
    }

    /* =====================================================
       MISSION
    ===================================================== */

    const missionSection = el(".about-mission");
    if (missionSection && !isMobile) {
      const missionLabel = el(".about-mission .about-section-label");
      const missionLines = els(".mission-title-line");
      const missionDesc = el(".mission-description");
      const missionPillars = els(".mission-pillar");

      // PINNED mission — timeline scrubs sequentially while section is
      // held in the viewport, same mechanic as the story section pin.
      const missionTl = gsap.timeline({
        scrollTrigger: {
          trigger: missionSection,
          start: "top top",
          end: "+=1200",
          pin: missionSection,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (missionLabel)
        missionTl.from(
          missionLabel,
          { y: 24, opacity: 0, duration: 0.15, ease: "power2.out" },
          0
        );
      if (missionLines.length)
        missionTl.from(
          missionLines,
          {
            y: 50,
            opacity: 0,
            stagger: 0.08,
            duration: 0.18,
            ease: "power3.out",
          },
          0.08
        );
      if (missionDesc)
        missionTl.from(
          missionDesc,
          { y: 24, opacity: 0, duration: 0.15, ease: "power2.out" },
          0.3
        );

      // Pillars reveal one-by-one across their own scroll windows
      missionPillars.forEach((pillar, i) => {
        missionTl.from(
          pillar,
          { y: 36, opacity: 0, duration: 0.16, ease: "power2.out" },
          0.4 + i * 0.12
        );
      });

      tweens.push(missionTl);
    }

    /* MOBILE Mission reveal — label, heading lines, description, then
       pillars stagger up as the section enters view. */
    if (missionSection && isMobile) {
      const missionLabel = el(".about-mission .about-section-label");
      const missionLines = els(".mission-title-line");
      const missionDesc = el(".mission-description");
      const missionPillars = els(".mission-pillar");

      if (missionLabel) {
        tweens.push(
          gsap.from(missionLabel, {
            y: 24, opacity: 0, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: missionLabel, start: "top 88%", once: true },
          })
        );
      }
      if (missionLines.length) {
        tweens.push(
          gsap.from(missionLines, {
            y: 36, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: missionLines[0], start: "top 88%", once: true },
          })
        );
      }
      if (missionDesc) {
        tweens.push(
          gsap.from(missionDesc, {
            y: 24, opacity: 0, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: missionDesc, start: "top 88%", once: true },
          })
        );
      }
      if (missionPillars.length) {
        tweens.push(
          gsap.from(missionPillars, {
            y: 32, opacity: 0, stagger: 0.1, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: missionPillars[0], start: "top 88%", once: true },
          })
        );
      }
    }

    /* =====================================================
       VALUES
    ===================================================== */

    const valuesSection = el(".about-values");
    if (valuesSection && !isMobile) {
      const valuesHeadingParts = els(
        ".about-values .about-heading-row > div > *"
      );
      const valuesHeadingPara = el(".about-values .about-heading-row > p");
      const valueCards = els(".about-value-card");

      // PINNED values — scrubbed sequential reveal while section is held
      // in the viewport, same mechanic as story + mission.
      const valuesTl = gsap.timeline({
        scrollTrigger: {
          trigger: valuesSection,
          start: "top top",
          end: "+=1200",
          pin: valuesSection,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (valuesHeadingParts.length)
        valuesTl.from(
          valuesHeadingParts,
          {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.16,
            ease: "power3.out",
          },
          0
        );
      if (valuesHeadingPara)
        valuesTl.from(
          valuesHeadingPara,
          { y: 24, opacity: 0, duration: 0.15, ease: "power2.out" },
          0.18
        );

      // Each card reveals one-by-one across its own slice of the pin
      valueCards.forEach((card, i) => {
        valuesTl.from(
          card,
          {
            y: 48,
            opacity: 0,
            duration: 0.16,
            ease: "power2.out",
          },
          0.35 + i * 0.12
        );
      });

      tweens.push(valuesTl);
    }

    /* MOBILE Values reveal — heading row first, then cards stagger up. */
    if (valuesSection && isMobile) {
      const valuesHeadingParts = els(".about-values .about-heading-row > div > *");
      const valuesHeadingPara = el(".about-values .about-heading-row > p");
      const valueCards = els(".about-value-card");

      if (valuesHeadingParts.length) {
        tweens.push(
          gsap.from(valuesHeadingParts, {
            y: 24, opacity: 0, stagger: 0.08, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: valuesHeadingParts[0], start: "top 88%", once: true },
          })
        );
      }
      if (valuesHeadingPara) {
        tweens.push(
          gsap.from(valuesHeadingPara, {
            y: 24, opacity: 0, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: valuesHeadingPara, start: "top 88%", once: true },
          })
        );
      }
      if (valueCards.length) {
        tweens.push(
          gsap.from(valueCards, {
            y: 32, opacity: 0, stagger: 0.1, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: valueCards[0], start: "top 88%", once: true },
          })
        );
      }
    }

    /* =====================================================
       SERVICES
    ===================================================== */

    const servicesHeadingParts = els(
      ".services-section-heading > div > *"
    );
    const servicesHeadingPara = el(".services-section-heading > p");
    const coreItems = els(".core-service-item");
    const translationHeadingParts = els(".translation-services-heading > *");
    const translationItems = els(".industry-card");

    if (servicesHeadingParts.length) {
      tweens.push(
        gsap.from(servicesHeadingParts, {
          y: 22,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el(".services-section-heading"),
            start: "top 80%",
            once: true,
          },
        })
      );
    }
    if (servicesHeadingPara) {
      tweens.push(
        gsap.from(servicesHeadingPara, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el(".services-section-heading"),
            start: "top 78%",
            once: true,
          },
        })
      );
    }
    if (coreItems.length) {
      tweens.push(
        gsap.from(coreItems, {
          x: 40,
          opacity: 0,
          stagger: 0.06,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el(".core-services-list"),
            start: "top 80%",
            once: true,
          },
        })
      );
    }
    if (translationHeadingParts.length) {
      tweens.push(
        gsap.from(translationHeadingParts, {
          y: 22,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el(".translation-services-heading"),
            start: "top 80%",
            once: true,
          },
        })
      );
    }
    if (translationItems.length) {
      tweens.push(
        gsap.from(translationItems, {
          y: 25,
          opacity: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el(".industry-grid"),
            start: "top 82%",
            once: true,
          },
        })
      );
    }

    /* =====================================================
       PROCESS
    ===================================================== */

    const processSection = el(".about-process");
    if (processSection && !isMobile) {
      const processHeadingParts = els(".about-process-heading > *");
      const processProgress = el(".process-progress");
      const processItems = els(".about-process-item");
      const processDots = els(".process-dot");

      // PINNED Process — mirrors Story / Mission / Values. The section
      // parks at `top:top` for ~1200px of scroll; the heading reveals
      // first, then the horizontal rail draws across while each dot +
      // step card scrubs in on its own slice of the timeline.
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

      if (processHeadingParts.length)
        processTl.from(
          processHeadingParts,
          {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.18,
            ease: "power3.out",
          },
          0
        );
      if (processProgress)
        processTl.from(
          processProgress,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.4,
            ease: "power2.inOut",
          },
          0.22
        );

      // Dots + step cards reveal in lockstep, one quartet at a time
      // across their own slice of the pin so each step feels like a
      // distinct beat as the user scrolls.
      processItems.forEach((item, i) => {
        const slice = 0.4 + i * 0.14;
        processTl.from(
          item,
          { y: 40, opacity: 0, duration: 0.16, ease: "power2.out" },
          slice
        );
        if (processDots[i]) {
          processTl.from(
            processDots[i],
            {
              scale: 0,
              opacity: 0,
              duration: 0.14,
              ease: "back.out(2)",
            },
            slice - 0.02
          );
        }
      });

      tweens.push(processTl);
    }

    /* MOBILE Process reveal — no pin; heading, progress rail, dots and
       step cards cascade in as the section crosses into view. */
    if (processSection && isMobile) {
      const processHeadingParts = els(".about-process-heading > *");
      const processItems = els(".about-process-item");

      if (processHeadingParts.length) {
        tweens.push(
          gsap.from(processHeadingParts, {
            y: 24, opacity: 0, stagger: 0.08, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: processHeadingParts[0], start: "top 85%", once: true },
          })
        );
      }
      if (processItems.length) {
        tweens.push(
          gsap.from(processItems, {
            y: 32, opacity: 0, stagger: 0.12, duration: 0.55, ease: "power3.out",
            scrollTrigger: { trigger: processItems[0], start: "top 85%", once: true },
          })
        );
      }
    }

    /* =====================================================
       CTA
    ===================================================== */

    const ctaSection = el(".about-cta");
    if (ctaSection) {
      const ctaLabel = el(".about-cta .about-section-label");
      const ctaDesc = el(".about-cta p");
      const ctaBtn = el(".about-cta .about-primary-btn");
      const ctaWords = ctaSection.querySelectorAll(".cta-word");

      if (ctaLabel)
        tweens.push(
          gsap.from(ctaLabel, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 78%",
              once: true,
            },
          })
        );

      if (ctaWords.length) {
        tweens.push(
          gsap.to(ctaWords, {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 1,
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 75%",
              end: "center 40%",
              scrub: 1,
            },
          })
        );
      }

      if (ctaDesc)
        tweens.push(
          gsap.from(ctaDesc, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaDesc,
              start: "top 85%",
              once: true,
            },
          })
        );

      if (ctaBtn)
        tweens.push(
          gsap.from(ctaBtn, {
            y: 18,
            opacity: 0,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaBtn,
              start: "top 90%",
              once: true,
            },
          })
        );
    }

    // Give the browser one frame to settle layout, then recalibrate
    // scroll positions (important when there are tall sections above
    // that have their own pin-spacers).
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(rafId);
      // IMPORTANT: use .revert() not .kill() so `.from()` tweens restore
      // elements to their natural CSS state (opacity:1, y:0, etc).
      // Without this, React strict mode's double-invocation leaves
      // elements stuck at opacity:0 from the first cancelled .from() —
      // which is why the whole hero was rendering blank.
      tweens.forEach((t) => {
        if (!t) return;
        if (t.scrollTrigger) t.scrollTrigger.kill();
        if (typeof t.revert === "function") t.revert();
        else if (typeof t.kill === "function") t.kill();
      });
      triggers.forEach((st) => st && st.kill());
    };
  }, []);

  return null;
}
