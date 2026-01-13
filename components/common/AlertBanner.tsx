"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";

interface AlertBannerProps {
  message: string;
  actionText?: string;
  actionHref?: string;
  dismissible?: boolean;
  variant?: "info" | "warning" | "success" | "error" | "orange" | "green";
  icon?: ReactNode;
}

export const AlertBanner = ({
  message,
  actionText,
  actionHref,
  dismissible = false,
  variant = "info",
  icon,
}: AlertBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantStyles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "ℹ️",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-800",
      icon: "⚠️",
      button: "bg-orange-600 hover:bg-orange-700",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "✓",
      button: "bg-green-600 hover:bg-green-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "✕",
      button: "bg-red-600 hover:bg-red-700",
    },
    orange: {
      bg: "bg-aam-orange/10",
      border: "border-aam-orange/30",
      text: "text-aam-orange",
      icon: "",
      button: "bg-aam-orange hover:bg-aam-orange/90",
    },
    green: {
      bg: "bg-aam-green/20",
      border: "border-aam-green",
      text: "text-green-800",
      icon: "",
      button: "bg-aam-green hover:bg-aam-green/90",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-6 flex items-center justify-between gap-4`}
    >
      <div className="flex items-center gap-3 flex-1">
        {icon ? (
          <div className={style.text}>{icon}</div>
        ) : (
          style.icon && <span className="text-2xl">{style.icon}</span>
        )}
        <p className={`${style.text} text-sm font-medium`}>{message}</p>
      </div>

      <div className="flex items-center gap-2">
        {actionText && actionHref && (
          <Link href={actionHref}>
            <button
              className={`${style.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap`}
            >
              {actionText}
            </button>
          </Link>
        )}

        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className={`${style.text} hover:opacity-70 transition-opacity p-1`}
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
