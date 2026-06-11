import * as THREE from "three";
import { NOISE_GLSL, PLANET_VERTEX } from "./chunks";
import { SUN_POSITION } from "@/lib/flight/path";

/**
 * Custom materials for the system. There are no shadow maps at this scale —
 * lighting truth comes from the day/night terminator in these shaders, all
 * keyed to the single sun. Ambient floor ~0.05 so night sides aren't void.
 */

const AMBIENT = 0.05;

export interface PlanetMaterialOptions {
  dayA: string; // bright surface tone
  dayB: string; // dark surface tone
  night?: string; // emissive night-side glow (circuit seams etc.)
  atmosphere: string;
  noiseScale?: number;
  circuit?: boolean; // Forge-9 emissive seams on the night side
  ice?: boolean; // Glacius subsurface fresnel tint
}

export function createPlanetMaterial(
  opts: PlanetMaterialOptions
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunPos: { value: SUN_POSITION.clone() },
      uDayA: { value: new THREE.Color(opts.dayA) },
      uDayB: { value: new THREE.Color(opts.dayB) },
      uNight: { value: new THREE.Color(opts.night ?? "#000000") },
      uAtmo: { value: new THREE.Color(opts.atmosphere) },
      uNoiseScale: { value: opts.noiseScale ?? 1.2 },
      uCircuit: { value: opts.circuit ? 1 : 0 },
      uIce: { value: opts.ice ? 1 : 0 },
      uTime: { value: 0 },
    },
    vertexShader: PLANET_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      uniform vec3 uDayA;
      uniform vec3 uDayB;
      uniform vec3 uNight;
      uniform vec3 uAtmo;
      uniform float uNoiseScale;
      uniform float uCircuit;
      uniform float uIce;
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec3 vObjPos;
      ${NOISE_GLSL}
      void main() {
        vec3 N = normalize(vNormal);
        vec3 L = normalize(uSunPos - vWorldPos);
        vec3 V = normalize(cameraPosition - vWorldPos);
        float ndl = dot(N, L);
        // Soft day/night terminator facing the sun. No ping-pong-ball planets.
        float day = smoothstep(-0.15, 0.25, ndl);
        float n = fbm(vObjPos * uNoiseScale);
        vec3 surface = mix(uDayB, uDayA, n);
        // Emissive seams along noise iso-contours (machine planet night side).
        float bands = fract(n * 9.0);
        float seam = smoothstep(0.46, 0.5, bands) - smoothstep(0.52, 0.56, bands);
        float pulse = 0.75 + 0.25 * sin(uTime * 1.4 + n * 20.0);
        vec3 circuitGlow = uNight * seam * pulse * uCircuit * (1.0 - day * 0.85);
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        // Ice: subsurface tint brightens the body via view-dependent scatter.
        surface = mix(surface, surface + uAtmo * 0.35, uIce * (0.4 + 0.6 * fresnel));
        vec3 color = surface * (${AMBIENT.toFixed(2)} + day * 1.12)
          + circuitGlow * 1.6
          + uAtmo * fresnel * (0.18 + 0.55 * day);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

export function createGasGiantMaterial(opts: {
  colorA: string;
  colorB: string;
  colorC: string;
  atmosphere: string;
  bandFreq?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunPos: { value: SUN_POSITION.clone() },
      uColorA: { value: new THREE.Color(opts.colorA) },
      uColorB: { value: new THREE.Color(opts.colorB) },
      uColorC: { value: new THREE.Color(opts.colorC) },
      uAtmo: { value: new THREE.Color(opts.atmosphere) },
      uBandFreq: { value: opts.bandFreq ?? 9 },
      uTime: { value: 0 },
    },
    vertexShader: PLANET_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform vec3 uAtmo;
      uniform float uBandFreq;
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec3 vObjPos;
      ${NOISE_GLSL}
      void main() {
        vec3 N = normalize(vNormal);
        vec3 L = normalize(uSunPos - vWorldPos);
        vec3 V = normalize(cameraPosition - vWorldPos);
        vec3 sp = normalize(vObjPos);
        float lon = atan(sp.z, sp.x);
        // Latitude bands warped by drifting fbm — Jupiter-ish flow.
        float warp = fbm(vec3(sp.y * 3.0, lon * 0.8 + uTime * 0.015, 2.7)) * 1.6;
        float band = sin(sp.y * uBandFreq + warp * 2.4);
        float detail = fbm(vec3(sp.y * 14.0, lon * 2.0 - uTime * 0.03, 5.1));
        vec3 surface = mix(uColorA, uColorB, band * 0.5 + 0.5);
        surface = mix(surface, uColorC, smoothstep(0.55, 0.95, detail));
        // The Great Spot — every respectable gas giant has a storm brand.
        vec2 spotUV = vec2(lon - 0.9, sp.y + 0.35);
        float spot = 1.0 - smoothstep(0.12, 0.35, length(spotUV * vec2(0.6, 1.6)));
        surface = mix(surface, uColorC * 1.25, spot * 0.8);
        float day = smoothstep(-0.15, 0.25, dot(N, L));
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        vec3 color = surface * (${AMBIENT.toFixed(2)} + day * 1.1)
          + uAtmo * fresnel * (0.2 + 0.6 * day);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

export function createSunMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: PLANET_VERTEX,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vObjPos;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      ${NOISE_GLSL}
      void main() {
        vec3 sp = normalize(vObjPos);
        float n = fbm(sp * 3.0 + vec3(uTime * 0.06));
        float cells = fbm(sp * 7.0 - vec3(0.0, uTime * 0.04, 0.0));
        vec3 hot = vec3(1.0, 0.93, 0.78);
        vec3 mid = vec3(1.0, 0.62, 0.18);
        vec3 cool = vec3(0.85, 0.3, 0.05);
        vec3 color = mix(cool, mid, smoothstep(0.3, 0.6, n));
        color = mix(color, hot, smoothstep(0.55, 0.8, cells));
        vec3 V = normalize(cameraPosition - vWorldPos);
        float limb = pow(max(dot(normalize(vNormal), V), 0.0), 0.6);
        // HDR output (>1) so only the sun and other hot things bloom.
        gl_FragColor = vec4(color * (1.6 + 1.4 * limb), 1.0);
      }
    `,
  });
}

/** Additive limb glow shell — slightly larger sphere, alpha peaks at the rim. */
export function createAtmosphereMaterial(color: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSunPos: { value: SUN_POSITION.clone() },
    },
    vertexShader: PLANET_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uSunPos;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec3 vObjPos;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        vec3 L = normalize(uSunPos - vWorldPos);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6);
        float sunlit = 0.25 + 0.75 * smoothstep(-0.3, 0.4, dot(N, L));
        gl_FragColor = vec4(uColor, rim * sunlit * 0.85);
      }
    `,
  });
}

/** Holographic backing for diegetic panels: scanlines + edge glow + flicker. */
export function createHologramMaterial(color: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uOpacity;
      varying vec2 vUv;
      ${NOISE_GLSL}
      void main() {
        float scan = 0.82 + 0.18 * sin(vUv.y * 140.0 + uTime * 7.0);
        vec2 d = min(vUv, 1.0 - vUv);
        float edge = 1.0 - smoothstep(0.0, 0.06, min(d.x, d.y));
        float flicker = 0.92 + 0.08 * step(0.5, hash31(vec3(floor(uTime * 24.0), 1.0, 2.0)));
        float body = 0.10 + edge * 0.5;
        gl_FragColor = vec4(uColor * (1.0 + edge * 1.2), body * scan * flicker * uOpacity);
      }
    `,
  });
}

/** Drifting cloud shell for Terra — fbm alpha, lit by the same terminator. */
export function createCloudMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uSunPos: { value: SUN_POSITION.clone() },
      uTime: { value: 0 },
    },
    vertexShader: PLANET_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec3 vObjPos;
      ${NOISE_GLSL}
      void main() {
        vec3 N = normalize(vNormal);
        vec3 L = normalize(uSunPos - vWorldPos);
        vec3 sp = normalize(vObjPos);
        float n = fbm(sp * 4.0 + vec3(uTime * 0.012, 0.0, uTime * 0.008));
        float clouds = smoothstep(0.52, 0.72, n);
        float day = smoothstep(-0.15, 0.25, dot(N, L));
        gl_FragColor = vec4(vec3(0.95), clouds * (0.06 + day * 0.6));
      }
    `,
  });
}

/** Full-screen wormhole tunnel: polar fbm cylinder with chromatic streaking. */
export function createWormholeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColorA: { value: new THREE.Color("#67e8f9") },
      uColorB: { value: new THREE.Color("#a78bfa") },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec2 vUv;
      ${NOISE_GLSL}
      #define TAU 6.2831853
      float tunnel(vec2 uv, float t, float seed) {
        // Periodic around the cylinder: sample fbm on a circle.
        vec2 dir = vec2(cos(uv.x * TAU), sin(uv.x * TAU));
        return fbm(vec3(dir * 1.6, uv.y * 5.0 - t * 2.8 + seed));
      }
      void main() {
        float t = uTime;
        // Per-channel offset = strong chromatic aberration inside the shader.
        float r = tunnel(vUv + vec2(0.008, 0.0), t, 0.0);
        float g = tunnel(vUv, t, 0.0);
        float b = tunnel(vUv - vec2(0.008, 0.0), t, 0.0);
        vec3 swirl = vec3(r, g, b);
        // Star streaks racing down the tube.
        float lane = hash31(vec3(floor(vUv.x * 90.0), 3.0, 7.0));
        float streak = pow(fract(vUv.y * 2.0 - t * (2.0 + lane * 3.0) + lane * 13.0), 18.0);
        vec3 color = mix(uColorB, uColorA, swirl.g) * (swirl * 1.4 + streak * 2.5);
        // Fade tube ends + radial pulse.
        float fade = smoothstep(0.0, 0.25, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));
        float pulse = 0.85 + 0.15 * sin(t * 9.0);
        gl_FragColor = vec4(color * 1.6, fade * pulse * uIntensity);
      }
    `,
  });
}
