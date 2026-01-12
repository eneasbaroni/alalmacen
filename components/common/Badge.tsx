import { ReactNode } from "react";

export type BadgeVariant =
  | "purchase"
  | "redeem"
  | "pending"
  | "completed"
  | "cancelled"
  | "available"
  | "unavailable"
  | "points"
  | "success"
  | "warning"
  | "error"
  | "info";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  purchase: "bg-aam-green/20 text-green-800",
  redeem: "bg-aam-orange/10 text-aam-orange",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-aam-green/20 text-green-800",
  cancelled: "bg-aam-wine/10 text-red-800",
  available: "bg-aam-green/20 text-green-800",
  unavailable: "bg-gray-100 text-gray-800",
  points: "bg-aam-orange/10 text-aam-orange",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

export default function Badge({
  variant,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
