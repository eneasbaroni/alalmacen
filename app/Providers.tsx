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
      { scale: [0, 2], bottom: ["-60vmax", "-50vmax"] },
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
      { scale: [2, 0], bottom: ["-50vmax", "-60vmax"] },
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
          className="fixed bg-aam-orange rounded-full pointer-events-none"
          style={{
            width: "100vmax",
            height: "100vmax",
            //bottom: "-52vmax",
            left: "50%",
            marginLeft: "-50vmax",
            transform: "scale(0)",
            zIndex: 50,
          }}
        />
        <div ref={content}>{children}</div>
      </TransitionRouter>
    </SessionProvider>
  );
};
