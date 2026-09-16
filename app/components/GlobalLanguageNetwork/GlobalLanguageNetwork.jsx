"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import DottedMap from "dotted-map";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GlobalLanguageNetwork.css";

gsap.registerPlugin(ScrollTrigger);

// Languages shown on the left rail. Order matches the highlight sweep timing.
const LANGUAGES = [
  "ENGLISH",
  "SPANISH",
  "FRENCH",
  "GERMAN",
  "ARABIC",
  "HINDI",
  "MANDARIN",
  "JAPANESE",
];

// Service categories on the right rail — mirror the Services section list.
const SERVICES = [
  "TRANSLATION",
  "TRANSCRIPTION",
  "SUBTITLES",
  "VOICEOVER",
  "DATA ANNOTATION",
  "DATA EVOLUTION",
  "MULTILINGUAL DATA",
];

// Geographic hubs — logical regions rather than office pins. Each has a lat/lng
// used to compute its pixel coordinate on the dotted map at mount time.
const HUBS = [
  { id: "NA", label: "NORTH AMERICA", lat: 40, lng: -100 },
  { id: "SA", label: "SOUTH AMERICA", lat: -15, lng: -60 },
  { id: "EU", label: "EUROPE", lat: 50, lng: 10 },
  { id: "ME", label: "MIDDLE EAST", lat: 25, lng: 45 },
  { id: "IN", label: "INDIA", lat: 22, lng: 78 },
  { id: "EA", label: "EAST ASIA", lat: 35, lng: 118 },
  { id: "SEA", label: "SE ASIA", lat: 3, lng: 105 },
  { id: "AU", label: "AUSTRALIA", lat: -25, lng: 135 },
];

// Connection graph — ordered so earlier connections belong to earlier scroll
// progress. Kept sparse on purpose (the brief specifies a subtle network).
const CONNECTIONS = [
  ["EU", "NA"],
  ["EU", "IN"],
  ["IN", "EA"],
  ["ME", "EU"],
  ["EA", "SEA"],
  ["SEA", "AU"],
  ["ME", "IN"],
  ["NA", "SA"],
];

const MAP_WIDTH = 800;
const MAP_HEIGHT = 400;

// Compute the base dotted map + hub pixel coordinates once at module load.
// getSVG returns a bare `<svg>...</svg>` string; we grab the inner content
// via a viewBox-preserving wrapper below.
function buildMapAssets() {
  const map = new DottedMap({ height: 60, grid: "diagonal" });
  const svg = map.getSVG({
    radius: 0.26,
    color: "rgba(139, 180, 255, 0.09)",
    shape: "circle",
    backgroundColor: "transparent",
  });
  const inner = svg.replace(/^<svg[^>]*>|<\/svg>$/g, "");
  const width = map.image?.width ?? MAP_WIDTH;
  const height = map.image?.height ?? MAP_HEIGHT;

  // Resolve hub pixel coords on the same coordinate system as the SVG.
  const hubCoords = {};
  for (const hub of HUBS) {
    const p = map.getPin({ lat: hub.lat, lng: hub.lng }) ??
      map.addPin({ lat: hub.lat, lng: hub.lng, data: hub.id });
    hubCoords[hub.id] = { x: p.x, y: p.y };
  }

  return { svgInner: inner, width, height, hubCoords };
}

// Quadratic arc between two 2D points, bowed away from the segment midpoint
// perpendicularly. Amount scales with segment length so short arcs stay tight.
function arcPathBetween(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  // Perpendicular offset, pushed "upward" on the map (negative Y in SVG).
  const nx = -dy / len;
  const ny = dx / len;
  const lift = Math.min(60, len * 0.22);
  const cx = mx + nx * lift;
  const cy = my + ny * lift - Math.min(20, len * 0.08);
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export default function GlobalLanguageNetwork() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const hubRefs = useRef({});
  const arcRefs = useRef([]);
  const langRefs = useRef([]);
  const serviceRefs = useRef([]);
  const statusHubsRef = useRef(null);
  const statusRoutesRef = useRef(null);
  const mapRef = useRef(null);
  const captionRef = useRef(null);

  const { svgInner, width, height, hubCoords } = useMemo(buildMapAssets, []);

  // Pre-build arc path strings once — refs get the DOM path node, we'll animate
  // stroke-dashoffset on scroll to progressively draw each connection.
  const arcs = useMemo(
    () =>
      CONNECTIONS.map(([fromId, toId]) => ({
        fromId,
        toId,
        d: arcPathBetween(hubCoords[fromId], hubCoords[toId]),
      })),
    [hubCoords]
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Measure each arc path length for stroke-dashoffset drawing.
    arcRefs.current.forEach((path) => {
      if (!path) return;
      const len = path.getTotalLength?.() ?? 200;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    if (reduced) {
      // Skip pin + scrub; snap to a fully-revealed static composition.
      hubRefs.current &&
        Object.values(hubRefs.current).forEach(
          (el) => el && el.classList.add("is-active")
        );
      arcRefs.current.forEach((path) => {
        if (!path) return;
        path.style.strokeDashoffset = "0";
        path.style.opacity = "1";
      });
      langRefs.current.forEach((el) => el && el.classList.add("is-active"));
      serviceRefs.current.forEach((el) => el && el.classList.add("is-active"));
      if (statusHubsRef.current)
        statusHubsRef.current.textContent = String(HUBS.length).padStart(2, "0");
      if (statusRoutesRef.current)
        statusRoutesRef.current.textContent = String(CONNECTIONS.length).padStart(
          2,
          "0"
        );
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 4.5}`,
        pin: pinRef.current,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Map fade-in through the first 8% of scroll.
          if (mapRef.current) {
            mapRef.current.style.opacity = String(Math.min(1, p / 0.08));
          }

          // Hubs activate one after another between 0.08 and 0.55.
          const hubIds = HUBS.map((h) => h.id);
          const hubWindow = [0.08, 0.55];
          hubIds.forEach((id, i) => {
            const threshold =
              hubWindow[0] +
              ((hubWindow[1] - hubWindow[0]) * i) / (hubIds.length - 1);
            const el = hubRefs.current[id];
            if (!el) return;
            if (p >= threshold - 0.01) el.classList.add("is-active");
            else el.classList.remove("is-active");
          });

          // Arcs draw between 0.15 and 0.75, staggered per connection.
          const arcWindow = [0.15, 0.75];
          arcRefs.current.forEach((path, i) => {
            if (!path) return;
            const stagger =
              arcWindow[0] +
              ((arcWindow[1] - arcWindow[0]) * i) / (arcRefs.current.length - 1);
            const localSpan = 0.08;
            const local = Math.min(
              1,
              Math.max(0, (p - stagger) / localSpan)
            );
            const len = parseFloat(path.style.strokeDasharray) || 200;
            path.style.strokeDashoffset = String(len * (1 - local));
            // Cap max opacity so lines settle at a quiet baseline after
            // drawing rather than staying at full brightness.
            path.style.opacity = String(local * 0.55);
          });

          // Languages highlight sweep between 0.30 and 0.85.
          const langWindow = [0.30, 0.85];
          langRefs.current.forEach((el, i) => {
            if (!el) return;
            const threshold =
              langWindow[0] +
              ((langWindow[1] - langWindow[0]) * i) /
                (langRefs.current.length - 1);
            if (p >= threshold - 0.01) el.classList.add("is-active");
            else el.classList.remove("is-active");
          });

          // Services highlight sweep between 0.55 and 0.98.
          const svcWindow = [0.55, 0.98];
          serviceRefs.current.forEach((el, i) => {
            if (!el) return;
            const threshold =
              svcWindow[0] +
              ((svcWindow[1] - svcWindow[0]) * i) /
                (serviceRefs.current.length - 1);
            if (p >= threshold - 0.01) el.classList.add("is-active");
            else el.classList.remove("is-active");
          });

          // Status counters tick as the network builds.
          if (statusHubsRef.current) {
            const activated = hubIds.filter((id, i) => {
              const threshold =
                hubWindow[0] +
                ((hubWindow[1] - hubWindow[0]) * i) / (hubIds.length - 1);
              return p >= threshold - 0.01;
            }).length;
            statusHubsRef.current.textContent = String(activated).padStart(
              2,
              "0"
            );
          }
          if (statusRoutesRef.current) {
            const drawn = arcRefs.current.filter((_, i) => {
              const stagger =
                arcWindow[0] +
                ((arcWindow[1] - arcWindow[0]) * i) /
                  (arcRefs.current.length - 1);
              return p >= stagger + 0.06;
            }).length;
            statusRoutesRef.current.textContent = String(drawn).padStart(2, "0");
          }

          // Caption fade at the very end.
          if (captionRef.current) {
            const c = Math.min(1, Math.max(0, (p - 0.85) / 0.1));
            captionRef.current.style.opacity = String(c);
            captionRef.current.style.transform = `translateY(${(1 - c) * 8}px)`;
          }
        },
      });

      return () => st.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [arcs]);

  return (
    <section className="ult-global-language-network" ref={rootRef}>
      <div className="ult-global-language-network__pin" ref={pinRef}>
        <header className="ult-global-language-network__header">
          <div className="ult-global-language-network__brand">
            UNIVERSAL LANGUAGE · GLOBAL NETWORK
          </div>
          <div className="ult-global-language-network__status">
            <span>
              HUBS{" "}
              <b ref={statusHubsRef}>00</b>
              <em>/ {String(HUBS.length).padStart(2, "0")}</em>
            </span>
            <span>
              ROUTES{" "}
              <b ref={statusRoutesRef}>00</b>
              <em>/ {String(CONNECTIONS.length).padStart(2, "0")}</em>
            </span>
            <span className="ult-global-language-network__status-dot" aria-hidden="true" />
          </div>
        </header>

        <div className="ult-global-language-network__stage">
          <ul className="ult-global-language-network__rail ult-global-language-network__rail--left" aria-label="Languages">
            <li className="ult-global-language-network__rail-title">LANGUAGES</li>
            {LANGUAGES.map((lang, i) => (
              <li
                key={lang}
                className="ult-global-language-network__rail-item"
                ref={(el) => (langRefs.current[i] = el)}
              >
                <span className="ult-global-language-network__rail-marker" aria-hidden="true" />
                {lang}
              </li>
            ))}
          </ul>

          <div className="ult-global-language-network__map" ref={mapRef}>
            <svg
              className="ult-global-language-network__map-svg"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* Base dotted map (continents rendered as small dots) */}
              <g
                className="ult-global-language-network__map-dots"
                dangerouslySetInnerHTML={{ __html: svgInner }}
              />

              {/* Connection arcs — drawn progressively via stroke-dashoffset */}
              <g className="ult-global-language-network__map-arcs">
                {arcs.map((a, i) => (
                  <path
                    key={`${a.fromId}-${a.toId}`}
                    ref={(el) => (arcRefs.current[i] = el)}
                    d={a.d}
                    fill="none"
                  />
                ))}
              </g>

              {/* Active hub markers — bright dot + ring, activated on scroll */}
              <g className="ult-global-language-network__map-hubs">
                {HUBS.map((hub) => {
                  const p = hubCoords[hub.id];
                  return (
                    <g
                      key={hub.id}
                      className="ult-global-language-network__hub"
                      ref={(el) => (hubRefs.current[hub.id] = el)}
                      transform={`translate(${p.x} ${p.y})`}
                    >
                      <circle className="ult-global-language-network__hub-ring" r="4" />
                      <circle className="ult-global-language-network__hub-dot" r="0.85" />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <ul className="ult-global-language-network__rail ult-global-language-network__rail--right" aria-label="Services">
            <li className="ult-global-language-network__rail-title">SERVICES</li>
            {SERVICES.map((svc, i) => (
              <li
                key={svc}
                className="ult-global-language-network__rail-item"
                ref={(el) => (serviceRefs.current[i] = el)}
              >
                {svc}
                <span className="ult-global-language-network__rail-marker" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <footer className="ult-global-language-network__footer">
          <div className="ult-global-language-network__heading">
            Language connects the world.
          </div>
          <p
            className="ult-global-language-network__caption"
            ref={captionRef}
          >
            Connecting languages, content and data across global markets.
          </p>
        </footer>
      </div>
    </section>
  );
}
