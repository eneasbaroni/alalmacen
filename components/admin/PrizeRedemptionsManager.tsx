"use client";

import { useState, useMemo } from "react";
import PrizeRedemptionsTable from "./PrizeRedemptionsTable";
import ConfirmCompleteModal from "./ConfirmCompleteModal";
import ConfirmCancelModal from "./ConfirmCancelModal";
import Snackbar from "@/components/common/Snackbar";
import { Transaction } from "@/types/transaction";
import { usePendingPrizeActions } from "@/hooks/usePendingPrizeActions";

interface PrizeRedemptionsManagerProps {
  transactions: Transaction[];
}

type TabType = "all" | "pending" | "completed" | "cancelled";

export default function PrizeRedemptionsManager({
  transactions,
}: PrizeRedemptionsManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const {
    selectedTransaction,
    actionType,
    isLoading,
    snackbarState,
    handleComplete,
    handleCancel,
    handleConfirm,
    handleCloseModal,
    closeSnackbar,
  } = usePendingPrizeActions();

  // Filtrar transacciones según el tab activo
  const filteredTransactions = useMemo(() => {
    if (activeTab === "all") return transactions;
    return transactions.filter((t) => t.status === activeTab);
  }, [transactions, activeTab]);

  // Contar transacciones por estado
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      pending: transactions.filter((t) => t.status === "pending").length,
      completed: transactions.filter((t) => t.status === "completed").length,
      cancelled: transactions.filter((t) => t.status === "cancelled").length,
    };
  }, [transactions]);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: counts.all },
    { key: "pending", label: "Pendientes", count: counts.pending },
    { key: "completed", label: "Completados", count: counts.completed },
    { key: "cancelled", label: "Cancelados", count: counts.cancelled },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.key
                    ? "border-aam-orange text-aam-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      <PrizeRedemptionsTable
        transactions={filteredTransactions}
        activeTab={activeTab}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />

      <ConfirmCompleteModal
        isOpen={actionType === "complete"}
        transaction={selectedTransaction}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onClose={handleCloseModal}
      />

      <ConfirmCancelModal
        isOpen={actionType === "cancel"}
        transaction={selectedTransaction}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onClose={handleCloseModal}
      />

      <Snackbar
        isOpen={snackbarState.show}
        onClose={closeSnackbar}
        message={snackbarState.message}
        type={snackbarState.type}
      />
    </>
  );
}
