"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css";

// 24/7 availability badge — pulsing green "live" dot + "24/7 AVAILABLE".
// Reads as a direct business promise to clients: we're staffed around
// the clock, every day. The dot reinforces "right this moment."
function LiveClock() {
  return (
    <div className="live-clock" aria-label="We are available 24 hours a day, 7 days a week">
      <span className="live-clock__dot" aria-hidden="true" />
      <span className="live-clock__label">24/7</span>
      <span className="live-clock__promise">Availability</span>
    </div>
  );
}

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Translation",
        href: "/services/translation",
        // All industry sub-items point at the main /services/translation
        // page (the per-industry detail pages aren't built yet; keep the
        // dropdown items so the structure is visible, but route them all
        // to the parent until the detail pages exist).
        children: [
          { label: "Medical Translation Services", href: "/services/translation" },
          { label: "E-commerce Translation Services", href: "/services/translation" },
          { label: "E-learning Translation Services", href: "/services/translation" },
          { label: "Financial Translation Services", href: "/services/translation" },
          { label: "Business Translation Services", href: "/services/translation" },
          { label: "Marketing Translation Services", href: "/services/translation" },
          { label: "Legal Translation Services", href: "/services/translation" },
          { label: "Technical Translation Services", href: "/services/translation" },
        ],
      },
      { label: "Transcription", href: "/services/transcription" },
      { label: "Subtitles", href: "/services/subtitles" },
      { label: "Voiceover", href: "/services/voiceover" },
      { label: "Data Annotation", href: "/services/data-annotation" },
      { label: "Data Evolution", href: "/services/data-evolution" },
      { label: "Multilingual Data Creation", href: "/services/multilingual-data-creation" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

function ChevronDown() {
  return (
    <svg
      className="nav-caret"
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3 4.5 3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      className="nav-caret nav-caret--right"
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4.5 3 3 3-3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isPathActive(pathname, href) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavItem({ item, depth, onNavigate, pathname, isMobile }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const active = isPathActive(pathname, item.href);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const linkClass = active ? "is-active" : undefined;
  const liClass = [
    hasChildren ? "has-dropdown" : "",
    active ? "is-active" : "",
    isSubOpen ? "is-sub-open" : "",
  ].filter(Boolean).join(" ");

  // Label click — ALWAYS navigates to the item's page (even on mobile for
  // parent items that have a submenu). The caret toggle below handles
  // expanding the accordion separately, so users can either go to the
  // Services page or open its submenu without one blocking the other.
  const handleClick = () => {
    onNavigate();
  };

  // Caret click (mobile only, parent items with children) — toggles the
  // accordion panel without navigating. `e.preventDefault()` stops the
  // outer <Link>'s navigation; `e.stopPropagation()` keeps the handler
  // from re-firing on the Link.
  const handleCaretClick = (e) => {
    if (isMobile && hasChildren) {
      e.preventDefault();
      e.stopPropagation();
      setIsSubOpen((v) => !v);
    }
  };

  // On mobile, force white directly via inline style — this beats any CSS
  // specificity battle with PageAnimations' inline-blue `.reveal-word` spans
  // and any stale cached stylesheet in dev mode. `data-mobile-nav` is a hook
  // the drawer effect uses to force the color on every descendant via JS.
  const linkStyle = isMobile ? { color: "#ffffff" } : undefined;

  return (
    <li className={liClass || undefined} data-mobile-nav={isMobile ? "" : undefined}>
      <Link
        href={item.href}
        onClick={handleClick}
        className={linkClass}
        style={linkStyle}
        aria-current={active && !hasChildren ? "page" : undefined}
        aria-expanded={isMobile && hasChildren ? isSubOpen : undefined}
      >
        {item.label}
        {hasChildren && (
          <span
            className="nav-caret-tap"
            onClick={handleCaretClick}
            role={isMobile ? "button" : undefined}
            aria-label={isMobile ? `Toggle ${item.label} submenu` : undefined}
          >
            {depth === 0 ? <ChevronDown /> : <ChevronRight />}
          </span>
        )}
      </Link>
      {hasChildren && (
        <ul className={`nav-dropdown nav-dropdown--depth-${depth + 1}`} role="menu">
          {item.children.map((child) => (
            <NavItem
              key={child.label}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
              pathname={pathname}
              isMobile={isMobile}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 960px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    // Native scroll lock — fallback for touch devices + non-Lenis browsers.
    document.body.style.overflow = open ? "hidden" : "";

    // Lenis is RAF-driven and ignores body overflow; it has to be told to
    // stop so wheel/trackpad gestures over the drawer don't scroll the
    // background. SmoothScroll exposes the instance on `window.__lenis`.
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }

    return () => {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [open]);

  // FORCE WHITE on every text descendant of the mobile drawer via direct DOM.
  // Walks every link / span / reveal-word inside `.primary-nav` and sets an
  // inline `color: #ffffff`. Inline styles beat any PageAnimations inline
  // blue AND any stale cached CSS, so this is the last-resort guarantee that
  // the drawer always renders legible white text.
  useEffect(() => {
    if (!isMobile) return;
    const nav = document.querySelector(".site-header .primary-nav");
    if (!nav) return;

    const paint = () => {
      nav.querySelectorAll("a, li, span, .reveal-word").forEach((el) => {
        // Skip the chevron SVG — it uses currentColor from its parent.
        if (el.classList.contains("nav-caret")) return;
        if (el.closest(".nav-caret")) return;
        el.style.setProperty("color", "#ffffff", "important");
      });
    };

    paint();
    // Repaint shortly after mount / open — PageAnimations wraps new words
    // on the next tick, so we re-run once that's settled.
    const t1 = setTimeout(paint, 50);
    const t2 = setTimeout(paint, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isMobile, open, pathname]);

  const closeMenu = () => setOpen(false);

  // Logo click — always lands you at the top of Home. For cross-page
  // navigation the global ScrollToTop handles this via `usePathname`,
  // but when the user is already on `/` the pathname doesn't change so
  // the effect doesn't re-fire — scroll explicitly here to cover that.
  const handleBrandClick = () => {
    closeMenu();
    if (pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  return (
    <header className={`site-header ${pastHero ? "is-light" : ""}`}>
      <div className="site-header__inner">
        <Link href="/" className="brand" onClick={handleBrandClick}>
          <span className="brand__wordmark">
            UNIVERSAL LANGUAGE TRANSLATIONS
          </span>
        </Link>

        <nav
          className={`primary-nav ${open ? "is-open" : ""}`}
          aria-label="Primary"
          data-lenis-prevent
        >
          <ul>
            {NAV.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                depth={0}
                onNavigate={closeMenu}
                pathname={pathname}
                isMobile={isMobile}
              />
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <LiveClock />
          <Link
            href="#enquiry"
            className="btn btn-solid-light"
            onClick={closeMenu}
          >
            Get in touch
          </Link>
        </div>

        <button
          type="button"
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
