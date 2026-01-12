"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/transaction";

type ActionType = "complete" | "cancel";

interface UsePendingPrizeActionsReturn {
  selectedTransaction: Transaction | null;
  actionType: ActionType | null;
  isLoading: boolean;
  snackbarState: {
    show: boolean;
    message: string;
    type: "success" | "error";
  };
  handleComplete: (transaction: Transaction) => void;
  handleCancel: (transaction: Transaction) => void;
  handleConfirm: () => Promise<void>;
  handleCloseModal: () => void;
  closeSnackbar: () => void;
}

/**
 * Hook personalizado para manejar las acciones de premios pendientes
 * Encapsula toda la lógica de estado y llamadas a API
 */
export function usePendingPrizeActions(): UsePendingPrizeActionsReturn {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const router = useRouter();

  const handleComplete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setActionType("complete");
  };

  const handleCancel = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setActionType("cancel");
  };

  const handleConfirm = async () => {
    if (!selectedTransaction || !actionType) return;

    setIsLoading(true);

    try {
      const endpoint = `/api/transactions/${selectedTransaction._id}/${actionType}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar la solicitud");
      }

      setSnackbarState({
        show: true,
        message:
          actionType === "complete"
            ? "Premio entregado exitosamente"
            : "Premio cancelado y puntos devueltos",
        type: "success",
      });

      setSelectedTransaction(null);
      setActionType(null);
      router.refresh();
    } catch (error) {
      setSnackbarState({
        show: true,
        message:
          error instanceof Error
            ? error.message
            : "Error al procesar la acción",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setSelectedTransaction(null);
      setActionType(null);
    }
  };

  const closeSnackbar = () => {
    setSnackbarState((prev) => ({ ...prev, show: false }));
  };

  return {
    selectedTransaction,
    actionType,
    isLoading,
    snackbarState,
    handleComplete,
    handleCancel,
    handleConfirm,
    handleCloseModal,
    closeSnackbar,
  };
}
