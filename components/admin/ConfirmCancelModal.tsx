"use client";

import { Modal } from "@/components/ui/Modal";
import { Transaction } from "@/types/transaction";
import { Button } from "../ui";

interface ConfirmCancelModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmCancelModal({
  isOpen,
  transaction,
  isLoading,
  onConfirm,
  onClose,
}: ConfirmCancelModalProps) {
  if (!transaction) return null;

  const user: { name?: string; email?: string } | null =
    typeof transaction.userID === "object"
      ? (transaction.userID as { name?: string; email?: string })
      : null;
  const prize = transaction.prize; // El premio viene populated en el campo 'prize'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CANCELAR PREMIO">
      <div className="p-8">
        <div className="space-y-3 mb-6">
          <p>
            ¿Estás seguro de que deseas cancelar este premio? Los puntos serán
            devueltos al cliente.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Cliente:</span>{" "}
              {user?.name || "Sin nombre"}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Premio:</span>{" "}
              {prize?.name || "Desconocido"}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Puntos a devolver:</span>{" "}
              {Math.abs(transaction.points)} pts
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-white border border-aam-orange/80 hover:text-aam-orange! font-clash-display "
            text={"Volver"}
          />
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 font-clash-display"
            text={isLoading ? "Procesando..." : "Cancelar Premio"}
          />
        </div>
      </div>
    </Modal>
  );
}
