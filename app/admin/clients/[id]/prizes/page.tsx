import { requireAdmin } from "@/lib/auth";
import { TransactionService } from "@/app/api/DAO/services/transactionService";
import { UserService } from "@/app/api/DAO/services/userService";
import PrizeRedemptionsManager from "@/components/admin/PrizeRedemptionsManager";
import { serializeTransactionWithPrize } from "@/utils/serializers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientPrizesPage({ params }: PageProps) {
  // Proteger ruta - solo admins
  await requireAdmin();

  const { id } = await params;

  // Obtener información del cliente
  const client = await UserService.findById(id);

  if (!client) {
    notFound();
  }

  // Obtener todas las transacciones de redención de premios del cliente
  const clientRedemptions = await TransactionService.findPrizeRedemptionsByUser(
    id
  );

  // Serializar transacciones
  const serializedTransactions = clientRedemptions.map(
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
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-gray-600">
            <Link
              href="/admin/clients"
              className="hover:text-aam-orange transition-colors"
            >
              Clientes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">
              Premios de {client.name}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Premios de {client.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {client.email} • {client.points} puntos disponibles
              </p>
            </div>
            <Link href="/admin/clients">
              <Button
                text={"← Volver a Clientes"}
                className="font-clash-display"
              />
            </Link>
          </div>

          {/* Client info card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="text-lg font-semibold text-gray-800">
                  {client.name}
                </p>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm text-gray-600">Puntos Actuales</p>
                <p className="text-2xl font-bold text-aam-orange">
                  {client.points}
                </p>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm text-gray-600">Premios Solicitados</p>
                <p className="text-2xl font-bold text-gray-800">
                  {serializedTransactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-aam-wine">
                  {counts.pending}
                </p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
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
        </div>

        {/* Tabla de premios con tabs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <PrizeRedemptionsManager transactions={serializedTransactions} />
        </div>
      </div>
    </div>
  );
}
