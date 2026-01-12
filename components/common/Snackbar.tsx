"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ANIMATION, Z_INDEX, TIMING } from "@/constants/animations";

interface SnackbarProps {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Snackbar({
  message,
  type = "success",
  isOpen,
  onClose,
  duration = TIMING.SNACKBAR_DURATION,
}: SnackbarProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isOpen, duration, onClose]);

  const bgColors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  const icons = {
    success: "✓",
    error: "✗",
    info: "ℹ",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...ANIMATION.SLIDE_UP}
          transition={{
            duration: ANIMATION.DURATION.NORMAL,
            ease: ANIMATION.EASE.OUT,
          }}
          className="fixed bottom-6 right-6"
          style={{ zIndex: Z_INDEX.SNACKBAR }}
        >
          <div
            className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}
            style={{ minWidth: "300px" }}
          >
            <span className="text-xl font-bold">{icons[type]}</span>
            <p className="text-sm font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
