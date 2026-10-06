"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth-scroll bridged to GSAP ScrollTrigger.
 *
 * Key integration points (official Lenis + GSAP recipe):
 *   1. lenis.on("scroll", ScrollTrigger.update) — every Lenis scroll tick
 *      forces ScrollTrigger to re-evaluate, keeping pins and scrubbed
 *      timelines in perfect sync with the eased scroll position.
 *   2. gsap.ticker.add(...) drives lenis.raf(time) off the same RAF loop
 *      GSAP already uses, so the two run on one frame and don't fight.
 *   3. gsap.ticker.lagSmoothing(0) disables GSAP's catch-up logic — scroll
 *      position must match the current frame or pins jitter.
 *
 * Skipped when the user prefers reduced motion. Touch devices use native
 * scroll via `syncTouch: false` so mobile stays responsive.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Skip Lenis entirely on mobile / touch devices. Lenis adds no benefit
    // on touch (`syncTouch: false` already defers to native scroll) but its
    // RAF loop + per-scroll ScrollTrigger.update firing on every native scroll
    // event introduces noticeable jank. On narrow viewports there are also
    // no pinned/scrubbed timelines anyway (AboutAnimations / services pins
    // are gated to desktop), so native scroll is both smoother and cheaper.
    const isMobile = window.matchMedia("(max-width: 960px)").matches;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isMobile || isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    // Expose on window so other components (e.g. the Header mobile drawer)
    // can call `lenis.stop()` / `lenis.start()` without a React context.
    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      if (typeof window !== "undefined" && window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, [pathname]);

  return null;
}
