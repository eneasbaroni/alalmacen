import { requireAdmin } from "@/lib/auth";
import { TransactionService } from "@/app/api/DAO/services/transactionService";

import { serializeTransactionWithPrize } from "@/utils/serializers";
import Link from "next/link";
import TransactionsManager from "@/components/admin/TransactionsManager";
import { Button } from "@/components/ui";

export default async function TransactionsPage() {
  // Proteger ruta - solo admins
  await requireAdmin();

  // Obtener todas las transacciones
  const allTransactions = await TransactionService.findAll();

  // Serializar transacciones
  const serializedTransactions = allTransactions.map(
    (transaction: Record<string, unknown>) =>
      serializeTransactionWithPrize(transaction)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mt-24 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold ">HISTORIAL DE TRANSACCIONES</h1>
            <Link href="/admin/dashboard">
              <Button
                className="font-clash-display"
                text={"Volver a Dashboard"}
              />
            </Link>
          </div>
          <p className="text-gray-600">
            Visualiza y analiza todas las transacciones del sistema
          </p>
        </div>

        {/* Manager con tabs y tabla */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <TransactionsManager transactions={serializedTransactions} />
        </div>
      </div>
    </div>
  );
}
