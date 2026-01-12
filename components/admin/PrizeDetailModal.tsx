"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Prize } from "@/types/prize";
import { Button } from "../ui";

interface PrizeDetailModalProps {
  prize: Prize | null;
  isOpen: boolean;
  onClose: () => void;
  showTimestamps?: boolean;
}

export default function PrizeDetailModal({
  prize,
  isOpen,
  onClose,
  showTimestamps = true,
}: PrizeDetailModalProps) {
  if (!prize) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    return status === "available" ? "DISPONIBLE" : "NO DISPONIBLE";
  };

  const getStatusColor = (status: string) => {
    return status === "available" ? "text-green-600" : "text-gray-600";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DETALLE DEL PREMIO">
      <div className="p-6 space-y-4">
        {/* Imagen */}
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
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            NOMBRE
          </label>
          <p className="text-lg font-semibold text-gray-900 font-clash-display">
            {prize.name}
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            DESCRIPCIÓN
          </label>
          <p className="text-sm">{prize.description}</p>
        </div>

        {/* Puntos requeridos */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            PUNTOS REQUERIDOS
          </label>
          <div className="text-aam-orange">{prize.pointsRequired} pts</div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            ESTADO
          </label>
          <p
            className={`text-lg font-semibold font-clash-display ${getStatusColor(
              prize.status
            )}`}
          >
            {getStatusText(prize.status)}
          </p>
        </div>

        {/* Fechas */}
        {showTimestamps && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CREADO:</span>
              <span className="text-gray-900 font-medium">
                {formatDate(prize.createdAt)}
              </span>
            </div>
            {prize.updatedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ÚLTIMA ACTUALIZACIÓN:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(prize.updatedAt)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Botón cerrar */}
        <div className="pt-4">
          <Button
            className="w-full bg-white border border-aam-orange/40 hover:bg-aam-orange font-clash-display"
            onClick={onClose}
            text="Cerrar"
          />
        </div>
      </div>
    </Modal>
  );
}
