
"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    // Prevent the browser from restoring an old scroll position.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // If the URL carries a hash, treat it as a scroll anchor instead of
    // forcing a scroll-to-top. The top-scroll + rAF double-reset below
    // would otherwise wipe out the browser's native hash-anchor jump
    // (e.g. the header "Get in touch" link navigating to
    // `/contact#enquiry` landed on the hero because this effect
    // scrolled to 0 right after Next finished rendering).
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    const scrollToTop = () => {
      // Reset Lenis first, if it is enabled.
      if (window.__lenis) {
        window.__lenis.scrollTo(0, {
          immediate: true,
          force: true,
        });
      }

      // Reset native scrolling without smooth animation.
      document.documentElement.style.scrollBehavior = "auto";
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    const scrollToHash = (hashValue) => {
      const id = hashValue.slice(1);
      if (!id) return false;
      const target = document.getElementById(id);
      if (!target) return false;

      // Honour the fixed header's height so the section lands below it
      // instead of being hidden under the nav bar.
      const headerOffset = 90;
      const rect = target.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const y = Math.max(0, absoluteTop - headerOffset);

      if (window.__lenis) {
        window.__lenis.scrollTo(y, { immediate: true, force: true });
      }
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
      return true;
    };

    if (hash) {
      // Try once synchronously (fast path for already-rendered pages),
      // then once in a rAF to catch pages where the anchor element
      // hasn't been painted yet, then one safety retry on the next
      // animation frame in case it still wasn't mounted.
      const resolved = scrollToHash(hash);
      const frame = requestAnimationFrame(() => {
        const ok = scrollToHash(hash);
        if (!ok && !resolved) {
          // Fallback: anchor still not in the DOM — don't leave the user
          // halfway. Reset to top rather than at a stale previous
          // position.
          scrollToTop();
        }
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    // No hash — original behaviour: snap to the top of the new page.
    scrollToTop();

    const frame = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
