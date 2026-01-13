"use client";
import { useSession } from "next-auth/react";
import { LoginButton } from "@/components/features/auth";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const { data: session, status } = useSession();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 tablet:py-10 h-screen text-center flex mobile:flex-col gap-2 items-end mobile:justify-between container">
      <div className="w-1/2 mobile:w-full flex flex-col items-start justify-end mobile:items-center mobile:justify-center ">
        <h1 className="text-[7.5rem] tablet:text-[5rem] mobile:text-[18vw] font-light tracking-tighter leading-30">
          Alalmacén
        </h1>
      </div>
      <div className="w-1/2 mobile:w-full flex flex-col items-start justify-end text-left relative font-roslindale font-extralight! text-4xl tablet:text-3xl mobile:text-2xl">
        <h2 className="font-extralight! font-clash-display">
          Cada compra suma momentos especiales.
        </h2>

        <div className="inline-block font-noto-sans font-extralight!">
          <span className="font-thin font-clash-display">
            Convertí tus compras en recompensas. Canjeá tus puntos por productos
            premium, descuentos exclusivos y experiencias únicas.
          </span>
          {status === "loading" && (
            <Skeleton className="inline-block h-10 w-32 ml-2 rounded-md" />
          )}
          {status !== "loading" && !session && <LoginButton />}
          {status === "authenticated" && session && (
            <Link href="/profile" className="ml-4">
              <Button
                text="Ver mi perfil"
                className="font-clash-display py-1!"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
