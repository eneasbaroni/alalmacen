import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-md bg-gray-200 animate-pulse", className)}
      style={{
        animation: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    />
  );
}
