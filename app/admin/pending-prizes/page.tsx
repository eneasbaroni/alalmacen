import { requireAdmin } from "@/lib/auth";
import { TransactionService } from "@/app/api/DAO/services/transactionService";
import PrizeRedemptionsManager from "@/components/admin/PrizeRedemptionsManager";
import { serializeTransactionWithPrize } from "@/utils/serializers";
import Link from "next/link";
import { Button } from "@/components/ui";

export default async function PendingPrizesPage() {
  // Proteger ruta - solo admins
  await requireAdmin();

  // Obtener todas las transacciones de redención de premios
  const allRedemptions = await TransactionService.findAllPrizeRedemptions();

  // Serializar transacciones
  const serializedTransactions = allRedemptions.map(
    (transaction: Record<string, unknown>) =>
      serializeTransactionWithPrize(transaction)
  );

  // Contar por estado
  const counts = {
    pending: serializedTransactions.filter((t) => t.status === "pending")
      .length,
    completed: serializedTransactions.filter((t) => t.status === "completed")
      .length,
    cancelled: serializedTransactions.filter((t) => t.status === "cancelled")
      .length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mt-24 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              GESTIÓN DE PREMIOS SOLICITADOS
            </h1>
            <Link href="/admin/dashboard">
              <Button
                text={"Volver a Dashboard"}
                className="font-clash-display"
              />
            </Link>
          </div>
        </div>

        {/* Contenedor principal con stats y tabla */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Stats cards */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {serializedTransactions.length}
              </p>
            </div>
            <div className="bg-aam-orange/10 border border-aam-orange/30 rounded-lg p-4">
              <p className="text-sm text-aam-orange">Pendientes</p>
              <p className="text-2xl font-bold text-aam-orange">
                {counts.pending}
              </p>
            </div>
            <div className="bg-aam-green/20 border border-aam-green rounded-lg p-4">
              <p className="text-sm text-green-800">Completados</p>
              <p className="text-2xl font-bold text-green-800">
                {counts.completed}
              </p>
            </div>
            <div className="bg-aam-wine/10 border border-aam-wine/30 rounded-lg p-4">
              <p className="text-sm text-aam-wine">Cancelados</p>
              <p className="text-2xl font-bold text-aam-wine">
                {counts.cancelled}
              </p>
            </div>
          </div>

          {/* Tabla de premios con tabs */}
          <PrizeRedemptionsManager transactions={serializedTransactions} />
        </div>
      </div>
    </div>
  );
}
