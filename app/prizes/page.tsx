import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";
import { PrizeService } from "@/app/api/DAO/services/prizeService";
import { Prize } from "@/types/prize";
import { GiftIcon } from "@/app/icons";
import ClientPrizesManager from "../../components/client/ClientPrizesManager";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Alalmacén - Catálogo de Premios",
  description: "Canjea tus puntos por increíbles premios en Al Almacén",
};

export default async function PrizesPage() {
  // Obtener sesión del usuario (puede ser null si no está autenticado)
  const session = await getServerSession(authOptions);

  let userPoints = 0;

  if (session?.user?.email) {
    try {
      const user = await UserService.findByEmail(session.user.email);
      userPoints = user?.points || 0;
    } catch (error) {
      console.error("Error fetching user points:", error);
      userPoints = 0;
    }
  }

  // Fetch solo premios disponibles
  let prizesData: Awaited<ReturnType<typeof PrizeService.findAvailable>> = [];
  try {
    prizesData = await PrizeService.findAvailable();
  } catch (error) {
    console.error("Error fetching prizes:", error);
  }

  // Serializar para Client Component
  const prizes: Prize[] = prizesData.map((prize) => ({
    _id: prize._id.toString(),
    name: prize.name,
    description: prize.description,
    pointsRequired: prize.pointsRequired,
    image: prize.image,
    status: prize.status,
    stock: prize.stock,
    createdAt: prize.createdAt?.toISOString(),
    updatedAt: prize.updatedAt?.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl mobile:text-center mobile:leading-6 font-bold text-gray-900">
                CATÁLOGO DE PREMIOS
              </h1>
              <p className="text-gray-600 mt-2 mobile:text-center mobile:text-sm">
                CANJEA TUS PUNTOS POR INCREÍBLES PREMIOS
              </p>
            </div>

            {/* Botón Mis Premios */}
            {session?.user?.email && (
              <div className="flex gap-3">
                <Link
                  href="/my-prizes"
                  className="font-normal font-clash-display mobile:flex-1 mobile:text-sm"
                >
                  <Button
                    text="Mis Premios"
                    icon={<GiftIcon />}
                    className="flex gap-2 w-full mobile:items-center mobile:justify-center"
                  />
                </Link>
                <Link href="/profile" className="mobile:flex-1">
                  <Button
                    text={"Mi Perfil"}
                    className="font-clash-display bg-white border border-aam-orange/80 hover:text-aam-orange! mobile:text-sm mobile:w-full"
                  />
                </Link>
              </div>
            )}
          </div>

          {session?.user?.email && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-aam-orange/10 rounded-lg mobile:w-full">
              <span className="text-sm mobile:text-xs font-medium text-gray-700">
                TUS PUNTOS:
              </span>
              <span className="text-2xl mobile:text-lg font-bold text-aam-orange">
                {userPoints}
              </span>
            </div>
          )}
        </div>

        {/* Prizes Manager Component */}
        <ClientPrizesManager
          prizes={prizes}
          userPoints={userPoints}
          isAuthenticated={!!session?.user?.email}
        />
      </div>
    </div>
  );
}
