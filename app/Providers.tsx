"use client";
import { SessionProvider } from "next-auth/react";
import { useRef, useCallback } from "react";
import { TransitionRouter } from "next-transition-router";
import { animate } from "motion/react";
import { Navbar } from "@/components/layout";

// Constantes de configuración
const ANIMATION_CONFIG = {
  leave: {
    duration: 1,
    ease: [0.65, 0, 0.35, 1] as const,
  },
  enter: {
    duration: 1,
    ease: [0.65, 0, 0.35, 1] as const,
  },
  content: {
    duration: 0.1,
    delay: 0.1,
  },
} as const;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const circle = useRef<HTMLDivElement>(null!);
  const content = useRef<HTMLDivElement>(null!);

  // Memoizar función leave - círculo crece desde abajo
  const handleLeave = useCallback((next: () => void) => {
    if (!circle.current) {
      next();
      return;
    }

    animate(
      circle.current,
      {
        scale: [0, 1],
        bottom: ["-105vh", "-100vh"],
        borderRadius: ["30rem", "30rem", "0rem"],
        height: ["100vw", "200vh"],
      },
      { ...ANIMATION_CONFIG.leave, onComplete: next }
    );
  }, []);

  // Memoizar función enter - círculo decrece
  const handleEnter = useCallback((next: () => void) => {
    if (!circle.current || !content.current) {
      next();
      return;
    }

    animate(
      circle.current,
      {
        scale: [1, 0],
        bottom: ["-100vh", "-105vh"],
        borderRadius: ["0rem", "30rem", "30rem"],
        height: ["200vh", "100vw"],
      },
      ANIMATION_CONFIG.enter
    );
    animate(
      content.current,
      { opacity: [0, 1], y: [20, 0] },
      { ...ANIMATION_CONFIG.content, onComplete: next }
    );
  }, []);

  return (
    <SessionProvider>
      <Navbar />
      <TransitionRouter auto leave={handleLeave} enter={handleEnter}>
        <div
          ref={circle}
          id="transitionCircle"
          className="fixed bg-aam-orange pointer-events-none"
          style={{
            width: "100vw",
            //height: "200vh",
            //bottom: "-142vmax",
            left: "50%",
            marginLeft: "-50vw",
            transform: "scale(0)",
            zIndex: 50,
          }}
        />
        <div ref={content}>{children}</div>
      </TransitionRouter>
    </SessionProvider>
  );
};
