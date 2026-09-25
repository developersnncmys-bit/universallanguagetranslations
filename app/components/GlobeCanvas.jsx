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
  const emitProb = 0.1;

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
// Abstract communication hubs â€” 27 anchor points distributed across the
// globe. Names are internal identifiers used only by the CONNECTIONS graph
// (routes are drawn between indices); NO labels ever render, so the visual
// stays language-neutral. Every entry: [NAME, lat, lon]. Do NOT add a 4th
// language field here â€” the client wants the globe to represent ALL
// languages equally through abstraction, not visually prioritize any few.
const CITIES = [
  // Asia + Oceania
  ["APAC-1", 34.5, 108.5], // 0
  ["APAC-2", 36.2, 138.2], // 1
  ["APAC-3", 22.3, 114.2], // 2
  ["APAC-4", 15.9, 100.9], // 3
  ["APAC-5", 1.35, 103.8], // 4
  ["APAC-6", 20.6, 78.9], // 5
  ["APAC-7", -25.3, 133.8], // 6
  // Middle East + Africa
  ["MEA-1", 24.4, 54.0], // 7
  ["MEA-2", 23.9, 45.1], // 8
  ["MEA-3", 25.4, 51.2], // 9
  ["MEA-4", 31.0, 34.9], // 10
  ["MEA-5", 26.8, 30.8], // 11
  ["MEA-6", -0.02, 37.9], // 12
  ["MEA-7", -30.6, 22.9], // 13
  // Europe
  ["EU-1", 39.0, 35.2], // 14
  ["EU-2", 42.5, 12.5], // 15
  ["EU-3", 40.0, -3.7], // 16
  ["EU-4", 46.2, 2.2], // 17
  ["EU-5", 51.2, 10.5], // 18
  ["EU-6", 55.4, -3.4], // 19
  // Americas
  ["AM-1", 39.8, -98.6], // 20
  ["AM-2", 56.1, -106.3], // 21
  ["AM-3", 23.6, -102.5], // 22
  ["AM-4", 4.6, -74.1], // 23
  ["AM-5", -14.2, -51.9], // 24
  ["AM-6", -38.4, -63.6], // 25
  ["AM-7", -35.7, -71.5], // 26
];

// Each entry is an INDEPENDENT two-city arc (not a shared polyline). Chosen
// so every listed city participates in at least one route â€” no orphan tags.
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
  // Middle East â†” Europe
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

// Custom Curve subclass â€” returns EXACT spherical-linear-interpolation
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
      // Endpoints too close for SLERP â€” fall back to linear.
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

    // â”€â”€ Renderer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // Load the Earth night-lights texture (Black Marble style) that powers
    // the photorealistic continent look. Drop the file at
    //   public/textures/earth_night.jpg
    // (Solar System Scope 2k_earth_nightmap.jpg works well â€” CC BY 4.0).
    const textureLoader = new THREE.TextureLoader();
    const nightTexture = textureLoader.load("/textures/earth_night.jpg");
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.wrapS = THREE.RepeatWrapping;
    nightTexture.wrapT = THREE.ClampToEdgeWrapping;
    nightTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    // FOV widened from 32Â° â†’ 38Â° so the sphere silhouette sits comfortably
    // inside the frustum with a ~10% margin. At FOV 32 the silhouette top
    // was landing at ~100.8% of frustum half-height on-axis, which clipped
    // the sphere's uppermost cap into a flat horizontal edge. The rest of
    // the scene (globe geometry, radii, land dots, waves, hubs) is
    // unchanged; only the camera framing gets more breathing room.
    const camera = new THREE.PerspectiveCamera(
      38,
      rect.width / Math.max(rect.height, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 3.6);

    // â”€â”€ GlobeGroup â€” everything below rotates together â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const globeGroup = new THREE.Group();
    // More pronounced tilt + diagonal roll so the sphere reads as a dynamic
    // 3D orb, not a flat circular Earth. Combined X + Z rotation gives the
    // "digital language orb" tilted-axis feel the redesign asks for.
    globeGroup.rotation.x = (23 * Math.PI) / 180;
    globeGroup.rotation.z = (8 * Math.PI) / 180;
    // Starting yaw so the East-Asia region (China/Hong Kong/Thailand/Singapore/
    // Japan/Australia) faces the camera on first paint. Rotation slowly carries
    // other hubs into view.
    globeGroup.rotation.y = -2.0;
    scene.add(globeGroup);

    // 0) Cosmic starfield â€” small distant stars distributed in a spherical
    //    shell around the globe. Ties the composition to the "Universal"
    //    part of the brand: the Earth sits inside a larger universe of
    //    languages, not on a black rectangle. Kept subtle so the Earth
    //    remains the main visual.
    {
      const STAR_COUNT = 320;
      const starPositions = new Float32Array(STAR_COUNT * 3);
      const starSizes = new Float32Array(STAR_COUNT);
      const starAlphas = new Float32Array(STAR_COUNT);
      const starSeeds = new Float32Array(STAR_COUNT);
      for (let i = 0; i < STAR_COUNT; i++) {
        // Uniform points on a sphere (Marsaglia method) â€” no polar bias.
        let u = Math.random() * 2 - 1;
        let phi = Math.random() * Math.PI * 2;
        let s = Math.sqrt(1 - u * u);
        // Shell radius well beyond the globe so stars read as a
        // background field, never inside/on the Earth.
        const r = 14 + Math.random() * 8;
        starPositions[i * 3 + 0] = r * s * Math.cos(phi);
        starPositions[i * 3 + 1] = r * s * Math.sin(phi);
        starPositions[i * 3 + 2] = r * u;
        // Size + alpha distribution: many faint tiny stars, few brighter.
        const b = Math.pow(Math.random(), 2.2);
        starSizes[i] = 0.6 + b * 2.6;
        starAlphas[i] = 0.25 + b * 0.75;
        starSeeds[i] = Math.random() * Math.PI * 2;
      }
      const starGeom = new THREE.BufferGeometry();
      starGeom.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
      );
      starGeom.setAttribute(
        "aSize",
        new THREE.BufferAttribute(starSizes, 1)
      );
      starGeom.setAttribute(
        "aAlpha",
        new THREE.BufferAttribute(starAlphas, 1)
      );
      starGeom.setAttribute(
        "aSeed",
        new THREE.BufferAttribute(starSeeds, 1)
      );
      const starMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          // Cool white-cyan star tint matches the atmospheric rim family.
          uColor: { value: new THREE.Color("#7fe4dc") },
          uWarm: { value: new THREE.Color("#D4EF8A") },
          uTime: { value: 0 },
          uDpr: { value: dpr },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uDpr;
          attribute float aSize;
          attribute float aAlpha;
          attribute float aSeed;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPos;
            // Subtle asynchronous twinkle â€” different phase per star.
            float twinkle = 0.75 + 0.25 * sin(uTime * 0.0012 + aSeed);
            vAlpha = aAlpha * twinkle;
            vSeed = aSeed;
            gl_PointSize = aSize * uDpr;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform vec3 uWarm;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;
            float core = smoothstep(0.50, 0.0, d);
            // Very rare warm star among the cool-white majority.
            vec3 col = mix(uColor, uWarm, step(6.10, vSeed));
            gl_FragColor = vec4(col, core * vAlpha);
          }
        `,
      });
      const stars = new THREE.Points(starGeom, starMat);
      scene.add(stars);
      // Hologram-dot aesthetic â€” pure black background, no starfield.
      stars.visible = false;
      // Expose to the animate loop so the twinkle uniform can be driven.
      scene.userData.stars = { mat: starMat, geom: starGeom };
    }

    // 1) Earth â€” dark-teal sphere with DIRECTIONAL FRESNEL lighting built
    //    directly into its own shader. Teal from world +Y illuminates the
    //    upper hemisphere; lime from world -Y illuminates the lower, with a
    //    very subtle warm accent baked into the mid-body. The Fresnel term
    //    concentrates each color at the silhouette rim so the sphere reads
    //    as "lit from above/below" instead of "encircled by a colored ring".
    //    This IS the atmosphere â€” no separate shell needed.
    //
    //    Palette (v2 â€” client language-brand): deep teal + turquoise + lime.
    const earthGeom = new THREE.SphereGeometry(1, 128, 128);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        // Very dark navy core so the dot cloud + rim colors dominate.
        uCore: { value: new THREE.Color("#032F38") },
        // Upper atmosphere â€” sky blue from the reference photo.
        uAtmoTop: { value: new THREE.Color("#0B8792") },
        // Lower atmosphere â€” grass green from the reference photo.
        uAtmoBot: { value: new THREE.Color("#B7E84B") },
        // Warm horizon reflection â€” orange sunset arc from the reference.
        uWarm: { value: new THREE.Color("#E9A45B") },
        uTopMul: { value: 1.15 },
        uBotMul: { value: 0.70 },
        uWarmMul: { value: 0.28 },
        uLowerFade: { value: 1.0 },
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
        uniform vec3 uAtmoTop;
        uniform vec3 uAtmoBot;
        uniform vec3 uWarm;
        uniform float uTopMul;
        uniform float uBotMul;
        uniform float uWarmMul;
        uniform float uLowerFade;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;
        void main() {
          float ndv = max(dot(vNormalW, vViewDir), 0.0);
          vec3 base = uCore * pow(ndv, 1.2);

          // Sharp Fresnel â€” concentrates the atmospheric glow at the
          // silhouette so the sphere reads with a bright cyan outline.
          float fres = 1.0 - ndv;
          fres = pow(fres, 2.6);

          float ny = vWorldPos.y;
          float upperMask = smoothstep(-0.4, 0.85, ny);
          float lowerMask = smoothstep(0.4, -0.85, ny);

          vec3 col = base;
          col += uAtmoTop * fres * upperMask * uTopMul;
          col += uAtmoBot * fres * lowerMask * uBotMul;

          float warmMask = fres * smoothstep(0.15, -0.55, ny);
          col += uWarm * warmMask * uWarmMul;

          float fadeWeight = smoothstep(0.55, -0.15, ny) * uLowerFade;
          col = mix(col, vec3(0.0), fadeWeight);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    globeGroup.add(earth);

    // 2) Land points â€” dot cloud from real polygon rasterization, shaded
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
      blending: THREE.AdditiveBlending,
      uniforms: {
        // Dimmed cyan continent dots â€” quieter, more atmospheric feel.
        uColor: { value: new THREE.Color("#35D9D0") },
        uColorBright: { value: new THREE.Color("#7fe4dc") },
        // Warm color unused in this palette (kept for shader compat).
        uWarm: { value: new THREE.Color("#35D9D0") },
        uSize: { value: 1.9 * dpr },
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
        uniform vec3 uColorBright;
        uniform vec3 uWarm;
        varying float vDepth;
        varying float vJitter;
        void main() {
          if (vDepth < 0.02) discard;
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          // Dimmed dots â€” lower baseline + gentler depth ramp so the
          // dot cloud sits quietly under the atmospheric rim rather
          // than dominating the composition.
          float depthAlpha = smoothstep(0.05, 0.85, vDepth);
          float sparkle = 0.85 + vJitter * 0.15;
          float a = (0.24 + depthAlpha * 0.85) * sparkle;
          a *= smoothstep(0.50, 0.15, d);
          // ~85% cyan base, ~15% brighter near-white sparkle highlights.
          vec3 col = mix(uColor, uColorBright, step(0.85, vJitter));
          gl_FragColor = vec4(col, a);
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

    // 4) Communication nodes â€” subtle cyan glowing points that pulse
    //    asynchronously. Each marker carries a random phase attribute so
    //    their brightness cycles independently, and their base size is
    //    smaller than before so they read as calm, premium nodes rather
    //    than bright bloom points.
    const markerMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        // Bright cyan communication hubs â€” prominent glowing nodes.
        uColor: { value: new THREE.Color("#7fe4dc") },
        uSize: { value: 9.0 * dpr },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        uniform float uSize;
        uniform float uTime;
        attribute float aPhase;
        attribute float aPulse;
        varying float vDepth;
        varying float vPulse;
        varying float vArrival;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 nrm = normalize(mat3(modelMatrix) * normalize(position));
          vec3 vd = normalize(cameraPosition - wp.xyz);
          vDepth = dot(nrm, vd);
          // Slow (~7s cycle) asynchronous idle "breathing" â€” each hub
          // gently expands and contracts on its own phase so the sphere
          // reads as populated with living communication nodes, not
          // static dots.
          float idle = 0.75 + 0.25 * sin(uTime * 0.00090 + aPhase);
          // Brief arrival ripple layered on top when a signal reaches
          // this node. aPulse decays from 1 â†’ 0 in the JS loop.
          float arrival = aPulse * 0.55;
          vPulse = idle;
          vArrival = arrival;
          gl_Position = projectionMatrix * viewMatrix * wp;
          gl_PointSize = uSize * (idle + arrival);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vDepth;
        varying float vPulse;
        varying float vArrival;
        void main() {
          if (vDepth < 0.05) discard;
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          // Three concentric zones â€” bright center + medium glow + soft
          // outer halo â€” so each hub reads as center Â· glow Â· halo.
          float core = smoothstep(0.14, 0.0, d);
          float glow = smoothstep(0.32, 0.10, d);
          float halo = smoothstep(0.50, 0.28, d);
          float depthFade = smoothstep(0.05, 0.3, vDepth);
          float baseA = (core * 0.95 + glow * 0.40 + halo * 0.18) *
                        depthFade * vPulse;
          // Arrival ripple: expanding halo during the pulse decay.
          float rippleA = (glow * 0.45 + halo * 0.55) *
                          vArrival * depthFade;
          gl_FragColor = vec4(uColor, baseA + rippleA);
        }
      `,
    });
    // Nodes are ONLY placed at route endpoints so every route visibly
    // begins and ends at a communication node â€” no floating routes.
    // ROUTES is defined below, so we derive endpoint indices here.
    // Since ROUTES is a const declared later in the same scope, we
    // scan it forward at initialisation time.
    // 9 communication hubs â€” every hub is an endpoint of at least one
    // route, no floating hubs. Positions deterministic from CITIES lat/lon.
    const NODE_CITY_INDICES = [
      0,  // China
      1,  // Japan
      5,  // India
      7,  // UAE
      14, // Turkey
      19, // British Isles
      20, // North America
      24, // Brazil
      13, // Southern Africa
    ];
    const NODE_COUNT = NODE_CITY_INDICES.length;
    const markerPositions = new Float32Array(NODE_COUNT * 3);
    const markerPhases = new Float32Array(NODE_COUNT);
    // Dynamic arrival-pulse energy per node (0..1) â€” briefly boosted when
    // a signal particle arrives, then decays each frame.
    const markerPulses = new Float32Array(NODE_COUNT);
    const cityAnchors = [];
    // Map city index â†’ node index for particle-arrival lookups.
    const cityToNodeIndex = new Map();
    NODE_CITY_INDICES.forEach((cityIdx, ni) => {
      const [name, lat, lon, langs] = CITIES[cityIdx];
      const p = latLonToVec3(lat, lon, 1.01);
      markerPositions[ni * 3 + 0] = p.x;
      markerPositions[ni * 3 + 1] = p.y;
      markerPositions[ni * 3 + 2] = p.z;
      // Random phase per node so pulses stay asynchronous.
      markerPhases[ni] = Math.random() * Math.PI * 2;
      cityAnchors.push({ name, langs, local: p });
      cityToNodeIndex.set(cityIdx, ni);
    });
    const markerGeom = new THREE.BufferGeometry();
    markerGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(markerPositions, 3)
    );
    markerGeom.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(markerPhases, 1)
    );
    markerGeom.setAttribute(
      "aPulse",
      new THREE.BufferAttribute(markerPulses, 1)
    );
    const markers = new THREE.Points(markerGeom, markerMat);
    globeGroup.add(markers);
    // Hologram-dot aesthetic â€” hide the communication overlay.
    // Flip to true to bring the hub network back.
    markers.visible = false;

    // 5) Communication routes â€” one QuadraticBezierCurve3 per HUBâ†’HUB
    //    pair. Control point is the normalized midpoint pushed slightly
    //    outward from the sphere so the arc reads as a shallow surface
    //    path (not an orbit, not a straight line). Uses the same
    //    latLonToVec3 coordinate system as the geographic particles, so
    //    endpoints land exactly on the hub markers.

    // 11 communication routes â€” a denser mesh that reads as a truly
    // global communication network. Every route connects two rendered
    // hubs. Mix of short, medium and long paths.
    const ROUTES = [
      // East Asia + South Asia
      [0, 1],   // China â†” Japan          (short)
      [0, 5],   // China â†” India          (medium)
      // South Asia â†” Middle East â†” Europe
      [5, 7],   // India â†” UAE            (short)
      [7, 14],  // UAE â†” Turkey           (short)
      [14, 19], // Turkey â†” UK            (medium)
      // Transatlantic + Americas
      [19, 20], // UK â†” USA               (long)
      [20, 24], // USA â†” Brazil           (long)
      // Southern hemisphere + Africa loop
      [24, 13], // Brazil â†” S.Africa      (long)
      [7, 13],  // UAE â†” S.Africa         (long)
      // Extra cross-connectors for network density
      [1, 20],  // Japan â†” USA            (very long â€” trans-Pacific)
      [14, 24], // Turkey â†” Brazil        (long)
    ];

    const waveVertex = /* glsl */ `
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
    const waveFragment = /* glsl */ `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vDepth;
      void main() {
        // Fade around the silhouette so back-facing sections dim naturally.
        float depthMask = smoothstep(-0.15, 0.35, vDepth);
        vec3 col = mix(uColorA, uColorB, vUv.y);
        // Fade both tips so the arc doesn't clip abruptly at ends.
        float tipFade =
          smoothstep(0.0, 0.08, vUv.y) *
          smoothstep(1.0, 0.92, vUv.y);
        gl_FragColor = vec4(col, uOpacity * depthMask * tipFade);
      }
    `;

    // Route hub positions must match the marker positions exactly (same
    // radius, same latLonToVec3 helper). Markers sit at radius 1.01, so
    // curve endpoints do too â€” no visible gap between hub and route.
    const HUB_RADIUS = 1.01;
    const commWaves = ROUTES.map(([aIdx, bIdx]) => {
      const start = latLonToVec3(
        CITIES[aIdx][1],
        CITIES[aIdx][2],
        HUB_RADIUS
      );
      const end = latLonToVec3(
        CITIES[bIdx][1],
        CITIES[bIdx][2],
        HUB_RADIUS
      );
      // Control point: midpoint direction pushed outward. Lift scales
      // with the chord length so short hops stay flat and long hops
      // arc slightly higher â€” but never so high that they look orbital.
      const chord = start.distanceTo(end);
      const midRadius = HUB_RADIUS + Math.min(0.06, 0.09 * chord);
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .normalize()
        .multiplyScalar(midRadius);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      // Thin, smooth tube geometry â€” one clean line, no faceting.
      const geom = new THREE.TubeGeometry(curve, 96, 0.0038, 8, false);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColorA: { value: new THREE.Color("#35D9D0") }, // primary route
          uColorB: { value: new THREE.Color("#7fe4dc") }, // brighter end
          uOpacity: { value: 0.60 },
        },
        vertexShader: waveVertex,
        fragmentShader: waveFragment,
      });
      const mesh = new THREE.Mesh(geom, mat);
      globeGroup.add(mesh);
      // Hologram-dot aesthetic â€” hide route arcs.
      mesh.visible = false;
      return { curve, mesh, geom, mat };
    });

    // 5a) Signal particles â€” only a subset of routes (4 of them) carry a
    //     traveling signal. Concept: information moving between two points
    //     of the world. Kept intentionally low so the effect stays subtle.
    //     Selected routes span both clusters + the transatlantic connector
    //     + the southern regional edge, so activity is spatially spread.
    // Traveling signals â€” geographically spread across the network to
    // read as constant global information flow.
    //   0 = China â†” Japan      (short â€” East Asia)
    //   5 = UK â†” USA           (long transatlantic)
    //   6 = USA â†” Brazil       (long Americas)
    //   9 = Japan â†” USA        (long trans-Pacific)
    const SIGNAL_ROUTE_INDICES = [0, 5, 6, 9];
    const particleStates = SIGNAL_ROUTE_INDICES.map((waveIdx) => ({
      wave: waveIdx,
      t: Math.random(),
      prevT: 0,
    }));
    const particleCount = particleStates.length;
    const particlePositions = new Float32Array(particleCount * 3);
    // Per-particle progress along its route (0 â†’ 1) â€” drives a subtle
    // two-stage color transition inside the shader.
    const particleTs = new Float32Array(particleCount);
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeom.setAttribute(
      "aT",
      new THREE.BufferAttribute(particleTs, 1)
    );
    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        // Two-stage signal color: leaves origin as cyan, peaks white at
        // mid-flight, arrives as bright cyan.
        uColorA: { value: new THREE.Color("#0B8792") },
        uColorMid: { value: new THREE.Color("#FFFFFF") },
        uColorB: { value: new THREE.Color("#7fe4dc") },
        uSize: { value: 6.5 * dpr },
      },
      vertexShader: /* glsl */ `
        uniform float uSize;
        attribute float aT;
        varying float vDepth;
        varying float vT;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 nrm = normalize(wp.xyz);
          vec3 vd = normalize(cameraPosition - wp.xyz);
          vDepth = dot(nrm, vd);
          vT = aT;
          gl_Position = projectionMatrix * viewMatrix * wp;
          gl_PointSize = uSize;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorMid;
        uniform vec3 uColorB;
        varying float vDepth;
        varying float vT;
        void main() {
          if (vDepth < 0.0) discard;
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.2, 0.0, d);
          float halo = smoothstep(0.5, 0.15, d);
          float a = (core * 0.9 + halo * 0.35) * smoothstep(0.0, 0.3, vDepth);
          // A â†’ mid-white â†’ B along the route, symmetric peak at t=0.5.
          vec3 col;
          if (vT < 0.5) {
            col = mix(uColorA, uColorMid, smoothstep(0.0, 0.5, vT));
          } else {
            col = mix(uColorMid, uColorB, smoothstep(0.5, 1.0, vT));
          }
          gl_FragColor = vec4(col, a);
        }
      `,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    globeGroup.add(particles);
    // Hologram-dot aesthetic â€” hide traveling signal particles.
    particles.visible = false;

    // 6) Labels â€” HTML overlays projected each frame; hidden when behind.
    // Only cities with a `langs` string get a visible label. This keeps the
    // composition minimal (3â€“5 markers on screen at any time) and lets us
    // render a two-line name + languages layout for those we DO show.
    labelsLayer.innerHTML = "";
    const labelEls = cityAnchors.map(({ name, langs }) => {
      if (!langs) return null;
      const el = document.createElement("div");
      el.className = "globe-label";
      const nameEl = document.createElement("span");
      nameEl.className = "globe-label__name";
      nameEl.textContent = name;
      const langsEl = document.createElement("span");
      langsEl.className = "globe-label__langs";
      langsEl.textContent = langs;
      el.appendChild(nameEl);
      el.appendChild(langsEl);
      el.style.opacity = "0";
      labelsLayer.appendChild(el);
      return el;
    });

    // â”€â”€ Animation loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        // ~35 seconds per full revolution (2Ï€ / 0.00018 â‰ˆ 35s) â€” sped up
        // ~2.25Ã— from the previous 0.00008 idle rate.
        globeGroup.rotation.y += 0.00018 * dt;

        // Drive the marker pulse shader â€” asynchronous per-node phase in
        // the vertex shader modulates each node's size/alpha over time.
        markerMat.uniforms.uTime.value = now;

        // Drive the star twinkle if the cosmic starfield is present.
        if (scene.userData.stars) {
          scene.userData.stars.mat.uniforms.uTime.value = now;
        }

        // Decay any active arrival ripples on the node markers. Linear
        // decay ~2msâ»Â¹ so a full pulse fades over ~500ms.
        let pulsesDirty = false;
        for (let i = 0; i < markerPulses.length; i++) {
          if (markerPulses[i] > 0) {
            markerPulses[i] = Math.max(0, markerPulses[i] - 0.002 * dt);
            pulsesDirty = true;
          }
        }

        // Advance signal particles along their assigned route curves.
        // Slow enough to read as premium information flow.
        const posAttr = particleGeom.attributes.position;
        const tAttr = particleGeom.attributes.aT;
        const arr = posAttr.array;
        const tArr = tAttr.array;
        for (let i = 0; i < particleStates.length; i++) {
          const p = particleStates[i];
          p.t += 0.00007 * dt;
          if (p.t > 1) {
            // Signal reached the destination hub â†’ ripple that hub.
            const [, destCity] = ROUTES[p.wave];
            const nodeIdx = cityToNodeIndex.get(destCity);
            if (nodeIdx !== undefined) {
              markerPulses[nodeIdx] = 1.0;
              pulsesDirty = true;
            }
            p.t -= 1;
          }
          p.prevT = p.t;
          commWaves[p.wave].curve.getPoint(p.t, tmpVec);
          arr[i * 3 + 0] = tmpVec.x;
          arr[i * 3 + 1] = tmpVec.y;
          arr[i * 3 + 2] = tmpVec.z;
          tArr[i] = p.t;
        }
        posAttr.needsUpdate = true;
        tAttr.needsUpdate = true;
        if (pulsesDirty) markerGeom.attributes.aPulse.needsUpdate = true;
      }

      // Scroll-driven planetary-dome fade. At the top of the page, the
      // lower hemisphere blends fully to black so the sphere reads as a
      // dome emerging from darkness. As the user scrolls past ~15-45vh
      // the fade releases so the full sphere becomes visible in time for
      // the Hero timeline to translate it to the right.
      const vhForFade = window.innerHeight;
      const fadeStart = vhForFade * 0.15;
      const fadeEnd = vhForFade * 0.45;
      const fadeT = Math.max(
        0,
        Math.min(1, (window.scrollY - fadeStart) / (fadeEnd - fadeStart))
      );
      earthMat.uniforms.uLowerFade.value = 1 - fadeT;

      renderer.render(scene, camera);

      // Update label positions & visibility.
      const r = container.getBoundingClientRect();
      const halfW = r.width / 2;
      const halfH = r.height / 2;
      cityAnchors.forEach((anchor, idx) => {
        const el = labelEls[idx];
        // Skip cities without a rendered label (no `langs` metadata).
        if (!el) return;
        // World position of the anchor (globe group rotation baked in).
        tmpVec.copy(anchor.local).applyMatrix4(globeGroup.matrixWorld);
        const worldNormal = tmpVec.clone().normalize();
        const viewDir = camera.position.clone().sub(tmpVec).normalize();
        const depth = worldNormal.dot(viewDir);
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

    // â”€â”€ Resize handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const onResize = () => {
      rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // â”€â”€ Cleanup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      commWaves.forEach((w) => {
        w.geom.dispose();
        w.mat.dispose();
      });
      particleGeom.dispose();
      particleMat.dispose();
      if (scene.userData.stars) {
        scene.userData.stars.geom.dispose();
        scene.userData.stars.mat.dispose();
      }
      nightTexture.dispose();
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
