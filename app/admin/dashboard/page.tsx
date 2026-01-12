import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/app/api/DAO/services/userService";
import { TransactionService } from "@/app/api/DAO/services/transactionService";
import { PrizeService } from "@/app/api/DAO/services/prizeService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import Image from "next/image";
import type { Transaction } from "@/types/transaction";

export default async function AdminDashboardPage() {
  // Proteger ruta - solo admins
  await requireAdmin();

  // Obtener sesión
  const session = await getServerSession(authOptions);

  // Obtener datos para stats
  const [allClients, allPrizes, allRedemptions, allTransactions] =
    await Promise.all([
      UserService.findAll(),
      PrizeService.findAll(),
      TransactionService.findAllPrizeRedemptions(),
      TransactionService.findAll(),
    ]);

  // Filtrar transacciones de hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTransactions = allTransactions.filter((t: Transaction) => {
    if (!t.createdAt) return false;
    const tDate = new Date(t.createdAt);
    return tDate >= today;
  });

  const stats = {
    totalClients: allClients.length,
    pendingRedemptions: allRedemptions.filter(
      (t: Transaction) => t.status === "pending"
    ).length,
    activePrizes: allPrizes.filter(
      (p: { status: string }) => p.status === "available"
    ).length,
    todayTransactions: todayTransactions.length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header con info del admin */}
        <div className="mt-24 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex mobile:flex-col items-center gap-4">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Admin"}
                  width={64}
                  height={64}
                  className="rounded-full border border-aam-orange/80"
                />
              )}
              <div>
                <h1 className="text-3xl mobile:text-center mobile:leading-6 font-bold">
                  PANEL DE ADMINISTRACIÓN
                </h1>
                <p className="text-gray-600 mt-1 mobile:text-center mobile:text-sm">
                  Bienvenido, {session?.user?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-aam-green/30 border border-aam-green rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                Total clientes
              </p>
              <p className="text-3xl font-bold text-green-800 mt-2">
                {stats.totalClients}
              </p>
            </div>
            <div className="bg-aam-wine/10 border border-aam-wine/30 rounded-lg p-4">
              <p className="text-sm text-aam-wine font-medium">
                Premios pendientes
              </p>
              <p className="text-3xl font-bold text-aam-wine mt-2">
                {stats.pendingRedemptions}
              </p>
            </div>
            <div className="bg-aam-orange/10 border border-aam-orange/30 rounded-lg p-4">
              <p className="text-sm text-aam-orange font-medium">
                Premios activos
              </p>
              <p className="text-3xl font-bold text-aam-orange mt-2">
                {stats.activePrizes}
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">
                Transacciones hoy
              </p>
              <p className="text-3xl font-bold text-gray-600 mt-2">
                {stats.todayTransactions}
              </p>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/clients"
              className="group bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-aam-orange hover:bg-aam-orange/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">👥</span>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-aam-orange transition-colors">
                  Clientes
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Gestiona clientes, puntos y descuentos
              </p>
            </Link>

            <Link
              href="/admin/prizes"
              className="group bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-aam-wine hover:bg-aam-wine/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎁</span>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-aam-wine transition-colors">
                  Premios
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Administra el catálogo de premios
              </p>
            </Link>

            <Link
              href="/admin/pending-prizes"
              className="group bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-aam-wine hover:bg-aam-wine/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📦</span>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-aam-wine transition-colors">
                  Solicitudes
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Premios solicitados por clientes
              </p>
              {stats.pendingRedemptions > 0 && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                  {stats.pendingRedemptions} pendientes
                </span>
              )}
            </Link>

            <Link
              href="/admin/transactions"
              className="group bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-gray-600 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💳</span>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">
                  Transacciones
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Historial completo de movimientos
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
