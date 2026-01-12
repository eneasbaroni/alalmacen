import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";
import { TransactionService } from "@/app/api/DAO/services/transactionService";
import { serializeTransactionWithPrize } from "@/utils/serializers";
import MyPrizesManager from "../../components/client/MyPrizesManager";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Alalmacén - Mis Premios",
  description: "Consulta el estado de tus premios adquiridos en Alalmacén.",
};

export default async function MyPrizesPage() {
  // Requerir autenticación
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Obtener usuario
  const user = await UserService.findByEmail(session.user.email);

  if (!user) {
    redirect("/api/auth/signin");
  }

  // Obtener transacciones de premios del usuario
  const transactionsData = await TransactionService.findByUser(
    user._id.toString()
  );

  // Filtrar solo premios (type="redeem" + prizeType="prize")
  const prizeTransactions = transactionsData.filter(
    (t) => t.type === "redeem" && t.prizeType === "prize"
  );

  // Serializar para Client Component usando helper
  const transactions = prizeTransactions.map(serializeTransactionWithPrize);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl mobile:text-center mobile:leading-6 font-bold text-gray-900">
                MIS PREMIOS
              </h1>
              <p className="text-gray-600 mt-2 mobile:text-center">
                CONSULTA EL ESTADO DE TUS PREMIOS ADQUIRIDOS
              </p>
            </div>

            {/* Botones de navegación */}
            <div className="flex gap-3">
              <Link href="/prizes" className="mobile:flex-1">
                <Button
                  text={"← Ver Premios"}
                  className="font-clash-display mobile:w-full mobile:text-sm"
                />
              </Link>
              <Link href="/profile" className="mobile:flex-1">
                <Button
                  text={"Mi Perfil"}
                  className="font-clash-display bg-white border border-aam-orange/80 hover:text-aam-orange! mobile:w-full mobile:text-sm"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Manager Component */}
        <MyPrizesManager transactions={transactions} />
      </div>
    </div>
  );
}
