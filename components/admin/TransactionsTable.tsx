"use client";

import { useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { formatDateShort, formatPoints } from "@/utils/formatters";
import { getPointsColor } from "@/utils/table-helpers";
import {
  transactionTypeConfig,
  transactionEmptyMessages,
} from "@/constants/table-config";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";

type FilterType = "all" | "purchase" | "redeem";

interface TransactionsTableProps {
  transactions: Transaction[];
  activeFilter: FilterType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function TransactionsTable({
  transactions,
  activeFilter,
  searchTerm,
  onSearchChange,
  sortField,
  sortOrder,
  onSort,
}: TransactionsTableProps) {
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
        key: "type",
        label: "Tipo",
        sortable: true,
        className: "whitespace-nowrap",
        render: (transaction) => {
          const config =
            transactionTypeConfig[
              transaction.type as keyof typeof transactionTypeConfig
            ];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      {
        key: "concept",
        label: "Concepto",
        sortable: false,
        render: (transaction) => (
          <div>
            <div className="text-xs text-gray-900">{transaction.concept}</div>
            {transaction.prizeType === "cashback" &&
              transaction.cashbackAmount && (
                <div className="text-xs text-gray-500">
                  Cashback: ${transaction.cashbackAmount}
                </div>
              )}
          </div>
        ),
      },
      {
        key: "points",
        label: "Puntos",
        sortable: true,
        className: "whitespace-nowrap",
        render: (transaction) => (
          <div
            className={`text-xs font-semibold ${getPointsColor(
              transaction.points
            )}`}
          >
            {formatPoints(transaction.points)}
          </div>
        ),
      },
      {
        key: "date",
        label: "Fecha",
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
    ],
    []
  );

  const searchBar = (
    <input
      type="text"
      placeholder="Buscar por concepto, cliente o email..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent"
    />
  );

  return (
    <DataTable
      data={transactions}
      columns={columns}
      keyExtractor={(transaction) => transaction._id}
      emptyMessage={
        searchTerm
          ? "No se encontraron transacciones con ese criterio"
          : transactionEmptyMessages[activeFilter]
      }
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={onSort}
      searchBar={searchBar}
    />
  );
}
