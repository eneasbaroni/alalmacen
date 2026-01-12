"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";
import { useTransition } from "./TransitionCurtain";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TransitionLink({
  href,
  children,
  className,
}: TransitionLinkProps) {
  const router = useRouter();
  const { startTransition, isTransitioning } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isTransitioning) return;

    startTransition();

    // Navegar después de que la cortina cubra la pantalla
    setTimeout(() => {
      router.push(href);
    }, 400);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
