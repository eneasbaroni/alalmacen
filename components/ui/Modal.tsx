"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ANIMATION, Z_INDEX } from "@/constants/animations";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "md",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...ANIMATION.FADE}
          transition={{ duration: ANIMATION.DURATION.FAST }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-lg"
          style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}
          onClick={onClose}
        >
          <motion.div
            {...ANIMATION.MODAL}
            transition={{
              duration: ANIMATION.DURATION.NORMAL,
              ease: ANIMATION.EASE.OUT,
            }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClasses[maxWidth]} mx-4`}
          >
            {title && (
              <div className="px-6 py-4 border-b border-aam-orange/20">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
