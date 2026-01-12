"use client";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode } from "react";

interface TransitionContextType {
  startTransition: () => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  startTransition: () => {},
  isTransitioning: false,
});

export const useTransition = () => useContext(TransitionContext);

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const startTransition = () => {
    setIsTransitioning(true);
    // Reset después de la animación
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            delay: 0.4, // Espera a que la cortina cubra
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Cortina naranja */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 bg-aam-orange origin-bottom"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.65, 0, 0.35, 1], // Custom easing
            }}
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
