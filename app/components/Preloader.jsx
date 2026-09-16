"use client";

import { useEffect, useState } from "react";
import "./Preloader.css";

const MIN_VISIBLE_MS = 1600;
const FADE_MS = 700;

export default function Preloader() {
  const [phase, setPhase] = useState("visible");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("gone");
      document.body.classList.remove("preloading");
      return;
    }

    document.body.classList.add("preloading");
    const start = performance.now();

    const beginFade = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setPhase("fading"), wait);
    };

    if (document.readyState === "complete") {
      beginFade();
    } else {
      window.addEventListener("load", beginFade, { once: true });
    }

    return () => {
      window.removeEventListener("load", beginFade);
      document.body.classList.remove("preloading");
    };
  }, []);

  useEffect(() => {
    if (phase !== "fading") return;
    const t = window.setTimeout(() => {
      setPhase("gone");
      document.body.classList.remove("preloading");
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className={`preloader ${phase === "fading" ? "preloader--fading" : ""}`}
      aria-hidden="true"
    >
      <div className="preloader__stage">
        <span className="preloader__ring preloader__ring--1" />
        <span className="preloader__ring preloader__ring--2" />
        <span className="preloader__ring preloader__ring--3" />
        <span className="preloader__ring preloader__ring--4" />
        <span className="preloader__wordmark">UNIVERSAL LANGUAGE TRANSLATIONS</span>
      </div>
    </div>
  );
}
