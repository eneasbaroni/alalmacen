"use client";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/components/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      <UserProfile session={session} isAdmin={isAdmin} />
    </main>
  );
}
