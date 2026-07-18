import { useEffect, useRef } from "react";

/**
 * Lightweight WebGL aurora — one fullscreen quad, cheap fragment shader.
 * Uses `ogl` (dynamically imported) so SSR skips it. Freezes on prefers-reduced-motion.
 */
export function AuroraCanvas({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      try {
        const { Renderer, Program, Mesh, Triangle } = await import("ogl");
        if (cancelled) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const renderer = new Renderer({
          alpha: true,
          antialias: false,
          dpr: Math.min(window.devicePixelRatio, 1.5),
        });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        const canvas = gl.canvas as HTMLCanvasElement;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        host.appendChild(canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
          vertex: /* glsl */ `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
              vUv = position * 0.5 + 0.5;
              gl_Position = vec4(position, 0.0, 1.0);
            }
          `,
          fragment: /* glsl */ `
            precision highp float;
            varying vec2 vUv;
            uniform float uTime;
            uniform vec2 uRes;
            uniform vec3 uA;
            uniform vec3 uB;
            uniform vec3 uC;

            // cheap 2d noise
            float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
            float noise(vec2 p) {
              vec2 i = floor(p); vec2 f = fract(p);
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
              vec2 uv = vUv;
              float t = uTime * 0.06;
              float n1 = noise(uv * 2.2 + vec2(t, -t * 0.7));
              float n2 = noise(uv * 3.4 - vec2(t * 0.5, t));
              float m1 = smoothstep(0.35, 0.85, n1);
              float m2 = smoothstep(0.25, 0.9, n2);
              vec3 col = mix(uA, uB, m1);
              col = mix(col, uC, m2 * 0.55);
              float vignette = smoothstep(1.1, 0.35, distance(uv, vec2(0.5)));
              gl_FragColor = vec4(col, 0.55 * vignette);
            }
          `,
          uniforms: {
            uTime: { value: 0 },
            uRes: { value: [1, 1] },
            uA: { value: [0.06, 0.24, 0.2] }, // deep emerald
            uB: { value: [0.83, 0.66, 0.38] }, // soft gold
            uC: { value: [0.98, 0.97, 0.94] }, // ivory highlight
          },
        });

        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
          const w = host.clientWidth || window.innerWidth;
          const h = host.clientHeight || window.innerHeight;
          renderer.setSize(w, h);
          program.uniforms.uRes.value = [w, h];
        };
        resize();
        window.addEventListener("resize", resize);

        let raf = 0;
        const start = performance.now();
        const loop = (t: number) => {
          program.uniforms.uTime.value = (t - start) / 1000;
          renderer.render({ scene: mesh });
          if (!reduce) raf = requestAnimationFrame(loop);
        };
        if (reduce) {
          renderer.render({ scene: mesh });
        } else {
          raf = requestAnimationFrame(loop);
        }

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", resize);
          canvas.remove();
        };
      } catch {
        /* no-op — CSS gradient fallback shows through */
      }
    };

    const schedule =
      "requestIdleCallback" in window
        ? (cb: () => void) =>
            (
              window as unknown as { requestIdleCallback: (cb: () => void) => number }
            ).requestIdleCallback(cb)
        : (cb: () => void) => window.setTimeout(cb, 40);
    schedule(() => {
      void start();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={
        "pointer-events-none absolute inset-0 overflow-hidden " +
        // CSS gradient fallback — always visible under the canvas
        "bg-[radial-gradient(120%_80%_at_20%_10%,color-mix(in_oklab,var(--emerald)_35%,transparent),transparent_60%),radial-gradient(90%_70%_at_85%_90%,color-mix(in_oklab,var(--gold)_35%,transparent),transparent_60%)] " +
        className
      }
      ref={hostRef}
    />
  );
}
