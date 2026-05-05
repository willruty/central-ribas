import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  /** When true, plays the GSAP entrance timeline (use only on the Login screen). */
  animate?: boolean;
}

/**
 * SVG logo component — Ribas mark + wordmark.
 * `collapsed` → shows only the R mark icon (narrow sidebar).
 * `animate`   → plays the GSAP entrance timeline (Login only).
 */
const Logo = ({ collapsed = false, className = "", animate = false }: LogoProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!animate || !svgRef.current) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        // 1. Three stripes scale up from bottom, one by one
        .from(".logo-stripe", {
          scaleY: 0,
          transformOrigin: "bottom center",
          duration: 0.55,
          stagger: 0.09,
        })
        // 2. R bowl + leg slide in and fade
        .from(
          ".logo-r-bowl, .logo-r-leg",
          { opacity: 0, x: -8, duration: 0.4 },
          "-=0.2"
        )
        // 3. Wordmark "RIBAS" fades in last
        .from(
          ".logo-wordmark",
          { opacity: 0, x: -10, duration: 0.35 },
          "-=0.15"
        );
    },
    { scope: svgRef, dependencies: [animate] }
  );

  return (
    <svg
      ref={svgRef}
      viewBox={collapsed ? "0 0 90 72" : "0 0 216 72"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ribas"
      role="img"
    >
      <defs>
        <linearGradient id="ribas-mark" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%"   stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="ribas-text" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>

      {/* ── Three diagonal wing stripes ─────────────────────── */}
      <polygon className="logo-stripe" points="0,64  11,64  22,8  11,8"  fill="url(#ribas-mark)" />
      <polygon className="logo-stripe" points="14,64 25,64  36,8  25,8"  fill="url(#ribas-mark)" />
      <polygon className="logo-stripe" points="28,64 39,64  50,8  39,8"  fill="url(#ribas-mark)" />

      {/* ── R letterform ────────────────────────────────────── */}
      <path
        className="logo-r-bowl"
        fillRule="evenodd"
        d="M 50,8 H 66 C 79,8 88,17 88,30 C 88,43 79,52 66,52 H 50 V 42 H 64 C 72,42 77,37 77,30 C 77,23 72,18 64,18 H 50 Z"
        fill="url(#ribas-mark)"
      />
      <path
        className="logo-r-leg"
        d="M 50,52 L 80,64 H 68 L 50,57 Z"
        fill="url(#ribas-mark)"
      />

      {/* ── Wordmark ─────────────────────────────────────────── */}
      {!collapsed && (
        <text
          className="logo-wordmark"
          x="100"
          y="44"
          fontFamily="'Inter', 'Sora', sans-serif"
          fontWeight="700"
          fontSize="25"
          letterSpacing="6"
          fill="url(#ribas-text)"
        >
          RIBAS
        </text>
      )}
    </svg>
  );
};

export default Logo;
