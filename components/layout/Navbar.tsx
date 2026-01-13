"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePendingPrizes } from "@/hooks/usePendingPrizes";

export function Navbar() {
  const { data: session } = useSession();
  const { pendingCount } = usePendingPrizes(session?.user?.email);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-gray-200/20 border-b-aam-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Izquierda */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logoC.png"
              alt="Alalmacén"
              width={40}
              height={40}
              className="rounded-full border-gray-300 border hover:border-aam-orange transition-colors"
            />
          </Link>

          {/* Perfil con badge - Derecha */}
          {session?.user?.image && (
            <div className="relative flex items-center">
              {/* Badge de premios pendientes - Solo desktop */}
              {pendingCount > 0 && (
                <div className="hidden md:block absolute -top-1 -left-2 z-10 group">
                  <div
                    className="bg-aam-orange text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg hover:bg-aam-orange/90 transition-colors border-2 border-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/my-prizes?tab=pending");
                    }}
                  >
                    {pendingCount}
                  </div>
                  {/* Tooltip personalizado */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Tenés {pendingCount} premio{pendingCount > 1 ? "s" : ""}{" "}
                    pendiente{pendingCount > 1 ? "s" : ""} para retirar
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )}

              {/* Imagen de perfil */}
              <Link href="/profile" className="flex items-center">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Usuario"}
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300 hover:border-aam-orange transition-colors"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
