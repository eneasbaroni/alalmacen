"use client";

import { useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { Prize } from "@/types/prize";
import { formatDateShort } from "@/utils/formatters";
import {
  transactionStatusConfig,
  myPrizesEmptyMessages,
} from "@/constants/table-config";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";

type TabType = "all" | "pending" | "completed";

interface MyPrizesTableProps {
  transactions: Transaction[];
  activeTab: TabType;
  onViewDetail: (prize: Prize) => void;
}

export default function MyPrizesTable({
  transactions,
  activeTab,
  onViewDetail,
}: MyPrizesTableProps) {
  const columns: Column<Transaction>[] = useMemo(
    () => [
      {
        key: "prize",
        label: "Premio",
        sortable: true,
        render: (transaction) => {
          const prize = transaction.prize;
          if (!prize) return null;
          return (
            <div>
              <div className="text-xs font-medium text-gray-900">
                {prize.name}
              </div>
              {prize.description && (
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
          <div className="text-xs font-medium text-aam-orange">
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
          <div>
            <div className="text-xs text-gray-900">
              {transaction.createdAt
                ? formatDateShort(transaction.createdAt)
                : "N/A"}
            </div>
            {transaction.status === "completed" && transaction.updatedAt && (
              <div className="text-xs text-gray-500">
                Retirado: {formatDateShort(transaction.updatedAt)}
              </div>
            )}
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
          return (
            <Badge variant={config.variant}>
              {transaction.status === "completed" ? "Retirado" : config.label}
            </Badge>
          );
        },
      },
      {
        key: "actions",
        label: "Acciones",
        sortable: false,
        className: "whitespace-nowrap text-xs",
        render: (transaction) => {
          const prize = transaction.prize;
          if (!prize) return null;
          return (
            <button
              onClick={() => onViewDetail(prize)}
              className="text-aam-orange hover:text-aam-wine/80 font-medium transition-colors"
            >
              Ver Detalle
            </button>
          );
        },
      },
    ],
    [onViewDetail]
  );

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {myPrizesEmptyMessages[activeTab]}
      </div>
    );
  }

  return (
    <DataTable
      data={transactions}
      columns={columns}
      keyExtractor={(transaction) => transaction._id}
      emptyMessage={myPrizesEmptyMessages[activeTab]}
    />
  );
}
