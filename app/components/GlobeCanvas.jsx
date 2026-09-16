"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { feature as topoFeature } from "topojson-client";
import worldLand from "world-atlas/land-50m.json";

const LAND_FEATURES = topoFeature(worldLand, worldLand.objects.land);

// Cached unit-sphere land positions + per-point jitter (computed once, reused).
let LAND_POSITIONS = null;
let LAND_JITTER = null;

// Rasterize real land polygons onto an offscreen canvas, sample land pixels
// with sub-pixel jitter and latitude weighting, then convert to unit-sphere
// xyz coordinates so the same points can be uploaded to a WebGL buffer.
function buildLand() {
  if (LAND_POSITIONS) return;
  const W = 1200;
  const H = 600;
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d", { willReadFrequently: true });
  octx.fillStyle = "#ffffff";

  const features = LAND_FEATURES.features ?? [LAND_FEATURES];
  for (const feat of features) {
    const geom = feat.geometry;
    if (!geom) continue;
    const polys =
      geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
    for (const poly of polys) {
      for (const ring of poly) {
        octx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const lon = ring[i][0];
          const lat = ring[i][1];
          const x = ((lon + 180) / 360) * W;
          const y = ((90 - lat) / 180) * H;
          if (i === 0) octx.moveTo(x, y);
          else octx.lineTo(x, y);
        }
        octx.closePath();
        octx.fill();
      }
    }
  }

  const { data } = octx.getImageData(0, 0, W, H);
  const pos = [];
  const jit = [];
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) | 0;
    return ((seed >>> 0) % 1000000) / 1000000;
  };
  const emitProb = 0.16;

  for (let y = 0; y < H; y++) {
    const lat = 90 - (y / H) * 180;
    const latWeight = Math.cos((lat * Math.PI) / 180);
    if (latWeight < 0.08) continue;
    const localProb = emitProb * Math.max(0.35, latWeight);
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] < 128) continue;
      if (rand() > localProb) continue;
      const jx = x + rand();
      const jy = y + rand();
      const lon = (jx / W) * 360 - 180;
      const dotLat = 90 - (jy / H) * 180;
      const la = (dotLat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      const cosLa = Math.cos(la);
      pos.push(cosLa * Math.sin(lo));
      pos.push(Math.sin(la));
      pos.push(cosLa * Math.cos(lo));
      jit.push(rand());
    }
  }
  LAND_POSITIONS = new Float32Array(pos);
  LAND_JITTER = new Float32Array(jit);
}

// Logistics hubs highlighted on the globe.
// Balanced global logistics network — 27 cities spanning Asia, Middle East,
// Africa, Europe, Americas and Oceania. Each entry: [NAME, lat, lon].
const CITIES = [
  // Asia + Oceania
  ["CHINA", 34.5, 108.5], // 0
  ["JAPAN", 36.2, 138.2], // 1
  ["HONG KONG", 22.3, 114.2], // 2
  ["THAILAND", 15.9, 100.9], // 3
  ["SINGAPORE", 1.35, 103.8], // 4
  ["INDIA", 20.6, 78.9], // 5
  ["AUSTRALIA", -25.3, 133.8], // 6
  // Middle East + Africa
  ["UAE", 24.4, 54.0], // 7
  ["SAUDI ARABIA", 23.9, 45.1], // 8
  ["QATAR", 25.4, 51.2], // 9
  ["ISRAEL", 31.0, 34.9], // 10
  ["EGYPT", 26.8, 30.8], // 11
  ["KENYA", -0.02, 37.9], // 12
  ["SOUTH AFRICA", -30.6, 22.9], // 13
  // Europe
  ["TURKEY", 39.0, 35.2], // 14
  ["ITALY", 42.5, 12.5], // 15
  ["SPAIN", 40.0, -3.7], // 16
  ["FRANCE", 46.2, 2.2], // 17
  ["GERMANY", 51.2, 10.5], // 18
  ["UK", 55.4, -3.4], // 19
  // Americas
  ["USA", 39.8, -98.6], // 20
  ["CANADA", 56.1, -106.3], // 21
  ["MEXICO", 23.6, -102.5], // 22
  ["COLOMBIA", 4.6, -74.1], // 23
  ["BRAZIL", -14.2, -51.9], // 24
  ["ARGENTINA", -38.4, -63.6], // 25
  ["CHILE", -35.7, -71.5], // 26
];

// Each entry is an INDEPENDENT two-city arc (not a shared polyline). Chosen
// so every listed city participates in at least one route — no orphan tags.
const CONNECTIONS = [
  // Asia + Oceania cluster
  [0, 1], // China -> Japan
  [0, 2], // China -> Hong Kong
  [2, 3], // Hong Kong -> Thailand
  [3, 4], // Thailand -> Singapore
  [4, 6], // Singapore -> Australia
  [5, 0], // India -> China
  [5, 3], // India -> Thailand
  // Middle East cluster
  [5, 7], // India -> UAE
  [7, 8], // UAE -> Saudi Arabia
  [7, 9], // UAE -> Qatar
  [8, 10], // Saudi Arabia -> Israel
  [8, 11], // Saudi Arabia -> Egypt
  // Africa cluster
  [11, 12], // Egypt -> Kenya
  [12, 13], // Kenya -> South Africa
  // Middle East ↔ Europe
  [11, 14], // Egypt -> Turkey
  [14, 18], // Turkey -> Germany
  // Europe cluster
  [15, 17], // Italy -> France
  [17, 18], // France -> Germany
  [18, 19], // Germany -> UK
  [16, 15], // Spain -> Italy
  [16, 19], // Spain -> UK
  // Transatlantic
  [19, 20], // UK -> USA
  // Americas cluster
  [20, 21], // USA -> Canada
  [20, 22], // USA -> Mexico
  [22, 23], // Mexico -> Colombia
  [23, 24], // Colombia -> Brazil
  [24, 25], // Brazil -> Argentina
  [25, 26], // Argentina -> Chile
];

const latLonToVec3 = (lat, lon, r = 1) => {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(la) * Math.sin(lo),
    r * Math.sin(la),
    r * Math.cos(la) * Math.cos(lo)
  );
};

// Custom Curve subclass — returns EXACT spherical-linear-interpolation
// (SLERP) result at every t. Feeding it to TubeGeometry produces a tube
// that follows the great-circle path between two endpoints at constant
// radius, with no smoothing/overshoot artifacts (which CatmullRomCurve3
// can introduce when given a densely-sampled input).
class GreatCircleCurve extends THREE.Curve {
  constructor(startVec, endVec, radius) {
    super();
    this.a = startVec.clone().normalize();
    this.b = endVec.clone().normalize();
    this.radius = radius;
    const dot = Math.max(-1, Math.min(1, this.a.dot(this.b)));
    this.angle = Math.acos(dot);
    this.sinA = Math.sin(this.angle);
  }
  getPoint(t, target = new THREE.Vector3()) {
    if (this.sinA < 1e-6) {
      // Endpoints too close for SLERP — fall back to linear.
      target
        .copy(this.a)
        .lerp(this.b, t)
        .multiplyScalar(this.radius);
    } else {
      const w1 = Math.sin((1 - t) * this.angle) / this.sinA;
      const w2 = Math.sin(t * this.angle) / this.sinA;
      target.set(
        (this.a.x * w1 + this.b.x * w2) * this.radius,
        (this.a.y * w1 + this.b.y * w2) * this.radius,
        (this.a.z * w1 + this.b.z * w2) * this.radius
      );
    }
    return target;
  }
}

export default function GlobeCanvas() {
  const containerRef = useRef(null);
  const labelsRef = useRef(null);

  useEffect(() => {
    buildLand();

    const container = containerRef.current;
    const labelsLayer = labelsRef.current;
    if (!container || !labelsLayer) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(dpr);
    let rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      32,
      rect.width / Math.max(rect.height, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 3.6);

    // ── GlobeGroup — everything below rotates together ───────────────────
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = (14 * Math.PI) / 180; // axial tilt
    // Starting yaw so the East-Asia region (China/Hong Kong/Thailand/Singapore/
    // Japan/Australia) faces the camera on first paint. Rotation slowly carries
    // other hubs into view.
    globeGroup.rotation.y = -2.0;
    scene.add(globeGroup);

    // 1) Earth — near-black sphere with DIRECTIONAL FRESNEL lighting built
    //    directly into its own shader. Orange from world +Y illuminates the
    //    upper hemisphere; blue from world -Y illuminates the lower. The
    //    Fresnel term concentrates each color at the silhouette rim so the
    //    sphere reads as "lit from above/below" instead of "encircled by a
    //    colored ring". This IS the atmosphere — no separate shell needed.
    const earthGeom = new THREE.SphereGeometry(1, 128, 128);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        uCore: { value: new THREE.Color("#03060e") },
        uOrange: { value: new THREE.Color(1.0, 0.42, 0.13) },
        uBlue: { value: new THREE.Color(0.09, 0.36, 1.0) },
        uOMul: { value: 0.85 },
        uBMul: { value: 1.15 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uCore;
        uniform vec3 uOrange;
        uniform vec3 uBlue;
        uniform float uOMul;
        uniform float uBMul;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;
        void main() {
          float ndv = max(dot(vNormalW, vViewDir), 0.0);
          vec3 base = uCore * pow(ndv, 1.2);

          // Softened Fresnel (power 1.5) so orange/blue extend gently into
          // the sphere instead of clipping to a sharp rim ring.
          float fres = 1.0 - ndv;
          fres = pow(fres, 1.5);

          // Directional mask — world-space Y decides top/bottom.
          float ny = vWorldPos.y;
          float upperMask = smoothstep(-0.15, 0.85, ny);
          float lowerMask = smoothstep(0.15, -0.85, ny);

          // 1) RIM atmosphere (Fresnel-weighted).
          vec3 col = base;
          col += uOrange * fres * upperMask * uOMul;
          col += uBlue * fres * lowerMask * uBMul;

          // 2) BODY illumination — subtle non-Fresnel term so the orange
          //    warms the upper hemisphere and the blue lights the lower
          //    hemisphere across the whole sphere face, not just at the rim.
          //    Weighted by ndv^1.4 so it fades at the horizon.
          float bodyLit = pow(ndv, 1.4);
          float upperBody = smoothstep(-0.35, 0.95, ny) * bodyLit;
          float lowerBody = smoothstep(0.35, -0.95, ny) * bodyLit;
          col += uOrange * upperBody * 0.09;
          col += uBlue * lowerBody * 0.22;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    globeGroup.add(earth);

    // 2) Land points — dot cloud from real polygon rasterization, shaded
    //    front-to-back so continents feel like they wrap around the sphere.
    const displaced = new Float32Array(LAND_POSITIONS.length);
    for (let i = 0; i < LAND_POSITIONS.length; i++) {
      displaced[i] = LAND_POSITIONS[i] * 1.003;
    }
    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute("position", new THREE.BufferAttribute(displaced, 3));
    pointsGeom.setAttribute("aJitter", new THREE.BufferAttribute(LAND_JITTER, 1));

    const pointsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uColor: { value: new THREE.Color("#dde3ef") },
        uSize: { value: 1.35 * dpr },
      },
      vertexShader: /* glsl */ `
        uniform float uSize;
        attribute float aJitter;
        varying float vDepth;
        varying float vJitter;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 nrm = normalize(mat3(modelMatrix) * normalize(position));
          vec3 vd = normalize(cameraPosition - wp.xyz);
          vDepth = dot(nrm, vd);
          vJitter = aJitter;
          gl_Position = projectionMatrix * viewMatrix * wp;
          gl_PointSize = uSize;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vDepth;
        varying float vJitter;
        void main() {
          if (vDepth < 0.02) discard;
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          // Steeper depth gradient — front dots read as bright ~0.85-1.0,
          // side ~0.35-0.55, back ~0.07-0.15. Meets user's readability target.
          float depthAlpha = smoothstep(0.02, 0.8, vDepth);
          float a = (0.08 + depthAlpha * 0.95) * (0.7 + vJitter * 0.35);
          a *= smoothstep(0.50, 0.22, d);
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });
    const landPoints = new THREE.Points(pointsGeom, pointsMat);
    globeGroup.add(landPoints);

    // No separate atmosphere shell. The Earth's own fragment shader (above)
    // handles the orange/blue rim illumination directly on the sphere surface
    // via a Fresnel + directional-mask term. Adding another sphere here made
    // the composition read as "dark globe + colored halo globe", exactly the
    // outer-glow / second-sphere artifact we needed to eliminate.

    // 4) City markers — tiny orange bloom points on the front hemisphere.
    const markerMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(1.0, 0.55, 0.2) },
        uSize: { value: 8.0 * dpr },
      },
      vertexShader: /* glsl */ `
        uniform float uSize;
        varying float vDepth;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 nrm = normalize(mat3(modelMatrix) * normalize(position));
          vec3 vd = normalize(cameraPosition - wp.xyz);
          vDepth = dot(nrm, vd);
          gl_Position = projectionMatrix * viewMatrix * wp;
          gl_PointSize = uSize;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vDepth;
        void main() {
          if (vDepth < 0.05) discard;
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          // Bright core + soft halo.
          float core = smoothstep(0.18, 0.0, d);
          float halo = smoothstep(0.5, 0.15, d);
          float a = (core * 0.95 + halo * 0.35) * smoothstep(0.05, 0.3, vDepth);
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });
    const markerPositions = new Float32Array(CITIES.length * 3);
    const cityAnchors = [];
    CITIES.forEach(([name, lat, lon], idx) => {
      const p = latLonToVec3(lat, lon, 1.01);
      markerPositions[idx * 3 + 0] = p.x;
      markerPositions[idx * 3 + 1] = p.y;
      markerPositions[idx * 3 + 2] = p.z;
      cityAnchors.push({ name, local: p });
    });
    const markerGeom = new THREE.BufferGeometry();
    markerGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(markerPositions, 3)
    );
    const markers = new THREE.Points(markerGeom, markerMat);
    globeGroup.add(markers);

    // 5) Routes — pure GREAT-CIRCLE SLERP at a fixed radius (1.012, ~1.2%
    //    above the sphere). No lifted midpoint / no Bezier ballooning; each
    //    route hugs the spherical surface exactly like a real flight path
    //    printed onto the globe. Rendered as thin TubeGeometry so the arc
    //    has visible thickness at any camera angle. Progressive-draw
    //    animation (start → end, hold, fade, wait) staggered per route.
    // 5) Routes — TWO-PASS rendering per route so the line reads CRISP with
    //    a subtle luminous halo, not a thick fuzzy tube:
    //      pass 1 (glow): wide tube, low alpha, soft warm orange — bloom
    //      pass 2 (core): very thin tube, high alpha, vivid orange — sharp
    //    Both share the same GreatCircleCurve so they animate in lockstep.
    //    Additive blending sums the two additively — the core sits on top of
    //    the glow because it's added second (renderOrder tie-broken by add
    //    order for additive-blended transparent meshes).
    const routes = [];
    const ROUTE_RADIUS = 1.008;
    const routeVertex = /* glsl */ `
      varying vec2 vUv;
      varying float vDepth;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vec3 nrm = normalize(wp.xyz);
        vec3 vd = normalize(cameraPosition - wp.xyz);
        vDepth = dot(nrm, vd);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `;

    CONNECTIONS.forEach(([i, j], idx) => {
      const a = latLonToVec3(CITIES[i][1], CITIES[i][2], 1);
      const b = latLonToVec3(CITIES[j][1], CITIES[j][2], 1);
      const curve = new GreatCircleCurve(a, b, ROUTE_RADIUS);

      // Pass 1 — soft outer glow
      const glowGeo = new THREE.TubeGeometry(curve, 96, 0.007, 8, false);
      const glowMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(1.0, 0.55, 0.16) },
          uDrawProgress: { value: 0 },
          uOpacity: { value: 0 },
        },
        vertexShader: routeVertex,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uDrawProgress;
          uniform float uOpacity;
          varying vec2 vUv;
          varying float vDepth;
          void main() {
            if (vDepth < -0.02) discard;
            if (vUv.y > uDrawProgress) discard;
            float depthMask = smoothstep(-0.02, 0.25, vDepth);
            float baseA = 0.16;
            float a = baseA * depthMask * uOpacity;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      globeGroup.add(glowMesh);

      // Pass 2 — sharp vivid core, added AFTER the glow so it sits on top
      const coreGeo = new THREE.TubeGeometry(curve, 96, 0.0018, 6, false);
      const coreMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(1.0, 0.48, 0.0) },
          uDrawProgress: { value: 0 },
          uOpacity: { value: 0 },
        },
        vertexShader: routeVertex,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uDrawProgress;
          uniform float uOpacity;
          varying vec2 vUv;
          varying float vDepth;
          void main() {
            if (vDepth < -0.02) discard;
            if (vUv.y > uDrawProgress) discard;
            float depthMask = smoothstep(-0.02, 0.25, vDepth);
            // Bright leading head at the drawing front-line.
            float head = smoothstep(0.03, 0.0, uDrawProgress - vUv.y);
            float baseA = 0.85;
            float a = min(1.0, baseA + head * 0.55) * depthMask * uOpacity;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      globeGroup.add(coreMesh);

      // Stagger per-route phase so all routes don't draw simultaneously.
      routes.push({
        coreMat,
        glowMat,
        coreGeo,
        glowGeo,
        phaseOffset: idx * 0.55,
      });
    });

    // 6) Labels — HTML overlays projected each frame; hidden when behind.
    labelsLayer.innerHTML = "";
    const labelEls = cityAnchors.map(({ name }) => {
      const el = document.createElement("div");
      el.className = "globe-label";
      el.textContent = name;
      el.style.opacity = "0";
      labelsLayer.appendChild(el);
      return el;
    });

    // ── Animation loop ───────────────────────────────────────────────────
    let last = performance.now();
    let rafId = 0;
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);

    const tmpVec = new THREE.Vector3();

    const animate = (now) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (visible) {
        // ~35 seconds per full revolution (2π / 0.00018 ≈ 35s) — sped up
        // ~2.25× from the previous 0.00008 idle rate.
        globeGroup.rotation.y += 0.00018 * dt;
      }
      // Progressive-draw animation per route — cycle 5s, ~1.75s to draw.
      //  0.00-0.35  : draw from A to B (uDrawProgress 0 -> 1)
      //  0.35-0.65  : hold fully drawn at opacity 1
      //  0.65-0.85  : fade out uOpacity 1 -> 0
      //  0.85-1.00  : off, waiting for next cycle
      const CYCLE = 5.0;
      const nowS = now * 0.001;
      for (const r of routes) {
        const t = ((nowS + r.phaseOffset) % CYCLE) / CYCLE;
        let draw = 0;
        let opa = 0;
        if (t < 0.35) {
          draw = t / 0.35;
          opa = 1.0;
        } else if (t < 0.65) {
          draw = 1.0;
          opa = 1.0;
        } else if (t < 0.85) {
          draw = 1.0;
          opa = 1.0 - (t - 0.65) / 0.2;
        }
        r.coreMat.uniforms.uDrawProgress.value = draw;
        r.coreMat.uniforms.uOpacity.value = opa;
        r.glowMat.uniforms.uDrawProgress.value = draw;
        r.glowMat.uniforms.uOpacity.value = opa;
      }

      renderer.render(scene, camera);

      // Update label positions & visibility.
      const r = container.getBoundingClientRect();
      const halfW = r.width / 2;
      const halfH = r.height / 2;
      cityAnchors.forEach((anchor, idx) => {
        // World position of the anchor (globe group rotation baked in).
        tmpVec.copy(anchor.local).applyMatrix4(globeGroup.matrixWorld);
        const worldNormal = tmpVec.clone().normalize();
        const viewDir = camera.position.clone().sub(tmpVec).normalize();
        const depth = worldNormal.dot(viewDir);
        const el = labelEls[idx];
        // Hide only when the anchor has clearly swung past the horizon so
        // front-facing labels stay fully readable. Fade smoothly on the sides.
        if (depth < 0.22) {
          el.style.opacity = "0";
          return;
        }
        tmpVec.project(camera);
        const sx = tmpVec.x * halfW + halfW;
        const sy = -tmpVec.y * halfH + halfH;
        // Reach full opacity by depth 0.55 so front labels are unmistakably
        // visible; still fade in from horizon.
        const emphasis = Math.min(1, (depth - 0.22) / 0.33);
        el.style.opacity = String(emphasis);
        el.style.transform = `translate3d(${(sx + 12).toFixed(1)}px, ${(sy - 26).toFixed(1)}px, 0)`;
      });

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ── Resize handler ───────────────────────────────────────────────────
    const onResize = () => {
      rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      earthGeom.dispose();
      earthMat.dispose();
      pointsGeom.dispose();
      pointsMat.dispose();
      markerGeom.dispose();
      markerMat.dispose();
      for (const r of routes) {
        r.coreGeo.dispose();
        r.coreMat.dispose();
        r.glowGeo.dispose();
        r.glowMat.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      labelsLayer.innerHTML = "";
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      />
      <div
        ref={labelsRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
