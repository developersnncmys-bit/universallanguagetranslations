"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Legal page animations.
 *   - Hero: fade/slide the eyebrow + title + meta line on load.
 *   - Reading progress bar: fills as the user scrolls through .legal-body.
 *   - Sections: each .legal-section fades + slides up as it enters the
 *     viewport (toggleActions play once, no reverse — reading context).
 *   - TOC: the currently-in-view section's TOC link gets `.is-current`,
 *     driven by the same ScrollTriggers so highlighting stays in sync.
 */
export default function LegalAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const triggers = [];
    const tweens = [];

    // Hero entrance ────────────────────────────────────────────────
    const heroEyebrow = document.querySelector(".legal-eyebrow");
    const heroTitle = document.querySelector(".legal-hero-title");
    const heroMeta = document.querySelector(".legal-hero-meta");

    if (heroEyebrow || heroTitle || heroMeta) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (heroEyebrow) tl.from(heroEyebrow, { y: 20, opacity: 0, duration: 0.6 });
      if (heroTitle) tl.from(heroTitle, { y: 40, opacity: 0, duration: 0.8 }, "-=0.35");
      if (heroMeta) tl.from(heroMeta, { y: 16, opacity: 0, duration: 0.5 }, "-=0.4");
      tweens.push(tl);
    }

    // Reading progress bar ─────────────────────────────────────────
    const progressBar = document.querySelector(".legal-progress-bar");
    const body = document.querySelector(".legal-body");

    if (progressBar && body) {
      gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });
      const progressTween = gsap.to(progressBar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: body,
          start: "top 60%",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
      tweens.push(progressTween);
    }

    // Intro paragraph + notice fade-in ─────────────────────────────
    const notice = document.querySelector(".legal-notice");
    const intro = document.querySelector(".legal-intro");

    [notice, intro].filter(Boolean).forEach((el, i) => {
      tweens.push(
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        })
      );
    });

    // Section reveals + TOC active-state sync ──────────────────────
    const sections = Array.from(document.querySelectorAll(".legal-section"));
    const tocLinks = Array.from(document.querySelectorAll(".legal-toc-link"));

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const tocLink = id
        ? tocLinks.find((a) => a.getAttribute("href") === `#${id}`)
        : null;

      // Entrance tween — fade + slide + a subtle accent bar swipe.
      tweens.push(
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        })
      );

      // Active-TOC tracking — separate ScrollTrigger that toggles the
      // `.is-current` class as the section enters/leaves the "read band"
      // (upper third of the viewport). No tween — just class toggling.
      if (tocLink) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => activate(tocLink),
          onEnterBack: () => activate(tocLink),
        });
        triggers.push(st);
      }
    });

    function activate(link) {
      tocLinks.forEach((l) => l.classList.remove("is-current"));
      link.classList.add("is-current");
    }

    // CTA scrub-style reveal ───────────────────────────────────────
    // Wrap the CTA headline words in spans and scrub their opacity to
    // scroll position so each word brightens one-by-one as the user
    // scrolls the CTA into view. Eyebrow, paragraph and button get a
    // staggered fade+rise entrance.
    const ctaSection = document.querySelector(".legal-cta");
    const ctaHeading = ctaSection?.querySelector("h2");
    const ctaEyebrow = ctaSection?.querySelector(".legal-cta-eyebrow");
    const ctaPara = ctaSection?.querySelector("p");
    const ctaBtn = ctaSection?.querySelector(".legal-cta-btn");

    const ctaWordSpans = [];
    if (ctaHeading && !ctaHeading.dataset.wrapped) {
      // Walk text nodes inside the heading (including inside <span>s)
      // and wrap each whitespace-separated token in a span we can tween
      // independently. Idempotent via the data-wrapped flag.
      const walker = document.createTreeWalker(
        ctaHeading,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (n) =>
            n.nodeValue && n.nodeValue.trim()
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT,
        }
      );
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) textNodes.push(node);

      textNodes.forEach((textNode) => {
        const parts = textNode.nodeValue.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "legal-cta-word";
            span.textContent = part;
            frag.appendChild(span);
            ctaWordSpans.push(span);
          }
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });
      ctaHeading.dataset.wrapped = "true";
    } else if (ctaHeading) {
      // Second effect run — spans already exist, just grab them.
      ctaHeading
        .querySelectorAll(".legal-cta-word")
        .forEach((el) => ctaWordSpans.push(el));
    }

    if (ctaSection && ctaWordSpans.length) {
      // Scrub the headline words — each word brightens from dim → full
      // white as the CTA scrolls through the viewport. Matches the
      // "scrub reveal" treatment used elsewhere on the site.
      gsap.set(ctaWordSpans, { opacity: 0.18 });
      tweens.push(
        gsap.to(ctaWordSpans, {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ctaSection,
            start: "top 80%",
            end: "center 55%",
            scrub: 0.6,
          },
        })
      );
    }

    // Eyebrow / paragraph / button — simple staggered fade+rise.
    [ctaEyebrow, ctaPara, ctaBtn]
      .filter(Boolean)
      .forEach((el, i) => {
        tweens.push(
          gsap.from(el, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 78%",
              once: true,
            },
          })
        );
      });

    // Smooth-scroll on TOC link click ──────────────────────────────
    const onTocClick = (e) => {
      const anchor = e.target.closest(".legal-toc-link");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 90;
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onTocClick);

    return () => {
      document.removeEventListener("click", onTocClick);
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
