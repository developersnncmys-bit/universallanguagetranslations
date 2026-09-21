"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import DottedMap from "dotted-map";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GlobalLanguageNetwork.css";

gsap.registerPlugin(ScrollTrigger);

// Capability items shown on the left rail. Order matches the highlight sweep timing.
const COVERAGE = [
  "GLOBAL LANGUAGE SUPPORT",
  "MULTILINGUAL CONTENT",
  "CROSS-LANGUAGE COMMUNICATION",
  "LOCALIZATION & ADAPTATION",
  "LANGUAGE DATA SERVICES",
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
  const hubGlowRefs = useRef({});
  const arcRefs = useRef([]);
  const langRefs = useRef([]);
  const serviceRefs = useRef([]);
  const statusHubsRef = useRef(null);
  const statusRoutesRef = useRef(null);
  const mapRef = useRef(null);
  const captionRef = useRef(null);
  const particlesLayerRef = useRef(null);

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

    // Collect and spatially sort every dot in the injected map SVG so we can
    // stagger their reveal as a west→east wave (with a small y jitter so it
    // reads as an organic network forming rather than a rigid column sweep).
    const dotsGroup = mapRef.current?.querySelector(
      ".ult-global-language-network__map-dots"
    );
    const dots = dotsGroup
      ? Array.from(dotsGroup.querySelectorAll("circle"))
      : [];
    dots.sort((a, b) => {
      const ax = parseFloat(a.getAttribute("cx")) || 0;
      const ay = parseFloat(a.getAttribute("cy")) || 0;
      const bx = parseFloat(b.getAttribute("cx")) || 0;
      const by = parseFloat(b.getAttribute("cy")) || 0;
      // Primary sort by X (west→east), tiny y bias so bands blur together
      return ax + ay * 0.15 - (bx + by * 0.15);
    });

    // Measure each arc path length for stroke-dashoffset drawing.
    arcRefs.current.forEach((path) => {
      if (!path) return;
      const len = path.getTotalLength?.() ?? 200;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    const hubGroups = HUBS.map((h) => hubRefs.current[h.id]).filter(Boolean);
    const langItems = langRefs.current.filter(Boolean);
    const svcItems = serviceRefs.current.filter(Boolean);

    if (reduced) {
      // Skip pin + scrub; snap to a fully-revealed static composition.
      gsap.set(dots, { opacity: 1 });
      hubGroups.forEach((el) => el.classList.add("is-active"));
      gsap.set(hubGroups, { opacity: 1, scale: 1, transformOrigin: "center" });
      arcRefs.current.forEach((path) => {
        if (!path) return;
        path.style.strokeDashoffset = "0";
        path.style.opacity = "1";
      });
      langItems.forEach((el) => el.classList.add("is-active"));
      svcItems.forEach((el) => el.classList.add("is-active"));
      gsap.set(langItems, { opacity: 1, y: 0 });
      gsap.set(svcItems, { opacity: 1, x: 0 });
      if (mapRef.current) mapRef.current.style.opacity = "1";
      if (captionRef.current) {
        captionRef.current.style.opacity = "1";
        captionRef.current.style.transform = "translateY(0)";
      }
      if (statusHubsRef.current)
        statusHubsRef.current.textContent = String(HUBS.length).padStart(2, "0");
      if (statusRoutesRef.current)
        statusRoutesRef.current.textContent = String(
          CONNECTIONS.length
        ).padStart(2, "0");
      return;
    }

    // ---- INITIAL HIDDEN STATE ----
    // Map container is visible from the start — the dots themselves handle
    // the reveal (was previously fading the whole container, which delayed
    // hub/arc anchoring calculations by the container fade).
    if (mapRef.current) mapRef.current.style.opacity = "1";
    gsap.set(dots, { opacity: 0 });
    gsap.set(hubGroups, {
      opacity: 0,
      scale: 0.6,
      transformOrigin: "center",
      transformBox: "fill-box",
    });
    gsap.set(langItems, { opacity: 0, y: 10 });
    gsap.set(svcItems, { opacity: 0, x: 12 });
    if (captionRef.current) {
      captionRef.current.style.opacity = "0";
      captionRef.current.style.transform = "translateY(8px)";
    }

    // Set staggered per-hub CSS animation delays so the ambient pulses
    // are asynchronous instead of every hub breathing in lock-step.
    hubGroups.forEach((hub, i) => {
      const dotEl = hub.querySelector(".ult-global-language-network__hub-dot");
      const glowEl = hub.querySelector(".ult-global-language-network__hub-glow");
      const ringEl = hub.querySelector(".ult-global-language-network__hub-ring");
      const delay = `${(i * 0.35).toFixed(2)}s`;
      if (dotEl) dotEl.style.animationDelay = delay;
      if (glowEl) glowEl.style.animationDelay = delay;
      if (ringEl) ringEl.style.animationDelay = delay;
    });

    // Storage for cancelling the ambient particle loop on unmount.
    const particleControllers = [];

    const ctx = gsap.context(() => {
      // Play-once entry timeline — no scrub, no pin. Fires when the section
      // enters view and completes in real time (~1.2s) so the network
      // activates as one coordinated wave regardless of scroll speed.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
          refreshPriority: 5,
        },
        onComplete: startParticleLoop,
      });

      // ---- MAP FORMATION (0.00 → ~0.75s) ----
      // Fast west→east wave. stagger.amount compressed so the whole map
      // is nearly complete by 0.70 (spec: "map is almost completely formed"
      // at 0.70) and fully complete before the 1.0–1.2s total.
      tl.to(
        dots,
        {
          opacity: 1,
          duration: 0.10,
          ease: "power1.out",
          stagger: { amount: 0.65, from: "start" },
        },
        0
      );

      // ---- LANGUAGE COVERAGE (0.15 → ~0.70s) ----
      // Spec: "list items begin appearing" at 0.15. All items visible by 0.70.
      tl.to(
        langItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.30,
          ease: "power2.out",
          stagger: 0.06,
          onStart: () => langItems.forEach((el) => el.classList.add("is-active")),
        },
        0.15
      );

      // ---- SERVICES (0.15 → ~0.70s) ----
      tl.to(
        svcItems,
        {
          opacity: 1,
          x: 0,
          duration: 0.30,
          ease: "power2.out",
          stagger: 0.06,
          onStart: () => svcItems.forEach((el) => el.classList.add("is-active")),
        },
        0.15
      );

      // ---- HUBS (0.15 → ~0.85s) ----
      // First hubs at 0.15 (spec), more join at 0.35, last hub lands by ~0.85.
      // Everything runs in parallel with the map wave so it reads as a
      // single global network activating, not a sequence.
      hubGroups.forEach((hub, i) => {
        const at = 0.15 + (0.55 * i) / Math.max(1, hubGroups.length - 1);
        tl.to(
          hub,
          {
            opacity: 1,
            scale: 1,
            duration: 0.24,
            ease: "back.out(1.5)",
            onStart: () => hub.classList.add("is-active"),
            onReverseComplete: () => hub.classList.remove("is-active"),
          },
          at
        );
      });

      // ---- ROUTES (0.35 → ~1.15s) ----
      // Progressive stroke-dashoffset draw with power2.out ease (spec).
      // Each route draws in 0.35s and routes stagger evenly across the
      // 0.35→0.80 window so the last stroke lands within the 1.2s budget.
      arcRefs.current.forEach((path, i) => {
        if (!path) return;
        const len = parseFloat(path.style.strokeDasharray) || 200;
        const at = 0.35 + (0.45 * i) / Math.max(1, arcRefs.current.length - 1);
        tl.fromTo(
          path,
          { strokeDashoffset: len, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          at
        );
      });

      // ---- STATUS COUNTERS ----
      // Tick counters based on active hub/arc classes as the timeline runs.
      tl.eventCallback("onUpdate", () => {
        if (statusHubsRef.current) {
          const active = hubGroups.filter((h) =>
            h.classList.contains("is-active")
          ).length;
          statusHubsRef.current.textContent = String(active).padStart(2, "0");
        }
        if (statusRoutesRef.current) {
          const drawn = arcRefs.current.filter(
            (p) => p && parseFloat(p.style.strokeDashoffset) < 1
          ).length;
          statusRoutesRef.current.textContent = String(drawn).padStart(2, "0");
        }
      });

      // ---- FINAL CAPTION (0.85 → ~1.05s) ----
      // Fades in near the end of the network formation so it reads as the
      // final piece landing, not a separate step after everything else.
      if (captionRef.current) {
        tl.to(
          captionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            ease: "power2.out",
          },
          0.85
        );
      }

      // -------------------------------------------------------------
      // AMBIENT: data-flow particles travelling along the routes.
      // Started via onComplete once the entry timeline finishes.
      // -------------------------------------------------------------
      function startParticleLoop() {
        const paths = arcRefs.current.filter(Boolean);
        const layer = particlesLayerRef.current;
        if (!layer || paths.length === 0) return;

        const SVG_NS = "http://www.w3.org/2000/svg";
        const PARTICLE_COUNT = 2;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const el = document.createElementNS(SVG_NS, "circle");
          el.setAttribute("r", "1.2");
          el.setAttribute("class", "ult-global-language-network__particle");
          el.setAttribute("opacity", "0");
          layer.appendChild(el);
          // Larger stagger between particles (1.2s * i) so at most one bead
          // is typically visible at a time — reinforces the "occasional
          // signal" feel rather than a busy stream.
          particleControllers.push(runParticle(el, i * 1.2));
        }

        function runParticle(el, delay) {
          const state = { alive: true };
          const tick = () => {
            if (!state.alive) return;
            const path = paths[Math.floor(Math.random() * paths.length)];
            if (!path) {
              state.tween = gsap.delayedCall(1, tick);
              return;
            }
            const len = path.getTotalLength();
            const p = { t: 0 };
            state.tween = gsap.to(p, {
              t: 1,
              duration: 2.2 + Math.random() * 1.3,
              delay,
              ease: "power1.inOut",
              onUpdate: () => {
                const pt = path.getPointAtLength(len * p.t);
                el.setAttribute("cx", pt.x);
                el.setAttribute("cy", pt.y);
                // Fade in for the first 12% of the run and out for the last 12%.
                const fadeIn = Math.min(1, p.t / 0.12);
                const fadeOut = Math.min(1, (1 - p.t) / 0.12);
                el.setAttribute(
                  "opacity",
                  String(Math.min(fadeIn, fadeOut))
                );
              },
              onComplete: () => {
                delay = 0.6 + Math.random() * 1.4;
                tick();
              },
            });
          };
          tick();
          return () => {
            state.alive = false;
            state.tween?.kill?.();
          };
        }
      }
    }, rootRef);

    return () => {
      particleControllers.forEach((cancel) => cancel && cancel());
      ctx.revert();
    };
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
          <ul className="ult-global-language-network__rail ult-global-language-network__rail--left" aria-label="Language coverage">
            <li className="ult-global-language-network__rail-title">LANGUAGE COVERAGE</li>
            {COVERAGE.map((item, i) => (
              <li
                key={item}
                className="ult-global-language-network__rail-item"
                ref={(el) => (langRefs.current[i] = el)}
              >
                <span className="ult-global-language-network__rail-marker" aria-hidden="true" />
                {item}
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

              {/* Active hub markers — glow disc + expanding ring + bright core dot */}
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
                      {/* Hub sizing note: the map SVG uses a small viewBox
                          (roughly ~150 units wide) rendered at ~900+ CSS px,
                          so each SVG unit maps to ~6–8 CSS px. Keep radii
                          fractional to stay in the 7–9px hub / ≤36px glow
                          spec range. */}
                      <circle
                        className="ult-global-language-network__hub-glow"
                        r="1.8"
                        ref={(el) => (hubGlowRefs.current[hub.id] = el)}
                      />
                      <circle className="ult-global-language-network__hub-ring" r="0" />
                      <circle className="ult-global-language-network__hub-dot" r="0.55" />
                    </g>
                  );
                })}
              </g>

              {/* Data-flow particles — small beads traveling along routes.
                  Dynamically populated by the animation useEffect below. */}
              <g
                className="ult-global-language-network__map-particles"
                ref={particlesLayerRef}
              />
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
