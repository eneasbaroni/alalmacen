import { PrizesManager } from "@/components/admin/PrizesManager";
import { requireAdmin } from "@/lib/auth";
import { PrizeService } from "@/app/api/DAO/services/prizeService";
import { Prize } from "@/types/prize";
import Link from "next/link";
import { Button } from "@/components/ui";

export default async function AdminPrizesPage() {
  // Proteger ruta - solo admins
  await requireAdmin();

  // Fetch prizes from DB
  const prizesData = await PrizeService.findAll();

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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mt-24 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">GESTIÓN DE PREMIOS</h1>
              <p className="text-gray-600 mt-2">
                Administra el catálogo de premios disponibles para canje
              </p>
            </div>
            <Link href="/admin/dashboard">
              <Button
                text={"Volver a Dashboard"}
                className="font-clash-display"
              />
            </Link>
          </div>
        </div>

        {/* Manager con tabs y tabla */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <PrizesManager prizes={prizes} />
        </div>
      </div>
    </div>
  );
}
