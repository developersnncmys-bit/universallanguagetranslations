"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        children: [
          { label: "Medical Translation Services", href: "/services/translation/medical" },
          { label: "E-commerce Translation Services", href: "/services/translation/e-commerce" },
          { label: "E-learning Translation Services", href: "/services/translation/e-learning" },
          { label: "Financial Translation Services", href: "/services/translation/financial" },
          { label: "Business Translation Services", href: "/services/translation/business" },
          { label: "Marketing Translation Services", href: "/services/translation/marketing" },
          { label: "Legal Translation Services", href: "/services/translation/legal" },
          { label: "Technical Translation Services", href: "/services/translation/technical" },
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

function NavItem({ item, depth, onNavigate }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  return (
    <li className={hasChildren ? "has-dropdown" : ""}>
      <Link href={item.href} onClick={onNavigate}>
        {item.label}
        {hasChildren && (depth === 0 ? <ChevronDown /> : <ChevronRight />)}
      </Link>
      {hasChildren && (
        <ul className={`nav-dropdown nav-dropdown--depth-${depth + 1}`} role="menu">
          {item.children.map((child) => (
            <NavItem
              key={child.href}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header ${pastHero ? "is-light" : ""}`}>
      <div className="site-header__inner">
        <Link href="/" className="brand" onClick={closeMenu}>
          <span className="brand__wordmark">
            UNIVERSAL LANGUAGE TRANSLATIONS
          </span>
        </Link>

        <nav className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                depth={0}
                onNavigate={closeMenu}
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
