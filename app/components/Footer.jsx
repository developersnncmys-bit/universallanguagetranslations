"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./Footer.css";

const NAV = [
  {
    heading: "About Us",
    links: [
      { label: "Company", href: "/about" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Translation", href: "/services/translation" },
      { label: "Transcription", href: "/services/transcription" },
      { label: "Subtitles", href: "/services/subtitles" },
      { label: "Voiceover", href: "/services/voiceover" },
      { label: "Data Annotation", href: "/services/data-annotation" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

// Big dotted wordmark rendered on a <canvas>. We render the text once to an
// offscreen canvas, sample every N pixels, and turn every "lit" pixel into a
// particle with a target position. Each frame the particles are (a) repelled
// away from the cursor when it's over the canvas, and (b) spring-pulled back
// to their target — so dots scatter as you move through them and reform when
// you leave.
function DottedWordmark({ text }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles = [];
    let raf = 0;
    let mounted = true;
    const pointer = { x: -9999, y: -9999, active: false };
    const REPEL_RADIUS = 90;
    const REPEL_STRENGTH = 2.2;
    const SPRING = 0.06;
    const DAMPING = 0.82;
    const DOT_SIZE = 1.6;
    const SPACING = 6;

    // Canvas `font` strings do NOT accept CSS variables — must be literal
    // family names. Audiowide is loaded via next/font, and the actual CSS
    // family name that resolves is stored in a computed style, but easier
    // to just list "Audiowide" literally and let fonts.ready gate the draw.
    const FONT_STACK = '"Audiowide", "Impact", sans-serif';

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w === 0 || h === 0) return;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d");
      octx.fillStyle = "#000";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      let fontSize = Math.floor(canvas.height * 0.9);
      octx.font = `400 ${fontSize}px ${FONT_STACK}`;
      const targetW = canvas.width * 0.94;
      while (octx.measureText(text).width > targetW && fontSize > 20) {
        fontSize -= 2;
        octx.font = `400 ${fontSize}px ${FONT_STACK}`;
      }
      octx.fillText(text, canvas.width / 2, canvas.height / 2);

      const step = Math.round(SPACING * dpr);
      const data = octx.getImageData(0, 0, canvas.width, canvas.height).data;
      const next = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 128) {
            next.push({ x, y, tx: x, ty: y, vx: 0, vy: 0 });
          }
        }
      }
      particles = next;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const repelR = REPEL_RADIUS * dpr;
      const repelR2 = repelR * repelR;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repelR2 && d2 > 0.001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / repelR) * REPEL_STRENGTH;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        // Spring back to target
        p.vx += (p.tx - p.x) * SPRING;
        p.vy += (p.ty - p.y) * SPRING;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      ctx.fillStyle = "#03121F";
      const r = DOT_SIZE * dpr;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) * dpr;
      pointer.y = (e.clientY - rect.top) * dpr;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onResize = () => build();

    // Wait for Audiowide to be loaded before sampling — otherwise we sample
    // whatever the fallback family renders at, which is a different set of
    // glyph metrics and looks wrong once the real font swaps in.
    const start = async () => {
      try {
        if (document.fonts?.load) {
          await document.fonts.load(`400 40px "Audiowide"`);
          await document.fonts.ready;
        }
      } catch {}
      if (!mounted) return;
      build();
      frame();
    };
    start();

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [text]);

  return (
    <div className="site-footer__wordmark" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="site-footer__wordmark-canvas" />
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__brand-name">
            UNIVERSAL LANGUAGE TRANSLATIONS
          </p>
          <p className="site-footer__tagline">
            Premium translation, transcription, and multilingual data services
            for global teams. Human quality, delivered on time.
          </p>
          <a
            className="site-footer__email"
            href="mailto:hello@example.com"
          >
            hello@example.com
          </a>
        </div>

        <div className="site-footer__nav">
          {NAV.map((col) => (
            <div className="site-footer__col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {year} Universal Language Translations. All rights reserved.</p>
        <div className="site-footer__legal">
          <Link href="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms">Terms</Link>
        </div>
      </div>

      <div className="site-footer__wordmark-row">
        <DottedWordmark text="UNIVERSAL" />
        <div className="site-footer__wordmark-sub" aria-hidden="true">
          <span>LANGUAGE</span>
          <span>TRANSLATIONS</span>
        </div>
      </div>
    </footer>
  );
}
