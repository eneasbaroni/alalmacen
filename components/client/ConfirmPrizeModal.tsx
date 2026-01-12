"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Prize } from "@/types/prize";
import { Button } from "../ui";

interface ConfirmPrizeModalProps {
  prize: Prize | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (prize: Prize) => Promise<void>;
  userPoints: number;
}

export default function ConfirmPrizeModal({
  prize,
  isOpen,
  onClose,
  onConfirm,
  userPoints,
}: ConfirmPrizeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!prize) return null;

  const remainingPoints = userPoints - prize.pointsRequired;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(prize);
      // El modal se cierra desde el parent después del success
    } catch (error) {
      console.error("Error al confirmar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="CONFIRMAR ADQUISICIÓN">
      <div className="p-6 space-y-6">
        {/* Imagen del premio */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`/images/prizes/${prize.image}`}
              alt={prize.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 text-center">
              {prize.name}
            </h3>
            <p className="text-sm text-gray-600 text-center mt-1">
              {prize.description}
            </p>
          </div>

          {/* Resumen de puntos */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                TUS PUNTOS ACTUALES:
              </span>
              <span className="text-lg font-bold text-aam-orange">
                {userPoints}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">PUNTOS REQUERIDOS:</span>
              <span className="text-lg font-bold text-aam-wine">
                -{prize.pointsRequired}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                PUNTOS RESTANTES:
              </span>
              <span className="text-xl font-bold text-gray-900">
                {remainingPoints}
              </span>
            </div>
          </div>

          {/* Aviso */}
          <div className=" border border-aam-orange/30 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">
              🎁 <strong>Una vez confirmado</strong>, los puntos serán
              descontados y podrás retirar tu premio en el local.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 bg-white border border-aam-orange/80 hover:text-aam-orange! font-medium font-clash-display"
            text={"Cancelar"}
          />
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 font-clash-display"
            text={isSubmitting ? "Procesando..." : "Confirmar"}
          />
        </div>
      </div>
    </Modal>
  );
}
