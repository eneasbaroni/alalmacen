"use client";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/components/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePendingPrizes } from "@/hooks/usePendingPrizes";
import { AlertBanner } from "@/components/common/AlertBanner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { pendingCount } = usePendingPrizes(session?.user?.email);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center">
        <p>Cargando sesión...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = (session.user as { role?: string })?.role === "admin";

  return (
    <main className="bg-gray-100 w-full min-h-screen flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-3xl pt-16 font-bold text-aam-orange mb-4">
        Mi perfil
      </h1>

      <div className="w-full max-w-md">
        {/* Banner de premios pendientes */}
        {!isAdmin && pendingCount > 0 && (
          <AlertBanner
            variant="warning"
            message={`¡Tenés ${pendingCount} premio${
              pendingCount > 1 ? "s" : ""
            } pendiente${pendingCount > 1 ? "s" : ""} para retirar!`}
            actionText="Ver mis premios"
            actionHref="/my-prizes?tab=pending"
            dismissible={true}
          />
        )}
      </div>

      <UserProfile session={session} isAdmin={isAdmin} />
    </main>
  );
}
