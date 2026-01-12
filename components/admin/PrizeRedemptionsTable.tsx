"use client";

import { useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { formatDateShort } from "@/utils/formatters";
import {
  transactionStatusConfig,
  prizeRedemptionEmptyMessages,
} from "@/constants/table-config";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";

type TabType = "all" | "pending" | "completed" | "cancelled";

interface PrizeRedemptionsTableProps {
  transactions: Transaction[];
  activeTab: TabType;
  onComplete: (transaction: Transaction) => void;
  onCancel: (transaction: Transaction) => void;
}

export default function PrizeRedemptionsTable({
  transactions,
  activeTab,
  onComplete,
  onCancel,
}: PrizeRedemptionsTableProps) {
  const columns: Column<Transaction>[] = useMemo(
    () => [
      {
        key: "client",
        label: "Cliente",
        sortable: true,
        render: (transaction) => {
          const user =
            typeof transaction.userID === "object"
              ? (transaction.userID as { name?: string; email?: string })
              : null;
          return (
            <div className="whitespace-nowrap">
              <div className="text-xs font-medium text-gray-900">
                {user?.name || "Sin nombre"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email || "Sin email"}
              </div>
            </div>
          );
        },
      },
      {
        key: "prize",
        label: "Premio",
        sortable: true,
        render: (transaction) => {
          const prize = transaction.prize;
          return (
            <div>
              <div className="text-xs font-medium text-gray-900">
                {prize?.name || "Premio desconocido"}
              </div>
              {prize?.description && (
                <div className="text-xs text-gray-500 max-w-xs truncate">
                  {prize.description}
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "points",
        label: "Puntos",
        sortable: true,
        className: "whitespace-nowrap",
        render: (transaction) => (
          <div className="text-xs text-gray-900">
            {Math.abs(transaction.points)} pts
          </div>
        ),
      },
      {
        key: "createdAt",
        label: "Fecha Solicitud",
        sortable: true,
        className: "whitespace-nowrap",
        render: (transaction) => (
          <div className="text-xs text-gray-900">
            {transaction.createdAt
              ? formatDateShort(transaction.createdAt)
              : "N/A"}
          </div>
        ),
      },
      {
        key: "status",
        label: "Estado",
        sortable: true,
        className: "whitespace-nowrap",
        render: (transaction) => {
          const config =
            transactionStatusConfig[
              transaction.status as keyof typeof transactionStatusConfig
            ];
          if (!config) {
            return <Badge variant="info">Desconocido</Badge>;
          }
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      {
        key: "actions",
        label: "Acciones",
        sortable: false,
        className: "whitespace-nowrap text-xs font-medium",
        render: (transaction) => {
          if (transaction.status === "pending") {
            return (
              <div className="flex gap-2">
                <button
                  onClick={() => onComplete(transaction)}
                  className="px-2 py-1 text-xs font-medium text-white bg-aam-orange rounded-3xl hover:bg-aam-orange/90 transition-colors"
                >
                  Entregar
                </button>
                <button
                  onClick={() => onCancel(transaction)}
                  className="px-2 py-1 text-xs font-medium text-white bg-aam-wine rounded-3xl hover:bg-aam-wine/90 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            );
          }
          return <span className="text-gray-400 text-xs">Sin acciones</span>;
        },
      },
    ],
    [onComplete, onCancel]
  );

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {prizeRedemptionEmptyMessages[activeTab]}
      </div>
    );
  }

  return (
    <DataTable
      data={transactions}
      columns={columns}
      keyExtractor={(transaction) => transaction._id}
      emptyMessage={prizeRedemptionEmptyMessages[activeTab]}
    />
  );
}
