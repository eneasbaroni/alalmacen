"use client";

import Image from "next/image";
import { Prize } from "@/types/prize";
import { Transaction } from "@/types/transaction";

interface MyPrizesListProps {
  transactions: Transaction[];
  onViewDetail: (prize: Prize) => void;
  activeTab?: "all" | "pending" | "completed";
}

export default function MyPrizesList({
  transactions,
  onViewDetail,
  activeTab = "all",
}: MyPrizesListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⏳ PENDIENTE
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ RETIRADO
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ❌ CANCELADO
          </span>
        );
      default:
        return null;
    }
  };

  if (transactions.length === 0) {
    const emptyMessages = {
      all: {
        title: "NO HAY PREMIOS PARA MOSTRAR",
        subtitle: "Aún no has adquirido ningún premio",
      },
      pending: {
        title: "NO HAY PREMIOS PENDIENTES",
        subtitle:
          "Todos tus premios han sido retirados o no tienes premios aún",
      },
      completed: {
        title: "NO HAY PREMIOS RETIRADOS",
        subtitle: "Aún no has retirado ningún premio",
      },
    };

    const message = emptyMessages[activeTab];

    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">🎁</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {message.title}
        </h3>
        <p className="text-gray-600">{message.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {transactions.map((transaction) => {
        // El premio viene en el campo 'prize' cuando está populated
        const prize = transaction.prize;
        if (!prize) return null;

        return (
          <div
            key={transaction._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Imagen */}
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={`/images/prizes/${prize.image}`}
                alt={prize.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-3">
              {/* Título y estado */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                  {prize.name}
                </h3>
                <div className="flex justify-between items-center">
                  {getStatusBadge(transaction.status)}
                  <span className="text-sm font-medium text-aam-orange">
                    {Math.abs(transaction.points)} pts
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {prize.description}
              </p>

              {/* Fechas */}
              <div className="pt-2 border-t border-gray-200 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>SOLICITADO:</span>
                  <span className="font-medium">
                    {formatDate(transaction.createdAt || transaction.date)}
                  </span>
                </div>
                {transaction.status === "completed" &&
                  transaction.updatedAt && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>RETIRADO:</span>
                      <span className="font-medium">
                        {formatDate(transaction.updatedAt)}
                      </span>
                    </div>
                  )}
              </div>

              {/* Botón */}
              <button
                onClick={() => onViewDetail(prize)}
                className="w-full px-4 py-2 text-sm font-medium text-aam-wine bg-aam-wine/10 rounded hover:bg-aam-wine/20 transition-colors"
              >
                VER DETALLE
              </button>

              {/* Aviso para pendientes */}
              {transaction.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-800 text-center">
                    <strong>Retíralo en el local</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
