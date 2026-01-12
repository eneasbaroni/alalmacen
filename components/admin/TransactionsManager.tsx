"use client";

import { useState, useMemo } from "react";
import TransactionsTable from "./TransactionsTable";
import { Transaction } from "@/types/transaction";

interface TransactionsManagerProps {
  transactions: Transaction[];
}

type FilterType = "all" | "purchase" | "redeem";
type SortField = "date" | "points" | "client" | "type";
type SortOrder = "asc" | "desc";

export default function TransactionsManager({
  transactions,
}: TransactionsManagerProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Optimización: Calcular counts y stats en una sola pasada
  const { counts, stats } = useMemo(() => {
    let all = 0;
    let purchase = 0;
    let redeem = 0;
    let purchasePoints = 0;
    let redeemPoints = 0;

    transactions.forEach((t) => {
      all++;
      if (t.type === "purchase") {
        purchase++;
        purchasePoints += t.points;
      } else if (t.type === "redeem") {
        redeem++;
        redeemPoints += Math.abs(t.points);
      }
    });

    return {
      counts: { all, purchase, redeem },
      stats: {
        purchasePoints,
        redeemPoints,
        netPoints: purchasePoints - redeemPoints,
      },
    };
  }, [transactions]);

  // Filtrar, buscar y ordenar transacciones
  const processedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filtrar por tipo
    if (activeFilter === "purchase") {
      filtered = filtered.filter((t) => t.type === "purchase");
    } else if (activeFilter === "redeem") {
      filtered = filtered.filter((t) => t.type === "redeem");
    }

    // Buscar
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((transaction) => {
        const user =
          typeof transaction.userID === "object"
            ? (transaction.userID as { name?: string; email?: string })
            : null;

        return (
          transaction.concept.toLowerCase().includes(searchLower) ||
          user?.name?.toLowerCase().includes(searchLower) ||
          user?.email?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "date":
          comparison =
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime();
          break;
        case "points":
          comparison = Math.abs(a.points) - Math.abs(b.points);
          break;
        case "client": {
          const userA =
            typeof a.userID === "object"
              ? (a.userID as { name?: string })
              : null;
          const userB =
            typeof b.userID === "object"
              ? (b.userID as { name?: string })
              : null;
          comparison = (userA?.name || "").localeCompare(userB?.name || "");
          break;
        }
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [transactions, activeFilter, searchTerm, sortField, sortOrder]);

  // Paginación
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedTransactions, currentPage]);

  const totalPages = Math.ceil(processedTransactions.length / ITEMS_PER_PAGE);

  const handleSort = (field: string) => {
    const validField = field as SortField;
    if (sortField === validField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(validField);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-aam-green/20 border border-aam-green rounded-lg p-4">
          <p className="text-sm text-green-800">Total Compras</p>
          <p className="text-2xl font-bold text-green-800">
            +{stats.purchasePoints} pts
          </p>
          <p className="text-xs text-green-800/80 mt-1">
            {counts.purchase} transacciones
          </p>
        </div>
        <div className="bg-aam-orange/10 border border-aam-orange/30 rounded-lg p-4">
          <p className="text-sm text-aam-orange">Total Canjes</p>
          <p className="text-2xl font-bold text-aam-orange">
            -{stats.redeemPoints} pts
          </p>
          <p className="text-xs text-aam-orange/80 mt-1">
            {counts.redeem} transacciones
          </p>
        </div>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600">Balance Neto</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.netPoints > 0 ? "+" : ""}
            {stats.netPoints} pts
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {counts.all} transacciones totales
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => handleFilterChange("all")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeFilter === "all"
                  ? "border-aam-wine text-aam-wine"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Todas ({counts.all})
          </button>
          <button
            onClick={() => handleFilterChange("purchase")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeFilter === "purchase"
                  ? "border-aam-wine text-aam-wine"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Compras ({counts.purchase})
          </button>
          <button
            onClick={() => handleFilterChange("redeem")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeFilter === "redeem"
                  ? "border-aam-wine text-aam-wine"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Canjes ({counts.redeem})
          </button>
        </nav>
      </div>

      {/* Contador dinámico */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {searchTerm || activeFilter !== "all"
            ? `${processedTransactions.length} de ${transactions.length} transacciones`
            : `${transactions.length} transacciones`}
        </p>
      </div>

      {/* Tabla */}
      <TransactionsTable
        transactions={paginatedTransactions}
        activeFilter={activeFilter}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-aam-wine rounded-lg hover:bg-aam-wine/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm font-medium text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-white bg-aam-wine rounded-lg hover:bg-aam-wine/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
