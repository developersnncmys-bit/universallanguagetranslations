"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile-only entrance animations for the home page.
 *
 * On wide viewports the home page relies on pinned/scrubbed timelines
 * inside Hero, Services, TranslationSubservices, LanguageStory, etc.
 * Those pins are intentionally disabled on narrow viewports (see each
 * component's `innerWidth > 900` guard) because they're unusable on
 * phones. Without them, mobile scrolls through a flat, animation-less
 * page.
 *
 * This component adds lightweight scroll-triggered fade-up reveals for
 * the key headings and cards of every section — fired once as each
 * block crosses into view. Desktop skips the whole thing.
 */
export default function HomeMobileAnimations() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth > 900) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens = [];

    const els = (sel) => Array.from(document.querySelectorAll(sel));

    const reveal = (selector, opts = {}) => {
      const nodes = els(selector);
      if (!nodes.length) return;
      tweens.push(
        gsap.from(nodes, {
          y: opts.y ?? 28,
          opacity: 0,
          stagger: nodes.length > 1 ? (opts.stagger ?? 0.08) : 0,
          duration: opts.duration ?? 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: nodes[0],
            start: opts.start ?? "top 88%",
            once: true,
          },
        })
      );
    };

    // Services (intro-pin content)
    reveal(".services__intro-title");
    reveal(".services__intro-right p", { stagger: 0.08 });
    reveal(".services__intro-cta");
    reveal(".intro-stat", { stagger: 0.1 });

    // Global Language Network
    reveal(".ult-global-language-network__brand");
    reveal(".ult-global-language-network__status");
    reveal(".ult-global-language-network__rail-title", { stagger: 0.08 });
    reveal(".ult-global-language-network__rail-item", {
      stagger: 0.04,
      y: 18,
    });
    reveal(".ult-global-language-network__map");
    reveal(".ult-global-language-network__footer > *", { stagger: 0.1 });

    // Translation Subservices (card rail)
    reveal(".subsvc__mega-title");
    reveal(".subsvc__hero-desc");
    reveal(".subsvc__hscroll-intro");
    reveal(".spec-card", { stagger: 0.08, y: 32 });

    // Why Choose Us
    reveal(".why__label");
    reveal(".why__title");
    reveal(".why__intro-desc");
    reveal(".why-feat", { stagger: 0.1, y: 32 });

    // Process
    reveal(".process__eyebrow");
    reveal(".process__title-accent, .process__title-bold", { stagger: 0.08 });
    reveal(".process__step", { stagger: 0.1, y: 28 });

    // FAQ — only animate the intro + help block; the individual
    // question buttons (`.faq__q`) are left alone because masking them
    // behind `opacity: 0` risks leaving the whole list invisible if the
    // stagger trigger misfires (which is what was happening on mobile).
    reveal(".faq__title");
    reveal(".faq__desc");
    reveal(".faq__help", { y: 24 });

    // Enquiry Section
    reveal(".enq__title");
    reveal(".enq__lede");
    reveal(".enq-form", { y: 40 });

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
