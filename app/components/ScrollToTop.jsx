"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the top of the page on every route change.
 *
 * Next.js App Router preserves scroll position between client-side
 * navigations by default. For a marketing site that behavior is
 * disorienting — users click "About Us" halfway down a long Services
 * page and land halfway down the About page. This component listens
 * for pathname changes and forces the viewport back to (0, 0).
 *
 * `behavior: "instant"` is deliberate: a smooth scroll on nav would
 * animate the user up before the new page fades in, which reads as a
 * stutter. Instant scroll + the page's own entrance animations gives
 * a clean "fresh page" feel.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
