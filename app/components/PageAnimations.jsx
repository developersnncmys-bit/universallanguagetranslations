"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global scroll animation controller. Applies:
 *   .reveal            → element fades + slides up as it enters viewport
 *   .reveal-stagger    → children fade + slide up with stagger
 *   .parallax-y-slow   → element drifts up slowly relative to scroll
 *   .parallax-y-fast   → element drifts up faster than scroll
 *   .parallax-y-down   → element drifts down as page scrolls
 *
 * Plus: on every heading/paragraph across the page, the TEXT COLOR washes
 * from blue to its natural CSS color the first time the element enters
 * view. This is decoupled from the fade/slide reveals — it touches only
 * `color`, so it can't accidentally leave elements invisible.
 *
 * Rendering is skipped when the user prefers reduced motion.
 */
export default function PageAnimations() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".reveal, .reveal-stagger > *").forEach((el) => {
        el.classList.add("revealed");
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray(".reveal-stagger").forEach((el) => {
        const children = Array.from(el.children);
        gsap.fromTo(
          children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Parallax variants
      const parallax = (selector, yPercent) => {
        gsap.utils.toArray(selector).forEach((el) => {
          gsap.to(el, {
            yPercent,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      };

      parallax(".parallax-y-slow", -12);
      parallax(".parallax-y-fast", -28);
      parallax(".parallax-y-down", 15);

      // Nudge ScrollTrigger after fonts/images settle
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = setTimeout(refresh, 400);
      return () => {
        window.removeEventListener("load", refresh);
        clearTimeout(t);
      };
    });

    // ─────────────────────────────────────────────────────────────
    // Word-by-word blue-to-natural color reveal.
    // ─────────────────────────────────────────────────────────────
    // Every word inside a heading/paragraph gets wrapped in a
    // <span class="reveal-word">. The class carries blue color + a CSS
    // transition. When the element enters the viewport, we add
    // `.reveal-word--done` word by word (60ms stagger). That class removes
    // the blue via a specificity boost, and CSS transitions the color to
    // whatever the surrounding text color is (white in dark sections,
    // navy on white sections, etc.).
    const selectors = [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "li", "strong", "em",
      "h1 > span", "h2 > span", "h3 > span",
      "h4 > span", "h5 > span", "h6 > span",
      "p > span",
    ].join(", ");
    const heroTitle = document.querySelector(".hero__title");
    const textElements = Array.from(
      document.querySelectorAll(selectors)
    ).filter(
      (el) => el !== heroTitle && !(heroTitle && heroTitle.contains(el))
    );

    const REVEAL_BLUE = "#286eff";

    // Wrap each word in a <span> and paint it blue via INLINE style (inline
    // always beats any class rule, so removing the inline color later is
    // guaranteed to reveal the underlying cascaded color).
    //
    // IDEMPOTENT: React StrictMode invokes `useEffect` twice in dev. On the
    // second invocation, DOM already contains the wrapped spans from the
    // first run. We must find and return those existing spans (with their
    // inline blue still applied) instead of returning an empty array —
    // otherwise the references are lost and nothing ever clears the blue.
    const wrapWords = (root) => {
      const existing = root.querySelectorAll(".reveal-word");
      if (existing.length > 0) {
        // Already wrapped by a previous effect run. Re-apply the blue +
        // transition inline styles in case they were cleared, and return
        // the existing spans so callers get valid references.
        const arr = Array.from(existing);
        arr.forEach((span) => {
          if (!span.style.color) {
            span.style.color = REVEAL_BLUE;
            span.style.transition = "color 0.7s ease-out";
          }
        });
        return arr;
      }

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => {
          if (!n.nodeValue || !n.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) textNodes.push(node);
      const words = [];
      textNodes.forEach((textNode) => {
        const parts = textNode.nodeValue.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "reveal-word";
            span.style.color = REVEAL_BLUE;
            span.style.transition = "color 0.7s ease-out";
            span.textContent = part;
            frag.appendChild(span);
            words.push(span);
          }
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });
      return words;
    };

    const elementWords = textElements
      .map((el) => ({ el, words: wrapWords(el) }))
      .filter(({ words }) => words.length > 0);

    // Reveal a single element's words with a staggered inline-color clear.
    const revealElement = (words, baseDelay = 0) => {
      words.forEach((w, i) => {
        setTimeout(() => {
          w.style.removeProperty("color");
        }, baseDelay + i * 40);
      });
    };

    // Reveal EVERY element's words on scroll into view. Uses simple
    // getBoundingClientRect polling driven by scroll + resize events —
    // no IntersectionObserver quirks with pinned/transformed ancestors.
    const revealed = new WeakSet();
    const checkAndReveal = () => {
      const trigger = window.innerHeight * 0.9;
      elementWords.forEach(({ el, words }) => {
        if (revealed.has(el)) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < trigger && rect.bottom > 0) {
          revealed.add(el);
          revealElement(words);
        }
      });
    };
    checkAndReveal();
    window.addEventListener("scroll", checkAndReveal, { passive: true });
    window.addEventListener("resize", checkAndReveal);

    // Safety net: after 3 seconds, force-reveal anything still blue.
    const safetyTimeout = setTimeout(() => {
      elementWords.forEach(({ el, words }) => {
        if (revealed.has(el)) return;
        revealed.add(el);
        revealElement(words);
      });
    }, 3000);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", checkAndReveal);
      window.removeEventListener("resize", checkAndReveal);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return null;
}
