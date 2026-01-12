"use client";

import { useState, useMemo } from "react";
import MyPrizesTable from "./MyPrizesTable";
import MyPrizeCard from "./MyPrizeCard";
import PrizeDetailModal from "@/components/admin/PrizeDetailModal";
import { Prize } from "@/types/prize";
import { Transaction } from "@/types/transaction";

interface MyPrizesManagerProps {
  transactions: Transaction[];
}

type TabType = "all" | "pending" | "completed";

export default function MyPrizesManager({
  transactions,
}: MyPrizesManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isPrizeDetailModalOpen, setIsPrizeDetailModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  // Filtrar transacciones según tab activo
  const filteredTransactions = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return transactions.filter((t) => t.status === "pending");
      case "completed":
        return transactions.filter((t) => t.status === "completed");
      default:
        return transactions;
    }
  }, [transactions, activeTab]);

  // Contar por estado
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      pending: transactions.filter((t) => t.status === "pending").length,
      completed: transactions.filter((t) => t.status === "completed").length,
    };
  }, [transactions]);

  const handleViewDetail = (prize: Prize) => {
    setSelectedPrize(prize);
    setIsPrizeDetailModalOpen(true);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-4 md:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === "all"
                    ? "border-aam-orange text-aam-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
          >
            Todos ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === "pending"
                    ? "border-aam-orange text-aam-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
          >
            Pendientes ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === "completed"
                    ? "border-aam-orange text-aam-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
          >
            Retirados ({counts.completed})
          </button>
        </nav>
      </div>

      {/* Desktop: Tabla */}
      <div className="hidden md:block">
        <MyPrizesTable
          transactions={filteredTransactions}
          activeTab={activeTab}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <MyPrizeCard
              key={transaction._id}
              transaction={transaction}
              onViewDetail={handleViewDetail}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              NO HAY PREMIOS EN ESTA CATEGORÍA
            </h3>
            <p className="text-sm text-gray-600">
              {activeTab === "pending" && "NO TIENES PREMIOS PENDIENTES"}
              {activeTab === "completed" && "NO HAS RETIRADO PREMIOS AÚN"}
              {activeTab === "all" && "NO HAS ADQUIRIDO PREMIOS TODAVÍA"}
            </p>
          </div>
        )}
      </div>

      {/* Modal detalle */}
      <PrizeDetailModal
        prize={selectedPrize}
        isOpen={isPrizeDetailModalOpen}
        onClose={() => setIsPrizeDetailModalOpen(false)}
        showTimestamps={false}
      />
    </div>
  );
}
