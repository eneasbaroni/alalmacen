"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { TransitionRouter } from "next-transition-router";
import { animate } from "motion/react";
import { Navbar } from "@/components/layout";

// Constantes de configuración
const ANIMATION_CONFIG = {
  leave: {
    duration: 0.8,
    ease: [0.61, 1, 0.88, 1] as const,
  },
  enter: {
    duration: 0.8,
    ease: [0.33, 1, 0.68, 1] as const,
  },
  path: {
    duration: 0.85,
  },
  content: {
    duration: 0.7,
    delay: 0.2,
  },
} as const;

const CURVE_CONFIG = {
  desktop: {
    top: 0.8,
    bottom: 0.85,
  },
  mobile: {
    top: 0.25,
    bottom: 1.05,
  },
} as const;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const svg = useRef<SVGSVGElement>(null!);
  const path = useRef<SVGPathElement>(null!);
  const content = useRef<HTMLDivElement>(null!);

  const [viewport, setViewport] = useState({
    height: 0,
    width: 0,
    topCurve: 0,
    bottomCurve: 0,
  });

  const { height: DH, width: DW, topCurve, bottomCurve } = viewport;

  // Memoizar los paths SVG para evitar recalcularlos
  const svgPaths = useMemo(() => {
    if (DH === 0 || DW === 0) return null;

    return {
      initial: `M 0 ${DH * 1.15} Q ${DW / 2} ${DH * 1.15} ${DW} ${
        DH * 1.15
      } L ${DW} ${DH * 1.15} Q ${DW / 2} ${DH * 1.15} 0 ${DH * 1.15} L 0 ${
        DH * 1.15
      }`,
      leaveStart: `M 0 ${topCurve} Q ${DW / 2} 0 ${DW} ${topCurve} L ${DW} ${
        DH * 1.15
      } Q ${DW / 2} ${bottomCurve} 0 ${DH * 1.15} L 0 ${DH * 0.3}`,
      leaveEnd: `M 0 0 Q ${DW / 2} 0 ${DW} 0 L ${DW} ${DH * 1.15} Q ${
        DW / 2
      } ${bottomCurve} 0 ${DH * 1.15} L 0 0`,
      enterStart: `M 0 0 Q ${DW / 2} 0 ${DW} 0 L ${DW} ${DH * 1.15} Q ${
        DW / 2
      } ${bottomCurve} 0 ${DH * 1.15} L 0 0`,
      enterEnd: `M 0 0 Q ${DW / 2} 0 ${DW} 0 L ${DW} ${DH * 1.15} Q ${DW / 2} ${
        DH * 1.15
      } 0 ${DH * 1.15} L 0 0`,
    };
  }, [DH, DW, topCurve, bottomCurve]);

  // Resize con debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resize = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;

      // Early return si no cambió
      if (height === DH && width === DW) return;

      const isDesktop = width > height;
      const config = isDesktop ? CURVE_CONFIG.desktop : CURVE_CONFIG.mobile;

      setViewport({
        height,
        width,
        topCurve: height * config.top,
        bottomCurve: height * config.bottom,
      });
    };

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resize, 100);
    };

    resize(); // Inicial
    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [DH, DW]);

  // Inicializar path
  useEffect(() => {
    if (svgPaths && path.current) {
      path.current.setAttribute("d", svgPaths.initial);
    }
  }, [svgPaths]);

  // Memoizar función leave
  const handleLeave = useCallback(
    (next: () => void) => {
      if (!svg.current || !path.current || !svgPaths) {
        next();
        return;
      }

      animate(
        svg.current,
        { top: [DH, 0] },
        { ...ANIMATION_CONFIG.leave, onComplete: next }
      );
      animate(
        path.current,
        { d: [svgPaths.leaveStart, svgPaths.leaveEnd] },
        { duration: ANIMATION_CONFIG.path.duration }
      );
    },
    [DH, svgPaths]
  );

  // Memoizar función enter
  const handleEnter = useCallback(
    (next: () => void) => {
      if (!svg.current || !path.current || !content.current || !svgPaths) {
        next();
        return;
      }

      animate(svg.current, { top: [0, -DH * 1.15] }, ANIMATION_CONFIG.enter);
      animate(
        path.current,
        { d: [svgPaths.enterStart, svgPaths.enterEnd] },
        { duration: ANIMATION_CONFIG.path.duration }
      );
      animate(
        content.current,
        { opacity: [0, 1], y: [20, 0] },
        { ...ANIMATION_CONFIG.content, onComplete: next }
      );
    },
    [DH, svgPaths]
  );

  return (
    <SessionProvider>
      <Navbar />
      <TransitionRouter auto leave={handleLeave} enter={handleEnter}>
        <svg ref={svg} id="enterSvg">
          <path ref={path} fill="var(--color-aam-orange)" />
        </svg>
        <div ref={content}>{children}</div>
      </TransitionRouter>
    </SessionProvider>
  );
};
