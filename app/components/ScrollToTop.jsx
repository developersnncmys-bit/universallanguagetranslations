
"use client";

import { useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    // Prevent the browser from restoring an old scroll position.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

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

    // Reset immediately and again after the route starts rendering.
    scrollToTop();

    const frame = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname, searchParams]);

  return null;
}
