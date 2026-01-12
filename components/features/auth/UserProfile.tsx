"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { DNIForm } from "./DNIForm";
import { DashboardIcon } from "@/app/icons/DashboardIcon";
import { Button } from "@/components/ui";

interface UserProfileProps {
  session: Session;
  isAdmin?: boolean;
}

export function UserProfile({ session, isAdmin = false }: UserProfileProps) {
  const { user, loading, refetch } = useUser(session.user?.email);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDNISuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  if (loading) {
    return <Skeleton className="h-96 w-96" />;
  }

  return (
    <div className="bg-white rounded-lg  p-8 max-w-md w-full">
      <div className="flex flex-col items-center gap-6">
        {/* Imagen del usuario */}
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "Usuario"}
            width={96}
            height={96}
            className=" border border-aam-orange/80"
            style={{ borderRadius: "52% 48% 63% 37% / 42% 58% 42% 58%" }}
          />
        )}

        {/* Nombre del usuario */}
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 font-clash-display">
            {session.user?.name || "Usuario"}
          </p>
          <p className="text-sm text-gray-600 mt-1">{session.user?.email}</p>
        </div>

        {/* Botón Dashboard para Admin */}
        {user?.role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="w-full bg-aam-orange  py-3 px-6 rounded-3xl hover:text-white transition-colors font-medium text-center flex items-center justify-center gap-2"
          >
            <DashboardIcon />
            <span className="font-light">Ir al Dashboard</span>
          </Link>
        )}

        {/* Puntos del usuario */}
        {user?.dni && (
          <div className="w-full bg-white border border-aam-orange/30 rounded-lg p-6 text-center">
            <p className="text-sm text-aam-orange font-medium mb-2">
              Puntos acumulados
            </p>
            <p className="text-4xl font-bold text-aam-orange">
              {user?.points ?? 0}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="w-full flex flex-col gap-3">
          {user?.dni ? (
            <>
              <Link href="/prizes" className="w-full">
                <button className="w-full px-6 py-3 border border-transparent rounded-3xl bg-gray-100 font-normal hover:border hover:border-aam-orange/80 hover:text-aam-orange transition-colors font-clash-display">
                  Ver Premios Disponibles
                </button>
              </Link>
              <Link href="/my-prizes" className="w-full">
                <button className="w-full px-6 py-3 border border-transparent rounded-3xl bg-gray-100 font-normal hover:border hover:border-aam-orange/80 hover:text-aam-orange transition-colors font-clash-display">
                  Mis Premios
                </button>
              </Link>
            </>
          ) : (
            <div className="w-full  border border-aam-orange/20 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-700 mb-4">
                Debes cargar tu DNI para poder disfrutar de los beneficios
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-100 hover:text-aam-orange!"
                text={"Cargar DNI"}
              />
            </div>
          )}

          <button
            onClick={() => signOut()}
            className="w-full px-6 py-3 rounded-3xl bg-aam-orange hover:text-white font-normal transition-colors font-clash-display"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Modal para cargar DNI */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cargar DNI"
      >
        <DNIForm
          email={session.user?.email || ""}
          onSuccess={handleDNISuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
